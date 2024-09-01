let allBooks = []; 
let displayedBooks = []; 
let currentPage = 1;
const booksPerPage = 5;
const bookList = document.getElementById('book-list');
const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sort');
const pagination = document.getElementById('pagination');

//Fetch Books
async function fetchBooks() {
    bookList.innerHTML = '<p>Loading books...</p>'; // Loading State
    try {
        const response = await fetch('https://openlibrary.org/subjects/science_fiction.json?limit=100');
        if (!response.ok) {
            throw new Error('Network response was not ok');  // If Load will not be successfull error should be shown
        }
        const data = await response.json(); // Waits till Server give a response
        allBooks = data.works.map(work => ({
            title: work.title,
            author: work.authors[0]?.name || 'Unknown Author', // Chaining operator is used 
            year: work.first_publish_year || 'Unknown Year',
            coverId: work.cover_id
        }));
        displayedBooks = [...allBooks]; // Use of spread operator 
        displayBooks();
        setupPagination();
    } catch (error) {
        console.error('Error fetching books:', error);
        bookList.innerHTML = '<p>Error loading books. Please try again later.</p>'; // if there is any error in doing all this it should give error
    }
}



function displayBooks() {
    const startIndex = (currentPage - 1) * booksPerPage; // Process of displaying books on each page
    const endIndex = startIndex + booksPerPage;
    const booksToDisplay = displayedBooks.slice(startIndex, endIndex);

    bookList.innerHTML = ''; // To remove all the existing books from previous page
    booksToDisplay.forEach(book => {
        const bookElement = document.createElement('div'); // Container to display each book
        bookElement.classList.add('book');
        bookElement.innerHTML = `
            <img src="https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg" alt="${book.title} cover" onerror="this.src='placeholder.jpg';">
            <h3>${book.title}</h3>
            <p>Author: ${book.author}</p>
            <p>Year: ${book.year}</p>
        `;
        bookList.appendChild(bookElement);
    });
}

function setupPagination() {
    const pageCount = Math.ceil(displayedBooks.length / booksPerPage);
    pagination.innerHTML = '';
    for (let i = 1; i <= pageCount; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.classList.add('page-btn');
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            displayBooks();
        });
        pagination.appendChild(pageBtn);
    }
}


function searchBooks() {
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm === '') {
        displayedBooks = [...allBooks]; 
    } else {
        displayedBooks = allBooks.filter(book => 
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm)
        );
    }
    currentPage = 1;
    displayBooks();
    setupPagination();
}


function sortBooks() {
    const sortBy = sortSelect.value;
    displayedBooks.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return -1;
        if (a[sortBy] > b[sortBy]) return 1;
        return 0;
    });
    currentPage = 1;
    displayBooks();
}


async function init() {
    await fetchBooks();
    searchInput.addEventListener('input', searchBooks);
    sortSelect.addEventListener('change', sortBooks);
}

window.addEventListener('load', init);
