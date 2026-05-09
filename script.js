const APP_KEY = "arenax_clone_state_v1";
const USERS_KEY = "arenax_clone_users_v1";
const SESSION_KEY = "arenax_clone_session_v1";
const ADMIN_KEY = "arenax_clone_admin_unlocked_v1";

const assetBase = "https://cipher-flare.lovable.app/assets/";

const defaultState = {
  adminPinHash: hashPin("2468"),
  settings: {
    brandName: "ARENAX.GG",
    seasonLabel: "Season 07 - Live Now",
    heroLineOne: "Enter The Next Level Of",
    heroLineTwo: "Competitive Gaming",
    heroSubtitle:
      "Join tournaments, compete with top players, win real rewards, and rise through the global esports rankings.",
    heroImage: `${assetBase}hero-esports-C71hHoYp.jpg`,
    weaponImage: `${assetBase}reveal-weapon-C6MoEU6L.jpg`,
    streamImage: `${assetBase}hero-esports-C71hHoYp.jpg`
  },
  qr: {
    upiId: "your-upi-id@bank",
    qrImage: ""
  },
  stats: [
    { icon: "users", value: "1.2M+", label: "Registered Players" },
    { icon: "trophy", value: "Rs 4.8M", label: "Prize Pool Awarded" },
    { icon: "zap", value: "24/7", label: "Live Tournaments" }
  ],
  tournaments: [
    {
      id: uid("t"),
      mode: "Squad Classic",
      title: "Booyah Royale Cup",
      entry: 49,
      prize: "Rs 50,000",
      type: "Bermuda - TPP",
      slots: 8,
      filled: 83,
      startsIn: "00:46:57",
      status: "open",
      icon: "crown"
    },
    {
      id: uid("t"),
      mode: "Solo Classic",
      title: "Solo Sniper Showdown",
      entry: 19,
      prize: "Rs 15,000",
      type: "Kalahari - FPP",
      slots: 23,
      filled: 54,
      startsIn: "01:29:57",
      status: "open",
      icon: "skull"
    },
    {
      id: uid("t"),
      mode: "Duo Classic",
      title: "Duo Domination",
      entry: 29,
      prize: "Rs 25,000",
      type: "Purgatory - TPP",
      slots: 4,
      filled: 84,
      startsIn: "00:21:57",
      status: "open",
      icon: "users"
    },
    {
      id: uid("t"),
      mode: "Clash Squad",
      title: "Clash Squad Pro",
      entry: 39,
      prize: "Rs 35,000",
      type: "BO5 - Ranked",
      slots: 12,
      filled: 63,
      startsIn: "01:59:57",
      status: "open",
      icon: "swords"
    },
    {
      id: uid("t"),
      mode: "Surprise Tournament",
      title: "Mystery Booyah",
      entry: 0,
      prize: "???",
      type: "Random Mode",
      slots: 41,
      filled: 59,
      startsIn: "04:59:57",
      status: "open",
      icon: "sparkles"
    },
    {
      id: uid("t"),
      mode: "Squad Classic",
      title: "Apex Legion Open",
      entry: 99,
      prize: "Rs 1,20,000",
      type: "Bermuda - TPP",
      slots: 2,
      filled: 92,
      startsIn: "00:17:57",
      status: "open",
      icon: "flame"
    }
  ],
  winners: [
    {
      rank: 2,
      initials: "NI",
      handle: "NIGHTFALL",
      name: "Riya 'Specter' Das",
      kd: "7.9",
      wins: "128",
      region: "IN",
      earnings: "Rs 1,40,000"
    },
    {
      rank: 1,
      initials: "PH",
      handle: "PHANTOM-X",
      name: "Aarav 'Vortex' Khan",
      kd: "8.4",
      wins: "142",
      region: "IN",
      earnings: "Rs 1,82,000",
      featured: true
    },
    {
      rank: 3,
      initials: "ZE",
      handle: "ZEN-OPS",
      name: "Imran 'Echo' Hossain",
      kd: "7.5",
      wins: "119",
      region: "BD",
      earnings: "Rs 98,000"
    }
  ],
  rankings: [
    { rank: "01", team: "Apex Legion", tier: "Pro Tier", points: "9,842", change: "+128" },
    { rank: "02", team: "Crimson Guard", tier: "Pro Tier", points: "9,610", change: "+96" },
    { rank: "03", team: "Neon Vipers", tier: "Pro Tier", points: "9,433", change: "+72" },
    { rank: "04", team: "Shadow Cells", tier: "Pro Tier", points: "9,201", change: "+58" },
    { rank: "05", team: "Iron Pulse", tier: "Pro Tier", points: "9,048", change: "+44" }
  ],
  support: [
    { label: "WhatsApp", url: "https://wa.me/919999999999", icon: "message-circle" },
    { label: "Telegram", url: "https://t.me/arenax_support", icon: "send" },
    { label: "Instagram", url: "https://instagram.com/arenax.gg", icon: "camera" },
    { label: "Discord", url: "https://discord.gg/arenax", icon: "radio" }
  ],
  payments: []
};

