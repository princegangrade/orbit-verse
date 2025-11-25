import { useEffect, useState } from 'react';
import { Download, ArrowLeft, Loader2, Code, Eye, Monitor, Smartphone, Tablet } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { GeneratedFile } from '../lib/gemini';
import CodePreview from './CodePreview';
import JSZip from 'jszip';

interface ResultsViewProps {
  orbitId: string;
  onBack: () => void;
}

export default function ResultsView({ orbitId, onBack }: ResultsViewProps) {
  const [orbit, setOrbit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<GeneratedFile[]>([]);
  const [viewMode, setViewMode] = useState<'code' | 'preview' | 'split'>('split');

  useEffect(() => {
    const fetchOrbit = async () => {
      try {
        const { data, error } = await supabase
          .from('orbits')
          .select('*')
          .eq('id', orbitId)
          .single();

        if (error) throw error;
        setOrbit(data);

        if (data.artifacts?.files) {
          setFiles(data.artifacts.files);
        }
      } catch (error) {
        console.error('Error fetching orbit:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orbitId) {
      fetchOrbit();
    }
  }, [orbitId]);

  const handleDownload = async () => {
    if (!files.length) return;

    try {
      const zip = new JSZip();
      files.forEach(file => {
        const path = file.path.startsWith('/') ? file.path.slice(1) : file.path;
        zip.file(path, file.content);
      });

      const blob = await zip.generateAsync({
        type: 'blob',
        mimeType: 'application/zip'
      });

      // Try File System Access API first
      if ('showSaveFilePicker' in window) {
        try {
          const handle = await (window as any).showSaveFilePicker({
            suggestedName: `project-${orbitId.slice(0, 8)}.zip`,
            types: [{
              description: 'ZIP Archive',
              accept: { 'application/zip': ['.zip'] },
            }],
          });
          const writable = await handle.createWritable();
          await writable.write(blob);
          await writable.close();
          return;
        } catch (err: any) {
          if (err.name === 'AbortError') return; // User cancelled
          console.warn('File System Access API failed, falling back to download link', err);
        }
      }

      // Fallback to classic download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `project-${orbitId.slice(0, 8)}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to generate zip file');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-950 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
              {orbit?.prompt || 'Generated Project'}
              <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20">
                {orbit?.archetype || 'React'}
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* View Toggles */}
          <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
            <button
              onClick={() => setViewMode('code')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'code' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-300'}`}
              title="Code View"
            >
              <Code className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'split' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-300'}`}
              title="Split View"
            >
              <div className="flex gap-0.5">
                <div className="w-1.5 h-3 border border-current rounded-[1px]" />
                <div className="w-1.5 h-3 bg-current rounded-[1px]" />
              </div>
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'preview' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-300'}`}
              title="Preview View"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          <div className="h-6 w-px bg-slate-800" />

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all text-sm font-medium shadow-lg hover:shadow-blue-500/25"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden relative">
        {files.length > 0 ? (
          <CodePreview files={files} />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-500 flex-col gap-4">
            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center border border-slate-800">
              <Code className="w-8 h-8 text-slate-700" />
            </div>
            <p>No files generated</p>
          </div>
        )}
      </div>
    </div>
  );
}
