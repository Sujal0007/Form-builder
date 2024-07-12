import "./style.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { navigate, router } from "./router.js";
import { openModal, addModalTemplate } from "./modal.js";
import { saveForm } from "./saveform.js";

const elementsData = [
  { type: "input", label: "Input" },
  { type: "button", label: "Button" },
  { type: "radio", label: "Radio" },
  { type: "checkbox", label: "Checkbox" },
  { type: "textarea", label: "Textarea" },
];

document.addEventListener("DOMContentLoaded", () => {
  renderLandingPage();
  addModalTemplate();
  router();
});

export function renderLandingPage() {
  const landingPage = `
     <header><div class="left"><img src="https://th.bing.com/th/id/OIP.YSZMnwRY1zzF0RgqM4I2vwHaEc?rs=1&pid=ImgDetMain" alt=""></div><div class="center"><ul>
 <li class='home'>Home</li>
           <li class='templates'>Templates</li>
  <li>About</li>

</ul></div>
<div class="right">
  <button>Login</button>
  <button>Sign Up Free</button>
</div>
</header>
   <div class="landing-page">
  <div class="land-det">
    <h1><span>Free!</span> Javascript Form Builder</h1>
    <p>Javascript can be tricky. That’s why we’ve created a <span>drag-and-drop Javascript Form Builder</span> that lets you create <span>custom contact forms, registration forms, donation forms, and more — </span>without writing a single line of code! Get started for free today.</p>
    <button id="previewFormsButton">See Existing Forms!</button>
    <button id="createNewFormButton">Create New!</button>
    <h3>ITS FREE!!</h3>
  </div>
  <div class="land-img">
    <img src="https://cdn.jotfor.ms/assets/img/landing/minimals/javascript-form-builder/introduction.svg" alt="">
  </div>
</div>
  `;
  document.getElementById("app").innerHTML = landingPage;

  document
    .getElementById("previewFormsButton")
    .addEventListener("click", () => navigate("/preview"));
  document
    .getElementById("createNewFormButton")
    .addEventListener("click", () => navigate("/create"));

    document.querySelector('.home').addEventListener("click", () => navigate("/"));
  document.querySelector('.templates').addEventListener("click", () => navigate("/preview"));
}

export function renderPreviewPage() {
  const previewPage = `   <header><div class="left"><img src="https://th.bing.com/th/id/OIP.YSZMnwRY1zzF0RgqM4I2vwHaEc?rs=1&pid=ImgDetMain" alt=""></div><div class="center"><ul>
  <li class='home'>Home</li>
           <li class='templates'>Templates</li>
  <li>About</li>

</ul></div>
<div class="right">
  <button>Login</button>
  <button>Sign Up Free</button>
</div>
</header>
    <div class="preview-container">
    <h1>Saved Templates</h1>
      <ul id="savedFormsList"></ul>
       <button id="backToLandingPage">Back</button>
    </div>
  `;
  document.getElementById("app").innerHTML = previewPage;

  document
    .getElementById("backToLandingPage")
    .addEventListener("click", () => navigate("/"));
  renderSavedForms();

  document.querySelector('.home').addEventListener("click", () => navigate("/"));
  document.querySelector('.templates').addEventListener("click", () => navigate("/preview"));

  renderSavedForms();
}

