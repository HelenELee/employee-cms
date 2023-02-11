INSERT INTO departments (name)
VALUES ("Executive"),
       ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");

INSERT INTO roles (title, salary, department_id)
VALUES ("CEO", 150000, 1),
       ("General Manager", 130000, 1),
       ("Customer Service", 55000, 2),
       ("Engineer", 100000, 3),
       ("Accountant", 95000, 4),
       ("Solicitor", 120000, 5);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Jack", "Brown", 1, NULL),
       ("Jess", "Black", 2, 1), -- 
       ("Jill", "White", 3, 2),
       ("Jodie", "Green", 4, 2),
       ("John", "Murphy", 5, 2),
       ("James", "Lynch", 6, 2);
       
