import {books,authors,genres} from './data.js';

let page = 1;

const BOOKS_PER_PAGE = 36;

let preview = "";

 const range = [0 , books.length];


//  Checks if books and range are valid
if (!books || !Array.isArray(books)) throw new Error('Source required');
if (!range || range.length < 2) throw new Error('Range must be an array with two numbers');

const day = {
    dark: '10, 10, 20',
    light: '255, 255, 255',
};

const night = {
    dark: '255, 255, 255',
    light: '10, 10, 20',
};

const fragment = document.createDocumentFragment();
const extracted = books.slice(0, BOOKS_PER_PAGE);


function createPreview(book) {
  const element = document.createElement('div');
  element.classList.add('preview');

  const image = document.createElement('img');
  image.classList.add('preview__image');
  image.src = book.image;

  const info = document.createElement('div');
  info.classList.add('preview__info');

  const title = document.createElement('h3');
  title.classList.add('preview__title');
  title.textContent = book.title;

  const author = document.createElement('div');
  author.classList.add('preview__author');
  author.textContent = book.author;

  info.appendChild(title);
  info.appendChild(author);

  element.appendChild(image);
  element.appendChild(info);

  element.dataset.preview = book.id;

  return element;
}

//  Loop to create and append book previews
for (const book of extracted) {
    const preview = createPreview(book);
    fragment.appendChild(preview);
}


const dataListItems = document.querySelector('[data-list-items]'); 
dataListItems.appendChild(fragment);

const genresEl = document.createDocumentFragment();
let genresOption = document.createElement('option');
genresOption.value = 'any';
genresOption.innerText = 'All Genres';
genresEl.appendChild(genresOption);

// Loop to create and append genre options
for (const [id, name] of Object.entries(genres)) {
    let genreElement = document.createElement('option');
    genreElement.value = id;
    genreElement.innerText = name;
    genresEl.appendChild(genreElement);
}

const dataSearchGenres = document.querySelector('[data-search-genres]'); 
dataSearchGenres.appendChild(genresEl);

const authorsEl = document.createDocumentFragment();
let authorsOption = document.createElement('option');
authorsOption.value = 'any';
authorsOption.innerText = 'All Authors';
authorsEl.appendChild(authorsOption);

// Loop to create and append author options
for (const [id, name] of Object.entries(authors)) {
    let authorElement = document.createElement('option');
    authorElement.value = id;
    authorElement.innerText = name;
    authorsEl.appendChild(authorElement);
}

const dataSearchAuthors = document.querySelector('[data-search-authors]'); 
dataSearchAuthors.appendChild(authorsEl);

//  Sets theme based on user's preference
const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
const theme = prefersDarkMode ? 'night' : 'day';
document.documentElement.style.setProperty('--color-dark', theme === 'night' ? night.dark : day.dark);
document.documentElement.style.setProperty('--color-light', theme === 'night' ? night.light : day.light);

const dataListButton = document.querySelector('data-list-button'); 


// Sets "Show more" button text and disable it if needed
dataListButton.innerHTML =
  '<span>Show more</span>',
  '<span class="list__remaining"> (${matches.length - [page * BOOKS_PER_PAGE] > 0 ? matches.length - [page * BOOKS_PER_PAGE] : 0})</span>',

dataListButton.textContent = `Show more (${books.length - page * BOOKS_PER_PAGE > 0 ? books.length - page * BOOKS_PER_PAGE : 0})`;
dataListButton.disabled = !(books.length - page * BOOKS_PER_PAGE > 0);

dataListButton.addEventListener('click', () => {
    //  Implements "Show more" button functionality
    const remainingBooks = getBooksRemaining(books, page, BOOKS_PER_PAGE);
    const previewsFragment = createPreviewsFragment(remainingBooks);
    dataListItems.appendChild(previewsFragment);
    page += 1;
    // Updates button text and disable state
    dataListButton.innerText = `Show more (${books.length - page * BOOKS_PER_PAGE > 0 ? books.length - page * BOOKS_PER_PAGE : 0})`;
    dataListButton.disabled = !(books.length - page * BOOKS_PER_PAGE > 0);
});

