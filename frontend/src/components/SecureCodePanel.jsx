import React, { useState } from 'react'
import { Check, Copy, Shield } from 'lucide-react'

export default function SecureCodePanel({ code, language }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-cyber-panel border border-cyber-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-cyber-border bg-cyber-darker">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyber-green" />
          <span className="text-sm font-semibold text-cyber-green">Secure Fix Generated</span>
          {language && (
            <span className="text-xs px-2 py-0.5 rounded bg-cyber-border text-slate-400">{language}</span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border border-cyber-border text-slate-400 hover:border-cyber-blue hover:text-cyber-blue transition-colors"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 text-sm text-slate-300 overflow-x-auto font-mono leading-relaxed max-h-96 overflow-y-auto bg-cyber-darker">
        <code>{code}</code>
      </pre>
    </div>
  )
}
