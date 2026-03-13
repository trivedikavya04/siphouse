/* ============================================
   SIP HOUSE CAFE — script.js
   ============================================ */

// ── CATEGORY FILTER ────────────────────────
function showCategory(cat, btn) {
    // Update active button
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Show/hide sections
    const sections = document.querySelectorAll('.menu-section');
    sections.forEach(sec => {
        if (cat === 'all' || sec.dataset.cat === cat) {
            sec.classList.remove('hidden');
            sec.style.animation = 'none';
            sec.offsetHeight; // reflow
            sec.style.animation = 'fadeUp 0.45s ease both';
        } else {
            sec.classList.add('hidden');
        }
    });

    // Scroll category button into view
    btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}

// ── CART STATE ─────────────────────────────
let cart = [];

function addItem(name, price) {
    const existing = cart.find(i => i.name === name);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ name, price, qty: 1 });
    }
    updateCartUI();
    showToast('Added: ' + name.substring(0, 28) + (name.length > 28 ? '…' : ''));
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function updateCartUI() {
    const total = cart.reduce((s, i) => s + i.qty, 0);
    document.getElementById('cartCount').textContent = total;

    const container = document.getElementById('cartItems');
    const empty = document.getElementById('cartEmpty');
    const totalEl = document.getElementById('cartTotal');

    // Clear old items (keep empty div)
    Array.from(container.children).forEach(c => {
        if (!c.classList.contains('cart-empty')) c.remove();
    });

    if (cart.length === 0) {
        empty.style.display = 'flex';
        totalEl.textContent = '₹0';
        return;
    }

    empty.style.display = 'none';

    let sum = 0;
    cart.forEach((item, idx) => {
        sum += item.price * item.qty;
        const row = document.createElement('div');
        row.className = 'cart-item';
        row.innerHTML = `
      <div class="cart-item-name">
        ${item.name}
        <span class="cart-item-qty"> × ${item.qty}</span>
      </div>
      <span class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</span>
      <button class="btn-remove" onclick="removeItem(${idx})" title="Remove">
        <i class="bi bi-x"></i>
      </button>
    `;
        container.appendChild(row);
    });

    totalEl.textContent = '₹' + Math.round(sum);
}

// ── CART DRAWER ────────────────────────────
function openCart() {
    document.getElementById('cartDrawer').classList.add('open');
    document.getElementById('cartOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    document.getElementById('cartDrawer').classList.remove('open');
    document.getElementById('cartOverlay').classList.remove('open');
    document.body.style.overflow = '';
}

// ── PLACE ORDER ────────────────────────────
function placeOrder() {
    if (cart.length === 0) {
        showToast('Add something first!');
        return;
    }
    closeCart();
    const ref = 'SH' + Math.floor(1000 + Math.random() * 9000);
    document.getElementById('orderRef').textContent = ref;
    document.getElementById('orderModal').classList.add('open');
}

function closeOrderModal() {
    document.getElementById('orderModal').classList.remove('open');
    cart = [];
    updateCartUI();
}

// ── TOAST ──────────────────────────────────
function showToast(msg) {
    const toast = document.getElementById('addToast');
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2200);
}

// ── STICKY NAV SHADOW ──────────────────────
window.addEventListener('scroll', () => {
    const nav = document.getElementById('catNav');
    if (window.scrollY > 10) {
        nav.style.boxShadow = '0 4px 16px rgba(160,125,88,0.18)';
    } else {
        nav.style.boxShadow = '0 2px 12px rgba(160,125,88,0.1)';
    }
}, { passive: true });

// ── LAZY LOAD IMAGES ───────────────────────
if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const img = e.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    imgObserver.unobserve(img);
                }
            }
        });
    }, { rootMargin: '200px' });

    document.querySelectorAll('img[loading="lazy"]').forEach(img => imgObserver.observe(img));
}

// ── CARD ENTRANCE ANIMATION ────────────────
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
        if (e.isIntersecting) {
            e.target.style.transitionDelay = (i * 0.06) + 's';
            e.target.style.opacity = '1';
            e.target.style.transform = 'translateY(0)';
            cardObserver.unobserve(e.target);
        }
    });
}, { threshold: 0.08 });

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.drink-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(28px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        cardObserver.observe(card);
    });
});