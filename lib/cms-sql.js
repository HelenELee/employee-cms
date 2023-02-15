//const {runCMS, initCMS } = require("./cms-manager.js");
// Include packages needed for this application
const inquirer = require('inquirer');
///use chalk to colour message/error messages
var chalk = require('chalk');
const SQLManager = require("./SQLManager.js");
const sqlManager = new SQLManager();
const {dptQuestions, roleQuestions } = require("../src/questions.js");

function displayTable(tableTitle, tableData) {
    console.log('\n');
    console.log(`   ${tableTitle}\n`);
    console.table(tableData);
    console.log('\n');
}

function viewDepts() {
    console.log("viewDepts");
    return sqlManager.db.promise().query('SELECT * FROM departments')
    /*
    .then((response) => {
        return displayTable("ALL DEPARTMENTS", response[0]);
    })
    */
    /*
    .then((response) => {
        runCMS();
    })*/
    .catch(function(error) {
        console.log("Error with viewDepts"); //catch any errors and exit gracefully  
    })
}

function viewRoles() {
    return sqlManager.db.promise().query('SELECT * FROM roles')
    .catch(function(error) {
       // sqlManager.closeSQL();
        console.log("Error with viewRoles"); //catch any errors and exit gracefully/    
    })
}

function viewEmployees() {
    
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
       // sqlManager.closeSQL();
        console.log("Error with viewEmployees"); //catch any errors and exit gracefully/    
    })
}


function addDept() {
    console.log("Inside addDept");
    inquirer
    .prompt(dptQuestions) //questions is the array of questions, passed to inquirer
    .then((response) => {
        qry = `
        INSERT INTO departments (name)
        VALUES ("${response.deptName}");
        `;
        sqlManager.db.promise().query(qry);
    })
    .catch(function(error) {
       // sqlManager.closeSQL();
        console.log("Error with addDept"); //catch any errors and exit gracefully/    
    })
}

function addRoleTEST() {
    console.log("Inside addRole");
    
    sqlManager.db.promise().query('SELECT id FROM departments')
    .then((response) => {
        //console.log(response[0]);
        const roles = response[0].map(element => {
            return element.id
          })
        return roles;
    })
    .then((response) => {
        //console.log(roleQuestions);
        inquirer
        .prompt(roleQuestions) //questions is the array of questions, passed to inquirer
        .then((response) => {
        qry = `
        INSERT INTO roles (title, salary, department_id)
        VALUES ("${response.roleName}", ${response.salary}, ${response.deptID});
        `;
        //console.log(qry);
        return sqlManager.db.promise().query(qry);
    })
    .catch(function(error) {
       // sqlManager.closeSQL();
        console.log("Error with addRole"); //catch any errors and exit gracefully/    
    })

    })

   // const roles = res.map(element => {
   //   return element.id
   // })
    
    
}

function addRole() {
   // console.log("Inside addRole");
    let allDepts = '';
    sqlManager.db.promise().query('SELECT name, id FROM departments')
    /*.then((response) => {
        console.log(response);
          allDepts = response[0].map(element => {
            return {deptName : element.name,
                    deptID : element.id
                    }
          })
          console.log(allDepts);
        return allDepts;
    })*/
    .then((response) => {
        //console.log(response);
        allDepts = response[0];
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
                choices: depts,
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
        ]) //questions is the array of questions, passed to inquirer
        .then((response) => {
            //console.log(allDepts);
            //console.log(response);
            let selectedDept = allDepts.filter((element) => {
                return element.name === response.deptName
            })
        //console.log(selectedDept);
            qry = `
            INSERT INTO roles (title, salary, department_id)
            VALUES ("${response.roleName}", ${response.salary}, ${selectedDept[0].id});
            `;
            console.log(qry);
            return sqlManager.db.promise().query(qry);
    })
    .catch(function(error) {
       // sqlManager.closeSQL();
        console.log("Error with addRole"); //catch any errors and exit gracefully/    
    })

    })
}

