import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const GOLD = "#96741F";
const INK = "#0A0A0B";
const MUTED = "#5C5C63";
const BORDER = "#D9D9DC";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, color: INK, fontFamily: "Helvetica" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30 },
  shopName: { fontSize: 18, fontWeight: 700, color: INK },
  shopMeta: { fontSize: 9, color: MUTED, marginTop: 2 },
  invoiceTitle: { fontSize: 14, fontWeight: 700, color: GOLD, textAlign: "right" },
  invoiceMeta: { fontSize: 9, color: MUTED, textAlign: "right", marginTop: 2 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 9, color: MUTED, marginBottom: 4, textTransform: "uppercase" },
  row: { flexDirection: "row", justifyContent: "space-between" },
  table: { marginTop: 10, borderTop: `1px solid ${BORDER}` },
  tableHeader: {
    flexDirection: "row",
    borderBottom: `1px solid ${BORDER}`,
    paddingVertical: 6,
    color: MUTED,
    fontSize: 9,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: `1px solid ${BORDER}`,
    paddingVertical: 8,
  },
  colName: { flex: 3 },
  colQty: { flex: 1, textAlign: "center" },
  colPrice: { flex: 1, textAlign: "right" },
  totals: { marginTop: 16, alignItems: "flex-end" },
  totalRow: { flexDirection: "row", width: 200, justifyContent: "space-between", marginBottom: 4 },
  totalLabel: { color: MUTED },
  grandTotal: {
    flexDirection: "row",
    width: 200,
    justifyContent: "space-between",
    marginTop: 6,
    paddingTop: 6,
    borderTop: `1px solid ${BORDER}`,
    fontWeight: 700,
    fontSize: 12,
  },
  footer: { marginTop: 40, fontSize: 8, color: MUTED, textAlign: "center" },
});

function formatPrice(value: number, currency: string) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

interface InvoiceProps {
  order: {
    orderNumber: string;
    createdAt: string;
    subtotal: number;
    shippingCost: number;
    discountAmount: number;
    total: number;
    currency: string;
    items: { name: string; size: number; color: string; quantity: number; unitPrice: number }[];
    customerName: string;
    customerEmail: string;
    shippingAddress: { fullName: string; line1: string; line2: string | null; city: string; country: string };
    paymentMethod: string | null;
  };
  shop: { name: string; legalName: string; email: string; phone: string };
}

export function InvoiceDocument({ order, shop }: InvoiceProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.shopName}>{shop.name}</Text>
            {shop.legalName && <Text style={styles.shopMeta}>{shop.legalName}</Text>}
            {shop.email && <Text style={styles.shopMeta}>{shop.email}</Text>}
            {shop.phone && <Text style={styles.shopMeta}>{shop.phone}</Text>}
          </View>
          <View>
            <Text style={styles.invoiceTitle}>FACTURE</Text>
            <Text style={styles.invoiceMeta}>N° {order.orderNumber}</Text>
            <Text style={styles.invoiceMeta}>
              {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Text>
          </View>
        </View>

        <View style={[styles.row, styles.section]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>Facturé à</Text>
            <Text>{order.customerName}</Text>
            <Text style={styles.shopMeta}>{order.customerEmail}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>Livré à</Text>
            <Text>{order.shippingAddress.fullName}</Text>
            <Text style={styles.shopMeta}>
              {order.shippingAddress.line1}
              {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""}
            </Text>
            <Text style={styles.shopMeta}>
              {order.shippingAddress.city}, {order.shippingAddress.country}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>Paiement</Text>
            <Text>{order.paymentMethod ?? "—"}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colName}>Article</Text>
            <Text style={styles.colQty}>Qté</Text>
            <Text style={styles.colPrice}>Prix unit.</Text>
            <Text style={styles.colPrice}>Total</Text>
          </View>
          {order.items.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.colName}>
                {item.name} — Pointure {item.size}, {item.color}
              </Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colPrice}>{formatPrice(item.unitPrice, order.currency)}</Text>
              <Text style={styles.colPrice}>{formatPrice(item.unitPrice * item.quantity, order.currency)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Sous-total</Text>
            <Text>{formatPrice(order.subtotal, order.currency)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Livraison</Text>
            <Text>{formatPrice(order.shippingCost, order.currency)}</Text>
          </View>
          {order.discountAmount > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Réduction</Text>
              <Text>-{formatPrice(order.discountAmount, order.currency)}</Text>
            </View>
          )}
          <View style={styles.grandTotal}>
            <Text>Total</Text>
            <Text>{formatPrice(order.total, order.currency)}</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          {shop.name} — Merci pour votre confiance. Cette facture a été générée automatiquement.
        </Text>
      </Page>
    </Document>
  );
}
