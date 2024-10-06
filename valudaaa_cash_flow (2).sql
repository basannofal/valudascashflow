-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 04, 2024 at 02:31 PM
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
-- Database: `valudaaa_cash_flow`
--

-- --------------------------------------------------------

--
-- Table structure for table `cf_auth_info`
--

CREATE TABLE `cf_auth_info` (
  `id` int(11) NOT NULL,
  `name` tinytext NOT NULL,
  `number` tinytext NOT NULL,
  `email` tinytext NOT NULL,
  `username` tinytext NOT NULL,
  `password` tinytext NOT NULL,
  `is_admin` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cf_auth_info`
--

INSERT INTO `cf_auth_info` (`id`, `name`, `number`, `email`, `username`, `password`, `is_admin`) VALUES
(1, 'Rizvan', '7698648215', '', 'rizvan123', 'rizvan123', 0),
(23, 'Admin', '', '', 'admin', 'admin', 1);

-- --------------------------------------------------------

--
-- Table structure for table `cf_borrow_payment`
--

CREATE TABLE `cf_borrow_payment` (
  `id` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  `date` date NOT NULL,
  `note` tinytext NOT NULL,
  `m_id` int(11) NOT NULL,
  `bail_m_id` int(11) NOT NULL,
  `bail_m_id2` int(11) NOT NULL,
  `given_by` tinytext NOT NULL,
  `given_user` tinytext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cf_borrow_payment`
--

INSERT INTO `cf_borrow_payment` (`id`, `amount`, `date`, `note`, `m_id`, `bail_m_id`, `bail_m_id2`, `given_by`, `given_user`) VALUES
(21, 8999, '2023-08-23', '', 15, 14, 0, 'nofal', 'basannofal'),
(22, 8999, '2023-08-23', '', 15, 14, 0, 'nofal', 'basannofal'),
(23, 50000, '2023-08-27', '', 21, 17, 0, 'self', 'basannofal'),
(30, 25000, '2023-09-07', '', 30, 17, 0, 'self', 'basannofal'),
(37, 9000, '2023-09-09', '', 14, 25, 0, 'nofal', 'basannofal'),
(38, 1, '2023-09-09', '', 14, 17, 0, 'nofal', 'basannofal'),
(39, 6, '2023-09-29', 'this is note', 14, 17, 0, 'nofal', 'basannofal'),
(40, 200, '2023-09-05', 'this is note book', 14, 30, 0, 'nofal', 'basannofal'),
(41, 25000, '2023-10-09', 'test mate aapel', 46, 45, 0, 'self', 'admin'),
(42, 25000, '2023-11-18', '', 48, 45, 0, 'admin', 'admin'),
(43, 50000, '2024-10-04', '', 49, 46, 0, 'admin', 'admin'),
(44, 30000, '2024-10-05', '', 49, 46, 17, 'admin', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `cf_category`
--

CREATE TABLE `cf_category` (
  `id` int(11) NOT NULL,
  `name` tinytext NOT NULL,
  `sub_category` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cf_category`
--

INSERT INTO `cf_category` (`id`, `name`, `sub_category`) VALUES
(1, 'zakat', 0),
(2, 'lillah', 0),
(106, 'QARZ', 0);

-- --------------------------------------------------------

--
-- Table structure for table `cf_deposit_borrowed_payment`
--

CREATE TABLE `cf_deposit_borrowed_payment` (
  `id` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  `deposite_by` tinytext NOT NULL,
  `mobile_no` tinytext NOT NULL,
  `collected_by` tinytext NOT NULL,
  `collected_user` tinytext NOT NULL,
  `date` date NOT NULL,
  `note` tinytext NOT NULL,
  `m_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cf_deposit_borrowed_payment`
--

INSERT INTO `cf_deposit_borrowed_payment` (`id`, `amount`, `deposite_by`, `mobile_no`, `collected_by`, `collected_user`, `date`, `note`, `m_id`) VALUES
(50, 10000, 'nofal', '2147483647', 'nofao', 'basannofal', '2023-08-27', '', 21),
(52, 5000, 'mohsin', '2147483647', 'mohsin', 'basannofal', '2023-08-27', '', 21),
(53, 600, 'nofal', '9023883909', 'nofal', 'basannofal', '2023-09-06', '', 14),
(55, 25000, 'self', '9023883909', 'self', 'basannofal', '2023-09-07', '', 30),
(56, 90, 'slef', '', 'Self', 'basannofal', '2023-09-07', '', 14),
(66, 99, 'nofal', '9023883909', 'Self', 'basannofal', '2023-09-09', '', 14),
(69, 900, 'nofal', '9023883909', 'self', 'basannofal', '2023-08-09', 'this is note', 14),
(70, 10, 'nn', '', 'Self', 'basannofal', '2023-08-29', 'note book', 14),
(71, 100, 'nofal', '', 'Self', 'basannofal', '2023-09-10', 'nofal', 14),
(72, 100, 'nofal', '', 'Self', 'basannofal', '2023-09-21', 'dd', 14),
(73, 5000, 'self', '87877778', 'Mo.Rizwan', 'admin', '2023-10-09', '', 46),
(75, 2500, 'Mo.Mohsin ', '', 'admin', 'admin', '2023-11-18', '', 48),
(76, 3000, 'Mo.Mohsin ', '', 'rizvan123', 'rizvan123', '2023-11-18', '', 48),
(77, 10000, 'aakib', '', 'admin', 'admin', '2024-10-04', '', 49);

-- --------------------------------------------------------

--
-- Table structure for table `cf_main_payment`
--

CREATE TABLE `cf_main_payment` (
  `id` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  `collected_by` tinytext NOT NULL,
  `collected_user` tinytext NOT NULL,
  `date` date NOT NULL,
  `note` tinytext NOT NULL,
  `m_id` int(11) NOT NULL,
  `c_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cf_main_payment`
--

INSERT INTO `cf_main_payment` (`id`, `amount`, `collected_by`, `collected_user`, `date`, `note`, `m_id`, `c_id`) VALUES
(19, 9000, 'nofal', 'basannofal', '2023-08-25', '', 15, 1),
(21, 9000, 'nofal', 'basannofal', '2023-08-25', '', 15, 1),
(22, 9000, 'nofal', 'basannofal', '2023-08-26', '', 17, 1),
(23, 9000, 'nofal', 'basannofal', '2023-08-26', '', 17, 1),
(24, 3322, 'nofal', 'basannofal', '2023-08-26', '', 17, 1),
(25, 3322, 'nofal', 'basannofal', '2023-08-26', '', 17, 1),
(32, 10000, 'nofal', 'basannofal', '2023-08-27', '', 21, 2),
(34, 9000, 'nofal', 'basannofal', '2023-08-27', '', 15, 1),
(35, 9000, 'nofal', 'basannofal', '2023-08-27', '', 17, 1),
(36, 9000, 'nofal', 'basannofal', '2023-08-27', '', 17, 1),
(37, 10000, 'mohsin', 'basannofal', '2023-08-27', '', 21, 2),
(48, 100000, 'nofal', 'basannofal', '2023-09-07', '', 30, 2),
(50, 90, 'nofl', 'basannofal', '2023-09-09', '', 14, 1),
(53, 100, 'nofal', 'basannofal', '2023-09-09', '', 14, 2),
(54, 90000, 'nofal', 'basannofal', '2023-09-09', '', 14, 1),
(55, 900, 'nofal', 'basannofal', '2023-09-14', 'this is note book', 14, 1),
(56, 900, 'nofal', 'basannofal', '2023-09-30', 'note', 14, 1),
(57, 25000, 'SAHARA', 'admin', '2023-10-03', '', 45, 106),
(58, 100000, 'mo.rizwan', 'admin', '2023-10-09', 'lillah mate', 46, 2),
(59, 20000, 'aakib', 'admin', '2023-10-18', '', 46, 106),
(60, 100000, 'admin', 'admin', '2023-11-18', '', 48, 106),
(61, 50000, 'admin', 'admin', '2024-10-04', '', 49, 1),
(62, 10000, 'admin', 'admin', '2024-10-04', '', 49, 2);

-- --------------------------------------------------------

--
-- Table structure for table `cf_main_payment_return`
--

CREATE TABLE `cf_main_payment_return` (
  `id` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  `return_by` tinytext NOT NULL,
  `returned_user` tinytext NOT NULL,
  `date` date NOT NULL,
  `withdrawer_name` tinytext NOT NULL,
  `mobile_no` tinytext NOT NULL,
  `note` tinytext NOT NULL,
  `m_id` int(11) NOT NULL,
  `c_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cf_main_payment_return`
--

INSERT INTO `cf_main_payment_return` (`id`, `amount`, `return_by`, `returned_user`, `date`, `withdrawer_name`, `mobile_no`, `note`, `m_id`, `c_id`) VALUES
(5, 7000, 'xyz', 'basannofal', '2023-09-06', 'xyz', '9023789087', '', 14, 1),
(19, 90, 'nofal', 'basannofal', '2023-08-26', 'nofal', '2147483647', '', 14, 1),
(21, 3000, 'nofal', 'basannofal', '2023-08-27', 'nofal', '2147483647', '', 21, 1),
(26, 50000, 'self', 'basannofal', '2023-09-07', 'xyz', '9900889900', '', 30, 2),
(33, 900, 'nofa', 'basannofal', '2023-09-09', 'sll', '', '', 14, 1),
(34, 900, 'nofal', 'basannofal', '2023-09-05', 'Self', '9023883909', 'this is note', 14, 1),
(35, 100, 'nofal', 'basannofal', '2023-09-12', 'Self', '', 'this is note book', 14, 1),
(36, 2500, 'MO.RIZWAN', 'admin', '2023-10-09', 'Self', '9974241074', '', 45, 1),
(37, 50000, 'Mo.rizwan', 'admin', '2023-10-09', 'Self', '', '', 46, 2),
(38, 50000, 'Mo.mohsin', 'admin', '2023-11-18', 'Mo.Mohsin', '', '', 48, 106),
(40, 10000, 'sdsa', 'admin', '2024-10-04', 'Self', '', '', 49, 1),
(41, 50000, 'ew', 'admin', '2024-10-04', 'Self', '', '', 49, 1);

-- --------------------------------------------------------

--
-- Table structure for table `cf_member_master`
--

CREATE TABLE `cf_member_master` (
  `id` int(11) NOT NULL,
  `fname` tinytext NOT NULL,
  `mname` tinytext NOT NULL,
  `lname` tinytext NOT NULL,
  `nickname` tinytext DEFAULT NULL,
  `address` tinytext NOT NULL,
  `mobile_no` tinytext NOT NULL,
  `alt_mobile_no` int(11) NOT NULL,
  `email` tinytext NOT NULL,
  `aadhar_card` tinytext NOT NULL,
  `bank_ac` tinytext NOT NULL,
  `ifsc` tinytext NOT NULL,
  `add_by` varchar(30) NOT NULL,
  `date` date NOT NULL,
  `update_by` varchar(30) DEFAULT NULL,
  `update_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cf_member_master`
--

INSERT INTO `cf_member_master` (`id`, `fname`, `mname`, `lname`, `nickname`, `address`, `mobile_no`, `alt_mobile_no`, `email`, `aadhar_card`, `bank_ac`, `ifsc`, `add_by`, `date`, `update_by`, `update_date`) VALUES
(14, 'basann', 'nofall', 'farhann', 'basannofall', 'Rajosanaa', '1122334455', 2147483640, 'basannofal4@gmail.com', '214748364777', '21923849382828200', 'ifcs', 'basannofal', '2023-08-23', 'basannofal', '2023-08-30'),
(15, 'sunsara', 'husen', 'razak', 'husenahmad', 'Tenivada', '9002228883', 2147483647, 'basannofal4@gmail.com', '339393939533', '900928988', 'IFSC90278B', 'basannofal', '2023-08-23', NULL, NULL),
(17, 'basan', 'nofal', 'farhan', 'nofal', 'Rajpsoa', '9012989122', 902299899, 'basannofal4@gmail.com', '990088778899', '9999999999', 'bkid0059', 'basannofal', '2023-08-25', 'basannofal', '2023-08-30'),
(21, 'noman', 'arif', 'valuda', 'noman', 'Majadar', '9493949390', 902299899, 'basannofal4@gmail.com', '990088778899', '8889990008', 'bkid0059', 'basannofal', '2023-08-27', 'basannofal', '2023-08-27'),
(25, 'basan', 'nofal', 'farhannnn', 'basan', 'Rajosana', '9909090099', 902299899, 'basannofal4@gmail.com', '990088778899', '8889990008', 'bkid0059', 'basannofal', '2023-08-30', 'basannofal', '2023-08-30'),
(30, 'Akib', 'Abdul Bhai', 'Valuda', 'akibvaluda', '', '9104190049', 0, '', '', '', '', 'basannofal', '2023-09-07', NULL, NULL),
(31, 'mak', 'nojiya', 'ahb', 'kk', '', '9029283838', 0, '', '', '', '', 'basannofal', '2023-09-09', 'basannofal', '2023-09-09'),
(45, 'MOHSIN', 'MUSTUFA', 'NODOLIYA', 'MOHSIN MUSTUFA NODOLIYA', 'MAJADAR', '9974241074', 2147483647, 'M.M.NANDOLIYA@GMAIL.COM', '784202288670', '01760100017685', 'BARB0CHHAPI', 'admin', '2023-10-03', NULL, NULL),
(46, 'Aakib', 'Abdulbhai', 'Valuda', '', '', '9104190033', 0, '', '', '', '', 'admin', '2023-10-09', NULL, NULL),
(47, 'MOHAMMAD ', 'MUSTUFA', 'NODOLIYA', '', 'MAJADAR', '9601808516', 0, '', '', '', '', 'admin', '2023-10-10', NULL, NULL),
(48, 'Sahara', 'Education ', 'and welfare trust', 'Sahara Education and welfare trust', 'Majadar', '7698648215', 0, '', '', '', '', 'admin', '2023-11-18', NULL, NULL),
(49, 'Mujahid', 'Siddik', 'Bhoraniya', '', '', '7600383050', 0, '', '', '', '', 'admin', '2024-10-01', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cf_auth_info`
--
ALTER TABLE `cf_auth_info`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cf_borrow_payment`
--
ALTER TABLE `cf_borrow_payment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `m_id` (`m_id`),
  ADD KEY `bail_m_id` (`bail_m_id`);

--
-- Indexes for table `cf_category`
--
ALTER TABLE `cf_category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cf_deposit_borrowed_payment`
--
ALTER TABLE `cf_deposit_borrowed_payment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `m_id` (`m_id`);

--
-- Indexes for table `cf_main_payment`
--
ALTER TABLE `cf_main_payment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `m_id` (`m_id`),
  ADD KEY `c_id` (`c_id`);

--
-- Indexes for table `cf_main_payment_return`
--
ALTER TABLE `cf_main_payment_return`
  ADD PRIMARY KEY (`id`),
  ADD KEY `m_id` (`m_id`),
  ADD KEY `c_id` (`c_id`);

--
-- Indexes for table `cf_member_master`
--
ALTER TABLE `cf_member_master`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `mobile_no` (`mobile_no`) USING HASH;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cf_auth_info`
--
ALTER TABLE `cf_auth_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `cf_borrow_payment`
--
ALTER TABLE `cf_borrow_payment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `cf_category`
--
ALTER TABLE `cf_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=108;

--
-- AUTO_INCREMENT for table `cf_deposit_borrowed_payment`
--
ALTER TABLE `cf_deposit_borrowed_payment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- AUTO_INCREMENT for table `cf_main_payment`
--
ALTER TABLE `cf_main_payment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT for table `cf_main_payment_return`
--
ALTER TABLE `cf_main_payment_return`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `cf_member_master`
--
ALTER TABLE `cf_member_master`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cf_borrow_payment`
--
ALTER TABLE `cf_borrow_payment`
  ADD CONSTRAINT `cf_borrow_payment_ibfk_1` FOREIGN KEY (`m_id`) REFERENCES `cf_member_master` (`id`),
  ADD CONSTRAINT `cf_borrow_payment_ibfk_2` FOREIGN KEY (`bail_m_id`) REFERENCES `cf_member_master` (`id`);

--
-- Constraints for table `cf_deposit_borrowed_payment`
--
ALTER TABLE `cf_deposit_borrowed_payment`
  ADD CONSTRAINT `cf_deposit_borrowed_payment_ibfk_1` FOREIGN KEY (`m_id`) REFERENCES `cf_member_master` (`id`);

--
-- Constraints for table `cf_main_payment`
--
ALTER TABLE `cf_main_payment`
  ADD CONSTRAINT `cf_main_payment_ibfk_1` FOREIGN KEY (`c_id`) REFERENCES `cf_category` (`id`),
  ADD CONSTRAINT `cf_main_payment_ibfk_2` FOREIGN KEY (`m_id`) REFERENCES `cf_member_master` (`id`);

--
-- Constraints for table `cf_main_payment_return`
--
ALTER TABLE `cf_main_payment_return`
  ADD CONSTRAINT `cf_main_payment_return_ibfk_1` FOREIGN KEY (`c_id`) REFERENCES `cf_category` (`id`),
  ADD CONSTRAINT `cf_main_payment_return_ibfk_2` FOREIGN KEY (`m_id`) REFERENCES `cf_member_master` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
