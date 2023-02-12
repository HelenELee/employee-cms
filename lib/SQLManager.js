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
        //console.log("inside getAllDepartmets\n");
       return this.db.promise().query('SELECT * FROM departments');
    }

    getAllRoles() {
        /*
        this.db.query('SELECT * FROM roles', function (err, results) {
            console.log('\n');
            console.table(results);
        });
        */
        return this.db.promise().query('SELECT * FROM roles');
    }
    
    closeSQL() {
        this.db.end();
    }
    
}

module.exports = SQLManager;
