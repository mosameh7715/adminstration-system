import {
  getData,
  getDataOne,
  postNewEmp,
  removeBending,
  getDataCurrent,
  getDataOneCurr,
  sendEmail,
  getDataLoged,
  removeLogedIn,
} from "./crudOperations.js";

function checkTitle() {
  if (!sessionStorage.getItem("emp")) {
    alert("Not Authorized");
    location.assign("../home.html");
  } else if (!JSON.parse(sessionStorage.getItem("emp")).title == "security") {
    alert("Not Authorized");
    location.assign("../home.html");
  }
}
checkTitle();

let btnConfirm = document.querySelector(".attendence-confirm");

let inputConfirm = document.querySelector(".input-confirm");
let currentDate = new Date().toLocaleString().split(",")[0];
let currentTime = new Date().toLocaleString().split(",")[1];

let date = new Date();
date.setHours(8);
date.setMinutes(30);
date.setSeconds(0); //CURRENT HOUR IS 8:30 AM  punch-in

let curDate = new Date();
let diffHours = Math.trunc(Math.abs((date - curDate) / (1000 * 60 * 60))); //DIFFERENCE HOURS BETWEEN PUNCHED TIME AND 8:30AM
let diffMins = Math.abs((date - curDate) / (1000 * 60 * 60));
let lateMins = Math.trunc((diffMins - diffHours).toFixed(2) * 60);

/*FUNCTION TO AUTO PUNCH OUT EMPLOYEE AT 3:30PM*/
async function checkPunchOut() {
  let empData = await getDataCurrent();
  let dateCurrent = new Date().toLocaleString().split(",")[0];
  let timeCurrent = new Date().getHours();

  for (let emp of empData) {
    if (emp.attendence.length != 0) {
      let dataObjOut = {
        punchInDate: emp.attendence[emp.attendence.length - 1].punchInDate,
        punchInTime: emp.attendence[emp.attendence.length - 1].punchInTime,
        punchOutDate: currentDate,
        punchOutTime: currentTime,
        late: emp.attendence[emp.attendence.length - 1].late,
        absence: emp.attendence[emp.attendence.length - 1].absence,
      };
      if (
        emp.attendence[emp.attendence.length - 1].punchInDate == dateCurrent &&
        emp.attendence[emp.attendence.length - 1].punchOutDate == null &&
        emp.attendence[emp.attendence.length - 1].punchInTime != null &&
        timeCurrent >= 16
      ) {
        updateEmpPunchOut(emp.id, dataObjOut, emp.attendence);
      }
    }
  }
}
//checkPunchOut();
/* FUNCTION TO APPLY ABSENCE ON EMPLOYEE IF THE TIME IS 3:30 PM AND THEY NEVER COME*/
async function checkAbsence() {
  let empData = await getDataCurrent();
  let dateCurrent = new Date().toLocaleString().split(",")[0];
  let timeCurrent = new Date().getHours();
  let dataObjOut = {
    punchInDate: dateCurrent,
    punchInTime: null,
    punchOutDate: null,
    punchOutTime: null,
    late: "--",
    absence: true,
  };
  for (let emp of empData) {
    if (emp.attendence.length == 0 && timeCurrent >= 16) {
      updateEmpPunchIn(emp.id, dataObjOut, emp.attendence);
    } else if (
      emp.attendence[emp.attendence.length - 1].punchInDate != dateCurrent &&
      timeCurrent >= 16
    ) {
      updateEmpPunchIn(emp.id, dataObjOut, emp.attendence);
    }
  }
}
//checkAbsence();

btnConfirm.addEventListener("click", confirmAttendence);
async function confirmAttendence() {
  let empData = await getDataCurrent();
  for (let emp of empData) {
    if (emp.userName == inputConfirm.value) {
      let dataObj = {
        punchInDate: currentDate,
        punchInTime: currentTime,
        punchOutDate: null,
        punchOutTime: null,
        late:
          diffHours > 1 ? `${diffHours} hours : ${lateMins} mins` : `no late`,
        absence: diffHours > 1 ? true : false,
      };
      let currentEmpDate = emp.attendence[emp.attendence.length - 1];
      if (currentEmpDate == undefined) {
        updateEmpPunchIn(emp.id, dataObj, emp.attendence);
        break;
      } else if (currentEmpDate.punchInDate != currentDate) {
        updateEmpPunchIn(emp.id, dataObj, emp.attendence);
      } else if (
        currentEmpDate.punchInDate == currentDate &&
        currentEmpDate.punchOutDate == null
      ) {
        let dataObjOut = {
          punchInDate: currentEmpDate.punchInDate,
          punchInTime: currentEmpDate.punchInTime,
          punchOutDate: currentDate,
          punchOutTime: currentTime,
          late:
            diffHours > 1 ? `${diffHours} hours : ${lateMins} mins` : `no late`,
          absence: diffHours > 1 ? true : false,
        };
        updateEmpPunchOut(emp.id, dataObjOut, emp.attendence);
        break;
      }
    }
  }
}

