const mysql = require('mysql2');
const console = require('console');
const util = require('util');
//const readFile = util.promisify(fs.readFile);
//const doQuery = util.promisify(mysql.createConnection.query);

class SQLManager {
    constructor() {
        this.db = mysql.createConnection(
            {
              host: 'localhost',
              user: 'root',
              password: 'ILoveSQL2023!',
              database: 'employee_db'
            },
            console.log(`Connected to the employee_db database.`)
          );
    }

    getAllDepartments() {
        //doQuery('SELECT * FROM departments')
       // .then((result) => console.log(result))
        
        this.db.query('SELECT * FROM departments', function (err, results) {
            console.log('\n');
            console.table(results);
            
        });
        
    }

    getAllRoles() {
        this.db.query('SELECT * FROM roles', function (err, results) {
            console.log(results);
        });
    }
    
    closeSQL() {
        this.db.end();
    }
    
}

module.exports = SQLManager;
