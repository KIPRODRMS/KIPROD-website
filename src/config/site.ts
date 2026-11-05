/** Production marketing site */
export const SITE_URL = "https://www.kiprodrisk.co.ke";

/** Custom capability platform (LMS) — live at coordinated launch */
export const CAPABILITY_PLATFORM_URL =
  import.meta.env.PUBLIC_CAPABILITY_PLATFORM_URL ?? "https://learn.kiprodrisk.co.ke";

/** Set to "true" in Netlify env when LMS is live (Phase 5 launch) */
export const CAPABILITY_PLATFORM_LIVE = import.meta.env.PUBLIC_CAPABILITY_PLATFORM_LIVE === "true";

export function getCapabilityPlatformLink() {
  return {
    live: CAPABILITY_PLATFORM_LIVE,
    href: CAPABILITY_PLATFORM_LIVE ? CAPABILITY_PLATFORM_URL : "/academy#programme",
    external: CAPABILITY_PLATFORM_LIVE,
  };
}
