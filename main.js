import './style.css'
import "@fortawesome/fontawesome-free/css/all.css";
import { openModal, addModalTemplate } from './modal.js';
import { saveForm, renderSavedForms } from './saveform.js';

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

  deleteButton.addEventListener('click', function() {
    const formId = elementContainer.parentElement.dataset.formId;
    elementContainer.remove();
    removeFromLocalStorage(formId);
});

function removeFromLocalStorage(formId) {
    let savedForms = JSON.parse(localStorage.getItem('forms')) || [];
    savedForms = savedForms.filter(function(form) {
        return form.id !== formId;
    });
    localStorage.setItem('forms', JSON.stringify(savedForms));
}

}




addModalTemplate();
renderCont();

