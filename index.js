/* ============================================================
   FASHION VAULT — app.js
   Handles: category filtering, search, wishlist, cart, toast
   ============================================================ */

(function () {
  "use strict";

  /* ── State ── */
  let cartCount = 3;
  const wishlistSet = new Set();

  /* ── DOM refs ── */
  const tabs        = document.querySelectorAll(".tab");
  const cards       = document.querySelectorAll(".product-card");
  const noResults   = document.getElementById("noResults");
  const cartBadge   = document.querySelector(".cart-badge");
  const toast       = document.getElementById("toast");
  const searchToggle= document.getElementById("searchToggle");
  const searchBar   = document.getElementById("searchBar");
  const searchInput = document.getElementById("searchInput");
  const searchClose = document.getElementById("searchClose");

  /* ════════════════════════════════════════
     1. CATEGORY FILTER TABS
  ════════════════════════════════════════ */
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      // Update active tab
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const filter = tab.dataset.filter;
      let visibleCount = 0;

      cards.forEach((card, i) => {
        const match = filter === "all" || card.dataset.category === filter;
        if (match) {
          card.style.display = "";
          // Re-trigger stagger animation
          card.style.animationDelay = `${i * 0.05}s`;
          card.style.animation = "none";
          void card.offsetWidth; // reflow
          card.style.animation = "";
          visibleCount++;
        } else {
          card.style.display = "none";
        }
      });

      noResults.style.display = visibleCount === 0 ? "block" : "none";
    });
  });

  /* ════════════════════════════════════════
     2. LIVE SEARCH
  ════════════════════════════════════════ */
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();

    // Reset filter tabs to "all" when searching
    if (query.length > 0) {
      tabs.forEach(t => t.classList.remove("active"));
      document.querySelector('[data-filter="all"]').classList.add("active");
    }

    let visibleCount = 0;
    cards.forEach(card => {
      const name = card.dataset.name || "";
      const cat  = card.dataset.category || "";
      const matches = name.includes(query) || cat.includes(query);
      card.style.display = query === "" || matches ? "" : "none";
      if (card.style.display !== "none") visibleCount++;
    });

    noResults.style.display = visibleCount === 0 ? "block" : "none";
  });

  /* ════════════════════════════════════════
     3. SEARCH BAR TOGGLE
  ════════════════════════════════════════ */
  searchToggle.addEventListener("click", () => {
    searchBar.classList.toggle("open");
    if (searchBar.classList.contains("open")) {
      searchInput.focus();
    } else {
      searchInput.value = "";
      showAllCards();
    }
  });

  searchClose.addEventListener("click", () => {
    searchBar.classList.remove("open");
    searchInput.value = "";
    showAllCards();
  });

  function showAllCards() {
    cards.forEach(c => (c.style.display = ""));
    noResults.style.display = "none";
  }

  /* ════════════════════════════════════════
     4. ADD TO CART
  ════════════════════════════════════════ */
  document.querySelectorAll(".add-cart-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const card = e.target.closest(".product-card");
      const name = card.querySelector(".product-name").textContent;
      const price= card.querySelector(".new-price").textContent;

      // Update badge
      cartCount++;
      cartBadge.textContent = cartCount;
      cartBadge.classList.add("bump");
      setTimeout(() => cartBadge.classList.remove("bump"), 400);

      // Button feedback
      btn.textContent = "✓ Added!";
      btn.style.background = "#00b894";
      setTimeout(() => {
        btn.textContent = "Add to Cart";
        btn.style.background = "";
      }, 1500);

      // Toast
      showToast(`${name} (${price}) added to cart 🛒`);
    });
  });

  /* ════════════════════════════════════════
     5. WISHLIST TOGGLE
  ════════════════════════════════════════ */
  document.querySelectorAll(".wishlist-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const card = btn.closest(".product-card");
      const id   = card.dataset.name;

      if (wishlistSet.has(id)) {
        wishlistSet.delete(id);
        btn.classList.remove("active");
        btn.textContent = "♡";
        showToast("Removed from wishlist");
      } else {
        wishlistSet.add(id);
        btn.classList.add("active");
        btn.textContent = "♥";
        showToast("Saved to wishlist ❤️");
      }
    });
  });

  /* ════════════════════════════════════════
     6. HERO CTA
  ════════════════════════════════════════ */
  const heroCta = document.querySelector(".hero-cta");
  if (heroCta) {
    heroCta.addEventListener("click", () => {
      // Scroll to products smoothly
      document.querySelector(".products-section").scrollIntoView({ behavior: "smooth" });
    });
  }

  /* ════════════════════════════════════════
     7. BOTTOM NAV ACTIVE STATE
  ════════════════════════════════════════ */
  document.querySelectorAll(".bottom-nav-item").forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelectorAll(".bottom-nav-item").forEach(i => i.classList.remove("active"));
      item.classList.add("active");
    });
  });

  /* ════════════════════════════════════════
     8. TOAST HELPER
  ════════════════════════════════════════ */
  let toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
  }

  /* ════════════════════════════════════════
     9. CART BADGE BUMP ANIMATION (inline)
  ════════════════════════════════════════ */
  const bumpStyle = document.createElement("style");
  bumpStyle.textContent = `
    .cart-badge.bump {
      animation: badgeBump 0.35s cubic-bezier(0.36, 0.07, 0.19, 0.97);
    }
    @keyframes badgeBump {
      0%,100% { transform: scale(1); }
      30%      { transform: scale(1.6); }
      60%      { transform: scale(0.9); }
    }
  `;
  document.head.appendChild(bumpStyle);

  /* ════════════════════════════════════════
     10. KEYBOARD: ESC closes search
  ════════════════════════════════════════ */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && searchBar.classList.contains("open")) {
      searchBar.classList.remove("open");
      searchInput.value = "";
      showAllCards();
    }
  });

})();