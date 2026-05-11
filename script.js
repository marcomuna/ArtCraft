/* ============================================================
   ArtCraft — Global Script
   Cart, Wishlist, Navbar, Animations, PWA, Cursor
   ============================================================ */

// ============================================================
// Loading Screen
// ============================================================
window.addEventListener("load", () => {
  setTimeout(() => {
    const ls = document.getElementById("loading-screen");
    if (ls) ls.classList.add("hidden");
  }, 1600);
});

// ============================================================
// Custom Cursor
// ============================================================
const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");
if (cursorDot && cursorRing) {
  let mx = 0,
    my = 0;
  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursorDot.style.left = mx + "px";
    cursorDot.style.top = my + "px";
    cursorRing.style.left = mx + "px";
    cursorRing.style.top = my + "px";
  });
  document
    .querySelectorAll("a, button, .product-card, .chip, [data-hover]")
    .forEach((el) => {
      el.addEventListener("mouseenter", () =>
        cursorRing.classList.add("hovered"),
      );
      el.addEventListener("mouseleave", () =>
        cursorRing.classList.remove("hovered"),
      );
    });
}

// ============================================================
// Scroll Progress Bar
// ============================================================
const scrollBar = document.getElementById("scroll-bar");
if (scrollBar) {
  window.addEventListener(
    "scroll",
    () => {
      const pct =
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
        100;
      scrollBar.style.width = pct + "%";
    },
    { passive: true },
  );
}

// ============================================================
// Navbar
// ============================================================
const navbar = document.querySelector(".navbar");
const hamburger = document.querySelector(".hamburger");
const mobileNav = document.querySelector(".mobile-nav");

if (navbar) {
  window.addEventListener(
    "scroll",
    () => {
      navbar.classList.toggle("scrolled", window.scrollY > 20);
    },
    { passive: true },
  );
}

if (hamburger && mobileNav) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    mobileNav.classList.toggle("open");
  });
  mobileNav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      hamburger.classList.remove("open");
      mobileNav.classList.remove("open");
    });
  });
}

// Active nav link
(function () {
  const links = document.querySelectorAll(".nav-links a, .mobile-nav a");
  const path = window.location.pathname.split("/").pop() || "index.html";
  links.forEach((l) => {
    const href = l.getAttribute("href") || "";
    if (
      href === path ||
      (path === "" && href === "index.html") ||
      href.split("/").pop() === path
    ) {
      l.classList.add("active");
    }
  });
})();

// ============================================================
// Cart (localStorage)
// ============================================================
const CART_KEY = "artcraft_cart";
const WISH_KEY = "artcraft_wish";

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}
function saveCart(c) {
  localStorage.setItem(CART_KEY, JSON.stringify(c));
  updateCartBadge();
}
function getWish() {
  return JSON.parse(localStorage.getItem(WISH_KEY) || "[]");
}
function saveWish(w) {
  localStorage.setItem(WISH_KEY, JSON.stringify(w));
  updateWishBadge();
}

function updateCartBadge() {
  const cart = getCart();
  const total = cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll(".cart-count").forEach((el) => {
    el.textContent = total;
    el.classList.toggle("show", total > 0);
  });
}
function updateWishBadge() {
  const wish = getWish();
  document.querySelectorAll(".wish-count").forEach((el) => {
    el.textContent = wish.length;
    el.classList.toggle("show", wish.length > 0);
  });
}

function addToCart(product) {
  const cart = getCart();
  const idx = cart.findIndex(
    (i) =>
      i.id === product.id &&
      i.frame === product.frame &&
      i.size === product.size,
  );
  if (idx > -1) {
    cart[idx].qty += product.qty || 1;
  } else {
    cart.push({ ...product, qty: product.qty || 1 });
  }
  saveCart(cart);
  showToast(`<i class="fas fa-check-circle"></i> Added to cart!`, "success");
}

function removeFromCart(id, frame, size) {
  let cart = getCart();
  cart = cart.filter(
    (i) => !(i.id === id && i.frame === frame && i.size === size),
  );
  saveCart(cart);
}

