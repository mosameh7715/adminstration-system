//GET DATA FROM PENDING EMPLOYEE (ALL DATA)
export async function getData() {
  let respose = await fetch(`http://localhost:3000/employeeDataBending`);
  let result = await respose.json();
  return result;
}
//GET DATA FROM PENDING EMPLOYEE (ONE DATA)
export async function getDataOne(_id) {
  let respose = await fetch(`http://localhost:3000/employeeDataBending/${_id}`);
  let result = await respose.json();
  return result;
}

//GET DATA FROM CURRENT EMPLOYEE (ONE DATA)
export async function getDataOneCurr(_id) {
  let respose = await fetch(`http://localhost:3000/employeesData/${_id}`);
  let result = await respose.json();
  return result;
}

//GET DATA FROM CURRENT EMPLOYEE
export async function getDataCurrent() {
  let respose = await fetch(`http://localhost:3000/employeesData`);
  let result = await respose.json();
  return result;
}

//POST DATA TO PENDING EMPLOYEES
export async function postBending(
  _firstName,
  _lastName,
  _address,
  _email,
  _age
) {
  let respose = await fetch(`http://localhost:3000/employeeDataBending`, {
    method: "POST",
    body: JSON.stringify({
      id: "",
      firstName: _firstName,
      lastName: _lastName,
      address: _address,
      email: _email,
      age: _age,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

//POST DATA ON EMPLOYEE
export async function postNewEmp(
  _firstName,
  _lastName,
  _address,
  _email,
  _age,
  _username,
  _password,
  _title
) {
  let respose = await fetch(`http://localhost:3000/employeesData`, {
    method: "POST",
    body: JSON.stringify({
      id: "",
      firstName: _firstName,
      lastName: _lastName,
      address: _address,
      email: _email,
      age: _age,
      userName: _username,
      password: _password,
      title: _title,
      attendence: [],
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

//POST DATA IN CURRENT LOGED ACCOUNT
export async function postCurrentLoged(empObj) {
  let respose = await fetch(`http://localhost:3000/currentLogedEmp`, {
    method: "POST",
    body: JSON.stringify({
      id: "",
      firstName: empObj.firstName,
      lastName: empObj.lastName,
      address: empObj.address,
      email: empObj.email,
      age: empObj.age,
      userName: empObj.userName,
      password: empObj.password,
      title: empObj.title,
      attendence: empObj.attendence,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

//GET DATA FROM CURRENT LOGED ACCOUNT
export async function getDataLoged() {
  let respose = await fetch(`http://localhost:3000/currentLogedEmp`);
  let result = await respose.json();
  return result;
}

//DELETE DATA FROM CURRENT LOGED ACCOUNT
export async function removeLogedIn(id) {
  let del = await fetch(`http://localhost:3000/currentLogedEmp/${id}`, {
    method: "DELETE",
  });
}

//DELETE DATA
export async function removeBending(id) {
  let del = await fetch(`http://localhost:3000/employeeDataBending/${id}`, {
    method: "DELETE",
  });
}

/*FUNCTION TO SEND CONFIRMATION EMAIL*/
export async function sendEmail(
  _firstName,
  _lastName,
  _email,
  _username,
  _password
) {
  let respose = await emailjs.send("service_7n6rz0n", "template_miszmpl", {
    to_name: `${_firstName} ${_lastName}`,
    message: _username,
    message2: _password,
    to_email: _email,
  });
  console.log(respose);
}
