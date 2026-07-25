-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 23 Jul 2026 pada 11.43
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.5.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `diajar`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL,
  `actor_id` int(11) NOT NULL,
  `action` varchar(100) NOT NULL,
  `target_type` varchar(100) DEFAULT NULL,
  `target_id` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `actor_id`, `action`, `target_type`, `target_id`, `description`, `created_at`) VALUES
(40, 1, 'school_year.created', 'SchoolYear', 2, NULL, '2026-07-04 04:37:15'),
(41, 1, 'user.updated', 'User', 8, NULL, '2026-07-04 04:38:07'),
(42, 1, 'group.bulk_created', 'Group', NULL, 'Created 5 groups', '2026-07-04 05:44:26'),
(43, 1, 'group.bulk_created', 'Group', NULL, 'Created 5 groups', '2026-07-04 05:44:51'),
(44, 1, 'group.bulk_created', 'Group', NULL, 'Created 4 groups', '2026-07-04 05:45:11'),
(45, 1, 'group.students_linked', 'Group', 4, 'Linked 10 students', '2026-07-04 10:24:57'),
(46, 1, 'group.students_linked', 'Group', 5, 'Linked 10 students', '2026-07-04 10:26:37'),
(47, 1, 'group.students_linked', 'Group', 6, 'Linked 10 students', '2026-07-04 10:28:10'),
(48, 1, 'group.students_linked', 'Group', 7, 'Linked 10 students', '2026-07-04 10:29:29'),
(49, 1, 'group.students_linked', 'Group', 8, 'Linked 10 students', '2026-07-04 10:30:30'),
(50, 1, 'group.students_linked', 'Group', 9, 'Linked 11 students', '2026-07-04 10:31:51'),
(51, 1, 'group.student_unlinked', 'Group', 9, 'Student #147', '2026-07-04 10:32:19'),
(52, 1, 'group.students_linked', 'Group', 10, 'Linked 10 students', '2026-07-04 10:33:50'),
(53, 1, 'group.students_linked', 'Group', 11, 'Linked 10 students', '2026-07-04 10:34:46'),
(54, 1, 'group.students_linked', 'Group', 12, 'Linked 10 students', '2026-07-04 10:35:43'),
(55, 1, 'group.students_linked', 'Group', 13, 'Linked 10 students', '2026-07-04 10:36:45'),
(56, 1, 'group.students_linked', 'Group', 14, 'Linked 10 students', '2026-07-04 10:37:49'),
(57, 1, 'group.students_linked', 'Group', 15, 'Linked 10 students', '2026-07-04 10:38:41'),
(58, 1, 'group.students_linked', 'Group', 16, 'Linked 10 students', '2026-07-04 10:39:44'),
(59, 1, 'group.students_linked', 'Group', 17, 'Linked 10 students', '2026-07-04 10:39:58'),
(60, 1, 'subject.teacher_linked', 'Subject', 4, 'Teacher #2', '2026-07-04 10:40:15'),
(61, 1, 'class.cohorts_updated', 'Class', 4, NULL, '2026-07-04 10:49:16'),
(62, 1, 'class.cohorts_updated', 'Class', 4, NULL, '2026-07-06 13:31:55'),
(63, 1, 'class.cohorts_updated', 'Class', 4, NULL, '2026-07-06 13:35:44'),
(64, 1, 'class.cohorts_updated', 'Class', 4, NULL, '2026-07-06 13:35:55'),
(65, 1, 'class.cohorts_updated', 'Class', 4, NULL, '2026-07-06 13:36:02'),
(66, 1, 'class.cohorts_updated', 'Class', 4, NULL, '2026-07-06 13:54:58'),
(67, 1, 'subject.teacher_linked', 'Subject', 4, 'Teacher #4', '2026-07-09 05:45:13'),
(68, 1, 'class.cohorts_updated', 'Class', 5, NULL, '2026-07-09 05:45:43'),
(69, 1, 'subject.teacher_linked', 'Subject', 5, 'Teacher #5', '2026-07-11 02:22:56'),
(70, 1, 'subject.teacher_linked', 'Subject', 5, 'Teacher #6', '2026-07-11 02:22:56'),
(71, 1, 'class.cohorts_updated', 'Class', 7, NULL, '2026-07-11 02:24:15'),
(72, 1, 'subject.teacher_linked', 'Subject', 4, 'Teacher #9', '2026-07-22 06:06:00');

-- --------------------------------------------------------

--
-- Struktur dari tabel `assessments`
--

