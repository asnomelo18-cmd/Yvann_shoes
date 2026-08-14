"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { IconArrowLeft, IconBell, IconBellRinging } from "@tabler/icons-react";
import { useSession } from "@/services/auth";
import { useMyNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from "@/services/notifications";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const router = useRouter();
  const { data: session, isLoading: sessionLoading } = useSession();
  const { data: notifications, isLoading } = useMyNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  if (!sessionLoading && !session) {
    router.push("/connexion?next=/compte/notifications");
    return null;
  }

  const unreadCount = notifications?.filter((n) => !n.isRead).length ?? 0;

  return (
    <div className="mx-auto max-w-2xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <Link href="/compte" className="flex items-center gap-1 text-sm text-text-muted hover:text-text">
        <IconArrowLeft size={15} /> Retour au compte
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight text-text">Notifications</h1>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllRead.mutate()}
            className="text-sm font-medium text-yvann-gold-700 hover:underline"
          >
            Tout marquer comme lu
          </button>
        )}
      </div>

      <div className="mt-8 space-y-2">
        {isLoading ? (
          <p className="text-text-muted">Chargement...</p>
        ) : !notifications || notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <IconBell size={32} className="text-text-muted" />
            <p className="text-text-muted">Aucune notification pour l'instant.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => !n.isRead && markRead.mutate(n.id)}
              className={cn(
                "flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-colors",
                n.isRead
                  ? "border-slate-200 dark:border-slate-800"
                  : "border-yvann-gold-600/30 bg-yvann-gold-600/5"
              )}
            >
              <IconBellRinging
                size={18}
                className={cn("mt-0.5 shrink-0", n.isRead ? "text-text-muted" : "text-yvann-gold-600")}
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-text">{n.title}</p>
                <p className="text-sm text-text-muted">{n.body}</p>
                <p className="mt-1 text-xs text-text-muted">
                  {new Date(n.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              {!n.isRead && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-yvann-gold-600" />}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
