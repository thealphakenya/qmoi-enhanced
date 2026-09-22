import React, { useEffect, useState } from 'react';
import { ChakraProvider, Box, Heading, Text, Badge, VStack, Code } from '@chakra-ui/react';

function Dashboard() {
  const [health, setHealth] = useState('unknown');
  const [logs, setLogs] = useState('');
  const [provider, setProvider] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/health');
        const data = await res.json();
        setHealth(data.status);
      } catch { setHealth('offline'); }
      try {
        const logRes = await fetch('/logs/qmoispace_health.log');
        setLogs(await logRes.text());
      } catch { setLogs('No logs'); }
      try {
        const provRes = await fetch('/api/provider');
        const provData = await provRes.json();
        setProvider(provData.name);
      } catch { setProvider('unknown'); }
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ChakraProvider>
      <Box p={6}>
        <Heading size="lg" mb={4}>Qmoispace Dashboard</Heading>
        <Text>Status: <Badge colorScheme={health === 'ok' ? 'green' : 'red'}>{health}</Badge></Text>
        <Text>Current Provider: <Badge>{provider}</Badge></Text>
        <Heading size="md" mt={6}>Health Logs</Heading>
        <Code p={2} w="100%" whiteSpace="pre-wrap">{logs}</Code>
        {/* Future: AI review, plugin system, healing actions */}
      </Box>
    </ChakraProvider>
  );
}
export default Dashboard; 