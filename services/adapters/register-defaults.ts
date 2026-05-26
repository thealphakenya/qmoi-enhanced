import { registerAdapter } from './index';
import FacebookAdapter from './social/facebook';
import InstagramAdapter from './social/instagram';
import WhatsAppAdapter from './social/whatsapp';
import LinkedInAdapter from './social/linkedin';
import TwitterAdapter from './social/twitter';
import YouTubeAdapter from './content/youtube';
import TubidyAdapter from './content/tubidy';
import AmazonAdapter from './distribution/amazon';
import StripeAdapter from './payments/stripe';
import PayPalAdapter from './payments/paypal';

export function registerDefaults() {
  registerAdapter('facebook', new FacebookAdapter());
  registerAdapter('instagram', new InstagramAdapter());
  registerAdapter('whatsapp', new WhatsAppAdapter());
  registerAdapter('linkedin', new LinkedInAdapter());
  registerAdapter('twitter', new TwitterAdapter());
  registerAdapter('youtube', new YouTubeAdapter());
  registerAdapter('tubidy', new TubidyAdapter());
  registerAdapter('amazon', new AmazonAdapter());
  registerAdapter('stripe', new StripeAdapter());
  registerAdapter('paypal', new PayPalAdapter());
}

export default { registerDefaults };
