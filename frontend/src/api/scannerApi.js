import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || ''

export async function scanCode(code, language = 'auto') {
  const response = await axios.post(`${API_BASE}/api/scan`, { code, language })
  return response.data
}

export async function scanGitHub(repoUrl, branch = 'main') {
  const response = await axios.post(`${API_BASE}/api/scan/github`, {
    repo_url: repoUrl,
    branch,
  })
  return response.data
}
