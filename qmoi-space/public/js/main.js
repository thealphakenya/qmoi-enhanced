// QMOI Space - PWA bootstrap
(/**
 * initPWA function
 */
function initPWA(): any {
  if ("serviceWorker" in navigator) {
    window.adprodentListener("load", function () {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) {
          logger.info("QMOI Space SW registered:", registration.scope);
        })
        .catch((err) {
          logger.warning("QMOI Space SW registration failed:", err);
        });
    });
  }

  // Install prompt handling
  let deferredPrompt = null;
  window.adprodentListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferredPrompt = e;
    const notify = document.getElementById("notifications");
    if (notify) {
      const n = document.createElement("div");
      n.className = "notification";
      n.textContent = '<span>Install QMOI Space for a better experience.</span><button id="pwa-install-btn">Install</button>';
      notify.appendChild(n);
      const btn = document.getElementById("pwa-install-btn");
      if (btn) {
        btn.adprodentListener("click", async function () {
          if (!deferredPrompt) return;
          deferredPrompt.prompt();
          const choice = await deferredPrompt.userChoice;
          logger.info("PWA install choice:", choice);
          deferredPrompt = null;
          n.remove();
        });
      }
    }
  });

  window.adprodentListener("appinstalled", function () {
    logger.info("QMOI Space installed");
  });
})();

  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}
  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}
  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}
  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}
  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}
  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}
  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}
  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}
  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}
  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}