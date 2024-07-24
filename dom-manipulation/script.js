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
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      alert("New quote added!");
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
      saveQuotes(); // Save the updated quotes array to local storage
      showRandomQuote(); // Update the DOM to display the newly added quote
    } else {
      alert("Please enter both quote text and category.");
    }
  }
  
  // Function to handle importing quotes from a JSON file
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes(); // Save the imported quotes to local storage
      alert('Quotes imported successfully!');
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
  
  // Event listener for the "Show New Quote" button
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  
  // Initialize the add quote form and display an initial random quote when the page loads
  document.addEventListener('DOMContentLoaded', () => {
    loadQuotes(); // Load quotes from local storage
    createAddQuoteForm();
    showRandomQuote();
  });
  
  // Check for the last viewed quote in session storage and display it
  window.addEventListener('load', () => {
    const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
    if (lastViewedQuote) {
      const quoteDisplay = document.getElementById('quoteDisplay');
      const quote = JSON.parse(lastViewedQuote);
      quoteDisplay.innerHTML = `<p>${quote.text}</p><p><em>${quote.category}</em></p>`;
    }
  });
  
