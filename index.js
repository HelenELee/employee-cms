// Include packages needed for this application
const inquirer = require('inquirer');
//use chalk to colour message/error messages
var chalk = require('chalk');
//get SQL Manager Class
const SQLManager = require("./lib/SQLManager.js");
const sqlManager = new SQLManager();
//get arrays of questions used by inquirer
const {welcomeQuestion, cmsQuestions } = require("./src/questions.js");


function runCMS() {
    console.log("inside runCMS");
    inquirer
    .prompt(cmsQuestions) //questions is the array of questions, passed to inquirer
    .then((response) => {
        
        //check user has not finished
        if (response.action !== "Quit") {
           console.log(response.action);
            switch (response.action) {
                case "view all departments":
                    console.log("view all departments");
                    break;
                case "view all roles":
                    console.log("view all roles");
                    break;
                case "view all employees":
                    console.log("view all employees");
                    break;
                default:
                    
                break;
            }
            
            return;
        } else {
            return Promise.reject('Exit');
            console.log(chalk.blue("Goodbye from CMS!"));
        }

    })
    //.then((response) => {
    //   console.log("here doing nothing...");
    //})
    .catch(function(error) {
        console.log("Goodbye!"); //catch any errors and exit gracefully/    
    })
    
}

// function to initialize app
function init() {
    inquirer
  .prompt(welcomeQuestion) //questions is the array of questions, passed to inquirer
  
  .then((response) => {
    console.log(response);
    if (response.welcome === true) {
       console.log("run CMS");
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
//start application
init();