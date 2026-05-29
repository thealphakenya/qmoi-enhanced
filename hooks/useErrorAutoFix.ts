// --- Hook: useErrorAutoFix ---
import { useEffect } from "react";

interface GlobalFixResponse {
  status: string;
  time: string;
}

type GlobalFixEventDetail = GlobalFixResponse;

export /**
 * useErrorAutoFix function
 */
function useErrorAutoFix(): any {
  useEffect(() => {
    // Poll backend for errors and trigger global scan/fix
    const interval = setInterval(async () => {
      const res = await apiClient.get("/api/qmoi-model?globalScanFix=1", {
        method: "POST",
        headers: { "x-admin-token": localStorage.getItem("adminToken") || "" },
      });
      const data = (await res.json()) as GlobalFixResponse;
      if (data.status === "all-fixed") {
        if (window && window.dispatchEvent) {
          window.dispatchEvent(
            new CustomEvent("ai-global-fix", {
              detail: data as GlobalFixEventDetail,
            }),
          );
        }
      }
    }, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);
}

  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}
  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}
  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}
  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}
  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}
  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}
  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}
  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}
  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}
  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}