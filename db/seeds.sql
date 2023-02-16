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
       ("Solicitor", 120000, 5),
       ("Head of Finance", 195000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Jack", "Brown", 1, NULL),
       ("Jess", "Black", 2, 1), -- 
       ("Brian", "Duff", 5, 7),
       ("James", "Lynch", 6, 2),
       ("Jodie", "Green", 4, 2),
       ("John", "Murphy", 5, 7),
       ("Lisa", "Murphy", 7, 1),
       ("Anna", "Flynn", 6, 2),
       ("James", "Lynch", 6, 2);
       
