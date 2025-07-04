import React from 'react';
import Editor from '@monaco-editor/react';
import { Download, Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const MonacoEditor = ({ code, isPrinting }) => {
  const { theme } = useTheme();

  const handleDownload = () => {
    const notebookStructure = {
      cells: [
        {
          cell_type: 'code',
          execution_count: null,
          metadata: {},
          outputs: [],
          source: code.split('\n'),
        },
      ],
      metadata: {
        kernelspec: {
          display_name: 'Python 3',
          language: 'python',
          name: 'python3',
        },
        language_info: {
          name: 'python',
          version: '3.8.0',
          mimetype: 'text/x-python',
          file_extension: '.py',
        },
      },
      nbformat: 4,
      nbformat_minor: 4,
    };

    const blob = new Blob([JSON.stringify(notebookStructure, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-notebook.ipynb';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const isRelevantCode = code && !code.includes('⚠️') && code.trim().length > 10;

  return (
    <div className="relative rounded-lg border border-slate-700 dark:border-slate-600 overflow-hidden mt-4">
      {isRelevantCode && (
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={handleDownload}
            disabled={isPrinting}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-teal-700 text-sm disabled:opacity-50"
          >
            {isPrinting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download Notebook
              </>
            )}
          </button>
        </div>
      )}

      <Editor
        height="70vh"
        defaultLanguage="python"
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        value={code}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          wordWrap: 'on',
          readOnly: false,
          padding: { top: 16 },
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default MonacoEditor;
