-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 25, 2026 at 01:53 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `monitoring_system_for_rice_farmer`
--

-- --------------------------------------------------------

--
-- Table structure for table `crop`
--

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

--
-- Dumping data for table `crop`
--

INSERT INTO `crop` (`crop_id`, `production_cost`, `planting_date`, `seed_type`, `growth_stage`, `fertilizer_type`, `quantity_applied`, `application_date`, `irrigation_method`, `expected_harvest_date`, `estimated_yield`, `market_price`, `created_at`, `farmer_id`) VALUES
('crp-1', 1.00, '2026-04-22', 'NSIC Rc 222', 'Sowing', 'Nitrogen (Urea)', '1', '2026-04-24', 'Sprinkler', '2026-05-09', 1111.00, 1111.00, '2026-04-22 13:45:21', 'F-001'),
('crp-2', 111.00, '2026-04-24', 'NSIC Rc 222', 'Vegetative', 'Nitrogen (Urea)', '1', '2026-05-09', 'Sprinkler', '2026-05-16', 111.00, 1111.00, '2026-04-24 01:23:25', 'F-001'),
('crp-3', 111.00, '2026-04-24', 'Inbred Rice', 'Vegetative', 'Phosphorus', '1', '2026-05-02', 'Flood Irrigation', '2026-05-07', 1.00, 1.00, '2026-04-24 12:10:42', 'F-001');

-- --------------------------------------------------------

--
-- Table structure for table `crop_status`
--

