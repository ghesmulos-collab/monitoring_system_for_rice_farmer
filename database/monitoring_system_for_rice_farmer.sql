-- =========================================
-- DATABASE: monitoring_system_for_rice_farmer
-- FINAL FIXED PRODUCTION VERSION
-- =========================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- =========================================
-- FARMER TABLE
-- =========================================
CREATE TABLE `farmer` (
  `farmer_id` varchar(50) NOT NULL,
  `farmer_name` varchar(100) NOT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `barangay` varchar(100) DEFAULT NULL,
  `municipality` varchar(100) DEFAULT NULL,
  `farm_size` decimal(10,2) DEFAULT NULL,
  `registration_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`farmer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `farmer` VALUES
('f-001', 'hahahaha', '1234567890', 'Comaang', 'Clarin', 2.40, NULL, CURRENT_TIMESTAMP),
('f-002', 'shairylle sioco', '1234567890', 'Poblacion', 'Candijay', 2.40, NULL, CURRENT_TIMESTAMP),
('f-003', 'blababla', '1234567890', 'Remedios', 'Danao', 2.40, NULL, CURRENT_TIMESTAMP);

-- =========================================
-- CROP TABLE (MASTER TABLE)
-- =========================================
CREATE TABLE `crop` (
  `crop_id` varchar(50) NOT NULL,
  `production_cost` decimal(15,2) DEFAULT NULL,
  `planting_date` date DEFAULT NULL,
  `seed_type` varchar(100) DEFAULT NULL,
  `growth_stage` varchar(50) DEFAULT NULL,
  `fertilizer_type` varchar(100) DEFAULT NULL,
  `quantity_applied` varchar(50) DEFAULT NULL,
  `application_date` date DEFAULT NULL,
  `irrigation_method` varchar(100) DEFAULT NULL,
  `expected_harvest_date` date DEFAULT NULL,
  `estimated_yield` decimal(10,2) DEFAULT NULL,
  `market_price` decimal(15,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `farmer_id` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`crop_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `crop` VALUES
('crp-1',1.00,'2026-04-22','NSIC Rc 222','Sowing','Nitrogen (Urea)','1','2026-04-24','Sprinkler','2026-05-09',1111.00,1111.00,CURRENT_TIMESTAMP,'f-001'),
('crp-2',111.00,'2026-04-24','NSIC Rc 222','Vegetative','Nitrogen (Urea)','1','2026-05-09','Sprinkler','2026-05-16',111.00,1111.00,CURRENT_TIMESTAMP,'f-001'),
('crp-3',111.00,'2026-04-24','Inbred Rice','Vegetative','Phosphorus','1','2026-05-02','Flood Irrigation','2026-05-07',1.00,1.00,CURRENT_TIMESTAMP,'f-001');

-- =========================================
-- CROP STATUS TABLE
-- =========================================
CREATE TABLE `crop_status` (
  `crop_status_id` int NOT NULL AUTO_INCREMENT,
  `crop_status` varchar(100) NOT NULL,
  `crop_id` varchar(50) NOT NULL,
  PRIMARY KEY (`crop_status_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `crop_status` (`crop_status`,`crop_id`) VALUES
('Sowing','crp-1'),
('Vegetative','crp-2'),
('Vegetative','crp-3');

-- =========================================
-- FERTILIZER NOTIFICATION TABLE
-- =========================================
CREATE TABLE `fertilizer_notification` (
  `fertilizer_notification_id` int NOT NULL AUTO_INCREMENT,
  `recommended_fertilizer` varchar(100) DEFAULT NULL,
  `notification_message` text DEFAULT NULL,
  `crop_id` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`fertilizer_notification_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `fertilizer_notification`
(`recommended_fertilizer`,`notification_message`,`crop_id`) VALUES
('Nitrogen (Urea)','Plan created for Crop crp-1. Schedule basal fertilizer application.','crp-1'),
('Nitrogen (Urea)','Plan created for Crop crp-2. Schedule basal fertilizer application.','crp-2'),
('Phosphorus','Plan created for Crop crp-3. Schedule basal fertilizer application.','crp-3');

-- =========================================
-- SUGGESTED SCHEDULE TABLE (FIXED)
-- =========================================
CREATE TABLE `suggested_schedule` (
  `suggested_schedule_id` int NOT NULL AUTO_INCREMENT,
  `application_schedule` varchar(100) DEFAULT NULL,
  `application_date` date DEFAULT NULL,
  `fertilizer_type` varchar(100) DEFAULT NULL,
  `days_remaining` int DEFAULT NULL,
  `crop_id` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`suggested_schedule_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `suggested_schedule`
(`application_schedule`,`application_date`,`fertilizer_type`,`days_remaining`,`crop_id`) VALUES
('Basal Application','2026-04-22','Nitrogen (Urea)',0,'crp-1'),
('First Top Dress','2026-05-07','Nitrogen (Urea)',15,'crp-1'),
('Second Top Dress','2026-05-27','Ammonium Sulfate',35,'crp-1'),
('Harvesting','2026-08-10','Potassium',110,'crp-1'),

('Basal Application','2026-04-24','Nitrogen (Urea)',0,'crp-2'),
('First Top Dress','2026-05-09','Nitrogen (Urea)',15,'crp-2'),
('Second Top Dress','2026-05-29','Ammonium Sulfate',35,'crp-2'),
('Harvesting','2026-08-12','Potassium',110,'crp-2'),

('Basal Application','2026-04-24','Phosphorus',0,'crp-3'),
('First Top Dress','2026-05-09','Nitrogen (Urea)',15,'crp-3'),
('Second Top Dress','2026-05-29','Ammonium Sulfate',35,'crp-3'),
('Harvesting','2026-08-12','Potassium',110,'crp-3');

-- =========================================
-- UPDATE ACTUAL YIELD TABLE
-- =========================================
CREATE TABLE `update_actual_yield` (
  `update_actual_yield_id` int NOT NULL AUTO_INCREMENT,
  `actual_yield` decimal(10,2) DEFAULT NULL,
  `crop_id` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`update_actual_yield_id`),
  UNIQUE KEY `unique_crop_yield` (`crop_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `update_actual_yield` (`actual_yield`,`crop_id`) VALUES
(22222.00,'crp-1');

-- =========================================
-- REPORT TABLE
-- =========================================
CREATE TABLE `report` (
  `report_id` int NOT NULL AUTO_INCREMENT,
  `total_yield` decimal(10,2) DEFAULT NULL,
  `total_production` decimal(15,2) DEFAULT NULL,
  `crop_id` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`report_id`),
  UNIQUE KEY `unique_crop_report` (`crop_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `report`
(`total_yield`,`total_production`,`crop_id`) VALUES
(1111.00,1.00,'crp-1'),
(111.00,111.00,'crp-2'),
(1.00,111.00,'crp-3');

-- =========================================
-- USER ACCOUNT TABLE
-- =========================================
CREATE TABLE `user_account` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `farmer_id` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `user_account`
(`username`,`password`,`farmer_id`) VALUES
('farmer','password','f-001');

COMMIT;