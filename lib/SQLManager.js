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
       return this.db.promise().query('SELECT * FROM departments');
    }

    getAllRoles() {
        return this.db.promise().query('SELECT * FROM roles');
    }
    
    getAllEmployees() {
        let qry = `
        SELECT emps.id AS ID,
                emps.first_name AS firstName, 
                emps.last_name AS lastName, 
                roles.title AS role, 
                departments.name AS department, 
                roles.salary AS salary,
                managers.last_name AS manager
        FROM employees emps
        JOIN roles ON emps.role_id = roles.id
        JOIN departments ON roles.department_id = departments.id
        JOIN employees managers ON (emps.manager_id = managers.id)
        UNION
        SELECT emps.id AS ID,
                emps.first_name AS firstName, 
                emps.last_name AS lastName, 
                roles.title AS role, 
                departments.name AS department, 
                roles.salary AS salary,
                " "   
        FROM employees emps
        JOIN roles ON emps.role_id = roles.id
        JOIN departments ON roles.department_id = departments.id
        WHERE emps.manager_id IS NULL
        ORDER by ID;
        `
        return this.db.promise().query(qry);

    }

    addDept(deptName) {
        qry = `
        INSERT INTO departments (name)
        VALUES (${deptName};
        `
        return this.db.promise().query(qry);
    }

    closeSQL() {
        this.db.end();
        return process.exit(0);
    }
    
}

module.exports = SQLManager;
