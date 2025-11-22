import { useState, useEffect } from 'react';
import { X, Clock, ChevronRight } from 'lucide-react';

interface HistoryItem {
  id: string;
  prompt: string;
  archetype: string;
  created_at: string;
}

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectHistory: (item: HistoryItem) => void;
}

const sampleHistory: HistoryItem[] = [
  {
    id: 'orbit-1',
    prompt: 'Build an e-commerce site with user authentication, product catalog, shopping cart, and payment integration',
    archetype: 'E-commerce Platform',
    created_at: '2025-11-22T10:30:00Z',
  },
  {
    id: 'orbit-2',
    prompt: 'Create a machine learning pipeline with data ingestion and model training',
    archetype: 'ML Pipeline',
    created_at: '2025-11-21T15:45:00Z',
  },
  {
    id: 'orbit-3',
    prompt: 'Design a RESTful microservice API with authentication and rate limiting',
    archetype: 'Microservice API',
    created_at: '2025-11-20T09:15:00Z',
  },
];

export default function HistorySidebar({
  isOpen,
  onClose,
  onSelectHistory,
}: HistorySidebarProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  const loadHistory = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setHistory(sampleHistory);
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 z-40 md:hidden"
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 transform transition-transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-900">
              Orbit History
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100%-80px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No orbits generated yet</p>
              <p className="text-sm text-slate-400 mt-1">
                Start by creating your first orbit
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectHistory(item);
                    onClose();
                  }}
                  className="w-full text-left bg-slate-50 hover:bg-slate-100 rounded-xl p-4 transition-colors group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {item.archetype}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                  </div>

                  <p className="text-sm text-slate-700 line-clamp-2 mb-2">
                    {item.prompt}
                  </p>

                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(item.created_at)}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
