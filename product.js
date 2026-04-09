/* ============================================================
   FASHION VAULT — product.js
   Handles: image gallery, size picker, quantity, wishlist,
            buy now, contact, read more, toast, sticky bar
   ============================================================ */

(function () {
  "use strict";

  /* ── State ── */
  let qty         = 1;
  let selectedSize = "M";
  let isWishlisted = false;
  let isExpanded   = false;
  let cartCount    = 0;

  const BASE_PRICE = 120;

  /* ── DOM refs ── */
  const qtyVal      = document.getElementById("qtyVal");
  const qtyMinus    = document.getElementById("qtyMinus");
  const qtyPlus     = document.getElementById("qtyPlus");
  const currentPrice= document.getElementById("currentPrice");
  const wishlistBtn = document.getElementById("wishlistBtn");
  const buyNowBtn   = document.getElementById("buyNowBtn");
  const stickyBuy   = document.getElementById("stickyBuy");
  const contactBtn  = document.getElementById("contactBtn");
  const readMore    = document.getElementById("readMore");
  const descText    = document.getElementById("descText");
  const cartBadge   = document.getElementById("cartBadge");
  const toast       = document.getElementById("toast");
  const mainImg     = document.getElementById("mainImg");

  /* ════════════════════════════════════════
     1. IMAGE GALLERY — THUMBNAILS
  ════════════════════════════════════════ */
  document.querySelectorAll(".thumb").forEach(thumb => {
    thumb.addEventListener("click", () => {
      // Active state
      document.querySelectorAll(".thumb").forEach(t => t.classList.remove("active"));
      thumb.classList.add("active");

      // Swap main image class
      const imgClass = thumb.dataset.img;
      mainImg.className = `main-img ${imgClass}`;

      // Fade effect
      mainImg.style.opacity = "0";
      setTimeout(() => { mainImg.style.opacity = "1"; }, 80);
    });
  });

  /* ════════════════════════════════════════
     2. SIZE SELECTOR
  ════════════════════════════════════════ */
  document.querySelectorAll(".size-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".size-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedSize = btn.dataset.size;
      showToast(`Size ${selectedSize} selected`);
    });
  });

  /* ════════════════════════════════════════
     3. QUANTITY CONTROL
  ════════════════════════════════════════ */
  qtyMinus.addEventListener("click", () => {
    if (qty <= 1) return;
    qty--;
    updateQtyDisplay();
  });

  qtyPlus.addEventListener("click", () => {
    if (qty >= 99) return;
    qty++;
    updateQtyDisplay();
  });

  function updateQtyDisplay() {
    qtyVal.textContent = qty;
    currentPrice.textContent = `$${(BASE_PRICE * qty).toFixed(0)}`;

    // Pulse animation on price
    currentPrice.classList.add("price-pulse");
    setTimeout(() => currentPrice.classList.remove("price-pulse"), 300);
  }

  /* ════════════════════════════════════════
     4. WISHLIST TOGGLE
  ════════════════════════════════════════ */
  wishlistBtn.addEventListener("click", () => {
    isWishlisted = !isWishlisted;
    wishlistBtn.classList.toggle("active", isWishlisted);
    showToast(isWishlisted ? "Saved to wishlist ❤️" : "Removed from wishlist");

    // Heart beat animation
    wishlistBtn.style.transform = "scale(1.3)";
    setTimeout(() => { wishlistBtn.style.transform = ""; }, 250);
  });

  /* ════════════════════════════════════════
     5. BUY NOW
  ════════════════════════════════════════ */
  function handleBuyNow(btn) {
    if (!selectedSize) {
      showToast("Please select a size first");
      return;
    }

    cartCount += qty;
    cartBadge.textContent = cartCount;
    animateBadge();

    const orig = btn.textContent;
    btn.textContent = "✓ Added to Cart!";
    btn.style.background = "#00b894";
    btn.disabled = true;

    showToast(`${qty}× Men's Suit (${selectedSize}) added to cart 🛒`);

    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = "";
      btn.disabled = false;
    }, 1800);
  }

  buyNowBtn.addEventListener("click", () => handleBuyNow(buyNowBtn));
  stickyBuy.addEventListener("click", () => handleBuyNow(stickyBuy));

  /* ════════════════════════════════════════
     6. CONTACT US
  ════════════════════════════════════════ */
  contactBtn.addEventListener("click", () => {
    showToast("Calling 0530211911… 📞");
    setTimeout(() => { window.location.href = "tel:0530211911"; }, 500);
  });

  document.querySelector(".sticky-contact").addEventListener("click", () => {
    showToast("Calling 0530211911… 📞");
    setTimeout(() => { window.location.href = "tel:0530211911"; }, 500);
  });

  /* ════════════════════════════════════════
     7. READ MORE / LESS
  ════════════════════════════════════════ */
  const fullDesc = `Elegant blue–black men's suit, perfect for business and formal events. Made from high-quality fabrics for a refined look. Features a double-breasted design with gold-toned buttons and a slim modern fit. Dry clean recommended. Available in multiple sizes.`;

  descText.textContent = fullDesc;

  readMore.addEventListener("click", () => {
    isExpanded = !isExpanded;
    descText.classList.toggle("expanded", isExpanded);
    readMore.textContent = isExpanded ? "Show less" : "Read more";
  });

  /* ════════════════════════════════════════
     8. BOTTOM NAV ACTIVE
  ════════════════════════════════════════ */
  document.querySelectorAll(".bottom-nav-item").forEach(item => {
    item.addEventListener("click", e => {
      if (item.getAttribute("href") === "#") e.preventDefault();
      document.querySelectorAll(".bottom-nav-item").forEach(i => i.classList.remove("active"));
      item.classList.add("active");
    });
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

  // Inject dynamic styles
  const style = document.createElement("style");
  style.textContent = `
    @keyframes badgeBump {
      0%,100% { transform: scale(1); }
      35%      { transform: scale(1.65); }
      65%      { transform: scale(0.88); }
    }
    .badge-bump { animation: badgeBump 0.38s cubic-bezier(0.36,0.07,0.19,0.97); }

    @keyframes pricePulse {
      0%   { transform: scale(1); }
      40%  { transform: scale(1.12); color: var(--clr-primary); }
      100% { transform: scale(1); }
    }
    .price-pulse { animation: pricePulse 0.3s ease; }

    .main-img { transition: opacity 0.2s ease, transform 0.5s ease; }
    .wishlist-pill { transition: transform 0.22s cubic-bezier(0.4,0,0.2,1), color 0.22s; }
  `;
  document.head.appendChild(style);

  function animateBadge() {
    cartBadge.classList.remove("badge-bump");
    void cartBadge.offsetWidth;
    cartBadge.classList.add("badge-bump");
    setTimeout(() => cartBadge.classList.remove("badge-bump"), 400);
  }

})();