//use chalk to colour messages/error messages
var chalk = require('chalk');

const welcomeQuestion = [
    {
        //first questions is instructions
        type: 'confirm',
        message: chalk.blue('------------------------------\n' +
        'Welcome to the Employee Content Management System\n' +
        '--------------------------------\n' +
        'Are you ready to begin?'),
        name: 'welcome',

    }
]

const cmsQuestions = [
    {
        type: 'list',
        choices: ["view all departments", "view all roles", "view all employees", "add a department", "add a role", "add an employee", "update an employee role", "Quit"],
        message: "What would you like to do?",
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

//export so can be used in index.js with Inquirer
module.exports = {
   welcomeQuestion : welcomeQuestion,
   cmsQuestions : cmsQuestions 
}
