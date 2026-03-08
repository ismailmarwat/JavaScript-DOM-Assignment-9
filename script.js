const userList = document.getElementById('userList');
const loading = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const searchInput = document.getElementById('searchInput');
const reloadBtn = document.getElementById('reloadBtn');
const userDetail = document.getElementById('userDetail');

let allUsers = [];

// ────────────────────────────────────────────────
function showLoading() {
  loading.classList.remove('hidden');
  errorDiv.classList.add('hidden');
  userList.innerHTML = '';
  userDetail.classList.add('hidden');
}

function hideLoading() {
  loading.classList.add('hidden');
}

function showError() {
  errorDiv.classList.remove('hidden');
  hideLoading();
}

function clearError() {
  errorDiv.classList.add('hidden');
}

// ────────────────────────────────────────────────
function renderUsers(users) {
  userList.innerHTML = '';

  if (users.length === 0) {
    userList.innerHTML = '<p class="message">No users found</p>';
    return;
  }

  users.forEach(user => {
    const li = document.createElement('li');
    li.className = 'user-card';
    li.innerHTML = `<h3>${user.name}</h3>`;
    
    li.addEventListener('click', () => {
      showUserDetail(user);
    });
    
    userList.appendChild(li);
  });
}

function showUserDetail(user) {
  document.getElementById('detailName').textContent = user.name;
  document.getElementById('detailEmail').textContent = user.email;
  document.getElementById('detailPhone').textContent = user.phone;
  
  const websiteLink = document.getElementById('detailWebsite');
  websiteLink.textContent = user.website;
  websiteLink.href = user.website.startsWith('http') 
    ? user.website 
    : `https://${user.website}`;

  userDetail.classList.remove('hidden');
  // Optional: scroll to detail
  userDetail.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ────────────────────────────────────────────────
function fetchUsers() {
  showLoading();
  clearError();

  fetch('https://jsonplaceholder.typicode.com/users')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      allUsers = data;
      renderUsers(allUsers);
      hideLoading();
    })
    .catch(error => {
      console.error('Fetch error:', error);
      showError();
    });
}

// ────────────────────────────────────────────────
// Initial load
fetchUsers();

// Search filter
searchInput.addEventListener('input', (e) => {
  const term = e.target.value.toLowerCase().trim();
  
  const filtered = allUsers.filter(user =>
    user.name.toLowerCase().includes(term)
  );
  
  renderUsers(filtered);
});

// Reload button
reloadBtn.addEventListener('click', () => {
  searchInput.value = '';           // optional: clear search
  fetchUsers();
});