CREATE TABLE `assessments` (
  `id` int(11) NOT NULL,
  `subject_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `assessment_answers`
--

CREATE TABLE `assessment_answers` (
  `id` int(11) NOT NULL,
  `attempt_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `selected_option_id` int(11) DEFAULT NULL,
  `is_correct` tinyint(1) DEFAULT NULL,
  `marked_for_review` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `assessment_answers`
--

INSERT INTO `assessment_answers` (`id`, `attempt_id`, `question_id`, `selected_option_id`, `is_correct`, `marked_for_review`, `created_at`, `updated_at`) VALUES
(1, 1, 1, NULL, NULL, 0, '2026-07-07 21:35:25', '2026-07-07 21:35:25'),
(2, 2, 1, 2, 1, 0, '2026-07-07 21:41:02', '2026-07-07 21:41:12'),
(3, 3, 1, 2, 1, 0, '2026-07-07 21:43:43', '2026-07-07 21:44:02');

-- --------------------------------------------------------

--
-- Struktur dari tabel `assessment_attempts`
--

CREATE TABLE `assessment_attempts` (
  `id` int(11) NOT NULL,
  `class_assessment_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `start_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `end_time` timestamp NULL DEFAULT NULL,
  `submit_time` timestamp NULL DEFAULT NULL,
  `time_spent_seconds` int(11) DEFAULT NULL,
  `status` enum('progress','submitted','graded') NOT NULL,
  `grade` float DEFAULT NULL,
  `grade_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `assessment_attempts`
--

INSERT INTO `assessment_attempts` (`id`, `class_assessment_id`, `student_id`, `start_time`, `end_time`, `submit_time`, `time_spent_seconds`, `status`, `grade`, `grade_by`, `created_at`, `updated_at`) VALUES
(1, 1, 13, '2026-07-07 21:35:25', NULL, NULL, NULL, 'progress', NULL, NULL, '2026-07-07 21:35:25', '2026-07-07 21:35:25'),
(2, 1, 13, '2026-07-08 06:52:31', '2026-07-07 21:42:24', '2026-07-07 21:42:24', -83, 'submitted', 100, NULL, '2026-07-07 21:41:02', '2026-07-07 23:52:31'),
(3, 1, 13, '2026-07-08 06:52:31', '2026-07-07 21:44:07', '2026-07-07 21:44:07', -25, 'submitted', 100, NULL, '2026-07-07 21:43:43', '2026-07-07 23:52:31');

-- --------------------------------------------------------

--
-- Struktur dari tabel `assessment_questions`
--

CREATE TABLE `assessment_questions` (
  `id` int(11) NOT NULL,
  `assessment_id` int(11) DEFAULT NULL,
  `question_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `assignments`
--

CREATE TABLE `assignments` (
  `id` int(11) NOT NULL,
  `subject_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `grade` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `assignment_submissions`
--

CREATE TABLE `assignment_submissions` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `class_assignment_id` int(11) NOT NULL,
  `path_url` varchar(255) DEFAULT NULL,
  `student_note` text DEFAULT NULL,
  `grade` float DEFAULT NULL,
  `feedback` text DEFAULT NULL,
  `status` enum('submitted','graded') NOT NULL,
  `grade_by` int(11) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `assignment_submissions`
--

INSERT INTO `assignment_submissions` (`id`, `student_id`, `class_assignment_id`, `path_url`, `student_note`, `grade`, `feedback`, `status`, `grade_by`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 13, 9, '/storage/assignments/submissions/Ldaok8R5tllXww5rVCjvs9yLdDpZFV6GxQ8pXipE.png', NULL, 75, NULL, 'graded', 2, NULL, '2026-07-07 19:58:37', '2026-07-07 20:42:34'),
(2, 151, 11, '/storage/assignments/submissions/xu2r9PIcz5xZVHgmMsuvcsTpi7ZIjMVcCbVb5lWl.png', NULL, NULL, NULL, 'submitted', NULL, NULL, '2026-07-10 19:29:46', '2026-07-10 19:29:46');

-- --------------------------------------------------------

--
-- Struktur dari tabel `attachments`
--

CREATE TABLE `attachments` (
  `id` int(11) NOT NULL,
  `material_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `file_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `attachments`
--

INSERT INTO `attachments` (`id`, `material_id`, `title`, `description`, `file_url`, `created_at`, `updated_at`) VALUES
(6, 12, 'pilar iman', NULL, 'http://localhost:8000/storage/materials/attachments/juvGbuvY953W5cCVpFEiWXHRrOrPGmmWoAjAvyh0.png', '2026-07-08 21:41:34', '2026-07-08 21:41:34'),
(7, 18, 'Membina Keluarga yang Sakinah', NULL, 'http://localhost:8000/storage/materials/attachments/EoJ41aAAatZFCrTGeQRzY6gMjXyr37wFp0n9e5N0.pdf', '2026-07-08 21:52:52', '2026-07-08 21:52:52');

-- --------------------------------------------------------

--
-- Struktur dari tabel `bookmarks`
--

CREATE TABLE `bookmarks` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `bookmarkable_id` int(11) NOT NULL,
  `bookmarkable_type` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `bookmarks`
--

INSERT INTO `bookmarks` (`id`, `student_id`, `bookmarkable_id`, `bookmarkable_type`, `created_at`, `updated_at`) VALUES
(5, 151, 16, 'App\\Models\\Material', '2026-07-21 23:16:54', '2026-07-21 23:16:54');

-- --------------------------------------------------------

--
-- Struktur dari tabel `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('laravel-cache-abdul@upi.edu|127.0.0.1', 'i:1;', 1783432818),
('laravel-cache-abdul@upi.edu|127.0.0.1:timer', 'i:1783432818;', 1783432818),
('laravel-cache-hadi@teacher.ed|127.0.0.1', 'i:1;', 1783162702),
('laravel-cache-hadi@teacher.ed|127.0.0.1:timer', 'i:1783162702;', 1783162702),
('laravel-cache-hadianans@upi.edu|127.0.0.1', 'i:1;', 1783177668),
('laravel-cache-hadianans@upi.edu|127.0.0.1:timer', 'i:1783177667;', 1783177667);

-- --------------------------------------------------------

--
-- Struktur dari tabel `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `chapters`
--

CREATE TABLE `chapters` (
  `id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `teacher_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `order` int(11) DEFAULT NULL,
  `target_grade` int(11) DEFAULT NULL,
  `target_groups` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`target_groups`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `chapters`
--

INSERT INTO `chapters` (`id`, `subject_id`, `teacher_id`, `name`, `description`, `tags`, `order`, `target_grade`, `target_groups`, `created_at`, `updated_at`) VALUES
(6, 4, 2, 'Sejarah Abbasiyah', NULL, '[\"Sejarah Peradaban Islam\",\"PAI\",\"Abbasiyyah\"]', 2, 10, '[4,5]', '2026-07-04 08:53:30', '2026-07-05 16:27:33'),
(7, 4, 2, 'Penciptaan Alam Semesta', NULL, '[\"Qur\'an\",\"Hadis\"]', NULL, 10, '[5,6]', '2026-07-04 15:51:38', '2026-07-06 07:35:47'),
(8, 4, 2, 'Menguatkan Iman dengan Menjaga Kehormatan, Ikhlas, Malu, dan Zuhud', NULL, '[\"Iman\",\"Zuhud\"]', 7, 11, '[9,10]', '2026-07-08 21:30:19', '2026-07-08 21:30:34'),
(9, 4, 2, 'Adab Menggunakan Media Sosial', NULL, '[]', 8, 11, '[9,10]', '2026-07-08 21:30:51', '2026-07-08 21:30:51'),
(10, 4, 2, 'Ketentuan Pernikahan dalam Islam', NULL, '[]', 9, 11, '[9,10]', '2026-07-08 21:31:09', '2026-07-08 21:31:09'),
(11, 4, 2, 'Peradaban Islam pada Masa Modern', NULL, '[\"Sejarah Islam\"]', 10, 11, '[9,10]', '2026-07-08 21:31:35', '2026-07-08 21:31:35'),
(12, 4, 2, 'bab baru', NULL, '[\"akidah\",\"kelas 10\"]', 3, 10, '[4,6]', '2026-07-08 22:47:24', '2026-07-08 22:47:24');

-- --------------------------------------------------------

--
-- Struktur dari tabel `classes`
--

CREATE TABLE `classes` (
  `id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `teacher_id` int(11) NOT NULL,
  `school_year_id` int(11) DEFAULT NULL,
  `day_schedule` int(11) DEFAULT NULL,
  `time_schedule` time DEFAULT NULL,
  `assignment_weight` float NOT NULL DEFAULT 50,
  `assessment_weight` float NOT NULL DEFAULT 50,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `classes`
--

INSERT INTO `classes` (`id`, `subject_id`, `teacher_id`, `school_year_id`, `day_schedule`, `time_schedule`, `assignment_weight`, `assessment_weight`, `deleted_at`, `created_at`, `updated_at`) VALUES
(4, 4, 2, 2, 1, '07:00:00', 50, 50, NULL, '2026-07-04 03:40:15', '2026-07-04 03:56:28'),
(5, 4, 4, 2, NULL, NULL, 50, 50, NULL, '2026-07-08 22:45:13', '2026-07-08 22:45:13'),
(6, 5, 5, 2, NULL, NULL, 50, 50, NULL, '2026-07-10 19:22:56', '2026-07-10 19:22:56'),
(7, 5, 6, 2, NULL, NULL, 50, 50, NULL, '2026-07-10 19:22:56', '2026-07-10 19:22:56'),
(8, 4, 9, 2, NULL, NULL, 50, 50, NULL, '2026-07-21 23:06:00', '2026-07-21 23:06:00');

-- --------------------------------------------------------

--
-- Struktur dari tabel `class_assessments`
--

CREATE TABLE `class_assessments` (
  `id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `chapter_id` int(11) NOT NULL,
  `material_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `start_date` timestamp NULL DEFAULT NULL,
  `due_date` timestamp NULL DEFAULT NULL,
  `duration` int(11) NOT NULL,
  `max_attempts` int(11) NOT NULL DEFAULT 1,
  `pass_threshold` float NOT NULL DEFAULT 70,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `class_assessments`
--

INSERT INTO `class_assessments` (`id`, `class_id`, `chapter_id`, `material_id`, `title`, `description`, `start_date`, `due_date`, `duration`, `max_attempts`, `pass_threshold`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 4, 7, NULL, 'ulangan harian', NULL, '2026-07-06 07:51:00', '2026-07-13 07:51:00', 45, 5, 70, '2026-07-08 21:16:37', '2026-07-06 01:07:41', '2026-07-08 21:16:37');

-- --------------------------------------------------------

--
-- Struktur dari tabel `class_assessment_questions`
--

CREATE TABLE `class_assessment_questions` (
  `id` int(11) NOT NULL,
  `class_assessment_id` int(11) DEFAULT NULL,
  `class_question_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `class_assessment_questions`
--

INSERT INTO `class_assessment_questions` (`id`, `class_assessment_id`, `class_question_id`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2026-07-06 01:07:41', '2026-07-06 01:07:41');

-- --------------------------------------------------------

--
-- Struktur dari tabel `class_assignments`
--

CREATE TABLE `class_assignments` (
  `id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `chapter_id` int(11) NOT NULL,
  `material_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `due_date` timestamp NULL DEFAULT NULL,
  `grade` int(11) DEFAULT NULL,
  `status` enum('open','closed') NOT NULL DEFAULT 'open',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `class_assignments`
--

INSERT INTO `class_assignments` (`id`, `class_id`, `chapter_id`, `material_id`, `title`, `description`, `due_date`, `grade`, `status`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 4, 6, NULL, 'Menulis Essay Abbassiyyah', '<p>Rangkum seluruh buku Pintar Sejarah Islam. minimal 100 halaman HVS, deadline besok pagi jam 3 subuh</p>', '2026-07-06 20:00:00', 100, 'open', '2026-07-08 21:03:25', '2026-07-05 20:33:51', '2026-07-08 21:03:25'),
(2, 4, 7, NULL, 'rangkuman sejarah islam', '<p>buat rangkuman macam ini</p><p></p><img class=\"rounded-sm max-w-full\" src=\"http://localhost:8000/storage/materials/images/7aOMwAcm7PjmQDqQ6xcJIiJpQOFk9sqYerCzXHJc.png\" alt=\"DIAJAR LOGO\" style=\"width: 25%; float: left; margin-right: 1rem;\"><p></p>', '2026-07-08 11:30:00', 100, 'open', '2026-07-06 22:59:58', '2026-07-06 22:52:15', '2026-07-06 22:59:58'),
(3, 4, 7, NULL, 'rangkuman sejarah islam', '<p>buat rangkuman macam ini</p><p></p><img class=\"rounded-sm max-w-full\" src=\"http://localhost:8000/storage/materials/images/7aOMwAcm7PjmQDqQ6xcJIiJpQOFk9sqYerCzXHJc.png\" alt=\"DIAJAR LOGO\" style=\"width: 25%; float: left; margin-right: 1rem;\"><p></p>', '2026-07-08 11:30:00', 100, 'open', '2026-07-06 23:00:00', '2026-07-06 22:53:09', '2026-07-06 23:00:00'),
(4, 4, 7, NULL, 'rangkuman sejarah islam', '<p>buat rangkuman macam ini</p><p></p><img class=\"rounded-sm max-w-full\" src=\"http://localhost:8000/storage/materials/images/7aOMwAcm7PjmQDqQ6xcJIiJpQOFk9sqYerCzXHJc.png\" alt=\"DIAJAR LOGO\" style=\"width: 25%; float: left; margin-right: 1rem;\"><p></p>', '2026-07-08 11:30:00', 100, 'open', '2026-07-06 23:00:09', '2026-07-06 22:53:29', '2026-07-06 23:00:09'),
(5, 4, 7, NULL, 'rangkuman sejarah islam', '<p>buat rangkuman macam ini</p><p></p><img class=\"rounded-sm max-w-full\" src=\"http://localhost:8000/storage/materials/images/7aOMwAcm7PjmQDqQ6xcJIiJpQOFk9sqYerCzXHJc.png\" alt=\"DIAJAR LOGO\" style=\"width: 25%; float: left; margin-right: 1rem;\"><p></p>', '2026-07-08 11:30:00', 100, 'open', '2026-07-06 23:00:13', '2026-07-06 22:53:35', '2026-07-06 23:00:13'),
(6, 4, 7, NULL, 'rangkuman sejarah islam', '<p>buat rangkuman macam ini</p><p></p><img class=\"rounded-sm max-w-full\" src=\"http://localhost:8000/storage/materials/images/7aOMwAcm7PjmQDqQ6xcJIiJpQOFk9sqYerCzXHJc.png\" alt=\"DIAJAR LOGO\" style=\"width: 25%; float: left; margin-right: 1rem;\"><p></p>', '2026-07-08 11:30:00', 100, 'open', '2026-07-06 23:00:16', '2026-07-06 22:53:39', '2026-07-06 23:00:16'),
(7, 4, 7, NULL, 'rangkuman sejarah islam', '<p>buat rangkuman macam ini</p>', '2026-07-08 11:30:00', 100, 'open', '2026-07-06 23:00:18', '2026-07-06 22:53:50', '2026-07-06 23:00:18'),
(8, 4, 7, NULL, 'rangkuman sejarah islam', '<p>buat rangkuman macam ini</p>', '2026-07-08 11:30:00', 100, 'open', '2026-07-06 23:00:21', '2026-07-06 22:53:53', '2026-07-06 23:00:21'),
(9, 4, 7, NULL, 'rangkuman sejarah islam', '<p>buat rangkuman macam ini</p>', '2026-07-08 11:30:00', 100, 'open', '2026-07-08 21:03:30', '2026-07-06 22:54:36', '2026-07-08 21:03:30'),
(10, 4, 7, NULL, 'rangkuman sejarah islam', '<p>buat rangkuman macam ini</p>', '2026-07-08 11:30:00', 100, 'open', '2026-07-06 23:00:03', '2026-07-06 22:56:07', '2026-07-06 23:00:03'),
(11, 4, 8, NULL, 'rangkum bab10', NULL, '2026-07-09 05:51:00', 100, 'open', NULL, '2026-07-08 22:52:50', '2026-07-08 22:52:50');

-- --------------------------------------------------------

--
-- Struktur dari tabel `class_assignment_attachments`
--

CREATE TABLE `class_assignment_attachments` (
  `id` int(11) NOT NULL,
  `class_assignment_id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `file_url` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `class_assignment_attachments`
--

INSERT INTO `class_assignment_attachments` (`id`, `class_assignment_id`, `title`, `file_url`, `created_at`, `updated_at`) VALUES
(1, 1, 'Timeline Sejarah Islam', 'http://localhost:8000/storage/assignments/attachments/buRQWEV7PEC9gLNsxervECCz0OX1feFEPseqrlAp.png', '2026-07-05 20:51:55', '2026-07-05 20:51:55');

-- --------------------------------------------------------

--
-- Struktur dari tabel `class_group_years`
--

CREATE TABLE `class_group_years` (
  `id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `group_year_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `class_group_years`
--

INSERT INTO `class_group_years` (`id`, `class_id`, `group_year_id`, `created_at`, `updated_at`) VALUES
(8, 4, 4, NULL, NULL),
(9, 4, 5, NULL, NULL),
(10, 4, 9, NULL, NULL),
(11, 4, 10, NULL, NULL),
(12, 4, 14, NULL, NULL),
(16, 4, 6, NULL, NULL),
(17, 5, 7, NULL, NULL),
(18, 5, 8, NULL, NULL),
(19, 5, 13, NULL, NULL),
(20, 5, 16, NULL, NULL),
(21, 7, 4, NULL, NULL),
(22, 7, 5, NULL, NULL),
(23, 7, 10, NULL, NULL),
(24, 7, 11, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `class_options`
--

CREATE TABLE `class_options` (
  `id` int(11) NOT NULL,
  `class_question_id` int(11) DEFAULT NULL,
  `option` varchar(255) DEFAULT NULL,
  `is_correct` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `class_options`
--

INSERT INTO `class_options` (`id`, `class_question_id`, `option`, `is_correct`, `created_at`, `updated_at`) VALUES
(1, 1, 'YUNUS', 0, '2026-07-06 01:07:41', '2026-07-06 01:07:41'),
(2, 1, 'HUD', 1, '2026-07-06 01:07:41', '2026-07-06 01:07:41'),
(3, 1, 'NUH', 0, '2026-07-06 01:07:41', '2026-07-06 01:07:41'),
(4, 1, 'IBRAHIM', 0, '2026-07-06 01:07:41', '2026-07-06 01:07:41');

-- --------------------------------------------------------

--
-- Struktur dari tabel `class_questions`
--

CREATE TABLE `class_questions` (
  `id` int(11) NOT NULL,
  `question` text DEFAULT NULL,
  `levels` enum('0','1','2','3','4','5') DEFAULT NULL,
  `score` float DEFAULT 1,
  `explanation` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `class_questions`
--

INSERT INTO `class_questions` (`id`, `question`, `levels`, `score`, `explanation`, `created_at`, `updated_at`) VALUES
(1, '<p>kisah banjir zaman nabi nuh diceritakan pada surat...</p>', '0', 1, '<p>coba buka surat Hud ayat 25-44</p>', '2026-07-06 01:07:41', '2026-07-06 01:07:41');

-- --------------------------------------------------------

--
-- Struktur dari tabel `class_rubrics`
--

CREATE TABLE `class_rubrics` (
  `id` int(11) NOT NULL,
  `class_assignment_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `class_rubrics`
--

INSERT INTO `class_rubrics` (`id`, `class_assignment_id`, `title`, `description`, `created_at`, `updated_at`) VALUES
(1, 1, 'Rubrik Penilaian', NULL, '2026-07-05 20:33:51', '2026-07-05 20:33:51'),
(2, 3, 'rubrik penilaian', 'mengukur kejelasan argumen', '2026-07-06 22:53:09', '2026-07-06 22:53:09'),
(3, 4, 'rubrik penilaian', 'mengukur kejelasan argumen', '2026-07-06 22:53:29', '2026-07-06 22:53:29'),
(4, 5, 'rubrik penilaian', 'mengukur kejelasan argumen', '2026-07-06 22:53:35', '2026-07-06 22:53:35'),
(5, 6, 'rubrik penilaian', 'mengukur kejelasan argumen', '2026-07-06 22:53:39', '2026-07-06 22:53:39'),
(6, 7, 'rubrik penilaian', 'mengukur kejelasan argumen', '2026-07-06 22:53:50', '2026-07-06 22:53:50'),
(7, 8, 'rubrik penilaian', 'mengukur kejelasan argumen', '2026-07-06 22:53:53', '2026-07-06 22:53:53'),
(9, 10, 'rubrik penilaian', 'mengukur kejelasan argumen', '2026-07-06 22:56:07', '2026-07-06 22:56:07'),
(10, 9, 'rubrik penilaian', NULL, '2026-07-07 08:34:05', '2026-07-07 08:34:05'),
(11, 11, 'rubrik penilaian', NULL, '2026-07-21 23:01:24', '2026-07-21 23:01:24');

-- --------------------------------------------------------

--
-- Struktur dari tabel `class_rubric_criteria`
--

CREATE TABLE `class_rubric_criteria` (
  `id` int(11) NOT NULL,
  `class_rubric_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `weight` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `class_rubric_criteria`
--

INSERT INTO `class_rubric_criteria` (`id`, `class_rubric_id`, `title`, `description`, `weight`, `created_at`, `updated_at`) VALUES
(1, 1, 'Gaya penulisan', NULL, 50, '2026-07-05 20:33:51', '2026-07-05 20:33:51'),
(2, 1, 'Argumen', NULL, 50, '2026-07-05 20:33:51', '2026-07-05 20:33:51'),
(3, 2, 'kejelasan arguman', NULL, 100, '2026-07-06 22:53:09', '2026-07-06 22:53:09'),
(4, 3, 'kejelasan arguman', NULL, 100, '2026-07-06 22:53:29', '2026-07-06 22:53:29'),
(5, 4, 'kejelasan arguman', NULL, 100, '2026-07-06 22:53:35', '2026-07-06 22:53:35'),
(6, 5, 'kejelasan arguman', NULL, 100, '2026-07-06 22:53:39', '2026-07-06 22:53:39'),
(7, 6, 'kejelasan arguman', NULL, 100, '2026-07-06 22:53:50', '2026-07-06 22:53:50'),
(8, 7, 'kejelasan arguman', NULL, 100, '2026-07-06 22:53:53', '2026-07-06 22:53:53'),
(10, 9, 'kejelasan arguman', NULL, 100, '2026-07-06 22:56:07', '2026-07-06 22:56:07'),
(11, 10, 'kejelasan argumen', NULL, 75, '2026-07-07 08:34:05', '2026-07-07 20:29:37'),
(12, 10, 'Kerapihan penulisan', NULL, 25, '2026-07-07 20:29:37', '2026-07-07 20:29:37'),
(13, 11, 'kejelasan argumen', NULL, 75, '2026-07-21 23:01:24', '2026-07-21 23:01:24'),
(14, 11, 'kerapihan', NULL, 25, '2026-07-21 23:01:24', '2026-07-21 23:01:24');

-- --------------------------------------------------------

--
-- Struktur dari tabel `class_rubric_levels`
--

CREATE TABLE `class_rubric_levels` (
  `id` int(11) NOT NULL,
  `class_criterion_id` int(11) DEFAULT NULL,
  `label` varchar(255) DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `class_rubric_levels`
--

INSERT INTO `class_rubric_levels` (`id`, `class_criterion_id`, `label`, `score`, `description`, `created_at`, `updated_at`) VALUES
(1, 1, 'Natural', 3, 'tulisan hasil pemikiran sendiri', '2026-07-05 20:33:51', '2026-07-05 20:33:51'),
(2, 1, 'Lumayan', 2, 'bagus tapi agak kurang nyambung', '2026-07-05 20:33:51', '2026-07-05 20:33:51'),
(3, 1, 'Mirip AI', 1, 'dikerjain AI', '2026-07-05 20:33:51', '2026-07-05 20:33:51'),
(4, 2, 'Kuat', 3, 'Dalil jelas minimal 10 dalil', '2026-07-05 20:33:51', '2026-07-05 20:33:51'),
(5, 2, 'Lumayan', 2, 'ada dalil tapi dalilnya sebagian ga jelas', '2026-07-05 20:33:51', '2026-07-05 20:33:51'),
(6, 2, 'Ngarang', 1, 'ini mah dalil sendiri', '2026-07-05 20:33:51', '2026-07-05 20:33:51'),
(7, 3, 'tidak jelas', 1, 'argumen tidak bagus', '2026-07-06 22:53:09', '2026-07-06 22:53:09'),
(8, 3, 'jelas', 0, 'argumen bagus', '2026-07-06 22:53:09', '2026-07-06 22:53:09'),
(9, 4, 'tidak jelas', 1, 'argumen tidak bagus', '2026-07-06 22:53:29', '2026-07-06 22:53:29'),
(10, 4, 'jelas', 2, 'argumen bagus', '2026-07-06 22:53:29', '2026-07-06 22:53:29'),
(11, 5, 'tidak jelas', 1, 'argumen tidak bagus', '2026-07-06 22:53:35', '2026-07-06 22:53:35'),
(12, 5, 'jelas', 2, 'argumen bagus', '2026-07-06 22:53:35', '2026-07-06 22:53:35'),
(13, 6, 'tidak jelas', 1, 'argumen tidak bagus', '2026-07-06 22:53:39', '2026-07-06 22:53:39'),
(14, 6, 'jelas', 2, 'argumen bagus', '2026-07-06 22:53:39', '2026-07-06 22:53:39'),
(15, 7, 'tidak jelas', 1, 'argumen tidak bagus', '2026-07-06 22:53:50', '2026-07-06 22:53:50'),
(16, 7, 'jelas', 2, 'argumen bagus', '2026-07-06 22:53:50', '2026-07-06 22:53:50'),
(17, 8, 'tidak jelas', 1, 'argumen tidak bagus', '2026-07-06 22:53:53', '2026-07-06 22:53:53'),
(18, 8, 'jelas', 2, 'argumen bagus', '2026-07-06 22:53:53', '2026-07-06 22:53:53'),
(21, 10, 'tidak jelas', 1, 'argumen tidak bagus', '2026-07-06 22:56:07', '2026-07-06 22:56:07'),
(22, 10, 'jelas', 2, 'argumen bagus', '2026-07-06 22:56:07', '2026-07-06 22:56:07'),
(23, 11, 'ga jelas', 1, 'argumen ngawur', '2026-07-07 08:34:05', '2026-07-07 08:34:05'),
(24, 11, 'lumayan', 2, 'masih kurang tapi oke', '2026-07-07 08:34:05', '2026-07-07 08:34:05'),
(25, 11, 'jelas', 3, 'sangat mantap', '2026-07-07 08:34:05', '2026-07-07 08:34:05'),
(26, 12, 'sangat rapi', 4, NULL, '2026-07-07 20:29:37', '2026-07-07 20:29:37'),
(27, 12, 'rapi', 3, NULL, '2026-07-07 20:29:37', '2026-07-07 20:29:37'),
(28, 12, 'lumayan', 2, NULL, '2026-07-07 20:29:37', '2026-07-07 20:29:37'),
(29, 12, 'acak-acak', 1, NULL, '2026-07-07 20:29:37', '2026-07-07 20:29:37'),
(30, 13, 'jelas', 3, NULL, '2026-07-21 23:01:24', '2026-07-21 23:01:24'),
(31, 13, 'cukup', 2, NULL, '2026-07-21 23:01:24', '2026-07-21 23:01:24'),
(32, 13, 'tidak jelas', 1, NULL, '2026-07-21 23:01:24', '2026-07-21 23:01:24'),
(33, 14, 'rapi', 2, NULL, '2026-07-21 23:01:24', '2026-07-21 23:01:24'),
(34, 14, 'tidak', 1, NULL, '2026-07-21 23:01:24', '2026-07-21 23:01:24');

-- --------------------------------------------------------

--
-- Struktur dari tabel `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` varchar(255) NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `groups`
--

CREATE TABLE `groups` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `groups`
--

INSERT INTO `groups` (`id`, `name`, `created_at`, `updated_at`) VALUES
(4, '10 A', '2026-07-03 22:44:26', '2026-07-03 22:44:26'),
(5, '10 B', '2026-07-03 22:44:26', '2026-07-03 22:44:26'),
(6, '10 C', '2026-07-03 22:44:26', '2026-07-03 22:44:26'),
(7, '10 D', '2026-07-03 22:44:26', '2026-07-03 22:44:26'),
(8, '10 E', '2026-07-03 22:44:26', '2026-07-03 22:44:26'),
(9, '11 A', '2026-07-03 22:44:51', '2026-07-03 22:44:51'),
(10, '11 B', '2026-07-03 22:44:51', '2026-07-03 22:44:51'),
(11, '11 C', '2026-07-03 22:44:51', '2026-07-03 22:44:51'),
(12, '11 D', '2026-07-03 22:44:51', '2026-07-03 22:44:51'),
(13, '11 E', '2026-07-03 22:44:51', '2026-07-03 22:44:51'),
(14, '12 A', '2026-07-03 22:45:11', '2026-07-03 22:45:11'),
(15, '12 B', '2026-07-03 22:45:11', '2026-07-03 22:45:11'),
(16, '12 C', '2026-07-03 22:45:11', '2026-07-03 22:45:11'),
(17, '12 D', '2026-07-03 22:45:11', '2026-07-03 22:45:11');

-- --------------------------------------------------------

--
-- Struktur dari tabel `group_years`
--

CREATE TABLE `group_years` (
  `id` int(11) NOT NULL,
  `group_id` int(11) DEFAULT NULL,
  `year_id` int(11) DEFAULT NULL,
  `grade` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `group_years`
--

INSERT INTO `group_years` (`id`, `group_id`, `year_id`, `grade`, `created_at`, `updated_at`) VALUES
(4, 4, 2, 10, '2026-07-03 22:44:26', '2026-07-03 22:44:26'),
(5, 5, 2, 10, '2026-07-03 22:44:26', '2026-07-03 22:44:26'),
(6, 6, 2, 10, '2026-07-03 22:44:26', '2026-07-03 22:44:26'),
(7, 7, 2, 10, '2026-07-03 22:44:26', '2026-07-03 22:44:26'),
(8, 8, 2, 10, '2026-07-03 22:44:26', '2026-07-03 22:44:26'),
(9, 9, 2, 11, '2026-07-03 22:44:51', '2026-07-03 22:44:51'),
(10, 10, 2, 11, '2026-07-03 22:44:51', '2026-07-03 22:44:51'),
(11, 11, 2, 11, '2026-07-03 22:44:51', '2026-07-03 22:44:51'),
(12, 12, 2, 11, '2026-07-03 22:44:51', '2026-07-03 22:44:51'),
(13, 13, 2, 11, '2026-07-03 22:44:51', '2026-07-03 22:44:51'),
(14, 14, 2, 12, '2026-07-03 22:45:11', '2026-07-03 22:45:11'),
(15, 15, 2, 12, '2026-07-03 22:45:11', '2026-07-03 22:45:11'),
(16, 16, 2, 12, '2026-07-03 22:45:11', '2026-07-03 22:45:11'),
(17, 17, 2, 12, '2026-07-03 22:45:11', '2026-07-03 22:45:11');

-- --------------------------------------------------------

--
-- Struktur dari tabel `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` smallint(5) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `materials`
--

CREATE TABLE `materials` (
  `id` int(11) NOT NULL,
  `chapter_id` int(11) NOT NULL,
  `subchapter_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `order` int(11) DEFAULT NULL,
  `file_type` enum('video','text') NOT NULL,
  `duration_seconds` int(11) DEFAULT NULL,
  `file_url` varchar(255) DEFAULT NULL,
  `status` enum('draft','published') NOT NULL DEFAULT 'draft',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `materials`
--

INSERT INTO `materials` (`id`, `chapter_id`, `subchapter_id`, `title`, `description`, `content`, `order`, `file_type`, `duration_seconds`, `file_url`, `status`, `created_at`, `updated_at`) VALUES
(12, 8, 2, 'Cabang - Cabang Keimanan | Hikmah', 'Di sini kalian akan belajar tentang cabang-cabang keimanan, sebuah hikmah yang disampaikan oleh Buya Yahya', NULL, 2, 'video', 900, 'https://www.youtube.com/watch?v=aypspFSMIq8', 'published', '2026-07-08 21:41:33', '2026-07-08 21:43:26'),
(13, 8, 2, 'Panduan Sederhana Empat Karakter Mulia', NULL, '<h3><span style=\"font-family: Arial, sans-serif; font-size: 14pt;\">Menguatkan Akar, Menumbuhkan Pohon Iman: Panduan Sederhana Empat Karakter Mulia</span></h3><p><span style=\"font-family: Arial, sans-serif; font-size: 12pt;\">1. Pendahuluan: Iman Bukan Sekadar Ucapan</span></p><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\">Bayangkan iman sebagai sebuah pohon yang besar dan rimbun. Akar yang menghujam kuat ke tanah adalah keyakinan di dalam hati, namun keindahan dan manfaat pohon tersebut terlihat dari dahan-dahan yang menjulang—inilah yang kita sebut sebagai&nbsp; <strong>Cabang Iman</strong> . Iman tidak cukup hanya diucapkan dengan lisan; ia harus menjadi energi yang menggerakkan tindakan nyata.Tujuan kita mempelajari materi ini bukan sekadar untuk menghafal definisi, melainkan agar kalian mampu tumbuh menjadi pribadi yang tangguh dan bermartabat. Kita akan menelusuri empat pilar karakter:&nbsp; <strong>Menjaga Kehormatan</strong> ,&nbsp; <strong>Ikhlas</strong> ,&nbsp; <strong>Malu</strong> , dan&nbsp; <strong>Zuhud</strong> . Dengan memahami dahan-dahan iman ini, kalian akan memiliki panduan konkret untuk bersikap, baik saat berada di tengah keluarga, berinteraksi di sekolah, maupun berkontribusi di masyarakat. Mari kita mulai perjalanan ini dengan memahami bagaimana kita melindungi martabat diri sendiri.</span></p><p><span style=\"font-family: Arial, sans-serif; font-size: 12pt;\">2. Menjaga Kehormatan (Muru’ah &amp; ‘Iffah): Perisai Martabat Diri</span></p><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\">Dalam Islam, menjaga kehormatan adalah tentang menjaga harga diri dan kemuliaan sebagai manusia. Ada dua istilah kunci yang saling melengkapi:&nbsp; <em>Muru’ah</em>&nbsp; (penjagaan tingkah laku agar selaras dengan ajaran agama) dan&nbsp; <em>‘Iffah</em>&nbsp; (kemampuan menahan diri dari hawa nafsu dan hal-hal yang tidak pantas).Nilai ini ditegaskan dalam&nbsp; <strong>Q.S. Al-Ahzab/33: 35</strong> , yang menyebutkan bahwa laki-laki dan perempuan yang menjaga kehormatannya ( <em>al-hafizina furujahum</em> ) akan mendapatkan ampunan dan pahala yang besar dari Allah Swt.</span></p><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\">Tiga Dimensi Muru’ah</span></p><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\">Untuk menjaga kehormatan secara utuh, kita perlu memperhatikan tiga hal:</span></p><ul><li><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\"><strong>Muru’ah terhadap diri sendiri:</strong>&nbsp; Mempertahankan perilaku mulia dan menjauhi maksiat meskipun saat sedang sendirian dan tidak ada orang lain yang melihat.</span></p></li><li><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\"><strong>Muru’ah terhadap sesama:</strong>&nbsp; Menjaga etika, tutur kata, dan menghindari perilaku tercela saat berinteraksi di lingkungan keluarga, sekolah, dan masyarakat.</span></p></li><li><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\"><strong>Muru’ah terhadap Allah Swt.:</strong>&nbsp; Merasa malu kepada Allah dengan kesadaran bahwa Ia selalu mengawasi ( <em>taqarrub</em> ), sehingga kita disiplin menjalankan perintah-Nya dan menjauhi larangan-Nya.</span></p></li></ul><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\">5 Contoh Nyata Menjaga Kehormatan</span></p><ol><li><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\"><strong>Integritas Lisan:</strong>&nbsp; Tidak mengejek teman, menghindari gosip, dan tidak menggunakan kata-kata kasar.</span></p></li><li><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\"><strong>Berpakaian Syar’i:</strong>&nbsp; Menggunakan pakaian yang menutup aurat dan tidak menonjolkan lekuk tubuh sebagai bentuk penghormatan pada diri sendiri.</span></p></li><li><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\"><strong>Menjaga Pergaulan:</strong>&nbsp; Menghindari pergaulan bebas dan situasi yang dapat menjerumuskan pada perbuatan zina.</span></p></li><li><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\"><strong>Konsumsi Halal:</strong>&nbsp; Memastikan hanya makanan dan minuman halal yang masuk ke tubuh, karena apa yang kita konsumsi memengaruhi kesucian hati.</span></p></li><li><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\"><strong>Integritas Amanah:</strong>&nbsp; Tidak menyalahgunakan jabatan (misalnya sebagai pengurus OSIS) dan mempergunakan harta di jalan yang baik seperti bersedekah.\"Kekayaan bukanlah dari banyaknya harta, tetapi kekayaan yang sejati adalah kekayaan hati.\" (H.R. Al-Bukhari)Setelah memahami cara menjaga harga diri, langkah selanjutnya adalah memastikan bahwa setiap tindakan mulia tersebut didorong oleh niat yang murni, bukan sekadar ingin dilihat orang lain.</span></p></li></ol><p><span style=\"font-family: Arial, sans-serif; font-size: 12pt;\">3. Ikhlas: Menjernihkan Niat dari \"Penyakit\" Pujian</span></p><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\">Ikhlas adalah kejernihan batin dalam beramal. Secara istilah, ikhlas berarti membersihkan amal perbuatan dari hal-hal yang mengotorinya, seperti mengharap pujian manusia ( <em>riya’</em> ). Allah Swt. berfirman dalam&nbsp; <strong>Q.S. Az-Zumar/39: 2</strong> :&nbsp; <em>\"Maka sembahlah Allah dengan tulus ikhlas beragama kepada-Nya.\"</em></span></p><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\">Tingkatan Ikhlas dalam Beramal</span></p><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\">Tingkatan,Nama,Orientasi Utama (Tujuan)</span></p><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\">Tingkat 1,Awam (Umum),Beribadah sambil menghitung keuntungan dunia dan akhirat (misal: sedekah agar dagangan laris dan masuk surga).</span></p><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\">Tingkat 2,Khawash (Khusus),\"Berorientasi murni pada keuntungan akhirat, mengharap pahala dan surga-Nya.\"</span></p><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\">Tingkat 3,Khawashul Khawas,\"Murni mengharap ridha Allah karena rasa cinta ( mahabbah ) dan rindu kepada-Nya. Ibadah sudah menjadi kebutuhan, bukan beban.\"</span></p><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\">Ciri Orang yang Ikhlas (Imam Dzun Nun)</span></p><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\">Seseorang dikatakan telah mencapai hakikat ikhlas jika:</span></p><ol><li><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\">Tetap stabil dalam beramal, tidak terpengaruh oleh pujian maupun hinaan orang lain.</span></p></li><li><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\">Fokus pada hakikat perbuatan sebagai perintah Allah, bukan pada manfaat atau bahaya duniawi.</span></p></li><li><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\">Sudah tidak lagi mengingat-ingat atau menghitung pahala dari amal yang dilakukan.Jika ikhlas adalah \"mesin\" yang menggerakkan amal kita dari dalam, maka ada satu perasaan halus yang berfungsi sebagai \"rem\" atau kompas internal agar kita tidak melakukan hal yang memalukan.</span></p></li></ol><p><span style=\"font-family: Arial, sans-serif; font-size: 12pt;\">4. Malu (Haya’): Kompas Internal Penjaga Kebaikan</span></p><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\">Malu dalam Islam bukanlah sifat penakut, melainkan pendorong kebaikan. Malu adalah \"integritas fisik dan digital\" kita—sebuah perasaan yang mencegah kita melakukan hal yang mendatangkan aib. Rasulullah Saw. menegaskan bahwa malu adalah bagian dari iman (H.R. Al-Bukhari).</span></p><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\">Dua Jenis Rasa Malu</span></p><ul><li><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\"><strong>Malu Naluri (</strong>&nbsp; <strong><em>Gharizah</em></strong>&nbsp; <strong>):</strong>&nbsp; Sifat alami sejak lahir yang mendorong manusia melakukan hal-hal indah dan menghindari hal buruk secara spontan.</span></p></li><li><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\"><strong>Malu yang Dilatih (</strong>&nbsp; <strong><em>Muktasab</em></strong>&nbsp; <strong>):</strong>&nbsp; Rasa malu yang timbul dari kesadaran iman, terutama rasa malu kepada Allah karena merasa selalu dalam pengawasan-Nya ( <em>taqarrub</em> ).</span></p></li></ul><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\">Panduan \"Malu kepada Allah dengan Sebenarnya\"</span></p><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\">Berdasarkan Hadis Riwayat Al-Tirmidzi, berikut adalah instruksi praktis untuk melatih rasa malu:</span></p><ul><li><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\"><strong>Menjaga Kepala dan Perut:</strong>&nbsp; Menjaga apa yang dipikirkan/dilihat (integritas pikiran) dan memastikan hanya rezeki halal yang dikonsumsi (menjaga perut).</span></p></li><li><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\"><strong>Mengingat Kematian:</strong>&nbsp; Menyadari bahwa dunia ini fana dan setiap tindakan akan dipertanggungjawabkan.</span></p></li><li><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\"><strong>Meninggalkan Perhiasan Dunia:</strong>&nbsp; Tidak membiarkan diri tergiur oleh kemewahan yang melalaikan dari tujuan akhirat.Prinsip \"tidak tergiur hiasan dunia\" ini membawa kita pada karakter berikutnya: bagaimana cara memiliki dunia tanpa membiarkannya menjajah hati kita.</span></p></li></ul><p><span style=\"font-family: Arial, sans-serif; font-size: 12pt;\">5. Zuhud: Menaruh Dunia di Tangan, Bukan di Hati</span></p><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\">Zuhud sering disalahpahami sebagai benci harta atau harus hidup miskin. Sebaliknya, zuhud adalah sikap mental di mana harta di tangan digunakan sebagai alat untuk mendekatkan diri kepada Allah, namun tidak dibiarkan bertahta di dalam hati.</span></p><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\">Kisah Kesederhanaan Sayyidah Fathimah dan Ali bin Abi Thalib</span></p><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\">Suatu hari, Sayyidah Fathimah mendatangi ayahnya, Rasulullah Saw., untuk meminta seorang pembantu. Ali bin Abi Thalib bercerita bahwa&nbsp; <strong>dadanya terasa sakit karena sering memikul air sendiri</strong> , sementara Fathimah menunjukkan&nbsp; <strong>tangannya yang menjadi kasar dan kapalan karena setiap hari menumbuk gandum</strong>&nbsp; sendirian.Rasulullah Saw. menjawab dengan lembut namun tegas: \"Demi Allah, aku tidak akan memberikan apa yang kalian minta sementara aku membiarkan para&nbsp; <em>ahlu shuffah</em>&nbsp; (orang miskin di masjid) terlantar kelaparan. Aku akan menjual tawanan itu dan hasilnya digunakan untuk memberi nafkah bagi mereka yang lebih membutuhkan.\"</span></p><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\">Mengapa Zuhud Itu Penting?</span></p><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\">Zuhud adalah kunci agar kita terhindar dari penyakit&nbsp; <strong>Wahn</strong> , yaitu \"cinta dunia dan takut mati\". Rasulullah mengibaratkan umat yang terkena penyakit ini seperti&nbsp; <strong>buih di lautan</strong> —berjumlah banyak namun tidak memiliki kekuatan dan mudah terombang-ambing.Beberapa poin penting mengenai Zuhud:</span></p><ul><li><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\"><strong>Menurut Abu Sulaiman ad-Darani:</strong>&nbsp; Zuhud adalah meninggalkan segala sesuatu yang dapat menyibukkan diri sehingga melalaikan Allah.</span></p></li><li><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\"><strong>Menurut Al-Ghazali:</strong>&nbsp; Zuhud bukan berarti meninggalkan harta duniawi, melainkan mampu menikmati dunia tanpa menjadikannya tujuan utama atau merusak nama baik.</span></p></li><li><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\"><strong>A’maratul Ardh:</strong>&nbsp; Zuhud justru mendukung pembangunan dunia karena harta dikelola untuk manfaat orang banyak, bukan untuk keserakahan pribadi.</span></p></li></ul><p><span style=\"font-family: Arial, sans-serif; font-size: 12pt;\">6. Penutup: Menanam Karakter dalam Keseharian</span></p><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\">Keempat karakter ini—Menjaga Kehormatan, Ikhlas, Malu, dan Zuhud—adalah satu kesatuan yang membentuk kepribadian muslim yang tangguh. Kehormatan melindungi martabatmu, ikhlas memurnikan niatmu, malu menjaga langkahmu, dan zuhud membebaskan hatimu.</span></p><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\">Checklist Aksi Nyata Pelajar</span></p><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\">Mari kita mulai menerapkan nilai-nilai ini dalam keseharian:</span></p><ul><li><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\">&nbsp;&nbsp;<strong>Bertaqwa:</strong>&nbsp; Berdoa dengan sungguh-sungguh sebelum belajar dan menjaga shalat lima waktu.</span></p></li><li><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\">&nbsp;&nbsp;<strong>Kehormatan:</strong>&nbsp; Menutup aurat dengan rapi sesuai syariat di sekolah maupun saat keluar rumah.</span></p></li><li><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\">&nbsp;&nbsp;<strong>Integritas:</strong>&nbsp; Selalu menepati janji kepada guru dan teman tanpa alasan yang dibuat-buat.</span></p></li><li><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\">&nbsp;&nbsp;<strong>Kepedulian:</strong>&nbsp; Menyisihkan sebagian uang saku untuk infak atau membantu teman yang kesulitan.</span></p></li><li><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\">&nbsp;&nbsp;<strong>Lisan Mulia:</strong>&nbsp; Berhenti menggunakan kata kasar atau mengejek teman di media sosial maupun dunia nyata.</span></p></li><li><p><span style=\"font-family: Arial, sans-serif; font-size: 11pt;\">&nbsp;&nbsp;<strong>Rasa Malu:</strong>&nbsp; Merasa malu jika tidak mengerjakan tugas atau melanggar aturan sekolah.Ingatlah, iman adalah pohon yang butuh dirawat. Setiap dahan yang kalian jaga hari ini akan membuahkan ketenangan di hati dan manfaat bagi orang banyak di masa depan. Teruslah memupuk iman agar pohon karakter kalian tumbuh kuat dan berbuah manis. Selamat berjuang menjadi pribadi yang lebih baik!</span></p></li></ul><p><br></p>', 1, 'text', 900, NULL, 'published', '2026-07-08 21:42:07', '2026-07-08 21:42:07'),
(14, 8, 3, 'Bersikap Zuhud', NULL, NULL, 1, 'video', 900, 'https://www.youtube.com/watch?v=Wp2VInXiWRk', 'published', '2026-07-08 21:42:56', '2026-07-08 21:42:56'),
(15, 9, 4, 'Adab Bermedia Sosial - 5 Menit Inspirasi', NULL, NULL, 2, 'video', 420, 'https://www.youtube.com/watch?v=0wFgDg4FPn0', 'published', '2026-07-08 21:44:53', '2026-07-08 21:45:49'),
(16, 9, 4, 'Adab Dalam Bermedia Sosial Menurut Pandangan Islam', NULL, '<p>Berdasarkan riset yang dilakukan oleh Asosiasi Penyelenggara Jasa Internet Indonesia (APJII) sekitar 196,71 juta orang Indonesia (73,7%) telah terhubung dengan jaringan internet pengguna sepanjang tahun 2019-2020. Hal tersebut terlihat bahwa sebagian besar masyarakat Indonesia cenderung menggunakan internet dalam segala hal, terutama dalam berkomunikasi dan mencari informasi. Media sosial merupakan wadah yang sering digunakan oleh masyarakat khususnya anak muda untuk berinteraksi antar sesama. Setiap hari sebagian besar masyarakat Indonesia mengkases media sosial untuk mencari hiburan dan informasi yang dibutuhkan bahkan menjadikan media sosial sebagai ladang untuk memperoleh pendapatan.</p><p>Namun dalam menggunakan media sosial perlu memperhatikan beberapa hal yang sesuai dengan ajaran Islam. Islam sebagai agama yang menuntun umatnya untuk selalu mengutamakan berbuat baik dalam setiap sisi kehidupan, termasuk memiliki batasan-batasan bagi umatnya dalam menggunakan media sosial secara bijak dan tetap memperhatikan etika dan moral.</p><p>Berikut adab dalam menggunakan media sosial sesuai ajaran Islam:</p><ol><li><p><strong>Mencari informasi yang bermanfaat.</strong>&nbsp;Dalam menggunakan media sosial seyogyanya kita memanfaatkannya dengan bijak dan positif, salah satunya dengan menjadikan media sosial sebagai sarana untuk mencari informasi dan pengetahuan yang bermanfaat. Rasulullah SAW bersabda:&nbsp;<em>“</em>Barang siapa menempuh satu jalan (cara) untuk mendapatkan ilmu, maka Allah pasti mudahkan baginya jalan menuju surga.” (HR. Muslim)</p></li><li><p><strong><em>Tabayyun</em></strong>. Sebagai seorang muslim kita harus bersikap tabayyun terlebih dahulu dalam menerima informasi atau berita. Hal ini perlu dilakukan untuk meminimalisir kesalahan informasi atau berita yang tidak bisa dipertanggungjawabkan. Seperti dalam firman Allah pada surat Al-Hujurat ayat 6:&nbsp;<em>“Hai orang-orang yang beriman, jika datang kepadamu orang fasik membawa suatu berita, maka periksalah dengan teliti agar kamu tidak menimpakan suatu musibah kepada suatu kaum tanpa mengetahui keadaannya yang menyebabkan kamu menyesal atas perbuatanmu itu</em>.” (QS. Al-Hujurat [49]:6)</p></li><li><p><strong>Tidak menebarkan kebencian dan berita palsu</strong>. Ujaran kebencian dan menyebarkan berita palsu termasuk ke dalam akhlak yang tercela (akhlak madzmumah) yang bertentangan dengan ajaran Islam. Allah SWT berfirman:&nbsp;<em>“Sesungguhnya yang mengada-adakan kebohongan, hanyalah orang-orang yang tidak beriman kepada ayat-ayat Allah, dan mereka itulah orang-orang pendusta.</em>“(QS. al-Nahl: 105).</p></li><li><p><strong>Menjaga lisan dan kata-kata dalam berucap</strong>. Sebagai umat muslim kita harus menjaga tutur kata dalam setiap kegiatan, termasuk dalam bermedia sosial. Jangan sampai perkataan kita di dunia maya menyakiti atau berkata-kata tidak baik yang tidak sesuai dengan ajaran Islam. Rasulullah SAW juga bersabda: “Hendaklah engkau lebih banyak diam, sebab diam dapat menyingkirkan setan dan menolongmu terhadap urusan agamamu.” (H.R. Ahmad).</p></li><li><p><strong>Jadikan media sosial sebagai sarana menyebarkan kebaikan.</strong>&nbsp;Kegiatan dakwah merupakan hal dasar dalam agama Islam untuk mendorong dan mengajak orang lain agar menjadi insan yang berakhlak dan berpengetahuan. Dakwah dapat disampaikan melalui berbagai cara dan berbagai media, salah satunya melalui media sosial. Maka dari itu hendak lah kita memanfaatkan media sosial sebagai sarana untuk berdakwah dengan cara membagikan konten yang positif dan menebar kebaikan. Sebagaimana Rasullah SAW bersabda : “Barangsiapa yang menunjuki kepada kebaikan maka dia akan mendapatkan pahala seperti pahala orang yang mengerjakannya” (HR. Muslim)</p></li></ol><p></p>', 1, 'text', 600, NULL, 'published', '2026-07-08 21:45:49', '2026-07-08 21:45:49'),
(17, 9, 5, 'Cara Memiliki Hati yang Bersih', 'Selamat menonton anak-anak!', NULL, 1, 'video', 600, 'https://www.youtube.com/watch?v=wdfWdRBvHp4', 'published', '2026-07-08 21:46:38', '2026-07-08 21:46:46'),
(18, 10, 6, 'Nasihat Bagi yang Ingin Menikah', 'Kalian jangan dulu ya, belum beres sekolah 😀', NULL, 1, 'video', 1020, 'https://www.youtube.com/watch?v=O2VKUq7H5nk', 'published', '2026-07-08 21:47:56', '2026-07-08 21:47:56'),
(19, 10, 8, 'Nikah dengan Orang Luar Negeri?', 'ngarep aja dulu', NULL, 1, 'video', 2400, 'https://www.youtube.com/watch?v=ARs3Oc_Lwts', 'published', '2026-07-08 21:50:54', '2026-07-08 21:50:54'),
(20, 10, 7, 'Ketentuan Pernikahan dalam Islam', 'Materi PAI Kelas XI Semester 2', NULL, 1, 'video', 720, 'https://www.youtube.com/watch?v=vfl2I7eY9IM', 'published', '2026-07-08 21:51:54', '2026-07-08 21:51:54');

-- --------------------------------------------------------

--
-- Struktur dari tabel `material_access_logs`
--

CREATE TABLE `material_access_logs` (
  `id` int(11) NOT NULL,
  `material_id` int(11) DEFAULT NULL,
  `student_id` int(11) DEFAULT NULL,
  `access_start` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `access_end` timestamp NULL DEFAULT NULL,
  `duration_seconds` int(11) DEFAULT NULL,
  `interaction_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`interaction_data`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `material_access_logs`
--

INSERT INTO `material_access_logs` (`id`, `material_id`, `student_id`, `access_start`, `access_end`, `duration_seconds`, `interaction_data`, `created_at`, `updated_at`) VALUES
(52, 13, 151, '2026-07-08 21:53:18', NULL, NULL, NULL, '2026-07-08 21:53:18', '2026-07-08 21:53:18'),
(53, 13, 151, '2026-07-09 05:22:40', '2026-07-08 22:22:40', 25197, '{\"type\":\"exit\"}', '2026-07-08 22:21:27', '2026-07-08 22:22:40'),
(54, 12, 151, '2026-07-09 05:50:04', '2026-07-08 22:50:04', 25199, '{\"type\":\"exit\"}', '2026-07-08 22:48:38', '2026-07-08 22:50:04'),
(55, 12, 151, '2026-07-09 05:50:45', '2026-07-08 22:50:45', -10, '{\"type\":\"exit\"}', '2026-07-08 22:50:35', '2026-07-08 22:50:45'),
(56, 13, 151, '2026-07-09 05:51:10', '2026-07-08 22:51:10', -5, '{\"type\":\"exit\"}', '2026-07-08 22:51:06', '2026-07-08 22:51:10'),
(57, 12, 151, '2026-07-09 05:51:17', '2026-07-08 22:51:17', -3, '{\"type\":\"exit\"}', '2026-07-08 22:51:14', '2026-07-08 22:51:17'),
(58, 13, 151, '2026-07-11 02:26:41', '2026-07-10 19:26:41', -11, '{\"type\":\"exit\"}', '2026-07-10 19:26:30', '2026-07-10 19:26:41'),
(59, 12, 151, '2026-07-11 02:27:13', '2026-07-10 19:27:13', -20, '{\"type\":\"exit\"}', '2026-07-10 19:26:54', '2026-07-10 19:27:13'),
(60, 12, 151, '2026-07-11 02:28:04', '2026-07-10 19:28:04', -11, '{\"type\":\"exit\"}', '2026-07-10 19:27:53', '2026-07-10 19:28:04'),
(61, 12, 151, '2026-07-13 07:18:07', NULL, NULL, NULL, '2026-07-13 07:18:07', '2026-07-13 07:18:07'),
(62, 12, 151, '2026-07-13 07:45:10', NULL, NULL, NULL, '2026-07-13 07:45:10', '2026-07-13 07:45:10'),
(63, 12, 151, '2026-07-13 07:52:48', NULL, NULL, NULL, '2026-07-13 07:52:48', '2026-07-13 07:52:48'),
(64, 12, 151, '2026-07-13 07:53:12', NULL, NULL, NULL, '2026-07-13 07:53:12', '2026-07-13 07:53:12'),
(65, 12, 151, '2026-07-13 08:01:50', NULL, NULL, NULL, '2026-07-13 08:01:50', '2026-07-13 08:01:50'),
(66, 12, 151, '2026-07-13 08:02:45', NULL, NULL, NULL, '2026-07-13 08:02:45', '2026-07-13 08:02:45'),
(67, 12, 151, '2026-07-13 15:21:11', '2026-07-13 08:21:11', -1099, '{\"type\":\"exit\"}', '2026-07-13 08:02:52', '2026-07-13 08:21:11'),
(68, 12, 151, '2026-07-13 15:22:25', '2026-07-13 08:22:25', 25198, '{\"type\":\"exit\"}', '2026-07-13 08:21:14', '2026-07-13 08:22:25'),
(69, 12, 151, '2026-07-13 08:30:23', NULL, NULL, NULL, '2026-07-13 08:30:23', '2026-07-13 08:30:23'),
(70, 12, 151, '2026-07-13 08:32:31', NULL, NULL, NULL, '2026-07-13 08:32:31', '2026-07-13 08:32:31'),
(71, 12, 151, '2026-07-13 08:35:49', NULL, NULL, NULL, '2026-07-13 08:35:49', '2026-07-13 08:35:49'),
(72, 13, 151, '2026-07-13 08:59:10', NULL, NULL, NULL, '2026-07-13 08:59:10', '2026-07-13 08:59:10'),
(73, 13, 151, '2026-07-13 09:03:59', NULL, NULL, NULL, '2026-07-13 09:03:59', '2026-07-13 09:03:59'),
(74, 12, 151, '2026-07-13 16:11:13', '2026-07-13 09:11:13', -14, '{\"type\":\"exit\"}', '2026-07-13 09:11:00', '2026-07-13 09:11:13'),
(75, 16, 151, '2026-07-13 16:11:36', '2026-07-13 09:11:36', -7, '{\"type\":\"exit\"}', '2026-07-13 09:11:29', '2026-07-13 09:11:36'),
(76, 12, 151, '2026-07-14 02:32:18', '2026-07-13 19:32:18', -13, '{\"type\":\"exit\"}', '2026-07-13 19:32:05', '2026-07-13 19:32:18'),
(77, 12, 151, '2026-07-13 19:44:11', NULL, NULL, NULL, '2026-07-13 19:44:11', '2026-07-13 19:44:11'),
(78, 12, 151, '2026-07-13 19:58:30', NULL, NULL, NULL, '2026-07-13 19:58:30', '2026-07-13 19:58:30'),
(79, 12, 151, '2026-07-13 20:01:08', NULL, NULL, NULL, '2026-07-13 20:01:08', '2026-07-13 20:01:08'),
(80, 12, 151, '2026-07-13 20:01:15', NULL, NULL, NULL, '2026-07-13 20:01:15', '2026-07-13 20:01:15'),
(81, 14, 151, '2026-07-22 04:15:34', '2026-07-21 21:15:34', 25194, '{\"type\":\"exit\"}', '2026-07-21 21:15:02', '2026-07-21 21:15:34'),
(82, 14, 151, '2026-07-22 04:16:16', '2026-07-21 21:16:16', -6, '{\"type\":\"exit\"}', '2026-07-21 21:16:10', '2026-07-21 21:16:16'),
(83, 14, 151, '2026-07-22 06:14:58', '2026-07-21 23:14:58', 25186, '{\"type\":\"exit\"}', '2026-07-21 23:14:21', '2026-07-21 23:14:58'),
(84, 15, 151, '2026-07-22 06:20:43', '2026-07-21 23:20:43', 25149, '{\"type\":\"exit\"}', '2026-07-21 23:16:59', '2026-07-21 23:20:43'),
(85, 17, 151, '2026-07-21 23:20:44', NULL, NULL, NULL, '2026-07-21 23:20:44', '2026-07-21 23:20:44');

-- --------------------------------------------------------

--
-- Struktur dari tabel `material_completion`
--

CREATE TABLE `material_completion` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `material_id` int(11) NOT NULL,
  `is_completed` tinyint(1) NOT NULL DEFAULT 0,
  `completed_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `material_completion`
--

INSERT INTO `material_completion` (`id`, `student_id`, `material_id`, `is_completed`, `completed_at`, `created_at`, `updated_at`) VALUES
(4, 151, 12, 1, '2026-07-08 22:50:00', '2026-07-08 22:50:00', '2026-07-08 22:50:00'),
(5, 151, 14, 1, '2026-07-21 23:14:43', '2026-07-21 21:15:28', '2026-07-21 23:14:43'),
(6, 151, 15, 1, '2026-07-21 23:19:51', '2026-07-21 23:19:51', '2026-07-21 23:19:51');

-- --------------------------------------------------------

--
-- Struktur dari tabel `material_reviews`
--

CREATE TABLE `material_reviews` (
  `id` int(11) NOT NULL,
  `material_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `score` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

--
-- Dumping data untuk tabel `material_reviews`
--

INSERT INTO `material_reviews` (`id`, `material_id`, `student_id`, `score`, `created_at`, `updated_at`) VALUES
(3, 12, 151, 4, '2026-07-08 22:49:59', '2026-07-08 22:49:59'),
(4, 14, 151, 4, '2026-07-21 21:15:27', '2026-07-21 21:15:27');

-- --------------------------------------------------------

--
-- Struktur dari tabel `migrations`
--

CREATE TABLE `migrations` (
  `id` int(11) NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(52, '0001_01_01_000000_create_users_table', 1),
(53, '2026_07_04_224228_add_tags_to_chapters_table', 2),
(54, '2026_07_05_225307_add_target_fields_to_chapters_table', 3),
(55, '2026_07_06_030941_create_class_assignment_attachments_table', 4);

-- --------------------------------------------------------

--
-- Struktur dari tabel `options`
--

CREATE TABLE `options` (
  `id` int(11) NOT NULL,
  `question_id` int(11) DEFAULT NULL,
  `option` varchar(255) DEFAULT NULL,
  `is_correct` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `options`
--

INSERT INTO `options` (`id`, `question_id`, `option`, `is_correct`, `created_at`, `updated_at`) VALUES
(1, 1, 'YUNUS', 0, '2026-07-06 00:44:56', '2026-07-06 00:44:56'),
(2, 1, 'HUD', 1, '2026-07-06 00:44:56', '2026-07-06 00:44:56'),
(3, 1, 'NUH', 0, '2026-07-06 00:44:56', '2026-07-06 00:44:56'),
(4, 1, 'IBRAHIM', 0, '2026-07-06 00:44:56', '2026-07-06 00:44:56');

-- --------------------------------------------------------

--
-- Struktur dari tabel `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `planables`
--

CREATE TABLE `planables` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `plan_id` bigint(20) UNSIGNED NOT NULL,
  `planable_type` varchar(255) NOT NULL,
  `planable_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `planables`
--

INSERT INTO `planables` (`id`, `plan_id`, `planable_type`, `planable_id`, `created_at`, `updated_at`) VALUES
(1, 5, 'App\\Models\\Material', 11, '2026-07-08 18:23:54', '2026-07-08 18:23:54'),
(2, 6, 'App\\Models\\Material', 11, '2026-07-08 19:08:19', '2026-07-08 19:08:19'),
(3, 7, 'App\\Models\\Material', 12, '2026-07-08 22:49:36', '2026-07-08 22:49:36'),
(4, 8, 'App\\Models\\Material', 12, '2026-07-08 22:57:51', '2026-07-08 22:57:51'),
(5, 9, 'App\\Models\\Material', 20, '2026-07-10 19:27:41', '2026-07-10 19:27:41'),
(6, 10, 'App\\Models\\Material', 16, '2026-07-21 23:16:50', '2026-07-21 23:16:50');

-- --------------------------------------------------------

--
-- Struktur dari tabel `plans`
--

CREATE TABLE `plans` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `class_id` int(11) DEFAULT NULL,
  `chapter_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `target_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `progress` float DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `plans`
--

INSERT INTO `plans` (`id`, `student_id`, `class_id`, `chapter_id`, `title`, `description`, `target_date`, `progress`, `completed_at`, `created_at`, `updated_at`) VALUES
(6, 13, 4, 7, 'Study: materi pembukaan', 'tes', '2026-07-09 17:00:00', 0, NULL, '2026-07-08 19:08:19', '2026-07-08 19:08:19'),
(7, 151, 4, 8, 'Study: Cabang - Cabang Keimanan | Hikmah', NULL, '2026-07-09 05:50:10', 1, '2026-07-08 22:50:10', '2026-07-08 22:49:36', '2026-07-08 22:50:10'),
(8, 151, NULL, 8, 'target', 'saya ingin paham ini', '2026-07-14 01:41:16', 0, '2026-07-13 18:41:15', '2026-07-08 22:57:51', '2026-07-13 18:41:16'),
(9, 151, NULL, 10, 'tes', 'tes', '2026-07-15 17:00:00', 0, NULL, '2026-07-10 19:27:41', '2026-07-10 19:27:41'),
(10, 151, 4, 9, 'Study: Adab Dalam Bermedia Sosial Menurut Pandangan Islam', 'tes', '2026-07-23 17:00:00', 0, NULL, '2026-07-21 23:16:50', '2026-07-21 23:16:50');

-- --------------------------------------------------------

--
-- Struktur dari tabel `questions`
--

CREATE TABLE `questions` (
  `id` int(11) NOT NULL,
  `subject_id` int(11) DEFAULT NULL,
  `question` text DEFAULT NULL,
  `levels` enum('0','1','2','3','4','5') DEFAULT NULL,
  `explanation` text DEFAULT NULL,
  `score` float DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `questions`
--

INSERT INTO `questions` (`id`, `subject_id`, `question`, `levels`, `explanation`, `score`, `created_at`, `updated_at`) VALUES
(1, 4, '<p>kisah banjir zaman nabi nuh diceritakan pada surat...</p>', '0', '<p>coba buka surat Hud ayat 25-44</p>', 1, '2026-07-06 00:44:56', '2026-07-06 00:44:56');

-- --------------------------------------------------------

--
-- Struktur dari tabel `reflectables`
--

CREATE TABLE `reflectables` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `reflection_id` int(11) NOT NULL,
  `reflectable_type` varchar(255) NOT NULL,
  `reflectable_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `reflectables`
--

INSERT INTO `reflectables` (`id`, `reflection_id`, `reflectable_type`, `reflectable_id`, `created_at`, `updated_at`) VALUES
(2, 5, 'App\\Models\\Material', 11, '2026-07-08 19:14:59', '2026-07-08 19:14:59'),
(3, 6, 'App\\Models\\ClassAssignment', 9, '2026-07-08 19:35:34', '2026-07-08 19:35:34'),
(4, 7, 'App\\Models\\Material', 12, '2026-07-08 22:49:58', '2026-07-08 22:49:58'),
(5, 8, 'App\\Models\\Material', 14, '2026-07-21 21:15:27', '2026-07-21 21:15:27'),
(6, 9, 'App\\Models\\Material', 15, '2026-07-21 23:19:50', '2026-07-21 23:19:50');

-- --------------------------------------------------------

--
-- Struktur dari tabel `reflections`
--

CREATE TABLE `reflections` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `comprehension_level` int(11) NOT NULL,
  `emotions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`emotions`)),
  `teacher_comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

--
-- Dumping data untuk tabel `reflections`
--

INSERT INTO `reflections` (`id`, `student_id`, `title`, `content`, `comprehension_level`, `emotions`, `teacher_comment`, `created_at`, `updated_at`) VALUES
(5, 13, 'Reflection: materi pembukaan', NULL, 5, '\"[]\"', NULL, '2026-07-08 19:14:59', '2026-07-08 20:12:17'),
(6, 13, 'Reflection: rangkuman sejarah islam', NULL, 3, '\"[]\"', NULL, '2026-07-08 19:35:34', '2026-07-08 19:35:34'),
(7, 151, 'Reflection: Cabang - Cabang Keimanan | Hikmah', NULL, 4, '\"[\\\"\\\\ud83d\\\\ude0a\\\",\\\"\\\\ud83d\\\\ude15\\\"]\"', NULL, '2026-07-08 22:49:58', '2026-07-13 19:42:10'),
(8, 151, 'Reflection: Bersikap Zuhud', 'lumayan lah', 4, '\"[\\\"\\\\ud83d\\\\ude15\\\"]\"', NULL, '2026-07-21 21:15:27', '2026-07-21 23:14:42'),
(9, 151, 'Reflection: Adab Bermedia Sosial - 5 Menit Inspirasi', NULL, 4, '\"[]\"', NULL, '2026-07-21 23:19:50', '2026-07-21 23:19:50');

-- --------------------------------------------------------

--
-- Struktur dari tabel `rubrics`
--

CREATE TABLE `rubrics` (
  `id` int(11) NOT NULL,
  `assignment_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `rubric_criteria`
--

CREATE TABLE `rubric_criteria` (
  `id` int(11) NOT NULL,
  `rubric_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `weight` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `rubric_levels`
--

CREATE TABLE `rubric_levels` (
  `id` int(11) NOT NULL,
  `criterion_id` int(11) DEFAULT NULL,
  `label` varchar(255) DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `rubric_points`
--

CREATE TABLE `rubric_points` (
  `id` int(11) NOT NULL,
  `class_criterion_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `class_rubric_level_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `rubric_points`
--

INSERT INTO `rubric_points` (`id`, `class_criterion_id`, `student_id`, `class_rubric_level_id`, `created_at`, `updated_at`) VALUES
(1, 11, 13, 24, '2026-07-07 20:08:01', '2026-07-07 20:23:58'),
(2, 12, 13, 26, '2026-07-07 20:30:03', '2026-07-07 20:42:34');

-- --------------------------------------------------------

--
-- Struktur dari tabel `school_years`
--

CREATE TABLE `school_years` (
  `id` int(11) NOT NULL,
  `date_start` date NOT NULL,
  `date_end` date NOT NULL,
  `name` varchar(20) NOT NULL,
  `status` enum('active','archive') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `active_validator` char(6) GENERATED ALWAYS AS (if(`status` = 'active','active',NULL)) STORED
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `school_years`
--

INSERT INTO `school_years` (`id`, `date_start`, `date_end`, `name`, `status`, `created_at`, `updated_at`) VALUES
(2, '2026-07-01', '2027-06-30', '2026/2027', 'active', '2026-07-03 21:37:15', '2026-07-03 21:37:15');

-- --------------------------------------------------------

--
-- Struktur dari tabel `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('cIiTZERWapJaUfE9IxyAb8xYTm9Dh16QfpavPqhp', 2, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJOcDAxSWtHM0gxaHpUSUpnb2ZkOHhWaGFwTk1Lajg2eHdKSEJ6M3BUIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2xvY2FsaG9zdDo4MDAwXC9sb2dpbiIsInJvdXRlIjoibG9naW4ifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119LCJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI6MiwicGFzc3dvcmRfaGFzaF93ZWIiOiJiMzg3M2I4YzljMzgxMDRkODQ1NmUxNmUxMWU0OWRhYWJhMDg4MmJiNGUyZTcxOTAzZGJhZTNjMmY1MGZkNWZiIn0=', 1784701334),
('K2fdxo9WoNoF7Mx8r6UOHhx0HiO4pmltGODXDVYh', 151, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0', 'eyJfdG9rZW4iOiJGdHNncUtMZjRBUThQYW1jYktaQXZTNW5iT0d4Q2c5ODdpUE5jNDZNIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2xvY2FsaG9zdDo4MDAwXC9sb2dpbiIsInJvdXRlIjoibG9naW4ifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119LCJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI6MTUxLCJwYXNzd29yZF9oYXNoX3dlYiI6ImIzODczYjhjOWMzODEwNGQ4NDU2ZTE2ZTExZTQ5ZGFhYmEwODgyYmI0ZTJlNzE5MDNkYmFlM2MyZjUwZmQ1ZmIifQ==', 1784701244),
('wVcZaLdKfnwuYyrbSQZ6209mq8DysAWAKhzsFGmD', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJmQjB6WFdaRGRIWkFBVzZ4RXFIU1V0SFZxanhlblJIZlNaNmw0d2lxIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119LCJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI6MSwicGFzc3dvcmRfaGFzaF93ZWIiOiJiMzg3M2I4YzljMzgxMDRkODQ1NmUxNmUxMWU0OWRhYWJhMDg4MmJiNGUyZTcxOTAzZGJhZTNjMmY1MGZkNWZiIn0=', 1784700371);

-- --------------------------------------------------------

--
-- Struktur dari tabel `student_groups`
--

CREATE TABLE `student_groups` (
  `id` int(11) NOT NULL,
  `student_id` int(11) DEFAULT NULL,
  `group_year_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `student_groups`
--

INSERT INTO `student_groups` (`id`, `student_id`, `group_year_id`, `created_at`, `updated_at`) VALUES
(6, 28, 4, '2026-07-04 03:24:57', '2026-07-04 03:24:57'),
(7, 29, 4, '2026-07-04 03:24:57', '2026-07-04 03:24:57'),
(8, 37, 4, '2026-07-04 03:24:57', '2026-07-04 03:24:57'),
(9, 46, 4, '2026-07-04 03:24:57', '2026-07-04 03:24:57'),
(10, 56, 4, '2026-07-04 03:24:57', '2026-07-04 03:24:57'),
(11, 67, 4, '2026-07-04 03:24:57', '2026-07-04 03:24:57'),
(12, 70, 4, '2026-07-04 03:24:57', '2026-07-04 03:24:57'),
(13, 114, 4, '2026-07-04 03:24:57', '2026-07-04 03:24:57'),
(14, 120, 4, '2026-07-04 03:24:57', '2026-07-04 03:24:57'),
(15, 138, 4, '2026-07-04 03:24:57', '2026-07-04 03:24:57'),
(16, 42, 5, '2026-07-04 03:26:37', '2026-07-04 03:26:37'),
(17, 51, 5, '2026-07-04 03:26:37', '2026-07-04 03:26:37'),
(18, 68, 5, '2026-07-04 03:26:37', '2026-07-04 03:26:37'),
(19, 80, 5, '2026-07-04 03:26:37', '2026-07-04 03:26:37'),
(20, 82, 5, '2026-07-04 03:26:37', '2026-07-04 03:26:37'),
(21, 103, 5, '2026-07-04 03:26:37', '2026-07-04 03:26:37'),
(22, 106, 5, '2026-07-04 03:26:37', '2026-07-04 03:26:37'),
(23, 126, 5, '2026-07-04 03:26:37', '2026-07-04 03:26:37'),
(24, 137, 5, '2026-07-04 03:26:37', '2026-07-04 03:26:37'),
(25, 142, 5, '2026-07-04 03:26:37', '2026-07-04 03:26:37'),
(26, 13, 6, '2026-07-04 03:28:10', '2026-07-04 03:28:10'),
(27, 21, 6, '2026-07-04 03:28:10', '2026-07-04 03:28:10'),
(28, 30, 6, '2026-07-04 03:28:10', '2026-07-04 03:28:10'),
(29, 38, 6, '2026-07-04 03:28:10', '2026-07-04 03:28:10'),
(30, 54, 6, '2026-07-04 03:28:10', '2026-07-04 03:28:10'),
(31, 59, 6, '2026-07-04 03:28:10', '2026-07-04 03:28:10'),
(32, 87, 6, '2026-07-04 03:28:10', '2026-07-04 03:28:10'),
(33, 91, 6, '2026-07-04 03:28:10', '2026-07-04 03:28:10'),
(34, 130, 6, '2026-07-04 03:28:10', '2026-07-04 03:28:10'),
(35, 132, 6, '2026-07-04 03:28:10', '2026-07-04 03:28:10'),
(36, 31, 7, '2026-07-04 03:29:29', '2026-07-04 03:29:29'),
(37, 36, 7, '2026-07-04 03:29:29', '2026-07-04 03:29:29'),
(38, 50, 7, '2026-07-04 03:29:29', '2026-07-04 03:29:29'),
(39, 52, 7, '2026-07-04 03:29:29', '2026-07-04 03:29:29'),
(40, 71, 7, '2026-07-04 03:29:29', '2026-07-04 03:29:29'),
(41, 78, 7, '2026-07-04 03:29:29', '2026-07-04 03:29:29'),
(42, 85, 7, '2026-07-04 03:29:29', '2026-07-04 03:29:29'),
(43, 86, 7, '2026-07-04 03:29:29', '2026-07-04 03:29:29'),
(44, 131, 7, '2026-07-04 03:29:29', '2026-07-04 03:29:29'),
(45, 133, 7, '2026-07-04 03:29:29', '2026-07-04 03:29:29'),
(46, 16, 8, '2026-07-04 03:30:30', '2026-07-04 03:30:30'),
(47, 19, 8, '2026-07-04 03:30:30', '2026-07-04 03:30:30'),
(48, 23, 8, '2026-07-04 03:30:30', '2026-07-04 03:30:30'),
(49, 41, 8, '2026-07-04 03:30:30', '2026-07-04 03:30:30'),
(50, 44, 8, '2026-07-04 03:30:30', '2026-07-04 03:30:30'),
(51, 76, 8, '2026-07-04 03:30:30', '2026-07-04 03:30:30'),
(52, 89, 8, '2026-07-04 03:30:30', '2026-07-04 03:30:30'),
(53, 92, 8, '2026-07-04 03:30:30', '2026-07-04 03:30:30'),
(54, 95, 8, '2026-07-04 03:30:30', '2026-07-04 03:30:30'),
(55, 109, 8, '2026-07-04 03:30:30', '2026-07-04 03:30:30'),
(56, 17, 9, '2026-07-04 03:31:51', '2026-07-04 03:31:51'),
(57, 32, 9, '2026-07-04 03:31:51', '2026-07-04 03:31:51'),
(58, 64, 9, '2026-07-04 03:31:51', '2026-07-04 03:31:51'),
(59, 66, 9, '2026-07-04 03:31:51', '2026-07-04 03:31:51'),
(60, 74, 9, '2026-07-04 03:31:51', '2026-07-04 03:31:51'),
(61, 81, 9, '2026-07-04 03:31:51', '2026-07-04 03:31:51'),
(62, 83, 9, '2026-07-04 03:31:51', '2026-07-04 03:31:51'),
(63, 88, 9, '2026-07-04 03:31:51', '2026-07-04 03:31:51'),
(64, 146, 9, '2026-07-04 03:31:51', '2026-07-04 03:31:51'),
(66, 151, 9, '2026-07-04 03:31:51', '2026-07-04 03:31:51'),
(67, 22, 10, '2026-07-04 03:33:50', '2026-07-04 03:33:50'),
(68, 43, 10, '2026-07-04 03:33:50', '2026-07-04 03:33:50'),
(69, 47, 10, '2026-07-04 03:33:50', '2026-07-04 03:33:50'),
(70, 57, 10, '2026-07-04 03:33:50', '2026-07-04 03:33:50'),
(71, 65, 10, '2026-07-04 03:33:50', '2026-07-04 03:33:50'),
(72, 116, 10, '2026-07-04 03:33:50', '2026-07-04 03:33:50'),
(73, 123, 10, '2026-07-04 03:33:50', '2026-07-04 03:33:50'),
(74, 127, 10, '2026-07-04 03:33:50', '2026-07-04 03:33:50'),
(75, 149, 10, '2026-07-04 03:33:50', '2026-07-04 03:33:50'),
(76, 150, 10, '2026-07-04 03:33:50', '2026-07-04 03:33:50'),
(77, 12, 11, '2026-07-04 03:34:46', '2026-07-04 03:34:46'),
(78, 26, 11, '2026-07-04 03:34:46', '2026-07-04 03:34:46'),
(79, 34, 11, '2026-07-04 03:34:46', '2026-07-04 03:34:46'),
(80, 45, 11, '2026-07-04 03:34:46', '2026-07-04 03:34:46'),
(81, 62, 11, '2026-07-04 03:34:46', '2026-07-04 03:34:46'),
(82, 77, 11, '2026-07-04 03:34:46', '2026-07-04 03:34:46'),
(83, 102, 11, '2026-07-04 03:34:46', '2026-07-04 03:34:46'),
(84, 134, 11, '2026-07-04 03:34:46', '2026-07-04 03:34:46'),
(85, 135, 11, '2026-07-04 03:34:46', '2026-07-04 03:34:46'),
(86, 147, 11, '2026-07-04 03:34:46', '2026-07-04 03:34:46'),
(87, 33, 12, '2026-07-04 03:35:43', '2026-07-04 03:35:43'),
(88, 55, 12, '2026-07-04 03:35:43', '2026-07-04 03:35:43'),
(89, 63, 12, '2026-07-04 03:35:43', '2026-07-04 03:35:43'),
(90, 69, 12, '2026-07-04 03:35:43', '2026-07-04 03:35:43'),
(91, 72, 12, '2026-07-04 03:35:43', '2026-07-04 03:35:43'),
(92, 93, 12, '2026-07-04 03:35:43', '2026-07-04 03:35:43'),
(93, 94, 12, '2026-07-04 03:35:43', '2026-07-04 03:35:43'),
(94, 110, 12, '2026-07-04 03:35:43', '2026-07-04 03:35:43'),
(95, 112, 12, '2026-07-04 03:35:43', '2026-07-04 03:35:43'),
(96, 117, 12, '2026-07-04 03:35:43', '2026-07-04 03:35:43'),
(97, 18, 13, '2026-07-04 03:36:45', '2026-07-04 03:36:45'),
(98, 40, 13, '2026-07-04 03:36:45', '2026-07-04 03:36:45'),
(99, 48, 13, '2026-07-04 03:36:45', '2026-07-04 03:36:45'),
(100, 61, 13, '2026-07-04 03:36:45', '2026-07-04 03:36:45'),
(101, 99, 13, '2026-07-04 03:36:45', '2026-07-04 03:36:45'),
(102, 108, 13, '2026-07-04 03:36:45', '2026-07-04 03:36:45'),
(103, 113, 13, '2026-07-04 03:36:45', '2026-07-04 03:36:45'),
(104, 128, 13, '2026-07-04 03:36:45', '2026-07-04 03:36:45'),
(105, 140, 13, '2026-07-04 03:36:45', '2026-07-04 03:36:45'),
(106, 144, 13, '2026-07-04 03:36:45', '2026-07-04 03:36:45'),
(107, 39, 14, '2026-07-04 03:37:49', '2026-07-04 03:37:49'),
(108, 53, 14, '2026-07-04 03:37:49', '2026-07-04 03:37:49'),
(109, 96, 14, '2026-07-04 03:37:49', '2026-07-04 03:37:49'),
(110, 98, 14, '2026-07-04 03:37:49', '2026-07-04 03:37:49'),
(111, 115, 14, '2026-07-04 03:37:49', '2026-07-04 03:37:49'),
(112, 118, 14, '2026-07-04 03:37:49', '2026-07-04 03:37:49'),
(113, 139, 14, '2026-07-04 03:37:49', '2026-07-04 03:37:49'),
(114, 141, 14, '2026-07-04 03:37:49', '2026-07-04 03:37:49'),
(115, 143, 14, '2026-07-04 03:37:49', '2026-07-04 03:37:49'),
(116, 148, 14, '2026-07-04 03:37:49', '2026-07-04 03:37:49'),
(117, 25, 15, '2026-07-04 03:38:40', '2026-07-04 03:38:40'),
(118, 27, 15, '2026-07-04 03:38:40', '2026-07-04 03:38:40'),
(119, 49, 15, '2026-07-04 03:38:40', '2026-07-04 03:38:40'),
(120, 58, 15, '2026-07-04 03:38:40', '2026-07-04 03:38:40'),
(121, 84, 15, '2026-07-04 03:38:40', '2026-07-04 03:38:40'),
(122, 97, 15, '2026-07-04 03:38:40', '2026-07-04 03:38:40'),
(123, 111, 15, '2026-07-04 03:38:40', '2026-07-04 03:38:40'),
(124, 122, 15, '2026-07-04 03:38:40', '2026-07-04 03:38:40'),
(125, 129, 15, '2026-07-04 03:38:41', '2026-07-04 03:38:41'),
(126, 136, 15, '2026-07-04 03:38:41', '2026-07-04 03:38:41'),
(127, 14, 16, '2026-07-04 03:39:44', '2026-07-04 03:39:44'),
(128, 15, 16, '2026-07-04 03:39:44', '2026-07-04 03:39:44'),
(129, 20, 16, '2026-07-04 03:39:44', '2026-07-04 03:39:44'),
(130, 75, 16, '2026-07-04 03:39:44', '2026-07-04 03:39:44'),
(131, 79, 16, '2026-07-04 03:39:44', '2026-07-04 03:39:44'),
(132, 90, 16, '2026-07-04 03:39:44', '2026-07-04 03:39:44'),
(133, 100, 16, '2026-07-04 03:39:44', '2026-07-04 03:39:44'),
(134, 104, 16, '2026-07-04 03:39:44', '2026-07-04 03:39:44'),
(135, 107, 16, '2026-07-04 03:39:44', '2026-07-04 03:39:44'),
(136, 121, 16, '2026-07-04 03:39:44', '2026-07-04 03:39:44'),
(137, 24, 17, '2026-07-04 03:39:58', '2026-07-04 03:39:58'),
(138, 35, 17, '2026-07-04 03:39:58', '2026-07-04 03:39:58'),
(139, 60, 17, '2026-07-04 03:39:58', '2026-07-04 03:39:58'),
(140, 73, 17, '2026-07-04 03:39:58', '2026-07-04 03:39:58'),
(141, 101, 17, '2026-07-04 03:39:58', '2026-07-04 03:39:58'),
(142, 105, 17, '2026-07-04 03:39:58', '2026-07-04 03:39:58'),
(143, 119, 17, '2026-07-04 03:39:58', '2026-07-04 03:39:58'),
(144, 124, 17, '2026-07-04 03:39:58', '2026-07-04 03:39:58'),
(145, 125, 17, '2026-07-04 03:39:58', '2026-07-04 03:39:58'),
(146, 145, 17, '2026-07-04 03:39:58', '2026-07-04 03:39:58');

-- --------------------------------------------------------

--
-- Struktur dari tabel `subchapters`
--

CREATE TABLE `subchapters` (
  `id` int(11) NOT NULL,
  `chapter_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `order` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `subchapters`
--

INSERT INTO `subchapters` (`id`, `chapter_id`, `name`, `description`, `order`, `created_at`, `updated_at`) VALUES
(2, 8, 'Cabang Iman', NULL, NULL, '2026-07-08 21:31:55', '2026-07-08 21:31:55'),
(3, 8, 'Ikhlas, Malu, dan Zuhud', NULL, NULL, '2026-07-08 21:32:03', '2026-07-08 21:32:03'),
(4, 9, 'Pembukaan', NULL, 1, '2026-07-08 21:32:41', '2026-07-08 21:46:55'),
(5, 9, 'Kiat-Kiat Menerapkan Adab', NULL, 2, '2026-07-08 21:32:50', '2026-07-08 21:46:55'),
(6, 10, 'Hal-Hal Terkait Pernikahan', NULL, NULL, '2026-07-08 21:33:09', '2026-07-08 21:33:09'),
(7, 10, 'Ketentuan Pernikahan', NULL, NULL, '2026-07-08 21:33:17', '2026-07-08 21:33:17'),
(8, 10, 'Pernikahan dalam Hukum Negara', NULL, NULL, '2026-07-08 21:33:28', '2026-07-08 21:33:28'),
(9, 11, 'Kondisi Islam Masa Modern', NULL, NULL, '2026-07-08 21:33:54', '2026-07-08 21:33:54'),
(10, 11, 'Tokoh-Tokoh Islam pada Masa Modern', NULL, NULL, '2026-07-08 21:34:10', '2026-07-08 21:34:10'),
(11, 11, 'Pengaruh Islam Masa Modern bagi Indonesia', NULL, NULL, '2026-07-08 21:34:20', '2026-07-08 21:34:20'),
(12, 8, 'sub bab 3', NULL, NULL, '2026-07-21 23:10:38', '2026-07-21 23:10:38');

-- --------------------------------------------------------

--
-- Struktur dari tabel `subjects`
--

CREATE TABLE `subjects` (
  `id` int(11) NOT NULL,
  `subject_name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `subjects`
--

INSERT INTO `subjects` (`id`, `subject_name`, `description`, `created_at`, `updated_at`) VALUES
(4, 'Pendidikan Agama Islam', NULL, '2026-07-03 21:38:55', '2026-07-03 21:38:55'),
(5, 'Matematika', NULL, '2026-07-03 21:39:03', '2026-07-03 21:39:03'),
(6, 'Fisika', NULL, '2026-07-03 21:39:07', '2026-07-03 21:39:07'),
(7, 'Sejarah', NULL, '2026-07-03 21:39:12', '2026-07-03 21:39:12');

-- --------------------------------------------------------

--
-- Struktur dari tabel `subject_teachers`
--

CREATE TABLE `subject_teachers` (
  `id` int(11) NOT NULL,
  `teacher_id` int(11) DEFAULT NULL,
  `subject_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `subject_teachers`
--

INSERT INTO `subject_teachers` (`id`, `teacher_id`, `subject_id`, `created_at`, `updated_at`) VALUES
(8, 2, 4, '2026-07-04 03:40:15', '2026-07-04 03:40:15'),
(9, 4, 4, '2026-07-08 22:45:13', '2026-07-08 22:45:13'),
(10, 5, 5, '2026-07-10 19:22:56', '2026-07-10 19:22:56'),
(11, 6, 5, '2026-07-10 19:22:56', '2026-07-10 19:22:56'),
(12, 9, 4, '2026-07-21 23:06:00', '2026-07-21 23:06:00');

-- --------------------------------------------------------

--
-- Struktur dari tabel `taggables`
--

CREATE TABLE `taggables` (
  `id` int(11) NOT NULL,
  `tag_id` int(11) DEFAULT NULL,
  `taggable_id` int(11) DEFAULT NULL,
  `taggable_type` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `taggables`
--

INSERT INTO `taggables` (`id`, `tag_id`, `taggable_id`, `taggable_type`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'App\\Models\\Question', '2026-07-06 00:44:56', '2026-07-06 00:44:56'),
(2, 2, 1, 'App\\Models\\Question', '2026-07-06 00:44:56', '2026-07-06 00:44:56');

-- --------------------------------------------------------

--
-- Struktur dari tabel `tags`
--

CREATE TABLE `tags` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `tags`
--

INSERT INTO `tags` (`id`, `name`, `slug`, `created_at`, `updated_at`) VALUES
(1, 'qur\'an', 'quran', '2026-07-06 00:44:55', '2026-07-06 00:44:55'),
(2, 'hadis', 'hadis', '2026-07-06 00:44:55', '2026-07-06 00:44:55');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `picture` varchar(255) DEFAULT NULL,
  `role` enum('admin','teacher','student') NOT NULL,
  `gender` tinyint(1) DEFAULT NULL COMMENT '0 = female, 1 = male',
  `remember_token` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `active_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `full_name`, `username`, `email`, `password`, `picture`, `role`, `gender`, `remember_token`, `is_active`, `active_at`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 'Admin App', 'admin', 'admin@upi.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'admin', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-07-04 04:30:23'),
(2, 'Hadiana Nasrullah', 'hadi', 'hadi@teacher.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'teacher', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(3, 'Ahmad Budi', 'ahmad', 'ahmad@teacher.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'teacher', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(4, 'Salsa Nur', 'salsa', 'salsa@teacher.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'teacher', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(5, 'Rudi Susilo', 'rudi', 'rudi@teacher.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'teacher', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(6, 'Erina Salma', 'erina', 'erina@teacher.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'teacher', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(7, 'Bagus Putra', 'bagus', 'bagus@teacher.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'teacher', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(8, 'Adam Rifai', 'adam', 'adam@teacher.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'teacher', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-07-03 21:38:07'),
(9, 'Nisa Yuli', 'nisa', 'nisa@teacher.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'teacher', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(10, 'Shanks', 'shanks', 'shanks@teacher.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'teacher', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(11, 'Marshall Teach', 'marshall', 'marshall@teacher.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'teacher', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(12, 'Aan Rian', 'aan', 'aan@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(13, 'Abdul Rohman', 'abdul', 'abdul@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(14, 'Abu Salman', 'abu', 'abu@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(15, 'Asep Andri', 'asep', 'asep@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(16, 'Aisyah Yuliana', 'aisyah', 'aisyah@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(17, 'Achmad Indrawan', 'achmad', 'achmad@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(18, 'Aji Fauzi', 'aji', 'aji@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(19, 'Amir Setiadi', 'amir', 'amir@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(20, 'Andi Nurcahya', 'andi', 'andi@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(21, 'Anisa Nur', 'anisa', 'anisa@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(22, 'Anita Rosma', 'anita', 'anita@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(23, 'Ari Rehan', 'ari', 'ari@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(24, 'Asih Haryadi', 'asih', 'asih@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(25, 'Astuti Wardani', 'astuti', 'astuti@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(26, 'Atik Rohaeni', 'atik', 'atik@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(27, 'Bayu Huda', 'bayu', 'bayu@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(28, 'Beni Hartono', 'beni', 'beni@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(29, 'Cucu Pratiwi', 'cucu', 'cucu@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(30, 'Dadan Rambe', 'dadan', 'dadan@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(31, 'Daniel Salamah', 'daniel', 'daniel@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(32, 'David Agustin', 'david', 'david@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(33, 'Dedi Kurnia', 'dedi', 'dedi@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(34, 'Dewi Riadi', 'dewi', 'dewi@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(35, 'Dian Amin', 'dian', 'dian@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(36, 'Diana Rohaeti', 'diana', 'diana@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(37, 'Didi Hutapea', 'didi', 'didi@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(38, 'Dini Cahyadi', 'dini', 'dini@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(39, 'Doni Riadi', 'doni', 'doni@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(40, 'Dra Candrawati', 'dra', 'dra@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(41, 'Dyah Nugraha', 'dyah', 'dyah@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(42, 'Eddy Deva', 'eddy', 'eddy@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(43, 'Ehsan Suryadi', 'ehsan', 'ehsan@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(44, 'Ema Setyowati', 'ema', 'ema@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(45, 'Eman Sulaeman', 'eman', 'eman@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(46, 'Eny Yunita', 'eny', 'eny@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(47, 'Feri Suryana', 'feri', 'feri@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(48, 'Firman Pratiwi', 'firman', 'firman@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(49, 'Gunawan Yasa', 'gunawan', 'gunawan@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(50, 'Haji Halawa', 'haji', 'haji@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(51, 'Halimah Suwandi', 'halimah', 'halimah@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(52, 'Hari Khotimah', 'hari', 'hari@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(53, 'Hartati Trisnawati', 'hartati', 'hartati@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(54, 'Hartini Kartika', 'hartini', 'hartini@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(55, 'Hartono Sugiarto', 'hartono', 'hartono@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(56, 'Haryanto Rokayah', 'haryanto', 'haryanto@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(57, 'Hendro Purnama', 'hendro', 'hendro@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(58, 'Henny Andriani', 'henny', 'henny@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(59, 'Herman Nugraha', 'herman', 'herman@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(60, 'Hilman Putra', 'hilman', 'hilman@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(61, 'Ida Purnama', 'ida', 'ida@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(62, 'Iman Afandi', 'iman', 'iman@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(63, 'Ina Huda', 'ina', 'ina@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(64, 'Irma Farida', 'irma', 'irma@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(65, 'Juli Amalia', 'juli', 'juli@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(66, 'Junaedi Fitriani', 'junaedi', 'junaedi@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(67, 'Khansa Hidayati', 'khansa', 'khansa@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(68, 'Komarudin Sulaeman', 'komarudin', 'komarudin@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(69, 'Kristina Santoso', 'kristina', 'kristina@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(70, 'Leni Faisal', 'leni', 'leni@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(71, 'Lestari Suhendar', 'lestari', 'lestari@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(72, 'Lukman Bakti', 'lukman', 'lukman@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(73, 'Made Putra', 'made', 'made@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(74, 'Mahmud Ginting', 'mahmud', 'mahmud@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(75, 'Maria Wahid', 'maria', 'maria@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(76, 'Mas Tabuni', 'mas', 'mas@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(77, 'Masinah Hariyanti', 'masinah', 'masinah@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(78, 'Maya Solihah', 'maya', 'maya@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(79, 'Moch Kusuma', 'moch', 'moch@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(80, 'Muji Manurung', 'muji', 'muji@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(81, 'Mujiati Munandar', 'mujiati', 'mujiati@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(82, 'Mujiono Dani', 'mujiono', 'mujiono@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(83, 'Mulyani Kadir', 'mulyani', 'mulyani@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(84, 'Mulyati Herawati', 'mulyati', 'mulyati@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(85, 'Nani Halimah', 'nani', 'nani@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(86, 'Neni Yuningsih', 'neni', 'neni@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(87, 'Nengah Rifai', 'nengah', 'nengah@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(88, 'Nining Yunita', 'nining', 'nining@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(89, 'Nor Sholeh', 'nor', 'nor@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(90, 'Nova Hutapea', 'nova', 'nova@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(91, 'Nur Khodijah', 'nur', 'nur@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(92, 'Nuraini Hidayah', 'nuraini', 'nuraini@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(93, 'Nurlela Sundari', 'nurlela', 'nurlela@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(94, 'Nyai Syahputra', 'nyai', 'nyai@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(95, 'Nyoman Rahim', 'nyoman', 'nyoman@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(96, 'Omah Ibrahim', 'omah', 'omah@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(97, 'Patimah Simamora', 'patimah', 'patimah@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(98, 'Petrus Aritonang', 'petrus', 'petrus@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(99, 'Rahma Purnamasari', 'rahma', 'rahma@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(100, 'Ramlah Septiani', 'ramlah', 'ramlah@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(101, 'Ramli Yanto', 'ramli', 'ramli@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(102, 'Rani Aisah', 'rani', 'rani@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(103, 'Ratih Julaeha', 'ratih', 'ratih@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(104, 'Ria Kusnadi', 'ria', 'ria@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(105, 'Ririn Fitri', 'ririn', 'ririn@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(106, 'Riski Usman', 'riski', 'riski@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(107, 'Rita Yunus', 'rita', 'rita@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(108, 'Rizky Usman', 'rizky', 'rizky@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(109, 'Rusli Andriani', 'rusli', 'rusli@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(110, 'Saleh Mulyati', 'saleh', 'saleh@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(111, 'Salman Galih', 'salman', 'salman@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(112, 'Sami Mariana', 'sami', 'sami@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(113, 'Sarmi Septiani', 'sarmi', 'sarmi@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(114, 'Sarni Hutagalung', 'sarni', 'sarni@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(115, 'Siti Novianti', 'siti', 'siti@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(116, 'Sri Marbun', 'sri', 'sri@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(117, 'Sugianto Hasan', 'sugianto', 'sugianto@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(118, 'Sugiono Ulfa', 'sugiono', 'sugiono@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(119, 'Suharti Iskandar', 'suharti', 'suharti@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(120, 'Sukardi Kadir', 'sukardi', 'sukardi@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(121, 'Sumardi Saadah', 'sumardi', 'sumardi@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(122, 'Sumarno Firmansyah', 'sumarno', 'sumarno@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(123, 'Sumini Aulia', 'sumini', 'sumini@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(124, 'Sunaryo Aryani', 'sunaryo', 'sunaryo@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(125, 'Supardi Purnama', 'supardi', 'supardi@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(126, 'Suprapto Susanto', 'suprapto', 'suprapto@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(127, 'Supriyadi Darma', 'supriyadi', 'supriyadi@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(128, 'Supriyati Rachmawati', 'supriyati', 'supriyati@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(129, 'Sulaiman Riski', 'sulaiman', 'sulaiman@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(130, 'Surati Jubaedah', 'surati', 'surati@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(131, 'Suratman Komar', 'suratman', 'suratman@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(132, 'Surya Permana', 'surya', 'surya@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(133, 'Suryati Rahmah', 'suryati', 'suryati@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(134, 'Sutini Winarti', 'sutini', 'sutini@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(135, 'Sutrisno Nurjaman', 'sutrisno', 'sutrisno@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(136, 'Suwandi Dewi', 'suwandi', 'suwandi@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(137, 'Suwarti Effendi', 'suwarti', 'suwarti@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(138, 'Tati Hasanah', 'tati', 'tati@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(139, 'Uswatun Hasanah', 'uswatun', 'uswatun@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(140, 'Wahyudi Wahyudi', 'wahyudi', 'wahyudi@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(141, 'Wahyudin Indrawati', 'wahyudin', 'wahyudin@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(142, 'Wahyuni Kurniawati', 'wahyuni', 'wahyuni@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(143, 'Warni Budiono', 'warni', 'warni@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(144, 'Widodo Permana', 'widodo', 'widodo@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(145, 'Winarsih Manalu', 'winarsih', 'winarsih@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(146, 'Yati Nababan', 'yati', 'yati@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(147, 'Yogi Ahmad', 'yogi', 'yogi@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(148, 'Yudi Rizki', 'yudi', 'yudi@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(149, 'Yuli Minang', 'yuli', 'yuli@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 0, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(150, 'Yusuf Cahya', 'yusuf', 'yusuf@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41'),
(151, 'Zauhar Jundi', 'zauhar', 'zauhar@student.edu', '$2y$12$I9gAlt4I1Pl7YEvjCUstMOczYjP.WKts22e.B1.DuFWnDbxPWerqS', NULL, 'student', 1, NULL, 1, '2026-06-24 05:51:41', NULL, '2026-06-24 05:51:41', '2026-06-24 05:51:41');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_activity_logs_actor` (`actor_id`);

--
-- Indeks untuk tabel `assessments`
--
ALTER TABLE `assessments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `subject_id` (`subject_id`);

--
-- Indeks untuk tabel `assessment_answers`
--
ALTER TABLE `assessment_answers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `attempt_id` (`attempt_id`),
  ADD KEY `question_id` (`question_id`),
  ADD KEY `fk_assessment_answers_selected_option` (`selected_option_id`);

--
-- Indeks untuk tabel `assessment_attempts`
--
ALTER TABLE `assessment_attempts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `class_assessment_id` (`class_assessment_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `grade_by` (`grade_by`);

--
-- Indeks untuk tabel `assessment_questions`
--
ALTER TABLE `assessment_questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `assessment_id` (`assessment_id`),
  ADD KEY `question_id` (`question_id`);

--
-- Indeks untuk tabel `assignments`
--
ALTER TABLE `assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `subject_id` (`subject_id`);

--
-- Indeks untuk tabel `assignment_submissions`
--
ALTER TABLE `assignment_submissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `assignment_submissions_index` (`student_id`,`class_assignment_id`),
  ADD KEY `class_assignment_id` (`class_assignment_id`),
  ADD KEY `grade_by` (`grade_by`);

--
-- Indeks untuk tabel `attachments`
--
ALTER TABLE `attachments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `material_id` (`material_id`);

--
-- Indeks untuk tabel `bookmarks`
--
ALTER TABLE `bookmarks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `student_bookmark_unique` (`student_id`,`bookmarkable_id`,`bookmarkable_type`),
  ADD KEY `bookmarks_student_index` (`student_id`),
  ADD KEY `bookmarks_bookmarkable_index` (`bookmarkable_type`,`bookmarkable_id`);

--
-- Indeks untuk tabel `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indeks untuk tabel `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indeks untuk tabel `chapters`
--
ALTER TABLE `chapters`
  ADD PRIMARY KEY (`id`),
  ADD KEY `subject_id` (`subject_id`),
  ADD KEY `teacher_id` (`teacher_id`);

--
-- Indeks untuk tabel `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `subject_id` (`subject_id`),
  ADD KEY `teacher_id` (`teacher_id`),
  ADD KEY `classes_school_year_id_foreign` (`school_year_id`);

--
-- Indeks untuk tabel `class_assessments`
--
ALTER TABLE `class_assessments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `class_id` (`class_id`),
  ADD KEY `chapter_id` (`chapter_id`),
  ADD KEY `material_id` (`material_id`);

--
-- Indeks untuk tabel `class_assessment_questions`
--
ALTER TABLE `class_assessment_questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `class_assessment_id` (`class_assessment_id`),
  ADD KEY `class_question_id` (`class_question_id`);

--
-- Indeks untuk tabel `class_assignments`
--
ALTER TABLE `class_assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `class_id` (`class_id`),
  ADD KEY `chapter_id` (`chapter_id`),
  ADD KEY `material_id` (`material_id`);

--
-- Indeks untuk tabel `class_assignment_attachments`
--
ALTER TABLE `class_assignment_attachments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `class_assignment_attachments_class_assignment_id_foreign` (`class_assignment_id`);

--
-- Indeks untuk tabel `class_group_years`
--
ALTER TABLE `class_group_years`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `class_group_years_class_id_group_year_id_unique` (`class_id`,`group_year_id`),
  ADD KEY `class_group_years_group_year_id_foreign` (`group_year_id`);

--
-- Indeks untuk tabel `class_options`
--
ALTER TABLE `class_options`
  ADD PRIMARY KEY (`id`),
  ADD KEY `class_question_id` (`class_question_id`);

--
-- Indeks untuk tabel `class_questions`
--
ALTER TABLE `class_questions`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `class_rubrics`
--
ALTER TABLE `class_rubrics`
  ADD PRIMARY KEY (`id`),
  ADD KEY `class_assignment_id` (`class_assignment_id`);

--
-- Indeks untuk tabel `class_rubric_criteria`
--
ALTER TABLE `class_rubric_criteria`
  ADD PRIMARY KEY (`id`),
  ADD KEY `class_rubric_id` (`class_rubric_id`);

--
-- Indeks untuk tabel `class_rubric_levels`
--
ALTER TABLE `class_rubric_levels`
  ADD PRIMARY KEY (`id`),
  ADD KEY `class_criterion_id` (`class_criterion_id`);

--
-- Indeks untuk tabel `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
  ADD KEY `failed_jobs_connection_queue_failed_at_index` (`connection`,`queue`,`failed_at`);

--
-- Indeks untuk tabel `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `group_years`
--
ALTER TABLE `group_years`
  ADD PRIMARY KEY (`id`),
  ADD KEY `group_id` (`group_id`),
  ADD KEY `year_id` (`year_id`);

--
-- Indeks untuk tabel `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indeks untuk tabel `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `materials`
--
ALTER TABLE `materials`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chapter_id` (`chapter_id`),
  ADD KEY `subchapter_id` (`subchapter_id`);

--
-- Indeks untuk tabel `material_access_logs`
--
ALTER TABLE `material_access_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `material_id` (`material_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indeks untuk tabel `material_completion`
--
ALTER TABLE `material_completion`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `material_completion_index` (`student_id`,`material_id`),
  ADD KEY `material_id` (`material_id`);

--
-- Indeks untuk tabel `material_reviews`
--
ALTER TABLE `material_reviews`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `material_reviews_index` (`student_id`,`material_id`),
  ADD KEY `material_id` (`material_id`);

--
-- Indeks untuk tabel `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `options`
--
ALTER TABLE `options`
  ADD PRIMARY KEY (`id`),
  ADD KEY `question_id` (`question_id`);

--
-- Indeks untuk tabel `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indeks untuk tabel `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indeks untuk tabel `planables`
--
ALTER TABLE `planables`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `plans`
--
ALTER TABLE `plans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `class_id` (`class_id`),
  ADD KEY `chapter_id` (`chapter_id`);

--
-- Indeks untuk tabel `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `subject_id` (`subject_id`);

--
-- Indeks untuk tabel `reflectables`
--
ALTER TABLE `reflectables`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reflectables_reflectable_type_reflectable_id_index` (`reflectable_type`,`reflectable_id`),
  ADD KEY `reflectables_reflection_id_foreign` (`reflection_id`);

--
-- Indeks untuk tabel `reflections`
--
ALTER TABLE `reflections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indeks untuk tabel `rubrics`
--
ALTER TABLE `rubrics`
  ADD PRIMARY KEY (`id`),
  ADD KEY `assignment_id` (`assignment_id`);

--
-- Indeks untuk tabel `rubric_criteria`
--
ALTER TABLE `rubric_criteria`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rubric_id` (`rubric_id`);

--
-- Indeks untuk tabel `rubric_levels`
--
ALTER TABLE `rubric_levels`
  ADD PRIMARY KEY (`id`),
  ADD KEY `criterion_id` (`criterion_id`);

--
-- Indeks untuk tabel `rubric_points`
--
ALTER TABLE `rubric_points`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `rubric_points_index` (`student_id`,`class_criterion_id`),
  ADD KEY `class_criterion_id` (`class_criterion_id`),
  ADD KEY `class_rubric_level_id` (`class_rubric_level_id`);

--
-- Indeks untuk tabel `school_years`
--
ALTER TABLE `school_years`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `only_one_active` (`active_validator`);

--
-- Indeks untuk tabel `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indeks untuk tabel `student_groups`
--
ALTER TABLE `student_groups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `student_groups_index` (`student_id`,`group_year_id`),
  ADD KEY `group_year_id` (`group_year_id`);

--
-- Indeks untuk tabel `subchapters`
--
ALTER TABLE `subchapters`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chapter_id` (`chapter_id`);

--
-- Indeks untuk tabel `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `subject_teachers`
--
ALTER TABLE `subject_teachers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `subject_teachers_index` (`subject_id`,`teacher_id`),
  ADD KEY `teacher_id` (`teacher_id`);

--
-- Indeks untuk tabel `taggables`
--
ALTER TABLE `taggables`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `taggables_unique` (`tag_id`,`taggable_id`,`taggable_type`),
  ADD KEY `taggables_taggable_type_taggable_id_index` (`taggable_type`,`taggable_id`);

--
-- Indeks untuk tabel `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `users_is_active_index` (`is_active`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

--
-- AUTO_INCREMENT untuk tabel `assessments`
--
ALTER TABLE `assessments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `assessment_answers`
--
ALTER TABLE `assessment_answers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `assessment_attempts`
--
ALTER TABLE `assessment_attempts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `assessment_questions`
--
ALTER TABLE `assessment_questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `assignments`
--
ALTER TABLE `assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `assignment_submissions`
--
ALTER TABLE `assignment_submissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `attachments`
--
ALTER TABLE `attachments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT untuk tabel `bookmarks`
--
ALTER TABLE `bookmarks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `chapters`
--
ALTER TABLE `chapters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT untuk tabel `classes`
--
ALTER TABLE `classes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT untuk tabel `class_assessments`
--
ALTER TABLE `class_assessments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `class_assessment_questions`
--
ALTER TABLE `class_assessment_questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `class_assignments`
--
ALTER TABLE `class_assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT untuk tabel `class_assignment_attachments`
--
ALTER TABLE `class_assignment_attachments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `class_group_years`
--
ALTER TABLE `class_group_years`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT untuk tabel `class_options`
--
ALTER TABLE `class_options`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `class_questions`
--
ALTER TABLE `class_questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `class_rubrics`
--
ALTER TABLE `class_rubrics`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT untuk tabel `class_rubric_criteria`
--
ALTER TABLE `class_rubric_criteria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT untuk tabel `class_rubric_levels`
--
ALTER TABLE `class_rubric_levels`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT untuk tabel `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `groups`
--
ALTER TABLE `groups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT untuk tabel `group_years`
--
ALTER TABLE `group_years`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT untuk tabel `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `materials`
--
ALTER TABLE `materials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT untuk tabel `material_access_logs`
--
ALTER TABLE `material_access_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=86;

--
-- AUTO_INCREMENT untuk tabel `material_completion`
--
ALTER TABLE `material_completion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `material_reviews`
--
ALTER TABLE `material_reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT untuk tabel `options`
--
ALTER TABLE `options`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `planables`
--
ALTER TABLE `planables`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `plans`
--
ALTER TABLE `plans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `reflectables`
--
ALTER TABLE `reflectables`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `reflections`
--
ALTER TABLE `reflections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `rubrics`
--
ALTER TABLE `rubrics`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `rubric_criteria`
--
ALTER TABLE `rubric_criteria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `rubric_levels`
--
ALTER TABLE `rubric_levels`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `rubric_points`
--
ALTER TABLE `rubric_points`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `school_years`
--
ALTER TABLE `school_years`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `student_groups`
--
ALTER TABLE `student_groups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=147;

--
-- AUTO_INCREMENT untuk tabel `subchapters`
--
ALTER TABLE `subchapters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT untuk tabel `subjects`
--
ALTER TABLE `subjects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT untuk tabel `subject_teachers`
--
ALTER TABLE `subject_teachers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT untuk tabel `taggables`
--
ALTER TABLE `taggables`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=152;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `fk_activity_logs_actor` FOREIGN KEY (`actor_id`) REFERENCES `users` (`id`);

--
-- Ketidakleluasaan untuk tabel `assessments`
--
ALTER TABLE `assessments`
  ADD CONSTRAINT `assessments_ibfk_1` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`);

--
-- Ketidakleluasaan untuk tabel `assessment_answers`
--
ALTER TABLE `assessment_answers`
  ADD CONSTRAINT `assessment_answers_ibfk_1` FOREIGN KEY (`attempt_id`) REFERENCES `assessment_attempts` (`id`),
  ADD CONSTRAINT `assessment_answers_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `class_questions` (`id`),
  ADD CONSTRAINT `fk_assessment_answers_selected_option` FOREIGN KEY (`selected_option_id`) REFERENCES `class_options` (`id`);

--
-- Ketidakleluasaan untuk tabel `assessment_attempts`
--
ALTER TABLE `assessment_attempts`
  ADD CONSTRAINT `assessment_attempts_ibfk_1` FOREIGN KEY (`class_assessment_id`) REFERENCES `class_assessments` (`id`),
  ADD CONSTRAINT `assessment_attempts_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `assessment_attempts_ibfk_3` FOREIGN KEY (`grade_by`) REFERENCES `users` (`id`);

--
-- Ketidakleluasaan untuk tabel `assessment_questions`
--
ALTER TABLE `assessment_questions`
  ADD CONSTRAINT `assessment_questions_ibfk_1` FOREIGN KEY (`assessment_id`) REFERENCES `assessments` (`id`),
  ADD CONSTRAINT `assessment_questions_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`);

--
-- Ketidakleluasaan untuk tabel `assignments`
--
ALTER TABLE `assignments`
  ADD CONSTRAINT `assignments_ibfk_1` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`);

--
-- Ketidakleluasaan untuk tabel `assignment_submissions`
--
ALTER TABLE `assignment_submissions`
  ADD CONSTRAINT `assignment_submissions_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `assignment_submissions_ibfk_2` FOREIGN KEY (`class_assignment_id`) REFERENCES `class_assignments` (`id`),
  ADD CONSTRAINT `assignment_submissions_ibfk_3` FOREIGN KEY (`grade_by`) REFERENCES `users` (`id`);

--
-- Ketidakleluasaan untuk tabel `attachments`
--
ALTER TABLE `attachments`
  ADD CONSTRAINT `attachments_ibfk_1` FOREIGN KEY (`material_id`) REFERENCES `materials` (`id`);

--
-- Ketidakleluasaan untuk tabel `bookmarks`
--
ALTER TABLE `bookmarks`
  ADD CONSTRAINT `bookmarks_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `chapters`
--
ALTER TABLE `chapters`
  ADD CONSTRAINT `chapters_ibfk_1` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`),
  ADD CONSTRAINT `chapters_ibfk_2` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`);

--
-- Ketidakleluasaan untuk tabel `classes`
--
ALTER TABLE `classes`
  ADD CONSTRAINT `classes_ibfk_1` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`),
  ADD CONSTRAINT `classes_ibfk_2` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `classes_school_year_id_foreign` FOREIGN KEY (`school_year_id`) REFERENCES `school_years` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `class_assessments`
--
ALTER TABLE `class_assessments`
  ADD CONSTRAINT `class_assessments_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`),
  ADD CONSTRAINT `class_assessments_ibfk_2` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`id`),
  ADD CONSTRAINT `class_assessments_ibfk_3` FOREIGN KEY (`material_id`) REFERENCES `materials` (`id`);

--
-- Ketidakleluasaan untuk tabel `class_assessment_questions`
--
ALTER TABLE `class_assessment_questions`
  ADD CONSTRAINT `class_assessment_questions_ibfk_1` FOREIGN KEY (`class_assessment_id`) REFERENCES `class_assessments` (`id`),
  ADD CONSTRAINT `class_assessment_questions_ibfk_2` FOREIGN KEY (`class_question_id`) REFERENCES `class_questions` (`id`);

--
-- Ketidakleluasaan untuk tabel `class_assignments`
--
ALTER TABLE `class_assignments`
  ADD CONSTRAINT `class_assignments_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`),
  ADD CONSTRAINT `class_assignments_ibfk_2` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`id`),
  ADD CONSTRAINT `class_assignments_ibfk_3` FOREIGN KEY (`material_id`) REFERENCES `materials` (`id`);

--
-- Ketidakleluasaan untuk tabel `class_assignment_attachments`
--
ALTER TABLE `class_assignment_attachments`
  ADD CONSTRAINT `class_assignment_attachments_class_assignment_id_foreign` FOREIGN KEY (`class_assignment_id`) REFERENCES `class_assignments` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `class_group_years`
--
ALTER TABLE `class_group_years`
  ADD CONSTRAINT `class_group_years_class_id_foreign` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `class_group_years_group_year_id_foreign` FOREIGN KEY (`group_year_id`) REFERENCES `group_years` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `class_options`
--
ALTER TABLE `class_options`
  ADD CONSTRAINT `class_options_ibfk_1` FOREIGN KEY (`class_question_id`) REFERENCES `class_questions` (`id`);

--
-- Ketidakleluasaan untuk tabel `class_rubrics`
--
ALTER TABLE `class_rubrics`
  ADD CONSTRAINT `class_rubrics_ibfk_1` FOREIGN KEY (`class_assignment_id`) REFERENCES `class_assignments` (`id`);

--
-- Ketidakleluasaan untuk tabel `class_rubric_criteria`
--
ALTER TABLE `class_rubric_criteria`
  ADD CONSTRAINT `class_rubric_criteria_ibfk_1` FOREIGN KEY (`class_rubric_id`) REFERENCES `class_rubrics` (`id`);

--
-- Ketidakleluasaan untuk tabel `class_rubric_levels`
--
ALTER TABLE `class_rubric_levels`
  ADD CONSTRAINT `class_rubric_levels_ibfk_1` FOREIGN KEY (`class_criterion_id`) REFERENCES `class_rubric_criteria` (`id`);

--
-- Ketidakleluasaan untuk tabel `group_years`
--
ALTER TABLE `group_years`
  ADD CONSTRAINT `group_years_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`),
  ADD CONSTRAINT `group_years_ibfk_2` FOREIGN KEY (`year_id`) REFERENCES `school_years` (`id`);

--
-- Ketidakleluasaan untuk tabel `materials`
--
ALTER TABLE `materials`
  ADD CONSTRAINT `materials_ibfk_1` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`id`),
  ADD CONSTRAINT `materials_ibfk_2` FOREIGN KEY (`subchapter_id`) REFERENCES `subchapters` (`id`);

--
-- Ketidakleluasaan untuk tabel `material_access_logs`
--
ALTER TABLE `material_access_logs`
  ADD CONSTRAINT `material_access_logs_ibfk_1` FOREIGN KEY (`material_id`) REFERENCES `materials` (`id`),
  ADD CONSTRAINT `material_access_logs_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`);

--
-- Ketidakleluasaan untuk tabel `material_completion`
--
ALTER TABLE `material_completion`
  ADD CONSTRAINT `material_completion_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `material_completion_ibfk_2` FOREIGN KEY (`material_id`) REFERENCES `materials` (`id`);

--
-- Ketidakleluasaan untuk tabel `material_reviews`
--
ALTER TABLE `material_reviews`
  ADD CONSTRAINT `material_reviews_ibfk_1` FOREIGN KEY (`material_id`) REFERENCES `materials` (`id`),
  ADD CONSTRAINT `material_reviews_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`);

--
-- Ketidakleluasaan untuk tabel `options`
--
ALTER TABLE `options`
  ADD CONSTRAINT `options_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`);

--
-- Ketidakleluasaan untuk tabel `plans`
--
ALTER TABLE `plans`
  ADD CONSTRAINT `plans_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `plans_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`),
  ADD CONSTRAINT `plans_ibfk_3` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`id`);

--
-- Ketidakleluasaan untuk tabel `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`);

--
-- Ketidakleluasaan untuk tabel `reflectables`
--
ALTER TABLE `reflectables`
  ADD CONSTRAINT `reflectables_reflection_id_foreign` FOREIGN KEY (`reflection_id`) REFERENCES `reflections` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `reflections`
--
ALTER TABLE `reflections`
  ADD CONSTRAINT `reflections_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`);

--
-- Ketidakleluasaan untuk tabel `rubrics`
--
ALTER TABLE `rubrics`
  ADD CONSTRAINT `rubrics_ibfk_1` FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`id`);

--
-- Ketidakleluasaan untuk tabel `rubric_criteria`
--
ALTER TABLE `rubric_criteria`
  ADD CONSTRAINT `rubric_criteria_ibfk_1` FOREIGN KEY (`rubric_id`) REFERENCES `rubrics` (`id`);

--
-- Ketidakleluasaan untuk tabel `rubric_levels`
--
ALTER TABLE `rubric_levels`
  ADD CONSTRAINT `rubric_levels_ibfk_1` FOREIGN KEY (`criterion_id`) REFERENCES `rubric_criteria` (`id`);

--
-- Ketidakleluasaan untuk tabel `rubric_points`
--
ALTER TABLE `rubric_points`
  ADD CONSTRAINT `rubric_points_ibfk_1` FOREIGN KEY (`class_criterion_id`) REFERENCES `class_rubric_criteria` (`id`),
  ADD CONSTRAINT `rubric_points_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `rubric_points_ibfk_3` FOREIGN KEY (`class_rubric_level_id`) REFERENCES `class_rubric_levels` (`id`);

--
-- Ketidakleluasaan untuk tabel `student_groups`
--
ALTER TABLE `student_groups`
  ADD CONSTRAINT `student_groups_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `student_groups_ibfk_2` FOREIGN KEY (`group_year_id`) REFERENCES `group_years` (`id`);

--
-- Ketidakleluasaan untuk tabel `subchapters`
--
ALTER TABLE `subchapters`
  ADD CONSTRAINT `subchapters_ibfk_1` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`id`);

--
-- Ketidakleluasaan untuk tabel `subject_teachers`
--
ALTER TABLE `subject_teachers`
  ADD CONSTRAINT `subject_teachers_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `subject_teachers_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`);

--
-- Ketidakleluasaan untuk tabel `taggables`
--
ALTER TABLE `taggables`
  ADD CONSTRAINT `taggables_tag_id_foreign` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
