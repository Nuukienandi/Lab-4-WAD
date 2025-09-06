const form = document.getElementById("regForm");
const liveRegion = document.getElementById("live");
const cardsContainer = document.getElementById("cards");
const tableBody = document.querySelector("#summary tbody");

// Validate text/select inputs (required fields)
function validateRequired(id, errorId, fieldName) {
  const value = document.getElementById(id).value.trim();
  const error = document.getElementById(errorId);
  if (value === "") {
    error.textContent = fieldName + " is required.";
    return false;
  } else {
    error.textContent = "";
    return true;
  }
}

function validateEmail() {
  const email = document.getElementById("email").value.trim();
  const error = document.getElementById("err-email");
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    error.textContent = "Please enter a valid email.";
    return false;
  } else {
    error.textContent = "";
    return true;
  }
}


// Validate radio buttons (Year of study must be selected)
function validateYear() {
  const years = document.querySelectorAll("input[name='year']");
  const error = document.getElementById("err-year");
  let checked = false;
  years.forEach(y => { if (y.checked) checked = true; });
  if (!checked) {
    error.textContent = "Please select a year.";
    return false;
  } else {
    error.textContent = "";
    return true;
  }
}

function getSelectedYear() {
  const years = document.querySelectorAll("input[name='year']");
  for (let y of years) if (y.checked) return y.value;
  return null;
}


function addStudent(data) {
  
  const card = document.createElement("div");
  card.className = "card-person";
  card.innerHTML = `
    <img src="${data.photo || "https://placehold.co/100"}" alt="Profile Photo">
    <h3>${data.first} ${data.last}</h3>
    <p><span class="badge">${data.prog}</span> <span class="badge">Year ${data.year}</span></p>
    <p>${data.interests || "No interests listed"}</p>
    <button class="remove-btn">Remove</button>
  `;
  cardsContainer.prepend(card);

  
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${data.first} ${data.last}</td>
    <td>${data.prog}</td>
    <td>${data.year}</td>
    <td>${data.interests || "None"}</td>
    <td><button class="remove-btn">Remove</button></td>
  `;
  tableBody.prepend(tr);

  const removeCardBtn = card.querySelector(".remove-btn");
  const removeTableBtn = tr.querySelector(".remove-btn");
  function removeStudent() {
    card.remove();
    tr.remove();
    removeFromStorage(data);
  }
  removeCardBtn.addEventListener("click", removeStudent);
  removeTableBtn.addEventListener("click", removeStudent);
}


function saveToStorage(data) {
  let profiles = JSON.parse(localStorage.getItem("profiles")) || [];
  profiles.unshift(data);
  localStorage.setItem("profiles", JSON.stringify(profiles));
}

function loadFromStorage() {
  let profiles = JSON.parse(localStorage.getItem("profiles")) || [];
  profiles.forEach(p => addStudent(p));
}

function removeFromStorage(data) {
  let profiles = JSON.parse(localStorage.getItem("profiles")) || [];
  profiles = profiles.filter(p => !(p.first === data.first && p.last === data.last && p.email === data.email));
  localStorage.setItem("profiles", JSON.stringify(profiles));
}


form.addEventListener("submit", function(e) {
  e.preventDefault();
  const firstOk = validateRequired("first", "err-first", "First Name");
  const lastOk = validateRequired("last", "err-last", "Last Name");
  const progOk = validateRequired("prog", "err-prog", "Programme");
  const emailOk = validateEmail();
  const yearOk = validateYear();

  if (firstOk && lastOk && progOk && emailOk && yearOk) {
    liveRegion.textContent = "Form is valid! Adding student...";
    const data = {
      first: document.getElementById("first").value.trim(),
      last: document.getElementById("last").value.trim(),
      email: document.getElementById("email").value.trim(),
      prog: document.getElementById("prog").value.trim(),
      year: getSelectedYear(),
      interests: document.getElementById("interests").value.trim(),
      photo: document.getElementById("photo").value.trim()
    };
    addStudent(data);
    saveToStorage(data);
    form.reset();
  } else {
    liveRegion.textContent = "Fix errors before submitting.";
  }
});

function filterStudents() {
  const input = document.getElementById("search").value.toUpperCase();

 
  const tableRows = tableBody.getElementsByTagName("tr");
  for (let tr of tableRows) {
    const cells = tr.getElementsByTagName("td");
    const rowText = `${cells[0].textContent} ${cells[1].textContent} ${cells[2].textContent} ${cells[3].textContent}`.toUpperCase();
    tr.style.display = rowText.includes(input) ? "" : "none";
  }

 
  const cards = cardsContainer.getElementsByClassName("card-person");
  for (let card of cards) {
    const name = card.querySelector("h3").textContent.toUpperCase();
    const progYear = card.querySelector("p span:nth-child(1)").textContent.toUpperCase() + " " + card.querySelector("p span:nth-child(2)").textContent.toUpperCase();
    const interests = card.querySelector("p:nth-of-type(2)").textContent.toUpperCase();
    const cardText = name + " " + progYear + " " + interests;
    card.style.display = cardText.includes(input) ? "" : "none";
  }
}


window.addEventListener("DOMContentLoaded", loadFromStorage);



