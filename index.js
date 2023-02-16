// Include packages needed for this application
const inquirer = require('inquirer');
///use chalk to colour message/error messages
var chalk = require('chalk');

//get arrays of questions used by inquirer
const {welcomeQuestion, cmsQuestions, dptQuestions } = require("./src/questions.js");
//get functions
const {viewRoles, viewDepts, addDept, addRole, viewEmployees, addEmployee, updateEmployeeRole, viewEmployeesByMgr, viewBudgetByDept, doQuit } = require("./lib/cms-sql.js");

//function to print tables of data retrieved via sql
function displayTableTemp(tableData) {
    console.log('\n');
    console.table(tableData);
    console.log('\n');
}
//function to ask questions, repeat till user chooses to quit
function runCMS() {
    
     inquirer
     .prompt(cmsQuestions) //questions is the array of questions, passed to inquirer
     .then((response) => {
       //call correct function based on user choice    
         
         switch (response.action) {
             case "view all departments":
                return viewDepts();
                 break;
             case "view all roles":
                return viewRoles();
                 break;
             case "view all employees":
                return viewEmployees();
                break;
             case "add a department":
                 return addDept();
               break;
             case "add a role":
                 return addRole();
              break;
             case "add an employee":
              return addEmployee();
              break;
             case "update employee role":
              return updateEmployeeRole();
              break;
            case "view utilized budget by dept":
              return viewBudgetByDept();
              break;
             default:
                return doQuit();
                //return Promise.reject('Quit');
                //return process.exitCode = 0;
             break;
         }

     })
     .then((response) => {
        //display data in table format
        displayTableTemp(response[0]);
     }) 
     .then((response) => {
        //user did not choose to quit
        runCMS();
     }) 
     .catch(function(error) {
         //sqlManager.closeSQL();
         //sqlManager.closeSQL();
         console.log("Final Goodbye!\n"); //catch any errors and exit gracefully/    
     })
     
 }

// function to initialize app
function initCMS() {
    inquirer
  .prompt(welcomeQuestion) //questions is the array of questions, passed to inquirer
  
  .then((response) => {
    
    if (response.welcome === true) {
       return runCMS();
    } else {
         //user chose not to continue so exit
        return Promise.reject('Exit');
        console.log(chalk.blue("Goodbye!"));
    }
  })
  .catch(function(error) {
    console.log(chalk.blue("Goodbye!")); //catch any errors and exit gracefully
})
  
}


//start application
initCMS();