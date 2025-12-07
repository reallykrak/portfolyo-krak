// GitHub API Integration
document.addEventListener('DOMContentLoaded', function() {
  fetchGitHubData();
});

async function fetchGitHubData() {
  const username = 'zypheriss'; 
  
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

function displayRepositories(repos) {
  const projectsContainer = document.getElementById('projects-container');
  if (!projectsContainer) return;
  

  projectsContainer.innerHTML = '';

  const featuredRepos = repos
    .filter(repo => !repo.fork)
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 6);
  
  featuredRepos.forEach(repo => {
    const placeholderImage = `https://opengraph.githubassets.com/1/${repo.owner.login}/${repo.name}`;
    
    const card = document.createElement('div');
    card.className = 'project-card';
    const randomColor = getRandomColor();
    
    card.innerHTML = `
      <div class="project-image">
        <img src="${placeholderImage}" alt="${repo.name}" onerror="this.onerror=null;this.src='https://via.placeholder.com/300x150/${randomColor.replace('#', '')}/${getContrastColor(randomColor).replace('#', '')}?text=${repo.name}';">
      </div>
      <div class="project-details">
        <h3 class="project-title">${repo.name}</h3>
        <p class="project-description">${repo.description || 'No description available.'}</p>
        <div class="project-tech">
          ${repo.language ? `<span class="tech-tag">${repo.language}</span>` : ''}
          ${repo.stargazers_count > 0 ? `<span class="tech-tag">★ ${repo.stargazers_count}</span>` : ''}
          ${repo.forks_count > 0 ? `<span class="tech-tag">🍴 ${repo.forks_count}</span>` : ''}
        </div>
        <div class="project-links">
          <a href="${repo.html_url}" target="_blank">
            <i class="fab fa-github"></i> View on GitHub
          </a>
          ${repo.homepage ? `<a href="${repo.homepage}" target="_blank"><i class="fas fa-external-link-alt"></i>zyp</a>` : ''}
        </div>
      </div>
    `;
    
    projectsContainer.appendChild(card);
  });
}

function displayFallbackRepositories() {
  const projectsContainer = document.getElementById('projects-container');
  if (!projectsContainer) return;
  
  // Clear loading state
  projectsContainer.innerHTML = '';
  const fallbackRepos = [
    {
      name: 'zypherisin Sİkim sonik botu',
      description: 'Açıklamayı yedim',
      language: 'JavaScript',
      stars: 15,
      forks: 5,
      color: '#f1e05a'
    },
    {
      name: 'bot',
      description: 'Github hesabı eklenmediği için devreye girdim',
      language: 'Node.js',
      stars: 12,
      forks: 3,
      color: '#68a063'
    },
    {
      name: 'Portfolio Website',
      description: 'Personal portfolio website showcasing projects and skills.',
      language: 'HTML/CSS',
      stars: 8,
      forks: 2,
      color: '#e34c26'
    },
    {
      name: 'tool',
      description: '',
      language: 'React',
      stars: 10,
      forks: 4,
      color: '#61dafb'
    },
    {
      name: 'zyp',
      description: '',
      language: 'JavaScript',
      stars: 11,
      forks: 2,
      color: '#f1e05a'
    },
    {
      name: 'zyp',
      description: '',
      language: 'D3.js',
      stars: 9,
      forks: 1,
      color: '#f9a03c'
    }
  ];
  
  fallbackRepos.forEach(repo => {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    card.innerHTML = `
      <div class="project-image">
        <img src="https://via.placeholder.com/300x150/${repo.color.replace('#', '')}/FFFFFF?text=${repo.name}" alt="${repo.name}">
      </div>
      <div class="project-details">
        <h3 class="project-title">${repo.name}</h3>
        <p class="project-description">${repo.description}</p>
        <div class="project-tech">
          <span class="tech-tag">${repo.language}</span>
          <span class="tech-tag">★ ${repo.stars}</span>
          <span class="tech-tag">🍴 ${repo.forks}</span>
        </div>
        <div class="project-links">
          <a href="#" target="_blank">
            <i class="fab fa-github"></i> View on GitHub
          </a>
          <a href="#" target="_blank">
            <i class="fas fa-external-link-alt"></i> Live Demo
          </a>
        </div>
      </div>
    `;
    
    projectsContainer.appendChild(card);
  });
}


function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getContrastColor(hexColor) {
  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}