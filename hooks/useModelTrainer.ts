import { useEffect, useState } from "react";

export /**
 * useModelTrainer function
 */
function useModelTrainer(): any {
  const [trainingStatus, setTrainingStatus] = useState("idle");
  const [lastTrained, setLastTrained] = useState<string | null>(null);
  useEffect(() => {
    // Poll backend for model training status
    const interval = setInterval(async () => {
      const res = await apiClient.get("/api/qmoi-model?trainingStatus=1", {
        headers: { "x-admin-token": localStorage.getItem("adminToken") || "" },
      });
      const data = await res.json();
      setTrainingStatus(data.status || "idle");
      setLastTrained(data.lastTrained || null);
    }, 60000);
    return () => clearInterval(interval);
  }, []);
  return { trainingStatus, lastTrained };
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