// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "ChessPecker",
      meta: [
        {
          name: "description",
          content:
            "An online chess tactics trainer based on the Woodpecker Method, designed to boost pattern recognition through repetition.",
        },
        {
          name: "google-adsense-account",
          content: "ca-pub-7565192673545193",
        },
        {
          name: "monetag",
          content: "4747e646ea29753824f38ad16f66c433",
        },
        {
          name: "purpleads-verification",
          content: "cf730b575d38dbf6f585e0af",
        },
      ],
      link: [{ rel: "icon", type: "image/png", href: "/favicon.png" }],
      script: [
        // Google Analytics script
        {
          src: "https://www.googletagmanager.com/gtag/js?id=G-90BV3BMJRP",
          async: true,
          tagPriority: "low",
        },
        {
          children: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-90BV3BMJRP');
          `,
          type: "text/javascript",
        },
        // Google Adsense script
        {
          src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7565192673545193",
          async: true,
          crossorigin: "anonymous",
          tagPriority: "low",
        },
      ],
    },
  },
  compatibilityDate: "2024-04-03",
  imports: {
    dirs: ["types"],
  },
  nitro: {
    imports: {
      dirs: ["types"],
    },
  },
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    "@nuxtjs/supabase",
    "@nuxt/image",
    "@nuxt/test-utils/module",
  ],
  supabase: {
    redirectOptions: {
      login: "/login",
      callback: "/about",
      exclude: [
        "/register",
        "/login",
        "/about",
        "/contact",
        "/privacy-policy",
        "/cookie-policy",
      ],
      cookieRedirect: false,
    },
  },
  routeRules: {
    "/login": { prerender: true },
    "/register": { prerender: true },
    "/about": { prerender: true },
    "/contact": { prerender: true },
    "/privacy-policy": { prerender: true },
    "/cookie-policy": { prerender: true },
  },
});