function updateQty(id, frame, size, qty) {
  const cart = getCart();
  const idx = cart.findIndex(
    (i) => i.id === id && i.frame === frame && i.size === size,
  );
  if (idx > -1) {
    if (qty < 1) {
      cart.splice(idx, 1);
    } else {
      cart[idx].qty = qty;
    }
  }
  saveCart(cart);
  renderCart && renderCart();
}

function toggleWish(product) {
  let wish = getWish();
  const idx = wish.findIndex((i) => i.id === product.id);
  if (idx > -1) {
    wish.splice(idx, 1);
    showToast("Removed from wishlist", "info");
    return false;
  } else {
    wish.push(product);
    showToast('<i class="fas fa-heart"></i> Added to wishlist!', "success");
    return true;
  }
  saveWish(wish);
}

function isWished(id) {
  return getWish().some((i) => i.id === id);
}

// Run badge update on every page
updateCartBadge();
updateWishBadge();

// ============================================================
// Toast
// ============================================================
function showToast(msg, type = "info", duration = 3000) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = msg;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = "toastOut 0.35s ease forwards";
    setTimeout(() => toast.remove(), 350);
  }, duration);
}

// ============================================================
// AOS — Animate on Scroll
// ============================================================
function initAOS() {
  const els = document.querySelectorAll("[data-aos]");
  if (!els.length) return;
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("aos-animate");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );
  els.forEach((el) => obs.observe(el));
}
document.addEventListener("DOMContentLoaded", initAOS);

// ============================================================
// Accordion (FAQ)
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".accordion-header").forEach((header) => {
    header.addEventListener("click", () => {
      const item = header.parentElement;
      const isOpen = item.classList.contains("open");
      // Close all
      document
        .querySelectorAll(".accordion-item.open")
        .forEach((i) => i.classList.remove("open"));
      if (!isOpen) item.classList.add("open");
    });
  });
});

// ============================================================
// Tabs
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const group =
        btn.closest("[data-tabs]") || btn.parentElement.parentElement;
      const target = btn.dataset.tab;
      group
        .querySelectorAll(".tab-btn")
        .forEach((b) => b.classList.remove("active"));
      group
        .querySelectorAll(".tab-pane")
        .forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      const pane = group.querySelector(`[data-tab-pane="${target}"]`);
      if (pane) pane.classList.add("active");
    });
  });
});

// ============================================================
// Animated Counters
// ============================================================
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent =
      Math.floor(current).toLocaleString() + (el.dataset.suffix || "");
  }, 16);
}
function initCounters() {
  const counters = document.querySelectorAll(".counter");
  if (!counters.length) return;
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animateCounter(e.target);
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.5 },
  );
  counters.forEach((c) => obs.observe(c));
}
document.addEventListener("DOMContentLoaded", initCounters);

// ============================================================
// Smooth Scroll (Lenis) — optional dependency
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  if (typeof Lenis !== "undefined") {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    function raf(t) {
      lenis.raf(t);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }
});

// ============================================================
// PWA Install Prompt
// ============================================================
let deferredPrompt = null;
const pwaBanner = document.querySelector(".pwa-banner");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (pwaBanner && !localStorage.getItem("pwa_dismissed")) {
    setTimeout(() => pwaBanner.classList.add("show"), 3000);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const installBtn = document.getElementById("pwa-install");
  const dismissBtn = document.getElementById("pwa-dismiss");
  if (installBtn) {
    installBtn.addEventListener("click", async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
          pwaBanner && pwaBanner.classList.remove("show");
        }
        deferredPrompt = null;
      }
    });
  }
  if (dismissBtn) {
    dismissBtn.addEventListener("click", () => {
      pwaBanner && pwaBanner.classList.remove("show");
      localStorage.setItem("pwa_dismissed", "1");
    });
  }
});

// ============================================================
// Wishlist heart buttons
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-wish-btn]").forEach((btn) => {
    const id = btn.dataset.wishBtn;
    if (isWished(id)) btn.classList.add("active");
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const product = JSON.parse(btn.dataset.product || "{}");
      const added = toggleWish(product);
      btn.classList.toggle("active", added);
      saveWish(getWish());
    });
  });
});

