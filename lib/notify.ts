import { prisma } from "@/lib/prisma";

export async function createNotification(params: {
  userId: string;
  type: string;
  title: string;
  body: string;
}) {
  try {
    await prisma.notification.create({
      data: {
        userId: params.userId,
        channel: "IN_APP",
        type: params.type,
        title: params.title,
        body: params.body,
      },
    });
  } catch (error) {
    // Une notification manquée ne doit jamais faire échouer l'action principale
    console.error("Erreur création notification :", error);
  }
}
