import { useState } from 'react';
import { Send, Sparkles, CheckCircle2 } from 'lucide-react';

interface PromptPageProps {
  onGenerate: (prompt: string) => void;
  onBack: () => void;
}

const examplePrompts = [
  {
    label: 'E-commerce Platform',
    prompt: 'Build an e-commerce site with user authentication, product catalog, shopping cart, and payment integration using Stripe',
  },
  {
    label: 'ML Pipeline',
    prompt: 'Create a machine learning pipeline with data ingestion, model training, evaluation, and deployment with MLflow tracking',
  },
  {
    label: 'Microservice API',
    prompt: 'Design a RESTful microservice API with authentication, database integration, rate limiting, and comprehensive API documentation',
  },
];

export default function PromptPage({ onGenerate, onBack }: PromptPageProps) {
  const [prompt, setPrompt] = useState('');
  const [analysis, setAnalysis] = useState<{
    archetype: string;
    tools: string[];
    checklist: string[];
  } | null>(null);

  const handlePromptChange = (value: string) => {
    setPrompt(value);

    if (value.length > 20) {
      const lowerPrompt = value.toLowerCase();
      let archetype = 'Web Application';
      const tools: string[] = [];
      const checklist: string[] = [];

      if (lowerPrompt.includes('e-commerce') || lowerPrompt.includes('shop')) {
        archetype = 'E-commerce Platform';
        tools.push('React', 'Node.js', 'PostgreSQL', 'Stripe', 'Docker');
        checklist.push('User authentication', 'Product catalog', 'Payment gateway');
      } else if (lowerPrompt.includes('ml') || lowerPrompt.includes('machine learning') || lowerPrompt.includes('model')) {
        archetype = 'ML Pipeline';
        tools.push('Python', 'TensorFlow', 'MLflow', 'Docker', 'Kubernetes');
        checklist.push('Data processing', 'Model training', 'API endpoint');
      } else if (lowerPrompt.includes('api') || lowerPrompt.includes('microservice')) {
        archetype = 'Microservice API';
        tools.push('Node.js', 'Express', 'PostgreSQL', 'Redis', 'Docker');
        checklist.push('REST endpoints', 'Authentication', 'Rate limiting');
      } else {
        tools.push('React', 'Node.js', 'Docker', 'GitHub Actions');
        checklist.push('Frontend UI', 'Backend API', 'CI/CD pipeline');
      }

      setAnalysis({ archetype, tools, checklist });
    } else {
      setAnalysis(null);
    }
  };

  const handleExampleClick = (examplePrompt: string) => {
    setPrompt(examplePrompt);
    handlePromptChange(examplePrompt);
  };

  const canGenerate = prompt.trim().length > 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-slate-600 hover:text-slate-900 font-medium"
        >
          ← Back
        </button>
        <h1 className="text-xl font-semibold text-slate-900">DevOps Orbit</h1>
        <div className="w-16" />
      </header>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 p-6 max-w-7xl mx-auto w-full">
        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-white rounded-2xl shadow-sm p-6 flex-1 flex flex-col">
            <label className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              Describe Your Project
            </label>

            <textarea
              value={prompt}
              onChange={(e) => handlePromptChange(e.target.value)}
              placeholder="Describe your project idea... e.g. 'E-commerce site with login, cart, payments'"
              className="flex-1 w-full p-4 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-400 min-h-[200px]"
            />

            <div className="mt-4">
              <p className="text-sm font-medium text-slate-600 mb-2">
                Quick start examples:
              </p>
              <div className="flex flex-wrap gap-2">
                {examplePrompts.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(example.prompt)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors"
                  >
                    {example.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => onGenerate(prompt)}
              disabled={!canGenerate}
              className={`mt-6 w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all ${
                canGenerate
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
              Generate Orbit
            </button>
          </div>
        </div>

        <div className="lg:w-96">
          <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Live Preview
            </h2>

            {analysis ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">
                    Detected Archetype
                  </p>
                  <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-900 font-medium">{analysis.archetype}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">
                    Selected Tools
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.tools.map((tool, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full border border-green-200"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">
                    Quick Checklist
                  </p>
                  <div className="space-y-2">
                    {analysis.checklist.map((item, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500 text-sm">
                  Start typing to see your orbit preview
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
