import type { SimpleBrand } from "@/lib/types";
import { agentLooks } from "@/lib/data";
import { Palette, MessageCircle } from "lucide-react";

export function BrandMark({ size = 22 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="idealy-gradient" x1="3" y1="5" x2="43" y2="43" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9B7BFF" />
          <stop offset="1" stopColor="#21C7A8" />
        </linearGradient>
      </defs>
      <path d="M24 2.5 30.6 17.4 45.5 24 30.6 30.6 24 45.5 17.4 30.6 2.5 24 17.4 17.4 24 2.5Z" fill="url(#idealy-gradient)" />
      <path d="M24 14.2 27.6 20.4 33.8 24 27.6 27.6 24 33.8 20.4 27.6 14.2 24 20.4 20.4 24 14.2Z" fill="white" fillOpacity=".94" />
    </svg>
  );
}

export function BrandIcon({ brand, size = 23 }: { brand: SimpleBrand; size?: number }) {
  if (brand.title === "Canva") return <Palette aria-label={brand.title} role="img" size={size} strokeWidth={1.8} />;
  if (brand.title === "Slack") return <MessageCircle aria-label={brand.title} role="img" size={size} strokeWidth={1.8} />;
  if (brand.title === "Google Drive") {
    return (
      <svg aria-label={brand.title} role="img" width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M7.71 3.5 1.29 14.5h6.42L14.13 3.5H7.71Z" fill="#0066DA" />
        <path d="M14.13 3.5 20.55 14.5l-3.21 5.5H4.5l3.21-5.5h6.42Z" fill="#00AC47" />
        <path d="M22.71 14.5 16.29 3.5h-4.32l6.42 11h4.32Z" fill="#EA4335" opacity=".1" />
        <path d="M1.29 14.5l3.21 5.5h12.84l3.21-5.5H1.29Z" fill="#FFBA00" />
      </svg>
    );
  }
  return (
    <svg aria-label={brand.title} role="img" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d={brand.path} />
    </svg>
  );
}

type AgentLook = { skin: string; hair: string; outfit: string; accent: string; backdrop: string };

export function AgentPortrait({ name, size = 36 }: { name: string; size?: number }) {
  const look: AgentLook = agentLooks[name] ?? agentLooks.Chief;
  return (
    <svg className="agent-portrait" aria-hidden="true" width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="13" fill={look.backdrop} />
      <path d="M4 49 7.5 40.5C10 35 15.5 33 24 33s14 2 16.5 7.5L44 49Z" fill={look.outfit} />
      <path d="M18.7 31.2h10.6v6.1c-1.8 2.1-3.5 2.9-5.3 2.9s-3.5-.8-5.3-2.9Z" fill={look.skin} />
      <ellipse cx="13.7" cy="25.1" rx="2.5" ry="4" fill={look.skin} />
      <ellipse cx="34.3" cy="25.1" rx="2.5" ry="4" fill={look.skin} />
      <path d="M13.1 19.8c.5-7.4 4.4-11 10.9-11s10.4 3.6 10.9 11l-.6 8.1c-.3 6.3-4.7 10.8-10.3 10.8S14 34.2 13.7 27.9Z" fill={look.skin} />
      {name === "Chief" ? <path d="M12.2 23.5C9.9 13.2 15.8 6 24 6s14.1 7.2 11.8 17.5l-2.1-3.8-2.8-5.8c-4.3 3.5-9.3 4.8-15.9 4.2Z" fill={look.hair} /> : null}
      {name === "Builder" ? <path d="M12 23.2C10 14.4 14.4 7.4 23.6 7.4c8.7 0 12.9 6.8 12.3 15.1l-2.8-3.1-1.1-5.3c-4.5 3.3-10 4.7-16.2 4.1Z" fill={look.hair} /> : null}
      {name === "Designer" ? <><path d="M11.1 23.5C8.7 13.5 14.2 7.2 23.8 7.2c9.2 0 14 6.5 12.3 16.7l-2.7 9.3-3.7-7.5 1-9.1c-4.8 3.4-10.7 4.5-16.2 3.4Z" fill={look.hair} /><path d="M12.4 14.2c2.8-6.2 7.5-8.7 13.1-8.1 3.1.3 5.9 1.7 7.8 4.3-6.4-.8-12.2 2.4-20.9 3.8Z" fill={look.accent} /></> : null}
      {name === "Specialist" ? <path d="M11.2 23.6C8.7 15.1 13.1 7.4 22.8 7.1c10.1-.3 14.8 6.6 12.3 16.4l-2.6-4.4-2.1-6.3c-3.8 3-9.4 4.4-16.7 3.9Z" fill={look.hair} /> : null}
      {name === "Reviewer" ? <path d="M11.5 23.5C9 13 14.2 7 24.2 7c9.6 0 14.3 6.4 12.3 16.2l-2.8 5.1-1.4-11.7c-5.5 2.4-10.7 2.8-17 1.8l-1.5 8.2Z" fill={look.hair} /> : null}
      <path d="M17.5 24c1.1-.8 2.2-.8 3.2 0M27.3 24c1.1-.8 2.2-.8 3.2 0" stroke="#49362e" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M24 25.5 22.9 28h2.2" stroke="#b17b62" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20.5 30.4c2.1 1.7 4.9 1.7 7 0" stroke="#9f5f56" strokeWidth="1.5" strokeLinecap="round" />
      {name === "Specialist" ? <><rect x="15.2" y="21.3" width="7.2" height="5.6" rx="2.1" stroke="#24435f" strokeWidth="1.5" /><rect x="25.6" y="21.3" width="7.2" height="5.6" rx="2.1" stroke="#24435f" strokeWidth="1.5" /><path d="M22.4 23.4h3.2" stroke="#24435f" strokeWidth="1.3" /></> : null}
      {name === "Builder" ? <path d="M12.3 23.5a11.7 11.7 0 0 1 23.4 0" stroke={look.accent} strokeWidth="2.6" strokeLinecap="round" /> : null}
      {name === "Designer" ? <path d="m32.4 31.1 1.7-3.2 1.7 3.2 3.2 1.7-3.2 1.7-1.7 3.2-1.7-3.2-3.2-1.7Z" fill={look.accent} /> : null}
      {name === "Chief" ? <path d="m14 37 1.5-3 1.5 3 3 1.5-3 1.5-1.5 3-1.5-3-3-1.5Z" fill={look.accent} /> : null}
      {name === "Reviewer" ? <path d="m33 35 1.3 2.6 2.8.4-2 2 .5 2.7-2.6-1.3-2.4 1.3.5-2.7-2-2 2.7-.4Z" fill={look.accent} /> : null}
      <path d="M16 47c1.8-4 4.5-5.8 8-5.8s6.2 1.8 8 5.8" stroke={look.accent} strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
