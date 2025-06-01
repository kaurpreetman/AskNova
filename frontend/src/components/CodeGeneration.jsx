import React, { useState } from 'react';
import { Download, Loader } from 'lucide-react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

SyntaxHighlighter.registerLanguage('python', python);

const CodeGeneration = () => {
  const [prompt, setPrompt] = useState('');
  const [sampleData, setSampleData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [datasets, setDatasets] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulated API call - replace with real backend call
    setTimeout(() => {
      setGeneratedCode(`import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM

model = Sequential([
    LSTM(64, return_sequences=True, input_shape=(sequence_length, features)),
    LSTM(32),
    Dense(1, activation='sigmoid')
])

model.compile(
    optimizer='adam',
    loss='binary_crossentropy',
    metrics=['accuracy']
)`);

      setDatasets([
        {
          name: "Twitter Sentiment Analysis Dataset",
          description: "Large dataset of labeled tweets for sentiment analysis",
          url: "https://kaggle.com/datasets/twitter-sentiment"
        },
        {
          name: "Financial News Headlines",
          description: "Collection of financial news with sentiment labels",
          url: "https://kaggle.com/datasets/financial-sentiment"
        }
      ]);

      setIsLoading(false);
    }, 2000);
  };

  const downloadNotebook = () => {
    const notebook = {
      cells: [{
        cell_type: "code",
        execution_count: null,
        metadata: {},
        outputs: [],
        source: [generatedCode]
      }],
      metadata: {
        kernelspec: {
          display_name: "Python 3",
          language: "python",
          name: "python3"
        }
      },
      nbformat: 4,
      nbformat_minor: 4
    };

    const blob = new Blob([JSON.stringify(notebook, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'model.ipynb';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
        Generate ML Code from a Prompt
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Enter your model prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-32 px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
            placeholder="Describe your ML model needs... (e.g., 'Create a sentiment analysis model for Twitter data')"
          />
        </div>

        <div>
          <label htmlFor="sampleData" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Training Data (JSON format - optional)
          </label>
          <textarea
            id="sampleData"
            value={sampleData}
            onChange={(e) => setSampleData(e.target.value)}
            className="w-full h-32 px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
            placeholder='{"data": [{"text": "Great product!", "sentiment": 1}, ...]}'
          />
        </div>

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

      {isLoading ? (
        <div className="mt-8 space-y-4">
          <Skeleton height={200} className="rounded-lg" />
          <Skeleton height={100} className="rounded-lg" count={2} />
        </div>
      ) : generatedCode && (
        <div className="mt-8 space-y-8">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Generated Code
              </h2>
              <button
                onClick={downloadNotebook}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-200"
              >
                <Download className="h-4 w-4 mr-2" />
                Download as Jupyter Notebook
              </button>
            </div>
            <div className="rounded-lg overflow-hidden">
              <SyntaxHighlighter
                language="python"
                style={atomOneDark}
                customStyle={{
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                  margin: 0
                }}
              >
                {generatedCode}
              </SyntaxHighlighter>
            </div>
          </div>

          <div>
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
                    {dataset.name}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {dataset.description}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeGeneration;
