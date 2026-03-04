import React, { useState } from 'react'
import { Github, Loader2, GitBranch } from 'lucide-react'

export default function GitHubScanner({ onScan, loading }) {
  const [repoUrl, setRepoUrl] = useState('')
  const [branch, setBranch] = useState('main')

  const handleScan = () => {
    if (repoUrl.trim()) {
      onScan(repoUrl, branch)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Github className="w-4 h-4 text-cyber-blue" />
        <span>Enter a public GitHub repository URL to scan its source files</span>
      </div>
      <div className="flex gap-3">
        <input
          type="text"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="https://github.com/owner/repository"
          className="flex-1 bg-cyber-darker border border-cyber-border rounded-lg px-4 py-3 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyber-blue transition-colors font-mono"
        />
        <div className="flex items-center gap-2 bg-cyber-darker border border-cyber-border rounded-lg px-3">
          <GitBranch className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            placeholder="main"
            className="w-24 bg-transparent text-sm text-slate-300 placeholder-slate-600 focus:outline-none"
          />
        </div>
      </div>
      <button
        onClick={handleScan}
        disabled={loading || !repoUrl.trim()}
        className="flex items-center gap-2 px-8 py-3 bg-cyber-purple text-white font-bold rounded-lg hover:bg-purple-600 hover:scale-105 active:scale-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: '#7c3aed' }}
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Github className="w-5 h-5" />
        )}
        {loading ? 'Scanning Repo...' : 'Scan Repository'}
      </button>
    </div>
  )
}
