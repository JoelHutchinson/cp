import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  theme: {
    extend: {
      screens: {
        xs: "440px",
        // => @media (min-width: 440px) { ... }

        sm: "640px",
        // => @media (min-width: 640px) { ... }

        in: "800px",
        // => @media (min-width: 800px) { ... }

        md: "1040px",
        // => @media (min-width: 1040px) { ... }

        lg: "1150px",
        // => @media (min-width: 1150) { ... }

        xl: "1280px",
        // => @media (min-width: 1280px) { ... }

        "2xl": "1536px",
        // => @media (min-width: 1536px) { ... }
      },
    },
  },
};
