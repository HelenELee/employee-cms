// Include packages needed for this application
const inquirer = require('inquirer');
///use chalk to colour message/error messages
var chalk = require('chalk');
//get SQL Manager Class
//const SQLManager = require("./lib/SQLManager.js");
//const sqlManager = new SQLManager();
//get arrays of questions used by inquirer
const {welcomeQuestion, cmsQuestions, dptQuestions } = require("./src/questions.js");
const {viewRoles, viewDepts, addDept, addRole, viewEmployees, addEmployee, updateEmployeeRole, viewEmployeesByMgr, viewBudgetByDept, doQuit } = require("./lib/cms-sql.js");
//const {runCMS, initCMS } = require("./lib/cms-manager.js");

//const console = require('console');
function displayTableTemp(tableTitle, tableData) {
    console.log('\n');
    console.log(`   ${tableTitle}\n`);
    console.table(tableData);
    console.log('\n');
}

function runCMS() {
    // console.log("inside runCMS");
     inquirer
     .prompt(cmsQuestions) //questions is the array of questions, passed to inquirer
     .then((response) => {
       console.log("action = " + response.action);
       
         switch (response.action) {
             case "view all departments":
                // sqlFunction = 
                return viewDepts();
                 break;
             case "view all roles":
                // console.log("chose - view all roles");
                return viewRoles();
                 break;
             case "view all employees":
                  // console.log("chose - view all roles");
                return viewEmployees();
                break;
             case "add a department":
                 return addDept();
               break;
             case "add a role":
                console.log("Chose to add a role");
                return addRole();
              break;
             case "add an employee":
                console.log("chose add employee");
                return addEmployee();
              break;
             case "update employee role":
                //console.log("chose add employee");
                return updateEmployeeRole();
              break;
            case "view utilized budget by dept":
                //console.log("chose add employee");
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
        //console.log("RUNNING CMS AGAIN!!!");
        displayTableTemp("ALL DEPARTMENTS", response[0]);
     }) 
     .then((response) => {
        //console.log("RUNNING CMS AGAIN!!!");
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
    //console.log(response);
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