export type OrderStatus =
  | "EN_ATTENTE"
  | "PAYEE"
  | "PREPARATION"
  | "EXPEDIEE"
  | "LIVREE"
  | "ANNULEE"
  | "REMBOURSEE";

export interface MockOrderItem {
  productName: string;
  imageUrl: string;
  size: number;
  color: string;
  quantity: number;
  unitPrice: number;
}

export interface MockOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: OrderStatus;
  items: MockOrderItem[];
  shippingAddress: string;
  paymentMethod: string;
  createdAt: string;
}

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "EN_ATTENTE",
  "PAYEE",
  "PREPARATION",
  "EXPEDIEE",
  "LIVREE",
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  EN_ATTENTE: "En attente",
  PAYEE: "Payée",
  PREPARATION: "Préparation",
  EXPEDIEE: "Expédiée",
  LIVREE: "Livrée",
  ANNULEE: "Annulée",
  REMBOURSEE: "Remboursée",
};

// TODO : remplacer par un appel à services/orders.ts → /api/admin/orders (Prisma, table Order + OrderItem)
export const MOCK_ORDERS: MockOrder[] = [
  {
    id: "o1",
    orderNumber: "RHO-84213590",
    customerName: "Aïcha Koné",
    customerEmail: "aicha.kone@example.com",
    customerPhone: "07 01 23 45 67",
    status: "EN_ATTENTE",
    items: [
      { productName: "Aero Runner 01", imageUrl: "/images/products/aero-runner-01.jpg", size: 40, color: "Bleu RHO", quantity: 1, unitPrice: 65000 },
      { productName: "Trainer Grip W", imageUrl: "/images/products/trainer-grip-w.jpg", size: 38, color: "Gris ardoise", quantity: 1, unitPrice: 2500 },
    ],
    shippingAddress: "Riviera Palmeraie, Abidjan, Côte d'Ivoire",
    paymentMethod: "Orange Money",
    createdAt: "2026-08-01T09:12:00Z",
  },
  {
    id: "o2",
    orderNumber: "RHO-84209981",
    customerName: "Moussa Diabaté",
    customerEmail: "moussa.diabate@example.com",
    customerPhone: "05 09 87 65 43",
    status: "EN_ATTENTE",
    items: [
      { productName: "Swift Pace 02", imageUrl: "/images/products/swift-pace-02.jpg", size: 43, color: "Noir", quantity: 1, unitPrice: 78000 },
    ],
    shippingAddress: "Cocody Angré, Abidjan, Côte d'Ivoire",
    paymentMethod: "Wave",
    createdAt: "2026-08-01T08:03:00Z",
  },
  {
    id: "o3",
    orderNumber: "RHO-84172233",
    customerName: "Yao Kouassi",
    customerEmail: "yao.kouassi@example.com",
    customerPhone: "01 22 33 44 55",
    status: "PREPARATION",
    items: [
      { productName: "Trainer Grip W", imageUrl: "/images/products/trainer-grip-w.jpg", size: 37, color: "Bleu RHO", quantity: 2, unitPrice: 61000 },
    ],
    shippingAddress: "Bouaké, Vallée du Bandama, Côte d'Ivoire",
    paymentMethod: "MTN Money",
    createdAt: "2026-07-30T14:20:00Z",
  },
  {
    id: "o4",
    orderNumber: "RHO-84150098",
    customerName: "Awa Traoré",
    customerEmail: "awa.traore@example.com",
    customerPhone: "07 44 55 66 77",
    status: "EXPEDIEE",
    items: [
      { productName: "City Walk W", imageUrl: "/images/products/city-walk-w.jpg", size: 39, color: "Blanc", quantity: 1, unitPrice: 49000 },
    ],
    shippingAddress: "Yopougon, Abidjan, Côte d'Ivoire",
    paymentMethod: "Virement bancaire",
    createdAt: "2026-07-29T11:05:00Z",
  },
  {
    id: "o5",
    orderNumber: "RHO-84098211",
    customerName: "Kader Ouattara",
    customerEmail: "kader.ouattara@example.com",
    customerPhone: "01 90 80 70 60",
    status: "LIVREE",
    items: [
      { productName: "Classic Court", imageUrl: "/images/products/classic-court.jpg", size: 42, color: "Blanc", quantity: 1, unitPrice: 45000 },
    ],
    shippingAddress: "Marcory, Abidjan, Côte d'Ivoire",
    paymentMethod: "Espèces à la livraison",
    createdAt: "2026-07-25T10:00:00Z",
  },
];
