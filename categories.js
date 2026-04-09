/* ============================================================
   FASHION VAULT — categories.js
   Handles: filter tabs, live search, cart FAB, toast
   ============================================================ */

(function () {
  "use strict";

  /* ── State ── */
  let cartCount = 0;

  /* ── DOM refs ── */
  const tabs        = document.querySelectorAll(".tab");
  const cards       = document.querySelectorAll(".product-card");
  const noResults   = document.getElementById("noResults");
  const cartBadge   = document.getElementById("cartBadge");
  const toast       = document.getElementById("toast");
  const searchInput = document.getElementById("searchInput");

  /* ════════════════════════════════════════
     1. CATEGORY FILTER TABS
  ════════════════════════════════════════ */
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      // Clear search when switching tabs
      searchInput.value = "";

      const filter = tab.dataset.filter;
      let visible = 0;

      cards.forEach((card, i) => {
        const match = filter === "all" || card.dataset.category === filter;
        card.style.display = match ? "" : "none";

        if (match) {
          // Re-trigger stagger animation
          card.style.animation = "none";
          void card.offsetWidth;
          card.style.animationDelay = `${visible * 0.06}s`;
          card.style.animation = "";
          visible++;
        }
      });

      noResults.style.display = visible === 0 ? "block" : "none";
    });
  });

  /* ════════════════════════════════════════
     2. LIVE SEARCH
  ════════════════════════════════════════ */
  searchInput.addEventListener("input", () => {
    const q = searchInput.value.trim().toLowerCase();

    // Reset filter tabs
    tabs.forEach(t => t.classList.remove("active"));
    document.querySelector('[data-filter="all"]').classList.add("active");

    let visible = 0;
    cards.forEach(card => {
      const name = (card.dataset.name || "").toLowerCase();
      const cat  = (card.dataset.category || "").toLowerCase();
      const match = q === "" || name.includes(q) || cat.includes(q);
      card.style.display = match ? "" : "none";
      if (match) visible++;
    });

    noResults.style.display = visible === 0 ? "block" : "none";
  });

  /* ════════════════════════════════════════
     3. CART FAB BUTTONS
  ════════════════════════════════════════ */
  document.querySelectorAll(".cart-fab").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const card = btn.closest(".product-card");
      const name = card.querySelector(".product-name").textContent.trim();

      // Pick displayed price (new or regular)
      const priceEl = card.querySelector(".new-price") || card.querySelector(".product-price");
      const price   = priceEl ? priceEl.textContent.trim() : "";

      // Update badge
      cartCount++;
      cartBadge.textContent = cartCount;
      animateBadge();

      // Button pulse
      btn.style.background = "#00b894";
      btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`;
      setTimeout(() => {
        btn.style.background = "";
        btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`;
      }, 1400);

      showToast(`${name} ${price ? "(" + price + ")" : ""} added to cart 🛒`);
    });
  });

  /* ════════════════════════════════════════
     4. CARD CLICK — product detail hint
  ════════════════════════════════════════ */
  cards.forEach(card => {
    card.addEventListener("click", e => {
      if (e.target.closest(".cart-fab")) return; // handled above
      const name = card.querySelector(".product-name").textContent.trim();
      showToast(`Viewing: ${name}`);
    });
  });

  /* ════════════════════════════════════════
     5. TAB ARROW — scroll filter tabs
  ════════════════════════════════════════ */
  const tabArrow    = document.querySelector(".tab-arrow");
  const filterTabs  = document.getElementById("filterTabs");
  if (tabArrow && filterTabs) {
    tabArrow.addEventListener("click", () => {
      filterTabs.scrollBy({ left: 100, behavior: "smooth" });
    });
  }

  /* ════════════════════════════════════════
     6. BOTTOM NAV ACTIVE STATE
  ════════════════════════════════════════ */
  document.querySelectorAll(".bottom-nav-item").forEach(item => {
    item.addEventListener("click", e => {
      if (item.getAttribute("href") === "#") e.preventDefault();
      document.querySelectorAll(".bottom-nav-item").forEach(i => i.classList.remove("active"));
      item.classList.add("active");
    });
  });

  /* ════════════════════════════════════════
     7. KEYBOARD: ESC clears search
  ════════════════════════════════════════ */
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && searchInput.value) {
      searchInput.value = "";
      cards.forEach(c => (c.style.display = ""));
      noResults.style.display = "none";
      // Reset to "all" tab
      tabs.forEach(t => t.classList.remove("active"));
      document.querySelector('[data-filter="all"]').classList.add("active");
    }
  });

  /* ════════════════════════════════════════
     HELPERS
  ════════════════════════════════════════ */
  let toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  }

  // Inject badge bump keyframe once
  const style = document.createElement("style");
  style.textContent = `
    @keyframes badgeBump {
      0%,100% { transform: scale(1); }
      35%      { transform: scale(1.65); }
      65%      { transform: scale(0.88); }
    }
    .badge-bump { animation: badgeBump 0.38s cubic-bezier(0.36,0.07,0.19,0.97); }
  `;
  document.head.appendChild(style);

  function animateBadge() {
    cartBadge.classList.remove("badge-bump");
    void cartBadge.offsetWidth;
    cartBadge.classList.add("badge-bump");
    setTimeout(() => cartBadge.classList.remove("badge-bump"), 400);
  }

})();