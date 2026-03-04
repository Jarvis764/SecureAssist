import React, { useState } from 'react'
import { Shield, Loader2 } from 'lucide-react'

const LANGUAGES = [
  { value: 'auto', label: 'Auto Detect' },
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'java', label: 'Java' },
  { value: 'php', label: 'PHP' },
  { value: 'go', label: 'Go' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'csharp', label: 'C#' },
]

const PLACEHOLDER = `# Paste your code here to scan for vulnerabilities
# Example vulnerable code:

import sqlite3

def get_user(username):
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    query = "SELECT * FROM users WHERE username = '" + username + "'"
    cursor.execute(query)
    return cursor.fetchone()

API_KEY = "sk-secret-hardcoded-key-12345"
`

export default function CodeScanner({ onScan, loading }) {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('auto')

  const handleScan = () => {
    if (code.trim()) {
      onScan(code, language)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-cyber-darker border border-cyber-border text-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyber-blue transition-colors"
        >
          {LANGUAGES.map((l) => (
            <option key={l.value} value={l.value}>{l.label}</option>
          ))}
        </select>
        <div className="text-xs text-slate-500">Select language or let AI detect automatically</div>
      </div>

      <div className="relative">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={PLACEHOLDER}
          className="w-full h-72 bg-cyber-darker border border-cyber-border rounded-xl p-4 text-sm font-mono text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyber-blue transition-colors resize-none"
          spellCheck={false}
        />
        {loading && (
          <div className="absolute inset-0 bg-cyber-darker/80 rounded-xl flex items-center justify-center">
            <div className="flex items-center gap-3 text-cyber-blue">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="font-semibold tracking-wider">SCANNING CODE...</span>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleScan}
        disabled={loading || !code.trim()}
        className="flex items-center gap-2 px-8 py-3 bg-cyber-blue text-cyber-dark font-bold rounded-lg hover:shadow-glow-blue hover:scale-105 active:scale-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Shield className="w-5 h-5" />
        )}
        {loading ? 'Analyzing...' : 'Scan Code'}
      </button>
    </div>
  )
}
