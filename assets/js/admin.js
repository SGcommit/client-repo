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
        <td><button onclick="deleteUser('${user.id}', this)">Delete</button></td>
      `;
      userTable.appendChild(row);
    });    

  } catch (err) {
    console.error('Admin dashboard error:', err);
    document.getElementById('message').innerText = 'Failed to load admin stats.';
  }
}

async function deleteUser(userId, button) {
  if (!confirm("Are you sure you want to delete this user?")) return;

  try {
    const response = await fetch(`${SERVER_PATH}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    if (response.ok) {
      alert("User deleted successfully.");
      // Remove row from table
      const row = button.closest('tr');
      row.remove();
    } else {
      alert("Error: " + data.message);
    }
  } catch (err) {
    console.error("Failed to delete user:", err);
    alert("Failed to delete user.");
  }
}

fetchAdminData();