export function renderFormBuilder() {
  const contTemp = `<header>
      <div class="left"><img src="https://th.bing.com/th/id/OIP.YSZMnwRY1zzF0RgqM4I2vwHaEc?rs=1&pid=ImgDetMain" alt=""></div>
      <div class="center">
        <ul>
          <li class='home'>Home</li>
          <li class='templates'>Templates</li>
          <li>About</li>
        </ul>
      </div>
      <div class="right">
        <button>Login</button>
        <button>Sign Up Free</button>
      </div>
    </header>
    <div class="container">
      <div class="left-div">
        <h3>Components</h3>
        ${elementsData
          .map(
            (elem) => `
          <div class="draggable-element" data-type="${elem.type}" draggable="true">${elem.label}</div>
        `
          )
          .join("")}
      </div>
      <div class="right-div" id="form-builder">
       
         <div class="form-heading">
      <input type="text"  id="formHeading" placeholder=" Form heading required" required>
    </div>
     <h2>Drop the Elements</h2>
      </div>
     
    </div>
    
    <div class="saveForm">
      <button id="saveFormButton">Save Form</button>
    </div>
  `;

  document.getElementById("app").innerHTML = contTemp;

  const draggableElements = document.querySelectorAll(".draggable-element");
  draggableElements.forEach((element) => {
    element.addEventListener("dragstart", dragStart);
  });

  const formBuilder = document.getElementById("form-builder");
  formBuilder.addEventListener("dragover", allowDrop);
  formBuilder.addEventListener("drop", drop);

  document.getElementById("saveFormButton").addEventListener("click", saveForm);
 
  document.querySelector('.home').addEventListener("click", () => navigate("/"));
  document.querySelector('.templates').addEventListener("click", () => navigate("/preview"));

  

  renderSavedForms();
}

function dragStart(event) {
  event.dataTransfer.setData("text/plain", event.target.dataset.type);
}

function allowDrop(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();
  const dataType = event.dataTransfer.getData("text/plain");

  const elementContainer = document.createElement("div");
  elementContainer.classList.add("element-container");

  const label = document.createElement("label");
  label.textContent = `${
    dataType.charAt(0).toUpperCase() + dataType.slice(1)
  }:`;

  let newElement;
  switch (dataType) {
    case "input":
      newElement = document.createElement("input");
      newElement.setAttribute("type", "text");
      break;
    case "button":
      newElement = document.createElement("button");
      newElement.textContent = "Button";
      break;
    case "radio":
      newElement = document.createElement("div");
      newElement.innerHTML =
        '<input type="radio" name="radio"><label>Option 1</label>';
      break;
    case "checkbox":
      newElement = document.createElement("div");
      newElement.innerHTML = '<input type="checkbox"><label>Option 1</label>';
      break;
    case "textarea":
      newElement = document.createElement("textarea");
      break;
    default:
      return;
  }

  const editButton = document.createElement("button");
  editButton.innerHTML = '<i class="fa-solid fa-pencil"></i>';
  editButton.classList.add("edit-button");

  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
  deleteButton.classList.add("delete-button");

  elementContainer.appendChild(label);
  elementContainer.appendChild(newElement);
  elementContainer.appendChild(editButton);
  elementContainer.appendChild(deleteButton);

  const formBuilder = document.getElementById("form-builder");
  formBuilder.appendChild(elementContainer);

  editButton.addEventListener("click", () => {
    openModal(elementContainer);
  });

  deleteButton.addEventListener("click", function () {
    elementContainer.remove();
  });
}

export function renderSavedForms() {
  const savedFormsList = document.getElementById("savedFormsList");
  if (!savedFormsList) {
    console.error("savedFormsList is null");
    return;
  }

  savedFormsList.innerHTML = "";

  const savedForms = JSON.parse(localStorage.getItem("forms")) || [];

  savedForms.forEach(function (form) {
    const listItem = document.createElement("li");
    listItem.textContent = form.heading;
    listItem.dataset.formId = form.id;
    listItem.classList.add("saved-forms");
    listItem.addEventListener("click", function () {
      navigate(`/form-preview/${form.id}`);
    });

    savedFormsList.appendChild(listItem);
  });
}

