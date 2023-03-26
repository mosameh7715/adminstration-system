import {
  getData,
  getDataOne,
  postNewEmp,
  removeBending,
  getDataCurrent,
  getDataOneCurr,
  sendEmail,
} from "./crudOperations.js";

//SELECTORS
let tablePending = document.querySelector(".pending-table-body");
let dailyTable = document.querySelector(".daily-table-body");
let empReports = document.querySelector(".report-table-body");
let empSpecific = document.querySelector(".specific-table-body");
let btnDate = document.querySelector(".date-check");
let btnBack = document.querySelector(".date-back");
let startDate = document.querySelector(".start-date");
let endDate = document.querySelector(".end-date");
let msgSpan = document.querySelector(".msg-span");
let btnNew = document.querySelector(".new-app"); //btn1
let btnCurr = document.querySelector(".curr-emp"); //btn2
let btnDay = document.querySelector(".day-attend"); //btn3
let logOutBtn = document.querySelector(".logOut");
let divNew = document.querySelector(".div-new"); //div1
let divRepo = document.querySelector(".div-repo"); //div2
let divSpecific = document.querySelector(".div-specific"); //div3
let divCurr = document.querySelector(".div-curr"); //div4

//check URL
function checkTitle() {
  if (!sessionStorage.getItem("admin")) {
    alert("Not Authorized");
    location.assign("../home.html");
  } else if (!JSON.parse(sessionStorage.getItem("admin")).title == "title") {
    alert("Not Authorized");
    location.assign("../home.html");
  }
}
checkTitle();

//PENDING EMPLOYEE
async function createPendingEmpTable() {
  let empArray = await getData();
  empArray.forEach(function (emp, index) {
    let tr = document.createElement("tr");
    let tds = `<td class="text-center">${index + 1}</td>
             <td class="text-center">${emp.firstName}</td>
             <td class="text-center">${emp.lastName}</td>
             <td class="text-center">${emp.address}</td>
             <td class="text-center">${emp.email}</td>
             <td class="text-center">${emp.age}</td>
             <td class="text-center"><button class="btn btn-close" onClick="removeBending(${
               emp.id
             })"></button></td>
             <td class="text-center"><button class="btn btn-success" onClick="addToEmp(${
               emp.id
             })" >Employee</button></td>
             <td class="text-center"> <button class="btn btn-dark" onClick="addToSec(${
               emp.id
             })">security</button></td>`;
    tr.innerHTML = tds;
    tablePending.appendChild(tr);
  });
  $("#pending-employee").DataTable({
    responsive: true,
    autoWidth: false,
  });
}
createPendingEmpTable();
//CURRENT EMPLOYEE
async function createCurrentEmpTable() {
  let empArray = await getDataCurrent();
  for (let emp of empArray) {
    if (emp.attendence.length != 0) {
      let tr = document.createElement("tr");
      let tds = `<td class="text-center">${emp.id}</td>
        <td class="text-center">${emp.firstName}</td>
        <td class="text-center">${emp.lastName}</td>
        <td class="text-center">${emp.title}</td>
        <td class="text-center">${
          emp.attendence[emp.attendence.length - 1].punchInDate
        }</td>
        <td class="text-center">${
          emp.attendence[emp.attendence.length - 1].punchInTime
        }</td>
        <td class="text-center">${
          emp.attendence[emp.attendence.length - 1].punchOutDate
        }</td>
        <td class="text-center">${
          emp.attendence[emp.attendence.length - 1].punchOutTime
        }</td>
        <td class="text-center">${
          emp.attendence[emp.attendence.length - 1].late
        }</td>
        <td class="text-center">${
          emp.attendence[emp.attendence.length - 1].absence
        }</td>`;
      tr.innerHTML = tds;
      dailyTable.appendChild(tr);
    }
  }

  $("#daily-employee").DataTable({
    responsive: true,
    autoWidth: false,
  });
}

//DISPLAY EMP REPORTS

