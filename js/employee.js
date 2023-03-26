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
let btnCurr = document.querySelector(".curr-emp"); //btn1
let btnDay = document.querySelector(".day-attend"); //btn2
let divSpecific = document.querySelector(".div-specific"); //div2
let divCurr = document.querySelector(".div-curr"); //div3
let personLoged = document.querySelector(".wellcome");
let logOutBtn = document.querySelector(".logOut");

//Display Hello, user!
async function welcome() {
  let empArray = await getDataLoged();
  if (empArray.length != 0) {
    personLoged.innerText = `wellcome, ${empArray[0].firstName} !`;
  }
}

welcome();
//check URL
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
  console.log(specificEmp[0].attendence);
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

//CREATE CURRENT EMPLOYEE TABLE
btnDay.addEventListener("click", () => {
  if ($.fn.dataTable.isDataTable("#daily-employee")) {
  } else {
    divCurr.classList.remove("d-none");
    createCurrentEmpTable();
    $("#specific-employee").DataTable().clear().destroy();
    divSpecific.classList.add("d-none");
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
  }
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
