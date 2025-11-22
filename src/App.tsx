import { useState } from 'react';
import { History } from 'lucide-react';
import Welcome from './components/Welcome';
import PromptPage from './components/PromptPage';
import ProgressView from './components/ProgressView';
import ResultsView from './components/ResultsView';
import HistorySidebar from './components/HistorySidebar';

type View = 'welcome' | 'prompt' | 'progress' | 'results';

interface HistoryItem {
  id: string;
  prompt: string;
  archetype: string;
  created_at: string;
}

function App() {
  const [currentView, setCurrentView] = useState<View>('welcome');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [currentOrbitId, setCurrentOrbitId] = useState('');
  const [showHistory, setShowHistory] = useState(false);

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

  return (
    <div className="min-h-screen bg-slate-50 relative">
      {currentView !== 'welcome' && (
        <button
          onClick={() => setShowHistory(true)}
          className="fixed top-6 right-6 z-30 w-12 h-12 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center group"
          title="View History"
        >
          <History className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
        </button>
      )}

      {currentView === 'welcome' && <Welcome onStart={handleStart} />}

      {currentView === 'prompt' && (
        <PromptPage onGenerate={handleGenerate} onBack={handleBack} />
      )}

      {currentView === 'progress' && (
        <ProgressView prompt={currentPrompt} onComplete={handleComplete} />
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