async function displayAllEmployee() {
  let empArray = await getDataCurrent();

  for (let emp of empArray) {
    let tr = document.createElement("tr");
    let tds = `<td class="text-center">${emp.id}</td>
               <td class="text-center">${emp.firstName}</td>
               <td class="text-center">${emp.lastName}</td>
               <td class="text-center">${emp.address}</td>
               <td class="text-center">${emp.email}</td>
               <td class="text-center">${emp.age}</td>
               <td class="text-center">${emp.title}</td>
               <td class="text-center"><button class="btn btn-success" onClick="displayReport(${emp.id})">display</button></td>`;
    tr.innerHTML = tds;
    empReports.appendChild(tr);
  }
  $("#report-employee").DataTable({ responsive: true, autoWidth: false });
}

//Display spcific employee attendence data
export async function displayReport(_id) {
  $("#report-employee").DataTable().clear().destroy();
  divRepo.classList.add("d-none");
  divSpecific.classList.remove("d-none");
  let specificEmp = await getDataOneCurr(_id);
  for (let i = 0; i < specificEmp.attendence.length; i++) {
    let tr = document.createElement("tr");
    let tds = `<td class="text-center">${i + 1}</td>
    <td class="text-center">${specificEmp.attendence[i].punchInDate}</td>
    <td class="text-center">${specificEmp.attendence[i].punchInTime}</td>
    <td class="text-center">${specificEmp.attendence[i].punchOutDate}</td>
    <td class="text-center">${specificEmp.attendence[i].punchOutTime}</td>
    <td class="text-center">${specificEmp.attendence[i].late}</td>
    <td class="text-center">${specificEmp.attendence[i].absence}</td>`;
    tr.innerHTML = tds;
    empSpecific.appendChild(tr);
  }
  biChartAbsence(specificEmp.id);
  $("#specific-employee").DataTable({ responsive: true, autoWidth: false });
  btnDate.addEventListener("click", function () {
    let start = new Date(startDate.value).toLocaleDateString();
    let end = new Date(endDate.value).toLocaleDateString();
    let tdds = document.querySelectorAll(
      ".specific-table-body >tr>td:nth-child(2)"
    );
    for (let i = 0; i < tdds.length; i++) {
      if (start == "Invalid Date" || end == "Invalid Date") {
        msgSpan.classList.remove("d-none");
      } else if (
        new Date(tdds[i].innerText) < new Date(start) ||
        new Date(tdds[i].innerText) > new Date(end)
      ) {
        msgSpan.classList.add("d-none");
        tdds[i].parentElement.style.display = "none";
      }
    }
  });
}

/*ADD TO EMPLOYEE/SEND MAIL*/
/************************************** */
export async function addToEmp(_id) {
  let arrID = await getDataOne(_id);

  let randomUser = await createUniqueUser(arrID.firstName);
  let passUser = createRandomPass(arrID.lastName);

  await sendEmail(
    arrID.firstName,
    arrID.lastName,
    arrID.email,
    randomUser,
    passUser
  );
  postNewEmp(
    arrID.firstName,
    arrID.lastName,
    arrID.address,
    arrID.email,
    arrID.age,
    randomUser,
    passUser,
    "employee"
  );

  removeBending(_id);
} //end of emp
/************************************** */

/*ADD TO SECURITY/SEND MAIL*/
export async function addToSec(_id) {
  let arrID = await getDataOne(_id);

  let randomUser = await createUniqueUser(arrID.firstName);
  let passUser = createRandomPass(arrID.lastName);

  await sendEmail(
    arrID.firstName,
    arrID.lastName,
    arrID.email,
    randomUser,
    passUser
  );
  postNewEmp(
    arrID.firstName,
    arrID.lastName,
    arrID.address,
    arrID.email,
    arrID.age,
    randomUser,
    passUser,
    "security"
  );

  removeBending(_id);
} //end of securoty

/*FUNCTION CREATE RANDOM USERNAMES*/
function createRandomUsers(data) {
  let Ran = Math.trunc(Math.random() * 1000);
  let username = `${data}_${Ran}`;
  return username;
}
/*FUNCTION CREATE RANDOM PASSWORDS*/
function createRandomPass(data) {
  let Ran = Math.trunc(Math.random() * 1000);
  let username = `${data}@${Ran}`;
  return username;
}

/*check on replicated userNames*/
async function createUniqueUser(_username) {
  do {
    let username = createRandomUsers(_username);
    let respose = await fetch(
      `http://localhost:3000/employeesData?userName=${username}`
    );
    let result = await respose.json();
    if (result.length == 0) {
      return username;
    }
  } while (true);
}