// ============================================================
// Quick View Modal
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("quick-view-modal");
  if (!overlay) return;
  document.querySelectorAll("[data-quickview]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      overlay.classList.add("open");
      document.body.style.overflow = "hidden";
    });
  });
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
  const closeBtn = overlay.querySelector(".modal-close");
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  function closeModal() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }
});

// ============================================================
// Lazy Loading images
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const imgs = document.querySelectorAll("img[data-src]");
  if (!imgs.length) return;
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.src = e.target.dataset.src;
          e.target.removeAttribute("data-src");
          obs.unobserve(e.target);
        }
      });
    },
    { rootMargin: "200px" },
  );
  imgs.forEach((img) => obs.observe(img));
});

// ============================================================
// Before/After Slider
// ============================================================
function initBeforeAfter() {
  document.querySelectorAll(".before-after").forEach((el) => {
    const slider = el.querySelector(".ba-slider");
    const before = el.querySelector(".ba-before");
    if (!slider || !before) return;
    let dragging = false;
    function setPos(x) {
      const rect = el.getBoundingClientRect();
      let pct = ((x - rect.left) / rect.width) * 100;
      pct = Math.max(5, Math.min(95, pct));
      before.style.width = pct + "%";
      slider.style.left = pct + "%";
    }
    slider.addEventListener("mousedown", () => (dragging = true));
    slider.addEventListener("touchstart", () => (dragging = true), {
      passive: true,
    });
    window.addEventListener("mouseup", () => (dragging = false));
    window.addEventListener("touchend", () => (dragging = false));
    window.addEventListener("mousemove", (e) => {
      if (dragging) setPos(e.clientX);
    });
    window.addEventListener(
      "touchmove",
      (e) => {
        if (dragging) setPos(e.touches[0].clientX);
      },
      { passive: true },
    );
  });
}
document.addEventListener("DOMContentLoaded", initBeforeAfter);

// ============================================================
// Cart page render
// ============================================================
function renderCart() {
  const container = document.getElementById("cart-items");
  if (!container) return;
  const cart = getCart();
  if (cart.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:4rem 0; color:var(--text2)">
        <i class="fas fa-shopping-bag" style="font-size:3rem; color:var(--border); display:block; margin-bottom:1rem"></i>
        <p style="font-size:1.1rem; margin-bottom:1.5rem">Your cart is empty</p>
        <a href="shop.html" class="btn btn-gold">Continue Shopping</a>
      </div>`;
    updateOrderSummary(cart);
    return;
  }
  container.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item glow-card" style="display:flex;gap:1.5rem;margin-bottom:1rem;padding:1.2rem" data-id="${item.id}">
      <img src="${item.image}" alt="${item.name}" style="width:90px;height:110px;object-fit:cover;border-radius:8px;flex-shrink:0">
      <div style="flex:1">
        <p style="font-size:0.72rem;color:var(--gold);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:0.3rem">${item.category || ""}</p>
        <h4 style="font-family:var(--font-serif);font-size:1.1rem;color:var(--cream);margin-bottom:0.3rem">${item.name}</h4>
        ${item.size ? `<p style="font-size:0.8rem;color:var(--text2)">Size: ${item.size}</p>` : ""}
        ${item.frame ? `<p style="font-size:0.8rem;color:var(--text2)">Frame: ${item.frame}</p>` : ""}
        <div style="display:flex;align-items:center;justify-content:space-between;margin-top:0.75rem">
          <div class="qty-control">
            <button class="qty-btn" onclick="updateQty('${item.id}','${item.frame}','${item.size}',${item.qty - 1}); renderCart()">−</button>
            <span class="qty-input">${item.qty}</span>
            <button class="qty-btn" onclick="updateQty('${item.id}','${item.frame}','${item.size}',${item.qty + 1}); renderCart()">+</button>
          </div>
          <div style="display:flex;align-items:center;gap:1rem">
            <span style="color:var(--gold);font-weight:600">₹${(item.price * item.qty).toLocaleString()}</span>
            <button onclick="removeFromCart('${item.id}','${item.frame}','${item.size}'); renderCart()" style="color:var(--text3);font-size:0.9rem;transition:color 0.2s" onmouseover="this.style.color='#e05'" onmouseout="this.style.color='var(--text3)'">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      </div>
    </div>`,
    )
    .join("");
  updateOrderSummary(cart);
}

