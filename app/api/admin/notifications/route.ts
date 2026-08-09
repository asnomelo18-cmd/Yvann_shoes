import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSection } from "@/lib/session";

export async function GET() {
  const admin = await requireSection("notifications");
  if (!admin) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const notifications = await prisma.notification.findMany({
    include: { user: { select: { firstName: true, lastName: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json({
    notifications: notifications.map((n) => ({
      id: n.id,
      customerName: `${n.user.firstName ?? ""} ${n.user.lastName ?? ""}`.trim() || n.user.email,
      channel: n.channel,
      type: n.type,
      title: n.title,
      body: n.body,
      isRead: n.isRead,
      createdAt: n.createdAt,
    })),
  });
}
