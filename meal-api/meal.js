const search = document.getElementById("search");
const submit = document.getElementById("submit");
const random = document.getElementById("random");
const resultHeading = document.getElementById("meal-result-heading");
const mealsEl = document.getElementById("meals");
const single_mealEl = document.getElementById("single-meal-container");

function findMeal(e) {
  // To prevent data from reloading/refreshing
  e.preventDefault();
  const item = search.value;
  if (item.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${item}`)
      .then((res) => res.json())
      .then((data) => {
        resultHeading.innerHTML = `Search Result for ${item}`;
        if (data.meals === null) {
          resultHeading.innerHTML = `Oops! No result for meal ${item}`;
        } else {
          mealsEl.innerHTML = data.meals
            .map(
              (meal) => `<div class="meal">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <div class="meal-info" data-mealId="${meal.idMeal}">
            <h3>${meal.strMeal}</h3>
            </div>
            </div>`
            )
            .join(""); // so no data is seperated by a data & return the entire array as a string
        }
      });
    //   clear input field
    search.value = "";
  }
}

// Function to get meal ID
function getsingleItemID(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}
`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      addMealToDOM(meal);
    });
}

// Function to get random meals
function getRandomMeal() {
  // Clear result data and heading
  (mealsEl.innerHTML = ""), (resultHeading.innerHTML = "");
  fetch(`https://www.themealdb.com/api/json/v1/1/random.php
`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      addMealToDOM(meal);
    });
}

// Function to add meals to DOM
function addMealToDOM(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }
  single_mealEl.innerHTML = `
    <div class="single-meal">
    <h1>${meal.strMeal}</h1>
    <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
    </div>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
    <div class="main">
        <h2>Ingredients</h2>
        <ul>
            ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
        </ul>
        <h2>Instructions</h2>
        <p>${meal.strInstructions}</p>
    </div>
    </div>
  `;
}

// Submit
submit.addEventListener("submit", findMeal);
// Random Data
random.addEventListener("click", getRandomMeal);

// Single Meal Click
mealsEl.addEventListener("click", (e) => {
  const mealInfo = e.composedPath().find((single_item) => {
    if (single_item.classList) {
      return single_item.classList.contains("meal-info");
    } else {
      return false;
    }
  });
  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealId");
    getsingleItemID(mealID);
  }
});
