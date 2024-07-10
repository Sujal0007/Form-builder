// export function saveForm() {
//     const formHeading = document.getElementById('formHeading').value;

//     if (!formHeading) {
//         alert('Form heading is required');
//         return;
//     }
//     const formBuilder = document.getElementById('form-builder');
//     const formElements = formBuilder.querySelectorAll('.element-container');
//     const formId = `form-${Date.now()}`;
//     const formData = { id: formId, heading: formHeading, elements: [] };

//     formElements.forEach(function (elem) {
//         const elementData = {};
//         if (elem.querySelector('label')) {
//             elementData.label = elem.querySelector('label').textContent.replace(':', '');
//         }
//         if (elem.querySelector('input')) {
//             const inputElement = elem.querySelector('input');
//             elementData.type = inputElement.type;
//             elementData.placeholder = inputElement.getAttribute('placeholder') || '';
//         } else if (elem.querySelector('textarea')) {
//             const textareaElement = elem.querySelector('textarea');
//             elementData.type = 'textarea';
//             elementData.placeholder = textareaElement.getAttribute('placeholder') || '';
//         } else if (elem.querySelector('button')) {
//             const buttonElement = elem.querySelector('button');
//             elementData.type = 'button';
//             elementData.text = buttonElement.textContent;
//         }

//         formData.elements.push(elementData);
//     });

//     let savedForms = JSON.parse(localStorage.getItem('forms')) || [];
//     savedForms.push(formData);
//     localStorage.setItem('forms', JSON.stringify(savedForms));

//     alert('Form saved successfully!');
//     // renderSavedForms();
// }

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

        if (elem.querySelector('input[type="text"]')) {
            const inputElement = elem.querySelector('input[type="text"]');
            elementData.type = 'input';
            elementData.value = inputElement.value;
        } else if (elem.querySelector('textarea')) {
            const textareaElement = elem.querySelector('textarea');
            elementData.type = 'textarea';
            elementData.value = textareaElement.value;
        } else if (elem.querySelector('button')) {
            const buttonElement = elem.querySelector('button');
            elementData.type = 'button';
            elementData.value = buttonElement.textContent;
        } else if (elem.querySelector('input[type="radio"]')) {
            const radioElement = elem.querySelector('input[type="radio"]');
            elementData.type = 'radio';
            elementData.options = [];

            const radioLabels = elem.querySelectorAll('label');
            radioLabels.forEach(label => {
                if (label.textContent) {
                    elementData.options.push(label.textContent);
                }
            });
        } else if (elem.querySelector('input[type="checkbox"]')) {
            const checkboxElement = elem.querySelector('input[type="checkbox"]');
            elementData.type = 'checkbox';
            elementData.options = [];

            const checkboxLabels = elem.querySelectorAll('label');
            checkboxLabels.forEach(label => {
                if (label.textContent) {
                    elementData.options.push(label.textContent);
                }
            });
        }

        formData.elements.push(elementData);
    });

    let savedForms = JSON.parse(localStorage.getItem('forms')) || [];
    savedForms.push(formData);
    localStorage.setItem('forms', JSON.stringify(savedForms));

    alert('Form saved successfully!');
}
