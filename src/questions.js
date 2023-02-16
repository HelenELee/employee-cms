//use chalk to colour messages/error messages
var chalk = require('chalk');
let response = '';

const welcomeQuestion = [
    {
        //first questions is instructions
        type: 'confirm',
        message: chalk.green('--------------------------------------------------\n\n' +
        'Welcome to the Employee Content Management System\n\n' +
        '----------------------------------------------------\n' +
        'Are you ready to begin?\n'),
        name: 'welcome',

    }
]

const cmsQuestions = [
    {
        type: 'list',
        choices: ["Quit", 
        "view all departments", 
        "view all roles", 
        "view all employees", 
        "add a department", 
        "add a role", 
        "add an employee", 
        "update employee role", 
        "update employee manager",
        "view employees by manager",
        "view employees by department",
        "view utilized budget by dept"],
        message: chalk.blue("What would you like to do?\n\n"),
        name: 'action',
         //this question is mandatory
        validate: action => {
          if (action) {
              return true;
          } else {
              console.log(chalk.red("Please select an action!"));
              return false;
          }
        }
    }
]

const dptQuestions = [
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
]



//export so can be used in index.js with Inquirer
module.exports = {
   welcomeQuestion : welcomeQuestion,
   cmsQuestions : cmsQuestions,
   dptQuestions : dptQuestions,
   
}
