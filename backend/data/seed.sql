-- Insert sample users
INSERT INTO users (username, password) VALUES
('MekoDeko', 'hashedpassword1');

-- Insert sample classes
INSERT INTO classes (name) VALUES
('Math'),
('Science'),
('History');

-- Insert sample students
INSERT INTO students (name, email, age) VALUES
('John Doe', 'john@example.com', 20),
('Jane Smith', 'jane@example.com', 22),
('Michael Johnson', 'michael@example.com', 21);

-- Insert sample student-class associations
INSERT INTO student_classes (student_id, class_id) VALUES
(1, 1), -- John Doe takes Math
(1, 2), -- John Doe takes Science
(2, 2), -- Jane Smith takes Science
(3, 1), -- Michael Johnson takes Math
(3, 3); -- Michael Johnson takes History