"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { Stepper, type StepperStep } from "@/components/forms/Stepper";
import { AddressStep } from "@/components/checkout/steps/AddressStep";
import { DeliveryStep } from "@/components/checkout/steps/DeliveryStep";
import { PaymentStep } from "@/components/checkout/steps/PaymentStep";
import { ConfirmationStep } from "@/components/checkout/steps/ConfirmationStep";
import type {
  AddressFormValues,
  DeliveryFormValues,
  PaymentFormValues,
} from "@/lib/checkout-schemas";
import { useCartStore } from "@/store/cart-store";
import { useCreateOrder } from "@/services/orders";
import { useSession } from "@/services/auth";

const STEPS: StepperStep[] = [
  { key: "adresse", label: "Adresse" },
  { key: "livraison", label: "Livraison" },
  { key: "paiement", label: "Paiement" },
  { key: "confirmation", label: "Confirmation" },
];

const DELIVERY_PRICE = { standard: 2500, express: 6000 };

export default function CheckoutPage() {
  const router = useRouter();
  const lines = useCartStore((s) => s.lines);
  const subtotal = useCartStore((s) => s.subtotal());
  const clearCart = useCartStore((s) => s.clear);
  const { data: session, isLoading: sessionLoading } = useSession();
  const createOrder = useCreateOrder();

  const [stepIndex, setStepIndex] = useState(0);
  const [address, setAddress] = useState<AddressFormValues | null>(null);
  const [delivery, setDelivery] = useState<DeliveryFormValues | null>(null);
  const [payment, setPayment] = useState<PaymentFormValues | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [snapshotLines] = useState(lines);

  if (!sessionLoading && !session && stepIndex < 3) {
    return (
      <div className="mx-auto max-w-xl px-4 pb-20 pt-32 text-center">
        <p className="text-text-muted">Connectez-vous pour finaliser votre commande.</p>
        <button
          onClick={() => router.push("/connexion?next=/checkout")}
          className="mt-4 rounded-full bg-yvann-gold-600 px-6 py-3 text-sm font-semibold text-white"
        >
          Se connecter
        </button>
      </div>
    );
  }

  if (lines.length === 0 && stepIndex < 3) {
    return (
      <div className="mx-auto max-w-xl px-4 pb-20 pt-32 text-center">
        <p className="text-text-muted">Votre panier est vide.</p>
        <button
          onClick={() => router.push("/boutique")}
          className="mt-4 rounded-full bg-yvann-gold-600 px-6 py-3 text-sm font-semibold text-white"
        >
          Aller à la boutique
        </button>
      </div>
    );
  }

  async function handlePaymentSubmit(values: PaymentFormValues) {
    if (!address || !delivery) return;
    try {
      const result = await createOrder.mutateAsync({
        items: lines.map((l) => ({ variantId: l.variantId, quantity: l.quantity })),
        address,
        deliveryMethod: delivery.method,
        payment: {
          method: values.method.toUpperCase() as any,
          transactionReference: values.transactionReference,
        },
      });
      setPayment(values);
      setOrderNumber(result.order.orderNumber);
      clearCart();
      setStepIndex(3);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Impossible de créer la commande.");
    }
  }

  const total = subtotal + (delivery ? DELIVERY_PRICE[delivery.method] : 0);

  return (
    <div className="mx-auto max-w-4xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-text">Commander</h1>

      <div className="mt-10">
        <Stepper steps={STEPS} currentIndex={stepIndex} />
      </div>

      <div className="mt-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2 }}
          >
            {stepIndex === 0 && (
              <AddressStep
                defaultValues={address ?? { country: "Côte d'Ivoire" }}
                onNext={(values) => {
                  setAddress(values);
                  setStepIndex(1);
                }}
              />
            )}
            {stepIndex === 1 && (
              <DeliveryStep
                defaultValues={delivery ?? {}}
                onNext={(values) => {
                  setDelivery(values);
                  setStepIndex(2);
                }}
                onBack={() => setStepIndex(0)}
              />
            )}
            {stepIndex === 2 && (
              <PaymentStep
                defaultValues={payment ?? {}}
                totalDue={subtotal + (delivery ? DELIVERY_PRICE[delivery.method] : 0)}
                onNext={handlePaymentSubmit}
                onBack={() => setStepIndex(1)}
              />
            )}
            {stepIndex === 3 && address && delivery && payment && orderNumber && (
              <ConfirmationStep
                orderNumber={orderNumber}
                address={address}
                delivery={delivery}
                payment={payment}
                lines={snapshotLines}
                total={total}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
