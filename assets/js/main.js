// main.js: Contains client-side logic for handling form submissions, UI updates, and interactions.
// Handle Registration
const SERVER_PATH = 'https://dandd-encounter-generator.onrender.com';
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    // Gather registration inputs based on what the back-end expects
    const email = document.getElementById('reg-email').value;
    const firstName = document.getElementById('reg-firstName').value;
    const password = document.getElementById('reg-password').value;
    
    try {
      const response = await fetch(`${SERVER_PATH}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName, password })
      });
      const data = await response.json();
  
      // Display feedback from the server
      document.getElementById('message').innerText = data.message || data.error;
    } catch (err) {
      console.error('Registration error:', err);
      document.getElementById('message').innerText = 'Registration request failed.';
    }
});
  
// Handle Login
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Gather login inputs
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${SERVER_PATH}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        // Display feedback from the server
        document.getElementById('message').innerText = data.message || data.error;

        if (response.ok && data.token) {
          localStorage.setItem('token', data.token);
      
          if (data.isAdmin) { // Check if the user is an admin
              window.location.href = 'admin.html'; //Redirect admin to admin page
          } else {
              window.location.href = 'dashboard.html'; //Regular user
          }
      }      
    } catch (err) {
        console.error('Login error:', err);
        document.getElementById('message').innerText = 'Login request failed.';
    }
});
