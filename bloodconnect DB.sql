create database bloodconnect;
use bloodconnect;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);
select * from users;


CREATE TABLE donordetails (
  id INT PRIMARY KEY AUTO_INCREMENT,
  fullName VARCHAR(100), 
  age INT,
  gender ENUM('male','female'),
  bloodGroup ENUM('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'),
  email  VARCHAR(100),
  phoneNumber  VARCHAR(15),
  lastDonation DATE, 
  address VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
 select * from donordetails;


CREATE TABLE blood_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fullName VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phoneNumber VARCHAR(15) NOT NULL,
  bloodGroup VARCHAR(5) NOT NULL,
  amount INT NOT NULL,
  location VARCHAR(255) NOT NULL,
  urgency ENUM('Low', 'Moderate', 'High', 'Critical') NOT NULL,
  requestDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
select * from blood_requests;
