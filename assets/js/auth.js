// assets/js/auth.js

// Replace with your live back‑end URL
const API_BASE_URL = "https://dandd-encounter-generator.onrender.com";

// Handle Registration
document.getElementById("register-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    document.getElementById("message").innerText = result.message || "Registration successful! Please log in.";
  } catch (error) {
    document.getElementById("message").innerText = "Registration failed.";
  }
});

// Handle Login
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (result.token) {
      localStorage.setItem("token", result.token);
      // Redirect to dashboard on successful login
      window.location.href = "dashboard.html";
    } else {
      document.getElementById("message").innerText = result.message || "Login failed.";
    }
  } catch (error) {
    document.getElementById("message").innerText = "Login failed.";
  }
});
