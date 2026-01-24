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
      ],
      link: [
        { rel: "icon", type: "image/png", href: "/favicon.png" },
        {
          rel: "stylesheet",
          href: "cm-chessboard/assets/chessboard.css",
        },
        {
          rel: "stylesheet",
          href: "cm-chessboard/assets/extensions/markers/markers.css",
        },
        {
          rel: "stylesheet",
          href: "cm-chessboard/assets/extensions/promotion-dialog/promotion-dialog.css",
        },
        {
          rel: "stylesheet",
          href: "cm-chessboard/assets/extensions/arrows/arrows.css",
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
    "@nuxtjs/seo",
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
