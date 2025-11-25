import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer
} from '@codesandbox/sandpack-react';
import { GeneratedFile } from '../lib/gemini';

interface CodePreviewProps {
  files: GeneratedFile[];
}

export default function CodePreview({ files }: CodePreviewProps) {
  const sandpackFiles = files.reduce((acc, file) => {
    // Normalize path: ensure no leading slash for Sandpack
    const path = file.path.startsWith('/') ? file.path.slice(1) : file.path;
    acc[path] = file.content;
    return acc;
  }, {} as Record<string, string>);

  // Ensure essential files exist
  if (!sandpackFiles['index.html']) {
    sandpackFiles['index.html'] = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Generated App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
  }

  if (!sandpackFiles['src/main.tsx']) {
    sandpackFiles['src/main.tsx'] = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`;
  }

  return (
    <div className="h-full w-full bg-slate-900">
      <SandpackProvider
        template="react-ts"
        theme="dark"
        files={sandpackFiles}
        options={{
          externalResources: ['https://cdn.tailwindcss.com'],
        }}
      >
        <SandpackLayout className="h-full !rounded-none !border-none">
          <SandpackFileExplorer className="!h-full !bg-slate-900" />
          <SandpackCodeEditor
            showTabs
            showLineNumbers
            showInlineErrors
            wrapContent
            closableTabs
            className="!h-full"
          />
          <SandpackPreview
            showNavigator
            showRefreshButton
            showOpenInCodeSandbox={false}
            className="!h-full"
          />
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
}
