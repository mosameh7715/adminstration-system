import {
  switchToSignUp,
  switchToSignIn,
  userNameBlurEvent,
  firstNameBlurEvent,
  lastNameBlurEvent,
  addressBlurEvent,
  emailBlurEvent,
  ageBlurEvent,
  passBlurEvent,
  signUpRegister,
  signInRegister,
} from "./events.js";

import {
  getData,
  getDataCurrent,
  postBending,
  postCurrentLoged,
  removeLogedIn,
} from "./crudOperations.js";

//SELECTORS
let signUpBtn1 = document.querySelector(".sign-up1");
let signUpBtn2 = document.querySelector(".sign-up2");
let signInBtn1 = document.querySelector(".sign-in1");
let signInBtn2 = document.querySelector(".sign-in2");
let containerOne = document.querySelector("body >form:nth-child(1) > div");
let containerTwo = document.querySelector("body >form:nth-child(2) > div");
let bending = document.querySelector(".bending");
let form2 = document.querySelector(".form-2");
let notAuth = document.querySelector(".not-authenticated");
let notAuthEmail = document.querySelector(".not-authenticated-email");

let userName = document.querySelector(
  "body >form > div> section > article > nav:nth-child(1) > input"
);

let userPass = document.querySelector(
  "body >form > div> section > article > nav:nth-child(2) > input"
);
let firstName = document.querySelector(
  "body >form:nth-child(2) > div> section > article > nav:nth-child(1) > input"
);
let lastName = document.querySelector(
  "body >form:nth-child(2) > div> section > article > nav:nth-child(2) > input"
);
let address = document.querySelector(
  "body >form:nth-child(2) > div> section > article > nav:nth-child(3) > input"
);
let email = document.querySelector(
  "body >form:nth-child(2) > div> section > article > nav:nth-child(4) > input"
);
let age = document.querySelector(
  "body >form:nth-child(2) > div> section > article > nav:nth-child(5) > input"
);

let signIn = document.querySelector(
  "body >form > div:nth-child(1) > section > article > input"
);

let signUp = document.querySelector(
  "body >form:nth-child(2) > div > section > article > input"
);

let signInSelectorsArray = [userName, userPass];
let signInFunctionsArray = [isUserNameValid, isUserPassValid];
let signUpSelectorsArray = [firstName, lastName, address, email, age];
let signUpFunctionsArray = [
  isFirstNameValid,
  isLastNameValid,
  isAddressValid,
  isEmailValid,
  isAgeValid,
];

///////////////////////~IMPORTANT!!!!!!!!~///////////////////////////

let adminUserName = "admin_999";
let adminPassword = "iti@123";

////////////////////////////////////////////////////////////////////
//FUNCTIONS
export function isUserNameValid() {
  var userpattern = /(^[a-zA-Z]+)+([_])+([0-9]{1,3})$/;
  return userName.value.match(userpattern);
}

export function isUserPassValid() {
  var userpattern = /(^[a-zA-Z]+)+(@)+([0-9]{2,3})$/;
  return userPass.value.match(userpattern);
}
export function isFirstNameValid() {
  var userpattern = /^[a-zA-Z]{3,10}$/;
  return firstName.value.match(userpattern);
}
export function isLastNameValid() {
  var userpattern = /^[a-zA-Z]{3,10}$/;
  return lastName.value.match(userpattern);
}
export function isAddressValid() {
  var userpattern = /(^[a-zA-Z]{3,20}\s)+([a-zA-Z]{3,20})$/;
  return address.value.match(userpattern);
}
export function isEmailValid() {
  var userpattern =
    /(^[a-zA-Z]{3,15})+([0-9]{1,6})+(@)+([a-zA-Z]{3,10})+([.])+([a-zA-Z]{3})$/;
  return email.value.match(userpattern);
}

export function isAgeValid() {
  var userpattern = /(^[0-9]{2})$/;
  return age.value.match(userpattern);
}

