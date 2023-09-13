

const datalistMessage = document.querySelector('[data-list-message]');
const dataListImage = document.querySelector('[data-list-image]');
const dataListTitle = document.querySelector('[data-list-title]');
const dataListDescription= document.querySelector('[data-list-description]');
const dataListSubtitle = document.querySelector('[data-list-subtitle]');
const dataListActive = document.querySelector('[data-list-active]');
const dataLIstClose = document.querySelector('[data-list-close]');
const dataSearchOverlay = document.querySelector('[data-search-overlay]');
const dataSEttingsTheme = document.querySelector('[data-settings-theme]');
const dataSettingsOverlay = document.querySelector('[data-settings-overlay]');
const dataSearchTitle = document.querySelector('[data-search-title]');


/*this part of the code displays the books list 
created a function for the preview
a for loop to loop through the books array
*/
const BOOKS_PER_PAGE = 36;
const startIndex = 0;
const endIndex = startIndex + BOOKS_PER_PAGE;
let extracted = books.slice(0 , 36);
let preveiw = "";
// createPreview funtion
function createPreview( book) {
 const fragment = document.createDocumentFragment()
 
 for (let i = startIndex ; endIndex && i < books.length; i++){
    const {author , image,title,id} = book[i]
        const book = books[i];  

 const html =   `
    <button class='preview' data-preview='${id}'>
      <img class='preview_image' src='${Image}' />
      <div class='preview_info'>
        <h3 class='preview_title'>${title}</h3>
        <div class='preview_author'>${authors[author]}</div>
      </div>
    </button>
  `
}
preveiw = createPreview(book);
fragment.appendChild(preveiw);

}
// Call the function
createPreview(book);

// Handling 'data-header-search' click event
const dataHeaderSearch = document.querySelector('data-header-search'); 
dataHeaderSearch.addEventListener('click', () => {
    dataSearchOverlay.open = true;
    dataSearchTitle.focus();
});



// created the updateRemaining function to get the remaining books to display
function updateRemaining() {
const reminingBooks = books.length- page * BOOKS_PER_PAGE;
const dataButton = document.querySelector('data-list-button')

// this innerHtml creates the Show More button
dataButton.innerHTML = `
<span> Show More</span><span class = 'list_remaining'</span>
`

dataButton.disabled = remainingBooks <= 0;

}
//Event listener for the dataButton
dataButton.addEventListener('click', () => {

    const previewsFragment = createPreviewsFragment(books.slice(startIndex, endIndex), page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE);
    dataListItems.appendChild(previewsFragment);
    actions.list.updateRemaining();
    page += 1;


  if (result.length < 1) {
    data-list-message.classList.add('list__message_show');
} else {
    data-list-message.classList.remove('list__message_show');
}

window.scrollTo({ top: 0, behavior: 'smooth' });
dataSearchOverlay.open = false;
});
  

// Appending the fragment to 'data-list-items'
const dataListItems = document.querySelector('data-list-items'); // 
dataListItems.appendChild(fragment);

// Creating genre options
const genre = document.createDocumentFragment();
let genreOption = document.createElement('option');
genreOption.value = 'any';
genreOption.textContent = 'All Genres';
genres.appendChild(genreOption);

for (const [id, name] of Object.entries(genres)) {
    genreElement = document.createElement('option');
    genreElement.value = id;
    genreElement.textContent = name;
    genres.appendChild(genreElement);
}

// Appending genre options to 'data-search-genres'
const dataSearchGenres = document.querySelector('data-search-genres'); 
dataSearchGenres.appendChild(genres);

// Creating author options
const author = document.createDocumentFragment();
authorsOption = document.createElement('option');
authorsOption.value = 'any';
authorsOption.textContent = 'All Authors';
authors.appendChild(authorsOption);

for (const [id, name] of Object.entries(authors)) {
    authorsElement = document.createElement('option');
    authorsElement.value = id;
    authorsElement.textContent = name;
    authors.appendChild(authorsElement);
}

const dataSearchAuthors = document.querySelector('data-search-authors'); 
dataSearchAuthors.appendChild(authors);

// Handling 'data-search-form' submit event
const dataSearchForm = document.querySelector('data-search-form'); 
dataSearchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);
});
    const result = books.filter((book) => {
        const titleMatch = filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase());
        const authorMatch = filters.author === 'any' || book.author === filters.author;
        const genreMatch = filters.genre === 'any' || book.genres.includes(filters.genre);
        return titleMatch && authorMatch && genreMatch;
      
    });

    
// Handling 'data-list-items' click event
dataListItems.addEventListener('click', (event) => {
    const pathArray = Array.from(event.path || event.composedPath());
    let active = "";


    for (const node of pathArray) {
        if (active){
          break;
        const previewId = node?.dataset?.preview;

        for (const singleBook of books) {
            if (singleBook.id === previewId) active = singleBook;
        }
      }
     
    }
    

    if (!active) {
    return dataListActive.open = true;
    dataListBlur.style.backgroundImage = `url('${active.image}')`;
    dataListTitle.textContent = active.title;
    dataListSubtitle.textContent = `${authors[active.author]} (${new Date(active.published).getFullYear()})`;
    dataListDescription.textContent = active.description;
    }
  });
  


// Checking for the presence of 'books' and 'range'
if (!books || !Array.isArray(books)) throw new Error('Source required');
if (!range || range.length < 2) throw new Error('Range must be an array with two numbers');

// Color themes

 const day = {
    dark: '10, 10, 20',
    light: '255, 255, 255',
};

 const night = {
    dark: '255, 255, 255',
    light: '10, 10, 20',
};


const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const theme = prefersDark ? 'night' : 'day';

document.documentElement.style.setProperty('--color-dark', theme === 'night' ? night.dark : day.dark);
document.documentElement.style.setProperty('--color-light', theme === 'night' ? night.light : day.light);



// Handling 'data-search-cancel' click event
const dataSearchCancel = document.querySelector('data-search-cancel'); 
dataSearchCancel.addEventListener('click', () => {
    dataSearchOverlay.open = false;
});

// Handling 'data-settings-cancel' click event
const dataSettingsCancel = document.querySelector('data-settings-cancel'); 
dataSettingsCancel.addEventListener('click', () => {
    dataSettingsOverlay.open = false;
});

// Handling 'data-settings-form' submit event
const dataSettingsForm = document.getElementById('data-settings-form'); 
dataSettingsForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const result = Object.fromEntries(formData);
    document.documentElement.style.setProperty('--color-dark', result.theme === 'night' ? night.dark : day.dark);
    document.documentElement.style.setProperty('--color-light', result.theme === 'night' ? night.light : day.light);
    dataSettingsOverlay.open = false;
});

// Handling 'data-list-close' click event
const dataListClose = document.querySelector('data-list-close'); 
dataListClose.addEventListener('click', () => {
    dataListActive.open = false;
});


