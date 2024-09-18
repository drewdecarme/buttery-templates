import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { css } from "@linaria/core";
import { Drawer } from "../Drawer";
import { useDrawer } from "../drawer.useDrawer";
const drawerStyles = css `
  --drawer-width: 40%;

  /* Animations */
  @keyframes fade-in {
    0% {
      opacity: 0;
      visibility: hidden;
    }
    100% {
      opacity: 1;
      visibility: visible;
    }
  }

  @keyframes fade-out {
    0% {
      opacity: 1;
      visibility: visible;
    }
    100% {
      opacity: 0;
      visibility: hidden;
    }
  }

  @keyframes drawer-expand {
    0% {
      opacity: 0;
      transform: translateX(100%);
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes drawer-collapse {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translateX(100%);
    }
  }

  /* Main Styles */
  border: 0;
  max-width: 100%;
  max-height: 100%;
  padding: 0;
  margin: 0;
  margin-block-end: 0;
  height: 100%;
  width: var(--drawer-width);

  &::backdrop {
    backdrop-filter: blur(10px);
    background: rgba(0, 0, 0, 0.4);
  }

  &.slide-left {
    left: calc(100% - var(--drawer-width));

    &[open] {
      animation: drawer-expand 0.35s ease-in-out forwards;
      &::backdrop {
        animation: fade-in 0.35s ease-in-out forwards;
      }
    }
    &[data-close="true"] {
      animation: drawer-collapse 0.35s ease-in-out forwards;
      &::backdrop {
        animation: fade-out 0.35s ease-in-out forwards;
      }
    }
  }
`;
export default () => {
    const { drawerRef, openDrawer } = useDrawer();
    return (_jsxs(_Fragment, { children: [_jsx("button", { type: "button", onClick: openDrawer, children: "Slide left" }), _jsx(Drawer, { ref: drawerRef, dxOrientation: "slide-left", className: drawerStyles, children: "This is some drawer content!" })] }));
};