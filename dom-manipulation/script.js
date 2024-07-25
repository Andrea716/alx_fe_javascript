// Step 1: Setup Server Simulation
const serverUrl = "https://jsonplaceholder.typicode.com/posts";

// Existing quotes array
let quotes = [
  { id: 1, text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
  { id: 2, text: "Do not wait to strike till the iron is hot; but make it hot by striking.", category: "Motivation" },
  { id: 3, text: "Great minds discuss ideas; average minds discuss events; small minds discuss people.", category: "Wisdom" }
];

// Function to load quotes from local storage
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteDisplay.innerHTML = `<p>${randomQuote.text}</p><p><em>${randomQuote.category}</em></p>`;
  // Save the last viewed quote to session storage
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
}

// Function to create the add quote form dynamically
function createAddQuoteForm() {
  const formContainer = document.createElement('div');
  formContainer.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button id="addQuoteButton">Add Quote</button>
  `;
  document.body.appendChild(formContainer);

  // Event listener for the "Add Quote" button
  document.getElementById('addQuoteButton').addEventListener('click', addQuote);
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    const newQuote = { id: Date.now(), text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    alert("New quote added!");
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    saveQuotes(); // Save the updated quotes array to local storage
    populateCategories(); // Update the category filter
    filterQuotes(); // Update the DOM to display the newly added quote

    // Post the new quote to the server
    postQuoteToServer(newQuote);
  } else {
    alert("Please enter both quote text and category.");
  }
}

// Function to populate the category filter dynamically
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  const categories = Array.from(new Set(quotes.map(quote => quote.category)));

  // Clear existing options
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  // Populate new options
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Load the last selected filter from local storage
  const lastSelectedCategory = localStorage.getItem('selectedCategory');
  if (lastSelectedCategory) {
    categoryFilter.value = lastSelectedCategory;
    filterQuotes();
  }
}

// Function to filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  const quoteDisplay = document.getElementById('quoteDisplay');
  let filteredQuotes;

  if (selectedCategory === 'all') {
    filteredQuotes = quotes;
  } else {
    filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
  }

  // Display filtered quotes
  quoteDisplay.innerHTML = filteredQuotes.map(quote => `<p>${quote.text}</p><p><em>${quote.category}</em></p>`).join('');

  // Save the selected category to local storage
  localStorage.setItem('selectedCategory', selectedCategory);
}

// Function to handle importing quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes(); // Save the imported quotes to local storage
    populateCategories(); // Update the category filter
    alert('Quotes imported successfully!');
    filterQuotes();
  };
  fileReader.readAsText(event.target.files[0]);
}

// Function to handle exporting quotes to a JSON file
function exportToJsonFile() {
  const jsonQuotes = JSON.stringify(quotes);
  const blob = new Blob([jsonQuotes], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
}

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

// Initial setup
window.onload = function() {
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
