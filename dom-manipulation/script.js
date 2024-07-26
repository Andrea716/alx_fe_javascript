// Setup Server Simulation
const serverUrl = "https://jsonplaceholder.typicode.com/posts";

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(serverUrl);
    const serverQuotes = await response.json();
    return serverQuotes;
  } catch (error) {
    console.error("Error fetching quotes from server:", error);
    return [];
  }
}

// Function to post a quote to the server
async function postQuoteToServer(quote) {
  try {
    const response = await fetch(serverUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(quote)
    });
    const result = await response.json();
    console.log("Quote posted to server:", result);
  } catch (error) {
    console.error("Error posting quote to server:", error);
  }
}

// Initial data fetch from server (simulated)
async function initialFetch() {
  const serverQuotes = await fetchQuotesFromServer();
  if (serverQuotes.length) {
    quotes = serverQuotes;
    saveQuotes();
  }
}

// Initial setup
window.onload = function() {
  initialFetch(); // Fetch initial data from server
  loadQuotes(); // Load quotes from local storage
  populateCategories(); // Populate categories in the filter dropdown
  showRandomQuote(); // Show a random quote

  // Event listener for the "Sync Data" button
  document.getElementById('syncData').addEventListener('click', syncData);

  // Event listener for the category filter dropdown
  document.getElementById('categoryFilter').addEventListener('change', filterQuotes);

  // Event listeners for importing and exporting JSON files
  document.getElementById('importJson').addEventListener('change', importFromJsonFile);
  document.getElementById('exportJson').addEventListener('click', exportToJsonFile);
};

// Function to sync data with the server
async function syncData() {
  const serverQuotes = await fetchQuotesFromServer();

  // Merge server quotes with local quotes
  const mergedQuotes = mergeQuotes(quotes, serverQuotes);

  // Save merged quotes to local storage
  quotes = mergedQuotes;
  saveQuotes();

  // Notify the user of updates
  notifyUser("Data synced with server. Conflicts resolved where necessary.");
}

// Function to merge local and server quotes, resolving conflicts
function mergeQuotes(localQuotes, serverQuotes) {
  const mergedQuotes = [...localQuotes];

  serverQuotes.forEach(serverQuote => {
    const existingQuoteIndex = mergedQuotes.findIndex(localQuote => localQuote.id === serverQuote.id);
    if (existingQuoteIndex > -1) {
      mergedQuotes[existingQuoteIndex] = serverQuote;
    } else {
      mergedQuotes.push(serverQuote);
    }
  });

  return mergedQuotes;
}

// Function to notify users of updates
function notifyUser(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Periodic data fetching to simulate receiving updates from a server
setInterval(syncData, 60000); // Sync data every 60 seconds
