import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/server/db/client";
import { z } from "zod";

const metricSchema = z.object({
  impressions: z.number().int().min(0).default(0),
  clicks: z.number().int().min(0).default(0),
  spend: z.number().min(0).default(0),
  conversions: z.number().int().min(0).optional(),
  date: z.string().min(1, "Date is required"),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: campaignId } = await params;

  // Verify campaign belongs to this user
  const campaign = await prisma.campaign.findFirst({
    where: {
      id: campaignId,
      client: { workspace: { user: { clerkUserId: userId } } },
    },
  });
  if (!campaign) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  const body = await req.json();
  const parsed = metricSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { date, impressions, clicks, spend, conversions } = parsed.data;
  const dateObj = new Date(date);

  try {
    const metric = await prisma.metric.upsert({
      where: { campaignId_date: { campaignId, date: dateObj } },
      update: { impressions, clicks, spend, conversions },
      create: { campaignId, date: dateObj, impressions, clicks, spend, conversions },
    });

    return NextResponse.json({ metric }, { status: 201 });
  } catch (error) {
    console.error("Metric upsert error:", error);
    return NextResponse.json({ error: "Failed to save metric" }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: campaignId } = await params;

  try {
    const metrics = await prisma.metric.findMany({
      where: { campaignId },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(metrics, { status: 200 });
  } catch (error) {
    console.error("Fetch metrics error:", error);
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 });
  }
}
