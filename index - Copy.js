// Include packages needed for this application
const inquirer = require('inquirer');
//use chalk to colour message/error messages
var chalk = require('chalk');
//get SQL Manager Class
const SQLManager = require("./lib/SQLManager.js");
const sqlManager = new SQLManager();
//get arrays of questions used by inquirer
const {welcomeQuestion, cmsQuestions } = require("./src/questions.js");
const util = require('util');
const console = require('console');
//const getDepartments = util.promisify(sqlManager.getAllDepartments);

function doSQL(action) {
    console.log("doSQL - " + action + "\n");
    const sqlFunction=null;
    const tableTitle = "";
    
    switch (action) {
        case "view all departments":
            sqlFunction = sqlManager.getAllDepartments;
            tableTitle = "CMS - ALL DEPARTMENTS";
            break;
        case "view all roles":
           // console.log("chose - view all roles");
           sqlFunction =sqlManager.getAllRoles;
            tableTitle = "CMS - ALL ROLES"
            break;
        default:
            
        break;
    }

    sqlFunction()
    .then((response) => {
        console.log('\n');
        console.log(`   ${tableTitle}\n`);
        console.table(response[0]);
        console.log('\n');
    })
    .then((response) => {
        runCMS();
    })
    .catch(function(error) {
       // sqlManager.closeSQL();
        console.log("Error with viewDepts"); //catch any errors and exit gracefully/    
    })
}

/*
function viewDepts() {
    sqlManager.getAllDepartments()
    .then((response) => {
        console.log('\n');
        console.log('   CMS - ALL DEPARTMENTS\n');
        console.table(response[0]);
        console.log('\n');
    })
    .then((response) => {
        runCMS();
    })
    .catch(function(error) {
       // sqlManager.closeSQL();
        console.log("Error with viewDepts"); //catch any errors and exit gracefully/    
    })
}
*/
/*
function viewRoles() {
    sqlManager.getAllRoles()
    .then((response) => {
        console.log('\n');
        console.log('   CMS - ALL ROLES\n');
        console.table(response[0]);
        console.log('\n');
    })
    .then((response) => {
        runCMS();
    })
    .catch(function(error) {
       // sqlManager.closeSQL();
        console.log("Error with viewDepts"); //catch any errors and exit gracefully/    
    })
}
*/

function runCMS() {
   // console.log("inside runCMS");
    inquirer
    .prompt(cmsQuestions) //questions is the array of questions, passed to inquirer
    .then((response) => {
        
        //check user has not finished
        if (response.action !== "Quit") {
            doSQL(response.action);
            /*
           //console.log(response.action);
            switch (response.action) {
                case "view all departments":
                    viewDepts();
                    break;
                case "view all roles":
                   // console.log("chose - view all roles");
                    sqlManager.getAllRoles();
                    break;
                case "view all employees":
                    //.log("chose - view all employees");
                    break;
                default:
                    
                break;
            }
            */

           // console.log("waiting after case");
            return response;
        } else {
            return Promise.reject('Exit');
            //console.log(chalk.blue("Goodbye from CMS!"));
            //return;
        }
        
    })
    .then((response) => {
        if (response.action !== "Quit") {
            runCMS();
        } else {
            return Promise.reject('Exit');
        }
    }) 
    .catch(function(error) {
        sqlManager.closeSQL();
        console.log("Goodbye!\n"); //catch any errors and exit gracefully/    
    })
    
}

// function to initialize app
function init() {
    inquirer
  .prompt(welcomeQuestion) //questions is the array of questions, passed to inquirer
  
  .then((response) => {
    //console.log(response);
    if (response.welcome === true) {
       //console.log("run CMS");
       runCMS();
       //console.log("back here!");
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