// This hook monitors GoDaddy/DomainForge Pro domain health and provides live status updates.
import { useEffect, useState } from "react";

export interface GoDaddyDomainStatus {
  domain: string;
  provider: "GoDaddy" | "DomainForge Pro";
  active: boolean;
  parked: boolean;
  sslValid: boolean;
  dnsHealthy: boolean;
  lastChecked: string;
  message: string;
}

export /**
 * useGoDaddyIntegration function
 */
function useGoDaddyIntegration(domain = "qvs.qmoi.ai"): any {
  const [status, setStatus] = useState<GoDaddyDomainStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async /**
 * fetchHealth function
 */
function fetchHealth(): any {
      setLoading(true);
      try {
        const response = await apiClient.get(`/api/webhooks/godaddy-health?domain=${encodeURIComponent(domain)}`, {
          method: "GET",
          signal: controller.signal,
        });

        if (!response.ok) {
        }

        const data = (await response.json()) as GoDaddyDomainStatus;
        setStatus({
          domain,
          provider: "DomainForge Pro",
          active: data.active ?? true,
          parked: data.parked ?? false,
          sslValid: data.sslValid ?? true,
          dnsHealthy: data.dnsHealthy ?? true,
          lastChecked: data.lastChecked ?? new Date().toISOString(),
          message: data.message ?? "GoDaddy integration active",
        });
        setError(null);
      } catch (err: unknown) {
        setStatus(null);
        setError(
          err instanceof Error ? err.message : "Unknown GoDaddy integration error",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchHealth();
    const interval = setInterval(fetchHealth, 15000);
    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, [domain]);

  return { status, loading, error };
}
