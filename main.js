import './style.css'
import "@fortawesome/fontawesome-free/css/all.css";
import { openModal, addModalTemplate } from './modal.js';

const elementsData = [
  { type: 'input', label: 'Input' },
  { type: 'button', label: 'Button' },
  { type: 'radio', label: 'Radio' },
  { type: 'checkbox', label: 'Checkbox' },
  { type: 'textarea', label: 'Textarea' }
];

function renderCont() {
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
        <div class='saveForm'>
        <button id="saveFormButton">Save Form</button></div>

        <div class="saved-forms">
            <h3>Saved Forms</h3>
            <ul id="savedFormsList"></ul>
        </div> 
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

  deleteButton.addEventListener('click', () => {
    elementContainer.remove();
  });
}

function saveForm() {
  const formHeading = document.getElementById('formHeading').value;

  if (!formHeading) {
    alert('Form heading is required');
    return;
  }
  const formBuilder = document.getElementById('form-builder');
  const formElements = formBuilder.querySelectorAll('.element-container');
  const formId = `form-${Date.now()}`;
  const formData = { id: formId, heading: formHeading, elements: [] };

  formElements.forEach(elem => {
    const elementData = {};
    if (elem.querySelector('label')) {
      elementData.label = elem.querySelector('label').textContent.replace(':', '');
    }
    if (elem.querySelector('input')) {
      const inputElement = elem.querySelector('input');
      elementData.type = inputElement.type;
      elementData.placeholder = inputElement.getAttribute('placeholder') || '';
    } else if (elem.querySelector('textarea')) {
      const textareaElement = elem.querySelector('textarea');
      elementData.type = 'textarea';
      elementData.placeholder = textareaElement.getAttribute('placeholder') || '';
    } else if (elem.querySelector('button')) {
      const buttonElement = elem.querySelector('button');
      elementData.type = 'button';
      elementData.text = buttonElement.textContent;
    }

    formData.elements.push(elementData);
  });

  let savedForms = JSON.parse(localStorage.getItem('forms')) || [];
  savedForms.push(formData);
  localStorage.setItem('forms', JSON.stringify(savedForms));

  alert('Form saved successfully!');
  renderSavedForms();
}
function renderSavedForms() {
  const savedFormsList = document.getElementById('savedFormsList');
  savedFormsList.innerHTML = '';

  const savedForms = JSON.parse(localStorage.getItem('forms')) || [];

  savedForms.forEach(form => {
    const listItem = document.createElement('li');
    listItem.textContent = form.heading;
    listItem.dataset.formId = form.id;
    listItem.addEventListener('click', () => previewForm(form));
    savedFormsList.appendChild(listItem);
  });
}

function previewForm(form) {
  const formBuilder = document.getElementById('form-builder');
  formBuilder.innerHTML = `<h2>${form.heading}</h2>`;

  form.elements.forEach(elem => {
    const elementContainer = document.createElement('div');
    elementContainer.classList.add('element-container');

    const label = document.createElement('label');
    label.textContent = `${elem.label}:`;

    let newElement;
    switch (elem.type) {
      case 'text':
        newElement = document.createElement('input');
        newElement.setAttribute('type', 'text');
        newElement.setAttribute('placeholder', elem.placeholder);
        break;
      case 'button':
        newElement = document.createElement('button');
        newElement.textContent = elem.text;
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
        newElement.setAttribute('placeholder', elem.placeholder);
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

    deleteButton.addEventListener('click', () => {
      elementContainer.remove();
    });
  });
}


addModalTemplate();
renderCont();

