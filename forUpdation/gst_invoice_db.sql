-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 18, 2026 at 03:44 PM
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
-- Database: `gst_invoice_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `email_action_tokens`
--

CREATE TABLE `email_action_tokens` (
  `id` bigint(20) NOT NULL,
  `expires_at` datetime(6) NOT NULL,
  `purpose` varchar(30) NOT NULL,
  `token_hash` varchar(64) NOT NULL,
  `used` bit(1) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `email_action_tokens`
--

INSERT INTO `email_action_tokens` (`id`, `expires_at`, `purpose`, `token_hash`, `used`, `user_id`) VALUES
(6, '2026-11-18 20:15:09.000000', 'VERIFY_EMAIL', 'f714aee4e2c116e96e02bcb2dbc8e885b2165a62c382f96b636976cbb76a538c', b'1', 1),
(13, '2026-11-18 20:31:38.000000', 'VERIFY_EMAIL', 'f7a6433b2de0d89633f9bab373f458b8a054a686c05af39f9bb0f20c7af89e44', b'1', 2);

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `id` bigint(20) NOT NULL,
  `buyer_gstin` varchar(255) DEFAULT NULL,
  `seller_gstin` varchar(255) DEFAULT NULL,
  `taxable_value` decimal(38,2) DEFAULT NULL,
  `buyer_state_code` varchar(255) DEFAULT NULL,
  `cgst_amount` decimal(38,2) DEFAULT NULL,
  `igst_amount` decimal(38,2) DEFAULT NULL,
  `invoice_date` date DEFAULT NULL,
  `invoice_number` varchar(255) DEFAULT NULL,
  `seller_state_code` varchar(255) DEFAULT NULL,
  `sgst_amount` decimal(38,2) DEFAULT NULL,
  `total_invoice_value` decimal(38,2) DEFAULT NULL,
  `risk_level` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoices`
--

