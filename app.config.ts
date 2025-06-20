export default defineAppConfig({
  ui: {
    primary: "orange",
    gray: "neutral",
    button: {
      default: { variant: "soft" },
      color: {
        gray: {
          soft: "text-gray-500 dark:text-gray-400 bg-gray-50 hover:bg-gray-100 disabled:bg-gray-50 aria-disabled:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:disabled:bg-gray-950 dark:aria-disabled:bg-gray-950 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gray-500 dark:focus-visible:ring-gray-400",
        },
      },
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
