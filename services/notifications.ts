import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface MyNotification {
  id: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

export function useMyNotifications() {
  return useQuery({
    queryKey: ["my-notifications"],
    queryFn: async () => {
      const res = await fetch("/api/notifications");
      if (!res.ok) return [] as MyNotification[];
      const data = await res.json();
      return data.notifications as MyNotification[];
    },
    refetchInterval: 60 * 1000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/notifications/${id}`, { method: "PATCH" });
      if (!res.ok) throw new Error("Impossible de marquer comme lue.");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-notifications"] }),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/notifications/read-all", { method: "PATCH" });
      if (!res.ok) throw new Error("Impossible de marquer comme lues.");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-notifications"] }),
  });
}