INSERT INTO `invoices` (`id`, `buyer_gstin`, `seller_gstin`, `taxable_value`, `buyer_state_code`, `cgst_amount`, `igst_amount`, `invoice_date`, `invoice_number`, `seller_state_code`, `sgst_amount`, `total_invoice_value`, `risk_level`) VALUES
(1, '09AAACR5055K1Z5', '09AABCU9603R1ZL', 10000.00, '09', 0.00, 1800.00, '2026-11-09', 'TAX-TEST-001', '09', 0.00, 11800.00, 'HIGH'),
(2, '09AAACR5055K1Z5', '09AABCU9603R1ZL', 10000.00, '27', 900.00, 0.00, '2026-11-09', 'TAX-TEST-002', '09', 900.00, 11800.00, 'HIGH'),
(3, '09AAACR5055K1Z5', '09AABCU9603R1ZL', 10000.00, '09', 900.00, 0.00, '2026-11-09', 'TAX-TEST-003', '09', 900.00, 11700.00, 'HIGH'),
(4, '09AAACR5055K1Z5', '09AABCU9603R1ZL', 10000.00, '09', 900.00, 0.00, '2026-10-01', 'INV-001', '09', 900.00, 11800.00, 'LOW'),
(5, '27AAPFU0939F1ZV', '09AABCU9603R1ZL', 50000.00, '27', 0.00, 9000.00, '2026-10-02', 'INV-002', '09', 0.00, 59000.00, 'LOW'),
(6, '09AAACR5055K1Z5', '09AABCU9603R1ZL', 20000.00, '09', 1800.00, 0.00, '2026-10-03', 'INV-003', '09', 1500.00, 23300.00, 'HIGH'),
(7, '09AAACR5055K1Z5', '09AABCU9603R1ZL', 10000.00, '09', 900.00, 0.00, '2026-10-01', 'INV-001', '09', 900.00, 11800.00, 'HIGH'),
(8, '07AAACR5055K1Z9', '09AABCU9603R1ZL', 10000.00, '07', 900.00, 0.00, '2026-10-05', 'INV-005', '09', 900.00, 11800.00, 'HIGH'),
(9, '27AAPFU0939F1ZV', '09AABCU9603', 10000.00, '27', 0.00, 1800.00, '2026-10-06', 'INV-006', '09', 0.00, 11800.00, 'HIGH'),
(10, '09AAACR5055K1Z5', '09AABCU9603R1ZL', 1000.00, '27', 90.00, 0.00, '2026-11-11', 'MEDIUM-TEST-001', '27', 90.00, 1180.00, 'MEDIUM'),
(11, '09AAACR5055K1Z2', '09AABCU9603R1ZM', 10000.00, '09', 900.00, 0.00, '2026-10-01', 'INV-001', '09', 900.00, 11800.00, 'HIGH'),
(12, '27AAPFU0939F1ZV', '09AABCU9603R1ZM', 50000.00, '27', 0.00, 9000.00, '2026-10-02', 'INV-002', '09', 0.00, 59000.00, 'HIGH'),
(13, '09AAACR5055K1Z2', '09AABCU9603R1ZM', 20000.00, '09', 1800.00, 0.00, '2026-10-03', 'INV-003', '09', 1500.00, 23300.00, 'HIGH'),
(14, '09AAACR5055K1Z2', '09AABCU9603R1ZM', 10000.00, '09', 900.00, 0.00, '2026-10-01', 'INV-001', '09', 900.00, 11800.00, 'HIGH'),
(15, '07AAACR5055K1Z2', '09AABCU9603R1ZM', 10000.00, '07', 900.00, 0.00, '2026-10-05', 'INV-005', '09', 900.00, 11800.00, 'HIGH'),
(16, '27AAPFU0939F1ZV', '09AABCU9603R1ZM', 10000.00, '27', 900.00, 0.00, '2026-10-06', 'INV-006', '09', 900.00, 11800.00, 'HIGH'),
(17, '09AAACR5055K1Z5', '09AABCU9603R1ZL', 10000.00, '9', 900.00, 0.00, '2026-10-07', 'TOTAL-TEST-001', '9', 900.00, 12000.00, 'HIGH'),
(18, '09AAACR5055K1Z5', '09AABCU9603R1ZL', 10000.00, '09', 900.00, 0.00, '2026-11-12', 'CGST-SGST-TEST-001', '09', 800.00, 11700.00, 'HIGH'),
(19, '27AAACR5055K1Z5', '09AABCU9603R1ZL', 10000.00, '27', 900.00, 0.00, '2026-11-12', 'TAX-APPLICABILITY-TEST-001', '09', 900.00, 11800.00, 'HIGH'),
(20, '27AAACR5055K1Z7', '09AABCU9603R1ZL', 10000.00, '27', 0.00, 1800.00, '2026-11-12', 'TAX-IGST-VALID-001', '09', 0.00, 11800.00, 'LOW'),
(21, '27AAACR5055K1Z7', '09AABCU9603R1ZL', 10000.00, '27', 0.00, 1800.00, '2026-11-12', 'TAX-IGST-VALID-001', '09', 0.00, 11800.00, 'HIGH'),
(22, '09AAACR5055K1Z5', '09AABCU9603R1ZL', -10000.00, '09', 0.00, 0.00, '2026-11-12', 'NEGATIVE-VALUE-TEST-001', '09', 0.00, -10000.00, 'HIGH'),
(23, '09AAACR5055K1Z5', '09AABCU9603R1ZL', 10000.00, '09', -500.00, 0.00, '2026-11-12', 'NEGATIVE-CGST-TEST-001', '09', 500.00, 10000.00, 'HIGH'),
(24, '09AAACR5055K1Z5', '09AABCU9603R1ZL', 10000.00, '09', 900.00, 0.00, '2026-11-12', '', '09', 900.00, 11800.00, 'HIGH'),
(25, '09AAACR5055K1Z5', '09AABCU9603R1ZL', 10000.00, '09', 900.00, 0.00, NULL, 'MISSING-DATE-TEST-001', '09', 900.00, 11800.00, 'HIGH'),
(26, '09AAACR5055K1Z5', '', 10000.00, '09', 900.00, 0.00, '2026-11-12', 'MISSING-SELLER-GSTIN-001', '09', 900.00, 11800.00, 'HIGH'),
(27, '09AABCU9603R1ZL', '09AABCU9603R1ZL', NULL, '09', 0.00, 0.00, '2026-11-12', 'MISSING-TAXABLE-VALUE-001', '09', 0.00, 0.00, 'HIGH'),
(28, '', '09AABCU9603R1ZL', 10000.00, '09', 900.00, 0.00, '2026-11-12', 'MISSING-BUYER-GSTIN-001', '09', 900.00, 11800.00, 'HIGH'),
(29, '09AAACR5055K1Z5', '', 10000.00, '09', 900.00, 0.00, '2026-11-12', 'MISSING-SELLER-GSTIN-001', '09', 900.00, 11800.00, 'HIGH'),
(30, '09AAACR5055K1Z5', '09AABCU9603R1ZL', 10000.00, '09', 900.00, 0.00, NULL, 'MISSING-DATE-TEST-001', '09', 900.00, 11800.00, 'HIGH'),
(31, '09AABCU9603R1ZL', '09AABCU9603R1ZL', 10000.00, '09', 900.00, 0.00, '2026-11-12', 'TOTAL-MISMATCH-TEST-001', '09', 900.00, 11000.00, 'HIGH');

