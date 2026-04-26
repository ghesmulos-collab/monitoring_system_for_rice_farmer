-- Database: monitoring_system_for_rice_farmer

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

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
  `farmer_id` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `crop`
(`crop_id`, `production_cost`, `planting_date`, `seed_type`, `growth_stage`, `fertilizer_type`, `quantity_applied`, `application_date`, `irrigation_method`, `expected_harvest_date`, `estimated_yield`, `market_price`, `created_at`, `farmer_id`)
VALUES
('crp-1', 1.00, '2026-04-22', 'NSIC Rc 222', 'Sowing', 'Nitrogen (Urea)', '1', '2026-04-24', 'Sprinkler', '2026-05-09', 1111.00, 1111.00, '2026-04-22 13:45:21', 'F-001'),
('crp-2', 111.00, '2026-04-24', 'NSIC Rc 222', 'Vegetative', 'Nitrogen (Urea)', '1', '2026-05-09', 'Sprinkler', '2026-05-16', 111.00, 1111.00, '2026-04-24 01:23:25', 'F-001'),
('crp-3', 111.00, '2026-04-24', 'Inbred Rice', 'Vegetative', 'Phosphorus', '1', '2026-05-02', 'Flood Irrigation', '2026-05-07', 1.00, 1.00, '2026-04-24 12:10:42', 'F-001');

CREATE TABLE `crop_status` (
  `Crop_Status_ID` int(11) NOT NULL,
  `Crop_Status` varchar(100) NOT NULL,
  `Crop_ID` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `crop_status` (`Crop_Status_ID`, `Crop_Status`, `Crop_ID`) VALUES
(10, 'Sowing', 'crp-1'),
(13, 'Vegetative', 'crp-2'),
(14, 'Vegetative', 'crp-3');

CREATE TABLE `farmer` (
  `farmer_id` varchar(50) NOT NULL,
  `farmer_name` varchar(100) NOT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `barangay` varchar(100) DEFAULT NULL,
  `municipality` varchar(100) DEFAULT NULL,
  `farm_size` decimal(10,2) DEFAULT NULL,
  `registration_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `farmer`
(`farmer_id`, `farmer_name`, `contact_number`, `barangay`, `municipality`, `farm_size`, `registration_date`, `created_at`)
VALUES
('f-001', 'hahahaha', '1234567890', 'Comaang', 'Clarin', 2.40, NULL, '2026-04-22 13:14:03'),
('f-002', 'shairylle sioco', '1234567890', 'Poblacion', 'Candijay', 2.40, NULL, '2026-04-24 12:04:06'),
('f-003', 'blababla', '1234567890', 'Remedios', 'Danao', 2.40, NULL, '2026-04-22 13:04:35');

CREATE TABLE `fertilizer_notification` (
  `fertilizer_notification_id` int(11) NOT NULL,
  `recommended_fertilizer` varchar(100) DEFAULT NULL,
  `notification_message` text DEFAULT NULL,
  `crop_id` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `fertilizer_notification`
(`fertilizer_notification_id`, `recommended_fertilizer`, `notification_message`, `crop_id`)
VALUES
(9, 'Nitrogen (Urea)', 'Plan created for Crop crp-1. Schedule basal fertilizer.', 'crp-1'),
(12, 'Nitrogen (Urea)', 'Plan created for Crop crp-2. Schedule basal fertilizer.', 'crp-2'),
(13, 'Phosphorus', 'Plan created for Crop crp-3. Schedule basal fertilizer.', 'crp-3');

CREATE TABLE `report` (
  `report_id` int(11) NOT NULL,
  `total_yield` decimal(10,2) DEFAULT NULL,
  `total_production` decimal(15,2) DEFAULT NULL,
  `crop_id` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `report`
(`report_id`, `total_yield`, `total_production`, `crop_id`)
VALUES
(9, 1111.00, 1.00, 'crp-1'),
(12, 111.00, 111.00, 'crp-2'),
(13, 1.00, 111.00, 'crp-3');

CREATE TABLE `suggested_schedule` (
  `suggested_schedule_id` int(11) NOT NULL,
  `application_schedule` date DEFAULT NULL,
  `days_remaining` int(11) DEFAULT NULL,
  `crop_id` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `suggested_schedule`
(`suggested_schedule_id`, `application_schedule`, `days_remaining`, `crop_id`)
VALUES
(33, NULL, 0, 'crp-1'),
(34, NULL, 15, 'crp-1'),
(35, NULL, 35, 'crp-1'),
(36, NULL, 110, 'crp-1'),
(45, NULL, 0, 'crp-2'),
(46, NULL, 15, 'crp-2'),
(47, NULL, 35, 'crp-2'),
(48, NULL, 110, 'crp-2'),
(49, NULL, 0, 'crp-3'),
(50, NULL, 15, 'crp-3'),
(51, NULL, 35, 'crp-3'),
(52, NULL, 110, 'crp-3');

CREATE TABLE `update_actual_yield` (
  `update_actual_yield_id` int(11) NOT NULL,
  `actual_yield` decimal(10,2) DEFAULT NULL,
  `crop_id` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `update_actual_yield`
(`update_actual_yield_id`, `actual_yield`, `crop_id`)
VALUES
(6, 22222.00, 'crp-1');

CREATE TABLE `user_account` (
  `User_ID` int(11) NOT NULL,
  `Username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `Farmer_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `user_account`
(`User_ID`, `Username`, `password`, `Farmer_ID`)
VALUES
(1, 'farmer', 'password', 1);

COMMIT;