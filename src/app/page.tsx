import { db } from "@/lib/db";
export const dynamic = "force-dynamic";

const rupees = (p: number) => `₹${(p / 100).toLocaleString("en-IN")}`;

export default async function Home() {
  let products: Awaited<ReturnType<typeof load>> = [];
  try { products = await load(); } catch { /* database not set up yet */ }
  return (
    <main>
      <section className="hero">
        <h1 className="wordmark">BADDIE<span>BANNI</span></h1>
        <p>New pieces, made your size. Ready-stock and made-to-order.</p>
        <a className="btn" href="/shop">Shop new arrivals</a>
      </section>
      <section className="wrap" aria-labelledby="new">
        <h2 id="new">New arrivals</h2>
        {products.length === 0 ? (
          <p className="empty">No products yet. Add your first product in the admin area, or load the sample data from the setup guide.</p>
        ) : (
          <div className="grid">
            {products.map((p) => (
              <a className="card" key={p.id} href={`/product/${p.slug}`}>
                <div className="img">
                  {p.images[0] ? <img src={p.images[0].url} alt={p.images[0].alt} loading="lazy" /> : "Photo needed"}
                </div>
                <h3>{p.title}{p.type === "MADE_TO_ORDER" ? " (made to order)" : ""}</h3>
                <span className="price">{rupees(p.salePrice ?? p.basePrice)}{p.salePrice ? <s>{rupees(p.basePrice)}</s> : null}</span>
              </a>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
function load() {
  return db.product.findMany({ where: { status: "ACTIVE" }, orderBy: { createdAt: "desc" }, take: 8, include: { images: { orderBy: { position: "asc" }, take: 1 } } });
}