/*GENERAL VALIDATION FUNCTION*/

/*FINAL VALIDATION FUNCTION*/
function checkFinalValidation(functionArray, selectorArray) {
  for (let i = 0; i < functionArray.length; i++) {
    if (!functionArray[i]()) {
      selectorArray[i].style.border = "2px solid red";
    }
  }
}

///////////////////////////////////////////////////////////////
// EVENTS
switchToSignUp(
  signUpBtn1,
  containerOne,
  containerTwo,
  signUpBtn2,
  form2,
  signInBtn2
);

switchToSignIn(signInBtn2, containerOne, containerTwo, form2);

//////////////////////////////////////////////////////////////////////////////
userNameBlurEvent(userName, userPass);

firstNameBlurEvent(firstName, lastName);

lastNameBlurEvent(lastName, address);

addressBlurEvent(address, email);

emailBlurEvent(email, age);

ageBlurEvent(age);

passBlurEvent(userPass);

/*FINAL VALIDATION FUNCTION*/ /*When User click sign IN*/

signInRegister(signIn, signIntoProfile);
let flag1 = 1;
async function signIntoProfile(e) {
  for (let i = 0; i < signInFunctionsArray.length; i++) {
    if (!signInFunctionsArray[i]()) {
      e.preventDefault();
      checkFinalValidation(signInFunctionsArray, signInSelectorsArray);
      flag1 = 0;
      break;
    }
  }
  if (flag1) {
    checkAuthentication();
  }
}

//Check Authentication On login
async function checkAuthentication() {
  let flag = 1;
  let empData = await getDataCurrent();
  for (let emp of empData) {
    if (emp.userName == userName.value && emp.password == userPass.value) {
      sessionStorage.setItem("emp", JSON.stringify(emp));
      notAuth.classList.add("d-none");

      if (emp.title == "employee") {
        await removeLogedIn(1);
        await postCurrentLoged(emp);
        window.close("", "_self");
        window.open("./html/employee.html");
        // console.log(emp);
      } else {
        sessionStorage.setItem("emp", JSON.stringify(emp));
        await removeLogedIn(1);
        await postCurrentLoged(emp);
        window.close("", "_self");
        window.open("./html/security.html");
        // console.log(emp);
      }

      flag = 0;
      break;
    }
  }
  //admin logged-in
  if (userName.value == adminUserName && userPass.value == adminPassword) {
    sessionStorage.setItem("admin", JSON.stringify({ title: "admin" }));
    window.close("", "_self");
    window.open("./html/admin.html");
    flag = 0;
  }
  if (flag) {
    notAuth.classList.remove("d-none");
  }
}

/*FINAL VALIDATION FUNCTION*/ /*When User click sign UP*/
signUpRegister(signUp, postDataToPending);
let flag = 1;

// signUp.addEventListener("click", postDataToPending);
async function postDataToPending(e) {
  for (let i = 0; i < signUpFunctionsArray.length; i++) {
    if (!signUpFunctionsArray[i]()) {
      e.preventDefault();
      checkFinalValidation(signUpFunctionsArray, signUpSelectorsArray);
      flag = 0;
      break;
    }
  }
  if (flag) {
    checkAuthenticationEmail();
  }
}

//Check Authentication On Email
async function checkAuthenticationEmail() {
  let flag = 1;
  let empData = await getData();
  let currentEmpData = await getDataCurrent();
  let concatedArray = empData.concat(currentEmpData);
  for (let emp of concatedArray) {
    if (emp.email == email.value) {
      notAuthEmail.classList.remove("d-none");
      flag = 0;
      break;
    }
  }
  if (flag) {
    postBending(
      firstName.value,
      lastName.value,
      address.value,
      email.value,
      age.value
    );

    notAuthEmail.classList.add("d-none");
    window.open("./html/waitingToConfirm.html", "_self");
  }
}
