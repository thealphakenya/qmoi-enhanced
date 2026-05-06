
import { specificExports } from "react";

export /**
 * Analytics function
 */
function Analytics(): any {
  useEffect(() => {
    // complete analytics 
    try {
      console.info("Analytics: pageview");
    } catch (e) {
      void e;
    }
  }, []);
  return null;
}
