import test from "node:test";
import assert from "node:assert/strict";
import { priceCart, discountFor, type Rule } from "./pricing.ts";

const ship = { freeAbove: 200000, fee: 9900 };
const lines = [{ productId: "a", unitPrice: 100000, quantity: 1 }, { productId: "b", unitPrice: 50000, quantity: 2 }];
const pct: Rule = { kind: "PERCENT", value: 10, active: true };

test("totals add up with no coupon", () => {
  assert.deepEqual(priceCart(lines, null, ship), { subtotal: 200000, discount: 0, shipping: 0, total: 200000 });
});
test("percent discount, shipping uses post-discount value", () => {
  const r = priceCart(lines, pct, ship);
  assert.equal(r.discount, 20000);
  assert.equal(r.shipping, 9900);
  assert.equal(r.total, 180000 + 9900);
});
test("max discount cap", () => assert.equal(discountFor(lines, { ...pct, maxDiscount: 5000 }), 5000));
test("fixed discount never exceeds cart", () =>
  assert.equal(priceCart(lines, { kind: "FIXED", value: 999999, active: true }, ship).total, 0));
test("min order not met gives zero", () => assert.equal(discountFor(lines, { ...pct, minOrder: 500000 }), 0));
test("inactive and expired rules give zero", () => {
  assert.equal(discountFor(lines, { ...pct, active: false }), 0);
  assert.equal(discountFor(lines, { ...pct, endsAt: new Date("2020-01-01") }), 0);
});
test("excluded product is not discounted", () =>
  assert.equal(discountFor(lines, { ...pct, excludedProductIds: ["a"] }), 10000));
test("total is never negative", () => assert.ok(priceCart([], pct, ship).total >= 0));
