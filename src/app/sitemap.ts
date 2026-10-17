import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.SITE_URL ?? "http://localhost:3000";
  let products: { slug: string; updatedAt: Date }[] = [];
  try {
    products = await db.product.findMany({ where: { status: "ACTIVE" }, select: { slug: true, updatedAt: true } });
  } catch {}
  return [{ url: site }, ...products.map((p) => ({ url: `${site}/product/${p.slug}`, lastModified: p.updatedAt }))];
}
