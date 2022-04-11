const errorsTypes = {
  empty: "Input must be filled out!",
  wrongType: "Incorrect type of data!",
  number: "Number required!",
  numberLength: "Phone number is incorrect!",
  email: "@ required!",
  check: "You must accept the rules!",
}

// przechwycenie i zbudowanie globalErrorsValues niezależnie od ilości inputów
let globalErrorsValues = [];
window.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.form');
  const formElementsArray = [...form.elements];

  for (let i = 0; i < formElementsArray.length; i++) {
    globalErrorsValues.push({
      element: formElementsArray[i].name,
      listOfErrors: [],
    })
  }
  console.log(globalErrorsValues);
});

// STRUKTURA TABLICY OBIEKTÓW globalErrorsValues :
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


// funkcja checkIfErrorExist ma za zadanie sprawdzić czy blur input posiada w globalErrorsValues dany typ błędu
const checkIfErrorExist = (activeId, activeError) => {
  globalErrorsValues.forEach((formElement, index) => {
    console.log(`sprawdzam czy podany w funkcji element ${activeId} === ${formElement.element}`);
    if (formElement.element === activeId) {
      console.log("element podany w funkcji jest równy sprawdzanemu elementowi");
      if (formElement.listOfErrors.includes(activeError)) {
        console.log("zawiera activeError");
        return null;
      } else {
        console.log("nie zawiera activeError");
        formElement.listOfErrors.push(activeError)
      }
    }
    else { console.log("element podany w funkcji nie jest równy sprawdzanemu elementowi"); }
  })
}

// chcialem walidację zrobić w jednej funkcji validation (bo nasłuchuje na blur cały formularz - miało być uniwersalnie niezależnie od ilości inputów ale jest problem z instrukcjami warunkowymi bo chciałem w obrębie jednej funkcji zrobić kilka razy if -> else. A else działa dla każdego innego warunku. Jest problem bo usuniecie błedu w jednym inpucie usuwa błedy w innym inpucie -przez else. Jak to zrobić?else if nie może być bo podaje konkretne errorsTypes.(np)empty)
const validation = e => {
  const activeElement = e.target;
  const indexInGlobalErr = globalErrorsValues.findIndex(el => el.element === activeElement.id);
  if (!activeElement.value) {
    vievError(activeElement, errorsTypes.empty, "empty", indexInGlobalErr);
    checkIfErrorExist(activeElement.id, errorsTypes.empty);
  }
  else {
    globalErrorsValues[indexInGlobalErr].listOfErrors = [...globalErrorsValues[indexInGlobalErr].listOfErrors.filter(e => e !== errorsTypes.empty)];
    hideError("empty");
  }

  if (activeElement.type === "email" && !activeElement.value.includes('@')) {
    vievError(activeElement, errorsTypes.email, "email", indexInGlobalErr);
    checkIfErrorExist(activeElement.id, errorsTypes.email);

  }
  else {
    globalErrorsValues[indexInGlobalErr].listOfErrors = [...globalErrorsValues[indexInGlobalErr].listOfErrors.filter(e => e !== errorsTypes.email)];
    hideError("email");
  }

}
// funkcja pokazująca czerwoną belke error w formularzu w przypadku błedu
const vievError = (element, error, atr, index) => {
  if (!globalErrorsValues[index].listOfErrors.includes(error)) {
    const p = document.createElement('p');
    p.textContent = error;
    p.classList.add("error-message");
    p.dataset.error = atr;
    element.parentElement.insertBefore(p, element);
  }
}


// przechwycenie value inputów -> do wykorzystania przy walidacji on submit
const addUser = e => {
  e.preventDefault();
  const values = {};
  for (let el of e.target) {
    if (el.name) {
      const value = el.type === "checkbox" ? "checked" : "value";
      values[el.name] = el[value];
    }
  }
}

hideError = (typeError) => {
  document.querySelectorAll(`[data-error="${typeError}"]`).forEach(element => element.classList.add("d-none"));
}



const deleteRow = e => {
  const rowToDelete = e.currentTarget;
  if (e.target.classList.contains("btn-delete")) {
    rowToDelete.parentElement.removeChild(rowToDelete)
  }
}

document.querySelector('.form').addEventListener("submit", addUser);
document.querySelector('.form').addEventListener("blur", validation, true);
document.querySelectorAll('.new-user').forEach(row => row.addEventListener("click", deleteRow));
