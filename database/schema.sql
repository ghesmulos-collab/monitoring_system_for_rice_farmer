-- 1. Setup the Database
CREATE DATABASE IF NOT EXISTS monitoring_system_for_rice_farmer;
USE monitoring_system_for_rice_farmer;

-- 2. Farmer Table (Parent)
CREATE TABLE Farmer (
    Farmer_ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Contact_Number VARCHAR(20),
    Barangay VARCHAR(100),
    Municipality VARCHAR(100),
    Farm_Size DECIMAL(10, 2),
    Rice_Variety VARCHAR(100)
    registration_date DATE
);

-- 3. User_Account (Login Table - Added)
CREATE TABLE User_Account (
    User_ID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Password_Hash VARCHAR(255) NOT NULL, 
    Email VARCHAR(100) UNIQUE,
    Farmer_ID INT UNIQUE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Farmer_ID) REFERENCES Farmer(Farmer_ID) ON DELETE CASCADE
);

-- 4. Crop Table (Child of Farmer)
CREATE TABLE Crop (
    Crop_ID INT AUTO_INCREMENT PRIMARY KEY,
    Planting_Date DATE,
    Seed_Type VARCHAR(100),
    Growth_Stage VARCHAR(50),
    Expected_Harvest_Date DATE,
    Irrigation_Method VARCHAR(100),
    Estimated_Yield DECIMAL(10, 2),
    Market_Price DECIMAL(10, 2),
    Production_Cost DECIMAL(10, 2),
    Farmer_ID INT,
    FOREIGN KEY (Farmer_ID) REFERENCES Farmer(Farmer_ID) ON DELETE CASCADE
);

-- 5. Suggested_Schedule Table
CREATE TABLE Suggested_Schedule (
    Suggested_Schedule_ID INT AUTO_INCREMENT PRIMARY KEY,
    Growth_Stage VARCHAR(50),
    Fertilizer_Type VARCHAR(100),
    Application_Schedule VARCHAR(255),
    Expected_Harvest_Date DATE,
    Estimated_Yield DECIMAL(10, 2),
    Days_Remaining INT,
    Crop_ID INT,
    FOREIGN KEY (Crop_ID) REFERENCES Crop(Crop_ID) ON DELETE CASCADE
);

-- 6. Fertilizer_Notification Table
CREATE TABLE Fertilizer_Notification (
    Fertilizer_Notification_ID INT AUTO_INCREMENT PRIMARY KEY,
    Recommended_Fertilizer VARCHAR(100),
    Application_Date DATE,
    Notification_Message TEXT,
    Crop_ID INT,
    FOREIGN KEY (Crop_ID) REFERENCES Crop(Crop_ID) ON DELETE CASCADE
);

-- 7. Report Table
CREATE TABLE Report (
    Report_ID INT AUTO_INCREMENT PRIMARY KEY,
    Total_Yield DECIMAL(10, 2),
    Total_Production DECIMAL(10, 2),
    Crop_ID INT,
    FOREIGN KEY (Crop_ID) REFERENCES Crop(Crop_ID) ON DELETE CASCADE
);

-- 8. Crop_Status Table
CREATE TABLE Crop_Status (
    Crop_Status_ID INT AUTO_INCREMENT PRIMARY KEY,
    Growth_Stage VARCHAR(50),
    Crop_Status VARCHAR(100),
    Crop_ID INT,
    FOREIGN KEY (Crop_ID) REFERENCES Crop(Crop_ID) ON DELETE CASCADE
);

-- 9. Update_Actual_Yield Table
CREATE TABLE Update_Actual_Yield (
    Update_Actual_Yield_ID INT AUTO_INCREMENT PRIMARY KEY,
    Actual_Yield DECIMAL(10, 2),
    Farmer_ID INT,
    Crop_ID INT,
    FOREIGN KEY (Farmer_ID) REFERENCES Farmer(Farmer_ID) ON DELETE CASCADE,
    FOREIGN KEY (Crop_ID) REFERENCES Crop(Crop_ID) ON DELETE CASCADE
);

-- 10. INSERT TEST DATA (So you can log in immediately)
INSERT INTO Farmer (Name, Barangay, Municipality) 
VALUES ('Juan Dela Cruz', 'Poblacion', 'Urdaneta');

-- Note: 'pass123' is your test password
INSERT INTO User_Account (Username, Password_Hash, Farmer_ID) 
VALUES ('farmer1', 'pass123', 1);