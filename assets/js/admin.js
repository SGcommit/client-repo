const SERVER_PATH = 'https://dandd-encounter-generator.onrender.com';
const token = localStorage.getItem('token');

if (!token) {
  window.location.href = 'index.html';
}

document.getElementById('logout').addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
});

document.getElementById('generate-encounter').addEventListener('click', () => {
  window.location.href = 'dashboard.html';
});

async function fetchAdminData() {
  try {
    // 1. Fetch Endpoint Stats
    const statsRes = await fetch(`${SERVER_PATH}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!statsRes.ok) throw new Error("Failed to fetch API stats");
    const { endpoints } = await statsRes.json();

    const endpointStatsTable = document.getElementById('endpoint-stats');
    endpoints.forEach(entry => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${entry.method}</td>
        <td>${entry.endpoint}</td>
        <td>${entry.count}</td>
      `;
      endpointStatsTable.appendChild(row);
    });

    // 2. Fetch User Stats
    const usersRes = await fetch(`${SERVER_PATH}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!usersRes.ok) throw new Error("Failed to fetch user stats");
    const users = await usersRes.json();

    const userTable = document.getElementById('user-usage');
    users.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.first_name}</td>
        <td>${user.email}</td>
        <td>${user.api_calls_remaining ?? 'N/A'}</td>
        <td>${user.request_count ?? 0}</td>
      `;
      userTable.appendChild(row);
    });

  } catch (err) {
    console.error('Admin dashboard error:', err);
    document.getElementById('message').innerText = 'Failed to load admin stats.';
  }
}

fetchAdminData();
