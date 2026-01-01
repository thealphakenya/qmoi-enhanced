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

// Register default adapter instances in dry-run/sandbox mode.
export function registerDefaults() {
  try {
    registry.registerAdapter("facebook", new (FacebookAdapter as unknown)());
    registry.registerAdapter("instagram", new (InstagramAdapter as unknown)());
    registry.registerAdapter("whatsapp", new (WhatsAppAdapter as unknown)());
    registry.registerAdapter("linkedin", new (LinkedInAdapter as unknown)());
    registry.registerAdapter("twitter", new (TwitterAdapter as unknown)());
    registry.registerAdapter("youtube", new (YouTubeAdapter as unknown)());
    registry.registerAdapter("tubidy", new (TubidyAdapter as unknown)());
    registry.registerAdapter("amazon", new (AmazonAdapter as unknown)());
    registry.registerAdapter("stripe", new (StripeAdapter as unknown)());
    registry.registerAdapter("paypal", new (PayPalAdapter as unknown)());
    console.log("[registerDefaults] adapters registered (dry-run)");
  } catch (_e) {
    console.warn("[registerDefaults] registration partially failed", _e);
  }
}

export default { registerDefaults };
