import type { ButteryConfigDocs } from "@buttery/core/config";
import {
  makeColorShade,
  makeColorStatic,
  makeCustom,
  makeFontWeight,
  makeRem,
} from "@buttery/tokens/docs";
import { css } from "@linaria/core";
import type { FC } from "react";
import { NavLink } from "react-router-dom";
import { LayoutHeaderLinks } from "./LayoutHeaderLinks";

const layoutHeaderStyles = css`
  grid-area: layout-header;
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  padding: 0 ${makeRem(32)};
  border-bottom: ${makeRem(1)} solid
    ${makeColorShade("neutral", { variant: "50", opacity: 0.5 })};
  background: ${makeColorStatic("background")};
  z-index: 10;

  & > div {
    flex: 1;
    height: 100%;
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: 100%;
    gap: ${makeRem(16)};
    max-width: ${makeCustom("layout-max-width")};
    margin: 0 auto;
  }
`;

const anchorCSS = css`
  margin: 0;
  padding: 0;
  text-decoration: none;
  height: 100%;
  display: block;
  display: flex;
  align-items: center;
  gap: ${makeRem(16)};

  &:visited {
    color: inherit;
  }
`;

const imgStyles = css`
  height: 60%;
  width: auto;
  object-fit: contain;
`;

const divStyles = css`
  font-size: ${makeRem(16)};
  text-transform: uppercase;
  color: ${makeColorShade("neutral")};
  font-weight: ${makeFontWeight("bold")};
`;

export type LayoutHeaderProps = { header: ButteryConfigDocs["header"] | null };

export const LayoutHeader: FC<LayoutHeaderProps> = ({ header }) => {
  return (
    <header className={layoutHeaderStyles}>
      <div>
        {header && (
          <NavLink to="/" className={anchorCSS}>
            {header?.logo && (
              <img
                className={imgStyles}
                src={header.logo.src}
                alt={header.logo.alt}
              />
            )}
            {header?.title && <div className={divStyles}>{header.title}</div>}
          </NavLink>
        )}
        <LayoutHeaderLinks links={header?.links} />
      </div>
    </header>
  );
};