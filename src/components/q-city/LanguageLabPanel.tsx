import React from 'react';

export default function LanguageLabPanel() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Language Lab</h2>
      <p>Practice, learn, and master any language. (UI and features coming soon)</p>
      <ul className="mt-4 list-disc ml-6">
        <li>Multilingual chat and speech</li>
        <li>Text-to-Speech (TTS) and Speech-to-Text (STT)</li>
        <li>Translation and language lessons</li>
        <li>Pronunciation and quizzes</li>
      </ul>
      <div className="mt-6 p-4 bg-gray-100 rounded">API integration coming soon.</div>
    </div>
  );
} 