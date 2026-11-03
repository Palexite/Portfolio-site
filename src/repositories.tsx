import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import profileImage from './assets/profile.png'

type Repository = {
  id: number
  name: string
  html_url: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
}

function App() {
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('https://api.github.com/users/Palexite/repos?per_page=100&sort=updated')
      .then((response) => {
        if (!response.ok) {
          throw new Error('GitHub could not provide the repositories right now.')
        }
        return response.json() as Promise<Repository[]>
      })
      .then(setRepositories)
      .catch((fetchError: unknown) => {
        setError(fetchError instanceof Error ? fetchError.message : 'Something went wrong.')
      })
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <main className="page-shell">
      <header className="profile-header">
        <img className="profile" src={profileImage} alt="Peter's profile" />
        <div className="profile-copy">
          <h1>Peter Panagopoulos</h1>
          <a className="profile-link" href="https://github.com/Palexite" target="_blank" rel="noreferrer">
            View profile <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      <section className="repository-section" aria-labelledby="repositories-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">The collection</p>
            <h2 id="repositories-heading">Repositories</h2>
          </div>
          {!isLoading && !error && <span className="repo-count">{repositories.length} public projects</span>}
        </div>

        {isLoading && <p className="status-message">Loading repositories...</p>}
        {error && <p className="status-message error-message">{error}</p>}
        {!isLoading && !error && repositories.length === 0 && (
          <p className="status-message">No public repositories found.</p>
        )}

        {!isLoading && !error && repositories.length > 0 && (
          <div className="repository-list">
            {repositories.map((repository) => (
              <a
                className="repository-card"
                href={repository.html_url}
                target="_blank"
                rel="noreferrer"
                key={repository.id}
              >
                <div className="repository-card-topline">
                  <span className="repository-name">{repository.name}</span>
                  <span className="arrow" aria-hidden="true">↗</span>
                </div>
                <p className="repository-description">
                  {repository.description || 'No description provided for this repository.'}
                </p>
                <div className="repository-meta">
                  {repository.language && <span><i className="language-dot" />{repository.language}</span>}
                  <span>★ {repository.stargazers_count}</span>
                  <span>⑂ {repository.forks_count}</span>
                  <span className="updated-date">Updated {new Date(repository.updated_at).toLocaleDateString()}</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
