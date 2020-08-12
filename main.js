const calorieListUl = document.querySelector("#calories-list");
calorieListUl.innerText = ""
const calorieIntakeForm = document.querySelector("#new-calorie-form")

BASE_URL = "http://localhost:3000/api/v1/calorie_entries"

showCalories();

function showCalories() {
  fetch(BASE_URL)
    .then((resp) => resp.json())
    .then((caloriesArr) => (caloriesArr.forEach(convertToHTML)));
}

let convertToHTML = (calorieObj) => {
    let newLi = document.createElement("li")
    newLi.className = "calories-list-item"
    newLi.innerHTML = `<div class="uk-grid">
    <div class="uk-width-1-6">
      <strong>${calorieObj.calorie}</strong>
      <span>kcal</span>
    </div>
    <div class="uk-width-4-5">
      <em class="uk-text-meta">${calorieObj.note}</em>
    </div>
  </div>
  <div class="list-item-menu">
    <a class="edit-button" uk-icon="icon: pencil" uk-toggle="target: #edit-form-container"></a>
    <a class="delete-button" uk-icon="icon: trash" id="delete-button"></a>
  </div>`
  
  calorieListUl.prepend(newLi)
  const API_PATH = `/${calorieObj.id}`;
  const deleteButton = document.querySelector(".delete-button");
  deleteButton.addEventListener("click", (event) => {
      console.log("YEEEEERRR", deleteButton)
            fetch(`${BASE_URL}${API_PATH}`, {
                method: "DELETE"
            })
            .then(resp => resp.json())
            .then((deletedObj) => {
                newLi.remove();  
            })
  })
}


























