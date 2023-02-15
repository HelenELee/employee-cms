// Include packages needed for this application
const inquirer = require('inquirer');
//use chalk to colour message/error messages
var chalk = require('chalk');
//get arrays of questions used by inquirer
const {welcomeQuestion, cmsQuestions, dptQuestions } = require("../src/questions.js");
const {viewRoles, viewDepts, addDept } = require("./cms-sql.js");

function runCMS() {
    // console.log("inside runCMS");
     inquirer
     .prompt(cmsQuestions) //questions is the array of questions, passed to inquirer
     .then((response) => {
         switch (response.action) {
             case "view all departments":
                // sqlFunction = 
                viewDepts();
                 break;
             case "view all roles":
                // console.log("chose - view all roles");
                viewRoles();
                 break;
             case "view all employees":
                  // console.log("chose - view all roles");
                viewEmployees();
                break;
             case "add a department":
                 addDept();
               break;
             default:
                return Promise.reject('Quit');
             break;
         }
         
     })
     .then((response) => {
         runCMS();
     }) 
     .catch(function(error) {
         sqlManager.closeSQL();
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
       runCMS();
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


 module.exports = {
    runCMS : runCMS,
    initCMS : initCMS
 }

 