import { Twitter, Github, Instagram, Cloud, CreditCard, Gamepad2, Sparkles } from 'lucide-react';

export interface SocialLink {
  id: string;
  href: string;
  icon: any;
  label: string;
  activeColor?: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  { id: 'twitter', href: "https://x.com/uschan", icon: Twitter, label: "X (Twitter)" },
  { id: 'github', href: "https://github.com/uschan", icon: Github, label: "GitHub" },
  { id: 'instagram', href: "https://www.instagram.com/bujjun", icon: Instagram, label: "Instagram" },
  { id: 'bluesky', href: "https://bsky.app/profile/wildsalt.bsky.social", icon: Cloud, label: "Bluesky" },
  { id: 'discord', href: "https://discord.gg/26nJEhq6Yj", icon: Gamepad2, label: "Discord" },
  { id: 'paypal', href: "https://paypal.me/wildsaltme?utm_source=wildsalt.me", icon: CreditCard, label: "PayPal" },
  { id: 'wildsalt', href: "https://wildsalt.me/", icon: Sparkles, label: "WildSalt", activeColor: "text-amber-400" },
];