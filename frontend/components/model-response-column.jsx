import ReactMarkdown from "react-markdown";
import { Bot, Loader, AlertTriangle, CheckCircle, Clock } from "lucide-react";

const statusInfo = {
  idle: { text: "Ready", icon: <Bot size={18} />, color: "text-gray-400" },
  waiting: {
    text: "Waiting...",
    icon: <Clock size={18} />,
    color: "text-yellow-400",
  },
  generating: {
    text: "Generating...",
    icon: <Loader size={18} className="animate-spin" />,
    color: "text-blue-400",
  },
  complete: {
    text: "Complete",
    icon: <CheckCircle size={18} />,
    color: "text-green-400",
  },
  error: {
    text: "Error",
    icon: <AlertTriangle size={18} />,
    color: "text-red-400",
  },
};

export const ModelResponseColumn = ({ modelId, response }) => {
  const { text, icon, color } = statusInfo[response.status];

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 flex flex-col h-full">
      <div className="p-3 border-b border-gray-700 flex items-center justify-between sticky top-0 bg-gray-800">
        <h2 className="text-xl font-semibold capitalize">{modelId}</h2>
        <div className={`flex items-center gap-2 text-sm ${color}`}>
          {icon}
          <span>{text}</span>
        </div>
      </div>
      <div className="p-4 flex-grow overflow-y-auto prose prose-invert prose-sm max-w-none">
        <ReactMarkdown>{response.content || "..."}</ReactMarkdown>
      </div>
    </div>
  );
};
