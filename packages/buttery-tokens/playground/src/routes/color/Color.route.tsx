import { LayoutMainContent } from "playground/src/components/layout/LayoutMainContent";
import { LayoutMainPaneLeft } from "playground/src/components/layout/LayoutMainPaneLeft";
import { LayoutMainPaneRight } from "playground/src/components/layout/LayoutMainPaneRight";
import { LayoutMainPaneSection } from "playground/src/components/layout/LayoutMainPaneSection";
import { Tab } from "playground/src/components/tabs/Tab";
import { Tabs } from "playground/src/components/tabs/Tabs";
import { ColorProvider } from "./Color.context";
import { ColorJSON } from "./ColorJSON";
import { ColorMode } from "./ColorMode";
import { ColorPalette } from "./ColorPalette";
import { ColorSelectMode } from "./ColorSelectMode";

export const ColorRoute = () => {
  return (
    <ColorProvider>
      <LayoutMainPaneLeft>
        <LayoutMainPaneSection
          btTitle="mode"
          btSubtitle="The mode determines the types of options that can be used to create a color palette. Each mode is designed to ensure complete color harmony regardless of settings."
        >
          <ColorSelectMode />
        </LayoutMainPaneSection>
        <ColorMode />
      </LayoutMainPaneLeft>
      <LayoutMainContent>
        <ColorPalette />
      </LayoutMainContent>
      <LayoutMainPaneRight>
        <LayoutMainPaneSection>
          <Tabs btInitActiveTab="graph">
            <Tab btId="graph" btLabel="Graph">
              <LayoutMainPaneSection
                btTitle="graph"
                btSubtitle="The graphical representation of the configuration that has been configured in the left pane."
              >
                <ColorJSON />
              </LayoutMainPaneSection>
            </Tab>
            <Tab btId="other" btLabel="Other">
              Other tab - WIP
            </Tab>
          </Tabs>
        </LayoutMainPaneSection>
      </LayoutMainPaneRight>
    </ColorProvider>
  );
};
