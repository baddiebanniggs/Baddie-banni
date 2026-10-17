// DEVELOPMENT SAMPLE DATA ONLY. Every row is flagged isPlaceholder. Never run on a live store.
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
if (process.env.NODE_ENV === "production") throw new Error("Refusing to seed in production.");
const items = [
  ["sample-slip-dress", "SAMPLE Slip dress", 249900, null, "READY_STOCK"],
  ["sample-co-ord", "SAMPLE Co-ord set", 349900, 299900, "MADE_TO_ORDER"],
] as const;
for (const [slug, title, basePrice, salePrice, type] of items) {
  await db.product.upsert({
    where: { slug }, update: {},
    create: { slug, title, basePrice, salePrice, type, status: "ACTIVE", isPlaceholder: true,
      productionDaysMin: type === "MADE_TO_ORDER" ? 10 : null, productionDaysMax: type === "MADE_TO_ORDER" ? 14 : null,
      variants: { create: ["S", "M", "L"].map((size) => ({ sku: `${slug}-${size}`.toUpperCase(), size, colour: "Black", stock: 5 })) } },
  });
}
console.log("Sample data loaded.");
await db.$disconnect();