CREATE TABLE `crop_status` (
  `Crop_Status_ID` int(11) NOT NULL,
  `Crop_Status` varchar(100) NOT NULL,
  `Crop_ID` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `crop_status`
--

INSERT INTO `crop_status` (`Crop_Status_ID`, `Crop_Status`, `Crop_ID`) VALUES
(10, 'Sowing', 'crp-1'),
(13, 'Vegetative', 'crp-2'),
(14, 'Vegetative', 'crp-3');

-- --------------------------------------------------------

--
-- Table structure for table `farmer`
--

CREATE TABLE `farmer` (
  `farmer_id` varchar(50) NOT NULL,
  `farmer_name` varchar(100) NOT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `barangay` varchar(100) DEFAULT NULL,
  `municipality` varchar(100) DEFAULT NULL,
  `farm_size` decimal(10,2) DEFAULT NULL,
  `registration_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `farmer`
--

INSERT INTO `farmer` (`farmer_id`, `farmer_name`, `contact_number`, `barangay`, `municipality`, `farm_size`, `registration_date`, `created_at`) VALUES
('f-001', 'hahahaha', '1234567890', 'Comaang', 'Clarin', 2.40, '0000-00-00', '2026-04-22 13:14:03'),
('f-002', 'shairylle sioco', '1234567890', 'Poblacion', 'Candijay', 2.40, '0000-00-00', '2026-04-24 12:04:06'),
('f-003', 'blababla', '1234567890', 'Remedios', 'Danao', 2.40, '0000-00-00', '2026-04-22 13:04:35');

-- --------------------------------------------------------

--
-- Table structure for table `fertilizer_notification`
--

CREATE TABLE `fertilizer_notification` (
  `fertilizer_notification_id` int(11) NOT NULL,
  `recommended_fertilizer` varchar(100) DEFAULT NULL,
  `notification_message` text DEFAULT NULL,
  `crop_id` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `fertilizer_notification`
--

INSERT INTO `fertilizer_notification` (`fertilizer_notification_id`, `recommended_fertilizer`, `notification_message`, `crop_id`) VALUES
(9, 'Nitrogen (Urea)', 'Plan created for Crop crp-1. Schedule basal fertilizer.', 'crp-1'),
(12, 'Nitrogen (Urea)', 'Plan created for Crop crp-2. Schedule basal fertilizer.', 'crp-2'),
(13, 'Phosphorus', 'Plan created for Crop crp-3. Schedule basal fertilizer.', 'crp-3');

-- --------------------------------------------------------

--
-- Table structure for table `report`
--

CREATE TABLE `report` (
  `report_id` int(11) NOT NULL,
  `total_yield` decimal(10,2) DEFAULT NULL,
  `total_production` decimal(15,2) DEFAULT NULL,
  `crop_id` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `report`
--

INSERT INTO `report` (`report_id`, `total_yield`, `total_production`, `crop_id`) VALUES
(9, 1111.00, 1.00, 'crp-1'),
(12, 111.00, 111.00, 'crp-2'),
(13, 1.00, 111.00, 'crp-3');

-- --------------------------------------------------------

--
-- Table structure for table `suggested_schedule`
--

CREATE TABLE `suggested_schedule` (
  `suggested_schedule_id` int(11) NOT NULL,
  `application_schedule` date DEFAULT NULL,
  `days_remaining` int(11) DEFAULT NULL,
  `crop_id` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `suggested_schedule`
--

INSERT INTO `suggested_schedule` (`suggested_schedule_id`, `application_schedule`, `days_remaining`, `crop_id`) VALUES
(33, '0000-00-00', 0, 'crp-1'),
(34, '0000-00-00', 15, 'crp-1'),
(35, '0000-00-00', 35, 'crp-1'),
(36, '0000-00-00', 110, 'crp-1'),
(45, '0000-00-00', 0, 'crp-2'),
(46, '0000-00-00', 15, 'crp-2'),
(47, '0000-00-00', 35, 'crp-2'),
(48, '0000-00-00', 110, 'crp-2'),
(49, '0000-00-00', 0, 'crp-3'),
(50, '0000-00-00', 15, 'crp-3'),
(51, '0000-00-00', 35, 'crp-3'),
(52, '0000-00-00', 110, 'crp-3');

-- --------------------------------------------------------

--
-- Table structure for table `update_actual_yield`
--

CREATE TABLE `update_actual_yield` (
  `update_actual_yield_id` int(11) NOT NULL,
  `actual_yield` decimal(10,2) DEFAULT NULL,
  `crop_id` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `update_actual_yield`
--

INSERT INTO `update_actual_yield` (`update_actual_yield_id`, `actual_yield`, `crop_id`) VALUES
(6, 22222.00, 'crp-1');

-- --------------------------------------------------------

--
-- Table structure for table `user_account`
--

CREATE TABLE `user_account` (
  `User_ID` int(11) NOT NULL,
  `Username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `Farmer_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_account`
--

INSERT INTO `user_account` (`User_ID`, `Username`, `password`, `Farmer_ID`) VALUES
(1, 'farmer', 'password', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `crop`
--
ALTER TABLE `crop`
  ADD PRIMARY KEY (`crop_id`),
  ADD KEY `fk_farmer_crop` (`farmer_id`);

--
-- Indexes for table `crop_status`
--
ALTER TABLE `crop_status`
  ADD PRIMARY KEY (`Crop_Status_ID`),
  ADD KEY `fk_status_crop` (`Crop_ID`);

--
-- Indexes for table `farmer`
--
ALTER TABLE `farmer`
  ADD PRIMARY KEY (`farmer_id`);

--
-- Indexes for table `fertilizer_notification`
--
ALTER TABLE `fertilizer_notification`
  ADD PRIMARY KEY (`fertilizer_notification_id`),
  ADD KEY `crop_id` (`crop_id`);

--
-- Indexes for table `report`
--
ALTER TABLE `report`
  ADD PRIMARY KEY (`report_id`),
  ADD UNIQUE KEY `crop_id` (`crop_id`);

--
-- Indexes for table `suggested_schedule`
--
ALTER TABLE `suggested_schedule`
  ADD PRIMARY KEY (`suggested_schedule_id`),
  ADD KEY `crop_id` (`crop_id`);

--
-- Indexes for table `update_actual_yield`
--
ALTER TABLE `update_actual_yield`
  ADD PRIMARY KEY (`update_actual_yield_id`),
  ADD KEY `crop_id` (`crop_id`);

--
-- Indexes for table `user_account`
--
ALTER TABLE `user_account`
  ADD PRIMARY KEY (`User_ID`),
  ADD UNIQUE KEY `Username` (`Username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `crop_status`
--
ALTER TABLE `crop_status`
  MODIFY `Crop_Status_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `fertilizer_notification`
--
ALTER TABLE `fertilizer_notification`
  MODIFY `fertilizer_notification_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `report`
--
ALTER TABLE `report`
  MODIFY `report_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `suggested_schedule`
--
ALTER TABLE `suggested_schedule`
  MODIFY `suggested_schedule_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `update_actual_yield`
--
ALTER TABLE `update_actual_yield`
  MODIFY `update_actual_yield_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `user_account`
--
ALTER TABLE `user_account`
  MODIFY `User_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `crop`
--
ALTER TABLE `crop`
  ADD CONSTRAINT `fk_farmer_crop` FOREIGN KEY (`farmer_id`) REFERENCES `farmer` (`farmer_id`) ON DELETE CASCADE;

--
-- Constraints for table `crop_status`
--
ALTER TABLE `crop_status`
  ADD CONSTRAINT `fk_status_crop` FOREIGN KEY (`Crop_ID`) REFERENCES `crop` (`crop_id`) ON DELETE CASCADE;

--
-- Constraints for table `fertilizer_notification`
--
ALTER TABLE `fertilizer_notification`
  ADD CONSTRAINT `fertilizer_notification_ibfk_1` FOREIGN KEY (`crop_id`) REFERENCES `crop` (`crop_id`) ON DELETE CASCADE;

--
-- Constraints for table `report`
--
ALTER TABLE `report`
  ADD CONSTRAINT `report_ibfk_1` FOREIGN KEY (`crop_id`) REFERENCES `crop` (`crop_id`) ON DELETE CASCADE;

--
-- Constraints for table `suggested_schedule`
--
ALTER TABLE `suggested_schedule`
  ADD CONSTRAINT `suggested_schedule_ibfk_1` FOREIGN KEY (`crop_id`) REFERENCES `crop` (`crop_id`) ON DELETE CASCADE;

--
-- Constraints for table `update_actual_yield`
--
ALTER TABLE `update_actual_yield`
  ADD CONSTRAINT `update_actual_yield_ibfk_1` FOREIGN KEY (`crop_id`) REFERENCES `crop` (`crop_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
