// Constants for APIs
const TMDB_API_KEY = "YOUR_API_KEY"; // Replace with your TMDB API key
const TMDB_API_URL = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=`;
const TELEPORT_API_URL = "https://api.teleport.org/api/cities/?search=";

// DOM Elements
const searchBar = document.getElementById("search-bar");
const resultsDiv = document.getElementById("results");
const clickButton = document.getElementById("click-button");
const counterDiv = document.getElementById("counter");

// Utility: Debounce Function
function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}

// Utility: Throttle Function
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Search Bar: Fetch and Display Results
async function fetchResults(query) {
  if (!query.trim()) {
    resultsDiv.textContent = "Please enter a search term.";
    return;
  }
  resultsDiv.textContent = "Searching...";
  try {
    // Example: Fetch from TMDB
    const response = await fetch(`${TMDB_API_URL}${encodeURIComponent(query)}`);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      resultsDiv.innerHTML = data.results
        .map((movie) => `<div>${movie.title}</div>`)
        .join("");
    } else {
      resultsDiv.textContent = "No results found.";
    }
  } catch (error) {
    resultsDiv.textContent = "Error fetching results. Try again later.";
    console.error(error);
  }
}

// Apply Debounce to Search Bar
const debouncedFetchResults = debounce(fetchResults, 300);
searchBar.addEventListener("input", (e) => debouncedFetchResults(e.target.value));

// Button Click Counter
let clickCount = 0;
function incrementCounter() {
  clickCount++;
  counterDiv.textContent = `Click count: ${clickCount}`;
}

// Apply Throttle to Button Click
const throttledIncrementCounter = throttle(incrementCounter, 2000);
clickButton.addEventListener("click", throttledIncrementCounter);
