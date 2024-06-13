import type { ButteryConfigDocsHeaderLink } from "@buttery/core";
import { IconComponent } from "@buttery/icons";
import { makeColor, makeRem, makeReset } from "@buttery/tokens/_docs";
import { css } from "@linaria/core";
import { styled } from "@linaria/react";
import type { FC } from "react";
import { match } from "ts-pattern";

const SUl = styled("div")`
  ${makeReset("ul")};
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: ${makeRem(16)};
`;

const SAnchorSocial = styled("a")`
  ${makeReset("anchor")};
  display: grid;
  place-content: center;
  transition: all 0.15s ease-in-out;

  &:hover {
    color: ${makeColor("primary")};
  }
`;

const internalCss = css`
  ${makeReset("anchor")};
  display: grid;
  place-content: center;
  transition: all 0.15s ease-in-out;
  font-size: ${makeRem(16)};

  &:hover {
    color: ${makeColor("primary")};
  }
`;

export const LayoutHeaderLinks: FC<{
  links?: ButteryConfigDocsHeaderLink[];
  NavLinkComponent: JSX.ElementType;
}> = ({ links = [], NavLinkComponent }) => {
  return (
    <SUl>
      {links.map((link) => {
        return (
          <li key={link.href}>
            {match(link)
              .with({ type: "social" }, (socialLink) => {
                return (
                  <SAnchorSocial href={socialLink.href} target="_blank">
                    <IconComponent
                      icon="github-circle-solid-rounded"
                      ddSize={makeRem(28)}
                    />
                  </SAnchorSocial>
                );
              })
              .with({ type: "text" }, (socialLink) => {
                return <a href={socialLink.href}>{socialLink.text}</a>;
              })
              .with({ type: "internal" }, (internalLink) => {
                return (
                  <NavLinkComponent
                    to={internalLink.href}
                    className={internalCss}
                  >
                    {internalLink.text}
                  </NavLinkComponent>
                );
              })
              .exhaustive()}
          </li>
        );
      })}
    </SUl>
  );
};