function updateOrderSummary(cart) {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 0 ? (subtotal >= 2000 ? 0 : 149) : 0;
  const total = subtotal + shipping;
  const el = (id) => document.getElementById(id);
  if (el("summary-subtotal"))
    el("summary-subtotal").textContent = "₹" + subtotal.toLocaleString();
  if (el("summary-shipping"))
    el("summary-shipping").textContent =
      shipping === 0 ? "FREE" : "₹" + shipping;
  if (el("summary-total"))
    el("summary-total").textContent = "₹" + total.toLocaleString();
}

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (getCart().length === 0) {
        showToast("Your cart is empty!", "error");
        return;
      }
      window.location.href = "checkout.html";
    });
  }
});

// ============================================================
// Wishlist page render
// ============================================================
function renderWishlist() {
  const container = document.getElementById("wish-items");
  if (!container) return;
  const wish = getWish();
  if (wish.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:4rem 0;color:var(--text2);grid-column:1/-1">
        <i class="fas fa-heart" style="font-size:3rem;color:var(--border);display:block;margin-bottom:1rem"></i>
        <p style="margin-bottom:1.5rem">Your wishlist is empty</p>
        <a href="shop.html" class="btn btn-gold">Explore Shop</a>
      </div>`;
    return;
  }
  container.innerHTML = wish
    .map(
      (item) => `
    <div class="product-card">
      <div class="product-img-wrap">
        <img src="${item.image}" alt="${item.name}" loading="lazy">
        <div class="product-actions">
          <button class="product-action-btn active" onclick="removeWishItem('${item.id}')"><i class="fas fa-heart"></i></button>
        </div>
      </div>
      <div class="product-info">
        <p class="product-cat">${item.category || ""}</p>
        <h3 class="product-name">${item.name}</h3>
        <p class="product-price">₹${item.price.toLocaleString()}</p>
      </div>
      <div class="product-card-footer">
        <button class="add-cart-btn" onclick='addToCart(${JSON.stringify(item)})'>
          <i class="fas fa-shopping-bag"></i> Add to Cart
        </button>
      </div>
    </div>`,
    )
    .join("");
}

function removeWishItem(id) {
  let wish = getWish().filter((i) => i.id !== id);
  saveWish(wish);
  renderWishlist();
}

document.addEventListener("DOMContentLoaded", renderWishlist);

// ============================================================
// Checkout form
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("checkout-form");
  if (!form) return;
  const cart = getCart();
  const orderSummary = document.getElementById("order-summary-items");
  if (orderSummary) {
    if (cart.length === 0) {
      orderSummary.innerHTML =
        '<p style="color:var(--text2)">No items in cart</p>';
    } else {
      const sub = cart.reduce((s, i) => s + i.price * i.qty, 0);
      const ship = sub >= 2000 ? 0 : 149;
      orderSummary.innerHTML =
        cart
          .map(
            (i) => `
        <div style="display:flex;gap:0.75rem;margin-bottom:0.75rem;align-items:center">
          <img src="${i.image}" alt="${i.name}" style="width:50px;height:60px;object-fit:cover;border-radius:6px">
          <div style="flex:1">
            <p style="font-size:0.85rem;color:var(--cream)">${i.name}</p>
            <p style="font-size:0.75rem;color:var(--text2)">Qty: ${i.qty}</p>
          </div>
          <span style="color:var(--gold);font-weight:600">₹${(i.price * i.qty).toLocaleString()}</span>
        </div>`,
          )
          .join("") +
        `<hr style="border-color:var(--border2);margin:0.75rem 0">
           <div style="display:flex;justify-content:space-between;font-size:0.85rem;color:var(--text2);margin-bottom:0.3rem"><span>Subtotal</span><span>₹${sub.toLocaleString()}</span></div>
           <div style="display:flex;justify-content:space-between;font-size:0.85rem;color:var(--text2);margin-bottom:0.75rem"><span>Shipping</span><span>${ship === 0 ? "FREE" : "₹149"}</span></div>
           <div style="display:flex;justify-content:space-between;font-weight:600;color:var(--gold)"><span>Total</span><span>₹${(sub + ship).toLocaleString()}</span></div>`;
    }
  }
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    localStorage.removeItem(CART_KEY);
    window.location.href = "order-success.html";
  });
});

// ============================================================
// Product page — Frame & Size selector
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const frameOptions = document.querySelectorAll("[data-frame]");
  const sizeOptions = document.querySelectorAll("[data-size]");
  const priceEl = document.getElementById("product-price");
  const basePrices = { A4: 899, A3: 1299 };
  const frameAddon = {
    "Classic Black Frame": 200,
    "Wooden Frame": 350,
    "Premium Golden Frame": 550,
    None: 0,
  };
  let selectedFrame = "None",
    selectedSize = "A4";

  function updatePrice() {
    if (!priceEl) return;
    const base = basePrices[selectedSize] || 899;
    const addon = frameAddon[selectedFrame] || 0;
    priceEl.textContent = "₹" + (base + addon).toLocaleString();
  }

  frameOptions.forEach((opt) => {
    opt.addEventListener("click", () => {
      frameOptions.forEach((o) => o.classList.remove("active"));
      opt.classList.add("active");
      selectedFrame = opt.dataset.frame;
      updatePrice();
    });
  });
  sizeOptions.forEach((opt) => {
    opt.addEventListener("click", () => {
      sizeOptions.forEach((o) => o.classList.remove("active"));
      opt.classList.add("active");
      selectedSize = opt.dataset.size;
      updatePrice();
    });
  });
  updatePrice();

  // Add to cart from product page
  const addBtn = document.getElementById("add-to-cart-btn");
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      const product = {
        id: addBtn.dataset.productId || "portrait-1",
        name: addBtn.dataset.productName || "Custom Portrait",
        price: parseInt(
          priceEl ? priceEl.textContent.replace(/[₹,]/g, "") : 899,
        ),
        image:
          addBtn.dataset.productImage ||
          "https://picsum.photos/seed/portrait1/400/500",
        category: "Pencil Portraits",
        size: selectedSize,
        frame: selectedFrame,
      };
      addToCart(product);
    });
  }
});

// ============================================================
// Custom Order form
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("custom-order-form");
  if (!form) return;
  const uploadInput = document.getElementById("photo-upload");
  const uploadPreview = document.getElementById("upload-preview");
  if (uploadInput && uploadPreview) {
    uploadInput.addEventListener("change", () => {
      const file = uploadInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        uploadPreview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="width:100%;height:100%;object-fit:cover;border-radius:var(--radius2)">`;
      };
      reader.readAsDataURL(file);
    });
  }
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    showToast(
      '<i class="fas fa-check-circle"></i> Order placed! We\'ll contact you soon.',
      "success",
      5000,
    );
    setTimeout(() => form.reset(), 1000);
    if (uploadPreview) uploadPreview.innerHTML = uploadPlaceholder;
  });
  const uploadPlaceholder = uploadPreview ? uploadPreview.innerHTML : "";
});

// ============================================================
// Image Gallery Zoom (product page)
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const thumbs = document.querySelectorAll(".gallery-thumb");
  const mainImg = document.getElementById("gallery-main");
  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      thumbs.forEach((t) => t.classList.remove("active"));
      thumb.classList.add("active");
      if (mainImg) {
        mainImg.style.opacity = "0";
        mainImg.style.transform = "scale(0.97)";
        setTimeout(() => {
          mainImg.src = thumb.dataset.full || thumb.src;
          mainImg.style.opacity = "1";
          mainImg.style.transform = "scale(1)";
        }, 200);
      }
    });
  });
});

// ============================================================
// Service Worker registration (PWA)
// ============================================================
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
