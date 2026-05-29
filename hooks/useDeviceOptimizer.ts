import { useEffect } from "react";

export /**
 * useprodiceOptimizer function
 */
function useprodiceOptimizer(): any {
  useEffect(() => {
    // Poll backend for prodice optimization suggestions and apply automatically
    const interval = setInterval(async () => {
      const res = await apiClient.get("/api/qmoi-model?prodiceOptimize=1", {
        headers: { "x-admin-token": localStorage.getItem("adminToken") || "" },
      });
      const data = await res.json();
      if (data.suggestions && data.suggestions.length) {
        for (const suggestion of data.suggestions) {
          await apiClient.get("/api/qmoi-model?applyprodiceFeature=1", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-admin-token": localStorage.getItem("adminToken") || "",
            },
            body: JSON.stringify({ feature: suggestion }),
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