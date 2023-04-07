const API_URL = 'https://www.themealdb.com/api/json/v1/1';

// Get favourites from local storage or set to empty array if none found
let favourites = JSON.parse(localStorage.getItem('favourites')) || [];

// DOM elements
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const addToFavourites = document.getElementById('addToFavourites');
const mealName = document.getElementById('mealName');
const mealImage = document.getElementById('mealImage');
const mealCategory = document.getElementById('mealCategory');
const mealInstructions = document.getElementById('mealInstructions');
const mealIngredients = document.getElementById('mealIngredients');
const favouritesList = document.getElementById('favouritesList');

// Function to display search results
function displaySearchResults(meals) {
  let output = '';
  meals.forEach(meal => {
    output += `
      <div class="col-md-4">
        <div class="card mb-3">
          <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}" width="100%" height="225">
          <div class="card-body">
            <h5 class="card-title">${meal.strMeal}</h5>
            <a href="meal.html?id=${meal.idMeal}" class="btn btn-primary stretched-link">View Details</a>
            <button class="btn btn-outline-secondary addToFavourites" data-mealid="${meal.idMeal}">Add to Favourites</button>
          </div>
        </div>
      </div>
    `;
  });
  searchResults.innerHTML = output;
}

// Function to display meal information
function displayMeal(meal) {
  const mealName = document.getElementById('mealName');
  const mealImage = document.getElementById('mealImage');
  const mealCategory = document.getElementById('mealCategory');
  const mealInstructions = document.getElementById('mealInstructions');
  const mealIngredients = document.getElementById('mealIngredients');

  mealName.innerText = meal.strMeal;
  mealImage.setAttribute('src', meal.strMealThumb);
  mealCategory.innerText = `Category: ${meal.strCategory}`;
  mealInstructions.innerText = meal.strInstructions;

  // Loop through ingredients and measurements and add them to list items
  let ingredientsList = '';
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredientsList += `<li>${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`;
    } else {
      break;
    }
  }
  mealIngredients.innerHTML = ingredientsList;
}

// Function to add a meal to favourites
function addToFavouritesHandler(e) {
  e.preventDefault();
  const mealId = e.target.getAttribute('data-mealid');
  const mealName = e.target.parentElement.querySelector('.card-title').innerText;
  const mealImage = e.target.parentElement.parentElement.previousElementSibling.firstElementChild.getAttribute('src');
  const meal = { id: mealId, name: mealName, image: mealImage };
  favourites.push(meal);
  localStorage.setItem('favourites', JSON.stringify(favourites));
}

// Function to remove a meal from favourites
function removeFromFavouritesHandler(e) {
  e.preventDefault();
  const mealId = e.target.getAttribute('data-mealid');
  favourites = favourites.filter(meal => meal.id !== mealId);
  localStorage.setItem('favourites', JSON.stringify(favourites));
  displayFavourites();
}

// Function to display favourites
function displayFavourites() {
  let output = '';
  if (favourites.length === 0) {
    output = '<p>You have no favourite meals yet. Start adding some!</p>';
} else {
favourites.forEach(meal => {
output += <div class="col-md-4"> <div class="card mb-3"> <img src="${meal.image}" class="card-img-top" alt="${meal.name}" width="100%" height="225"> <div class="card-body"> <h5 class="card-title">${meal.name}</h5> <a href="meal.html?id=${meal.id}" class="btn btn-primary stretched-link">View Details</a> <button class="btn btn-outline-secondary removeFromFavourites" data-mealid="${meal.id}">Remove from Favourites</button> </div> </div> </div> ;
});
}
favouritesList.innerHTML = output;

// Add event listeners to remove from favourites buttons
const removeButtons = document.querySelectorAll('.removeFromFavourites');
removeButtons.forEach(button => {
button.addEventListener('click', removeFromFavouritesHandler);
});
}

// Event listeners
searchForm.addEventListener('submit', e => {
e.preventDefault();
const searchTerm = searchInput.value.trim();
if (searchTerm) {
fetch(${API_URL}/search.php?s=${searchTerm})
.then(res => res.json())
.then(data => {
if (data.meals) {
displaySearchResults(data.meals);
} else {
searchResults.innerHTML = '<p>No meals found. Try another search.</p>';
}
});
} else {
searchResults.innerHTML = '<p>Please enter a search term.</p>';
}
});

// Add event listener to add to favourites buttons
searchResults.addEventListener('click', e => {
if (e.target.classList.contains('addToFavourites')) {
addToFavouritesHandler(e);
}
});

// Load favourites on page load
window.addEventListener('load', () => {
displayFavourites();
});

// Check if on meal page
if (window.location.pathname.includes('meal.html')) {
// Get meal ID from URL and display meal information
const urlParams = new URLSearchParams(window.location.search);
const mealId = urlParams.get('id');
fetch(${API_URL}/lookup.php?i=${mealId})
.then(res => res.json())
.then(data => {
displayMeal(data.meals[0]);
});

// Add event listener to add to favourites button
addToFavourites.addEventListener('click', e => {
addToFavouritesHandler(e);
});
}
