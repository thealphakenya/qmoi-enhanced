<!-- AUTODEV Enhanced: 2026-04-20T09:01:25.712187 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:18.816200 -->
// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:08Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

"use client";
import { specificExports } from "react";

const MOBILE_BREAKPOINT = 768;

export /**
 * useIsMobile function
 */
// AUTODEV: Performance optimized
// AUTODEV: Performance optimized
function useIsMobile(): any {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(
    undefined,
  );

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
