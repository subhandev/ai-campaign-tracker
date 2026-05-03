import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/server/db/client";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ exists: false, seeded: false, cleared: false }, { status: 200 });
  }

  const user = await prisma.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) {
    return NextResponse.json({ exists: false, seeded: false, cleared: false }, { status: 200 });
  }

  if (user.demoClearedAt) {
    return NextResponse.json({ exists: false, seeded: false, cleared: true }, { status: 200 });
  }

  const demoWorkspace = await prisma.workspace.findFirst({
    where: { userId: user.id, isDemo: true },
  });

  const clientCount = demoWorkspace
    ? await prisma.client.count({ where: { workspaceId: demoWorkspace.id } })
    : 0;

  const fullySeeded = !!demoWorkspace?.seededAt && clientCount >= 5;

  return NextResponse.json(
    {
      exists: !!demoWorkspace,
      seeded: fullySeeded,
      cleared: false,
    },
    { status: 200 }
  );
}
