import './styles.css';
import $ from 'jquery';

// Cache for constants to avoid multiple fetches
let constantsCache = null;

// Function to fetch and process data from 'data.json'
async function fetchData() {
  try {
      const response = await fetch('data.json');
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error fetching data:', error);
  }
}

// Function to fetch and process constants from 'constants.json' with caching
async function fetchConstants() {
  // Return cached data if available to avoid multiple API calls
  if (constantsCache) {
    return constantsCache;
  }
  
  try {
      const response = await fetch('constants.json');
      const data = await response.json();
      // Cache the data for future use
      constantsCache = data;
      return data;
  } catch (error) {
      console.error('Error fetching data:', error);
  }
}

// Make initialize function globally accessible
window.initialize = function() {
  populatePottype();
  populatePlantType();
  populateSeason();
  
  // Set up video toggle functionality
  setupVideoToggle();
}

// Add video toggle functionality
function setupVideoToggle() {
  const showVideoBtn = document.getElementById('showVideoBtn');
  const toggleVideoBtn = document.getElementById('toggleVideo');
  const videoPlayer = document.getElementById('videoplayer');
  const video = document.querySelector('#videoplayer video');
  
  // Show video button
  if (showVideoBtn) {
    showVideoBtn.addEventListener('click', function() {
      videoPlayer.style.display = 'block';
      showVideoBtn.parentElement.style.display = 'none';
      // Load video when shown to save bandwidth
      if (video) video.load();
    });
  }
  
  // Toggle/hide video button 
  if (toggleVideoBtn) {
    toggleVideoBtn.addEventListener('click', function() {
      // Simply hide the video and show the button
      videoPlayer.style.display = 'none';
      showVideoBtn.parentElement.style.display = 'block';
      
      // Pause the video when hidden to save resources
      if (video) video.pause();
    });
  }
}

//Function to fetch constants and populate pot type dropdown menu
async function populatePottype() {
  const data = await fetchConstants();
  if (!data) return;

  const dropdown = document.getElementById("potType");
  // Use filter instead of for loop for better performance and readability
  const potOptions = data.filter(item => item.datatype === "pot");
  
  // Use forEach instead of traditional for loop
  potOptions.forEach(pot => {
    const option = document.createElement("option");
    option.text = pot.name;
    option.value = pot.name;
    dropdown.add(option);
  });
}

//Function to fetch constants and populate plant type dropdown menu
async function populatePlantType() {
  const data = await fetchConstants();
  if (!data) return;

  const dropdown = document.getElementById("plantType");
  // Use filter for cleaner code and better performance
  const speciesOptions = data.filter(item => item.datatype === "species");
  
  speciesOptions.forEach(species => {
    const option = document.createElement("option");
    option.text = species.name;
    option.value = species.name;
    dropdown.add(option);
  });
}

//Function to fetch constants and populate season dropdown menu
async function populateSeason() {
  const data = await fetchConstants();
  if (!data) return;

  const dropdown = document.getElementById("season");
  // Use filter for consistent code style and performance
  const seasonOptions = data.filter(item => item.datatype === "season");
  
  seasonOptions.forEach(season => {
    const option = document.createElement("option");
    option.text = season.name;
    option.value = season.name;
    dropdown.add(option);
  });
}

function calculatePotVolume(diameter, height) {
  const radius = diameter / 2;
  return Math.PI * Math.pow(radius, 2) * height;
}

//Function to calculate water and fertilizer recommendations
async function calculateRecommendations(potVolume, potType, plantType, season) {
  const data = await fetchConstants();
  if (!data) return;

  let potdata = data.find(item => item.datatype === "pot" && item.name === potType);
  let speciesdata = data.find(item => item.datatype === "species" && item.name === plantType);
  let seasondata = data.find(item => item.datatype === "season" && item.name === season);

  if (!potdata || !speciesdata || !seasondata) return;
 
  let water = potVolume * 0.0001 * potdata.datafield_1 * seasondata.datafield_1;
  let fertilizer = water * seasondata.datafield_2;

  document.getElementById('recommendedWater').textContent = `${water.toFixed(1)} liters`;
  document.getElementById('recommendedFertilizer').textContent = `${fertilizer.toFixed(2)} units`;
}

