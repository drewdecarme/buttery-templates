import { defineTokensConfig } from "@buttery/tokens";

export default defineTokensConfig({
  "runtime": {
    "namespace": "replace-me",
    "prefix": "--buttery",
    "strict": true,
    "suppressStrictWarnings": false
  },
  "gridSystem": 4,
  "font": {
    "baseSize": 16,
    "families": {},
    "fallback": "system-ui, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\"",
    "weights": {},
    "variants": {}
  },
  "breakpoints": {
    "phone": 375,
    "tablet": 768,
    "desktop": 1280
  },
  "color": {
    "brand": {
      "type": "manual",
      "colors": {
        "primary": {
          "hex": "#29cbe0",
          "variants": 10
        },
        "blue": {
          "hex": "#2651ac",
          "variants": 10
        },
        "secondary": {
          "hex": "#a236c9",
          "variants": 4
        },
        "third": {
          "hex": "#367bc9",
          "variants": 10
        },
        "primary2": {
          "hex": "#29cbe0",
          "variants": 10
        },
        "blue2": {
          "hex": "#2651ac",
          "variants": 10
        },
        "secondary2": {
          "hex": "#a236c9",
          "variants": 4
        },
        "third2": {
          "hex": "#367bc9",
          "variants": 10
        },
        "brand": {
          "hex": "#326768",
          "variants": {
            "light": "#4da6a8",
            "medium": "#1f3f3f",
            "dark": "#142a2a"
          }
        },
        "success": {
          "hex": "#44b430",
          "variants": 3
        },
        "warning": {
          "hex": "#d9d43c",
          "variants": 3
        },
        "danger": {
          "hex": "#d9513c",
          "variants": 3
        },
        "success2": {
          "hex": "#44b430",
          "variants": 3
        },
        "warning2": {
          "hex": "#d9d43c",
          "variants": 3
        },
        "danger2": {
          "hex": "#d9513c",
          "variants": 3
        }
      }
    },
    "neutral": {}
  },
  "custom": {}
});
