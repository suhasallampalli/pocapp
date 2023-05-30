/**
 * Utility function to handle the edit row
 * @param {*} id 
 */
function handleEditRow(id) {
  const updateSection = document.querySelector('#update-row');
  updateSection.hidden = false;
  document.querySelector('#update-name-input').dataset.id = id;
}

/**
 * Function to handle the delete row 
 * @param {*} id 
 */
function deleteRowById(id) {
  fetch(`http://127.0.0.1:4000/remove/${id}`, {
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

//Utility Function to load the HTML table
function loadHTMLTable(data) {
  console.log('Load HTML Count {}',data);
  const table = document.querySelector('table tbody');

  if (data.length === 0) {
    table.innerHTML = "<tr><td colspan='3' class='no-data'>No Data</td></tr>";
    return;
  }

  let tableHtml = '';

  data.forEach(function ({ task_id, task_name, task_date }) {
    tableHtml += `<tr data-task_id=${task_id}><td>${task_name}</td><td>${new Date(task_date).toLocaleString()}</td>
                  <td><button class="btn btn-danger" data-task_id=${task_id}>Delete</td>
                  <td><button class="btn btn-outline-light btn-secondary" data-task_id=${task_id}>Edit</td></tr>`;
  });


  table.addEventListener('click', function (event) {
    if (event.target.className === 'btn btn-danger') {
      deleteRowById(event.target.dataset.task_id);
    }
    if (event.target.className === 'btn btn-outline-light btn-secondary') {
      handleEditRow(event.target.dataset.task_id);
    }
  });

  table.innerHTML = tableHtml;

  console.log(table);
}

//Function to render the default initial view to load all the tasks
function initialLoadAllTasks(){
  fetch('http://127.0.0.1:4000/tasks', {
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

initialLoadAllTasks();

//Search button functionality
const searchBtn = document.querySelector('#search-btn');
searchBtn.onclick = function (event) {
  const searchValue = document.querySelector('#search-input').value;
  event.preventDefault(); // Prevent the default form submission behavior
  fetch(`http://127.0.0.1:4000/search/${searchValue}`, {
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

//Update Button functionality
const updateBtn = document.querySelector('#update-row-btn');
updateBtn.onclick = function (event) {
  const updateNameInput = document.querySelector('#update-name-input');
  event.preventDefault();
  fetch('http://127.0.0.1:4000/update', {
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

//Event listener for the Add Name button , so when the button is clicked, this function will be called
const addBtn = document.querySelector('#add-name-btn');
addBtn.addEventListener('click', function () {
  event.preventDefault();
  const nameInput = document.querySelector('#name-input');
  const name = nameInput.value;
  nameInput.value = '';

  fetch('http://127.0.0.1:4000/upload', {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    method: 'POST',
    body: JSON.stringify({ task_name: name })
  })
    .then(response => response.json())
    .then(data => initialLoadAllTasks())
    .catch(error => console.log(error));
})
