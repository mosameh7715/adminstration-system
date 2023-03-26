/*LOGIN-REGISTER EVENTS*/
import {
  isUserNameValid,
  isUserPassValid,
  isFirstNameValid,
  isLastNameValid,
  isAddressValid,
  isEmailValid,
  isAgeValid,
} from "./login-register.js";

let usernameMsg = document.querySelector(".user-name");
let usernamePass = document.querySelector(".pass");
let fnameMsg = document.querySelector(".fname");
let lnameMsg = document.querySelector(".lname");
let addMsg = document.querySelector(".address");
let mailMsg = document.querySelector(".mail");
let ageMsg = document.querySelector(".age");

export function switchToSignUp(
  btn,
  selector1,
  selector2,
  selector3,
  selector4,
  selector5
) {
  btn.addEventListener("click", function () {
    selector1.classList.add("hidden");
    selector2.classList.remove("hidden");
    selector3.classList.add("text-decoration-underline", "text-light");
    selector5.classList.remove("text-decoration-underline");
    selector4.classList.remove("d-none");
  });
}

export function switchToSignIn(btn, selector1, selector2, selector3) {
  btn.addEventListener("click", function () {
    selector1.classList.remove("hidden");
    selector2.classList.add("hidden");
    selector3.classList.add("d-none");
  });
}

function valid(validFunc, input1, input2, message) {
  if (!validFunc()) {
    input1.style.border = "2px solid red";
    message.classList.remove("d-none");
  } else {
    input1.style.border = "2px solid green";
    message.classList.add("d-none");
    input2.focus();
  }
}

export function userNameBlurEvent(input1, input2) {
  input1.addEventListener("blur", function () {
    valid(isUserNameValid, input1, input2, usernameMsg);
  });
}

export function firstNameBlurEvent(input1, input2) {
  input1.addEventListener("blur", function () {
    valid(isFirstNameValid, input1, input2, fnameMsg);
  });
}

export function lastNameBlurEvent(input1, input2) {
  input1.addEventListener("blur", function () {
    valid(isLastNameValid, input1, input2, lnameMsg);
  });
}

export function addressBlurEvent(input1, input2) {
  input1.addEventListener("blur", function () {
    valid(isAddressValid, input1, input2, addMsg);
  });
}

export function emailBlurEvent(input1, input2) {
  input1.addEventListener("blur", function () {
    valid(isEmailValid, input1, input2, mailMsg);
  });
}

export function ageBlurEvent(input) {
  input.addEventListener("blur", function () {
    if (!isAgeValid()) {
      input.style.border = "2px solid red";
      ageMsg.classList.remove("d-none");
    } else {
      input.style.border = "2px solid green";
      ageMsg.classList.add("d-none");
    }
  });
}
export function passBlurEvent(input) {
  input.addEventListener("blur", function () {
    if (!isUserPassValid()) {
      input.style.border = "2px solid red";
      usernamePass.classList.remove("d-none");
    } else {
      input.style.border = "2px solid green";
      usernamePass.classList.add("d-none");
    }
  });
}

export function signUpRegister(btn, callBack) {
  btn.addEventListener("click", callBack);
}

export function signInRegister(btn, callBack) {
  btn.addEventListener("click", callBack);
}
