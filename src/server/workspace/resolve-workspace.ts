import { prisma } from "@/server/db/client";

// For listing: demo workspace until explicitly cleared, then real workspace.
export async function resolveWorkspaceId(clerkUserId: string): Promise<string | null> {
  const user = await prisma.user.findUnique({ where: { clerkUserId } });
  if (!user) return null;

  if (!user.demoClearedAt) {
    const demo = await prisma.workspace.findFirst({
      where: { userId: user.id, isDemo: true },
      orderBy: { createdAt: "asc" },
    });
    if (demo) return demo.id;
  }

  const real = await prisma.workspace.findFirst({
    where: { userId: user.id, isDemo: false },
    orderBy: { createdAt: "asc" },
  });
  return real?.id ?? null;
}

// For write operations: always the real workspace.
export async function getRealWorkspaceId(clerkUserId: string): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { clerkUserId },
    include: {
      workspaces: {
        where: { isDemo: false },
        orderBy: { createdAt: "asc" },
        take: 1,
      },
    },
  });
  return user?.workspaces[0]?.id ?? null;
}
