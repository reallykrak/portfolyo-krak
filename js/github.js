document.addEventListener('DOMContentLoaded', function() {
  fetchGitHubData();
});

var allRepos = [];
var shownCount = 0;
var PAGE_SIZE = 3;

async function fetchGitHubData() {
  const username = 'reallykrak';
  try {
    const [userData, repos] = await Promise.all([
      fetchWithRetry(`https://api.github.com/users/${username}`),
      fetchWithRetry(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`)
    ]);
    displayGitHubProfile(userData);
    updateGitHubStats(userData, repos);
    allRepos = repos.filter(r => !r.fork).sort((a,b) => new Date(b.updated_at) - new Date(a.updated_at));
    shownCount = 0;
    loadMoreRepos();
  } catch (error) {
    console.error('GitHub error:', error);
    displayFallbackRepositories();
  }
}

async function fetchWithRetry(url, retries = 3, delay = 1000) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`GitHub API Error: ${res.status}`);
    return await res.json();
  } catch (err) {
    if (retries > 0) {
      await new Promise(r => setTimeout(r, delay));
      return fetchWithRetry(url, retries - 1, delay * 2);
    }
    throw err;
  }
}

function displayGitHubProfile(user) {
  const el = document.getElementById('gh-profile');
  if (!el) return;
  // Followers'ı 400-500 arası göster (gerçek + biraz boost)
  const followers = user.followers || 0;
  const displayFollowers = followers < 400 ? followers + Math.floor(Math.random()*80)+420 : followers;

  el.innerHTML = `
    <div class="gh-avatar-wrap">
      <img src="${user.avatar_url}" alt="avatar" class="gh-avatar">
      <div class="gh-badge"><i class="fab fa-github"></i></div>
    </div>
    <div class="gh-info">
      <h3 class="gh-name">${user.name || user.login}</h3>
      <span class="gh-username">@${user.login}</span>
      <a href="${user.html_url}" target="_blank" class="gh-view-btn">
        <i class="fab fa-github"></i> View on GitHub
      </a>
      ${user.bio ? `<p class="gh-bio">${user.bio}</p>` : ''}
      <div class="gh-stats-row">
        <div class="gh-stat"><i class="fas fa-users"></i><span>Followers</span><strong>${displayFollowers.toLocaleString()}</strong></div>
        <div class="gh-stat"><i class="fas fa-user-plus"></i><span>Following</span><strong>${user.following}</strong></div>
        <div class="gh-stat"><i class="fas fa-star"></i><span>Repos</span><strong>${user.public_repos}</strong></div>
      </div>
    </div>
  `;
}

function updateGitHubStats(userData, repos) {
  const totalStars = repos.reduce((t, r) => t + r.stargazers_count, 0);
  const languages = new Set(repos.map(r => r.language).filter(Boolean));

  animateEl('repo-count', userData.public_repos || repos.length);
  animateEl('stars-count', totalStars);
  animateEl('languages-count', languages.size);
}

function animateEl(id, end) {
  const el = document.getElementById(id);
  if (!el) return;
  let cur = 0;
  const inc = Math.ceil(end / 20);
  const t = setInterval(() => {
    cur = Math.min(cur + inc, end);
    el.textContent = cur;
    if (cur >= end) clearInterval(t);
  }, 50);
}

function getLanguageIcon(language) {
  if (!language) return '<i class="fas fa-code"></i>';
  const map = {
    'c#':'devicon-csharp-plain','javascript':'devicon-javascript-plain',
    'html':'devicon-html5-plain','css':'devicon-css3-plain',
    'python':'devicon-python-plain','lua':'devicon-lua-plain',
    'java':'devicon-java-plain','c++':'devicon-cplusplus-plain',
    'typescript':'devicon-typescript-plain','nodejs':'devicon-nodejs-plain',
    'react':'devicon-react-original'
  };
  const ic = map[language.toLowerCase()];
  return ic ? `<i class="${ic}"></i>` : '<i class="fas fa-code"></i>';
}

function loadMoreRepos() {
  const container = document.getElementById('projects-container');
  const btn = document.getElementById('load-more-btn');
  if (!container) return;

  const slice = allRepos.slice(shownCount, shownCount + PAGE_SIZE);
  slice.forEach(repo => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.style.animation = 'fadeIn .35s ease';
    const langIcon = getLanguageIcon(repo.language);
    card.innerHTML = `
      <h3 class="project-title"><i class="fab fa-github"></i> ${repo.name}</h3>
      <p class="project-description">${repo.description || 'No description available.'}</p>
      <div class="project-tech">
        ${repo.language ? `<span class="tech-tag">${langIcon} ${repo.language}</span>` : ''}
        ${repo.stargazers_count > 0 ? `<span class="tech-tag"><i class="fas fa-star"></i> ${repo.stargazers_count}</span>` : ''}
        ${repo.forks_count > 0 ? `<span class="tech-tag"><i class="fas fa-code-fork"></i> ${repo.forks_count}</span>` : ''}
      </div>
      <div class="project-links">
        <a href="${repo.html_url}" target="_blank">View on GitHub <i class="fas fa-arrow-right"></i></a>
        ${repo.homepage ? `<a href="${repo.homepage}" target="_blank"><i class="fas fa-external-link-alt"></i> Demo</a>` : ''}
      </div>
    `;
    container.appendChild(card);
  });

  shownCount += slice.length;

  if (btn) {
    if (shownCount >= allRepos.length) {
      btn.style.display = 'none';
    } else {
      btn.style.display = 'flex';
      btn.textContent = `Load More (${allRepos.length - shownCount} left)`;
    }
  }
}

function displayFallbackRepositories() {
  const c = document.getElementById('projects-container');
  if (c) c.innerHTML = '<p style="text-align:center;color:#888;">GitHub verileri çekilemedi.</p>';
}

// Load more butonu eventi
document.addEventListener('DOMContentLoaded', function() {
  const btn = document.getElementById('load-more-btn');
  if (btn) btn.addEventListener('click', loadMoreRepos);
});
