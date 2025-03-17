// assets/js/dashboard.js

// Replace with your live back‑end URL
const API_BASE_URL = "https://dandd-encounter-generator.onrender.com";


document.getElementById("encounter-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());
  const token = localStorage.getItem("token");
  
  if (!token) {
    alert("Please log in first.");
    return;
  }
  
  try {
    // Call the build-prompt endpoint to generate monster indexes
    const resPrompt = await fetch(`${API_BASE_URL}/encounter/build-prompt`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({
        partyLevel: data.partyLevel,
        environment: data.environment,
        enemyType: data.enemyType
      })
    });
    const promptResult = await resPrompt.json();
    
    if (promptResult.monsters && Array.isArray(promptResult.monsters)) {
      // Retrieve monster details from the server
      const resMonster = await fetch(`${API_BASE_URL}/encounter/monster-data`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ monsters: promptResult.monsters })
      });
      const monsterResult = await resMonster.json();
      displayEncounter(monsterResult.data);
    } else {
      document.getElementById("encounter-results").innerText = "Encounter generation failed.";
    }
  } catch (error) {
    document.getElementById("encounter-results").innerText = "An error occurred.";
  }
});

function displayEncounter(monsters) {
  const container = document.getElementById("encounter-results");
  container.innerHTML = ""; // Clear previous results
  monsters.forEach(monster => {
    const div = document.createElement("div");
    div.classList.add("monster-card");
    div.innerHTML = `
      <h3>${monster.name}</h3>
      <p>HP: ${monster.hit_points}</p>
      <p>AC: ${monster.armor_class}</p>
      <p>CR: ${monster.challenge_rating}</p>
    `;
    container.appendChild(div);
  });
}