let appState = loadJson(APP_KEY, defaultState);
let users = loadJson(USERS_KEY, {});
let session = loadJson(SESSION_KEY, null);
let authMode = "login";
let adminTab = "content";
let editingTournamentId = null;

document.addEventListener("DOMContentLoaded", () => {
  ensureStateShape();
  bindEvents();
  handleRoute();
  renderAll();
});

function ensureStateShape() {
  appState = {
    ...structuredClone(defaultState),
    ...appState,
    settings: { ...defaultState.settings, ...(appState.settings || {}) },
    qr: { ...defaultState.qr, ...(appState.qr || {}) },
    stats: Array.isArray(appState.stats) ? appState.stats : defaultState.stats,
    tournaments: Array.isArray(appState.tournaments) ? appState.tournaments : defaultState.tournaments,
    winners: Array.isArray(appState.winners) ? appState.winners : defaultState.winners,
    rankings: Array.isArray(appState.rankings) ? appState.rankings : defaultState.rankings,
    support: Array.isArray(appState.support) ? appState.support : defaultState.support,
    payments: Array.isArray(appState.payments) ? appState.payments : []
  };
  appState.support = appState.support.map((item) =>
    item.icon === "instagram" ? { ...item, icon: "camera" } : item
  );
  saveApp();
}

function bindEvents() {
  document.body.addEventListener("click", (event) => {
    const actionEl = event.target.closest("[data-action]");
    if (!actionEl) return;
    const action = actionEl.dataset.action;
    if (action === "toggle-menu") document.body.classList.toggle("menu-open");
    if (action === "open-login") openAuth("login");
    if (action === "open-signup") openAuth("signup");
    if (action === "close-modals") closeModals();
    if (action === "logout") logout();
    if (action === "open-recharge") openRecharge();
    if (action === "join-tournament") joinTournament(actionEl.dataset.id);
    if (action === "admin-tab") {
      adminTab = actionEl.dataset.tab;
      renderAdmin();
    }
    if (action === "unlock-admin") unlockAdmin();
    if (action === "lock-admin") lockAdmin();
    if (action === "approve-payment") updatePayment(actionEl.dataset.id, "approved");
    if (action === "reject-payment") updatePayment(actionEl.dataset.id, "rejected");
    if (action === "edit-tournament") {
      editingTournamentId = actionEl.dataset.id;
      adminTab = "tournaments";
      renderAdmin();
    }
    if (action === "delete-tournament") deleteTournament(actionEl.dataset.id);
    if (action === "toggle-tournament") toggleTournament(actionEl.dataset.id);
    if (action === "reset-tournament-form") {
      editingTournamentId = null;
      renderAdmin();
    }
    if (action === "add-coins") addCoins(actionEl.dataset.email);
    if (action === "reset-demo") resetDemo();
  });

  document.body.addEventListener("submit", (event) => {
    if (event.target.matches("[data-auth-form]")) handleAuthSubmit(event);
    if (event.target.matches("[data-recharge-form]")) handleRechargeSubmit(event);
    if (event.target.matches("[data-newsletter-form]")) {
      event.preventDefault();
      event.target.reset();
      toast("Newsletter subscription saved.");
    }
    if (event.target.matches("[data-site-form]")) saveSiteSettings(event);
    if (event.target.matches("[data-qr-form]")) saveQrSettings(event);
    if (event.target.matches("[data-tournament-form]")) saveTournament(event);
    if (event.target.matches("[data-pin-form]")) saveAdminPin(event);
    if (event.target.matches("[data-stats-form]")) saveStats(event);
  });

  document.body.addEventListener("click", (event) => {
    const modeButton = event.target.closest("[data-auth-mode]");
    if (!modeButton) return;
    authMode = modeButton.dataset.authMode;
    renderAuthMode();
  });

  document.querySelectorAll(".modal-backdrop").forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModals();
    });
  });

  window.addEventListener("hashchange", handleRoute);
}

