/* ============================================================
   ArtCraft — Global Script v2
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
  document.addEventListener("mousemove", (e) => {
    cursorDot.style.left = e.clientX + "px";
    cursorDot.style.top = e.clientY + "px";
    cursorRing.style.left = e.clientX + "px";
    cursorRing.style.top = e.clientY + "px";
  });
  document.querySelectorAll("a, button, .product-card, .chip").forEach((el) => {
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
// User Auth & Nav Rendering
// ============================================================
const USER_KEY = "artcraft_user";
const ADMIN_EMAIL = "marco.muna143@gmail.com";
const ADMIN_PASS = "Marco@143";

function getUser() {
  return JSON.parse(localStorage.getItem(USER_KEY) || "null");
}
function saveUser(u) {
  localStorage.setItem(USER_KEY, JSON.stringify(u));
}
function logoutUser() {
  localStorage.removeItem(USER_KEY);
  window.location.href = "auth.html";
}
function isAdmin() {
  const u = getUser();
  return u && u.isAdmin;
}

function getUserAvatar(user) {
  if (user.avatar)
    return `<img src="${user.avatar}" style="width:28px;height:28px;border-radius:50%;object-fit:cover;border:1.5px solid var(--gold)">`;
  const initial = (user.name || "U")[0].toUpperCase();
  return `<div style="width:28px;height:28px;border-radius:50%;background:var(--gold);color:var(--bg);font-size:0.75rem;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0">${initial}</div>`;
}

function renderUserNav() {
  const user = getUser();
  document.querySelectorAll(".user-nav-btn").forEach((wrap) => {
    if (user) {
      const firstName = user.name.split(" ")[0];
      const href = user.isAdmin ? "admin.html" : "#";
      wrap.innerHTML = `
        <div style="display:flex;align-items:center;gap:0.4rem;cursor:pointer" onclick="${user.isAdmin ? "window.location.href='admin.html'" : ""}">
          ${getUserAvatar(user)}
          <span style="font-size:0.75rem;color:var(--cream);max-width:60px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${firstName}</span>
          ${user.isAdmin ? '<i class="fas fa-crown" style="color:var(--gold);font-size:0.65rem"></i>' : ""}
        </div>
        <button onclick="logoutUser()" style="font-size:0.68rem;color:var(--text3);background:none;border:none;cursor:pointer;margin-left:2px" title="Logout"><i class="fas fa-sign-out-alt"></i></button>`;
    } else {
      wrap.innerHTML = `<a href="auth.html" class="nav-icon-btn" title="Account"><i class="fas fa-user"></i></a>`;
    }
  });
}
document.addEventListener("DOMContentLoaded", renderUserNav);

// ============================================================
// Cart & Wishlist (localStorage)
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
  const total = getCart().reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll(".cart-count").forEach((el) => {
    el.textContent = total;
    el.classList.toggle("show", total > 0);
  });
}
function updateWishBadge() {
  const len = getWish().length;
  document.querySelectorAll(".wish-count").forEach((el) => {
    el.textContent = len;
    el.classList.toggle("show", len > 0);
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
  saveCart(
    getCart().filter(
      (i) => !(i.id === id && i.frame === frame && i.size === size),
    ),
  );
}

function updateQty(id, frame, size, qty) {
  const cart = getCart();
  const idx = cart.findIndex(
    (i) => i.id === id && i.frame === frame && i.size === size,
  );
  if (idx > -1) {
    if (qty < 1) cart.splice(idx, 1);
    else cart[idx].qty = qty;
  }
  saveCart(cart);
  if (typeof renderCart === "function") renderCart();
}

function toggleWish(product) {
  let wish = getWish();
  const idx = wish.findIndex((i) => i.id === product.id);
  let added;
  if (idx > -1) {
    wish.splice(idx, 1);
    showToast("Removed from wishlist", "info");
    added = false;
  } else {
    wish.push(product);
    showToast('<i class="fas fa-heart"></i> Added to wishlist!', "success");
    added = true;
  }
  saveWish(wish);
  return added;
}
function isWished(id) {
  return getWish().some((i) => i.id === id);
}

// ============================================================
// Order Summary Calculation
// Free shipping if subtotal >= ₹3000, else ₹80
// 20% discount if subtotal > ₹5000
// ============================================================
function calcOrderTotals(cart) {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = subtotal > 5000 ? Math.round(subtotal * 0.2) : 0;
  const afterDiscount = subtotal - discount;
  const shipping = afterDiscount > 0 ? (afterDiscount >= 3000 ? 0 : 80) : 0;
  const total = afterDiscount + shipping;
  return { subtotal, discount, afterDiscount, shipping, total };
}

function updateOrderSummary(cart) {
  const { subtotal, discount, shipping, total } = calcOrderTotals(cart);
  const el = (id) => document.getElementById(id);
  if (el("summary-subtotal"))
    el("summary-subtotal").textContent = "₹" + subtotal.toLocaleString();
  if (el("summary-discount"))
    el("summary-discount").textContent =
      discount > 0 ? "-₹" + discount.toLocaleString() + " (20%)" : "—";
  if (el("summary-shipping"))
    el("summary-shipping").textContent =
      shipping === 0 ? "FREE" : "₹" + shipping;
  if (el("summary-total"))
    el("summary-total").textContent = "₹" + total.toLocaleString();
  if (el("co-subtotal"))
    el("co-subtotal").textContent = "₹" + subtotal.toLocaleString();
  if (el("co-shipping"))
    el("co-shipping").textContent = shipping === 0 ? "FREE" : "₹" + shipping;
  if (el("co-total")) el("co-total").textContent = "₹" + total.toLocaleString();
}

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
// AOS Animate on Scroll
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
// Accordion
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".accordion-header").forEach((header) => {
    header.addEventListener("click", () => {
      const item = header.parentElement;
      const isOpen = item.classList.contains("open");
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
// Counters
// ============================================================
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const step = target / 125;
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
document.addEventListener("DOMContentLoaded", () => {
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
  document.querySelectorAll(".counter").forEach((c) => obs.observe(c));
});

// ============================================================
// Smooth Scroll (Lenis)
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
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const banner = document.querySelector(".pwa-banner");
  if (banner && !localStorage.getItem("pwa_dismissed"))
    setTimeout(() => banner.classList.add("show"), 3000);
});
document.addEventListener("DOMContentLoaded", () => {
  const installBtn = document.getElementById("pwa-install");
  const dismissBtn = document.getElementById("pwa-dismiss");
  if (installBtn)
    installBtn.addEventListener("click", async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt = null;
      }
    });
  if (dismissBtn)
    dismissBtn.addEventListener("click", () => {
      document.querySelector(".pwa-banner")?.classList.remove("show");
      localStorage.setItem("pwa_dismissed", "1");
    });
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
      let pct = Math.max(5, Math.min(95, ((x - rect.left) / rect.width) * 100));
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
// Lazy Loading
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
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
  document.querySelectorAll("img[data-src]").forEach((img) => obs.observe(img));
});

// ============================================================
// Cart Page Render
// ============================================================
function renderCart() {
  const container = document.getElementById("cart-items");
  if (!container) return;
  const cart = getCart();
  if (cart.length === 0) {
    container.innerHTML = `<div style="text-align:center;padding:4rem 0;color:var(--text2)">
      <i class="fas fa-shopping-bag" style="font-size:3rem;color:var(--border);display:block;margin-bottom:1rem"></i>
      <p style="font-size:1rem;margin-bottom:1.5rem">Your cart is empty</p>
      <a href="shop.html" class="btn btn-gold">Continue Shopping</a></div>`;
    updateOrderSummary([]);
    return;
  }
  container.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item glow-card" style="display:flex;gap:1.5rem;margin-bottom:1rem;padding:1.2rem">
      <img src="${item.image}" alt="${item.name}" style="width:80px;height:100px;object-fit:cover;border-radius:8px;flex-shrink:0">
      <div style="flex:1">
        <p style="font-size:0.7rem;color:var(--gold);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:0.3rem">${item.category || ""}</p>
        <h4 style="font-family:var(--font-serif);font-size:1rem;color:var(--cream);margin-bottom:0.3rem">${item.name}</h4>
        ${item.size ? `<p style="font-size:0.78rem;color:var(--text2)">Size: ${item.size}</p>` : ""}
        ${item.frame && item.frame !== "None" ? `<p style="font-size:0.78rem;color:var(--text2)">Frame: ${item.frame}</p>` : ""}
        <div style="display:flex;align-items:center;justify-content:space-between;margin-top:0.75rem">
          <div class="qty-control">
            <button class="qty-btn" onclick="updateQty('${item.id}','${item.frame}','${item.size}',${item.qty - 1})">−</button>
            <span class="qty-input">${item.qty}</span>
            <button class="qty-btn" onclick="updateQty('${item.id}','${item.frame}','${item.size}',${item.qty + 1})">+</button>
          </div>
          <div style="display:flex;align-items:center;gap:1rem">
            <span style="color:var(--gold);font-weight:600">₹${(item.price * item.qty).toLocaleString()}</span>
            <button onclick="removeFromCart('${item.id}','${item.frame}','${item.size}');renderCart()" style="color:var(--text3);font-size:0.9rem;background:none;border:none;cursor:pointer" onmouseover="this.style.color='#e05'" onmouseout="this.style.color='var(--text3)'"><i class="fas fa-trash-alt"></i></button>
          </div>
        </div>
      </div>
    </div>`,
    )
    .join("");
  updateOrderSummary(cart);
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
// Wishlist Page Render
// ============================================================
function renderWishlist() {
  const container = document.getElementById("wish-items");
  if (!container) return;
  const wish = getWish();
  if (wish.length === 0) {
    container.innerHTML = `<div style="text-align:center;padding:4rem 0;color:var(--text2);grid-column:1/-1">
      <i class="fas fa-heart" style="font-size:3rem;color:var(--border);display:block;margin-bottom:1rem"></i>
      <p style="margin-bottom:1.5rem">Your wishlist is empty</p>
      <a href="shop.html" class="btn btn-gold">Explore Shop</a></div>`;
    return;
  }
  container.innerHTML = wish
    .map(
      (item) => `
    <div class="product-card">
      <div class="product-img-wrap">
        <img src="${item.image}" alt="${item.name}" loading="lazy">
        <button class="wish-heart-btn active" onclick="removeWishItem('${item.id}')" title="Remove from wishlist"><i class="fas fa-heart"></i></button>
      </div>
      <div class="product-info">
        <p class="product-cat">${item.category || ""}</p>
        <h3 class="product-name">${item.name}</h3>
        <p class="product-price">₹${item.price.toLocaleString()}</p>
      </div>
      <div class="product-card-footer">
        <button class="add-cart-btn" onclick='addToCart(${JSON.stringify({ ...item, qty: 1, size: "A4", frame: "None" })})'>
          <i class="fas fa-shopping-bag"></i> Add to Cart
        </button>
      </div>
    </div>`,
    )
    .join("");
}

function removeWishItem(id) {
  saveWish(getWish().filter((i) => i.id !== id));
  renderWishlist();
  if (typeof updateWishCountText === "function") updateWishCountText();
}

document.addEventListener("DOMContentLoaded", renderWishlist);

// ============================================================
// Checkout Page
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("checkout-form");
  if (!form) return;
  const cart = getCart();
  const summaryEl = document.getElementById("order-summary-items");
  if (summaryEl) {
    if (!cart.length) {
      summaryEl.innerHTML =
        '<p style="color:var(--text2)">No items in cart</p>';
    } else {
      summaryEl.innerHTML = cart
        .map(
          (i) => `
        <div style="display:flex;gap:0.75rem;margin-bottom:0.75rem;align-items:center">
          <img src="${i.image}" alt="" style="width:48px;height:58px;object-fit:cover;border-radius:6px;border:1px solid var(--border2)">
          <div style="flex:1"><p style="font-size:0.82rem;color:var(--cream)">${i.name}</p><p style="font-size:0.72rem;color:var(--text3)">Qty: ${i.qty} ${i.size ? "· " + i.size : ""}</p></div>
          <span style="color:var(--gold);font-weight:600;font-size:0.88rem">₹${(i.price * i.qty).toLocaleString()}</span>
        </div>`,
        )
        .join("");
    }
  }
  updateOrderSummary(cart);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    localStorage.removeItem(CART_KEY);
    window.location.href = "order-success.html";
  });
});

// ============================================================
// Product Page Frame/Size
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
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
    priceEl.textContent =
      "₹" +
      (
        (basePrices[selectedSize] || 899) + (frameAddon[selectedFrame] || 0)
      ).toLocaleString();
  }
  document.querySelectorAll("[data-frame]").forEach((opt) => {
    opt.addEventListener("click", () => {
      document
        .querySelectorAll("[data-frame]")
        .forEach((o) => o.classList.remove("active"));
      opt.classList.add("active");
      selectedFrame = opt.dataset.frame;
      updatePrice();
    });
  });
  document.querySelectorAll("[data-size]").forEach((opt) => {
    opt.addEventListener("click", () => {
      document
        .querySelectorAll("[data-size]")
        .forEach((o) => o.classList.remove("active"));
      opt.classList.add("active");
      selectedSize = opt.dataset.size;
      updatePrice();
    });
  });
  updatePrice();
  const addBtn = document.getElementById("add-to-cart-btn");
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      const price = parseInt(
        priceEl ? priceEl.textContent.replace(/[₹,]/g, "") : 899,
      );
      const size =
        document.querySelector("[data-size].active")?.dataset.size || "A4";
      const frame =
        document.querySelector("[data-frame].active")?.dataset.frame || "None";
      const qty = parseInt(
        document.getElementById("qty-display")?.textContent || 1,
      );
      addToCart({
        id: "p1",
        name: "Custom Pencil Portrait",
        price,
        image: "https://picsum.photos/seed/portrait-a4/400/530",
        category: "Pencil Portraits",
        size,
        frame,
        qty,
      });
    });
  }
});

// ============================================================
// Custom Order Form
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("custom-order-form");
  if (!form) return;
  const uploadInput = document.getElementById("photo-upload");
  const uploadPreview = document.getElementById("upload-preview");
  const origHTML = uploadPreview ? uploadPreview.innerHTML : "";
  if (uploadInput && uploadPreview) {
    uploadInput.addEventListener("change", () => {
      const file = uploadInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        uploadPreview.innerHTML = `<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover;border-radius:var(--radius2)" alt="Preview">`;
      };
      reader.readAsDataURL(file);
    });
  }
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    showToast(
      '<i class="fas fa-check-circle"></i> Order placed! We\'ll WhatsApp you within 2 hours.',
      "success",
      6000,
    );
    setTimeout(() => (window.location.href = "order-success.html"), 2000);
  });
  const zone = document.getElementById("upload-zone");
  if (zone) {
    zone.addEventListener("dragover", (e) => {
      e.preventDefault();
      zone.classList.add("dragover");
    });
    zone.addEventListener("dragleave", () => zone.classList.remove("dragover"));
    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      zone.classList.remove("dragover");
      const file = e.dataTransfer.files[0];
      if (file && uploadPreview) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          uploadPreview.innerHTML = `<img src="${ev.target.result}" style="width:100%;height:100%;object-fit:cover;border-radius:var(--radius2)" alt="Preview">`;
        };
        reader.readAsDataURL(file);
      }
    });
  }
});

// ============================================================
// Gallery Thumbnails (product page)
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const mainImg = document.getElementById("gallery-main");
  document.querySelectorAll(".gallery-thumb").forEach((thumb) => {
    thumb.addEventListener("click", () => {
      document
        .querySelectorAll(".gallery-thumb")
        .forEach((t) => t.classList.remove("active"));
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
// Admin — Products localStorage
// ============================================================
const PRODUCTS_KEY = "artcraft_products";

const DEFAULT_PRODUCTS = [
  {
    id: "p1",
    name: "A4 Pencil Portrait",
    cat: "pencil",
    size: "a4",
    frame: "none",
    price: 899,
    oldPrice: 1299,
    image: "https://picsum.photos/seed/portrait-a4/400/530",
    badge: "Bestseller",
    category: "Pencil Portraits",
    stock: 15,
  },
  {
    id: "p2",
    name: "Mandala Circle Art",
    cat: "mandala",
    size: "medium",
    frame: "none",
    price: 1299,
    image: "https://picsum.photos/seed/mandala-round/400/530",
    category: "Mandala Art",
    stock: 8,
  },
  {
    id: "p3",
    name: "Lippan Mirror Decor",
    cat: "lippan",
    size: "medium",
    frame: "none",
    price: 1599,
    badge: "New",
    image: "https://picsum.photos/seed/lippan-wall/400/530",
    category: "Lippan Art",
    stock: 6,
  },
  {
    id: "p4",
    name: "A3 Pencil Portrait",
    cat: "pencil",
    size: "a3",
    frame: "none",
    price: 1299,
    oldPrice: 1799,
    image: "https://picsum.photos/seed/portrait-a3/400/530",
    category: "Pencil Portraits",
    stock: 10,
  },
  {
    id: "p5",
    name: "Couple Portrait A4",
    cat: "pencil",
    size: "a4",
    frame: "black",
    price: 1499,
    image: "https://picsum.photos/seed/couple-portrait/400/530",
    category: "Pencil Portraits",
    stock: 12,
  },
  {
    id: "p6",
    name: "Large Mandala Wall",
    cat: "mandala",
    size: "large",
    frame: "none",
    price: 1899,
    image: "https://picsum.photos/seed/mandala-large/400/530",
    category: "Mandala Art",
    stock: 5,
  },
  {
    id: "p7",
    name: "Pet Portrait A4",
    cat: "pencil",
    size: "a4",
    frame: "wood",
    price: 999,
    image: "https://picsum.photos/seed/pet-portrait/400/530",
    category: "Pencil Portraits",
    stock: 20,
  },
  {
    id: "p8",
    name: "Lippan Panel Large",
    cat: "lippan",
    size: "large",
    frame: "none",
    price: 2199,
    image: "https://picsum.photos/seed/lippan-panel/400/530",
    category: "Lippan Art",
    stock: 4,
  },
  {
    id: "p9",
    name: "A4 Portrait Golden Frame",
    cat: "pencil",
    size: "a4",
    frame: "gold",
    price: 1449,
    badge: "Premium",
    image: "https://picsum.photos/seed/portrait-gold/400/530",
    category: "Pencil Portraits",
    stock: 9,
  },
  {
    id: "p10",
    name: "Mandala Triptych",
    cat: "mandala",
    size: "large",
    frame: "none",
    price: 2499,
    image: "https://picsum.photos/seed/mandala-trip/400/530",
    category: "Mandala Art",
    stock: 3,
  },
  {
    id: "p11",
    name: "Family Portrait A3",
    cat: "pencil",
    size: "a3",
    frame: "wood",
    price: 1899,
    image: "https://picsum.photos/seed/family-portrait/400/530",
    category: "Pencil Portraits",
    stock: 7,
  },
  {
    id: "p12",
    name: "Lippan Door Decor",
    cat: "lippan",
    size: "medium",
    frame: "none",
    price: 1299,
    image: "https://picsum.photos/seed/lippan-door/400/530",
    category: "Lippan Art",
    stock: 11,
  },
];

function getProducts() {
  return (
    JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "null") || DEFAULT_PRODUCTS
  );
}
function saveProducts(p) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(p));
}

// ============================================================
// Admin Edit Image (for all pages)
// ============================================================
function adminEditImage(imgEl) {
  if (!isAdmin()) return;
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      imgEl.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

function makeImagesEditable() {
  if (!isAdmin()) return;
  document.querySelectorAll("img:not(.no-admin-edit)").forEach((img) => {
    if (
      img.closest(
        ".cursor-dot,.cursor-ring,.loading-screen,.review-avatar,.gallery-thumb",
      )
    )
      return;
    img.style.cursor = "pointer";
    img.title = "Admin: click to change image";
    img.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      adminEditImage(this);
    });
    const wrap = img.parentElement;
    if (wrap && !wrap.querySelector(".admin-edit-badge")) {
      wrap.style.position = "relative";
      const badge = document.createElement("div");
      badge.className = "admin-edit-badge";
      badge.innerHTML = '<i class="fas fa-pencil-alt"></i>';
      badge.title = "Edit image";
      badge.onclick = (e) => {
        e.stopPropagation();
        adminEditImage(img);
      };
      wrap.appendChild(badge);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (isAdmin()) {
    makeImagesEditable();
    // Add admin banner
    const banner = document.createElement("div");
    banner.style.cssText =
      "position:fixed;top:var(--nav-h);left:0;right:0;background:var(--gold);color:var(--bg);text-align:center;padding:6px;font-size:0.78rem;font-weight:600;z-index:9990;letter-spacing:0.08em";
    banner.innerHTML =
      '<i class="fas fa-crown"></i> ADMIN MODE — <a href="admin.html" style="color:var(--bg);text-decoration:underline">Go to Dashboard</a>';
    document.body.appendChild(banner);
    document.body.style.paddingTop = "calc(var(--nav-h) + 30px)";
  }
});

// ============================================================
// Service Worker
// ============================================================
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
