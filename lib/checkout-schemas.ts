import { z } from "zod";

export const addressSchema = z.object({
  fullName: z.string().min(2, "Nom complet requis"),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
  line1: z.string().min(3, "Adresse requise"),
  line2: z.string().optional(),
  city: z.string().min(2, "Ville requise"),
  region: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().min(2, "Pays requis"),
});
export type AddressFormValues = z.infer<typeof addressSchema>;

export const deliverySchema = z.object({
  method: z.enum(["standard", "express"]),
});
export type DeliveryFormValues = z.infer<typeof deliverySchema>;

export const paymentSchema = z
  .object({
    method: z.enum(["orange_money", "mtn_money", "wave", "virement", "especes"]),
    transactionReference: z.string().optional(),
  })
  .refine(
    (data) => data.method === "especes" || (data.transactionReference?.length ?? 0) >= 4,
    {
      message: "Indiquez la référence de la transaction pour que nous puissions la valider.",
      path: ["transactionReference"],
    }
  );
export type PaymentFormValues = z.infer<typeof paymentSchema>;