const dataHeaderSearch = document.querySelector('[data-header-search]'); 

//  Implements search functionality
dataHeaderSearch.addEventListener('click', () => {
    const dataSearchOverlay = document.querySelector('[data-search-overlay]'); // search overlay 
    dataSearchOverlay.open = true;
    const dataSearchTitle = document.querySelector('[data-search-title]'); // search title input
    dataSearchTitle.focus();
});

const dataSearchForm = document.querySelector('[data-search-form]'); //  search form

dataSearchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);

    //  Filters and displays books based on search criteria
    const filteredBooks = filterBooks(books, filters);
    displayBooks(filteredBooks);

    // Shows message if theres no results found
    const dataListMessage = document.querySelector('[data-list-message]'); 
    dataListMessage.classList.toggle('list__message_show', filteredBooks.length === 0);
});

const dataSettingsForm = document.querySelector('[data-settings-form]'); //settings form

dataSettingsForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const result = Object.fromEntries(formData);

    //  Updates theme based on settings
    updateTheme(result.theme);
    
    const dataSettingsOverlay = document.querySelector('data-settings-overlay'); //settings overlay
    dataSettingsOverlay.open = false;
});


// Handle click events on book previews
dataListItems.addEventListener('click', (event) => {
    const pathArray = Array.from(event.path || event.composedPath());
    let activeBook = null;

    //  Finds the clicked book
    for (const node of pathArray) {
        const previewId = node?.dataset?.preview;
        if (!previewId) continue;

        activeBook = books.find((book) => book.id === previewId);
        if (activeBook) break;
    }

    // User Story 14: Display book details
    if (activeBook) {
        const dataListActive = document.querySelector('[data-list-active]'); 
        dataListActive.open = true;
        const dataListImage = document.querySelector('[data-list-image]'); 
        dataListImage.src = activeBook.image;
        const dataListTitle = document.querySelector('[data-list-title]'); 
        dataListTitle.textContent = activeBook.title;
        const dataSearchAuthors = document.getElementById('#author'); 
        dataSearchAuthors.textContent = activeBook.author;
        const dataListDescription = document.querySelector('data-list-description'); 
        dataListDescription.textContent = activeBook.description;
    }
});

// Function to get remaining books based on the current page
function getBooksRemaining(books, page, booksPerPage) {
    const startIndex = (page - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    return books.slice(startIndex, endIndex);
}

// Function to create a fragment with book previews
function createPreviewsFragment(books) {
    const fragment = document.createDocumentFragment();
    for (const book of books) {
        const preview = createPreview(book);
        fragment.appendChild(preview);
    }
    return fragment;
}

// Function to filter books based on search criteria
function filterBooks(books, filters) {
    return books.filter((book) => {
        const titleMatch = filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase());
        const authorMatch = filters.author === 'any' || book.author === filters.author;
        const genreMatch = filters.genre === 'any' || book.genres.includes(filters.genre);
        return titleMatch && authorMatch && genreMatch;
    });
}

// Function to display filtered books
function displayBooks(books) {
    const dataListItems = document.querySelector('[data-list-items]'); 
    dataListItems.innerHTML = '';
    const previewsFragment = createPreviewsFragment(books);
    dataListItems.appendChild(previewsFragment);
}

// Function to update the theme
function updateTheme(theme) {
    const day = {
        dark: '10, 10, 20',
        light: '255, 255, 255',
    };

    const night = {
        dark: '255, 255, 255',
        light: '10, 10, 20',
    };

    document.documentElement.style.setProperty('--color-dark', theme === 'night' ? night.dark : day.dark);
    document.documentElement.style.setProperty('--color-light', theme === 'night' ? night.light : day.light);
}