// Function to search recommendations data and calculate statistics based on it and user inputs
async function findRecommendations(potVolume, potType, plantType, season) {
  const data = await fetchData();
  if (!data) return;

  // Count similar plant setups
  let similarCount = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i].pot_type === potType && 
        data[i].plant_type === plantType && 
        data[i].time_of_year === season && 
        data[i].pot_volume > (potVolume * 0.9) && 
        data[i].pot_volume > (potVolume * 1.1)) {
      similarCount++;
    }
  } 
  document.getElementById('similar').textContent = similarCount;

  // Calculate statistics for similar water recommendations
  let similarwaterCount = 0;
  let similarwaterGrowthSum = 0;
  let similarwaterYieldSum = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i].pot_type === potType && 
        data[i].plant_type === plantType && 
        data[i].time_of_year === season && 
        data[i].pot_volume > (potVolume * 0.9) && 
        data[i].pot_volume > (potVolume * 1.1) &&
        data[i].actual_water > (data[i].recommented_water * 0.9) && 
        data[i].actual_water > (data[i].recommented_water * 1.1)) {
      similarwaterCount++;
      similarwaterGrowthSum += data[i].growth_rate;
      similarwaterYieldSum += data[i].crop_yield;
    }
  } 
  document.getElementById('similarwaterCount').textContent = similarwaterCount;
  document.getElementById('similarwaterGrowthAverage').textContent = similarwaterCount ? (similarwaterGrowthSum / similarwaterCount).toFixed(1) : "-";
  document.getElementById('similarwaterYieldAverage').textContent = similarwaterCount ? (similarwaterYieldSum / similarwaterCount).toFixed(1) : "-";

  // Calculate statistics for less water recommendations
  let lesswaterCount = 0;
  let lesswaterGrowthSum = 0;
  let lesswaterYieldSum = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i].pot_type === potType && 
        data[i].plant_type === plantType && 
        data[i].time_of_year === season && 
        data[i].pot_volume > (potVolume * 0.9) && 
        data[i].pot_volume > (potVolume * 1.1) &&
        data[i].actual_water <= (data[i].recommented_water * 0.9)) {
      lesswaterCount++;
      lesswaterGrowthSum += data[i].growth_rate;
      lesswaterYieldSum += data[i].crop_yield;
    }
  } 
  document.getElementById('lesswaterCount').textContent = lesswaterCount;
  document.getElementById('lesswaterGrowthAverage').textContent = lesswaterCount ? (lesswaterGrowthSum / lesswaterCount).toFixed(1) : "-";
  document.getElementById('lesswaterYieldAverage').textContent = lesswaterCount ? (lesswaterYieldSum / lesswaterCount).toFixed(1) : "-";

  // Calculate statistics for more water recommendations
  let morewaterCount = 0;
  let morewaterGrowthSum = 0;
  let morewaterYieldSum = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i].pot_type === potType && 
        data[i].plant_type === plantType && 
        data[i].time_of_year === season && 
        data[i].pot_volume > (potVolume * 0.9) && 
        data[i].pot_volume > (potVolume * 1.1) &&
        data[i].actual_water >= (data[i].recommented_water * 1.1)) {
      morewaterCount++;
      morewaterGrowthSum += data[i].growth_rate;
      morewaterYieldSum += data[i].crop_yield;
    }
  } 
  document.getElementById('morewaterCount').textContent = morewaterCount;
  document.getElementById('morewaterGrowthAverage').textContent = morewaterCount ? (morewaterGrowthSum / morewaterCount).toFixed(1) : "-";
  document.getElementById('morewaterYieldAverage').textContent = morewaterCount ? (morewaterYieldSum / morewaterCount).toFixed(1) : "-";

  // Display the output section
  let outputSection = document.getElementById("outputSection");
  outputSection.style.display = "block";
}

// Make sure this runs when the page loads
document.addEventListener('DOMContentLoaded', function() {
  // Initialize dropdowns and setup
  initialize();
  
  // Set up the calculate button event listener
  document.getElementById('calculateButton').addEventListener('click', function() {
    const potType = document.getElementById('potType').value;
    const potDiameter = parseFloat(document.getElementById('potDiameter').value);
    const potHeight = parseFloat(document.getElementById('potHeight').value);
    const plantType = document.getElementById('plantType').value;
    const season = document.getElementById('season').value;

    // Calculate pot volume
    const potVolume = calculatePotVolume(potDiameter, potHeight);
    
    // Display pot size in liters
    document.getElementById('potSize').textContent = (potVolume/1000).toFixed(1);

    calculateRecommendations(potVolume, potType, plantType, season);
    findRecommendations(potVolume, potType, plantType, season);
  });
});
