document.addEventListener('DOMContentLoaded', function() {
  fetchGitHubData();
});

async function fetchGitHubData() {
  const username = 'reallykrak'; 
  
  try {
    const userData = await fetchWithRetry(`https://api.github.com/users/${username}`);
    const repos = await fetchWithRetry(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    updateGitHubStats(userData, repos);
    displayRepositories(repos);
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    displayFallbackRepositories();
  }
}

async function fetchWithRetry(url, retries = 3, delay = 1000) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`GitHub API Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, retries - 1, delay * 2);
    }
    throw error;
  }
}

function updateGitHubStats(userData, repos) {
  const repoCountElement = document.getElementById('repo-count');
  if (repoCountElement) {
    repoCountElement.textContent = userData.public_repos || repos.length;
    animateCountUp(repoCountElement, 0, userData.public_repos || repos.length);
  }

  const totalStars = repos.reduce((total, repo) => total + repo.stargazers_count, 0);
  const starsCountElement = document.getElementById('stars-count');
  if (starsCountElement) {
    starsCountElement.textContent = totalStars;
    animateCountUp(starsCountElement, 0, totalStars);
  }
  const languages = new Set();
  repos.forEach(repo => {
    if (repo.language) languages.add(repo.language);
  });
  
  const languagesCountElement = document.getElementById('languages-count');
  if (languagesCountElement) {
    languagesCountElement.textContent = languages.size;
    animateCountUp(languagesCountElement, 0, languages.size);
  }
}

function animateCountUp(element, start, end) {
  let current = start;
  const increment = Math.ceil(end / 20); 
  const timer = setInterval(() => {
    current += increment;
    if (current >= end) {
      clearInterval(timer);
      current = end;
    }
    element.textContent = current;
  }, 50);
}

// LOGO EŞLEŞTİRİCİ FONKSİYON (Senin istediğin özellik)
function getLanguageIcon(language) {
  if (!language) return '<i class="fas fa-code"></i>';
  const langLower = language.toLowerCase();
  
  const iconMap = {
    'c#': 'devicon-csharp-plain',
    'javascript': 'devicon-javascript-plain',
    'html': 'devicon-html5-plain',
    'css': 'devicon-css3-plain',
    'python': 'devicon-python-plain',
    'lua': 'devicon-lua-plain',
    'java': 'devicon-java-plain',
    'c++': 'devicon-cplusplus-plain',
    'typescript': 'devicon-typescript-plain',
    'nodejs': 'devicon-nodejs-plain',
    'react': 'devicon-react-original'
  };

  const iconClass = iconMap[langLower];
  return iconClass ? `<i class="${iconClass}"></i>` : '<i class="fas fa-code"></i>';
}

function displayRepositories(repos) {
  const projectsContainer = document.getElementById('projects-container');
  if (!projectsContainer) return;
  
  projectsContainer.innerHTML = '';

  const featuredRepos = repos
    .filter(repo => !repo.fork)
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 6);
  
  featuredRepos.forEach(repo => {
    const card = document.createElement('div');
    card.className = 'project-card';
    const langIcon = getLanguageIcon(repo.language);
    
    card.innerHTML = `
      <h3 class="project-title"><i class="fab fa-github"></i> ${repo.name}</h3>
      <p class="project-description">${repo.description || 'No description available.'}</p>
      <div class="project-tech">
        ${repo.language ? `<span class="tech-tag">${langIcon} ${repo.language}</span>` : ''}
        ${repo.stargazers_count > 0 ? `<span class="tech-tag">★ ${repo.stargazers_count}</span>` : ''}
        ${repo.forks_count > 0 ? `<span class="tech-tag">🍴 ${repo.forks_count}</span>` : ''}
      </div>
      <div class="project-links">
        <a href="${repo.html_url}" target="_blank">View on GitHub <i class="fas fa-arrow-right"></i></a>
        ${repo.homepage ? `<a href="${repo.homepage}" target="_blank"><i class="fas fa-external-link-alt"></i> Demo</a>` : ''}
      </div>
    `;
    
    projectsContainer.appendChild(card);
  });
}

function displayFallbackRepositories() {
  const projectsContainer = document.getElementById('projects-container');
  if (!projectsContainer) return;
  projectsContainer.innerHTML = '<p style="text-align:center;">GitHub verileri çekilemedi.</p>';
}
