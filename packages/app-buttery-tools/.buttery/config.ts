import type { ButteryConfig } from "@buttery/core";
const config: ButteryConfig = {
  tokens: {
    importName: "tools",
    prefix: "buttery-tools",
    strict: true,
    gridSystem: 4,
    suppressStrictWarnings: false,
    font: {
      size: 16,
      family: {
        heading:
          'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        body: 'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      },
      weight: {
        bold: 700,
        "semi-bold": 600,
        medium: 500,
        regular: 400,
        light: 300,
      },
      typography: {
        heading1: {
          fontFamily: "heading",
          fontSize: 74,
          lineHeight: 82,
        },
        heading2: {
          fontFamily: "heading",
          fontSize: 64,
          lineHeight: 74,
        },
      },
    },
    color: {
      mode: "presets",
      tone: "fluorescent",
      brightness: 95,
      saturation: 84,
      application: {
        hues: {
          primary: 32,
          secondary: 84,
        },
        variants: {
          mode: "auto",
        },
      },
      neutral: {
        base: "#000000",
        variants: {
          mode: "auto",
        },
      },
    },
    breakpoints: {
      phone: 375,
      tablet: 768,
      desktop: 1280,
    },
  },
};
export default config;