function addEmployee() {
    //console.log("Inside Add Employee")
    let allRoles = '';
    let allDepts = '';
    let allEmps = '';
    sqlManager.db.promise().query('SELECT title, id FROM roles')
    //sqlManager.db.promise().query('SELECT * from departments')
    .then((response) => {
        allRoles = response[0];
        //console.log(allRoles);
        return allRoles;
    })
    .then((response) => {
        return sqlManager.db.promise().query('SELECT first_name, last_name, id from employees');
    })
    .then((response) => {
        allEmps = response[0];
        //console.log("allEmps = " + JSON.stringify(allEmps));
        return allEmps;
        //return console.log("depts = " + JSON.stringify(response[0]));
    })
    .then((response) => {
        const emps = allEmps.map(element => {
            return element.first_name + " " + element.last_name
          });
        //console.log(emps);
          const roles = allRoles.map(element => {
            return element.title
          });
        //console.log(roles);
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
           // console.log(response);
            let names = response.mgrName.split(" ");
            //console.log(names[0]);
           // console.log(names[1]);
            let selectedEmp = allEmps.filter((element) => {
               // console.log("element = " + JSON.stringify(element));
                
                return element.first_name === names[0] && element.last_name === names[1]
             });
            //console.log("selectedEmp = " + selectedEmp);
            let selectedRole = allRoles.filter((element) => {
                return element.title === response.roleName
            })
           
           // console.log(selectedRole);
            qry = `
                INSERT INTO employees (first_name, last_name, role_id, manager_id)
                VALUES ("${response.firstName}", "${response.lastName}", ${selectedRole[0].id}, ${selectedEmp[0].id});
                `;
                console.log(qry);
                return sqlManager.db.promise().query(qry);
                
        }) 
    }) 
    .catch(function(error) {
        // sqlManager.closeSQL();
        console.log(error);
         console.log("Error with addRole"); //catch any errors and exit gracefully/    
     })
}


function doQuit() {
    //return sqlManager.closeSQL();
    //return process.exitCode = 0;
    return process.exit(0);
}

function updateEmployeeRole () {
    console.log("Inside updateEmployeeRole");
    let allRoles = '';
    let allEmps = '';
    sqlManager.db.promise().query('SELECT title, id FROM roles')
    //sqlManager.db.promise().query('SELECT * from departments')
    .then((response) => {
        allRoles = response[0];
        //console.log(allRoles);
        return allRoles;
    })
    .then((response) => {
        return sqlManager.db.promise().query('SELECT first_name, last_name, id FROM employees')
    })
    .then((response) => {
        allEmps = response[0];
        console.log(allEmps);
    })
    /*
    .then ((response) => {
        const emps = allEmps.map(element => {
            return element.first_name + " " + element.last_name
         });
        //console.log(emps);
        const roles = allRoles.map(element => {
            return element.title
        });
    })
    */
    .then((response) => {
        const roles = allRoles.map(element => {
            return element.title
        });
        console.log("roles = " + roles);
        
        const emps = allEmps.map(element => {
            return element.first_name + " " + element.last_name
          });
        console.log("emps = " + emps);
       
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
            //console.log(response);
            let selectedRole = allRoles.filter((element) => {
                return element.title === response.role
            })
           // console.log(selectedRole);
          //  console.log(selectedRole[0].id);
            let names = response.name.split(" ");
           // console.log(names[0]);
           // console.log(names[1]);
            let selectedEmp = allEmps.filter((element) => {
                return element.first_name === names[0] && element.last_name === names[1]
            })
           // console.log(selectedEmp[0].id);
           
            qry = `
                UPDATE employees
                SET role_id = ${selectedRole[0].id}
                WHERE id = ${selectedEmp[0].id};
                `;
                console.log(qry);
                return sqlManager.db.promise().query(qry);  
                
        }) 
    }) 
    .catch(function(error) {
        console.log(error);
         console.log("Error with viewEmployees"); //catch any errors and exit gracefully/    
     })
}

function viewBudgetByDept() {
    console.log("inside view budget");
    /*
    let qry = `
    SELECT  departments.name AS department, 
            SUM(roles.salary) AS salary,      
    FROM employees emps
    JOIN roles ON emps.role_id = roles.id
    JOIN departments ON roles.department_id = departments.id
    GROUP by department;
    `
    */
   let qry = `
    SELECT departments.name AS department,
            SUM(roles.salary) AS salary
    FROM departments
    JOIN roles ON roles.department_id = departments.id
    JOIN employees ON employees.role_id = roles.id
    GROUP by department
   `;

    console.log(qry);
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
            managers.last_name AS manager
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
    /*
    .then((response) => {
        return displayTable("ALL EMPLOYEES", response[0]);
    })
    */
    .catch(function(error) {
       // sqlManager.closeSQL();
        console.log("Error with viewEmployees"); //catch any errors and exit gracefully/    
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