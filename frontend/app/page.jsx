"use client";

import { useState, useRef, useEffect } from "react";
import { ModelResponseColumn } from "../components/model-response-column";
import { Send, Loader, BrainCircuit } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
console.log("Connecting to API_URL:", API_URL);

const MODELS = ["gemini-flash", "gemini-pro"];

// Main functional component for the application UI and logic
export default function Home() {
  const [prompt, setPrompt] = useState(""); // State to store the user's input prompt
  const [sessionId, setSessionId] = useState(null); // State to store the unique session ID received from the backend, required for SSE
  // State to manage responses for all models.
  // Initial state maps each model to an object: { content: "", status: "idle" }, Keyed by model ID.
  const [responses, setResponses] = useState(
    MODELS.reduce(
      (acc, model) => ({ ...acc, [model]: { content: "", status: "idle" } }),
      {}
    )
  );
  const [isLoading, setIsLoading] = useState(false);
  const eventSourceRef = useRef(null);

  // useEffect hook to create a new session ID when the component mounts
  useEffect(() => {
    const createSession = async () => {
      try {
        // API call to the backend to get a new session ID for chat history/context
        const res = await fetch(`${API_URL}/sessions`, { method: "POST" });
        const data = await res.json();
        setSessionId(data.id);
        console.log("Session created:", data.id);
      } catch (error) {
        console.error("Failed to create session:", error);
      }
    };
    createSession();
  }, []);
  // Handler for form submission (sending the prompt to the backend)
  const handleSubmit = async (e) => {
    e.preventDefault();
    //stop if prompt is empty, app is already loading, or session ID is missing
    if (!prompt.trim() || isLoading || !sessionId) return;

    setIsLoading(true);
    //Reset responses for the new query and set status to 'waiting' for all models
    setResponses(
      MODELS.reduce(
        (acc, model) => ({
          ...acc,
          [model]: { content: "", status: "waiting" },
        }),
        {}
      )
    );
    //Close any previously open EventSource connection to prevent stale data
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    //Create a new Server-Sent Events (SSE) connection to the prompt endpoint
    const eventSource = new EventSource(
      `${API_URL}/prompt?prompt=${encodeURIComponent(
        prompt
      )}&sessionId=${sessionId}`
    );
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log("Connection to server opened.");
    };

    // Handler for receiving streaming data chunks (messages) from the server
    eventSource.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);

      // Check for the system signal indicating the entire stream is complete
      if (parsedData.model === "system" && parsedData.status === "done") {
        eventSource.close();
        setIsLoading(false);
        // Final status update: Mark any models still "generating" as 'complete'
        setResponses((prev) => {
          const newResponses = { ...prev };
          MODELS.forEach((model) => {
            if (newResponses[model].status === "generating") {
              newResponses[model].status = "complete";
            }
          });
          return newResponses;
        });
        return;
      }
      // If it's a content chunk, extract model ID and the chunk of text
      const { model, chunk } = parsedData;
      // Update the state with the new chunk of text, appending it to the existing content
      setResponses((prev) => ({
        ...prev,
        [model]: {
          content: prev[model].content + chunk,
          status: "generating",
        },
      }));
    };
    // Handler for errors during the SSE connection (e.g., network failure)
    eventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
      // Update the status of any active or waiting models to 'error'
      setResponses((prev) => {
        const newResponses = { ...prev };
        MODELS.forEach((model) => {
          if (
            newResponses[model].status === "generating" ||
            newResponses[model].status === "waiting"
          ) {
            newResponses[model].status = "error";
          }
        });
        return newResponses;
      });

      setIsLoading(false);
      eventSource.close();
    };
  };
  // Render the application UI
  return (
    <main className="flex flex-col h-screen bg-gray-900 text-white font-sans">
      {/* Application Header */}
      <header className="p-4 border-b border-gray-700 flex items-center gap-3">
        <BrainCircuit className="text-blue-400" size={32} />
        <h1 className="text-2xl font-bold">AI Model Playground</h1>
      </header>
      {/* Main content area: responsive grid for model responses */}
      <div className="flex-grow p-4 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto">
        {/* Map over the defined models and render a response column for each */}
        {MODELS.map((modelId) => (
          <ModelResponseColumn
            key={modelId}
            modelId={modelId}
            response={responses[modelId]} // Pass the specific model's content and status
          />
        ))}
      </div>
      {/* Footer section containing the prompt input form */}
      <footer className="p-4 border-t border-gray-700">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          {/* Container for the textarea and the submit button (must be relative for button positioning) */}
          <div className="relative">
             {/* Prompt input textarea */}
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                sessionId ? "Enter your prompt here..." : "Creating session..."
              }
              rows={1}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 pr-12 text-lg resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
              disabled={isLoading || !sessionId} // Disable while loading or session is not ready
              // Custom keydown handler to submit on Enter key (prevents newline)
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            {/* Submit button */}
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 transition-colors"
              disabled={isLoading || !prompt.trim() || !sessionId}
            >
               {/* Show loading spinner while loading, otherwise show Send icon */}
              {isLoading ? <Loader className="animate-spin" /> : <Send />}
            </button>
          </div>
        </form>
      </footer>
    </main>
  );
}
