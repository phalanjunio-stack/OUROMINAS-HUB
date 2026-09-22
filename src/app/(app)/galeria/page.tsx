import { prisma } from "@/lib/prisma";
import { GalleryGrid } from "@/components/galeria/GalleryGrid";

export default async function GaleriaPage() {
  const files = await prisma.mediaFile.findMany({
    include: { campaign: { select: { name: true } }, uploadedBy: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return <GalleryGrid files={files} />;
}
