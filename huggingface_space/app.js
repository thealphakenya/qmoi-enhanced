import React, { useState } from 'react';
import { ChakraProvider, Box, Heading, Button, Select, Textarea, useToast } from '@chakra-ui/react';
import AccessibilitySettingsPanel from '../components/ui/AccessibilitySettingsPanel';

const providers = [
  { label: 'Hugging Face Inference API', value: 'hf' },
  { label: 'Local Model', value: 'local' },
  { label: 'Cloud Provider', value: 'cloud' }
];

function QmoispaceApp() {
  const [provider, setProvider] = useState('hf');
  const [feedback, setFeedback] = useState('');
  const toast = useToast();

  const handleFeedback = () => {
    // TODO: send feedback to backend/email
    toast({ title: 'Feedback sent!', status: 'success', duration: 3000 });
    setFeedback('');
  };

  return (
    <ChakraProvider>
      <Box bg="gray.50" minH="100vh" p={8}>
        <Heading as="h1" size="xl" mb={6} color="teal.600">Qmoispace</Heading>
        <AccessibilitySettingsPanel />
        <Box mt={8} mb={4}>
          <Heading as="h2" size="md" mb={2}>Inference Provider</Heading>
          <Select value={provider} onChange={e => setProvider(e.target.value)} maxW="300px">
            {providers.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </Select>
        </Box>
        {/* Device and healing controls would go here */}
        <Box mt={8} maxW="500px">
          <Heading as="h2" size="md" mb={2}>Send Feedback</Heading>
          <Textarea value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Your feedback or bug report..." mb={2} />
          <Button colorScheme="teal" onClick={handleFeedback}>Send</Button>
        </Box>
      </Box>
    </ChakraProvider>
  );
}
export default QmoispaceApp; 