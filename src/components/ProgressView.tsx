import { useEffect, useState, useRef } from 'react';
import { Terminal, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { generateProject } from '../lib/gemini';
import AgentTerminal from './AgentTerminal';

import { User } from '@supabase/supabase-js';

interface ProgressViewProps {
  prompt: string;
  user: User;
  onComplete: (orbitId: string) => void;
}

export default function ProgressView({ prompt, user, onComplete }: ProgressViewProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState('Initializing Agent...');
  const [error, setError] = useState<string | null>(null);
  const generatedRef = useRef<boolean>(false);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  useEffect(() => {
    if (generatedRef.current) return;
    generatedRef.current = true;

    const runGeneration = async () => {
      try {
        addLog('🚀 Starting Gemini 2.5 Agent...');
        setStatus('Connecting to Gemini...');

        // 1. Create initial record
        if (!user) throw new Error('No user found');

        const { data: orbit, error: createError } = await supabase
          .from('orbits')
          .insert({
            user_id: user.id,
            prompt,
            status: 'processing',
            tools: ['gemini-2.5', 'react', 'tailwindcss'],
            artifacts: {}
          })
          .select()
          .single();

        if (createError) throw createError;
        if (!orbit) throw new Error('Failed to create orbit');

        addLog(`✅ Orbit created: ${orbit.id}`);
        setStatus('Generating Project Structure...');

        // 2. Call Gemini API
        addLog('🤖 Sending prompt to Gemini...');
        addLog('⏳ Analyzing requirements...');

        // Simulate some "thinking" logs while waiting for the stream
        const thinkingInterval = setInterval(() => {
          const thoughts = [
            '🔍 Reviewing architectural patterns...',
            '📦 Selecting optimal dependencies...',
            '🎨 Designing UI component hierarchy...',
            '🛡️ Configuring security rules...',
            '⚡ Optimizing build configuration...'
          ];
          const randomThought = thoughts[Math.floor(Math.random() * thoughts.length)];
          addLog(randomThought);
        }, 2500);

        const result = await generateProject(prompt, (log) => {
          clearInterval(thinkingInterval); // Stop thinking logs once we get real data
          addLog(log);
        });

        clearInterval(thinkingInterval);
        addLog('✨ Generation complete! Parsing files...');
        setStatus('Finalizing...');

        // 3. Save results
        const { error: updateError } = await supabase
          .from('orbits')
          .update({
            status: 'completed',
            artifacts: {
              files: result.files,
              explanation: result.explanation
            },
            archetype: 'React Application'
          })
          .eq('id', orbit.id);

        if (updateError) throw updateError;

        addLog('💾 Project saved to database.');
        setStatus('Done!');

        setTimeout(() => {
          onComplete(orbit.id);
        }, 2000);

      } catch (err: any) {
        console.error(err);
        setError(err.message);
        addLog(`❌ Error: ${err.message}`);
        setStatus('Failed');
      }
    };

    runGeneration();
  }, [prompt, onComplete]);

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-red-900 mb-2">Generation Failed</h3>
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
        <div className="mt-6 h-96">
          <AgentTerminal logs={logs} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{status}</h2>
            <p className="text-slate-500">Powered by Gemini 2.5</p>
          </div>
        </div>

        <div className="h-[500px] bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-inner">
          <div className="bg-slate-800 px-4 py-2 flex items-center gap-2 border-b border-slate-700">
            <Terminal className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-medium text-slate-300">Agent Terminal</span>
          </div>
          <div className="p-4 h-[calc(100%-40px)]">
            <AgentTerminal logs={logs} />
          </div>
        </div>
      </div>
    </div>
  );
}
