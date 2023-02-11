/*
SELECT employees.first_name AS firstName, employees.last_name AS lastName, roles.title AS role
FROM employees
JOIN roles ON employees.role_id = roles.id;

SELECT employees.first_name AS firstName, employees.last_name AS lastName, roles.title AS role, departments.name AS department
FROM employees
JOIN roles ON employees.role_id = roles.id
JOIN departments ON roles.department_id = departments.id;



SELECT emps.first_name AS firstName, 
       emps.last_name AS lastName, 
       roles.title AS role, 
       departments.name AS department, 
       managers.last_name AS manager
FROM employees emps
JOIN roles ON emps.role_id = roles.id
JOIN departments ON roles.department_id = departments.id
JOIN employees managers ON emps.manager_id = managers.id;

-- view all roles --
SELECT roles.title As role,
       roles.id AS roleID,
       roles.salary AS salary,
       departments.name as department
FROM roles
JOIN departments ON roles.department_id = departments.id;
*/

/*
-- view all employees --
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
WHERE emps.manager_id IS NULL;
-- TO DO add in order by id --
*/

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

