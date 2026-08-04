export type PaymentStatus = "EN_ATTENTE" | "VALIDE" | "ECHOUE" | "REMBOURSE";
export type PaymentMethod = "ORANGE_MONEY" | "MTN_MONEY" | "WAVE" | "VIREMENT" | "ESPECES";

export interface MockOrderPayment {
  id: string;
  orderNumber: string;
  customerName: string;
  amount: number;
  method: PaymentMethod;
  transactionReference: string | null;
  status: PaymentStatus;
  createdAt: string;
}

// TODO : remplacer par un appel à services/payments.ts → /api/admin/payments (Prisma, table Payment)
export const MOCK_PAYMENTS: MockOrderPayment[] = [
  {
    id: "p1",
    orderNumber: "YV-84213590",
    customerName: "Aïcha Koné",
    amount: 67500,
    method: "ORANGE_MONEY",
    transactionReference: "OM240912X7",
    status: "EN_ATTENTE",
    createdAt: "2026-08-01T09:12:00Z",
  },
  {
    id: "p2",
    orderNumber: "YV-84209981",
    customerName: "Moussa Diabaté",
    amount: 84000,
    method: "WAVE",
    transactionReference: "WV9981234",
    status: "EN_ATTENTE",
    createdAt: "2026-08-01T08:03:00Z",
  },
  {
    id: "p3",
    orderNumber: "YV-84190213",
    customerName: "Fatou Sanogo",
    amount: 45000,
    method: "ESPECES",
    transactionReference: null,
    status: "EN_ATTENTE",
    createdAt: "2026-07-31T17:44:00Z",
  },
  {
    id: "p4",
    orderNumber: "YV-84172233",
    customerName: "Yao Kouassi",
    amount: 72000,
    method: "MTN_MONEY",
    transactionReference: "MM77213890",
    status: "VALIDE",
    createdAt: "2026-07-30T14:20:00Z",
  },
  {
    id: "p5",
    orderNumber: "YV-84150098",
    customerName: "Awa Traoré",
    amount: 58000,
    method: "VIREMENT",
    transactionReference: "VIR2026-0731-04",
    status: "ECHOUE",
    createdAt: "2026-07-29T11:05:00Z",
  },
];
