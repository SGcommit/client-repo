// api.js: Updated client-side logic for encounter generation

// Ensure only logged-in users can access the page
document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "index.html";
    }
    
    // Logout functionality
    document.getElementById("logoutBtn").addEventListener("click", function () {
        localStorage.removeItem("token");
        window.location.href = "index.html";
    });
});

// Define the server path (update if needed)
const SERVER_PATH = 'https://dandd-encounter-generator.onrender.com';

// Get references to DOM elements
const generateBtn = document.getElementById("generate-btn");
const resultTxt = document.getElementById("result-txt");

// Add click listener for generating the encounter
generateBtn.onclick = function () {
    generateEncounter();
};

async function generateEncounter() {
    const token = localStorage.getItem("token");
    
    // Retrieve party details from the inputs
    const partyLevel = document.getElementById("party-level").value;
    const environment = document.getElementById("environment").value;
    const enemyType = document.getElementById("enemy-type").value;
    
    if (!partyLevel || !environment || !enemyType) {
        resultTxt.innerHTML = "Please fill in all fields.";
        return;
    }
    
    // Prepare the payload for the build-prompt endpoint
    const promptPayload = { partyLevel, environment, enemyType };
    
    try {
        // First, call the build-prompt endpoint to get monster indexes
        const promptResponse = await fetch(`${SERVER_PATH}/encounter/build-prompt`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(promptPayload)
        });
        const promptData = await promptResponse.json();
        
        if (!promptResponse.ok) {
            resultTxt.innerHTML = promptData.message || "Error generating encounter prompt.";
            return;
        }
        
        const monsters = promptData.monsters;
        
        // Now, call the monster-data endpoint to fetch full monster details
        const monsterDataResponse = await fetch(`${SERVER_PATH}/encounter/monster-data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ monsters })
        });
        const monsterDataJson = await monsterDataResponse.json();
        
        if (!monsterDataResponse.ok) {
            resultTxt.innerHTML = monsterDataJson.message || "Error fetching monster data.";
            return;
        }
        
        const monsterDataArray = monsterDataJson.data;
        const enemyDiv = document.getElementById("enemy-div");
        enemyDiv.innerHTML = ""; // Clear any previous results
        
        // For each monster, create a card with image, name, CR, HP, and AC
        monsterDataArray.forEach(dataJSON => {
            let node = document.createElement("div");
            let image = document.createElement("img");
            let name = document.createElement("p");
            let cr = document.createElement("p");
            let hp = document.createElement("p");
            let ac = document.createElement("p");
            let stats = document.createElement("div");
            
            // Set the card content based on returned data
            image.src = "https://www.dnd5eapi.co" + dataJSON["image"];
            name.innerHTML = dataJSON["name"];
            cr.innerHTML = "CR: " + dataJSON["challenge_rating"];
            hp.innerHTML = "HP: " + dataJSON["hit_points"];
            ac.innerHTML = "AC: " + getAC(dataJSON["armor_class"]);
            
            node.appendChild(image);
            node.appendChild(name);
            stats.appendChild(cr);
            stats.appendChild(hp);
            stats.appendChild(ac);
            node.appendChild(stats);
            
            name.classList.add("enemy-title");
            node.classList.add("enemy-card");
            enemyDiv.appendChild(node);
        });
        
        resultTxt.innerHTML = "Encounter Generated Successfully!";
        
    } catch (error) {
        console.error("Error generating encounter:", error);
        resultTxt.innerHTML = "Error generating encounter.";
    }
}

// Helper function to compute the total AC from an array of armor class values
function getAC(armorClassArray) {
    let totalAC = 0;
    armorClassArray.forEach(obj => {
        totalAC += obj["value"];
    });
    return totalAC;
}
