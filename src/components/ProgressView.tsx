import { useEffect, useState } from 'react';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

interface ProgressViewProps {
  prompt: string;
  onComplete: (orbitId: string) => void;
}

interface Step {
  id: number;
  label: string;
  status: 'pending' | 'active' | 'completed';
}

interface LogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'error';
}

export default function ProgressView({ prompt, onComplete }: ProgressViewProps) {
  const [steps, setSteps] = useState<Step[]>([
    { id: 1, label: 'Classifying', status: 'active' },
    { id: 2, label: 'Planning tools', status: 'pending' },
    { id: 3, label: 'Generating artifacts', status: 'pending' },
    { id: 4, label: 'Packaging', status: 'pending' },
    { id: 5, label: 'Done', status: 'pending' },
  ]);

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      timestamp: new Date().toLocaleTimeString(),
      message: `Analyzing prompt: "${prompt.substring(0, 60)}${prompt.length > 60 ? '...' : ''}"`,
      type: 'info',
    },
  ]);

  useEffect(() => {
    const progressSimulation = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      addLog('Detected archetype: E-commerce Platform', 'success');
      completeStep(1);
      activateStep(2);

      await new Promise((resolve) => setTimeout(resolve, 1200));
      addLog('Selected tools: React, Node.js, PostgreSQL, Docker, GitHub Actions', 'info');
      completeStep(2);
      activateStep(3);

      await new Promise((resolve) => setTimeout(resolve, 800));
      addLog('Generating Dockerfile...', 'info');

      await new Promise((resolve) => setTimeout(resolve, 1000));
      addLog('Creating CI workflow configuration...', 'info');

      await new Promise((resolve) => setTimeout(resolve, 900));
      addLog('Scaffolding application structure...', 'info');

      await new Promise((resolve) => setTimeout(resolve, 1100));
      addLog('Generating README and documentation...', 'info');

      await new Promise((resolve) => setTimeout(resolve, 700));
      addLog('Adding monitoring and observability stubs...', 'info');
      completeStep(3);
      activateStep(4);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      addLog('Packaging artifacts...', 'info');

      await new Promise((resolve) => setTimeout(resolve, 800));
      addLog('Compressing files into downloadable archive...', 'info');
      completeStep(4);
      activateStep(5);

      await new Promise((resolve) => setTimeout(resolve, 500));
      addLog('Orbit generated successfully!', 'success');
      completeStep(5);

      await new Promise((resolve) => setTimeout(resolve, 800));
      onComplete('orbit-' + Date.now());
    };

    progressSimulation();
  }, [prompt, onComplete]);

  const addLog = (message: string, type: LogEntry['type']) => {
    setLogs((prev) => [
      ...prev,
      {
        timestamp: new Date().toLocaleTimeString(),
        message,
        type,
      },
    ]);
  };

  const completeStep = (stepId: number) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === stepId ? { ...step, status: 'completed' } : step
      )
    );
  };

  const activateStep = (stepId: number) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === stepId ? { ...step, status: 'active' } : step
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <h1 className="text-xl font-semibold text-slate-900">
          Generating Your Orbit
        </h1>
      </header>

      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">
            Progress
          </h2>

          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                      step.status === 'completed'
                        ? 'bg-green-500 border-green-500'
                        : step.status === 'active'
                        ? 'bg-blue-500 border-blue-500'
                        : 'bg-white border-slate-300'
                    }`}
                  >
                    {step.status === 'completed' ? (
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    ) : step.status === 'active' ? (
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300" />
                    )}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium ${
                      step.status === 'completed'
                        ? 'text-green-600'
                        : step.status === 'active'
                        ? 'text-blue-600'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 transition-colors ${
                      steps[index + 1].status === 'completed' ||
                      steps[index + 1].status === 'active'
                        ? 'bg-blue-500'
                        : 'bg-slate-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Live Logs
          </h2>

          <div className="bg-slate-900 rounded-xl p-4 h-80 overflow-y-auto font-mono text-sm">
            {logs.map((log, index) => (
              <div key={index} className="mb-2 flex gap-3">
                <span className="text-slate-500 flex-shrink-0">
                  [{log.timestamp}]
                </span>
                <span
                  className={
                    log.type === 'success'
                      ? 'text-green-400'
                      : log.type === 'error'
                      ? 'text-red-400'
                      : 'text-slate-300'
                  }
                >
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