function handleRoute() {
  document.body.classList.remove("menu-open");
  const hash = window.location.hash || "#home";
  document.body.classList.toggle("admin-mode", hash === "#admin");
  const main = document.querySelector("main");
  const dashboard = document.querySelector("#dashboard");
  const admin = document.querySelector("#admin");

  main.hidden = hash === "#dashboard" || hash === "#admin";
  dashboard.hidden = hash !== "#dashboard";
  admin.hidden = hash !== "#admin";

  if (hash === "#dashboard" && !currentUser()) {
    openAuth("login");
    window.location.hash = "#home";
    return;
  }

  if (hash === "#admin") {
    renderAdmin();
  }

  if (hash === "#dashboard" || hash === "#admin") {
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "auto" }));
  }

  if (hash !== "#dashboard" && hash !== "#admin") {
    requestAnimationFrame(() => {
      const target = document.querySelector(hash);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  renderAll();
}

function renderAll() {
  renderBoundContent();
  renderNav();
  renderStats();
  renderTournaments();
  renderWinners();
  renderRankings();
  renderSupport();
  renderDashboard();
  renderQrBox();
  refreshIcons();
}

function renderBoundContent() {
  Object.entries(appState.settings).forEach(([key, value]) => {
    document.querySelectorAll(`[data-bind="${key}"]`).forEach((node) => {
      node.textContent = value;
    });
    document.querySelectorAll(`[data-bind-src="${key}"]`).forEach((node) => {
      node.src = value;
    });
  });
}

function renderNav() {
  const slot = document.querySelector("[data-auth-slot]");
  const user = currentUser();
  if (!slot) return;
  if (!user) {
    slot.innerHTML = `
      <button class="text-button" type="button" data-action="open-login">Login</button>
      <button class="btn btn-gradient" type="button" data-action="open-signup">Register</button>
    `;
    return;
  }
  slot.innerHTML = `
    <a class="wallet-pill" href="#dashboard" aria-label="Open dashboard">
      <i data-lucide="coins"></i>
      <span data-nav-coins>${user.coins || 0}</span>
      <span>coins</span>
    </a>
    <div class="user-menu">
      <strong>${escapeHtml(user.name)}</strong>
      <button class="icon-button" type="button" data-action="logout" aria-label="Logout">
        <i data-lucide="log-out"></i>
      </button>
    </div>
  `;
}

function renderStats() {
  const list = document.querySelector("[data-stats-list]");
  if (!list) return;
  list.innerHTML = appState.stats
    .map(
      (stat) => `
        <article class="stat-tile">
          <i data-lucide="${escapeAttr(stat.icon || "zap")}"></i>
          <strong>${escapeHtml(stat.value)}</strong>
          <span>${escapeHtml(stat.label)}</span>
        </article>
      `
    )
    .join("");
}

function renderTournaments() {
  const list = document.querySelector("[data-tournament-list]");
  if (!list) return;
  const user = currentUser();
  document.querySelectorAll("[data-wallet-balance]").forEach((node) => {
    node.textContent = `${user?.coins || 0} coins`;
  });
  list.innerHTML = appState.tournaments
    .map((tour) => {
      const joined = user?.joined?.includes(tour.id);
      const open = tour.status === "open" && Number(tour.slots) > 0;
      const entryText = Number(tour.entry) > 0 ? `${tour.entry} coins` : "Free";
      return `
        <article class="tournament-card">
          <div class="card-top">
            <span class="mode-icon"><i data-lucide="${escapeAttr(tour.icon || "trophy")}"></i></span>
            <div>
              <small>${escapeHtml(tour.mode)}</small>
              <h3>${escapeHtml(tour.title)}</h3>
            </div>
            <div class="countdown">
              <span>Starts In</span>
              <strong>${escapeHtml(tour.startsIn)}</strong>
            </div>
          </div>
          <div class="tournament-meta">
            <div><span>Entry</span><strong>${entryText}</strong></div>
            <div><span>Prize</span><strong>${escapeHtml(tour.prize)}</strong></div>
            <div><span>Type</span><strong>${escapeHtml(tour.type)}</strong></div>
          </div>
          <div>
            <div class="progress-track"><span style="width: ${clamp(Number(tour.filled), 0, 100)}%"></span></div>
          </div>
          <div class="card-foot">
            <span class="slots-left">${Number(tour.slots)} slots left</span>
            <button
              class="btn ${joined ? "btn-outline" : "btn-gradient"}"
              type="button"
              data-action="join-tournament"
              data-id="${tour.id}"
              ${!open && !joined ? "disabled" : ""}
            >
              ${joined ? "Joined" : open ? "Join Tournament" : "Closed"}
            </button>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderWinners() {
  const list = document.querySelector("[data-winners-list]");
  if (!list) return;
  list.innerHTML = appState.winners
    .map(
      (winner) => `
        <article class="winner-card ${winner.featured ? "featured" : ""}">
          <span class="rank-chip">#${escapeHtml(winner.rank)}</span>
          <div class="avatar">${escapeHtml(winner.initials)}</div>
          <h3>${escapeHtml(winner.handle)}</h3>
          <p>${escapeHtml(winner.name)}</p>
          <div class="winner-metrics">
            <div><span>K/D</span><strong>${escapeHtml(winner.kd)}</strong></div>
            <div><span>Wins</span><strong>${escapeHtml(winner.wins)}</strong></div>
            <div><span>Region</span><strong>${escapeHtml(winner.region)}</strong></div>
          </div>
          <div class="earnings"><span>Total Earnings</span><strong>${escapeHtml(winner.earnings)}</strong></div>
        </article>
      `
    )
    .join("");
}

function renderRankings() {
  const list = document.querySelector("[data-ranking-list]");
  if (!list) return;
  list.innerHTML = appState.rankings
    .map(
      (row) => `
        <div class="rank-row">
          <strong>${escapeHtml(row.rank)}</strong>
          <div><strong>${escapeHtml(row.team)}</strong><span>${escapeHtml(row.tier)}</span></div>
          <strong>${escapeHtml(row.points)}</strong>
          <em>${escapeHtml(row.change)}</em>
        </div>
      `
    )
    .join("");
}

function renderSupport() {
  const list = document.querySelector("[data-support-links]");
  if (!list) return;
  list.innerHTML = appState.support
    .map(
      (item) => `
        <a href="${escapeAttr(item.url)}" target="_blank" rel="noreferrer">
          <i data-lucide="${escapeAttr(item.icon || "message-circle")}"></i>
          <div>
            <strong>${escapeHtml(item.label)}</strong>
            <span>Tap to chat</span>
          </div>
        </a>
      `
    )
    .join("");
}

function renderDashboard() {
  const user = currentUser();
  if (!user) return;
  document.querySelectorAll("[data-dashboard-coins]").forEach((node) => {
    node.textContent = user.coins || 0;
  });
  const joinedList = document.querySelector("[data-joined-list]");
  if (joinedList) {
    const joined = appState.tournaments.filter((tour) => user.joined?.includes(tour.id));
    joinedList.innerHTML = joined.length
      ? joined
          .map(
            (tour) => `
              <div class="joined-item">
                <strong>${escapeHtml(tour.title)}</strong>
                <div class="admin-muted">${escapeHtml(tour.mode)} - ${escapeHtml(tour.type)}</div>
              </div>
            `
          )
          .join("")
      : `<div class="empty-state">No tournaments joined yet.</div>`;
  }
  const history = document.querySelector("[data-payment-history]");
  if (history) {
    const items = appState.payments
      .filter((payment) => payment.email === user.email)
      .sort((a, b) => b.createdAt - a.createdAt);
    history.innerHTML = items.length
      ? items
          .map(
            (payment) => `
              <div class="history-item">
                <strong>${payment.amount} coins</strong>
                <span class="status ${payment.status}">${payment.status}</span>
                <div class="admin-muted">${escapeHtml(payment.utr)}</div>
              </div>
            `
          )
          .join("")
      : `<div class="empty-state">No recharge requests yet.</div>`;
  }
}

function renderQrBox() {
  const box = document.querySelector("[data-qr-box]");
  if (!box) return;
  if (appState.qr.qrImage) {
    box.innerHTML = `<img src="${escapeAttr(appState.qr.qrImage)}" alt="Payment QR code" />`;
  } else {
    box.innerHTML = `<div class="qr-placeholder">Add your QR from Admin Panel</div>`;
  }
}

function openAuth(mode = "login") {
  authMode = mode;
  document.querySelector('[data-modal="auth"]').hidden = false;
  renderAuthMode();
}

function renderAuthMode() {
  document.querySelectorAll("[data-auth-mode]").forEach((button) => {
    button.classList.toggle("active", button.dataset.authMode === authMode);
  });
  const form = document.querySelector("[data-auth-form]");
  if (!form) return;
  const nameInput = form.querySelector('input[name="name"]');
  const passwordInput = form.querySelector('input[name="password"]');
  if (nameInput) nameInput.closest("label").hidden = authMode === "login";
  if (passwordInput) passwordInput.autocomplete = authMode === "login" ? "current-password" : "new-password";
}

function handleAuthSubmit(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target));
  const email = normalizeEmail(data.email);
  if (!email || !data.password) return;

  if (authMode === "signup") {
    if (users[email]) {
      toast("This email is already registered.");
      return;
    }
    users[email] = {
      email,
      name: (data.name || email.split("@")[0]).trim(),
      password: data.password,
      coins: 0,
      joined: []
    };
    saveUsers();
  } else {
    if (!users[email] || users[email].password !== data.password) {
      toast("Login details do not match.");
      return;
    }
  }

  session = { email };
  saveJson(SESSION_KEY, session);
  closeModals();
  event.target.reset();
  renderAll();
  toast("Welcome to the arena.");
}

function logout() {
  session = null;
  localStorage.removeItem(SESSION_KEY);
  renderAll();
  toast("Logged out.");
}

function openRecharge() {
  if (!currentUser()) {
    openAuth("login");
    return;
  }
  document.querySelector('[data-modal="recharge"]').hidden = false;
  renderQrBox();
}

function handleRechargeSubmit(event) {
  event.preventDefault();
  const user = currentUser();
  if (!user) {
    openAuth("login");
    return;
  }
  const data = Object.fromEntries(new FormData(event.target));
  const amount = Math.floor(Number(data.amount));
  if (!amount || amount < 1) {
    toast("Enter a valid recharge amount.");
    return;
  }
  appState.payments.push({
    id: uid("p"),
    email: user.email,
    name: user.name,
    amount,
    coins: amount,
    utr: data.utr.trim(),
    status: "pending",
    createdAt: Date.now()
  });
  saveApp();
  closeModals();
  event.target.reset();
  renderAll();
  toast("Payment submitted for admin approval.");
}

function joinTournament(id) {
  const user = currentUser();
  if (!user) {
    openAuth("login");
    return;
  }
  const tournament = appState.tournaments.find((item) => item.id === id);
  if (!tournament) return;
  if (user.joined?.includes(id)) {
    toast("You already joined this tournament.");
    return;
  }
  if (tournament.status !== "open" || Number(tournament.slots) <= 0) {
    toast("This tournament is closed.");
    return;
  }
  const entry = Number(tournament.entry) || 0;
  if ((user.coins || 0) < entry) {
    toast(`Recharge ${entry - (user.coins || 0)} more coins to join.`);
    openRecharge();
    return;
  }
  user.coins = (user.coins || 0) - entry;
  user.joined = [...(user.joined || []), id];
  tournament.slots = Math.max(0, Number(tournament.slots) - 1);
  tournament.filled = clamp(Number(tournament.filled) + 3, 0, 100);
  saveUsers();
  saveApp();
  renderAll();
  toast(`${entry} coins deducted. You are in.`);
}

function closeModals() {
  document.querySelectorAll(".modal-backdrop").forEach((modal) => {
    modal.hidden = true;
  });
}

function currentUser() {
  if (!session?.email) return null;
  return users[session.email] || null;
}

function renderAdmin() {
  const root = document.querySelector("[data-admin-root]");
  if (!root) return;
  if (sessionStorage.getItem(ADMIN_KEY) !== "yes") {
    root.innerHTML = `
      <article class="admin-card lock-card">
        <h2>Admin Locked</h2>
        <label class="field">
          <span>Owner PIN</span>
          <input data-admin-pin-input type="password" autocomplete="current-password" placeholder="Enter PIN" />
        </label>
        <button class="btn btn-gradient" type="button" data-action="unlock-admin">
          <i data-lucide="lock-keyhole"></i>
          Unlock Panel
        </button>
      </article>
    `;
    refreshIcons();
    return;
  }

  root.innerHTML = `
    <div class="admin-shell">
      <aside class="admin-tabs">
        ${adminTabButton("content", "layout-dashboard", "Content")}
        ${adminTabButton("payments", "qr-code", "Payments")}
        ${adminTabButton("tournaments", "trophy", "Tournaments")}
        ${adminTabButton("players", "users", "Players")}
        ${adminTabButton("security", "shield", "Security")}
      </aside>
      <div class="admin-grid">${adminPanelContent()}</div>
    </div>
  `;
  refreshIcons();
}

function adminTabButton(tab, icon, label) {
  return `
    <button class="${adminTab === tab ? "active" : ""}" type="button" data-action="admin-tab" data-tab="${tab}">
      <i data-lucide="${icon}"></i>
      ${label}
    </button>
  `;
}

function adminPanelContent() {
  if (adminTab === "content") return contentAdmin();
  if (adminTab === "payments") return paymentsAdmin();
  if (adminTab === "tournaments") return tournamentsAdmin();
  if (adminTab === "players") return playersAdmin();
  return securityAdmin();
}

function contentAdmin() {
  const s = appState.settings;
  return `
    <article class="admin-card">
      <h2>Homepage Content</h2>
      <form data-site-form>
        <div class="form-grid">
          ${inputField("Brand name", "brandName", s.brandName)}
          ${inputField("Season label", "seasonLabel", s.seasonLabel)}
          ${inputField("Hero line one", "heroLineOne", s.heroLineOne)}
          ${inputField("Hero line two", "heroLineTwo", s.heroLineTwo)}
          ${textareaField("Hero subtitle", "heroSubtitle", s.heroSubtitle, "wide")}
          ${inputField("Hero image URL", "heroImage", s.heroImage, "url wide")}
          ${inputField("Weapon image URL", "weaponImage", s.weaponImage, "url wide")}
          ${inputField("Stream image URL", "streamImage", s.streamImage, "url wide")}
        </div>
        <button class="btn btn-gradient" type="submit"><i data-lucide="save"></i> Save Content</button>
      </form>
    </article>
    <article class="admin-card">
      <h2>Hero Stats</h2>
      <form data-stats-form>
        <div class="form-grid">
          ${appState.stats
            .map(
              (stat, index) => `
                ${inputField(`Stat ${index + 1} value`, `value-${index}`, stat.value)}
                ${inputField(`Stat ${index + 1} label`, `label-${index}`, stat.label)}
                ${inputField(`Stat ${index + 1} icon`, `icon-${index}`, stat.icon, "wide")}
              `
            )
            .join("")}
        </div>
        <button class="btn btn-gradient" type="submit"><i data-lucide="save"></i> Save Stats</button>
      </form>
    </article>
  `;
}

function paymentsAdmin() {
  const pending = appState.payments.filter((payment) => payment.status === "pending").length;
  return `
    <article class="admin-card">
      <h2>Payment QR</h2>
      <form data-qr-form>
        <div class="form-grid">
          ${inputField("UPI ID", "upiId", appState.qr.upiId)}
          ${inputField("QR image URL", "qrImage", appState.qr.qrImage, "url")}
          <label class="field wide">
            <span>Upload QR image</span>
            <input name="qrFile" type="file" accept="image/*" />
          </label>
        </div>
        <button class="btn btn-gradient" type="submit"><i data-lucide="save"></i> Save QR</button>
      </form>
    </article>
    <article class="admin-card">
      <h2>Recharge Requests <span class="status pending">${pending} pending</span></h2>
      <div>${paymentsList()}</div>
    </article>
  `;
}

function paymentsList() {
  const items = [...appState.payments].sort((a, b) => b.createdAt - a.createdAt);
  if (!items.length) return `<div class="empty-state">No recharge requests yet.</div>`;
  return items
    .map(
      (payment) => `
        <div class="payment-item">
          <div>
            <strong>${escapeHtml(payment.name)} - ${payment.amount} coins</strong>
            <div class="admin-muted">${escapeHtml(payment.email)} - ${escapeHtml(payment.utr)}</div>
            <span class="status ${payment.status}">${payment.status}</span>
          </div>
          <div class="row-actions">
            ${
              payment.status === "pending"
                ? `
                  <button class="small-btn success" type="button" data-action="approve-payment" data-id="${payment.id}">
                    <i data-lucide="check"></i> Approve
                  </button>
                  <button class="small-btn danger" type="button" data-action="reject-payment" data-id="${payment.id}">
                    <i data-lucide="x"></i> Reject
                  </button>
                `
                : ""
            }
          </div>
        </div>
      `
    )
    .join("");
}

function tournamentsAdmin() {
  const editing = appState.tournaments.find((tour) => tour.id === editingTournamentId);
  const emptyTour = {
    mode: "",
    title: "",
    entry: 0,
    prize: "",
    type: "",
    slots: 1,
    filled: 10,
    startsIn: "01:00:00",
    status: "open",
    icon: "trophy"
  };
  const tour = editing || emptyTour;
  return `
    <article class="admin-card">
      <h2>${editing ? "Edit Tournament" : "Add Tournament"}</h2>
      <form data-tournament-form>
        <input type="hidden" name="id" value="${editing?.id || ""}" />
        <div class="form-grid">
          ${inputField("Mode", "mode", tour.mode)}
          ${inputField("Title", "title", tour.title)}
          ${inputField("Entry coins", "entry", tour.entry, "number")}
          ${inputField("Prize", "prize", tour.prize)}
          ${inputField("Type", "type", tour.type)}
          ${inputField("Slots left", "slots", tour.slots, "number")}
          ${inputField("Filled percent", "filled", tour.filled, "number")}
          ${inputField("Starts in", "startsIn", tour.startsIn)}
          ${inputField("Lucide icon", "icon", tour.icon)}
          <label class="field">
            <span>Status</span>
            <select name="status">
              <option value="open" ${tour.status === "open" ? "selected" : ""}>Open</option>
              <option value="closed" ${tour.status === "closed" ? "selected" : ""}>Closed</option>
            </select>
          </label>
        </div>
        <div class="admin-actions">
          <button class="btn btn-gradient" type="submit"><i data-lucide="save"></i> Save Tournament</button>
          <button class="btn btn-outline" type="button" data-action="reset-tournament-form">Clear</button>
        </div>
      </form>
    </article>
    <article class="admin-card">
      <h2>Current Tournaments</h2>
      ${appState.tournaments
        .map(
          (item) => `
            <div class="admin-tournament-row">
              <div>
                <strong>${escapeHtml(item.title)}</strong>
                <div class="admin-muted">${escapeHtml(item.mode)} - ${Number(item.entry)} coins - ${Number(item.slots)} slots</div>
                <span class="status ${item.status}">${item.status}</span>
              </div>
              <div class="row-actions">
                <button class="small-btn" type="button" data-action="edit-tournament" data-id="${item.id}"><i data-lucide="pencil"></i> Edit</button>
                <button class="small-btn" type="button" data-action="toggle-tournament" data-id="${item.id}"><i data-lucide="power"></i> Toggle</button>
                <button class="small-btn danger" type="button" data-action="delete-tournament" data-id="${item.id}"><i data-lucide="trash-2"></i> Delete</button>
              </div>
            </div>
          `
        )
        .join("")}
    </article>
  `;
}

function playersAdmin() {
  const allUsers = Object.values(users);
  return `
    <article class="admin-card">
      <h2>Players</h2>
      ${
        allUsers.length
          ? allUsers
              .map(
                (user) => `
                  <div class="player-row">
                    <div>
                      <strong>${escapeHtml(user.name)}</strong>
                      <div class="admin-muted">${escapeHtml(user.email)} - ${Number(user.coins || 0)} coins - ${(user.joined || []).length} joined</div>
                    </div>
                    <button class="small-btn success" type="button" data-action="add-coins" data-email="${escapeAttr(user.email)}">
                      <i data-lucide="coins"></i> Add 10
                    </button>
                  </div>
                `
              )
              .join("")
          : `<div class="empty-state">No players registered yet.</div>`
      }
    </article>
  `;
}

function securityAdmin() {
  return `
    <article class="admin-card">
      <h2>Admin PIN</h2>
      <form data-pin-form>
        <div class="form-grid">
          <label class="field">
            <span>Current PIN</span>
            <input name="currentPin" type="password" required />
          </label>
          <label class="field">
            <span>New PIN</span>
            <input name="newPin" type="password" minlength="4" required />
          </label>
        </div>
        <div class="admin-actions">
          <button class="btn btn-gradient" type="submit"><i data-lucide="save"></i> Update PIN</button>
          <button class="btn btn-outline" type="button" data-action="lock-admin"><i data-lucide="lock"></i> Lock Panel</button>
        </div>
      </form>
    </article>
    <article class="admin-card danger-zone">
      <h2>Demo Data</h2>
      <p class="muted-text">Reset local content, users, payments, and wallet data in this browser.</p>
      <button class="small-btn danger" type="button" data-action="reset-demo"><i data-lucide="rotate-ccw"></i> Reset Demo</button>
    </article>
  `;
}

function unlockAdmin() {
  const input = document.querySelector("[data-admin-pin-input]");
  if (!input) return;
  if (hashPin(input.value) !== appState.adminPinHash) {
    toast("Wrong admin PIN.");
    return;
  }
  sessionStorage.setItem(ADMIN_KEY, "yes");
  renderAdmin();
  toast("Admin panel unlocked.");
}

function lockAdmin() {
  sessionStorage.removeItem(ADMIN_KEY);
  renderAdmin();
  toast("Admin panel locked.");
}

function saveSiteSettings(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target));
  Object.keys(appState.settings).forEach((key) => {
    if (key in data) appState.settings[key] = data[key].trim();
  });
  saveApp();
  renderAll();
  toast("Homepage content saved.");
}

function saveStats(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target));
  appState.stats = appState.stats.map((stat, index) => ({
    icon: data[`icon-${index}`] || stat.icon,
    value: data[`value-${index}`] || stat.value,
    label: data[`label-${index}`] || stat.label
  }));
  saveApp();
  renderAll();
  toast("Stats saved.");
}

async function saveQrSettings(event) {
  event.preventDefault();
  const form = event.target;
  const data = Object.fromEntries(new FormData(form));
  const file = form.qrFile.files[0];
  appState.qr.upiId = data.upiId.trim();
  appState.qr.qrImage = data.qrImage.trim();
  if (file) {
    appState.qr.qrImage = await fileToDataUrl(file);
  }
  saveApp();
  renderAll();
  renderAdmin();
  toast("Payment QR saved.");
}

function saveTournament(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target));
  const payload = {
    id: data.id || uid("t"),
    mode: data.mode.trim(),
    title: data.title.trim(),
    entry: Math.max(0, Math.floor(Number(data.entry) || 0)),
    prize: data.prize.trim(),
    type: data.type.trim(),
    slots: Math.max(0, Math.floor(Number(data.slots) || 0)),
    filled: clamp(Math.floor(Number(data.filled) || 0), 0, 100),
    startsIn: data.startsIn.trim(),
    status: data.status,
    icon: data.icon.trim() || "trophy"
  };
  if (!payload.title) {
    toast("Tournament title is required.");
    return;
  }
  const index = appState.tournaments.findIndex((item) => item.id === payload.id);
  if (index >= 0) appState.tournaments[index] = payload;
  else appState.tournaments.push(payload);
  editingTournamentId = null;
  saveApp();
  renderAll();
  renderAdmin();
  toast("Tournament saved.");
}

function deleteTournament(id) {
  appState.tournaments = appState.tournaments.filter((item) => item.id !== id);
  Object.values(users).forEach((user) => {
    user.joined = (user.joined || []).filter((joinedId) => joinedId !== id);
  });
  saveApp();
  saveUsers();
  renderAll();
  renderAdmin();
  toast("Tournament deleted.");
}

function toggleTournament(id) {
  const tournament = appState.tournaments.find((item) => item.id === id);
  if (!tournament) return;
  tournament.status = tournament.status === "open" ? "closed" : "open";
  saveApp();
  renderAll();
  renderAdmin();
  toast("Tournament status changed.");
}

function updatePayment(id, status) {
  const payment = appState.payments.find((item) => item.id === id);
  if (!payment || payment.status !== "pending") return;
  payment.status = status;
  if (status === "approved" && users[payment.email]) {
    users[payment.email].coins = (users[payment.email].coins || 0) + Number(payment.coins || payment.amount);
    saveUsers();
  }
  saveApp();
  renderAll();
  renderAdmin();
  toast(status === "approved" ? "Coins credited to player." : "Payment request rejected.");
}

function addCoins(email) {
  if (!users[email]) return;
  users[email].coins = (users[email].coins || 0) + 10;
  saveUsers();
  renderAll();
  renderAdmin();
  toast("10 coins added.");
}

function saveAdminPin(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target));
  if (hashPin(data.currentPin) !== appState.adminPinHash) {
    toast("Current PIN does not match.");
    return;
  }
  appState.adminPinHash = hashPin(data.newPin);
  saveApp();
  event.target.reset();
  toast("Admin PIN updated.");
}

function resetDemo() {
  localStorage.removeItem(APP_KEY);
  localStorage.removeItem(USERS_KEY);
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(ADMIN_KEY);
  appState = structuredClone(defaultState);
  users = {};
  session = null;
  saveApp();
  saveUsers();
  adminTab = "content";
  window.location.hash = "#home";
  renderAll();
  toast("Demo data reset.");
}

function inputField(label, name, value, typeOrClass = "text") {
  const type = ["text", "url", "number", "password", "email"].includes(typeOrClass) ? typeOrClass : "text";
  const className = typeOrClass.includes("wide") ? " wide" : "";
  const inputMode = type === "number" ? ' inputmode="numeric"' : "";
  const renderedType = type === "number" ? "text" : type;
  return `
    <label class="field${className}">
      <span>${escapeHtml(label)}</span>
      <input name="${escapeAttr(name)}" type="${renderedType}"${inputMode} value="${escapeAttr(value ?? "")}" />
    </label>
  `;
}

function textareaField(label, name, value, className = "") {
  return `
    <label class="field ${className}">
      <span>${escapeHtml(label)}</span>
      <textarea name="${escapeAttr(name)}">${escapeHtml(value ?? "")}</textarea>
    </label>
  `;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : structuredClone(fallback);
  } catch {
    return structuredClone(fallback);
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function saveApp() {
  saveJson(APP_KEY, appState);
}

function saveUsers() {
  saveJson(USERS_KEY, users);
}

function uid(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function hashPin(pin) {
  const value = String(pin || "");
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return (hash >>> 0).toString(16);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}

function toast(message) {
  const stack = document.querySelector("[data-toast-stack]");
  if (!stack) return;
  const node = document.createElement("div");
  node.className = "toast";
  node.textContent = message;
  stack.appendChild(node);
  setTimeout(() => {
    node.remove();
  }, 3600);
}

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}
