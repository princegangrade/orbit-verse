import { useState, useEffect } from 'react';
import { History } from 'lucide-react';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';
import Auth from './components/Auth.tsx';
import Welcome from './components/Welcome.tsx';
import PromptPage from './components/PromptPage.tsx';
import ProgressView from './components/ProgressView.tsx';
import ResultsView from './components/ResultsView.tsx';
import HistorySidebar from './components/HistorySidebar.tsx';

type View = 'welcome' | 'prompt' | 'progress' | 'results';

interface HistoryItem {
  id: string;
  prompt: string;
  archetype: string;
  created_at: string;
}

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [currentView, setCurrentView] = useState<View>('welcome');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [currentOrbitId, setCurrentOrbitId] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleStart = () => {
    setCurrentView('prompt');
  };

  const handleGenerate = (prompt: string) => {
    setCurrentPrompt(prompt);
    setCurrentView('progress');
  };

  const handleComplete = (orbitId: string) => {
    setCurrentOrbitId(orbitId);
    setCurrentView('results');
  };

  const handleBack = () => {
    if (currentView === 'results') {
      setCurrentView('prompt');
    } else {
      setCurrentView('welcome');
    }
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setCurrentOrbitId(item.id);
    setCurrentPrompt(item.prompt);
    setCurrentView('results');
  };

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 relative">
      {currentView !== 'welcome' && (
        <button
          onClick={() => setShowHistory(true)}
          className="fixed top-6 right-6 z-30 w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center group hover:border-blue-500/50"
          title="View History"
        >
          <History className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
        </button>
      )}

      {currentView === 'welcome' && <Welcome onStart={handleStart} />}

      {currentView === 'prompt' && (
        <PromptPage onGenerate={handleGenerate} onBack={handleBack} />
      )}

      {currentView === 'progress' && session?.user && (
        <ProgressView prompt={currentPrompt} user={session.user} onComplete={handleComplete} />
      )}

      {currentView === 'results' && (
        <ResultsView orbitId={currentOrbitId} onBack={handleBack} />
      )}

      <HistorySidebar
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        onSelectHistory={handleSelectHistory}
      />
    </div>
  );
}

export default App;