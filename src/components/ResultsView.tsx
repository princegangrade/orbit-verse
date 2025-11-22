import { useState } from 'react';
import { Download, GitBranch, ChevronRight, ChevronDown, File, Folder, Info } from 'lucide-react';

interface ResultsViewProps {
  orbitId: string;
  onBack: () => void;
}

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
}

const sampleFileTree: FileNode[] = [
  {
    name: 'src',
    type: 'folder',
    children: [
      { name: 'components', type: 'folder', children: [
        { name: 'ProductCard.tsx', type: 'file', content: 'React component for product display' },
        { name: 'Cart.tsx', type: 'file', content: 'Shopping cart component' },
      ]},
      { name: 'pages', type: 'folder', children: [
        { name: 'Home.tsx', type: 'file', content: 'Landing page' },
        { name: 'Products.tsx', type: 'file', content: 'Product catalog page' },
      ]},
      { name: 'api', type: 'folder', children: [
        { name: 'auth.ts', type: 'file', content: 'Authentication endpoints' },
        { name: 'products.ts', type: 'file', content: 'Product CRUD operations' },
      ]},
      { name: 'App.tsx', type: 'file', content: 'Main application component' },
      { name: 'main.tsx', type: 'file', content: 'Application entry point' },
    ],
  },
  {
    name: '.github',
    type: 'folder',
    children: [
      {
        name: 'workflows',
        type: 'folder',
        children: [
          { name: 'ci.yml', type: 'file', content: 'Continuous integration workflow' },
          { name: 'deploy.yml', type: 'file', content: 'Deployment workflow' },
        ],
      },
    ],
  },
  {
    name: 'docker',
    type: 'folder',
    children: [
      { name: 'Dockerfile', type: 'file', content: 'Container definition' },
      { name: 'docker-compose.yml', type: 'file', content: 'Multi-container setup' },
    ],
  },
  { name: 'README.md', type: 'file', content: 'Project documentation' },
  { name: 'package.json', type: 'file', content: 'Dependencies and scripts' },
  { name: '.env.example', type: 'file', content: 'Environment variables template' },
];

interface FileTreeNodeProps {
  node: FileNode;
  level: number;
}

function FileTreeNode({ node, level }: FileTreeNodeProps) {
  const [isOpen, setIsOpen] = useState(level === 0);

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-1.5 px-3 hover:bg-slate-50 rounded-lg cursor-pointer ${
          level > 0 ? 'ml-' + (level * 4) : ''
        }`}
        onClick={() => node.type === 'folder' && setIsOpen(!isOpen)}
        style={{ paddingLeft: `${level * 16 + 12}px` }}
      >
        {node.type === 'folder' && (
          isOpen ? (
            <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
          )
        )}
        {node.type === 'folder' ? (
          <Folder className="w-4 h-4 text-blue-500 flex-shrink-0" />
        ) : (
          <File className="w-4 h-4 text-slate-400 flex-shrink-0" />
        )}
        <span className="text-sm text-slate-700 font-medium">{node.name}</span>
      </div>

      {node.type === 'folder' && isOpen && node.children && (
        <div>
          {node.children.map((child, index) => (
            <FileTreeNode key={index} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ResultsView({ orbitId, onBack }: ResultsViewProps) {
  const [showExplanation, setShowExplanation] = useState(false);

  const handleDownload = () => {
    alert('Download functionality would trigger here');
  };

  const handleInitRepo = () => {
    alert('Initialize local repo functionality would trigger here');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-slate-600 hover:text-slate-900 font-medium"
        >
          ← New Orbit
        </button>
        <h1 className="text-xl font-semibold text-slate-900">
          Orbit Ready: {orbitId}
        </h1>
        <div className="w-24" />
      </header>

      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-8 mb-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold">Orbit Generated Successfully!</h2>
          </div>
          <p className="text-white/90 text-lg">
            Your complete SDLC environment is ready. Download the files or initialize a local repository to get started.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={handleDownload}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow flex items-center gap-4 group"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <Download className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-slate-900">Download ZIP</h3>
              <p className="text-sm text-slate-600">Get all files</p>
            </div>
          </button>

          <button
            onClick={handleInitRepo}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow flex items-center gap-4 group"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <GitBranch className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-slate-900">Init Local Repo</h3>
              <p className="text-sm text-slate-600">Set up Git</p>
            </div>
          </button>

          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow flex items-center gap-4 group"
          >
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center group-hover:bg-amber-200 transition-colors">
              <Info className="w-6 h-6 text-amber-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-slate-900">Explain Orbit</h3>
              <p className="text-sm text-slate-600">See decisions</p>
            </div>
          </button>
        </div>

        {showExplanation && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Orbit Architecture Explanation
            </h3>
            <div className="space-y-4 text-slate-700">
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">
                  Detected Archetype: E-commerce Platform
                </h4>
                <p className="text-sm">
                  Based on your requirements for user authentication, product catalog, shopping cart, and payment integration, we classified this as an e-commerce platform.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-2">
                  Technology Stack Selection
                </h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>React - Modern UI library for responsive frontend</li>
                  <li>Node.js + Express - Scalable backend API server</li>
                  <li>PostgreSQL - Relational database for product/order management</li>
                  <li>Docker - Containerization for consistent deployments</li>
                  <li>GitHub Actions - Automated CI/CD pipeline</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-2">
                  Key Features Included
                </h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>JWT-based authentication system</li>
                  <li>Product catalog with search and filtering</li>
                  <li>Shopping cart with session persistence</li>
                  <li>Payment gateway integration stub (Stripe)</li>
                  <li>Monitoring and logging infrastructure</li>
                  <li>Comprehensive API documentation</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Generated Files
          </h3>

          <div className="border border-slate-200 rounded-xl p-4 max-h-96 overflow-y-auto">
            {sampleFileTree.map((node, index) => (
              <FileTreeNode key={index} node={node} level={0} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
