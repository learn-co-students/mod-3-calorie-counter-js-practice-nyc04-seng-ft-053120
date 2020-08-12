let caloriesList = document.querySelector("#calories-list")
let progressBar = document.querySelector("progress.uk-progress")
let newCalorieForm = document.querySelector("#new-calorie-form")
let editFormModal = document.querySelector("#edit-form-container")
let closeModalButton = document.querySelector(".uk-modal-close-default")
let editForm = document.querySelector("#edit-calorie-form")
let editFormCalorie = document.querySelector("#edit-calorie")
let editFormNote = document.querySelector("#edit-note")
let bMRForm = document.querySelector("#bmr-calulator")
let lowerBMR = document.querySelector("#lower-bmr-range")
let higherBMR = document.querySelector("#higher-bmr-range")


let calArr = []

fetch("http://localhost:3000/api/v1/calorie_entries")
.then(res => res.json())
.then((calObjArr) => {
  calArr = calObjArr
  renderCalories()
})

let renderCalories = () => {
  calArr.forEach((calObj) => {
    calToHTML(calObj)
  })
}

let calToHTML = (calObj) => {
  let calLi = document.createElement("li")
  calLi.className = "calories-list-item"

  let calAndNoteDiv = document.createElement("div")
  calAndNoteDiv.className = "uk-grid"

  let calDiv = document.createElement("div")      
  calDiv.className = "uk-width-1-6"

  let strongCal = document.createElement("strong")
  strongCal.innerText = calObj.calorie 

  let unitSpan = document.createElement("span")
  unitSpan.innerText = "kcal"

  let noteDiv = document.createElement("div")
  noteDiv.className = "uk-width-4-5"

  let noteEm = document.createElement("em")
  noteEm.className = "uk-text-meta"
  noteEm.innerText = calObj.note 

  let listItemMenuDiv = document.createElement("div")
  listItemMenuDiv.className = "list-item-menu"

  listItemMenuDiv.innerHTML = '<a class="edit-button" uk-toggle="target: #edit-form-container" uk-icon="icon: pencil"></a><a class="delete-button" uk-icon="icon: trash"></a>'

  calDiv.append(strongCal, unitSpan)
  noteDiv.append(noteEm)
  calAndNoteDiv.append(calDiv, noteDiv)

  calLi.append(calAndNoteDiv, listItemMenuDiv)

  caloriesList.prepend(calLi)

  updateProgressBar()

  let editButton = listItemMenuDiv.querySelector(".edit-button")

  let deleteButton = listItemMenuDiv.querySelector(".delete-button")

  deleteButton.addEventListener("click", (evt) => {
    calArr = calArr.filter((cal) => {
      return cal.id !== calObj.id
    })

    updateProgressBar()

    fetch(`http://localhost:3000/api/v1/calorie_entries/${calObj.id}`, {
      method: "DELETE"
    })
    .then(res => res.json())
    .then((emptyObj) => {
      calLi.remove()
    })
  })

  editButton.addEventListener("click", (evt) => {
    editFormModal.style.display = "block"

    editFormCalorie.value = calObj.calorie
    editFormNote.value = calObj.note

    closeModalButton.addEventListener("click", (evt) => {
      editFormModal.style.display = "none"
    })


    editForm.addEventListener("submit", (evt) => {
      evt.preventDefault()

      // update memory(state), update database, update page

      fetch(`http://localhost:3000/api/v1/calorie_entries/${calObj.id}`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          calorie: evt.target.calorie.value,
          note: evt.target.note.value
        })
      })
      .then(res => res.json())
      .then((updatedCalObj) => {
        thisCalObj = calArr.find((calObj) => { return calObj.id === updatedCalObj.id })

        thisCalObj.note = updatedCalObj.note
        thisCalObj.calorie = updatedCalObj.calorie
        updateProgressBar()

        strongCal.innerText = updatedCalObj.calorie 
        noteEm.innerText = updatedCalObj.note 

        editFormModal.style.display = "none"
      })

    })

  })
}


let updateProgressBar = () => {
  let calories = []
  calArr.forEach((calObj) => {
    calories.push(calObj.calorie)
  })
  let total = calories.reduce((accumulator, currentValue) => {
    return accumulator + currentValue
  }, 0)
  progressBar.value = total
}


newCalorieForm.addEventListener("submit", (evt) => {
  evt.preventDefault()

  fetch("http://localhost:3000/api/v1/calorie_entries", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      calorie: evt.target.calorie.value,
      note: evt.target.note.value
    })
  })
  .then(res => res.json())
  .then((newCalObj) => {
    calArr.push(newCalObj)
    calToHTML(newCalObj)
    evt.target.reset()
  })
})

bMRForm.addEventListener("submit", (evt) => {
  evt.preventDefault()

  weight = evt.target.weight.value
  height = evt.target.height.value
  age = evt.target.age.value

  lower = lowerFormula(weight, height, age)  

  higher = upperFormula(weight, height, age)

  lowerBMR.innerText = lower.toFixed(2)

  higherBMR.innerText = higher.toFixed(2)
 
  progressBar.max = (higher + lower) / 2

  evt.target.reset()
})

let lowerFormula = (weight, height, age) => {
  return 655 + (4.35 * weight) + (4.7 * height) - (4.7 * age)
}

let upperFormula = (weight, height, age) => {
  return 66 + (6.23 * weight) + (12.7 * height) - (6.8 * age)
}