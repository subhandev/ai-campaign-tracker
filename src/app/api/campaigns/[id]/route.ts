import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  handleGetCampaign,
  handleUpdateCampaign,
  handleDeleteCampaign,
} from "@/server/campaigns/campaigns.handler";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  const { id } = await params;
  return handleGetCampaign(id, userId);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  const { id } = await params;
  return handleUpdateCampaign(req, id, userId);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  const { id } = await params;
  return handleDeleteCampaign(id, userId);
}
