export function acceptPendingEmp(func1, func2, func3) {
  $("#bending-table").DataTable({
    ajax: {
      url: "http://localhost:3000/employeeDataBending",
      dataSrc: "",
    },
    columns: [
      { data: "id" },
      { data: "firstName" },
      { data: "lastName" },
      { data: "address" },
      { data: "email" },
      { data: "age" },
      {
        data: null,
        render: function (data, type, row, meta) {
          return `<button onClick="${func1(row.id)}">remove</button>`;
        },
      },
      {
        data: null,
        render: function (data, type, row, meta) {
          return `<button onClick="${func2(row.id)}" >Employee</button>`;
        },
      },
      {
        data: null,
        render: function (data, type, row, meta) {
          return `<button onClick="${func3(row.id)})" >Security</button>`;
        },
      },
    ],
  });
}
