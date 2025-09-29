"use client";

import { useState, useRef } from 'react';
import { ModelResponseColumn } from '../components/model-response-column';
import { Send, Loader, BrainCircuit } from 'lucide-react';

// Update the model names to be compared in the UI
const MODELS = ['gemini-flash', 'gemini-pro'];

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [responses, setResponses] = useState(
    MODELS.reduce((acc, model) => ({ ...acc, [model]: { content: '', status: 'idle' } }), {})
  );
  const [isLoading, setIsLoading] = useState(false);
  const eventSourceRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setResponses(
      MODELS.reduce((acc, model) => ({ ...acc, [model]: { content: '', status: 'waiting' } }), {})
    );

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    
    const eventSource = new EventSource(`http://localhost:3001/prompt?prompt=${encodeURIComponent(prompt)}`);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
        console.log("Connection to server opened.");
    };

    eventSource.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      
      // Check for the special 'done' message from the backend
      if (parsedData.model === 'system' && parsedData.status === 'done') {
        eventSource.close();
        setIsLoading(false);
        setResponses((prev) => {
            const newResponses = { ...prev };
            MODELS.forEach(model => {
                if (newResponses[model].status === 'generating') {
                    newResponses[model].status = 'complete';
                }
            });
            return newResponses;
        });
        return; // Stop processing further
      }

      const { model, chunk } = parsedData;
      setResponses((prev) => ({
        ...prev,
        [model]: {
          content: prev[model].content + chunk,
          status: 'generating',
        },
      }));
    };

    eventSource.onerror = (err) => {
      console.error('EventSource failed:', err);
      
      setResponses((prev) => {
        const newResponses = { ...prev };
        MODELS.forEach(model => {
            if (newResponses[model].status === 'generating' || newResponses[model].status === 'waiting') {
                newResponses[model].status = 'error';
            }
        });
        return newResponses;
      });

      setIsLoading(false);
      eventSource.close();
    };
  };

  return (
    <main className="flex flex-col h-screen bg-gray-900 text-white font-sans">
      <header className="p-4 border-b border-gray-700 flex items-center gap-3">
        <BrainCircuit className="text-blue-400" size={32} />
        <h1 className="text-2xl font-bold">AI Model Playground</h1>
      </header>
      <div className="flex-grow p-4 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto">
        {MODELS.map((modelId) => (
          <ModelResponseColumn key={modelId} modelId={modelId} response={responses[modelId]} />
        ))}
      </div>
      <footer className="p-4 border-t border-gray-700">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt here..."
              rows={1}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 pr-12 text-lg resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 transition-colors"
              disabled={isLoading || !prompt.trim()}
            >
              {isLoading ? <Loader className="animate-spin" /> : <Send />}
            </button>
          </div>
        </form>
      </footer>
    </main>
  );
}