-- --------------------------------------------------------

--
-- Table structure for table `invoice_corrections`
--

CREATE TABLE `invoice_corrections` (
  `id` bigint(20) NOT NULL,
  `after_values` longtext NOT NULL,
  `before_values` longtext NOT NULL,
  `corrected_at` datetime(6) NOT NULL,
  `corrected_by` varchar(255) NOT NULL,
  `invoice_id` bigint(20) NOT NULL,
  `reason` varchar(1000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `invoice_issues`
--

CREATE TABLE `invoice_issues` (
  `id` bigint(20) NOT NULL,
  `invoice_id` bigint(20) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `rule_code` varchar(255) DEFAULT NULL,
  `severity` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoice_issues`
--

INSERT INTO `invoice_issues` (`id`, `invoice_id`, `message`, `rule_code`, `severity`) VALUES
(126, 1, 'Intra-state transaction should not have IGST.', 'INVALID_TAX_TYPE', 'HIGH'),
(127, 2, 'Buyer GSTIN state code does not match the invoice state code.', 'GSTIN_STATE_MISMATCH', 'MEDIUM'),
(128, 2, 'Inter-state transaction should not have CGST or SGST.', 'INVALID_TAX_TYPE', 'HIGH'),
(129, 3, 'Total invoice value does not match the calculated amount.', 'TOTAL_MISMATCH', 'HIGH'),
(130, 6, 'For an intra-state transaction, CGST and SGST amounts should be equal.', 'CGST_SGST_UNEQUAL', 'HIGH'),
(131, 7, 'Duplicate of an earlier invoice with the same number, seller, date and taxable value.', 'DUPLICATE_INVOICE', 'HIGH'),
(132, 8, 'Inter-state transaction should not have CGST or SGST.', 'INVALID_TAX_TYPE', 'HIGH'),
(133, 9, 'Seller GSTIN: GSTIN has 11 characters, expected 15', 'GSTIN_LENGTH', 'HIGH'),
(134, 10, 'Seller GSTIN state code does not match the invoice state code.', 'GSTIN_STATE_MISMATCH', 'MEDIUM'),
(135, 10, 'Buyer GSTIN state code does not match the invoice state code.', 'GSTIN_STATE_MISMATCH', 'MEDIUM'),
(136, 11, 'Seller GSTIN: Check character is \'M\' but expected \'L\'', 'GSTIN_CHECKSUM', 'HIGH'),
(137, 11, 'Buyer GSTIN: Check character is \'2\' but expected \'5\'', 'GSTIN_CHECKSUM', 'HIGH'),
(138, 12, 'Seller GSTIN: Check character is \'M\' but expected \'L\'', 'GSTIN_CHECKSUM', 'HIGH'),
(139, 13, 'Seller GSTIN: Check character is \'M\' but expected \'L\'', 'GSTIN_CHECKSUM', 'HIGH'),
(140, 13, 'Buyer GSTIN: Check character is \'2\' but expected \'5\'', 'GSTIN_CHECKSUM', 'HIGH'),
(141, 13, 'For an intra-state transaction, CGST and SGST amounts should be equal.', 'CGST_SGST_UNEQUAL', 'HIGH'),
(142, 14, 'Seller GSTIN: Check character is \'M\' but expected \'L\'', 'GSTIN_CHECKSUM', 'HIGH'),
(143, 14, 'Buyer GSTIN: Check character is \'2\' but expected \'5\'', 'GSTIN_CHECKSUM', 'HIGH'),
(144, 14, 'Duplicate of an earlier invoice with the same number, seller, date and taxable value.', 'DUPLICATE_INVOICE', 'HIGH'),
(145, 15, 'Seller GSTIN: Check character is \'M\' but expected \'L\'', 'GSTIN_CHECKSUM', 'HIGH'),
(146, 15, 'Buyer GSTIN: Check character is \'2\' but expected \'9\'', 'GSTIN_CHECKSUM', 'HIGH'),
(147, 15, 'Inter-state transaction should not have CGST or SGST.', 'INVALID_TAX_TYPE', 'HIGH'),
(148, 16, 'Seller GSTIN: Check character is \'M\' but expected \'L\'', 'GSTIN_CHECKSUM', 'HIGH'),
(149, 16, 'Inter-state transaction should not have CGST or SGST.', 'INVALID_TAX_TYPE', 'HIGH'),
(150, 17, 'Seller GSTIN state code does not match the invoice state code.', 'GSTIN_STATE_MISMATCH', 'MEDIUM'),
(151, 17, 'Buyer GSTIN state code does not match the invoice state code.', 'GSTIN_STATE_MISMATCH', 'MEDIUM'),
(152, 17, 'Total invoice value does not match the calculated amount.', 'TOTAL_MISMATCH', 'HIGH'),
(153, 18, 'For an intra-state transaction, CGST and SGST amounts should be equal.', 'CGST_SGST_UNEQUAL', 'HIGH'),
(154, 19, 'Buyer GSTIN: Check character is \'5\' but expected \'7\'', 'GSTIN_CHECKSUM', 'HIGH'),
(155, 19, 'Inter-state transaction should not have CGST or SGST.', 'INVALID_TAX_TYPE', 'HIGH'),
(156, 21, 'Duplicate of an earlier invoice with the same number, seller, date and taxable value.', 'DUPLICATE_INVOICE', 'HIGH'),
(157, 22, 'Invoice contains a negative amount. All invoice values must be zero or positive.', 'NEGATIVE_AMOUNT', 'HIGH'),
(158, 23, 'For an intra-state transaction, CGST and SGST amounts should be equal.', 'CGST_SGST_UNEQUAL', 'HIGH'),
(159, 23, 'Invoice contains a negative amount. All invoice values must be zero or positive.', 'NEGATIVE_AMOUNT', 'HIGH'),
(160, 24, 'Invoice number is missing. Every invoice must have an invoice number.', 'MISSING_INVOICE_NUMBER', 'HIGH'),
(161, 25, 'Invoice date is missing. Every invoice must have an invoice date.', 'MISSING_INVOICE_DATE', 'HIGH'),
(162, 26, 'Seller GSTIN is missing.', 'MISSING_SELLER_GSTIN', 'HIGH'),
(163, 27, 'Taxable value is missing from the invoice.', 'MISSING_TAXABLE_VALUE', 'HIGH'),
(164, 28, 'Buyer GSTIN is missing.', 'MISSING_BUYER_GSTIN', 'HIGH'),
(165, 29, 'Seller GSTIN is missing.', 'MISSING_SELLER_GSTIN', 'HIGH'),
(166, 30, 'Invoice date is missing. Every invoice must have an invoice date.', 'MISSING_INVOICE_DATE', 'HIGH'),
(167, 31, 'Total invoice value does not match the calculated amount.', 'TOTAL_MISMATCH', 'HIGH');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `active` bit(1) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `email_verified` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `password`, `role`, `username`, `active`, `email`, `email_verified`) VALUES
(1, '$2a$12$p5eg.JB452SYTBZ.YCkEbepPUD9HQZm6.QMGBBAYS7Hj4fAAJ9fVq', 'ADMIN', 'sumaniya_sheikh', b'1', 'sumaniyasheikh1234@gmail.com', b'1'),
(2, '$2a$12$z9Bqk69d.7aCesI1NI7SWe8T8BTwlzRaw3.zgp0fktiJi4fMXRAa.', 'BUSINESS_USER', 'Hadiya', b'1', 'sumusheikh870@gmail.com', b'1');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `email_action_tokens`
--
ALTER TABLE `email_action_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_email_action_token_hash` (`token_hash`),
  ADD KEY `FKcx6mgx7elqpk0dq68dcsw5law` (`user_id`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `invoice_corrections`
--
ALTER TABLE `invoice_corrections`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `invoice_issues`
--
ALTER TABLE `invoice_issues`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKr43af9ap4edm43mmtq01oddj6` (`username`),
  ADD UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `email_action_tokens`
--
ALTER TABLE `email_action_tokens`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `invoice_corrections`
--
ALTER TABLE `invoice_corrections`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `invoice_issues`
--
ALTER TABLE `invoice_issues`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=168;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `email_action_tokens`
--
ALTER TABLE `email_action_tokens`
  ADD CONSTRAINT `FKcx6mgx7elqpk0dq68dcsw5law` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
