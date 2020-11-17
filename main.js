const calorieListUl = document.querySelector("#calories-list");
calorieListUl.innerText = "";
const calorieIntakeForm = document.querySelector("#new-calorie-form");
const calorieSumH3 = document.querySelector("#calorie-sum");

BASE_URL = "http://localhost:3000/api/v1/calorie_entries";

showCalories();
function showCalories() {
  fetch(BASE_URL)
    .then((resp) => resp.json())
    .then((caloriesArr) => {
      caloriesArr.forEach(convertToHTML);
      const totalCalories = caloriesArr.reduce((total, calorieObj) => {
        return (total += calorieObj.calorie);
      }, 0);
      const calorieTotalSpan = document.createElement("span");
      calorieTotalSpan.innerText = `${totalCalories}`;
      calorieSumH3.append(calorieTotalSpan);
    });
}

let convertToHTML = (calorieObj) => {
  let newLi = document.createElement("li");
  newLi.className = "calories-list-item";
  newLi.innerHTML = `<div class="uk-grid">
    <div class="uk-width-1-6">
      <strong id="calorie-num">${calorieObj.calorie}</strong>
      <span>kcal</span>
    </div>
    <div class="uk-width-4-5">
      <em class="uk-text-meta">${calorieObj.note}</em>
    </div>
  </div>
  <div class="list-item-menu">
    <a class="edit-button" uk-icon="icon: pencil" uk-toggle="target: #edit-form-container"></a>
    <a class="delete-button" uk-icon="icon: trash" id="delete-button"></a>
  </div>`;

  calorieListUl.prepend(newLi);

  const API_PATH = `/${calorieObj.id}`;
  const deleteButton = document.querySelector(".delete-button");

  deleteButton.addEventListener("click", (event) => {
    fetch(`${BASE_URL}${API_PATH}`, {
      method: "DELETE",
    })
      .then((resp) => resp.json())
      .then((deletedObj) => {
        let caloriesNow = calorieSumH3.firstElementChild.innerText;
        let deleteCal = event.target
          .closest("li")
          .querySelector("strong#calorie-num").innerText;
        debugger;
        let newTotalCal = caloriesNow - deleteCal;
        calorieSumH3.firstElementChild.innerText = newTotalCal;
        newLi.remove();
      });
  });
}; //END OF CONVERT TO HTML

calorieIntakeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  let userInput = {
    calorie: event.target["calorie-input"].value,
    note: event.target["notes-input"].value,
  };
  fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userInput),
  })
    .then((response) => response.json())
    .then((newCalorie) => {
      convertToHTML(newCalorie);
      calorieIntakeForm.reset();
    });
});

//Each time an entry is made in the list, calculate the sum of all the calories and set this as the value attribute of the #progress-bar element.
