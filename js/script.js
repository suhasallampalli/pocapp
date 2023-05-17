document.addEventListener('DOMContentLoaded', function () {
    fetch('http://127.0.0.1:3000/tasks', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
      .then(response => response.json())
      .then(data => loadHTMLTable(data.data))
      .catch(error => console.log(error));
  
    const tbody = document.querySelector('table tbody');
  
    tbody.addEventListener('click', function (event) {
      if (event.target.className === 'delete-row-btn') {
        deleteRowById(event.target.dataset.task_id);
      }
      if (event.target.className === 'edit-row-btn') {
        handleEditRow(event.target.dataset.task_id);
      }
    });
  });
  
  const updateBtn = document.querySelector('#update-row-btn');
  const searchBtn = document.querySelector('#search-btn');
  
  searchBtn.onclick = function () {
    const searchValue = document.querySelector('#search-input').value;
  
    fetch(`http://127.0.0.1:3000/search/${searchValue}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
      .then(response => response.json())
      .then(data => loadHTMLTable(data.data))
      .catch(error => console.log(error));
  }
  
  function deleteRowById(id) {
    fetch(`http://127.0.0.1:3000/remove/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          location.reload();
        }
      })
      .catch(error => console.log(error));
  }
  
  function handleEditRow(id) {
    const updateSection = document.querySelector('#update-row');
    updateSection.hidden = false;
    document.querySelector('#update-name-input').dataset.id = id;
  }
  
  updateBtn.onclick = function () {
    const updateNameInput = document.querySelector('#update-name-input');
  
    fetch('http://127.0.0.1:3000/update', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        task_id: updateNameInput.dataset.id,
        task_name: updateNameInput.value
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          location.reload();
        }
      })
      .catch(error => console.log(error));
  }
  
  const addBtn = document.querySelector('#add-name-btn');
  
  addBtn.onclick = function () {
    const nameInput = document.querySelector('#name-input');
    const name = nameInput.value;
    nameInput.value = '';
  
    fetch('http://127.0.0.1:3000/upload', {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      method: 'POST',
      body: JSON.stringify({ task_name: name })
    })
      .then(response => response.json())
      .then(data => insertRowIntoTable(data))
      .catch(error => console.log(error));
  }
  
  function insertRowIntoTable(data) {
    const table = document.querySelector('table tbody');
    const isTableData = table.querySelector('.no-data');
  
    let tableHtml = '';
  
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        if (key === 'task_date') {
          data[key] = new Date(data[key]).toLocaleString();
        }
        tableHtml += `<td>${data[key]}</td>`;
      }
    }
  
    tableHtml += `<td><button class="delete-row-btn" data-task_id=${data.task_id}>Delete</td>`;
    tableHtml += `<td><button class="edit-row-btn" data-task_id=${data.task_id}>Edit</td>`;
  
    const newRow = table.insertRow();
    newRow.innerHTML = tableHtml;
  
    if (isTableData) {
      table.innerHTML = tableHtml;
    } else {
      const newRow = table.insertRow();
      newRow.innerHTML = tableHtml;
    }
  }
  
  function loadHTMLTable(data) {
    const table = document.querySelector('table tbody');
  
    if (data.length === 0) {
      table.innerHTML = "<tr><td colspan='3' class='no-data'>No Data</td></tr>";
      return;
    }
  
    let tableHtml = '';
  
    data.forEach(function ({ task_id, task_name, task_date }) {
      tableHtml += `<tr data-task_id=${task_id}><td>${task_name}</td><td>${new Date(task_date).toLocaleString()}</td>
                    <td><button class="delete-row-btn" data-task_id=${task_id}>Delete</td>
                    <td><button class="edit-row-btn" data-task_id=${task_id}>Edit</td></tr>`;
    });
  
    table.innerHTML = tableHtml;
  }  