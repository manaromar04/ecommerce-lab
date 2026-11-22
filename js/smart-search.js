// ShopNow — smart-search.js
// Lab 9: a simple client-side "smart" search.
// It is not real AI: it scores every product by how many query words appear in its
// name, description and category, and understands "under 500" / "below 500" with a regex.

// Step 1 — Score one product against the words in the query
function scoreProduct(product, queryWords) {
  const text = `${product.name} ${product.description || ""} ${product.category || ""}`.toLowerCase();
  let score = 0;
  queryWords.forEach(word => {
    if (text.includes(word)) score += 1;
  });
  return score;
}

// Step 2 — Rule-based price understanding: "under 500" or "below 500"
function extractMaxPrice(query) {
  const match = query.match(/under\s+(\d+)|below\s+(\d+)/i);
  if (!match) return null;
  return Number(match[1] || match[2]);
}

// Words that only describe the price, so they should not be scored as keywords
const PRICE_WORDS = ["under", "below"];

function smartSearch(query, products) {
  const maxPrice = extractMaxPrice(query);
  const candidates = maxPrice ? products.filter(p => p.price <= maxPrice) : products;

  const queryWords = query.toLowerCase().split(/\s+/)
    .filter(w => w.length > 2)                  // drop short filler words ("a", "to", "is")
    .filter(w => !PRICE_WORDS.includes(w))      // "under"/"below" are handled by extractMaxPrice
    .filter(w => isNaN(w));                     // the number itself is the price, not a keyword

  return candidates
    .map(p => ({ product: p, score: scoreProduct(p, queryWords) }))
    .filter(r => r.score > 0 || (maxPrice && queryWords.length === 0)) // "under 200" alone lists everything under 200
    .sort((a, b) => b.score - a.score || a.product.price - b.product.price)
    .slice(0, 5);
}

// Step 3 — Wire it to the smart-search box on products.html
let smartProducts = null; // loaded from Supabase once, then reused for every keystroke

async function getSmartProducts() {
  if (smartProducts) return smartProducts;
  const { data, error } = await supabaseClient
    .from("product")
    .select("*, category(category_name)");
  if (error) throw error;
  smartProducts = data.map(p => ({
    product_id: p.product_id,
    name: p.name,
    description: p.description,
    category: p.category ? p.category.category_name : "",
    price: Number(p.price),
  }));
  return smartProducts;
}

const smartBox = document.getElementById("smart-search");
if (smartBox) {
  smartBox.addEventListener("input", async e => {
    const query = e.target.value.trim();
    const resultsDiv = document.getElementById("smart-results");
    if (query.length < 3) { resultsDiv.innerHTML = ""; return; }

    const products = await getSmartProducts();
    const matches = smartSearch(query, products);
    const maxPrice = extractMaxPrice(query);

    resultsDiv.innerHTML = matches.length
      ? `<p class="smart-note">Top ${matches.length} match${matches.length > 1 ? "es" : ""}` +
        `${maxPrice ? ` priced at or below AED ${maxPrice}` : ""}:</p>` +
        matches.map(r => `
          <a class="smart-item" href="product-detail.html?id=${r.product.product_id}">
            <span>${r.product.name} <small>${r.product.category}</small></span>
            <span>AED ${r.product.price.toLocaleString()} <small>score ${r.score}</small></span>
          </a>`).join("")
      : "<p class=\"smart-note\">No matches. Try different words.</p>";
  });
}
