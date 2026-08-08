"use client";

import { useQuery } from "@tanstack/react-query";
import { IconMail, IconDeviceMobile, IconBellRinging, IconBrandWhatsapp, IconInfoCircle } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface AdminNotification {
  id: string;
  customerName: string;
  channel: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

const CHANNEL_ICON: Record<string, typeof IconMail> = {
  EMAIL: IconMail,
  SMS: IconDeviceMobile,
  PUSH: IconBellRinging,
  WHATSAPP: IconBrandWhatsapp,
  IN_APP: IconBellRinging,
};

export default function AdminNotificationsPage() {
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["admin", "notifications"],
    queryFn: async () => {
      const res = await fetch("/api/admin/notifications");
      if (!res.ok) throw new Error("Chargement impossible.");
      const data = await res.json();
      return data.notifications as AdminNotification[];
    },
  });

  return (
    <div>
      <div className="flex items-start gap-3 rounded-2xl border border-yvann-gold-600/30 bg-yvann-gold-600/5 p-4 text-sm text-text-muted">
        <IconInfoCircle size={18} className="mt-0.5 shrink-0 text-yvann-gold-700" />
        <p>
          Cette page affiche l'historique des notifications envoyées aux clients (dans l'app pour
          l'instant). L'envoi réel par e-mail, SMS ou WhatsApp nécessite de connecter un service
          externe (ex. Resend pour l'e-mail) — pas encore configuré.
        </p>
      </div>

      <div className="mt-6 space-y-2">
        {isLoading ? (
          <p className="text-text-muted">Chargement...</p>
        ) : !notifications || notifications.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 py-10 text-center text-text-muted dark:border-slate-700">
            Aucune notification envoyée pour l'instant.
          </p>
        ) : (
          notifications.map((n) => {
            const Icon = CHANNEL_ICON[n.channel] ?? IconBellRinging;
            return (
              <div
                key={n.id}
                className={cn(
                  "flex items-start gap-3 rounded-2xl border p-4",
                  n.isRead ? "border-slate-200 dark:border-slate-800" : "border-yvann-gold-600/30 bg-yvann-gold-600/5"
                )}
              >
                <Icon size={18} className="mt-0.5 shrink-0 text-yvann-gold-700" />
                <div className="min-w-0 flex-1">
                  <p className="break-words text-sm font-medium text-text">{n.title}</p>
                  <p className="break-words text-sm text-text-muted">{n.body}</p>
                  <p className="mt-1 text-xs text-text-muted">
                    {n.customerName} · {n.channel} ·{" "}
                    {new Date(n.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
