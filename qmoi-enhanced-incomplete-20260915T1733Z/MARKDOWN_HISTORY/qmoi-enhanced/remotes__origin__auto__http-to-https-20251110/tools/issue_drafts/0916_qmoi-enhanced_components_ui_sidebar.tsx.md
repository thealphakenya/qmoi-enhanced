---
title: "Issue draft for qmoi-enhanced/components/ui/sidebar.tsx"
generated: 2025-11-08T16:06:38.791530Z
---

# Review needed: qmoi-enhanced/components/ui/sidebar.tsx

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its placeholder markers or TODOs.
- If the file is safe for production, remove the placeholder and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { PanelLeft } from "lucide-react"

import { useMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import Button from '@mui/material/Button';
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const SIDEBAR_WIDTH_MOBILE = '260px';

interface SidebarContextType {
  isOpen: boolean;
  toggle: () => void;
  isMobile: boolean;
  state: "expanded" | "collapsed";
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
}

const SidebarContext = React.createContext<SidebarContextType>({
  isOpen: false,
  toggle: () => {},
  isMobile: false,
  state: "expanded",
  openMobile: false,
  setOpenMobile: () => {},
});

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const isMobile = useMobile();
  const [openMobile, setOpenMobile] = React.useState(false);
  const [open, setOpen] = React.useState(true);
  const [state, setState] = React.useState<"expanded" | "collapsed">("expanded");

    const toggleSidebar = React.useCallback(() => {
    setOpen((prev) => !prev);
    setState((prev) => (prev === "expanded" ? "collapsed" : "expanded"));
  }, []);

    const contextValue = React.useMemo<SidebarContextType>(
      () => ({
      isOpen: open,
      toggle: toggleSidebar,
      isMobile,
        state,
        openMobile,
        setOpenMobile,
      }),
    [open, toggleSidebar, isMobile, state, openMobile, 
```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.
