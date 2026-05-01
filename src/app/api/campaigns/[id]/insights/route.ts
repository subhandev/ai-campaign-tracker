import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/server/db/client";
import { openai } from "@/lib/openai";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Get campaign with client info
  const campaign = await prisma.campaign.findFirst({
    where: {
      id,
      client: {
        workspace: {
          user: { clerkUserId: userId },
        },
      },
    },
    include: {
      client: {
        select: { name: true, industry: true },
      },
      metrics: {
        orderBy: { date: "desc" },
        take: 5,
      },
    },
  });

  if (!campaign) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  // Build context for OpenAI
  const metricsContext =
    campaign.metrics.length > 0
      ? `Recent metrics: ${campaign.metrics
          .map(
            (m) =>
              `Impressions: ${m.impressions}, Clicks: ${m.clicks}, Spend: $${m.spend}, Conversions: ${m.conversions ?? 0}`
          )
          .join(" | ")}`
      : "No metrics data available yet.";

  const prompt = `
You are an expert marketing campaign analyst. Analyze the following campaign and provide actionable insights.

Campaign: ${campaign.name}
Client: ${campaign.client?.name ?? "Unknown"}
Industry: ${campaign.client?.industry ?? "Unknown"}
Platform: ${campaign.platform}
Status: ${campaign.status}
Goal: ${campaign.goal ?? "Not specified"}
Start Date: ${campaign.startDate ?? "Not set"}
End Date: ${campaign.endDate ?? "Not set"}
Deadline: ${campaign.deadline ?? "Not set"}
Description: ${campaign.description ?? "Not provided"}
${metricsContext}

Provide exactly 3 insights in the following JSON format only, no extra text:
{
  "insights": [
    {
      "type": "performance" | "recommendation" | "risk",
      "title": "short title max 6 words",
      "content": "2-3 sentence actionable insight",
      "score": 0.0 to 1.0
    }
  ]
}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const raw = completion.choices[0].message.content ?? "{}";
    const parsed = JSON.parse(raw);
    const insights = parsed.insights ?? [];

    // Delete old insights and save new ones
    await prisma.insight.deleteMany({ where: { campaignId: id } });

    const saved = await prisma.insight.createMany({
      data: insights.map((insight: any) => ({
        campaignId: id,
        type: insight.type,
        content: `${insight.title}: ${insight.content}`,
        score: insight.score,
      })),
    });

    // Return fresh insights
    const freshInsights = await prisma.insight.findMany({
      where: { campaignId: id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ insights: freshInsights }, { status: 200 });
  } catch (error) {
    console.error("OpenAI error:", error);
    return NextResponse.json(
      { error: "Failed to generate insights" },
      { status: 500 }
    );
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

  const { id } = await params;

  const insights = await prisma.insight.findMany({
    where: { campaignId: id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ insights }, { status: 200 });
}