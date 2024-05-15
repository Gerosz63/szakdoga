-- phpMyAdmin SQL Dump
-- version 4.7.7
-- https://www.phpmyadmin.net/
--
-- Host: mysql.caesar.elte.hu
-- Generation Time: May 15, 2024 at 01:42 PM
-- Server version: 5.5.60-0+deb7u1
-- PHP Version: 5.6.40-0+deb8u12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gerosz`
--

-- --------------------------------------------------------

--
-- Table structure for table `energy_storage`
--

CREATE TABLE `energy_storage` (
  `id` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `name` varchar(20) NOT NULL,
  `storage_min` double NOT NULL,
  `storage_max` double NOT NULL,
  `charge_max` double NOT NULL,
  `discharge_max` double NOT NULL,
  `charge_loss` double NOT NULL,
  `discharge_loss` double NOT NULL,
  `charge_cost` double NOT NULL,
  `discharge_cost` double NOT NULL,
  `s0` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `gas_engines`
--

CREATE TABLE `gas_engines` (
  `id` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `name` varchar(20) NOT NULL,
  `gmax` double NOT NULL,
  `gplusmax` double NOT NULL,
  `gminusmax` double NOT NULL,
  `cost` double NOT NULL,
  `g0` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `results`
--

CREATE TABLE `results` (
  `id` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `saveDate` datetime DEFAULT NULL,
  `data` mediumtext NOT NULL,
  `saved` tinyint(1) NOT NULL DEFAULT '0',
  `exec_time` double NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `solar_panel`
--

CREATE TABLE `solar_panel` (
  `id` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `name` varchar(20) NOT NULL,
  `r_max` double NOT NULL,
  `delta_r_plus_max` double NOT NULL,
  `delta_r_minus_max` double NOT NULL,
  `cost` double NOT NULL,
  `r0` double DEFAULT NULL,
  `shift_start` int(11) NOT NULL,
  `exp_v` double NOT NULL,
  `intval_range` double NOT NULL,
  `value_at_end` double NOT NULL,
  `addNoise` tinyint(1) NOT NULL DEFAULT '0',
  `seed` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(20) NOT NULL,
  `password` text NOT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  `theme` enum('dark','light') NOT NULL DEFAULT 'light'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`username`, `password`, `role`, `theme`) VALUES
('admin', '$2b$10$Tlr/YRbC45Rdj6tEK3eu.ubfelVEqcP7NxUqGqtMB4p2UEjchM8Jq', 'admin', 'light');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `energy_storage`
--
ALTER TABLE `energy_storage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uid` (`uid`);

--
-- Indexes for table `gas_engines`
--
ALTER TABLE `gas_engines`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uid` (`uid`);

--
-- Indexes for table `results`
--
ALTER TABLE `results`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `solar_panel`
--
ALTER TABLE `solar_panel`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uid` (`uid`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `name` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `energy_storage`
--
ALTER TABLE `energy_storage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `gas_engines`
--
ALTER TABLE `gas_engines`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `results`
--
ALTER TABLE `results`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `solar_panel`
--
ALTER TABLE `solar_panel`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
