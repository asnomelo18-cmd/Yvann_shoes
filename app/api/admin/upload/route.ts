import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { requireSection } from "@/lib/session";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as HandleUploadBody;

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        // Vérifie que la personne a le droit de gérer les produits AVANT de
        // délivrer un jeton d'upload — sans ça n'importe qui pourrait uploader
        // des fichiers vers notre espace de stockage.
        const admin = await requireSection("produits");
        if (!admin) {
          throw new Error("Accès refusé.");
        }
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
          addRandomSuffix: true,
          maximumSizeInBytes: 8 * 1024 * 1024, // 8 Mo par photo
        };
      },
      onUploadCompleted: async () => {
        // Rien à faire ici : l'URL est renvoyée directement au client, qui
        // l'attache au produit lors de l'enregistrement du formulaire.
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Erreur /api/admin/upload :", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload impossible." },
      { status: 400 }
    );
  }
}
