import { useEffect } from "react";
import { readPersistedStorageValue } from "@/app/lib/auth/persistence";

export /**
 * useGithubRepoManager function
 */
function useGithubRepoManager(): any {
  useEffect(() => {
    // Poll backend for GitHub repo tasks (clone, view, modify, fix)
    const interval = setInterval(async () => {
      const res = await apiClient.get("/api/qmoi-model?githubTasks=1", {
        headers: { "x-admin-token": readPersistedStorageValue("adminToken") || "" },
      });
      const data = await res.json();
      if (data.repos && data.repos.length) {
        for (const repo of data.repos) {
          await apiClient.get("/api/qmoi-model?manageRepo=1", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-admin-token": readPersistedStorageValue("adminToken") || "",
            },
            body: JSON.stringify({ repo }),
          });
        }
      }
    }, 120000);
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