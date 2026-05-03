import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/server/db/client";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ hasDemoWorkspace: false }, { status: 200 });
  }

  const user = await prisma.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) {
    return NextResponse.json({ hasDemoWorkspace: false }, { status: 200 });
  }

  const demoWorkspace = await prisma.workspace.findFirst({
    where: { userId: user.id, isDemo: true },
  });

  return NextResponse.json({ hasDemoWorkspace: !!demoWorkspace }, { status: 200 });
}
