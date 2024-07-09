export function addModalTemplate() {
    const modTemp = `
        <div id="editModal" class="modal">
          <div class="modal-content">
            <span class="close">X</span>
            <div id="modalForm"></div>
            <button id="saveButton">Save</button>
          </div>
        </div>
    `;
    document.body.innerHTML += modTemp;
}

export function openModal(element) {
    const modal = document.querySelector('#editModal');
    const modalForm = document.querySelector('#modalForm');
    const saveButton = document.querySelector('#saveButton');
    const closeButton = document.querySelector('.close');

    const inputElement = element.querySelector('input');
    const textareaElement = element.querySelector('textarea');
    const buttonElement = element.querySelector('button:not(.edit-button):not(.delete-button)');
    const radioElement = element.querySelector('input[type="radio"]');
    const checkboxElement = element.querySelector('input[type="checkbox"]');

    let type = '';
    if (radioElement) {
        type = 'radio';
    } else if (checkboxElement) {
        type = 'checkbox';
    } else if (inputElement) {
        type = inputElement.type !== 'radio' && inputElement.type !== 'checkbox' ? 'input' : inputElement.type;
    } else if (textareaElement) {
        type = 'textarea';
    } else if (buttonElement) {
        type = 'button';
    }

    const label = element.querySelector('label').textContent.replace(':', '');
    let modalProp = `
        <label for="elementLabel">Label:</label>
        <input type="text" id="elementLabel" value="${label}"><br>
    `;

    if (type === 'input') {
        modalProp += `
            <label for="inputPlaceholder">Placeholder:</label>
            <input type="text" id="inputPlaceholder" value="${inputElement.getAttribute('placeholder') || ''}"><br>
        `;
    } else if (type === 'button') {
        modalProp += `
            <label for="buttonText">Text:</label>
            <input type="text" id="buttonText" value="${buttonElement.textContent}"><br>
        `;
    } else if (type === 'textarea') {
        modalProp += `
            <label for="textareaPlaceholder">Placeholder:</label>
            <input type="text" id="textareaPlaceholder" value="${textareaElement.getAttribute('placeholder') || ''}"><br>
        `;
    } else if (type === 'radio' || type === 'checkbox') {
        modalProp += `
            <button id="addOptionButton" type="button">Add Options</button>
            <div id="optionsContainer"></div>
        `;
    }

    modalForm.innerHTML = modalProp;
    modal.style.display = 'block';

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    saveButton.onclick = () => {
        element.querySelector('label').textContent = `${document.getElementById('elementLabel').value}:`;

        if (type === 'input') {
            inputElement.setAttribute('placeholder', document.getElementById('inputPlaceholder').value);
        } else if (type === 'button') {
            buttonElement.textContent = document.getElementById('buttonText').value;
        } else if (type === 'textarea') {
            textareaElement.setAttribute('placeholder', document.getElementById('textareaPlaceholder').value);
        } else if (type === 'radio' || type === 'checkbox') {
            const newOptionInputs = modalForm.querySelectorAll('.option-input');

            const optionsArray = [];

            newOptionInputs.forEach(input => {
                const optionLabel = document.createElement('label');
                optionLabel.textContent = input.value;

                const optionInput = document.createElement('input');
                optionInput.setAttribute('type', type);
                optionInput.setAttribute('name', element.querySelector('input').getAttribute('name'));

                element.appendChild(optionInput);
                element.appendChild(optionLabel);
                element.appendChild(document.createElement('br'));

                optionsArray.push(input.value);
            });

            localStorage.setItem(`${element.querySelector('label').textContent.trim()}-options`, JSON.stringify(optionsArray));
        }

        modal.style.display = 'none';
    };

    if (type === 'radio' || type === 'checkbox') {
        const addOptionButton = document.getElementById('addOptionButton');
        addOptionButton.addEventListener('click', () => {
            const newOptionInput = document.createElement('input');
            newOptionInput.setAttribute('type', 'text');
            newOptionInput.classList.add('option-input');
            newOptionInput.setAttribute('placeholder', 'New Option');
            const optionsContainer = document.getElementById('optionsContainer');
            optionsContainer.appendChild(newOptionInput);
            optionsContainer.appendChild(document.createElement('br'));
        });
    }
}

