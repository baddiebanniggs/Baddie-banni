// Server-side pricing. All amounts are integer paise. The browser never supplies totals.
export type Line = { unitPrice: number; quantity: number; productId: string };
export type Rule = {
  kind: "PERCENT" | "FIXED";
  value: number;
  maxDiscount?: number | null;
  minOrder?: number | null;
  productIds?: string[];
  excludedProductIds?: string[];
  startsAt?: Date | null;
  endsAt?: Date | null;
  active: boolean;
};
export type ShippingConfig = { freeAbove: number; fee: number };

export function discountFor(lines: Line[], rule: Rule, now = new Date()): number {
  if (!rule.active) return 0;
  if (rule.startsAt && now < rule.startsAt) return 0;
  if (rule.endsAt && now > rule.endsAt) return 0;
  const eligible = lines.filter(
    (l) =>
      !(rule.excludedProductIds ?? []).includes(l.productId) &&
      (!rule.productIds?.length || rule.productIds.includes(l.productId)),
  );
  const base = eligible.reduce((s, l) => s + l.unitPrice * l.quantity, 0);
  const whole = lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0);
  if (base === 0 || (rule.minOrder != null && whole < rule.minOrder)) return 0;
  let d = rule.kind === "PERCENT" ? Math.floor((base * rule.value) / 100) : rule.value;
  if (rule.maxDiscount != null) d = Math.min(d, rule.maxDiscount);
  return Math.max(0, Math.min(d, base)); // never more than the eligible amount
}

export function shippingFor(afterDiscount: number, cfg: ShippingConfig): number {
  if (afterDiscount <= 0) return 0;
  return afterDiscount >= cfg.freeAbove ? 0 : cfg.fee;
}

// Part 1 rule: one coupon per order, applied once. Combining rules arrives with the full engine.
export function priceCart(lines: Line[], coupon: Rule | null, ship: ShippingConfig, now = new Date()) {
  const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0);
  const discount = coupon ? discountFor(lines, coupon, now) : 0;
  const after = subtotal - discount;
  const shipping = shippingFor(after, ship);
  return { subtotal, discount, shipping, total: after + shipping };
}
