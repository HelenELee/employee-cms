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

//function to add new department
function addDeptXX() {
    
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
        console.log("inside then");
        let qry = `
        INSERT INTO departments (name)
        VALUES ("${response.deptName}");
        `;
        return sqlManager.db.promise().query(qry)
    })
    .catch(function(error) {
        console.log("Error with addDept"); //catch any errors and exit gracefully
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
        console.log("inside then");
        let qry = `
        INSERT INTO departments (name)
        VALUES ("${response.deptName}");
        `;
        return sqlManager.db.promise().query(qry)
     })
    .catch(function(error) {
         console.log("Error with addDept"); //catch any errors and exit gracefully
         console.error(error);  
     })
     
 }
 

//function to add a role
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
    .catch(function(error) {
        console.log("Error with addRole"); //catch any errors and exit gracefully
        console.error(error);  
    })

    })
}

//function to add new employee - need first name, last name, role id, manager id
function addEmployee() {
    let allRoles = '';
    //let allDepts = '';
    let allEmps = '';
    //get all roles - will need an id later
    sqlManager.db.promise().query('SELECT title, id FROM roles')
    .then((response) => {
        //store all roles in array for later
        allRoles = response[0];
        return allRoles;
    })
    .then((response) => {
        //get all employee names as will need for choosing manager later
        return sqlManager.db.promise().query('SELECT first_name, last_name, id from employees');
    })
    .then((response) => {
        //store all names in array for later as we will need to get managers id
        allEmps = response[0];
        return allEmps;
    })
    .then((response) => {
        //reduce allEmps to just contain names - used for managers names in inquirer later
        const emps = allEmps.map(element => {
            return element.first_name + " " + element.last_name
          });
        //reduce allRoles to just role name - used for choosing role in inquirer later
          const roles = allRoles.map(element => {
            return element.title
          });
        
        inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the first name?',
                name: 'firstName',
                //this question is mandatory
                validate: firstName => {
                  if (firstName) {
                      return true;
                  } else {
                      console.log('Please provide a first name!');
                      return false;
                  }
                }
              },
              
              {
                type: 'input',
                message: 'What is the last name?',
                name: 'lastName',
                //this question is mandatory
                validate: lastName => {
                  if (lastName) {
                      return true;
                  } else {
                      console.log('Please provide a last name!');
                      return false;
                  }
                }
              },
              {
                type: 'list',
                choices: emps,
                message: 'Who is the manager for this employee?',
                name: 'mgrName',
                //this question is mandatory
                validate: mgrName => {
                  if (mgrName) {
                      return true;
                  } else {
                      console.log('Please provide a department name!');
                      return false;
                  }
                }
              },
              {
                type: 'list',
                choices: roles,
                message: 'What is the Role for this employee?',
                name: 'roleName',
                //this question is mandatory
                validate: roleName => {
                  if (roleName) {
                      return true;
                  } else {
                      console.log('Please provide a role!');
                      return false;
                  }
                }
              }
        ]) 
        .then((response) => {
            //split managers name into first name and last name
            let names = response.mgrName.split(" ");
            //reduce allEmps so it just contain the name and id of the chosen manager name
            let selectedEmp = allEmps.filter((element) => {                
                return element.first_name === names[0] && element.last_name === names[1]
             });
            //reduce allRoles so it just contains the role chosen above
            let selectedRole = allRoles.filter((element) => {
                return element.title === response.roleName
            })
           
           
            qry = `
                INSERT INTO employees (first_name, last_name, role_id, manager_id)
                VALUES ("${response.firstName}", "${response.lastName}", ${selectedRole[0].id}, ${selectedEmp[0].id});
                `;
                
            return sqlManager.db.promise().query(qry);
                
        }) 
    }) 
    .catch(function(error) {
        console.log(error);
        console.log("Error with addEmployee"); //catch any errors and exit gracefully/    
     })
}

//quit from CMS
function doQuit() {
    //return sqlManager.closeSQL();
    //return process.exitCode = 0;
    return process.exit(0);
}

//function to update Employee Role
function updateEmployeeRole () {
    
    let allRoles = '';
    let allEmps = '';
    //get all roles - will need for later
    sqlManager.db.promise().query('SELECT title, id FROM roles')
    
    .then((response) => {
        //store all roles for later
        allRoles = response[0];
        return allRoles;
    })
    .then((response) => {
        //get all employees - will need when choosing employee to update, and will need id later
        return sqlManager.db.promise().query('SELECT first_name, last_name, id FROM employees')
    })
    .then((response) => {
        //store all employees for later
        allEmps = response[0];
    })
    .then((response) => {
        //reduce allRoles to just array of role names - will need for inquirer choices
        const roles = allRoles.map(element => {
            return element.title
        });
        //reduce allEmps to just first name last name for use inInquirer
        const emps = allEmps.map(element => {
            return element.first_name + " " + element.last_name
          });
               
        inquirer
        .prompt([
            {
                type: 'list',
                message: 'Select the employee to update:',
                name: 'name',
                choices: emps,
                //this question is mandatory
                validate: name => {
                  if (name) {
                      return true;
                  } else {
                      console.log('Please select a name!');
                      return false;
                  }
                }
              },
              {
                type: 'list',
                message: 'Select the new role:',
                name: 'role',
                choices: roles,
                //this question is mandatory
                validate: role => {
                  if (role) {
                      return true;
                  } else {
                      console.log('Please select a name!');
                      return false;
                  }
                }
              },
        ]) 
        .then((response) => {
            //reduce allRoles to just have details of chosen role - need id from it
            let selectedRole = allRoles.filter((element) => {
                return element.title === response.role
            })
           //split chosen name into first/last
            let names = response.name.split(" ");
           //reduce allEmps to just contain details of employee to update - will need id from it
            let selectedEmp = allEmps.filter((element) => {
                return element.first_name === names[0] && element.last_name === names[1]
            })
           
            qry = `
                UPDATE employees
                SET role_id = ${selectedRole[0].id}
                WHERE id = ${selectedEmp[0].id};
                `;
                
            return sqlManager.db.promise().query(qry);  
                
        }) 
    }) 
    .catch(function(error) {
        console.log(error);
         console.log("Error with  updateEmployee Role"); //catch any errors and exit gracefully/    
     })
}
//function to view utilized budget of all depts
function viewBudgetByDept() {
    
   let qry = `
    SELECT departments.name AS department,
            SUM(roles.salary) AS salary
    FROM departments
    JOIN roles ON roles.department_id = departments.id
    JOIN employees ON employees.role_id = roles.id
    GROUP by department
   `;

    return sqlManager.db.promise().query(qry)
    
    .catch(function(error) {
       console.log(err);
        console.log("Error with viewBudget"); //catch any errors and exit gracefully/    
    })
}

function viewEmployeesByMgr() {
    
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
    GROUP by manager;
    `
    
    return sqlManager.db.promise().query(qry)

    .catch(function(error) {
        console.log("Error with viewEmployeesByMgr"); //catch any errors and exit gracefully/    
    })
}

module.exports = {
    viewDepts : viewDepts,
    viewRoles : viewRoles,
    addDept : addDept,
    addRole : addRole,
    viewEmployees : viewEmployees,
    addEmployee : addEmployee,
    updateEmployeeRole : updateEmployeeRole,
    viewEmployeesByMgr : viewEmployeesByMgr,
    viewBudgetByDept : viewBudgetByDept,
 }