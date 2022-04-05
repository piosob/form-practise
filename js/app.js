
const addUser = e => {
  e.preventDefault();
  const values = {};
  console.log(e);
  for (let el of e.target) {
    if (el.name) {
      const value = el.type === "checkbox" ? "checked" : "value";
      values[el.name] = el[value];

    }
  }
  console.log(values);

}

const deleteRow = e => {
  const rowToDelete = e.currentTarget;
  if (e.target.classList.contains("btn-delete")) {
    rowToDelete.parentElement.removeChild(rowToDelete)
  }
}
const errors = [];

const vievError = (element, error) => {
  const p = document.createElement('p');
  p.textContent = error
  p.classList.add("error-message");
  p.dataset.error = "empty-value";
  element.parentElement.insertBefore(p, element);
}
hideError = () => {
  document.querySelectorAll('[data-error="empty-value"]').forEach(element => element.classList.add("d-none"));
}

// skończyłeś tutaj na walidacji
const validation = e => {
  const activeElement = e.target;
  const spanDesc = activeElement.previousElementSibling.textContent.toLowerCase().slice(0, -1);
  console.log(spanDesc);
  if (activeElement.type === "text") {
    if (!activeElement.value) {
      errors.push(`pole ${spanDesc} nie może być puste!`)
      vievError(activeElement, "pole nie może być puste");
    }
    if (activeElement.value.length > 12) {
      errors.push(`pole ${spanDesc} nie może mieć więcej niż 10 znaków!`)
      vievError(activeElement, "pole nie może mieć więcej niż 10 znaków!");
    }
    else {
      hideError();
    }
  }

  if ((activeElement.type === "email") && (!activeElement.value.includes("@"))) {
    errors.push(`pole ${spanDesc} musi posiadać @!`)
    vievError(activeElement, "pole musi posiadać @!");
  }
  else {
    hideError();
  }

}

document.querySelector('.form').addEventListener("submit", addUser);
document.querySelector('.form').addEventListener("blur", validation, true);
document.querySelectorAll('.new-user').forEach(row => row.addEventListener("click", deleteRow))
