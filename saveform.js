export function saveForm() {
  const formHeading = document.getElementById("formHeading").value;

  if (!formHeading) {
    alert("Form heading is required");
    return;
  }
  const formBuilder = document.getElementById("form-builder");
  const formElements = formBuilder.querySelectorAll(".element-container");
  const formId = `form-${Date.now()}`;
  const formData = { id: formId, heading: formHeading, elements: [] };

  formElements.forEach(function (elem) {
    const elementData = {};
    if (elem.querySelector("label")) {
      elementData.label = elem.querySelector("label").textContent.replace(":", "");
    }
    if (elem.querySelector("input")) {
      const inputElement = elem.querySelector("input");
      elementData.type = inputElement.type;
      elementData.placeholder = inputElement.getAttribute("placeholder") || "";
      if (inputElement.type === "radio" || inputElement.type === "checkbox") {
        const options = [];
        const optionLabels = elem.querySelectorAll("label");
        optionLabels.forEach((label) => {
          options.push(label.textContent);
        });
        elementData.options = options;
      }
    } else if (elem.querySelector("textarea")) {
      const textareaElement = elem.querySelector("textarea");
      elementData.type = "textarea";
      elementData.placeholder = textareaElement.getAttribute("placeholder") || "";
    } else if (elem.querySelector("button")) {
      const buttonElement = elem.querySelector("button");
      elementData.type = "button";
      elementData.text = buttonElement.textContent;
    }

    formData.elements.push(elementData);
  });

  let savedForms = JSON.parse(localStorage.getItem("forms")) || [];
  savedForms.push(formData);
  localStorage.setItem("forms", JSON.stringify(savedForms));

  alert("Form saved successfully!");
}
