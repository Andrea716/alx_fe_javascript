// Array of quote objects
let quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
  { text: "Do not wait to strike till the iron is hot; but make it hot by striking.", category: "Motivation" },
  { text: "Great minds discuss ideas; average minds discuss events; small minds discuss people.", category: "Wisdom" }
];

// Function to display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteDisplay.innerHTML = `<p>${randomQuote.text}</p><p><em>${randomQuote.category}</em></p>`;
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    alert("New quote added!");
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    showRandomQuote(); // Update the DOM to display the newly added quote
  } else {
    alert("Please enter both quote text and category.");
  }
}

// Event listener for the "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Event listener for the "Add Quote" button
document.getElementById('addQuoteButton').addEventListener('click', addQuote);

// Display an initial random quote when the page loads
document.addEventListener('DOMContentLoaded', showRandomQuote);
