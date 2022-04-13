const form = document.querySelector('form');
const errorsContent = document.querySelector('#error-message');
const successContent = document.querySelector('#success-message');

const errorsTypes = {
  empty: "Input must be filled out!",
  telLength: "Phone number is incorrect!",
  email: "@ required!",
  check: "You must accept the rules!",
};

// // przechwycenie i zbudowanie globalErrorsValues niezależnie od ilości inputów
let globalErrorsValues = [];
window.addEventListener("DOMContentLoaded", () => {
  const formElementsArray = [...form.elements];
  for (let i = 0; i < formElementsArray.length; i++) {
    globalErrorsValues.push({
      element: formElementsArray[i].name,
      listOfErrors: [],
    });
  }
});

// // STRUKTURA TABLICY OBIEKTÓW globalErrorsValues :
// let globalErrorsValues = [{
//   element: "userName",
//   listOfErrors: ["Input must be filled out!", "Incorrect type of data!"]
// },
// {
//   element: "email",
//   listOfErrors: ["Input must be filled out!", "Invalid type of email!"]
// }
//itd
// ];

// // funkcja checkIfErrorExist ma za zadanie sprawdzić czy blur input posiada w globalErrorsValues dany typ błędu
const checkIfErrorExist = (activeId, activeError) => {
  globalErrorsValues.forEach(formElement => {
    // console.log(
    //   `sprawdzam czy podany w funkcji element ${activeId} === ${formElement.element}`
    // );
    if (formElement.element === activeId) {
      // console.log(
      //   "element podany w funkcji jest równy sprawdzanemu elementowi"
      // );
      if (formElement.listOfErrors.includes(activeError)) {
        // console.log("zawiera activeError");
        return null;
      } else {
        // console.log("nie zawiera activeError");
        formElement.listOfErrors.push(activeError);
      }
    } else {
      return null;
    }
  });
};

const validation = (e) => {
  const activeElement = e.target;
  const indexInGlobalErr = globalErrorsValues.findIndex(
    (el) => el.element === activeElement.id
  );
  if ((!activeElement.value) && ((activeElement.type !== "checkbox") && (activeElement.type !== "submit"))) {
    vievError(activeElement, errorsTypes.empty, "empty", indexInGlobalErr);
    checkIfErrorExist(activeElement.id, errorsTypes.empty);
  } else if ((activeElement.value) && ((activeElement.type !== "checkbox") && (activeElement.type !== "submit"))) {
    globalErrorsValues[indexInGlobalErr].listOfErrors = [
      ...globalErrorsValues[indexInGlobalErr].listOfErrors.filter(
        (e) => e !== errorsTypes.empty
      ),
    ];
    hideError("empty", activeElement);
  }

  if (activeElement.type === "email" && !activeElement.value.includes("@")) {
    vievError(activeElement, errorsTypes.email, "email", indexInGlobalErr);
    checkIfErrorExist(activeElement.id, errorsTypes.email);
  } else if (
    activeElement.type === "email" &&
    activeElement.value.includes("@")
  ) {
    globalErrorsValues[indexInGlobalErr].listOfErrors = [
      ...globalErrorsValues[indexInGlobalErr].listOfErrors.filter(
        (e) => e !== errorsTypes.email
      ),
    ];
    hideError("email", activeElement);
  }
  if ((activeElement.type === "tel") && ((activeElement.value.length > 12) || (activeElement.value.length <= 6) || (isNaN(activeElement.value)))) {
    vievError(activeElement, errorsTypes.telLength, "tel", indexInGlobalErr);
    checkIfErrorExist(activeElement.id, errorsTypes.telLength);
  } else if ((activeElement.type === "tel") && ((!activeElement.value.length > 12) || (!activeElement.value.length <= 6))) {
    globalErrorsValues[indexInGlobalErr].listOfErrors = [
      ...globalErrorsValues[indexInGlobalErr].listOfErrors.filter(
        (e) => e !== errorsTypes.telLength
      ),
    ];
    hideError("tel", activeElement);
  }



};
// funkcja pokazująca czerwoną belke error w formularzu w przypadku błedu
const vievError = (element, error, atr, index) => {
  if (!globalErrorsValues[index].listOfErrors.includes(error)) {
    const p = document.createElement("p");
    p.textContent = error;
    p.classList.add("error-message");
    p.dataset.error = atr;
    element.parentElement.insertBefore(p, element);
  }
};

const hideError = (typeError, element) => {
  const errorElement = element.parentElement.querySelector(
    `[data-error="${typeError}"]`
  );
  if (errorElement) {
    errorElement.remove();
  }
};

// WALIDACJA FORMULARZA NA SUBMIT
// przechwycenie value inputów -> do wykorzystania przy walidacji on submit
const handleSubmit = (e) => {
  errorsContent.classList.add("d-none");
  successContent.classList.add("d-none");
  e.preventDefault();
  const values = {};
  for (let el of e.target) {
    if (el.name) {
      const value = el.type === "checkbox" ? "checked" : "value";
      values[el.name] = el[value];
    }
  }
  let errors = [];
  if (values.userName.length <= 2) {
    errors.push("Your name is too short");
  }
  if (values.surname.length <= 2) {
    errors.push("Your surname is too short");
  }
  if (!values.email.includes("@")) {
    errors.push("Email must have a sign @");
  }
  if ((isNaN(values.phone) || (values.phone.length <= 7))) {
    errors.push("Phone number is incorrect!");
  }
  if (!values.agree) {
    errors.push("You must accept the terms");
  }

  if (errors.length) {
    errorsContent.classList.remove("d-none");
    errorsContent.innerHTML = "";
    errors.forEach(function (err) {
      const p = document.createElement("p");
      p.textContent = err;
      errorsContent.appendChild(p);
    });
  }
  else {
    successContent.classList.remove("d-none");
    successContent.textContent = "The form has been sent!"
    for (let el of e.target) {
      el.value = "";
    }
    document.querySelector('#agree').checked = false;
    values.agree = false;
    console.log(values);
    const tableBody = document.querySelector('.users-container .container');
    const rowToClone = document.querySelector('.row.user-header');
    const newLine = rowToClone.cloneNode(true);
    newLine.classList.add('new-user');
    newLine.classList.remove('user-header');

    const btnDelete = document.createElement('button');
    btnDelete.classList.add("btn-delete");
    btnDelete.textContent = "delete";

    tableBody.appendChild(newLine);
    newLine.children[0].textContent = values.userName;
    newLine.children[1].textContent = values.surname;
    newLine.children[2].textContent = values.email;
    newLine.children[3].textContent = values.phone;
    newLine.appendChild(btnDelete);

    document.querySelectorAll(".new-user").forEach((row) => row.addEventListener("click", e => {
      const rowToDelete = e.currentTarget;
      if (e.target.classList.contains("btn-delete")) {
        rowToDelete.parentElement.removeChild(rowToDelete);
      }
    }
    ));
  }
}

document.querySelector(".form").addEventListener("submit", handleSubmit);
const formElements = Array.from(form.elements);
formElements.forEach((el) => el.addEventListener("blur", validation, true));
