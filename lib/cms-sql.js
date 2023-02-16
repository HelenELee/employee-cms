// Include packages needed for this application
const inquirer = require('inquirer');
///use chalk to colour message/error messages
var chalk = require('chalk');
//setup connection to sql server
const SQLManager = require("./SQLManager.js");
const sqlManager = new SQLManager();
//get questions for Inquirer
const {dptQuestions, roleQuestions } = require("../src/questions.js");

//function to display all departments
function viewDepts() {
    return sqlManager.db.promise().query('SELECT * FROM departments')
    .catch(function(error) {
        console.log("Error with viewDepts"); //catch any errors and exit gracefully  
        console.error(error);
    })
}
//function to view all roles
function viewRoles() {
    return sqlManager.db.promise().query('SELECT * FROM roles')
    .catch(function(error) {
        console.log("Error with viewRoles"); //catch any errors and exit gracefully
        console.error(error);
    })
}
//function to view all employees
function viewEmployees() {
    //get basic data from employees
    //join with roles and departments
    let qry = `
    SELECT emps.id AS ID,
            emps.first_name AS firstName, 
            emps.last_name AS lastName, 
            roles.title AS role, 
            departments.name AS department, 
            roles.salary AS salary,
            CONCAT(managers.first_name, " ", managers.last_name) AS manager
    FROM employees emps
    JOIN roles ON emps.role_id = roles.id
    JOIN departments ON roles.department_id = departments.id
    JOIN employees managers ON (emps.manager_id = managers.id)
    UNION
    SELECT emps.id AS ID,
            emps.first_name AS firstName, 
            emps.last_name AS lastName, 
            roles.title AS role, 
            departments.name AS department, 
            roles.salary AS salary,
            "-"   
    FROM employees emps
    JOIN roles ON emps.role_id = roles.id
    JOIN departments ON roles.department_id = departments.id
    WHERE emps.manager_id IS NULL
    ORDER by ID;
    `
    
    return sqlManager.db.promise().query(qry)
    
    .catch(function(error) {
        console.log("Error with viewEmployees"); //catch any errors and exit gracefully
        console.error(error);   
    })
}



//function to add a role
function addDept() {
    inquirer
    .prompt([
        {
            type: 'input',
            message: 'What is the Department name?',
            name: 'deptName',
            //this question is mandatory
            validate: deptName => {
              if (deptName) {
                  return true;
              } else {
                  console.log('Please provide a department name!');
                  return false;
              }
            }
          }     
    ]) 
    .then((response) => {
        let qry = `
        INSERT INTO departments (name)
        VALUES ("${response.deptName}");
        `;
        sqlManager.db.promise().query(qry)
     })
     .then((response) => {
        return true;
     })
    .catch(function(error) {
         console.log("Error with addDept"); //catch any errors and exit gracefully
         console.error(error);  
     })
     
 }
 
 function addRole() {
    //get all department info will need to link department name and id later
    let allDepts = '';
    sqlManager.db.promise().query('SELECT name, id FROM departments')
    .then((response) => {
        //store in all Depts for user later
        allDepts = response[0];
        //reduce array to just the department names so it can be used as choices in inquirer
        const depts = response[0].map(element => {
            return element.name
        });
        inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the Role name?',
                name: 'roleName',
                //this question is mandatory
                validate: roleName => {
                  if (roleName) {
                      return true;
                  } else {
                      console.log('Please provide a role name!');
                      return false;
                  }
                }
              },
              {
                type: 'input',
                message: 'What is the salary?',
                name: 'salary',
                //this question is mandatory
                validate: salary => {
                  if (salary) {
                      return true;
                  } else {
                      console.log('Please provide a salary!');
                      return false;
                  }
                }
              },
              {
                type: 'list',
                choices: depts, //created above
                message: 'What is the Department for this role?',
                name: 'deptName',
                //this question is mandatory
                validate: deptName => {
                  if (deptName) {
                      return true;
                  } else {
                      console.log('Please provide a department name!');
                      return false;
                  }
                }
              }
        ]) 
        .then((response) => {
            //reduce all depts to array that just has the one object
                 //which matches the department chosen above in Inquirer
                 //need to get id from object to insert into sql below
                 let selectedDept = allDepts.filter((element) => {
                     return element.name === response.deptName
                 })
                 qry = `
                 INSERT INTO roles (title, salary, department_id)
                 VALUES ("${response.roleName}", ${response.salary}, ${selectedDept[0].id});
                 `;
                 return sqlManager.db.promise().query(qry); 
         })
    })
    
    
    .catch(function(error) {
        console.log("Error with addDept"); //catch any errors and exit gracefully
        console.error(error);  
    })
 }

function addEmployee() {

}

function updateEmployeeRole() {

}
function viewEmployeesByMgr() {

}
function viewBudgetByDept() {

}

module.exports = {
    viewDepts : viewDepts,
    viewRoles : viewRoles,
    viewEmployees : viewEmployees,
    addDept : addDept,
    addRole : addRole,
    addEmployee : addEmployee,
    updateEmployeeRole : updateEmployeeRole,
    viewEmployeesByMgr : viewEmployeesByMgr,
    viewBudgetByDept : viewBudgetByDept,
 }