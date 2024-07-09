import './style.css'
import { navigate, router } from './router.js';
import { openModal } from './modal.js';
import { saveForm } from './saveform.js';

const elementsData = [
  { type: 'input', label: 'Input' },
  { type: 'button', label: 'Button' },
  { type: 'radio', label: 'Radio' },
  { type: 'checkbox', label: 'Checkbox' },
  { type: 'textarea', label: 'Textarea' }
];

document.addEventListener('DOMContentLoaded', () => {
  router(); 
});

export function renderLandingPage() {
  const landingPage = `
    <div class="landing-container">
      <h1>Welcome to the Form Builder</h1>
      <button id="previewFormsButton">Preview Saved Forms</button>
      <button id="createNewFormButton">Create New Form</button>
    </div>
  `;
  document.getElementById('app').innerHTML = landingPage;

  document.getElementById('previewFormsButton').addEventListener('click', () => navigate('/preview'));
  document.getElementById('createNewFormButton').addEventListener('click', () => navigate('/create'));
}

export function renderPreviewPage() {
  const previewPage = `
    <div class="preview-container">
      <h2>Saved Forms</h2>
      <ul id="savedFormsList"></ul>
      <button id="backToLandingPage">Back</button>
    </div>
  `;
  document.getElementById('app').innerHTML = previewPage;

  document.getElementById('backToLandingPage').addEventListener('click', () => navigate('/'));
  renderSavedForms();
}

export function renderFormBuilder() {
  const contTemp = `
    <div class="container">
      <div class="left-div">
        <h3>Components</h3>
        ${elementsData.map(elem => `
          <div class="draggable-element" data-type="${elem.type}" draggable="true">${elem.label}</div>
        `).join('')}
      </div>
      <div class="right-div" id="form-builder">
        <h2>Drop the Elements</h2>
      </div>
    </div>
    <div class="form-heading">
      <label for="formHeading">Form Heading:</label>
      <input type="text" id="formHeading" placeholder="Enter form heading" required>
    </div>
    <div class="saveForm">
      <button id="saveFormButton">Save Form</button>
    </div>
    <button id="backToLandingPage">Back</button>
  `;

  document.getElementById('app').innerHTML = contTemp;

  const draggableElements = document.querySelectorAll('.draggable-element');
  draggableElements.forEach(element => {
    element.addEventListener('dragstart', dragStart);
  });

  const formBuilder = document.getElementById('form-builder');
  formBuilder.addEventListener('dragover', allowDrop);
  formBuilder.addEventListener('drop', drop);

  document.getElementById('saveFormButton').addEventListener('click', saveForm);
  document.getElementById('backToLandingPage').addEventListener('click', () => navigate('/'));

  renderSavedForms();
}

function dragStart(event) {
  event.dataTransfer.setData('text/plain', event.target.dataset.type);
}

function allowDrop(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();
  const dataType = event.dataTransfer.getData('text/plain');

  const elementContainer = document.createElement('div');
  elementContainer.classList.add('element-container');

  const label = document.createElement('label');
  label.textContent = `${dataType.charAt(0).toUpperCase() + dataType.slice(1)}:`;

  let newElement;
  switch (dataType) {
    case 'input':
      newElement = document.createElement('input');
      newElement.setAttribute('type', 'text');
      break;
    case 'button':
      newElement = document.createElement('button');
      newElement.textContent = 'Button';
      break;
    case 'radio':
      newElement = document.createElement('div');
      newElement.innerHTML = '<input type="radio" name="radio"><label>Option 1</label>';
      break;
    case 'checkbox':
      newElement = document.createElement('div');
      newElement.innerHTML = '<input type="checkbox"><label>Option 1</label>';
      break;
    case 'textarea':
      newElement = document.createElement('textarea');
      break;
    default:
      return;
  }

  const editButton = document.createElement('button');
  editButton.innerHTML = '<i class="fa-solid fa-pencil"></i>';
  editButton.classList.add('edit-button');

  const deleteButton = document.createElement('button');
  deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
  deleteButton.classList.add('delete-button');

  elementContainer.appendChild(label);
  elementContainer.appendChild(newElement);
  elementContainer.appendChild(editButton);
  elementContainer.appendChild(deleteButton);

  const formBuilder = document.getElementById('form-builder');
  formBuilder.appendChild(elementContainer);

  editButton.addEventListener('click', () => {
    openModal(elementContainer);
  });

  deleteButton.addEventListener('click', function() {
    elementContainer.remove();
  });
}

export function renderSavedForms() {
  const savedFormsList = document.getElementById('savedFormsList');
  savedFormsList.innerHTML = '';

  const savedForms = JSON.parse(localStorage.getItem('forms')) || [];

  savedForms.forEach(function (form) {
    const listItem = document.createElement('li');
    listItem.textContent = form.heading;
    listItem.dataset.formId = form.id;
    listItem.classList.add('saved-forms');
    listItem.addEventListener('click', function () {
      navigate(`/form/${form.id}`);
    });
    savedFormsList.appendChild(listItem);
  });
}

export function renderSavedFormById(id) {
  const savedForms = JSON.parse(localStorage.getItem('forms')) || [];
  const form = savedForms.find(f => f.id == id);

  if (!form) {
    document.getElementById('app').innerHTML = '<h1>Form not found</h1>';
    return;
  }

  const formBuilder = document.getElementById('form-builder');
  formBuilder.innerHTML = '';

  form.elements.forEach(element => {
    const elementContainer = document.createElement('div');
    elementContainer.classList.add('element-container');

    const label = document.createElement('label');
    label.textContent = element.label;

    let newElement;
    switch (element.type) {
      case 'input':
        newElement = document.createElement('input');
        newElement.setAttribute('type', 'text');
        newElement.value = element.value;
        break;
      case 'button':
        newElement = document.createElement('button');
        newElement.textContent = element.value;
        break;
      case 'radio':
        newElement = document.createElement('div');
        newElement.innerHTML = `<input type="radio" name="radio"><label>${element.value}</label>`;
        break;
      case 'checkbox':
        newElement = document.createElement('div');
        newElement.innerHTML = `<input type="checkbox"><label>${element.value}</label>`;
        break;
      case 'textarea':
        newElement = document.createElement('textarea');
        newElement.value = element.value;
        break;
      default:
        return;
    }

    const editButton = document.createElement('button');
    editButton.innerHTML = '<i class="fa-solid fa-pencil"></i>';
    editButton.classList.add('edit-button');

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    deleteButton.classList.add('delete-button');

    elementContainer.appendChild(label);
    elementContainer.appendChild(newElement);
    elementContainer.appendChild(editButton);
    elementContainer.appendChild(deleteButton);

    formBuilder.appendChild(elementContainer);

    editButton.addEventListener('click', () => {
      openModal(elementContainer);
    });

    deleteButton.addEventListener('click', function() {
      elementContainer.remove();
    });
  });
}


