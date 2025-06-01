import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { Download, Loader } from 'lucide-react';
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
  const chatContainerRef = useRef(null);

  const sessionId = new URLSearchParams(window.location.search).get('session');

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
      if (data.datasets) {
        setDatasets(data.datasets);
      }
    });

    newSocket.on('error', (errorData) => {
      console.error('Socket error:', errorData.message);
      setIsLoading(false);
    });

    return () => {
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
      console.log(displayedCode)
      return;
    }

    const tagsMatch = response.match(/<ChanetTags>([\s\S]*?)<\/ChanetTags>/);
    if (tagsMatch) {
      const steps = tagsMatch[1].split('\n').map(tag => {
        const [title, ...desc] = tag.split(':');
        return { title: title.trim(), description: desc.join(':').trim() };
      });
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">ML Code Generator</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <textarea
          placeholder="Describe your ML model..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full h-24 p-4 rounded-lg border dark:bg-slate-800 dark:text-white"
        />
        <textarea
          placeholder="Sample training data (optional)"
          value={trainingData}
          onChange={(e) => setTrainingData(e.target.value)}
          className="w-full h-24 p-4 rounded-lg border dark:bg-slate-800 dark:text-white"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
        >
          {isLoading ? <Loader className="animate-spin" /> : 'Generate'}
        </button>
      </form>

      

      {initiated &&  (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">Generated Code</h2>
            <button onClick={downloadNotebook} className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center">
              <Download className="mr-2 h-4 w-4" />
              Download Notebook
            </button>
          </div>
          <div className="max-h-[600px] overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-700">
    <SyntaxHighlighter language="python" style={atomOneDark} customStyle={{ margin: 0 }}>
      {displayedCode}
    </SyntaxHighlighter>
  </div>
        </div>
      )}

      {datasets.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
            📊 Suggested Datasets
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {datasets.map((dataset, index) => (
              <a
                key={index}
                href={dataset.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-md transition duration-200 border border-slate-200 dark:border-slate-700"
              >
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  {dataset.title}
                </h3>

              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeGeneration;
