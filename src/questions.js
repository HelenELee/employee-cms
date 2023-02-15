//use chalk to colour messages/error messages
var chalk = require('chalk');
let response = '';

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
        choices: ["Quit", "view all departments", "view all roles", "view all employees", "add a department", "add a role", "add an employee", "update employee role", "view utilized budget by dept"],
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

const roleQuestions = `
[{
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
        choices: ${response},
        message: 'What is the Department for this employee?',
        name: 'deptID',
        //this question is mandatory
        validate: deptID => {
          if (deptID) {
              return true;
          } else {
              console.log('Please provide a department id!');
              return false;
          }
        }
      }]
`

//export so can be used in index.js with Inquirer
module.exports = {
   welcomeQuestion : welcomeQuestion,
   cmsQuestions : cmsQuestions,
   dptQuestions : dptQuestions,
   roleQuestions : roleQuestions
}
