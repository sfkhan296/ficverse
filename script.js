// Authentication logic
document.addEventListener("DOMContentLoaded", function() {
    // Only check login status on protected pages (not on login or signup pages)
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    if (currentPage === "home.html") {
      if (!localStorage.getItem("loggedInUser")) {
        window.location.href = "index.html"; // Redirect if not logged in
      }
    }
    
    // Initialize search functionality
    initializeSearch();
  });
  
  function logout() {
    localStorage.removeItem("loggedInUser"); // Remove stored session
    window.location.href = "index.html"; // Redirect to index.html
  }
  
  // Search functionality
  function initializeSearch() {
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");
    
    // Check if search elements exist on the page
    if (!searchInput || !searchResults) return;
  
    // Get current page name (without full path)
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
  
    // Predefined books (for those NOT in index.html)
    const predefinedBooks = [
      { title: "The Great Gatsby", link: "gatsby.html", type: "Book" },
      { title: "Pride and Prejudice", link: "pride.html", type: "Book" },
      { title: "The Palace of Illusion", link: "palace.html", type: "Book" }
    ];
  
    // Predefined audiobooks (for those NOT in index.html)
    const predefinedAudiobooks = [
      { title: "Jack and the Beanstalk", link: "jack.mp3", type: "Audiobook" },
      { title: "Beauty and the Beast", link: "beauty.mp3", type: "Audiobook" }
    ];
  
    // Get books & audiobooks from the HTML (for those ALREADY in index.html)
    const books = Array.from(document.querySelectorAll(".book")).map(book => ({
      title: book.getAttribute("data-title"),
      link: book.querySelector("a:nth-of-type(2)") ? book.querySelector("a:nth-of-type(2)").getAttribute("href") : "#",
      type: "Book"
    }));
  
    const audiobooks = Array.from(document.querySelectorAll(".audiobook")).map(audiobook => {
      const source = audiobook.querySelector("audio source");
      return {
        title: audiobook.getAttribute("data-title"),
        link: source ? source.getAttribute("src") : "#", // Get audio file link
        type: "Audiobook"
      };
    });
  
    // Merge predefined lists with dynamically fetched lists
    const allBooks = [...predefinedBooks, ...books];
    const allAudiobooks = [...predefinedAudiobooks, ...audiobooks];
  
    // Determine search scope based on the page
    let searchData = [];
    if (currentPage === "index.html" || currentPage === "home.html") {
      searchData = [...allBooks, ...allAudiobooks]; // Search both books & audiobooks
    } else if (currentPage === "book.html") {
      searchData = allBooks; // Search only books
    } else if (currentPage === "audiobook.html") {
      searchData = allAudiobooks; // Search only audiobooks
    }
  
    // Search functionality
    searchInput.addEventListener("keyup", function() {
      const query = searchInput.value.toLowerCase();
      searchResults.innerHTML = "";
  
      if (query.length === 0) {
        searchResults.style.display = "none";
        return;
      }
  
      const filteredResults = searchData.filter(item => item.title.toLowerCase().includes(query));
  
      if (filteredResults.length > 0) {
        searchResults.style.display = "block";
        filteredResults.forEach(result => {
          const item = document.createElement("a");
          item.href = result.link;
          item.classList.add("search--item");
          item.textContent = `${result.title} (${result.type})`;
          searchResults.appendChild(item);
        });
      } else {
        searchResults.style.display = "none";
      }
    });
  
    // Hide search results when clicking outside
    document.addEventListener("click", function(e) {
      if (!searchResults.contains(e.target) && e.target !== searchInput) {
        searchResults.style.display = "none";
      }
    });
  }