
/**
 * Given a data set, paint the HTML table
 * @param {*} data 
 */
function loadTableData(data){
    
}


/**
 * This is to initially get all the tasks data
 */
function loadInitialDataSet(){
    var data = getDataForAllTasks();
    loadTableData(data);
}

function getDataForAllTasks(){
    //Call the backend API layer
}


function handleSearch(){
    //Get the search value
    //Get the search records from backend api
    loadTableData(data);
}

function addNewTasks(){
    //Get the task value
    addTask();
    loadTableData(data);
}

function addTask(){


}


//DOM
Button.addevent(click, handleSearch());






//Add a new data element to the backend
//Load Table Data