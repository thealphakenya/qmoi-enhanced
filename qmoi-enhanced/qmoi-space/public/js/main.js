// QMOI Space - PWA bootstrap
(function initPWA() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker
        .register("/sw.js")
        .then(function (registration) {
          console.log("QMOI Space SW registered:", registration.scope);
        })
        .catch(function (err) {
          console.warn("QMOI Space SW registration failed:", err);
        });
    });
  }

  // Install prompt handling
  let deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferredPrompt = e;
    const notify = document.getElementById("notifications");
    if (notify) {
      const n = document.createElement("div");
      n.className = "notification";
      n.innerHTML =
        '<span>Install QMOI Space for a better experience.</span><button id="pwa-install-btn">Install</button>';
      notify.appendChild(n);
      const btn = document.getElementById("pwa-install-btn");
      if (btn) {
        btn.addEventListener("click", async function () {
          if (!deferredPrompt) return;
          deferredPrompt.prompt();
          const choice = await deferredPrompt.userChoice;
          console.log("PWA install choice:", choice);
          deferredPrompt = null;
          n.remove();
        });
      }
    }
  });

  window.addEventListener("appinstalled", function () {
    console.log("QMOI Space installed");
  });
})();
