import React, { useState } from 'react'
import { Shield, Terminal, Github, Activity, AlertOctagon, CheckCircle2, Cpu } from 'lucide-react'
import CodeScanner from './components/CodeScanner'
import GitHubScanner from './components/GitHubScanner'
import VulnerabilityCard from './components/VulnerabilityCard'
import RiskScore from './components/RiskScore'
import SecureCodePanel from './components/SecureCodePanel'
import { scanCode, scanGitHub } from './api/scannerApi'

const TABS = [
  { id: 'code', label: 'Code Scanner', icon: Terminal },
  { id: 'github', label: 'GitHub Scanner', icon: Github },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('code')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleCodeScan = async (code, language) => {
    setLoading(true)
    setError(null)
    try {
      const data = await scanCode(code, language)
      setResult(data)
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || 'Scan failed. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const handleGitHubScan = async (repoUrl, branch) => {
    setLoading(true)
    setError(null)
    try {
      const data = await scanGitHub(repoUrl, branch)
      setResult(data)
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || 'GitHub scan failed.')
    } finally {
      setLoading(false)
    }
  }

  const criticalCount = result?.vulnerabilities?.filter(
    (v) => v.risk_level?.toLowerCase() === 'critical'
  ).length || 0

  const highCount = result?.vulnerabilities?.filter(
    (v) => v.risk_level?.toLowerCase() === 'high'
  ).length || 0

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* Animated background grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(0,212,255,0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(0,212,255,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Header */}
      <header className="relative border-b border-cyber-border bg-cyber-darker/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyber-blue/10 border border-cyber-blue/30">
              <Shield className="w-6 h-6 text-cyber-blue" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-wider">
                Code<span className="text-cyber-blue">Sentinel</span> AI
              </h1>
              <p className="text-xs text-slate-500">Secure Code Review & Vulnerability Intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-cyber-green">
              <div className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
              <span>AI SYSTEM ONLINE</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 border border-cyber-border px-3 py-1.5 rounded-lg">
              <Cpu className="w-3 h-3" />
              Powered by GPT-4o
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-1 mb-8 bg-cyber-darker border border-cyber-border rounded-xl p-1 w-fit">
          {TABS.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-cyber-blue text-cyber-dark'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-900/20 border border-red-500/40 rounded-xl px-5 py-4 text-red-400">
            <AlertOctagon className="w-5 h-5 flex-shrink-0" />
            <div>
              <div className="font-semibold">Scan Error</div>
              <div className="text-sm text-red-300 mt-0.5">{error}</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left column: Scanner input */}
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-cyber-panel border border-cyber-border rounded-xl p-6">
              <h2 className="text-base font-semibold text-slate-200 mb-5 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyber-blue" />
                {activeTab === 'code' ? 'Paste Source Code' : 'GitHub Repository'}
              </h2>
              {activeTab === 'code' ? (
                <CodeScanner onScan={handleCodeScan} loading={loading} />
              ) : (
                <GitHubScanner onScan={handleGitHubScan} loading={loading} />
              )}
            </div>

            {/* Vulnerability List */}
            {result && result.vulnerabilities?.length > 0 && (
              <div className="bg-cyber-panel border border-cyber-border rounded-xl p-6">
                <h2 className="text-base font-semibold text-slate-200 mb-5 flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 text-red-400" />
                  Detected Vulnerabilities
                  <span className="ml-auto text-xs bg-red-900/40 border border-red-500/30 text-red-400 px-2 py-0.5 rounded-full">
                    {result.vulnerabilities.length} found
                  </span>
                </h2>
                <div>
                  {result.vulnerabilities.map((vuln) => (
                    <VulnerabilityCard key={vuln.id} vuln={vuln} />
                  ))}
                </div>
              </div>
            )}

            {result && result.vulnerabilities?.length === 0 && (
              <div className="bg-green-900/10 border border-green-500/20 rounded-xl p-6 flex items-center gap-4">
                <CheckCircle2 className="w-10 h-10 text-cyber-green flex-shrink-0" />
                <div>
                  <div className="font-semibold text-cyber-green text-lg">No Vulnerabilities Detected</div>
                  <div className="text-sm text-slate-400 mt-1">{result.summary}</div>
                </div>
              </div>
            )}

            {/* Secure Code Fix */}
            {result?.secure_fix && result.vulnerabilities?.length > 0 && (
              <div>
                <h2 className="text-base font-semibold text-slate-200 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyber-green" />
                  AI-Generated Secure Fix
                </h2>
                <SecureCodePanel code={result.secure_fix} language={result.language_detected} />
              </div>
            )}
          </div>

          {/* Right column: Dashboard */}
          <div className="space-y-6">
            {/* Risk Score */}
            <div className="bg-cyber-panel border border-cyber-border rounded-xl p-6">
              <h2 className="text-sm font-semibold text-slate-400 mb-6 tracking-widest uppercase flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Risk Dashboard
              </h2>
              {result ? (
                <div className="flex flex-col items-center gap-6">
                  <RiskScore score={result.security_score} />
                  <div className="w-full grid grid-cols-2 gap-3">
                    <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-red-400">{criticalCount}</div>
                      <div className="text-xs text-slate-500 mt-1">Critical</div>
                    </div>
                    <div className="bg-orange-900/20 border border-orange-500/20 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-orange-400">{highCount}</div>
                      <div className="text-xs text-slate-500 mt-1">High</div>
                    </div>
                    <div className="bg-cyber-panel border border-cyber-border rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-slate-300">{result.vulnerabilities?.length || 0}</div>
                      <div className="text-xs text-slate-500 mt-1">Total</div>
                    </div>
                    <div className="bg-cyber-panel border border-cyber-border rounded-lg p-3 text-center">
                      <div className="text-sm font-bold text-cyber-blue truncate">{result.language_detected}</div>
                      <div className="text-xs text-slate-500 mt-1">Language</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <Shield className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p className="text-sm">Scan code to see<br />security analysis</p>
                </div>
              )}
            </div>

            {/* AI Summary */}
            {result?.summary && (
              <div className="bg-cyber-panel border border-cyber-border rounded-xl p-6">
                <h2 className="text-sm font-semibold text-slate-400 mb-3 tracking-widest uppercase flex items-center gap-2">
                  <Cpu className="w-4 h-4" />
                  AI Analysis
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">{result.summary}</p>
                {result.scan_id && (
                  <div className="mt-4 text-xs font-mono text-slate-600 border-t border-cyber-border pt-3">
                    SCAN ID: {result.scan_id}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-cyber-border mt-16 py-6 text-center text-xs text-slate-600">
        <div className="flex items-center justify-center gap-2">
          <Shield className="w-3 h-3" />
          CodeSentinel AI — Enterprise Secure Code Review Platform
        </div>
      </footer>
    </div>
  )
}
