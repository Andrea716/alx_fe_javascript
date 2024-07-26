// Initialize the quotes array and set the server URL
let quotes = JSON.parse(localStorage.getItem('quotes')) || [];
const serverURL = 'https://jsonplaceholder.typicode.com/posts'; // Example mock API

// Load quotes and categories on page load, and set up periodic syncing
document.addEventListener('DOMContentLoaded', () => {
    displayQuotes();
    populateCategories();
    const savedCategory = localStorage.getItem('selectedCategory');
    if (savedCategory) {
        document.getElementById('categoryFilter').value = savedCategory;
        filterQuotes();
    }
    setInterval(syncQuotes, 30000); // Sync with server every 30 seconds
});

// Function to add a new quote
function addQuote() {
    const newQuote = prompt("Enter a new quote:");
    const newCategory = prompt("Enter the category for this quote:");
    if (newQuote && newCategory) {
        quotes.push({ quote: newQuote, category: newCategory });
        localStorage.setItem('quotes', JSON.stringify(quotes));
        displayQuotes();
        populateCategories();
    }
}

// Function to display quotes
function displayQuotes(filteredQuotes = quotes) {
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = '';
    filteredQuotes.forEach(q => {
        const quoteElem = document.createElement('p');
        quoteElem.textContent = `${q.quote} - ${q.category}`;
        quoteDisplay.appendChild(quoteElem);
    });
}

// Function to populate categories in the dropdown
function populateCategories() {
    const categories = [...new Set(quotes.map(q => q.category))];
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Function to filter quotes based on selected category
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    localStorage.setItem('selectedCategory', selectedCategory);
    if (selectedCategory === 'all') {
        displayQuotes();
    } else {
        const filteredQuotes = quotes.filter(q => q.category === selectedCategory);
        displayQuotes(filteredQuotes);
    }
}

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(serverURL);
        const serverQuotes = await response.json();
        return serverQuotes.map(q => ({ quote: q.title, category: 'Server' })); // Adjust according to your server's response structure
    } catch (error) {
        console.error("Error fetching quotes from server:", error);
        return [];
    }
}

// Function to sync quotes with the server
async function syncQuotes() {
    const serverQuotes = await fetchQuotesFromServer();
    const combinedQuotes = [...quotes, ...serverQuotes];
    const uniqueQuotes = Array.from(new Set(combinedQuotes.map(q => q.quote))).map(quote => {
        return combinedQuotes.find(q => q.quote === quote);
    });
    quotes = uniqueQuotes;
    localStorage.setItem('quotes', JSON.stringify(quotes));
    displayQuotes();
    populateCategories();
    alert("Quotes synced with server!");
}

// Function to export quotes as JSON
function exportQuotes() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(quotes));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "quotes.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const importedQuotes = JSON.parse(e.target.result);
        quotes = [...quotes, ...importedQuotes];
        localStorage.setItem('quotes', JSON.stringify(quotes));
        displayQuotes();
        populateCategories();
    };
    reader.readAsText(file);
}
