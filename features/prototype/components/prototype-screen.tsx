"use client";

import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prototypeGlass } from "@/features/prototype/components/prototype-glass-panel";
import { PrototypeEyebrow, PrototypeHeading } from "@/features/prototype/components/prototype-typography";
import { PrototypeBottomNav } from "@/features/prototype/components/prototype-bottom-nav";
import { PrototypeBagTab } from "@/features/prototype/components/tabs/prototype-bag-tab";
import { PrototypeCampTab } from "@/features/prototype/components/tabs/prototype-camp-tab";
import { PrototypeComponentsTab } from "@/features/prototype/components/tabs/prototype-components-tab";
import { PrototypeJourneyTab } from "@/features/prototype/components/tabs/prototype-journey-tab";
import { PrototypeProfileTab } from "@/features/prototype/components/tabs/prototype-profile-tab";
import { PrototypeStudyTab } from "@/features/prototype/components/tabs/prototype-study-tab";
import {
  PROTOTYPE_NAV_TAB_MAP,
  PROTOTYPE_SCREEN_TABS,
  type PrototypeScreenTab,
} from "@/features/prototype/constants/mock-data";
import { PrototypeViewportBackground } from "@/features/prototype/components/prototype-viewport-background";
import { PROTOTYPE_TAB_BACKGROUNDS } from "@/features/prototype/constants/tab-backgrounds";
import type { ImmersiveNavTab } from "@/lib/navigation/immersive-nav.constants";
import { cn } from "@/lib/utils";

function isNavTab(tab: PrototypeScreenTab): tab is ImmersiveNavTab {
  return tab in PROTOTYPE_NAV_TAB_MAP;
}

export function PrototypeScreen() {
  const [screenTab, setScreenTab] = useState<PrototypeScreenTab>("journey");

  const showBottomNav = PROTOTYPE_SCREEN_TABS.find((t) => t.id === screenTab)?.showBottomNav;

  const handleNavChange = (nav: ImmersiveNavTab) => {
    setScreenTab(PROTOTYPE_NAV_TAB_MAP[nav]);
  };

  const activeBackground = PROTOTYPE_TAB_BACKGROUNDS[screenTab];

  return (
    <Tabs
      value={screenTab}
      onValueChange={(value) => setScreenTab(value as PrototypeScreenTab)}
      className="relative flex h-full min-h-0 flex-1 flex-col bg-transparent"
    >
      {activeBackground ? (
        <PrototypeViewportBackground
          src={activeBackground.src}
          scrimClassName={activeBackground.scrimClassName}
        />
      ) : null}

      <header className={cn("relative z-20 shrink-0 px-3 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))]", prototypeGlass.hud, "rounded-none border-x-0 border-t-0")}>
        <div className="mb-2">
          <PrototypeEyebrow>UI Lab · Light mode</PrototypeEyebrow>
          <PrototypeHeading as="h1" size="page">
            Noboru Prototype
          </PrototypeHeading>
        </div>

        <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto bg-transparent p-0">
          {PROTOTYPE_SCREEN_TABS.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className={cn(
                "px-3 py-1.5 text-body-sm transition",
                prototypeGlass.tabInactive,
                "data-[state=active]:shadow-none",
                "data-[state=active]:border-primary/30 data-[state=active]:bg-primary/10 data-[state=active]:text-primary",
              )}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </header>

      <TabsContent
        value="journey"
        className="relative z-10 mt-0 h-full min-h-0 flex-1 focus-visible:outline-none data-[state=inactive]:hidden"
      >
        <PrototypeJourneyTab />
      </TabsContent>
      <TabsContent
        value="camp"
        className="relative z-10 mt-0 h-full min-h-0 w-full min-w-0 flex-1 overflow-y-auto focus-visible:outline-none data-[state=inactive]:hidden"
      >
        <PrototypeCampTab />
      </TabsContent>
      <TabsContent
        value="study"
        className="relative z-10 mt-0 h-full min-h-0 flex-1 focus-visible:outline-none data-[state=inactive]:hidden"
      >
        <PrototypeStudyTab />
      </TabsContent>
      <TabsContent
        value="bag"
        className="relative z-10 mt-0 h-full min-h-0 w-full min-w-0 flex-1 overflow-y-auto focus-visible:outline-none data-[state=inactive]:hidden"
      >
        <PrototypeBagTab />
      </TabsContent>
      <TabsContent
        value="profile"
        className="relative z-10 mt-0 h-full min-h-0 flex-1 overflow-y-auto focus-visible:outline-none data-[state=inactive]:hidden"
      >
        <PrototypeProfileTab />
      </TabsContent>
      <TabsContent
        value="kit"
        className="relative z-10 mt-0 h-full min-h-0 flex-1 overflow-y-auto focus-visible:outline-none data-[state=inactive]:hidden"
      >
        <PrototypeComponentsTab />
      </TabsContent>

      {showBottomNav && isNavTab(screenTab) ? (
        <PrototypeBottomNav activeTab={screenTab} onTabChange={handleNavChange} />
      ) : null}
    </Tabs>
  );
}