//PATCH PUNCH IN
async function updateEmpPunchIn(_id, punchInObj, currentPunchInData) {
  let respose = await fetch(`http://localhost:3000/employeesData/${_id}`, {
    method: "PATCH",
    body: JSON.stringify({
      attendence: currentPunchInData.concat(punchInObj),
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
// PATCH PUNCH OUT
async function updateEmpPunchOut(_id, punchOutObj, currentData) {
  let respose = await fetch(`http://localhost:3000/employeesData/${_id}`, {
    method: "PATCH",
    body: JSON.stringify({
      attendence: currentData.slice(0, -1).concat(punchOutObj),
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

////////////////////////////////////////////////////////////////////////FUNCTIONS RALTED TO DISPLAYING SECURITY TABLE

//SELECTORS
let dailyTable = document.querySelector(".daily-table-body");
let empSpecific = document.querySelector(".specific-table-body");
let btnDate = document.querySelector(".date-check");
let startDate = document.querySelector(".start-date");
let endDate = document.querySelector(".end-date");
let msgSpan = document.querySelector(".msg-span");
let btnCurr = document.querySelector(".curr-emp"); //btn1
let btnDay = document.querySelector(".day-attend"); //btn2
let divSpecific = document.querySelector(".div-specific"); //div2
let divCurr = document.querySelector(".div-curr"); //div3
let personLoged = document.querySelector(".wellcome");
let logOutBtn = document.querySelector(".logOut");
let btnPunch = document.querySelector(".btn-punch");
let divPunch = document.querySelector(".div-punch");

//Display Hello, user!
async function welcome() {
  let empArray = await getDataLoged();
  // console.log(empArray[0].firstName);
  if (empArray.length != 0) {
    personLoged.innerText = `wellcome, ${empArray[0].firstName} !`;
  }
}

welcome();

//LOGOUT FUNCTION
logOutBtn.addEventListener("click", logOut);
async function logOut() {
  removeLogedIn(1);
  window.close("", "_self");
  window.open("./../login-register.html");
}
//CURRENT EMPLOYEE
async function createCurrentEmpTable() {
  let empArray = await getDataLoged();
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

//Display spcific employee attendence data
export async function displayReport() {
  let specificEmp = await getDataLoged();
  for (let i = 0; i < specificEmp[0].attendence.length; i++) {
    let tr = document.createElement("tr");
    let tds = `<td class="text-center">${i + 1}</td>
    <td class="text-center">${specificEmp[0].attendence[i].punchInDate}</td>
    <td class="text-center">${specificEmp[0].attendence[i].punchInTime}</td>
    <td class="text-center">${specificEmp[0].attendence[i].punchOutDate}</td>
    <td class="text-center">${specificEmp[0].attendence[i].punchOutTime}</td>
    <td class="text-center">${specificEmp[0].attendence[i].late}</td>
    <td class="text-center">${specificEmp[0].attendence[i].absence}</td>`;
    tr.innerHTML = tds;
    empSpecific.appendChild(tr);
  }
  biChartAbsence();
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

//////////////////////////////////EVENTS////////////////////////////////////////
divCurr.classList.add("d-none");
divSpecific.classList.add("d-none");
// divPunch.classList.add("d-none");

//CREATE CURRENT EMPLOYEE TABLE
btnDay.addEventListener("click", () => {
  if ($.fn.dataTable.isDataTable("#daily-employee")) {
  } else {
    divCurr.classList.remove("d-none");
    createCurrentEmpTable();
    $("#specific-employee").DataTable().clear().destroy();
    divSpecific.classList.add("d-none");
    divPunch.classList.add("d-none");
  }
});
//CREATE RELATED REPORTS
btnCurr.addEventListener("click", () => {
  if ($.fn.dataTable.isDataTable("#specific-employee")) {
  } else {
    divSpecific.classList.remove("d-none");
    displayReport();
    $("#daily-employee").DataTable().clear().destroy();
    divCurr.classList.add("d-none");
    divPunch.classList.add("d-none");
  }
});

btnPunch.addEventListener("click", function () {
  divPunch.classList.remove("d-none");
  divCurr.classList.add("d-none");
  divSpecific.classList.add("d-none");
});

///////CHART/////////////////////////
var donutChartCanvas = $("#donutChart").get(0).getContext("2d");

async function biChartAbsence() {
  let specificEmp = await getDataLoged();
  let punchInCouter = 0;
  let absenceCouter = 0;

  if (specificEmp[0].attendence.length != 0) {
    for (let i = 0; i < specificEmp[0].attendence.length; i++) {
      if (
        specificEmp[0].attendence[i].punchOutDate != null &&
        specificEmp[0].attendence[i].absence == false
      ) {
        punchInCouter++;
      }

      if ((specificEmp[0].attendence[i].absence = true)) {
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
