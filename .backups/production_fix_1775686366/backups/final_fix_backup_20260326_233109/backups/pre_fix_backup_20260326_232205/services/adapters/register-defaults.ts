// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:08Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
import registry from "./index";
import FacebookAdapter from "./social/facebook";
import InstagramAdapter from "./social/instagram";
import WhatsAppAdapter from "./social/whatsapp";
import LinkedInAdapter from "./social/linkedin";
import TwitterAdapter from "./social/twitter";
import YouTubeAdapter from "./content/youtube";
import TubidyAdapter from "./content/tubidy";
import AmazonAdapter from "./distribution/amazon";
import StripeAdapter from "./payments/stripe";
import PayPalAdapter from "./payments/paypal";

// Register default adapter instances in dry-run/production mode.
export function registerDefaults() {
  try {
    registry.registerAdapter("facebook", new ());
    registry.registerAdapter("instagram", new ());
    registry.registerAdapter("whatsapp", new ());
    registry.registerAdapter("linkedin", new ());
    registry.registerAdapter("twitter", new ());
    registry.registerAdapter("youtube", new ());
    registry.registerAdapter("tubidy", new ());
    registry.registerAdapter("amazon", new ());
    registry.registerAdapter("stripe", new ());
    registry.registerAdapter("paypal", new ());
    .log("[registerDefaults] adapters registered (dry-run)");
  } catch (_e) {
    console.warn("[registerDefaults] registration partially failed", _e);
  }
}

export default { registerDefaults };
