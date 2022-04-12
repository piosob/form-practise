const errorsTypes = {
  empty: "Input must be filled out!",
  wrongType: "Incorrect type of data!",
  number: "Number required!",
  numberLength: "Phone number is incorrect!",
  email: "@ required!",
  check: "You must accept the rules!",
};

// window.addEventListener("DOMContentLoaded", () => {
//   const form = document.querySelector("form");
//   const formElements = Array.from(form.elements);
//   // inputs = document.querySelectorAll("input");

//   formElements.forEach((el) => {
//     el.onblur = validate;
//     // el.oninvalid = onInvalid;
//   });
// });

// function onInvalid(e) {
//   console.log(e.target);
// }

// function validate(e) {
//   const element = e.target;
//   console.log("element", element.validity);
//   const isValid = element.validity.valid;

//   if (!isValid) {
//     showError(element);
//   } else {
//     removeError(element);
//   }
// }

// function showError(element) {
//   console.log("element error", element.validity);
//   if (element.validity.valueMissing) {
//     const errorElement = element.parentElement.querySelector(".error-message");

//     if (!errorElement) {
//       createErrorElement(element, errorsTypes.empty);
//     }
//   }
// }

// function removeError(element) {
//   const errorElement = element.parentElement.querySelector(".error-message");
//   errorElement.remove();
// }

// function createErrorElement(element, error) {
//   const p = document.createElement("p");
//   p.textContent = error;
//   p.classList.add("error-message");
//   element.parentElement.insertBefore(p, element);
// }

// // przechwycenie i zbudowanie globalErrorsValues niezależnie od ilości inputów
let globalErrorsValues = [];
window.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".form");
  const formElementsArray = [...form.elements];

  for (let i = 0; i < formElementsArray.length; i++) {
    globalErrorsValues.push({
      element: formElementsArray[i].name,
      listOfErrors: [],
    });
  }
  // console.log(globalErrorsValues);
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
  globalErrorsValues.forEach((formElement, index) => {
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
      // console.log(
      //   "element podany w funkcji nie jest równy sprawdzanemu elementowi"
      // );
    }
  });
};

// chcialem walidację zrobić w jednej funkcji validation (bo nasłuchuje na blur cały formularz - miało być uniwersalnie niezależnie od ilości inputów ale jest problem z instrukcjami warunkowymi bo chciałem w obrębie jednej funkcji zrobić kilka razy if -> else. A else działa dla każdego innego warunku. Jest problem bo usuniecie błedu w jednym inpucie usuwa błedy w innym inpucie -przez else. Jak to zrobić?else if nie może być bo podaje konkretne errorsTypes.(np)empty)
const validation = (e) => {
  const activeElement = e.target;
  const indexInGlobalErr = globalErrorsValues.findIndex(
    (el) => el.element === activeElement.id
  );
  if (!activeElement.value) {
    vievError(activeElement, errorsTypes.empty, "empty", indexInGlobalErr);
    checkIfErrorExist(activeElement.id, errorsTypes.empty);
  } else if (activeElement.value) {
    globalErrorsValues[indexInGlobalErr].listOfErrors = [
      ...globalErrorsValues[indexInGlobalErr].listOfErrors.filter(
        (e) => e !== errorsTypes.empty
      ),
    ];
    console.log("globalErrorsValues", globalErrorsValues);
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

// przechwycenie value inputów -> do wykorzystania przy walidacji on submit
const addUser = (e) => {
  e.preventDefault();
  const values = {};
  for (let el of e.target) {
    if (el.name) {
      const value = el.type === "checkbox" ? "checked" : "value";
      values[el.name] = el[value];
    }
  }
};

const hideError = (typeError, element) => {
  console.log("typeError", typeError);
  console.log("element", element);
  const errorElement = element.parentElement.querySelector(
    `[data-error="${typeError}"]`
  );
  if (errorElement) {
    errorElement.remove();
  }
};

const deleteRow = (e) => {
  const rowToDelete = e.currentTarget;
  if (e.target.classList.contains("btn-delete")) {
    rowToDelete.parentElement.removeChild(rowToDelete);
  }
};

document.querySelector(".form").addEventListener("submit", addUser);
const form = document.querySelector(".form");
const formElements = Array.from(form.elements);
formElements.forEach((el) => el.addEventListener("blur", validation, true));
document
  .querySelectorAll(".new-user")
  .forEach((row) => row.addEventListener("click", deleteRow));
