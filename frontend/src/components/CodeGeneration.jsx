import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { Download, Loader,History, ListChecks,ClipboardCopy,Check } from 'lucide-react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

SyntaxHighlighter.registerLanguage('python', python);

const CodeGeneration = () => {
  const [socket, setSocket] = useState(null);
  const [trainingData, setTrainingData] = useState('');
  const [prompt, setPrompt] = useState('');
  const [code, setCode] = useState('// Generated code will appear here');
  const [displayedCode, setDisplayedCode] = useState('// Generated code will appear here');
  const [steps, setSteps] = useState([]);
  const [displayedSteps, setDisplayedSteps] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [initiated, setInitiated] = useState(false);
  const [userId, setUserId] = useState(null);
    const [copied, setCopied] = useState(false);

  const sessionId = new URLSearchParams(window.location.search).get('session');

  // Placeholder history & steps - replace with real logic if needed
  const history = chatMessages;
  const implementationSteps = displayedSteps.map((s) => `${s.title}: ${s.description}`);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);

    const newSocket = io('http://localhost:5000', {
      transports: ['websocket']
    });
    setSocket(newSocket);

    let accumulatedResponse = '';
    let debounceTimer;

    newSocket.on('generate-response-chunk', (data) => {
      accumulatedResponse += data.chunk;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        parseGeminiResponse(accumulatedResponse, true);
      }, 16);
    });

    newSocket.on('generate-response-result', (data) => {
      setIsLoading(false);
      parseGeminiResponse(data.response, false);
      accumulatedResponse = '';
      if (data.datasets) setDatasets(data.datasets);
    });

    newSocket.on('error', (errorData) => {
      console.error('Socket error:', errorData.message);
      setIsLoading(false);
    });

    return () => {
      clearTimeout(debounceTimer);
      newSocket.disconnect();
    };
  }, []);

  const parseGeminiResponse = (response, isStreaming) => {
    if (!isStreaming) {
      setDisplayedCode('');
      setDisplayedSteps([]);
    }

    if (isStreaming) {
      const partialMatch = response.match(/<code>([\s\S]*?)(<\/code>|$)/);
      if (partialMatch) {
        setDisplayedCode(partialMatch[1].trim());
      }
      return;
    }

    const tagsMatch = response.match(/<AskNovaSteps>([\s\S]*?)<\/AskNovaSteps>/);
    if (tagsMatch) {
      const steps = tagsMatch[1]
  .split('\n')
  .map(tag => {
    const [title, ...desc] = tag.split(':');
    return { title: title.trim(), description: desc.join(':').trim() };
  })
  .filter(step => step.title && step.description); // Only keep valid steps

setSteps(steps);
setDisplayedSteps(steps);

    }

    const codeMatch = response.match(/<code>([\s\S]*?)<\/code>/);
    if (codeMatch) {
      const finalCode = codeMatch[1].trim();
      setCode(finalCode);
      setDisplayedCode(finalCode);
    }

    setInitiated(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setInitiated(true);
    setDisplayedSteps([]);
    setDisplayedCode('');
    setDatasets([]);

    const trainingJSON = trainingData ? JSON.parse(trainingData) : null;

    const message = {
      role: 'user',
      content: prompt,
      trainingData: trainingData.trim() || undefined,
      timestamp: new Date(),
      userId
    };

    setChatMessages(prev => [...prev, message]);

    socket.emit('generate-response', {
      userPrompt: prompt,
      trainingData: trainingJSON,
      userId,
      sessionId: sessionId || Date.now().toString()
    });

    setPrompt('');
    setTrainingData('');
  };

  const downloadNotebook = () => {
    const notebook = {
      cells: [{
        cell_type: "code",
        source: [code],
        outputs: [],
        metadata: {},
        execution_count: null,
      }],
      metadata: { kernelspec: { name: "python3", language: "python", display_name: "Python 3" } },
      nbformat: 4,
      nbformat_minor: 4,
    };

    const blob = new Blob([JSON.stringify(notebook, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'generated_model.ipynb';
    link.click();
  };
console.log(displayedSteps);
  return (
     <div className="flex min-h-screen">
      <div className="w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
        <div className="p-6 h-full">
          <div className="flex items-center mb-6 text-slate-900 dark:text-white">
            <History className="w-5 h-5 mr-2" />
            <h2 className="text-lg font-semibold">History</h2>
          </div>
          <div className="space-y-4">
            {history.map((item) => (
              <button
                key={item.id}
                className="w-full text-left p-4 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <p className="text-sm font-medium text-slate-900 dark:text-white line-clamp-2">
                  {item.prompt}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  {new Date(item.timestamp).toLocaleDateString()}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>


      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
            Generate ML Code from a Prompt
          </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Enter your model prompt
              </label>
          <textarea
            placeholder="Describe your ML model..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-24 p-4 rounded-lg border dark:bg-slate-800 dark:text-white"
          /> </div>
          <div>
              <label htmlFor="sampleData" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Training Data (JSON format - optional)
              </label>
          <textarea
            placeholder="Sample training data (optional)"
            value={trainingData}
            onChange={(e) => setTrainingData(e.target.value)}
            className="w-full h-24 p-4 rounded-lg border dark:bg-slate-800 dark:text-white"
          /> </div>
          <div>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Generating...
                  </>
                ) : (
                  'Generate'
                )}
              </button>
            </div>
        </form>

        {initiated && (
  <div className="mt-8">
    <div className="flex justify-between items-center mb-2">
  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Generated Code</h2>
  <div className="flex items-center space-x-2">
    <button
      onClick={downloadNotebook}
      className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-teal-700 transition-colors"
    >
      <Download className="mr-2 h-4 w-4" />
      Download Notebook
    </button>
    <button
      onClick={() => {
        navigator.clipboard.writeText(displayedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center hover:bg-slate-600 transition-colors"
    >
      {copied ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Copied
        </>
      ) : (
        <>
          <ClipboardCopy className="mr-2 h-4 w-4" />
          Copy Code
        </>
      )}
    </button>
  </div>
</div>

    <div
      className="rounded-lg bg-slate-900"
      style={{
        maxHeight: '600px',
        overflowX: 'auto',
        overflowY: 'auto',
        border: '1px solid #334155',
      }}
    >
      <SyntaxHighlighter
        language="python"
        style={atomOneDark}
        customStyle={{
          margin: 0,
          padding: '1.5rem',
          backgroundColor: 'transparent', // Ensure it blends with parent
          minWidth: '100%',
          whiteSpace: 'pre', // Prevent wrapping
        }}
      >
        {displayedCode}
      </SyntaxHighlighter>
    </div>
  </div>
)}
 </div>
 </div>    
<div className="w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800">
        <div className="p-6 h-full">
          <div className="mb-10">
            <div className="flex items-center mb-6 text-slate-900 dark:text-white">
              <ListChecks className="w-5 h-5 mr-2" />
              <h2 className="text-lg font-semibold">Implementation Steps</h2>
            </div>
            <div className="space-y-4">
              {displayedSteps.map((step, index) => (
                <div
                  key={index}
                  className="flex items-start p-3 text-sm text-slate-700 dark:text-slate-300"
                >
                  <div className="w-8 h-8 flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 rounded-full mr-3 flex-shrink-0 text-purple-600 dark:text-purple-400 font-medium">
                    {index + 1}
                  </div>
                  <p className="pt-1.5">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {datasets.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center">
                📊 Suggested Datasets
              </h2>
              <div className="space-y-4">
                {datasets.map((dataset, index) => (
                  <a
                    key={index}
                    href={dataset.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <h3 className="font-medium text-slate-900 dark:text-white mb-1">
                      {dataset.title}
                    </h3>
                    
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
   
  );
};

export default CodeGeneration;
