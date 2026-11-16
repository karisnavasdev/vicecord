const boot = document.getElementById("boot");
const nav = document.getElementById("nav");
const menuBtn = document.getElementById("menu-btn");
const toast = document.getElementById("toast");
const ca = (document.getElementById("ca-text")?.textContent || "vicecordpump").trim();

function dismissBoot() {
  if (!boot || boot.classList.contains("is-gone")) return;
  boot.classList.add("is-gone");
  setTimeout(() => boot.remove(), 500);
}

boot?.addEventListener("click", dismissBoot);
setTimeout(dismissBoot, 1800);

menuBtn?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuBtn?.setAttribute("aria-expanded", "false");
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    nav?.classList.remove("open");
    menuBtn?.setAttribute("aria-expanded", "false");
    dismissBoot();
  }
});

let toastTimer = 0;
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1600);
}

async function copyCa(trigger) {
  try {
    await navigator.clipboard.writeText(ca);
  } catch {
    const area = document.createElement("textarea");
    area.value = ca;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.left = "-9999px";
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  }
  if (trigger) {
    const original = trigger.dataset.label || trigger.textContent;
    trigger.dataset.label = original;
    trigger.textContent = "Copied";
    setTimeout(() => {
      trigger.textContent = original;
    }, 1400);
  }
  showToast("Contract copied");
}

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", () => copyCa(button));
});

function pad(value) {
  return String(value).padStart(2, "0");
}

function tick() {
  const now = Date.now();
  document.querySelectorAll(".clock").forEach((clock) => {
    const end = Date.parse(clock.dataset.end);
    const start = Date.parse(clock.dataset.start);
    const remaining = Math.max(0, end - now);
    const total = Math.floor(remaining / 1000);
    const days = Math.floor(total / 86400);
    const hours = Math.floor((total % 86400) / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;
    clock.querySelector('[data-unit="d"]').textContent = String(days);
    clock.querySelector('[data-unit="h"]').textContent = pad(hours);
    clock.querySelector('[data-unit="m"]').textContent = pad(minutes);
    clock.querySelector('[data-unit="s"]').textContent = pad(seconds);

    const card = clock.closest(".window-card");
    const meter = card?.querySelector("[data-meter]");
    if (meter && Number.isFinite(start) && end > start) {
      const progress = Math.min(1, Math.max(0, (now - start) / (end - start)));
      meter.style.width = `${(progress * 100).toFixed(2)}%`;
    }
    if (remaining === 0) card?.classList.add("is-closed");
  });
}

tick();
setInterval(tick, 1000);