export function renderSavedFormById(id) {
  const savedForms = JSON.parse(localStorage.getItem("forms")) || [];
  const form = savedForms.find((f) => f.id == id);

  if (!form) {
    document.getElementById("app").innerHTML = "<h1>Form not found</h1>";
    return;
  }

  renderFormBuilder();

  const formHeadingInput = document.getElementById("formHeading");
  if (formHeadingInput) {
    formHeadingInput.value = form.heading;
  }

  const formBuilder = document.getElementById("form-builder");
  formBuilder.innerHTML = "";

  const formHeadingContainer = document.createElement("div");
  formHeadingContainer.classList.add("form-heading");
  formHeadingContainer.innerHTML = `
      <input type="text" id="formHeading" value="${form.heading}" placeholder="Form heading required" required>
  `;
  formBuilder.appendChild(formHeadingContainer);

  form.elements.forEach((element) => {
    const elementContainer = document.createElement("div");
    elementContainer.classList.add("element-container");

    const label = document.createElement("label");
    label.textContent = element.label;

    let newElement;
    switch (element.type) {
      case "text":
        newElement = document.createElement("input");
        newElement.setAttribute("type", "text");
        newElement.value = element.placeholder;
        break;
      case "button":
        newElement = document.createElement("button");
        newElement.textContent = element.text;
        break;
      case "radio":
      case "checkbox":
        newElement = document.createElement("div");
        element.options.forEach((option) => {
          const optionContainer = document.createElement("div");
          const inputElement = document.createElement("input");
          inputElement.setAttribute("type", element.type);
          const optionLabel = document.createElement("label");
          optionLabel.textContent = option;
          optionContainer.appendChild(inputElement);
          optionContainer.appendChild(optionLabel);
          newElement.appendChild(optionContainer);
        });
        break;
      case "textarea":
        newElement = document.createElement("textarea");
        newElement.value = element.placeholder;
        break;
      default:
        return;
    }

    const editButton = document.createElement("button");
    editButton.innerHTML = '<i class="fa-solid fa-pencil"></i>';
    editButton.classList.add("edit-button");

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    deleteButton.classList.add("delete-button");

    elementContainer.appendChild(label);
    elementContainer.appendChild(newElement);
    elementContainer.appendChild(editButton);
    elementContainer.appendChild(deleteButton);

    formBuilder.appendChild(elementContainer);

    editButton.addEventListener("click", () => {
      openModal(elementContainer);
    });

    deleteButton.addEventListener("click", function () {
      elementContainer.remove();
    });
  });
}
export function renderFormPreview(id) {
  const savedForms = JSON.parse(localStorage.getItem("forms")) || [];
  const form = savedForms.find((f) => f.id == id);

  if (!form) {
    document.getElementById("app").innerHTML = "<h1>Form not found</h1>";
    return;
  }

  const formPreview = `
    <header><div class="left"><img src="https://th.bing.com/th/id/OIP.YSZMnwRY1zzF0RgqM4I2vwHaEc?rs=1&pid=ImgDetMain" alt=""></div><div class="center"><ul>
     <li class='home'>Home</li>
           <li class='templates'>Templates</li>
      <li>About</li>
    </ul></div>
    <div class="right">
      <button>Login</button>
      <button>Sign Up Free</button>
    </div></header>
    <div class="form-preview">
      <h1>${form.heading}</h1>
      <form id="previewForm">
      </form>
      
    </div>
   
  `;

  document.getElementById("app").innerHTML = formPreview;

  const formElement = document.getElementById("previewForm");

  form.elements.forEach((element) => {
    const elementContainer = document.createElement("div");
    elementContainer.classList.add("element-container");

    const label = document.createElement("label");
    label.textContent = element.label;

    let newElement;
    switch (element.type) {
      case "text":
        newElement = document.createElement("input");
        newElement.setAttribute("type", "text");
        newElement.value = element.placeholder;
        break;
      case "button":
        newElement = document.createElement("button");
        newElement.textContent = element.text;
        break;
      case "radio":
      case "checkbox":
        newElement = document.createElement("div");
        element.options.forEach((option) => {
          const optionContainer = document.createElement("div");
          const inputElement = document.createElement("input");
          inputElement.setAttribute("type", element.type);
          const optionLabel = document.createElement("label");
          optionLabel.textContent = option;
          optionContainer.appendChild(inputElement);
          optionContainer.appendChild(optionLabel);
          newElement.appendChild(optionContainer);
        });
        break;
      case "textarea":
        newElement = document.createElement("textarea");
        newElement.value = element.placeholder;
        break;
      default:
        return;
    }

    elementContainer.appendChild(label);
    elementContainer.appendChild(newElement);
    formElement.appendChild(elementContainer);
  });


    document.querySelector('.home').addEventListener("click", () => navigate("/"));
  document.querySelector('.templates').addEventListener("click", () => navigate("/preview"));
}
