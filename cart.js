/* ============================================================
   FASHION VAULT — cart.js
   Handles: cart state, add/remove/qty, order summary, toast
   ============================================================ */

(function () {
  "use strict";

  /* ════════════════════════════════════════
     STATE
  ════════════════════════════════════════ */
  // Each item: { id, name, price, imgClass, qty }
  let cartItems = [];

  /* ════════════════════════════════════════
     DOM REFS
  ════════════════════════════════════════ */
  const emptyCart         = document.getElementById("emptyCart");
  const cartItemsSection  = document.getElementById("cartItemsSection");
  const cartItemsList     = document.getElementById("cartItemsList");
  const cartBadge         = document.getElementById("cartBadge");
  const subtotalEl        = document.getElementById("subtotal");
  const totalPriceEl      = document.getElementById("totalPrice");
  const toast             = document.getElementById("toast");
  const checkoutBtn       = document.getElementById("checkoutBtn");

  /* ════════════════════════════════════════
     1. RECENTLY VIEWED — CART FAB
  ════════════════════════════════════════ */
  document.querySelectorAll(".cart-fab").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const card     = btn.closest(".product-card");
      const name     = card.dataset.name;
      const price    = parseInt(card.dataset.price, 10);
      const imgClass = card.querySelector(".product-img").className.split(" ")[1]; // second class

      addToCart({ name, price, imgClass });

      // FAB feedback
      btn.style.background = "#00b894";
      btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`;
      setTimeout(() => {
        btn.style.background = "";
        btn.innerHTML = cartIcon();
      }, 1400);
    });
  });

  /* ════════════════════════════════════════
     2. ADD TO CART
  ════════════════════════════════════════ */
  function addToCart({ name, price, imgClass }) {
    const existing = cartItems.find(i => i.name === name);
    if (existing) {
      existing.qty++;
      showToast(`${cap(name)} qty updated ✓`);
    } else {
      cartItems.push({ id: Date.now(), name, price, imgClass, qty: 1 });
      showToast(`${cap(name)} added to cart 🛒`);
    }
    renderCart();
  }

  /* ════════════════════════════════════════
     3. REMOVE FROM CART
  ════════════════════════════════════════ */
  function removeFromCart(id) {
    cartItems = cartItems.filter(i => i.id !== id);
    renderCart();
    showToast("Item removed from cart");
  }

  /* ════════════════════════════════════════
     4. UPDATE QTY
  ════════════════════════════════════════ */
  function updateQty(id, delta) {
    const item = cartItems.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      removeFromCart(id);
    } else {
      renderCart();
    }
  }

  /* ════════════════════════════════════════
     5. RENDER CART
  ════════════════════════════════════════ */
  function renderCart() {
    const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
    const count = cartItems.reduce((s, i) => s + i.qty, 0);

    // Badge
    cartBadge.textContent = count;
    animateBadge();

    // Toggle empty / items view
    if (cartItems.length === 0) {
      emptyCart.style.display = "flex";
      cartItemsSection.style.display = "none";
      return;
    }
    emptyCart.style.display = "none";
    cartItemsSection.style.display = "block";

    // Rebuild list
    cartItemsList.innerHTML = "";
    cartItems.forEach((item, idx) => {
      const row = document.createElement("div");
      row.className = "cart-item";
      row.style.animationDelay = `${idx * 0.06}s`;
      row.innerHTML = `
        <div class="cart-item-img ${item.imgClass}"></div>
        <div class="cart-item-body">
          <p class="cart-item-name">${cap(item.name)}</p>
          <p class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</p>
          <div class="qty-row">
            <button class="qty-btn" data-id="${item.id}" data-delta="-1">−</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn" data-id="${item.id}" data-delta="1">+</button>
          </div>
        </div>
        <button class="remove-btn" data-id="${item.id}" aria-label="Remove">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
        </button>
      `;
      cartItemsList.appendChild(row);
    });

    // Qty & remove listeners
    cartItemsList.querySelectorAll(".qty-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        updateQty(+btn.dataset.id, +btn.dataset.delta);
      });
    });
    cartItemsList.querySelectorAll(".remove-btn").forEach(btn => {
      btn.addEventListener("click", () => removeFromCart(+btn.dataset.id));
    });

    // Summary
    subtotalEl.textContent  = `$${total.toFixed(2)}`;
    totalPriceEl.textContent = `$${total.toFixed(2)}`;
  }

  /* ════════════════════════════════════════
     6. CHECKOUT BUTTON
  ════════════════════════════════════════ */
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      showToast("Redirecting to checkout… 🎉");
      setTimeout(() => {
        checkoutBtn.textContent = "✓ Order Placed!";
        checkoutBtn.style.background = "#00b894";
        cartItems = [];
        setTimeout(() => {
          checkoutBtn.textContent = "Proceed to Checkout";
          checkoutBtn.style.background = "";
          renderCart();
        }, 2200);
      }, 900);
    });
  }

  /* ════════════════════════════════════════
     7. BOTTOM NAV ACTIVE
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

  // Inject badge bump keyframe
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

  function cap(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function cartIcon() {
    return `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`;
  }

  /* Initial render */
  renderCart();

})();1