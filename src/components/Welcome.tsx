import { Rocket, Lightbulb, Code, GitBranch, Cloud, Activity, FileText } from 'lucide-react';

interface WelcomeProps {
  onStart: () => void;
}

export default function Welcome({ onStart }: WelcomeProps) {
  const features = [
    { icon: Lightbulb, label: 'Planning', color: 'text-amber-500' },
    { icon: FileText, label: 'Design', color: 'text-blue-500' },
    { icon: Code, label: 'Code', color: 'text-green-500' },
    { icon: GitBranch, label: 'CI/CD', color: 'text-purple-500' },
    { icon: Cloud, label: 'Deploy', color: 'text-cyan-500' },
    { icon: Activity, label: 'Monitor', color: 'text-rose-500' },
    { icon: FileText, label: 'Docs', color: 'text-slate-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-6 shadow-lg">
            <Rocket className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-6xl font-bold text-slate-900 mb-4 tracking-tight">
            Orbit Verse
          </h1>

          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            AI-curated SDLC environments tailored to your vision. Enter a project idea and DevOps Orbit generates a complete starter skeleton with code, Docker, CI/CD, monitoring, and documentation.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-8">
          <h2 className="text-2xl font-semibold text-slate-800 mb-8 text-center">
            Complete SDLC Toolkit Included
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 mb-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center p-4 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className={`${feature.color} mb-3`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <span className="text-sm font-medium text-slate-700">
                  {feature.label}
                </span>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={onStart}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl"
            >
              <Rocket className="w-5 h-5" />
              Start Building
            </button>
          </div>
        </div>

        <div className="text-center text-sm text-slate-500">
          <p>From idea to deployment-ready scaffold in seconds</p>
        </div>
      </div>
    </div>
  );
}
