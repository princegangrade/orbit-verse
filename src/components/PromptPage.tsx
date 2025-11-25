import { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react';
import { analyzePrompt, AnalysisResult } from '../lib/gemini';

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
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    const handlePromptChange = (value: string) => {
        setPrompt(value);

        // Clear existing timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        if (value.length > 10) {
            setAnalyzing(true);
            // Debounce analysis by 800ms
            debounceTimerRef.current = setTimeout(async () => {
                try {
                    const result = await analyzePrompt(value);
                    setAnalysis(result);
                } catch (error) {
                    console.error('Analysis failed:', error);
                } finally {
                    setAnalyzing(false);
                }
            }, 800);
        } else {
            setAnalysis(null);
            setAnalyzing(false);
        }
    };

    const handleExampleClick = (examplePrompt: string) => {
        setPrompt(examplePrompt);
        handlePromptChange(examplePrompt);
    };

    const canGenerate = prompt.trim().length > 0;

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            <header className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <button
                    onClick={onBack}
                    className="text-slate-400 hover:text-white font-medium flex items-center gap-2 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>
                <h1 className="text-xl font-semibold text-slate-200">DevOps Orbit</h1>
                <div className="w-16" />
            </header>

            <div className="flex-1 flex flex-col lg:flex-row gap-6 p-6 max-w-7xl mx-auto w-full">
                <div className="flex-1 flex flex-col gap-4">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex-1 flex flex-col shadow-xl backdrop-blur-sm">
                        <label className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-blue-500" />
                            Describe Your Project
                        </label>

                        <textarea
                            value={prompt}
                            onChange={(e) => handlePromptChange(e.target.value)}
                            placeholder="Describe your project idea... e.g. 'E-commerce site with login, cart, payments'"
                            className="flex-1 w-full p-4 bg-slate-950 border border-slate-800 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-slate-200 placeholder-slate-600 min-h-[200px] transition-all"
                        />

                        <div className="mt-6">
                            <p className="text-sm font-medium text-slate-500 mb-3">
                                Quick start examples:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {examplePrompts.map((example, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleExampleClick(example.prompt)}
                                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors border border-slate-700 hover:border-slate-600"
                                    >
                                        {example.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => onGenerate(prompt)}
                            disabled={!canGenerate}
                            className={`mt-6 w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all ${canGenerate
                                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500 shadow-lg hover:shadow-blue-500/25 transform hover:scale-[1.01]'
                                    : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
                                }`}
                        >
                            <Send className="w-5 h-5" />
                            Generate Orbit
                        </button>
                    </div>
                </div>

                <div className="lg:w-96">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sticky top-24 shadow-xl backdrop-blur-sm">
                        <h2 className="text-lg font-semibold text-slate-200 mb-4 flex items-center justify-between">
                            Live Preview
                            {analyzing && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
                        </h2>

                        {analysis ? (
                            <div className="space-y-6 animate-fade-in">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 mb-2">
                                        Detected Archetype
                                    </p>
                                    <div className="px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                        <p className="text-blue-400 font-medium">{analysis.archetype}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-slate-500 mb-2">
                                        Recommended Tools
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {analysis.tools.map((tool, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-green-500/10 text-green-400 text-sm font-medium rounded-full border border-green-500/20"
                                            >
                                                {tool}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-slate-500 mb-2">
                                        Implementation Checklist
                                    </p>
                                    <div className="space-y-3">
                                        {analysis.checklist.map((item, index) => (
                                            <div key={index} className="flex items-start gap-3">
                                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-sm text-slate-300">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
                                    <Sparkles className="w-8 h-8 text-slate-600" />
                                </div>
                                <p className="text-slate-500 text-sm">
                                    {analyzing ? 'Analyzing your idea...' : 'Start typing to see your orbit preview'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
