import { writeFile } from 'node:fs/promises'

const names = ['homelab-ansible', 'election-results-platform', 'devops-sre-lab', 'Terraform', 'prometheus-grafana']
const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'GonellaPortfolioBuild', ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}) }
async function get(path) {
  const response = await fetch(`https://api.github.com${path}`, { headers })
  if (!response.ok) throw new Error(`GitHub metadata request failed: ${response.status}`)
  return response.json()
}
const repositories = []
for (const name of names) {
  const repo = await get(`/repos/lucasgonella/${name}`)
  if (repo.private || repo.owner.login !== 'lucasgonella') throw new Error('Only authorized public repositories may be included')
  const [languages, commits] = await Promise.all([get(`/repos/lucasgonella/${name}/languages`), get(`/repos/lucasgonella/${name}/commits?per_page=1`)])
  repositories.push({ name: repo.name, url: repo.html_url, description: repo.description, language: repo.language, languages: Object.keys(languages), fork: repo.fork, updatedAt: repo.updated_at, lastCommitAt: commits[0]?.commit?.committer?.date ?? null, lastCommit: commits[0]?.sha ?? null })
}
await writeFile(new URL('../src/data/projects.json', import.meta.url), JSON.stringify({ verifiedAt: new Date().toISOString(), repositories }, null, 2) + '\n')
console.log(`Refreshed ${repositories.length} public repositories. No browser API calls required.`)
