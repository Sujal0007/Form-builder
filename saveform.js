import { openModal } from './modal.js';

export function saveForm() {
    const formHeading = document.getElementById('formHeading').value;

    if (!formHeading) {
        alert('Form heading is required');
        return;
    }
    const formBuilder = document.getElementById('form-builder');
    const formElements = formBuilder.querySelectorAll('.element-container');
    const formId = `form-${Date.now()}`;
    const formData = { id: formId, heading: formHeading, elements: [] };

    formElements.forEach(function (elem) {
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

export function renderSavedForms() {
    const savedFormsList = document.getElementById('savedFormsList');
    savedFormsList.innerHTML = '';

    const savedForms = JSON.parse(localStorage.getItem('forms')) || [];

    savedForms.forEach(function (form) {
        const listItem = document.createElement('li');
        listItem.textContent = form.heading;
        listItem.dataset.formId = form.id;
        listItem.classList.add('saved-forms')
        listItem.addEventListener('click', function () {
            renderForm(form);
        });
        savedFormsList.appendChild(listItem);
    });
}

function renderForm(form) {
    const formBuilder = document.getElementById('form-builder');
    formBuilder.innerHTML = `<h2>${form.heading}</h2>`;~

    form.elements.forEach(function (elem) {
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

        editButton.addEventListener('click', function () {
            openModal(elementContainer);
        });

        deleteButton.addEventListener('click', function() {
            elementContainer.remove();
        });
    });
}