//////////////////////////////////EVENTS////////////////////////////////////////

// divNew.classList.add("d-none");
divCurr.classList.add("d-none");
divRepo.classList.add("d-none");
divSpecific.classList.add("d-none");
//DISPLAY PENDING TABLE
btnNew.addEventListener("click", () => {
  if ($.fn.dataTable.isDataTable("#pending-employee")) {
    // $("#pending-employee").DataTable().clear().destroy();
    // divNew.classList.add("d-none");
  } else {
    divNew.classList.remove("d-none");
    createPendingEmpTable();
    $("#daily-employee").DataTable().clear().destroy();
    $("#report-employee").DataTable().clear().destroy();
    $("#specific-employee").DataTable().clear().destroy();
    divCurr.classList.add("d-none");
    divRepo.classList.add("d-none");
    divSpecific.classList.add("d-none");
  }
});

//CREATE CURRENT EMPLOYEE TABLE
btnDay.addEventListener("click", () => {
  if ($.fn.dataTable.isDataTable("#daily-employee")) {
  } else {
    divCurr.classList.remove("d-none");
    createCurrentEmpTable();
    $("#pending-employee").DataTable().clear().destroy();
    $("#report-employee").DataTable().clear().destroy();
    $("#specific-employee").DataTable().clear().destroy();
    divNew.classList.add("d-none");
    divRepo.classList.add("d-none");
    divSpecific.classList.add("d-none");
  }
});
//CREATE RELATED REPORTS
btnCurr.addEventListener("click", () => {
  if ($.fn.dataTable.isDataTable("#report-employee")) {
  } else {
    divRepo.classList.remove("d-none");
    displayAllEmployee();
    $("#pending-employee").DataTable().clear().destroy();
    $("#daily-employee").DataTable().clear().destroy();
    $("#specific-employee").DataTable().clear().destroy();
    divNew.classList.add("d-none");
    divCurr.classList.add("d-none");
    divSpecific.classList.add("d-none");
  }
});

btnBack.addEventListener("click", function () {
  divRepo.classList.remove("d-none");
  displayAllEmployee();
  $("#pending-employee").DataTable().clear().destroy();
  $("#daily-employee").DataTable().clear().destroy();
  $("#specific-employee").DataTable().clear().destroy();
  divNew.classList.add("d-none");
  divCurr.classList.add("d-none");
  divSpecific.classList.add("d-none");
});

//LOGOUT FUNCTION
logOutBtn.addEventListener("click", logOut);
async function logOut() {
  window.close("", "_self");
  window.open("./../login-register.html");
}

///////CHART/////////////////////////
var donutChartCanvas = $("#donutChart").get(0).getContext("2d");

async function biChartAbsence(_id) {
  let specificEmp = await getDataOneCurr(_id);
  let punchInCouter = 0;
  let absenceCouter = 0;

  if (specificEmp.attendence.length != 0) {
    for (let i = 0; i < specificEmp.attendence.length; i++) {
      if (
        specificEmp.attendence[i].punchOutDate != null &&
        specificEmp.attendence[i].absence == false
      ) {
        punchInCouter++;
      }

      if ((specificEmp.attendence[i].absence = true)) {
        absenceCouter++;
      }
    }
    var donutData = {
      labels: ["Punch-in", "Absence"],
      datasets: [
        {
          data: [punchInCouter, absenceCouter],
          backgroundColor: ["#00a65a", "#f56954"],
        },
      ],
    };
    var donutOptions = {
      maintainAspectRatio: false,
      responsive: true,
    };
    new Chart(donutChartCanvas, {
      type: "doughnut",
      data: donutData,
      options: donutOptions,
    });
  } else {
    var donutData = {
      labels: ["no-attendence data"],
      datasets: [
        {
          data: ["100"],
          backgroundColor: ["#f56954"],
        },
      ],
    };
    var donutOptions = {
      maintainAspectRatio: false,
      responsive: true,
    };
    new Chart(donutChartCanvas, {
      type: "doughnut",
      data: donutData,
      options: donutOptions,
    });
  }
}
