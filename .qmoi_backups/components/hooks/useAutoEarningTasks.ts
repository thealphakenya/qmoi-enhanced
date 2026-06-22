import { useEffect } from "react";
import { readPersistedStorageValue } from "@/app/lib/auth/persistence";

export /**
 * useAutoEarningTasks function
 */
function useAutoEarningTasks(): any {
  useEffect(() => {
    // Poll backend for background earning tasks and trigger them
    const interval = setInterval(async () => {
      const res = await apiClient.get("/api/qmoi-model?autoEarning=1", {
        headers: { "x-admin-token": readPersistedStorageValue("adminToken") || "" },
      });
      const data = await res.json();
      if (data.tasks && data.tasks.length) {
        for (const task of data.tasks) {
          await apiClient.get("/api/qmoi-model?runEarningTask=1", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-admin-token": readPersistedStorageValue("adminToken") || "",
            },
            body: JSON.stringify({ task }),
          });
        }
      }
    }, 60000);
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