import {
  makeColor,
  makeColorStatic,
  makeCustom,
  makeRem,
  makeReset,
} from "@buttery/tokens/_docs";
import { styled } from "@linaria/react";
import type { FC, ReactNode } from "react";
import React from "react";

const SLayoutBodyMain = styled("section")`
  grid-area: layout-main;
  background: ${makeColorStatic("background")};
  position: sticky;
  top: ${makeCustom("layout-header-height")};

  &:not(pre) {
    & > code {
    }
  }

  code {
    background: ${makeColor("neutral", { variant: "50", opacity: 0.5 })};
    padding: ${makeRem(4)};
    border-radius: ${makeRem(4)};
  }

  p,
  li {
    code {
      font-size: ${makeRem(12)};
    }
  }

  blockquote {
    background-color: ${makeColor("secondary", {
      variant: "500",
      opacity: 0.1,
    })} !important;
    margin: 0;
    padding: ${makeRem(16)};
    border-radius: ${makeRem(8)};
    border: ${makeRem(2)} solid ${makeColor("secondary")};

    & > p {
      margin: 0;
      font-size: ${makeRem(14)} !important;
    }
  }

  table {
    --bd-table-border: ${makeRem(1)} solid
      ${makeColor("neutral", { variant: "50" })};
    border-spacing: 0;
    border: var(--bd-table-border);
    width: 100%;
    font-size: ${makeRem(14)};

    code {
      font-size: ${makeRem(12)};
      color: ${makeColor("secondary")};
    }

    thead {
      background: ${makeColor("secondary", { variant: "50", opacity: 0.3 })};
    }

    tr {
      &:not(:last-child) {
        td {
          border-bottom: var(--bd-table-border);
        }
      }
    }

    th {
      border-bottom: var(--bd-table-border);
    }

    th,
    td {
      padding: ${makeRem(8)} ${makeRem(16)};
      text-align: left;
      &:not(:last-child) {
        border-right: var(--bd-table-border);
      }
    }
  }

  pre {
    & > code {
      background: initial;
      padding: initial;
      border-radius: initial;
    }
  }

  & > div {
    padding: 0 ${makeRem(32)} ${makeRem(48)} ${makeRem(32)};
    max-width: ${makeRem(668)};

    h1,
    h2,
    h3 {
      background: ${makeColorStatic("background")};
      margin: 0;
    }
    h1,
    h2 {
      padding: 0.83em 0;
    }

    h1 {
      font-size: ${makeRem(40)};
    }

    h2 {
      border-bottom: ${makeRem(1)} solid
        ${makeColor("neutral", { variant: "50" })};

      & + p {
        margin: ${makeRem(16)} 0;
      }
    }

    h3 {
      padding: 1em 0;
    }

    a {
      ${makeReset("anchor")};
    }

    p {
      font-size: ${makeRem(16)};
      line-height: ${makeRem(24)};
      z-index: 9;

      a {
        background-color: ${makeColor("secondary", {
          variant: "50",
          opacity: 0.2,
        })};
        color: ${makeColor("secondary", { variant: "700" })} !important;
        padding: 0 ${makeRem(4)};
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
`;

export const LayoutBodyMain: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <SLayoutBodyMain>
      <div>{children}</div>
    </SLayoutBodyMain>
  );
};
