import { useEffect, useRef } from 'react';

export async function sendMasterCommand(command: { command: string; target?: string; meta?: any }, secret: string) {
  const res = await fetch('/api/master/command', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-master-secret': secret },
    body: JSON.stringify(command),
  });
  return res.json();
}

export function useMasterCommands(onCommand: (cmd: any) => void, interval = 5000) {
  const lastId = useRef<number | null>(null);
  useEffect(() => {
    let mounted = true;
    async function poll() {
      try {
        const res = await fetch('/api/master/last', { cache: 'no-store' });
        const data = await res.json();
        if (!mounted || !data?.success) return;
        const cmd = data.command;
        if (cmd && cmd.id && cmd.id !== lastId.current) {
          lastId.current = cmd.id;
          onCommand(cmd);
        }
      } catch (e) {
        // ignore
      }
    }
    const t = setInterval(poll, interval);
    poll();
    return () => {
      mounted = false;
      clearInterval(t);
    };
  }, [onCommand, interval]);
}

export default useMasterCommands;
