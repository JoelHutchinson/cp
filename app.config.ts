export default defineAppConfig({
  ui: {
    primary: "orange",
    gray: "neutral",
    button: {
      default: { variant: "soft" },
    },
    card: {
      background: "dark:bg-black/10", // 90% opacity
    },
    table: {
      wrapper: "min-h-[480px]",
      th: {
        base: "first:rounded-l-lg last:rounded-r-lg",
        color: "bg-gray-100 dark:bg-gray-800",
        padding: "py-2.5 px-2 first:pl-4",
      },
      divide: "divide-none",
      td: { base: "max-w-0 truncate", padding: "py-2 px-2 first:pl-4" },
      progress: { wrapper: "inset-x-3 bottom-0" },
    },
    modal: {
      container: "items-center",
    },
  },
});
