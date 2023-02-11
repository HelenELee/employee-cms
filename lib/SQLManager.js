const mysql = require('mysql2');

class SQLManager {
    constructor() {
        this.db = mysql.createConnection(
            {
              host: 'localhost',
              user: 'root',
              password: '',
              database: 'employee_db'
            },
            console.log(`Connected to the employee_db database.`)
          );
    }

    getAllDepartments() {
        db.query('SELECT * FROM departments', function (err, results) {
            console.log(results);
        });
    }
    
}

module.exports = SQLManager;
