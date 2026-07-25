-- =====================================================
-- DIAJAR LMS — Dummy Data Seed Script
-- Generated: 2026-07-23
-- This script ONLY inserts new data. It does NOT delete
-- or modify any existing rows.
-- =====================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================
-- 1. UPDATE subject descriptions
-- =====================================================
UPDATE `subjects` SET `description` = 'Mata pelajaran yang mempelajari dasar-dasar keimanan, ibadah, akhlak, dan sejarah peradaban Islam.' WHERE `id` = 4;
UPDATE `subjects` SET `description` = 'Ilmu pasti yang mencakup aljabar, geometri, trigonometri, statistika, dan kalkulus.' WHERE `id` = 5;
UPDATE `subjects` SET `description` = 'Cabang ilmu pengetahuan alam yang mempelajari materi, energi, dan interaksi fundamental di alam semesta.' WHERE `id` = 6;
UPDATE `subjects` SET `description` = 'Ilmu yang mempelajari peristiwa masa lampau umat manusia, khususnya perjalanan bangsa Indonesia.' WHERE `id` = 7;

-- =====================================================
-- 2. SUBJECT_TEACHERS — link Fisika & Sejarah
-- =====================================================
INSERT INTO `subject_teachers` (`id`, `teacher_id`, `subject_id`, `created_at`, `updated_at`) VALUES
(13, 7, 6, '2026-07-23 02:00:00', '2026-07-23 02:00:00'),
(14, 10, 6, '2026-07-23 02:00:00', '2026-07-23 02:00:00'),
(15, 8, 7, '2026-07-23 02:00:00', '2026-07-23 02:00:00'),
(16, 11, 7, '2026-07-23 02:00:00', '2026-07-23 02:00:00');

-- =====================================================
-- 3. CHAPTERS
-- =====================================================
-- Matematika chapters (subject_id = 5)
INSERT INTO `chapters` (`id`, `subject_id`, `teacher_id`, `name`, `description`, `tags`, `order`, `target_grade`, `target_groups`, `created_at`, `updated_at`) VALUES
(13, 5, 5, 'Persamaan dan Pertidaksamaan Linear', 'Mempelajari cara menyelesaikan persamaan dan pertidaksamaan linear satu dan dua variabel', '[\"Aljabar\",\"Linear\"]', 1, 10, '[4,5]', '2026-07-23 02:00:00', '2026-07-23 02:00:00'),
(14, 5, 5, 'Fungsi dan Grafik', 'Memahami konsep fungsi, domain, kodomain, range, serta cara menggambar grafik fungsi', '[\"Fungsi\",\"Grafik\"]', 2, 10, '[6,7]', '2026-07-23 02:00:00', '2026-07-23 02:00:00'),
(15, 5, 6, 'Trigonometri', 'Perbandingan trigonometri, identitas trigonometri, dan penerapannya', '[\"Trigonometri\",\"Sudut\"]', 3, 11, '[9,10]', '2026-07-23 02:00:00', '2026-07-23 02:00:00'),
-- Fisika chapters (subject_id = 6)
(16, 6, 7, 'Gerak Lurus', 'Konsep gerak lurus beraturan (GLB) dan gerak lurus berubah beraturan (GLBB)', '[\"Mekanika\",\"Kinematika\"]', 1, 10, '[4,5]', '2026-07-23 02:00:00', '2026-07-23 02:00:00'),
(17, 6, 7, 'Hukum Newton', 'Hukum-hukum Newton tentang gerak dan penerapannya dalam kehidupan sehari-hari', '[\"Mekanika\",\"Dinamika\"]', 2, 10, '[6,7]', '2026-07-23 02:00:00', '2026-07-23 02:00:00'),
-- Sejarah chapters (subject_id = 7)
(18, 7, 8, 'Kerajaan Hindu-Buddha di Indonesia', 'Sejarah kerajaan-kerajaan Hindu-Buddha yang pernah berdiri di Nusantara', '[\"Hindu-Buddha\",\"Nusantara\"]', 1, 10, '[4,5]', '2026-07-23 02:00:00', '2026-07-23 02:00:00'),
(19, 7, 8, 'Pergerakan Nasional Indonesia', 'Organisasi-organisasi pergerakan nasional dan perjalanan menuju kemerdekaan', '[\"Pergerakan\",\"Nasional\"]', 2, 11, '[9,10]', '2026-07-23 02:00:00', '2026-07-23 02:00:00');

-- =====================================================
-- 4. SUBCHAPTERS
-- =====================================================
-- Subchapters for existing bare PAI chapters
INSERT INTO `subchapters` (`id`, `chapter_id`, `name`, `description`, `order`, `created_at`, `updated_at`) VALUES
-- Chapter 6 (Sejarah Abbasiyah)
(13, 6, 'Berdirinya Dinasti Abbasiyah', 'Latar belakang dan proses berdirinya Dinasti Abbasiyah', 1, '2026-07-23 02:00:00', '2026-07-23 02:00:00'),
(14, 6, 'Kejayaan Ilmu Pengetahuan', 'Perkembangan ilmu pengetahuan pada masa Abbasiyah', 2, '2026-07-23 02:00:00', '2026-07-23 02:00:00'),
-- Chapter 7 (Penciptaan Alam Semesta)
(15, 7, 'Dalil-Dalil Al-Quran tentang Penciptaan', 'Ayat-ayat Al-Quran yang membahas penciptaan alam semesta', 1, '2026-07-23 02:00:00', '2026-07-23 02:00:00'),
(16, 7, 'Hikmah Penciptaan Alam', 'Pelajaran dan hikmah dari penciptaan alam semesta', 2, '2026-07-23 02:00:00', '2026-07-23 02:00:00'),
-- Chapter 12 (bab baru)
(17, 12, 'Sub Bab Akidah', 'Pembahasan dasar-dasar akidah Islam', 1, '2026-07-23 02:00:00', '2026-07-23 02:00:00'),
-- Matematika subchapters
(18, 13, 'Persamaan Linear Satu Variabel', NULL, 1, '2026-07-23 02:00:00', '2026-07-23 02:00:00'),
(19, 13, 'Pertidaksamaan Linear', NULL, 2, '2026-07-23 02:00:00', '2026-07-23 02:00:00'),
(20, 14, 'Konsep Fungsi', NULL, 1, '2026-07-23 02:00:00', '2026-07-23 02:00:00'),
(21, 14, 'Grafik Fungsi Linear', NULL, 2, '2026-07-23 02:00:00', '2026-07-23 02:00:00'),
(22, 15, 'Perbandingan Trigonometri', NULL, 1, '2026-07-23 02:00:00', '2026-07-23 02:00:00'),
(23, 15, 'Identitas Trigonometri', NULL, 2, '2026-07-23 02:00:00', '2026-07-23 02:00:00'),
-- Fisika subchapters
(24, 16, 'Gerak Lurus Beraturan (GLB)', NULL, 1, '2026-07-23 02:00:00', '2026-07-23 02:00:00'),
(25, 16, 'Gerak Lurus Berubah Beraturan (GLBB)', NULL, 2, '2026-07-23 02:00:00', '2026-07-23 02:00:00'),
(26, 17, 'Hukum Newton I, II, dan III', NULL, 1, '2026-07-23 02:00:00', '2026-07-23 02:00:00'),
(27, 17, 'Penerapan Hukum Newton', NULL, 2, '2026-07-23 02:00:00', '2026-07-23 02:00:00'),
-- Sejarah subchapters
(28, 18, 'Kerajaan Kutai dan Tarumanegara', NULL, 1, '2026-07-23 02:00:00', '2026-07-23 02:00:00'),
(29, 18, 'Kerajaan Majapahit', NULL, 2, '2026-07-23 02:00:00', '2026-07-23 02:00:00'),
(30, 19, 'Budi Utomo dan Sarekat Islam', NULL, 1, '2026-07-23 02:00:00', '2026-07-23 02:00:00'),
(31, 19, 'Sumpah Pemuda', NULL, 2, '2026-07-23 02:00:00', '2026-07-23 02:00:00');

-- =====================================================
-- 5. MATERIALS
-- =====================================================
INSERT INTO `materials` (`id`, `chapter_id`, `subchapter_id`, `title`, `description`, `content`, `order`, `file_type`, `duration_seconds`, `file_url`, `status`, `created_at`, `updated_at`) VALUES
-- === PAI: Sejarah Abbasiyah (chapter 6) ===
(21, 6, 13, 'Sejarah Berdirinya Dinasti Abbasiyah', 'Video pembelajaran tentang latar belakang berdirinya Dinasti Abbasiyah', NULL, 1, 'video', 720, 'https://www.youtube.com/watch?v=YH8lXs4xCJo', 'published', '2026-07-23 02:01:00', '2026-07-23 02:01:00'),
(22, 6, 14, 'Ilmu Pengetahuan Masa Abbasiyah', 'Materi teks tentang perkembangan ilmu pengetahuan pada masa Dinasti Abbasiyah', '<h3>Kejayaan Ilmu Pengetahuan pada Masa Dinasti Abbasiyah</h3><p>Dinasti Abbasiyah (750-1258 M) merupakan salah satu masa keemasan peradaban Islam. Pada era ini, Baghdad menjadi pusat ilmu pengetahuan dunia dengan didirikannya <strong>Baitul Hikmah</strong> (Rumah Kebijaksanaan) oleh Khalifah Harun Ar-Rasyid dan mencapai puncaknya di masa Khalifah Al-Ma''mun.</p><h4>Bidang-Bidang Keilmuan</h4><ul><li><strong>Kedokteran:</strong> Ibnu Sina (Avicenna) menulis <em>Al-Qanun fi al-Tibb</em> yang menjadi rujukan di Eropa selama berabad-abad.</li><li><strong>Matematika:</strong> Al-Khawarizmi mengembangkan aljabar dan memperkenalkan sistem angka Hindu-Arab ke dunia Barat.</li><li><strong>Astronomi:</strong> Al-Battani menghitung panjang tahun matahari dengan akurasi yang mengagumkan.</li><li><strong>Filsafat:</strong> Al-Kindi, Al-Farabi, dan Ibnu Rusyd menjembatani filsafat Yunani dengan pemikiran Islam.</li><li><strong>Kimia:</strong> Jabir bin Hayyan dikenal sebagai \"Bapak Kimia\" dengan eksperimen distilasi dan kristalisasi.</li></ul><h4>Warisan bagi Dunia Modern</h4><p>Kontribusi para ilmuwan Muslim pada masa Abbasiyah menjadi fondasi bagi Renaissance di Eropa. Banyak karya mereka diterjemahkan ke dalam bahasa Latin dan menjadi bahan ajar di universitas-universitas Eropa.</p>', 2, 'text', 600, NULL, 'published', '2026-07-23 02:01:00', '2026-07-23 02:01:00'),

-- === PAI: Penciptaan Alam Semesta (chapter 7) ===
(23, 7, 15, 'Penciptaan Alam Semesta dalam Al-Quran', 'Video ceramah tentang dalil-dalil penciptaan alam', NULL, 1, 'video', 840, 'https://www.youtube.com/watch?v=ch3-U3GVMXQ', 'published', '2026-07-23 02:01:00', '2026-07-23 02:01:00'),
(24, 7, 16, 'Hikmah Penciptaan Alam Semesta', NULL, '<h3>Merenungi Hikmah Penciptaan Alam Semesta</h3><p>Allah SWT berfirman dalam <strong>Q.S. Ali Imran/3: 190-191</strong>: <em>"Sesungguhnya dalam penciptaan langit dan bumi, serta pergantian malam dan siang terdapat tanda-tanda (kebesaran Allah) bagi orang yang berakal."</em></p><h4>1. Tanda-Tanda Kebesaran Allah</h4><p>Alam semesta yang begitu luas dengan miliaran galaksi, bintang, dan planet menunjukkan kebesaran dan kekuasaan Allah yang tidak terbatas. Setiap atom dalam alam semesta bergerak sesuai dengan ketentuan-Nya.</p><h4>2. Keteraturan Alam</h4><p>Pergantian siang dan malam, perputaran bumi mengelilingi matahari, siklus air — semua berjalan dengan keteraturan yang sempurna. Ini menunjukkan adanya Dzat yang Maha Mengatur.</p><h4>3. Tanggung Jawab Manusia</h4><p>Sebagai khalifah di muka bumi, manusia memiliki tanggung jawab untuk menjaga kelestarian alam. Islam mengajarkan konsep <em>rahmatan lil alamin</em> — menjadi rahmat bagi seluruh alam.</p><h4>Refleksi</h4><p>Renungkanlah: setiap kali kalian melihat keindahan alam — matahari terbit, langit malam berbintang, atau hujan yang menyejukkan — ingatlah bahwa itu semua adalah tanda-tanda kebesaran Allah SWT.</p>', 2, 'text', 480, NULL, 'published', '2026-07-23 02:01:00', '2026-07-23 02:01:00'),

-- === Matematika: Persamaan Linear (chapter 13) ===
(25, 13, 18, 'Pengantar Persamaan Linear Satu Variabel', 'Video penjelasan konsep PLSV dan cara penyelesaiannya', NULL, 1, 'video', 600, '/storage/materials/core/dummy_material_video.mp4', 'published', '2026-07-23 02:02:00', '2026-07-23 02:02:00'),
(26, 13, 18, 'Materi Persamaan Linear Satu Variabel', NULL, '<h3>Persamaan Linear Satu Variabel (PLSV)</h3><h4>Definisi</h4><p>Persamaan linear satu variabel adalah kalimat terbuka yang memiliki satu variabel berpangkat satu. Bentuk umum: <strong>ax + b = 0</strong>, dengan a ≠ 0.</p><h4>Langkah Penyelesaian</h4><ol><li>Kelompokkan suku-suku yang mengandung variabel di satu ruas</li><li>Kelompokkan konstanta di ruas lainnya</li><li>Sederhanakan kedua ruas</li><li>Bagi kedua ruas dengan koefisien variabel</li></ol><h4>Contoh</h4><p>Selesaikan: <strong>3x + 5 = 20</strong></p><p>Langkah 1: 3x = 20 - 5</p><p>Langkah 2: 3x = 15</p><p>Langkah 3: x = 15/3 = <strong>5</strong></p><h4>Latihan</h4><ol><li>2x + 7 = 15</li><li>4x - 3 = 13</li><li>5(x + 2) = 35</li></ol>', 2, 'text', 480, NULL, 'published', '2026-07-23 02:02:00', '2026-07-23 02:02:00'),
(27, 13, 19, 'Pertidaksamaan Linear', 'Memahami konsep pertidaksamaan dan penyelesaiannya', NULL, 1, 'video', 540, 'https://www.youtube.com/watch?v=lFMcJiS0rnQ', 'published', '2026-07-23 02:02:00', '2026-07-23 02:02:00'),

-- === Matematika: Fungsi dan Grafik (chapter 14) ===
(28, 14, 20, 'Pengantar Konsep Fungsi', 'Video pembelajaran tentang domain, kodomain, dan range', NULL, 1, 'video', 720, '/storage/materials/core/dummy_material_video.mp4', 'published', '2026-07-23 02:02:00', '2026-07-23 02:02:00'),
(29, 14, 21, 'Grafik Fungsi Linear', NULL, '<h3>Menggambar Grafik Fungsi Linear</h3><h4>Bentuk Umum</h4><p>Fungsi linear memiliki bentuk umum <strong>f(x) = mx + c</strong>, di mana:</p><ul><li><strong>m</strong> = gradien (kemiringan garis)</li><li><strong>c</strong> = konstanta (titik potong sumbu-y)</li></ul><h4>Langkah Menggambar Grafik</h4><ol><li>Tentukan minimal 2 titik dengan mensubstitusikan nilai x</li><li>Plot titik-titik pada bidang koordinat</li><li>Hubungkan titik-titik tersebut dengan garis lurus</li></ol><h4>Contoh</h4><p>Gambar grafik f(x) = 2x + 1</p><p>Jika x = 0, maka f(0) = 1 → titik (0, 1)</p><p>Jika x = 2, maka f(2) = 5 → titik (2, 5)</p><p>Hubungkan kedua titik untuk mendapatkan grafik.</p><h4>Sifat-Sifat</h4><ul><li>Jika m > 0, grafik naik dari kiri ke kanan</li><li>Jika m < 0, grafik turun dari kiri ke kanan</li><li>Jika m = 0, grafik berupa garis horizontal</li></ul>', 2, 'text', 600, NULL, 'published', '2026-07-23 02:02:00', '2026-07-23 02:02:00'),

-- === Matematika: Trigonometri (chapter 15) ===
(30, 15, 22, 'Perbandingan Trigonometri', 'Video pengantar sin, cos, dan tan pada segitiga siku-siku', NULL, 1, 'video', 900, '/storage/materials/core/dummy_material_video.mp4', 'published', '2026-07-23 02:02:00', '2026-07-23 02:02:00'),

-- === Fisika: Gerak Lurus (chapter 16) ===
(31, 16, 24, 'Gerak Lurus Beraturan (GLB)', 'Video pembelajaran konsep GLB beserta contoh soal', NULL, 1, 'video', 780, '/storage/materials/core/dummy_material_video.mp4', 'published', '2026-07-23 02:03:00', '2026-07-23 02:03:00'),
(32, 16, 25, 'Gerak Lurus Berubah Beraturan (GLBB)', NULL, '<h3>Gerak Lurus Berubah Beraturan (GLBB)</h3><h4>Pengertian</h4><p>GLBB adalah gerak benda pada lintasan lurus dengan percepatan tetap (konstan). Artinya, kecepatan benda berubah secara teratur setiap detiknya.</p><h4>Rumus-Rumus GLBB</h4><ul><li><strong>v = v₀ + at</strong> (kecepatan akhir)</li><li><strong>s = v₀t + ½at²</strong> (jarak tempuh)</li><li><strong>v² = v₀² + 2as</strong> (hubungan kecepatan dan jarak)</li></ul><p>Keterangan: v = kecepatan akhir (m/s), v₀ = kecepatan awal (m/s), a = percepatan (m/s²), t = waktu (s), s = jarak (m)</p><h4>Contoh Soal</h4><p>Sebuah mobil bergerak dari keadaan diam dengan percepatan 2 m/s². Tentukan kecepatan mobil setelah 5 detik!</p><p><strong>Jawab:</strong> v = v₀ + at = 0 + (2)(5) = <strong>10 m/s</strong></p><h4>GLBB Diperlambat</h4><p>Ketika benda mengalami perlambatan, nilai percepatan bertanda negatif. Contoh: mobil yang mengerem hingga berhenti.</p>', 2, 'text', 600, NULL, 'published', '2026-07-23 02:03:00', '2026-07-23 02:03:00'),

-- === Fisika: Hukum Newton (chapter 17) ===
(33, 17, 26, 'Hukum Newton tentang Gerak', 'Video lengkap tentang Hukum Newton I, II, dan III', NULL, 1, 'video', 900, 'https://www.youtube.com/watch?v=kKKM8Y-u7ds', 'published', '2026-07-23 02:03:00', '2026-07-23 02:03:00'),
(34, 17, 27, 'Penerapan Hukum Newton', NULL, '<h3>Penerapan Hukum Newton dalam Kehidupan Sehari-hari</h3><h4>Hukum Newton I (Inersia)</h4><p><em>"Setiap benda akan tetap diam atau bergerak lurus beraturan jika resultan gaya yang bekerja padanya sama dengan nol."</em></p><p><strong>Contoh:</strong> Penumpang bus terdorong ke depan saat bus tiba-tiba berhenti. Sabuk pengaman pada kendaraan melindungi penumpang berdasarkan prinsip ini.</p><h4>Hukum Newton II (F = ma)</h4><p><em>"Percepatan suatu benda berbanding lurus dengan resultan gaya dan berbanding terbalik dengan massanya."</em></p><p><strong>Contoh:</strong> Mendorong gerobak kosong lebih mudah daripada gerobak yang penuh muatan, karena massanya berbeda.</p><h4>Hukum Newton III (Aksi-Reaksi)</h4><p><em>"Jika benda A memberikan gaya pada benda B, maka benda B memberikan gaya yang sama besar namun berlawanan arah pada benda A."</em></p><p><strong>Contoh:</strong> Roket meluncur ke atas karena gas hasil pembakaran bahan bakar terdorong ke bawah (aksi), sementara roket terdorong ke atas (reaksi).</p>', 2, 'text', 720, NULL, 'published', '2026-07-23 02:03:00', '2026-07-23 02:03:00'),

-- === Sejarah: Kerajaan Hindu-Buddha (chapter 18) ===
(35, 18, 28, 'Kerajaan Kutai dan Tarumanegara', 'Video dokumenter tentang kerajaan tertua di Nusantara', NULL, 1, 'video', 840, '/storage/materials/core/dummy_material_video.mp4', 'published', '2026-07-23 02:04:00', '2026-07-23 02:04:00'),
(36, 18, 29, 'Kejayaan Kerajaan Majapahit', NULL, '<h3>Kerajaan Majapahit: Puncak Peradaban Nusantara</h3><h4>Berdirinya Majapahit (1293 M)</h4><p>Kerajaan Majapahit didirikan oleh <strong>Raden Wijaya</strong> pada tahun 1293 M di daerah Trowulan, Jawa Timur. Kerajaan ini merupakan kerajaan Hindu-Buddha terbesar dan terkuat yang pernah berdiri di Nusantara.</p><h4>Masa Kejayaan</h4><p>Majapahit mencapai puncak kejayaan pada masa pemerintahan <strong>Hayam Wuruk</strong> (1350-1389 M) dengan Mahapatih <strong>Gajah Mada</strong>. Melalui <em>Sumpah Palapa</em>, Gajah Mada berjanji tidak akan menikmati palapa (garam) sebelum seluruh Nusantara bersatu di bawah Majapahit.</p><h4>Wilayah Kekuasaan</h4><p>Berdasarkan kitab <em>Nagarakretagama</em> karya Mpu Prapanca, wilayah pengaruh Majapahit meliputi:</p><ul><li>Seluruh Pulau Jawa dan Bali</li><li>Kalimantan, Sulawesi, dan Maluku</li><li>Sebagian Semenanjung Melayu</li><li>Filipina bagian selatan</li></ul><h4>Peninggalan</h4><p>Candi Penataran, Candi Tikus, dan situs Trowulan menjadi bukti kebesaran arsitektur Majapahit. Kitab <em>Sutasoma</em> karya Mpu Tantular yang berisi semboyan <strong>\"Bhinneka Tunggal Ika\"</strong> menjadi dasar negara Indonesia.</p>', 2, 'text', 720, NULL, 'published', '2026-07-23 02:04:00', '2026-07-23 02:04:00'),

-- === Sejarah: Pergerakan Nasional (chapter 19) ===
(37, 19, 30, 'Organisasi Pergerakan Nasional', 'Video tentang Budi Utomo, Sarekat Islam, dan organisasi pergerakan lainnya', NULL, 1, 'video', 960, '/storage/materials/core/dummy_material_video.mp4', 'published', '2026-07-23 02:04:00', '2026-07-23 02:04:00'),
(38, 19, 31, 'Sumpah Pemuda 1928', NULL, '<h3>Sumpah Pemuda: Tonggak Persatuan Bangsa</h3><h4>Latar Belakang</h4><p>Pada awal abad ke-20, organisasi pergerakan di Hindia Belanda masih bersifat kedaerahan. Budi Utomo (1908) mewakili kaum priyayi Jawa, Sarekat Islam (1912) mewakili pedagang Muslim, dan Jong Sumatranen Bond mewakili pemuda Sumatera. Diperlukan suatu momentum untuk mempersatukan seluruh elemen pergerakan.</p><h4>Kongres Pemuda II (27-28 Oktober 1928)</h4><p>Kongres diadakan di tiga tempat berbeda di Jakarta:</p><ol><li>Gedung Katholieke Jongenlingen Bond</li><li>Gedung Oost-Java Bioscoop</li><li>Gedung Indonesisch Clubhuis (Gedung Pemuda)</li></ol><h4>Isi Sumpah Pemuda</h4><p><strong>Pertama:</strong> Kami putra dan putri Indonesia, mengaku bertumpah darah yang satu, tanah Indonesia.<br><strong>Kedua:</strong> Kami putra dan putri Indonesia, mengaku berbangsa yang satu, bangsa Indonesia.<br><strong>Ketiga:</strong> Kami putra dan putri Indonesia, menjunjung bahasa persatuan, bahasa Indonesia.</p><h4>Dampak Sumpah Pemuda</h4><ul><li>Menyatukan gerakan pemuda dari berbagai daerah dan latar belakang</li><li>Bahasa Melayu resmi menjadi bahasa persatuan (bahasa Indonesia)</li><li>Mempercepat proses menuju kemerdekaan Indonesia</li></ul>', 2, 'text', 720, NULL, 'published', '2026-07-23 02:04:00', '2026-07-23 02:04:00');

-- =====================================================
-- 6. ATTACHMENTS (Material Attachments)
-- =====================================================
INSERT INTO `attachments` (`id`, `material_id`, `title`, `description`, `file_url`, `created_at`, `updated_at`) VALUES
(8, 22, 'Infografis Dinasti Abbasiyah', 'Infografis ringkasan kejayaan Dinasti Abbasiyah', 'http://localhost:8000/storage/materials/attachments/dummy_attachment_img.png', '2026-07-23 02:05:00', '2026-07-23 02:05:00'),
(9, 26, 'Rangkuman Rumus PLSV', 'Rangkuman rumus-rumus persamaan linear', 'http://localhost:8000/storage/materials/attachments/dummy_attachment_img.png', '2026-07-23 02:05:00', '2026-07-23 02:05:00'),
(10, 32, 'Tabel Rumus GLBB', 'Tabel rumus-rumus gerak lurus berubah beraturan', 'http://localhost:8000/storage/materials/attachments/dummy_attachment_img.png', '2026-07-23 02:05:00', '2026-07-23 02:05:00'),
(11, 36, 'Peta Wilayah Majapahit', 'Peta wilayah kekuasaan Kerajaan Majapahit', 'http://localhost:8000/storage/materials/attachments/dummy_attachment_img.png', '2026-07-23 02:05:00', '2026-07-23 02:05:00');

-- =====================================================
-- 7. CLASSES for Fisika & Sejarah
-- =====================================================
INSERT INTO `classes` (`id`, `subject_id`, `teacher_id`, `school_year_id`, `day_schedule`, `time_schedule`, `assignment_weight`, `assessment_weight`, `deleted_at`, `created_at`, `updated_at`) VALUES
(9, 6, 7, 2, 2, '08:00:00', 50, 50, NULL, '2026-07-23 02:06:00', '2026-07-23 02:06:00'),
(10, 6, 10, 2, 4, '09:00:00', 50, 50, NULL, '2026-07-23 02:06:00', '2026-07-23 02:06:00'),
(11, 7, 8, 2, 3, '10:00:00', 50, 50, NULL, '2026-07-23 02:06:00', '2026-07-23 02:06:00'),
(12, 7, 11, 2, 5, '08:00:00', 50, 50, NULL, '2026-07-23 02:06:00', '2026-07-23 02:06:00');

-- =====================================================
-- 8. CLASS_GROUP_YEARS — link classes to groups
-- =====================================================
INSERT INTO `class_group_years` (`id`, `class_id`, `group_year_id`, `created_at`, `updated_at`) VALUES
-- Fisika class 9 (teacher 7) → 10A, 10B
(25, 9, 4, NULL, NULL),
(26, 9, 5, NULL, NULL),
-- Fisika class 10 (teacher 10) → 10C, 10D
(27, 10, 6, NULL, NULL),
(28, 10, 7, NULL, NULL),
-- Sejarah class 11 (teacher 8) → 11A, 11B
(29, 11, 9, NULL, NULL),
(30, 11, 10, NULL, NULL),
-- Sejarah class 12 (teacher 11) → 11C, 11D
(31, 12, 11, NULL, NULL),
(32, 12, 12, NULL, NULL);

-- =====================================================
-- 9. CLASS ASSIGNMENTS (Active, not deleted)
-- =====================================================
INSERT INTO `class_assignments` (`id`, `class_id`, `chapter_id`, `material_id`, `title`, `description`, `due_date`, `grade`, `status`, `deleted_at`, `created_at`, `updated_at`) VALUES
-- Matematika assignment
(12, 5, 13, NULL, 'Latihan Soal Persamaan Linear', '<p>Kerjakan 10 soal persamaan linear satu variabel berikut. Tuliskan langkah penyelesaian secara lengkap dan rapi.</p>', '2026-08-01 17:00:00', 100, 'open', NULL, '2026-07-23 02:07:00', '2026-07-23 02:07:00'),
-- Fisika assignment
(13, 9, 16, NULL, 'Laporan Praktikum Gerak Lurus', '<p>Buatlah laporan praktikum pengukuran kecepatan benda pada bidang miring. Sertakan tabel data, grafik, dan analisis kesalahan.</p>', '2026-08-05 17:00:00', 100, 'open', NULL, '2026-07-23 02:07:00', '2026-07-23 02:07:00'),
-- Sejarah assignment
(14, 11, 18, NULL, 'Essay Kerajaan Majapahit', '<p>Tulis essay minimal 500 kata tentang peran Gajah Mada dalam mempersatukan Nusantara. Sertakan minimal 3 sumber referensi.</p>', '2026-08-03 17:00:00', 100, 'open', NULL, '2026-07-23 02:07:00', '2026-07-23 02:07:00'),
-- PAI additional active assignment (chapter 6)
(15, 4, 6, NULL, 'Rangkuman Dinasti Abbasiyah', '<p>Buatlah rangkuman materi Dinasti Abbasiyah dalam bentuk peta konsep (mind map). Sertakan tokoh-tokoh penting dan kontribusinya.</p>', '2026-08-02 17:00:00', 100, 'open', NULL, '2026-07-23 02:07:00', '2026-07-23 02:07:00');

-- =====================================================
-- 10. CLASS ASSIGNMENT ATTACHMENTS
-- =====================================================
INSERT INTO `class_assignment_attachments` (`id`, `class_assignment_id`, `title`, `file_url`, `created_at`, `updated_at`) VALUES
(3, 12, 'Contoh Soal PLSV', 'http://localhost:8000/storage/assignments/attachments/dummy_assign_attach.png', '2026-07-23 02:07:00', '2026-07-23 02:07:00'),
(4, 13, 'Template Laporan Praktikum', 'http://localhost:8000/storage/assignments/attachments/dummy_assign_attach.png', '2026-07-23 02:07:00', '2026-07-23 02:07:00'),
(5, 14, 'Panduan Penulisan Essay', 'http://localhost:8000/storage/assignments/attachments/dummy_assign_attach.png', '2026-07-23 02:07:00', '2026-07-23 02:07:00');

-- =====================================================
-- 11. CLASS RUBRICS for new assignments
-- =====================================================
INSERT INTO `class_rubrics` (`id`, `class_assignment_id`, `title`, `description`, `created_at`, `updated_at`) VALUES
(12, 12, 'Rubrik Latihan PLSV', 'Menilai ketepatan jawaban dan kelengkapan langkah', '2026-07-23 02:08:00', '2026-07-23 02:08:00'),
(13, 13, 'Rubrik Laporan Praktikum', 'Menilai kelengkapan data, grafik, dan analisis', '2026-07-23 02:08:00', '2026-07-23 02:08:00'),
(14, 14, 'Rubrik Essay Sejarah', 'Menilai kedalaman analisis dan kualitas argumen', '2026-07-23 02:08:00', '2026-07-23 02:08:00'),
(15, 15, 'Rubrik Mind Map Abbasiyah', 'Menilai kelengkapan dan kreativitas peta konsep', '2026-07-23 02:08:00', '2026-07-23 02:08:00');

-- =====================================================
-- 12. CLASS RUBRIC CRITERIA
-- =====================================================
INSERT INTO `class_rubric_criteria` (`id`, `class_rubric_id`, `title`, `description`, `weight`, `created_at`, `updated_at`) VALUES
-- Rubrik PLSV
(15, 12, 'Ketepatan Jawaban', 'Apakah jawaban akhir benar', 60, '2026-07-23 02:08:00', '2026-07-23 02:08:00'),
(16, 12, 'Kelengkapan Langkah', 'Apakah langkah penyelesaian ditulis lengkap', 40, '2026-07-23 02:08:00', '2026-07-23 02:08:00'),
-- Rubrik Laporan Praktikum
(17, 13, 'Kelengkapan Data', 'Tabel data terisi lengkap dan akurat', 40, '2026-07-23 02:08:00', '2026-07-23 02:08:00'),
(18, 13, 'Kualitas Grafik', 'Grafik digambar dengan benar dan rapi', 30, '2026-07-23 02:08:00', '2026-07-23 02:08:00'),
(19, 13, 'Analisis Kesalahan', 'Analisis sumber kesalahan pengukuran', 30, '2026-07-23 02:08:00', '2026-07-23 02:08:00'),
-- Rubrik Essay Sejarah
(20, 14, 'Kedalaman Analisis', 'Analisis mendalam tentang topik', 50, '2026-07-23 02:08:00', '2026-07-23 02:08:00'),
(21, 14, 'Kualitas Referensi', 'Sumber yang digunakan kredibel', 25, '2026-07-23 02:08:00', '2026-07-23 02:08:00'),
(22, 14, 'Tata Bahasa', 'Bahasa yang digunakan baik dan benar', 25, '2026-07-23 02:08:00', '2026-07-23 02:08:00'),
-- Rubrik Mind Map Abbasiyah
(23, 15, 'Kelengkapan Materi', 'Mencakup semua topik penting', 50, '2026-07-23 02:08:00', '2026-07-23 02:08:00'),
(24, 15, 'Kreativitas Desain', 'Mind map kreatif dan mudah dipahami', 50, '2026-07-23 02:08:00', '2026-07-23 02:08:00');

-- =====================================================
-- 13. CLASS RUBRIC LEVELS
-- =====================================================
INSERT INTO `class_rubric_levels` (`id`, `class_criterion_id`, `label`, `score`, `description`, `created_at`, `updated_at`) VALUES
-- Ketepatan Jawaban (criterion 15)
(35, 15, 'Sempurna', 4, 'Semua jawaban benar', '2026-07-23 02:08:00', '2026-07-23 02:08:00'),
(36, 15, 'Baik', 3, 'Sebagian besar jawaban benar', '2026-07-23 02:08:00', '2026-07-23 02:08:00'),
(37, 15, 'Cukup', 2, 'Setengah jawaban benar', '2026-07-23 02:08:00', '2026-07-23 02:08:00'),
(38, 15, 'Kurang', 1, 'Sebagian besar jawaban salah', '2026-07-23 02:08:00', '2026-07-23 02:08:00'),
-- Kelengkapan Langkah (criterion 16)
(39, 16, 'Lengkap', 3, 'Semua langkah ditulis dengan jelas', '2026-07-23 02:08:00', '2026-07-23 02:08:00'),
(40, 16, 'Sebagian', 2, 'Ada beberapa langkah yang terlewat', '2026-07-23 02:08:00', '2026-07-23 02:08:00'),
(41, 16, 'Tidak Lengkap', 1, 'Langkah penyelesaian tidak ditulis', '2026-07-23 02:08:00', '2026-07-23 02:08:00'),
-- Kelengkapan Data (criterion 17)
(42, 17, 'Sangat Lengkap', 4, 'Data lengkap dan akurat', '2026-07-23 02:08:00', '2026-07-23 02:08:00'),
(43, 17, 'Lengkap', 3, 'Data lengkap tapi ada sedikit kesalahan', '2026-07-23 02:08:00', '2026-07-23 02:08:00'),
(44, 17, 'Kurang Lengkap', 2, 'Data tidak lengkap', '2026-07-23 02:08:00', '2026-07-23 02:08:00'),
(45, 17, 'Tidak Lengkap', 1, 'Data sangat minim', '2026-07-23 02:08:00', '2026-07-23 02:08:00'),
-- Kualitas Grafik (criterion 18)
(46, 18, 'Rapi dan Benar', 3, 'Grafik digambar dengan benar', '2026-07-23 02:08:00', '2026-07-23 02:08:00'),
(47, 18, 'Cukup', 2, 'Grafik ada tapi kurang rapi', '2026-07-23 02:08:00', '2026-07-23 02:08:00'),
(48, 18, 'Kurang', 1, 'Grafik tidak sesuai data', '2026-07-23 02:08:00', '2026-07-23 02:08:00'),
-- Analisis Kesalahan (criterion 19)
(49, 19, 'Mendalam', 3, 'Analisis lengkap dengan rekomendasi', '2026-07-23 02:08:00', '2026-07-23 02:08:00'),
(50, 19, 'Cukup', 2, 'Ada analisis tapi kurang mendalam', '2026-07-23 02:08:00', '2026-07-23 02:08:00'),
(51, 19, 'Tidak Ada', 1, 'Tidak ada analisis kesalahan', '2026-07-23 02:08:00', '2026-07-23 02:08:00'),
-- Kedalaman Analisis (criterion 20)
(52, 20, 'Sangat Mendalam', 4, 'Argumen kuat dengan bukti sejarah', '2026-07-23 02:08:00', '2026-07-23 02:08:00'),
(53, 20, 'Mendalam', 3, 'Argumen cukup kuat', '2026-07-23 02:08:00', '2026-07-23 02:08:00'),
(54, 20, 'Dangkal', 2, 'Argumen kurang mendalam', '2026-07-23 02:08:00', '2026-07-23 02:08:00'),
(55, 20, 'Sangat Dangkal', 1, 'Tidak ada analisis yang berarti', '2026-07-23 02:08:00', '2026-07-23 02:08:00'),
-- Kualitas Referensi (criterion 21)
(56, 21, 'Kredibel', 3, 'Semua sumber terpercaya', '2026-07-23 02:08:00', '2026-07-23 02:08:00'),
(57, 21, 'Cukup', 2, 'Sebagian sumber terpercaya', '2026-07-23 02:08:00', '2026-07-23 02:08:00'),
(58, 21, 'Tidak Kredibel', 1, 'Sumber tidak bisa dipertanggungjawabkan', '2026-07-23 02:08:00', '2026-07-23 02:08:00'),
-- Tata Bahasa (criterion 22)
(59, 22, 'Sempurna', 3, 'Bahasa baku dan tidak ada kesalahan', '2026-07-23 02:08:00', '2026-07-23 02:08:00'),
(60, 22, 'Baik', 2, 'Sedikit kesalahan tata bahasa', '2026-07-23 02:08:00', '2026-07-23 02:08:00'),
(61, 22, 'Buruk', 1, 'Banyak kesalahan tata bahasa', '2026-07-23 02:08:00', '2026-07-23 02:08:00'),
-- Kelengkapan Materi (criterion 23)
(62, 23, 'Sangat Lengkap', 4, 'Semua topik penting tercakup', '2026-07-23 02:08:00', '2026-07-23 02:08:00'),
(63, 23, 'Lengkap', 3, 'Sebagian besar topik tercakup', '2026-07-23 02:08:00', '2026-07-23 02:08:00'),
(64, 23, 'Kurang', 2, 'Banyak topik yang terlewat', '2026-07-23 02:08:00', '2026-07-23 02:08:00'),
(65, 23, 'Sangat Kurang', 1, 'Hanya sedikit topik yang dibahas', '2026-07-23 02:08:00', '2026-07-23 02:08:00'),
-- Kreativitas Desain (criterion 24)
(66, 24, 'Sangat Kreatif', 4, 'Desain unik dan sangat informatif', '2026-07-23 02:08:00', '2026-07-23 02:08:00'),
(67, 24, 'Kreatif', 3, 'Desain bagus dan informatif', '2026-07-23 02:08:00', '2026-07-23 02:08:00'),
(68, 24, 'Biasa', 2, 'Desain standar', '2026-07-23 02:08:00', '2026-07-23 02:08:00'),
(69, 24, 'Tidak Kreatif', 1, 'Desain monoton dan sulit dipahami', '2026-07-23 02:08:00', '2026-07-23 02:08:00');

-- =====================================================
-- 14. CLASS QUESTIONS & OPTIONS (for assessments)
-- =====================================================
INSERT INTO `class_questions` (`id`, `question`, `levels`, `score`, `explanation`, `created_at`, `updated_at`) VALUES
-- PAI questions
(2, '<p>Khalifah Abbasiyah yang mendirikan Baitul Hikmah adalah...</p>', '1', 1, '<p>Baitul Hikmah didirikan oleh Khalifah Harun Ar-Rasyid dan mencapai puncak kejayaannya pada masa Khalifah Al-Ma''mun.</p>', '2026-07-23 02:09:00', '2026-07-23 02:09:00'),
(3, '<p>Ilmuwan Muslim yang dikenal sebagai "Bapak Aljabar" adalah...</p>', '1', 1, '<p>Al-Khawarizmi merupakan ilmuwan Muslim yang mengembangkan ilmu aljabar. Kata "algoritma" juga berasal dari namanya.</p>', '2026-07-23 02:09:00', '2026-07-23 02:09:00'),
(4, '<p>Sifat zuhud berarti...</p>', '0', 1, '<p>Zuhud adalah sikap tidak terlalu mengejar dunia, bukan berarti tidak bekerja, tapi menempatkan dunia di tangan bukan di hati.</p>', '2026-07-23 02:09:00', '2026-07-23 02:09:00'),
-- Matematika questions
(5, '<p>Nilai x yang memenuhi persamaan 2x + 6 = 14 adalah...</p>', '0', 1, '<p>2x + 6 = 14 → 2x = 8 → x = 4</p>', '2026-07-23 02:09:00', '2026-07-23 02:09:00'),
(6, '<p>Jika f(x) = 3x - 2, maka nilai f(5) adalah...</p>', '1', 1, '<p>f(5) = 3(5) - 2 = 15 - 2 = 13</p>', '2026-07-23 02:09:00', '2026-07-23 02:09:00'),
(7, '<p>Gradien garis yang melalui titik (1, 3) dan (3, 7) adalah...</p>', '2', 1, '<p>m = (y2 - y1)/(x2 - x1) = (7-3)/(3-1) = 4/2 = 2</p>', '2026-07-23 02:09:00', '2026-07-23 02:09:00');

INSERT INTO `class_options` (`id`, `class_question_id`, `option`, `is_correct`, `created_at`, `updated_at`) VALUES
-- Q2: Khalifah Baitul Hikmah
(5, 2, 'Harun Ar-Rasyid', 1, '2026-07-23 02:09:00', '2026-07-23 02:09:00'),
(6, 2, 'Abu Ja''far Al-Manshur', 0, '2026-07-23 02:09:00', '2026-07-23 02:09:00'),
(7, 2, 'Umar bin Abdul Aziz', 0, '2026-07-23 02:09:00', '2026-07-23 02:09:00'),
(8, 2, 'Al-Mu''tashim Billah', 0, '2026-07-23 02:09:00', '2026-07-23 02:09:00'),
-- Q3: Bapak Aljabar
(9, 3, 'Al-Khawarizmi', 1, '2026-07-23 02:09:00', '2026-07-23 02:09:00'),
(10, 3, 'Ibnu Sina', 0, '2026-07-23 02:09:00', '2026-07-23 02:09:00'),
(11, 3, 'Al-Biruni', 0, '2026-07-23 02:09:00', '2026-07-23 02:09:00'),
(12, 3, 'Jabir bin Hayyan', 0, '2026-07-23 02:09:00', '2026-07-23 02:09:00'),
-- Q4: Sifat Zuhud
(13, 4, 'Tidak terlalu mengejar kesenangan dunia', 1, '2026-07-23 02:09:00', '2026-07-23 02:09:00'),
(14, 4, 'Meninggalkan semua harta benda', 0, '2026-07-23 02:09:00', '2026-07-23 02:09:00'),
(15, 4, 'Tidak mau bekerja sama sekali', 0, '2026-07-23 02:09:00', '2026-07-23 02:09:00'),
(16, 4, 'Hidup dalam kemiskinan', 0, '2026-07-23 02:09:00', '2026-07-23 02:09:00'),
-- Q5: PLSV
(17, 5, '4', 1, '2026-07-23 02:09:00', '2026-07-23 02:09:00'),
(18, 5, '6', 0, '2026-07-23 02:09:00', '2026-07-23 02:09:00'),
(19, 5, '8', 0, '2026-07-23 02:09:00', '2026-07-23 02:09:00'),
(20, 5, '10', 0, '2026-07-23 02:09:00', '2026-07-23 02:09:00'),
-- Q6: Fungsi
(21, 6, '13', 1, '2026-07-23 02:09:00', '2026-07-23 02:09:00'),
(22, 6, '15', 0, '2026-07-23 02:09:00', '2026-07-23 02:09:00'),
(23, 6, '17', 0, '2026-07-23 02:09:00', '2026-07-23 02:09:00'),
(24, 6, '11', 0, '2026-07-23 02:09:00', '2026-07-23 02:09:00'),
-- Q7: Gradien
(25, 7, '2', 1, '2026-07-23 02:09:00', '2026-07-23 02:09:00'),
(26, 7, '3', 0, '2026-07-23 02:09:00', '2026-07-23 02:09:00'),
(27, 7, '4', 0, '2026-07-23 02:09:00', '2026-07-23 02:09:00'),
(28, 7, '1', 0, '2026-07-23 02:09:00', '2026-07-23 02:09:00');

-- =====================================================
-- 15. CLASS ASSESSMENTS (Active, not deleted)
-- =====================================================
INSERT INTO `class_assessments` (`id`, `class_id`, `chapter_id`, `material_id`, `title`, `description`, `start_date`, `due_date`, `duration`, `max_attempts`, `pass_threshold`, `deleted_at`, `created_at`, `updated_at`) VALUES
(2, 4, 6, NULL, 'Ulangan Harian: Sejarah Abbasiyah', 'Ulangan harian untuk mengukur pemahaman siswa tentang Dinasti Abbasiyah', '2026-07-23 00:00:00', '2026-08-06 23:59:00', 30, 3, 70, NULL, '2026-07-23 02:10:00', '2026-07-23 02:10:00'),
(3, 5, 13, NULL, 'Quiz Persamaan Linear', 'Quiz singkat untuk menguji pemahaman PLSV', '2026-07-23 00:00:00', '2026-08-10 23:59:00', 20, 2, 70, NULL, '2026-07-23 02:10:00', '2026-07-23 02:10:00');

-- =====================================================
-- 16. CLASS ASSESSMENT QUESTIONS
-- =====================================================
INSERT INTO `class_assessment_questions` (`id`, `class_assessment_id`, `class_question_id`, `created_at`, `updated_at`) VALUES
-- Assessment 2 (PAI Abbasiyah): questions 2, 3, 4
(2, 2, 2, '2026-07-23 02:10:00', '2026-07-23 02:10:00'),
(3, 2, 3, '2026-07-23 02:10:00', '2026-07-23 02:10:00'),
(4, 2, 4, '2026-07-23 02:10:00', '2026-07-23 02:10:00'),
-- Assessment 3 (Matematika PLSV): questions 5, 6, 7
(5, 3, 5, '2026-07-23 02:10:00', '2026-07-23 02:10:00'),
(6, 3, 6, '2026-07-23 02:10:00', '2026-07-23 02:10:00'),
(7, 3, 7, '2026-07-23 02:10:00', '2026-07-23 02:10:00');

-- =====================================================
-- 17. ASSESSMENT ATTEMPTS & ANSWERS
-- =====================================================
-- Student 28 (Beni, group 10A) takes PAI assessment 2
INSERT INTO `assessment_attempts` (`id`, `class_assessment_id`, `student_id`, `start_time`, `end_time`, `submit_time`, `time_spent_seconds`, `status`, `grade`, `grade_by`, `created_at`, `updated_at`) VALUES
(4, 2, 28, '2026-07-23 03:00:00', '2026-07-23 03:20:00', '2026-07-23 03:20:00', 1200, 'submitted', 100, NULL, '2026-07-23 03:00:00', '2026-07-23 03:20:00'),
-- Student 42 (Eddy, group 10B) takes PAI assessment 2
(5, 2, 42, '2026-07-23 03:05:00', '2026-07-23 03:22:00', '2026-07-23 03:22:00', 1020, 'submitted', 66.67, NULL, '2026-07-23 03:05:00', '2026-07-23 03:22:00'),
-- Student 29 (Cucu, group 10A) takes Matematika assessment 3
(6, 3, 29, '2026-07-23 04:00:00', '2026-07-23 04:15:00', '2026-07-23 04:15:00', 900, 'submitted', 100, NULL, '2026-07-23 04:00:00', '2026-07-23 04:15:00'),
-- Student 51 (Halimah, group 10B) - in progress on Matematika assessment
(7, 3, 51, '2026-07-23 04:10:00', NULL, NULL, NULL, 'progress', NULL, NULL, '2026-07-23 04:10:00', '2026-07-23 04:10:00'),
-- Student 56 (Haryanto, group 10A) takes PAI assessment 2
(8, 2, 56, '2026-07-23 03:30:00', '2026-07-23 03:50:00', '2026-07-23 03:50:00', 1200, 'submitted', 66.67, NULL, '2026-07-23 03:30:00', '2026-07-23 03:50:00');

INSERT INTO `assessment_answers` (`id`, `attempt_id`, `question_id`, `selected_option_id`, `is_correct`, `marked_for_review`, `created_at`, `updated_at`) VALUES
-- Student 28 attempt 4 (all correct)
(4, 4, 2, 5, 1, 0, '2026-07-23 03:05:00', '2026-07-23 03:15:00'),
(5, 4, 3, 9, 1, 0, '2026-07-23 03:10:00', '2026-07-23 03:16:00'),
(6, 4, 4, 13, 1, 0, '2026-07-23 03:15:00', '2026-07-23 03:18:00'),
-- Student 42 attempt 5 (2/3 correct)
(7, 5, 2, 5, 1, 0, '2026-07-23 03:08:00', '2026-07-23 03:12:00'),
(8, 5, 3, 10, 0, 0, '2026-07-23 03:12:00', '2026-07-23 03:16:00'),
(9, 5, 4, 13, 1, 0, '2026-07-23 03:16:00', '2026-07-23 03:20:00'),
-- Student 29 attempt 6 (all correct)
(10, 6, 5, 17, 1, 0, '2026-07-23 04:02:00', '2026-07-23 04:05:00'),
(11, 6, 6, 21, 1, 0, '2026-07-23 04:06:00', '2026-07-23 04:09:00'),
(12, 6, 7, 25, 1, 0, '2026-07-23 04:10:00', '2026-07-23 04:13:00'),
-- Student 51 attempt 7 (in progress, partial answers)
(13, 7, 5, 17, 1, 0, '2026-07-23 04:12:00', '2026-07-23 04:14:00'),
(14, 7, 6, NULL, NULL, 1, '2026-07-23 04:15:00', '2026-07-23 04:15:00'),
-- Student 56 attempt 8 (2/3 correct)
(15, 8, 2, 6, 0, 0, '2026-07-23 03:32:00', '2026-07-23 03:38:00'),
(16, 8, 3, 9, 1, 0, '2026-07-23 03:40:00', '2026-07-23 03:44:00'),
(17, 8, 4, 13, 1, 0, '2026-07-23 03:45:00', '2026-07-23 03:48:00');

-- =====================================================
-- 18. ASSIGNMENT SUBMISSIONS
-- =====================================================
INSERT INTO `assignment_submissions` (`id`, `student_id`, `class_assignment_id`, `path_url`, `student_note`, `grade`, `feedback`, `status`, `grade_by`, `deleted_at`, `created_at`, `updated_at`) VALUES
-- PAI assignment 15 (Rangkuman Abbasiyah) — students from group 10A (class 4)
(3, 28, 15, '/storage/assignments/submissions/dummy_submission_img.png', 'Ini mind map saya tentang Dinasti Abbasiyah', 85, 'Mind map bagus! Tokoh-tokoh sudah lengkap.', 'graded', 2, NULL, '2026-07-23 05:00:00', '2026-07-23 06:00:00'),
(4, 37, 15, '/storage/assignments/submissions/dummy_submission_img.png', 'Mohon dinilai Pak', NULL, NULL, 'submitted', NULL, NULL, '2026-07-23 05:10:00', '2026-07-23 05:10:00'),
(5, 56, 15, '/storage/assignments/submissions/dummy_submission_img.png', NULL, 78, 'Cukup baik, tapi perlu ditambahkan kontribusi ilmuwan.', 'graded', 2, NULL, '2026-07-23 05:20:00', '2026-07-23 06:10:00'),
-- Matematika assignment 12 (PLSV) — students from groups 10D, 10E (class 5)
(6, 52, 12, '/storage/assignments/submissions/dummy_submission_img.png', 'Sudah saya kerjakan semua Pak', 90, 'Langkah penyelesaian sudah lengkap. Excellent!', 'graded', 4, NULL, '2026-07-23 05:30:00', '2026-07-23 06:20:00'),
(7, 78, 12, '/storage/assignments/submissions/dummy_submission_img.png', NULL, NULL, NULL, 'submitted', NULL, NULL, '2026-07-23 05:40:00', '2026-07-23 05:40:00'),
-- Fisika assignment 13 (Laporan Praktikum) — students from group 10A (class 9)
(8, 29, 13, '/storage/assignments/submissions/dummy_submission_img.png', 'Laporan praktikum saya', NULL, NULL, 'submitted', NULL, NULL, '2026-07-23 06:00:00', '2026-07-23 06:00:00'),
-- Sejarah assignment 14 (Essay Majapahit) — students from group 11A (class 11)
(9, 17, 14, '/storage/assignments/submissions/dummy_submission_img.png', 'Essay tentang Gajah Mada', 88, 'Analisis yang mendalam! Referensi sudah baik.', 'graded', 8, NULL, '2026-07-23 06:30:00', '2026-07-23 07:00:00'),
(10, 64, 14, '/storage/assignments/submissions/dummy_submission_img.png', NULL, NULL, NULL, 'submitted', NULL, NULL, '2026-07-23 06:40:00', '2026-07-23 06:40:00');

-- =====================================================
-- 19. RUBRIC POINTS (for graded submissions)
-- =====================================================
INSERT INTO `rubric_points` (`id`, `class_criterion_id`, `student_id`, `class_rubric_level_id`, `created_at`, `updated_at`) VALUES
-- Student 28 graded on assignment 15 (Mind Map) — criteria 23, 24
(3, 23, 28, 62, '2026-07-23 06:00:00', '2026-07-23 06:00:00'),
(4, 24, 28, 67, '2026-07-23 06:00:00', '2026-07-23 06:00:00'),
-- Student 56 graded on assignment 15 — criteria 23, 24
(5, 23, 56, 63, '2026-07-23 06:10:00', '2026-07-23 06:10:00'),
(6, 24, 56, 68, '2026-07-23 06:10:00', '2026-07-23 06:10:00'),
-- Student 52 graded on assignment 12 (PLSV) — criteria 15, 16
(7, 15, 52, 35, '2026-07-23 06:20:00', '2026-07-23 06:20:00'),
(8, 16, 52, 39, '2026-07-23 06:20:00', '2026-07-23 06:20:00'),
-- Student 17 graded on assignment 14 (Essay) — criteria 20, 21, 22
(9, 20, 17, 53, '2026-07-23 07:00:00', '2026-07-23 07:00:00'),
(10, 21, 17, 56, '2026-07-23 07:00:00', '2026-07-23 07:00:00'),
(11, 22, 17, 59, '2026-07-23 07:00:00', '2026-07-23 07:00:00');

-- =====================================================
-- 20. MATERIAL ACCESS LOGS
-- =====================================================
INSERT INTO `material_access_logs` (`id`, `material_id`, `student_id`, `access_start`, `access_end`, `duration_seconds`, `interaction_data`, `created_at`, `updated_at`) VALUES
-- Various students accessing new materials
(86, 21, 28, '2026-07-23 02:30:00', '2026-07-23 02:42:00', 720, '{"type":"exit"}', '2026-07-23 02:30:00', '2026-07-23 02:42:00'),
(87, 22, 28, '2026-07-23 02:45:00', '2026-07-23 02:55:00', 600, '{"type":"exit"}', '2026-07-23 02:45:00', '2026-07-23 02:55:00'),
(88, 25, 42, '2026-07-23 03:00:00', '2026-07-23 03:10:00', 600, '{"type":"exit"}', '2026-07-23 03:00:00', '2026-07-23 03:10:00'),
(89, 26, 42, '2026-07-23 03:12:00', '2026-07-23 03:20:00', 480, '{"type":"exit"}', '2026-07-23 03:12:00', '2026-07-23 03:20:00'),
(90, 31, 29, '2026-07-23 03:30:00', '2026-07-23 03:43:00', 780, '{"type":"exit"}', '2026-07-23 03:30:00', '2026-07-23 03:43:00'),
(91, 32, 29, '2026-07-23 03:45:00', '2026-07-23 03:55:00', 600, '{"type":"exit"}', '2026-07-23 03:45:00', '2026-07-23 03:55:00'),
(92, 35, 17, '2026-07-23 04:00:00', '2026-07-23 04:14:00', 840, '{"type":"exit"}', '2026-07-23 04:00:00', '2026-07-23 04:14:00'),
(93, 36, 17, '2026-07-23 04:15:00', '2026-07-23 04:27:00', 720, '{"type":"exit"}', '2026-07-23 04:15:00', '2026-07-23 04:27:00'),
(94, 37, 64, '2026-07-23 04:30:00', '2026-07-23 04:46:00', 960, '{"type":"exit"}', '2026-07-23 04:30:00', '2026-07-23 04:46:00'),
(95, 38, 64, '2026-07-23 04:48:00', '2026-07-23 05:00:00', 720, '{"type":"exit"}', '2026-07-23 04:48:00', '2026-07-23 05:00:00'),
(96, 23, 37, '2026-07-23 05:00:00', '2026-07-23 05:14:00', 840, '{"type":"exit"}', '2026-07-23 05:00:00', '2026-07-23 05:14:00'),
(97, 24, 37, '2026-07-23 05:15:00', '2026-07-23 05:23:00', 480, '{"type":"exit"}', '2026-07-23 05:15:00', '2026-07-23 05:23:00'),
(98, 33, 56, '2026-07-23 05:30:00', '2026-07-23 05:45:00', 900, '{"type":"exit"}', '2026-07-23 05:30:00', '2026-07-23 05:45:00'),
(99, 34, 56, '2026-07-23 05:48:00', '2026-07-23 06:00:00', 720, '{"type":"exit"}', '2026-07-23 05:48:00', '2026-07-23 06:00:00'),
(100, 28, 51, '2026-07-23 06:00:00', '2026-07-23 06:12:00', 720, '{"type":"exit"}', '2026-07-23 06:00:00', '2026-07-23 06:12:00'),
(101, 29, 51, '2026-07-23 06:15:00', '2026-07-23 06:25:00', 600, '{"type":"exit"}', '2026-07-23 06:15:00', '2026-07-23 06:25:00'),
(102, 30, 66, '2026-07-23 06:30:00', '2026-07-23 06:45:00', 900, '{"type":"exit"}', '2026-07-23 06:30:00', '2026-07-23 06:45:00'),
(103, 25, 80, '2026-07-23 07:00:00', '2026-07-23 07:10:00', 600, '{"type":"exit"}', '2026-07-23 07:00:00', '2026-07-23 07:10:00'),
-- Existing students also accessing new materials
(104, 21, 151, '2026-07-23 07:30:00', '2026-07-23 07:42:00', 720, '{"type":"exit"}', '2026-07-23 07:30:00', '2026-07-23 07:42:00'),
(105, 22, 151, '2026-07-23 07:45:00', '2026-07-23 07:55:00', 600, '{"type":"exit"}', '2026-07-23 07:45:00', '2026-07-23 07:55:00');

-- =====================================================
-- 21. MATERIAL COMPLETION
-- =====================================================
INSERT INTO `material_completion` (`id`, `student_id`, `material_id`, `is_completed`, `completed_at`, `created_at`, `updated_at`) VALUES
(7, 28, 21, 1, '2026-07-23 02:42:00', '2026-07-23 02:42:00', '2026-07-23 02:42:00'),
(8, 28, 22, 1, '2026-07-23 02:55:00', '2026-07-23 02:55:00', '2026-07-23 02:55:00'),
(9, 42, 25, 1, '2026-07-23 03:10:00', '2026-07-23 03:10:00', '2026-07-23 03:10:00'),
(10, 29, 31, 1, '2026-07-23 03:43:00', '2026-07-23 03:43:00', '2026-07-23 03:43:00'),
(11, 29, 32, 1, '2026-07-23 03:55:00', '2026-07-23 03:55:00', '2026-07-23 03:55:00'),
(12, 17, 35, 1, '2026-07-23 04:14:00', '2026-07-23 04:14:00', '2026-07-23 04:14:00'),
(13, 17, 36, 1, '2026-07-23 04:27:00', '2026-07-23 04:27:00', '2026-07-23 04:27:00'),
(14, 64, 37, 1, '2026-07-23 04:46:00', '2026-07-23 04:46:00', '2026-07-23 04:46:00'),
(15, 37, 23, 1, '2026-07-23 05:14:00', '2026-07-23 05:14:00', '2026-07-23 05:14:00'),
(16, 56, 33, 1, '2026-07-23 05:45:00', '2026-07-23 05:45:00', '2026-07-23 05:45:00'),
(17, 151, 21, 1, '2026-07-23 07:42:00', '2026-07-23 07:42:00', '2026-07-23 07:42:00');

-- =====================================================
-- 22. MATERIAL REVIEWS
-- =====================================================
INSERT INTO `material_reviews` (`id`, `material_id`, `student_id`, `score`, `created_at`, `updated_at`) VALUES
(5, 21, 28, 5, '2026-07-23 02:42:00', '2026-07-23 02:42:00'),
(6, 22, 28, 4, '2026-07-23 02:55:00', '2026-07-23 02:55:00'),
(7, 25, 42, 4, '2026-07-23 03:10:00', '2026-07-23 03:10:00'),
(8, 31, 29, 5, '2026-07-23 03:43:00', '2026-07-23 03:43:00'),
(9, 35, 17, 4, '2026-07-23 04:14:00', '2026-07-23 04:14:00'),
(10, 36, 17, 5, '2026-07-23 04:27:00', '2026-07-23 04:27:00'),
(11, 33, 56, 3, '2026-07-23 05:45:00', '2026-07-23 05:45:00'),
(12, 21, 151, 4, '2026-07-23 07:42:00', '2026-07-23 07:42:00');

-- =====================================================
-- 23. REFLECTIONS & REFLECTABLES
-- =====================================================
INSERT INTO `reflections` (`id`, `student_id`, `title`, `content`, `comprehension_level`, `emotions`, `teacher_comment`, `created_at`, `updated_at`) VALUES
(10, 28, 'Reflection: Sejarah Berdirinya Dinasti Abbasiyah', 'Saya baru tahu bahwa Baitul Hikmah adalah perpustakaan terbesar di zamannya. Sangat menginspirasi!', 5, '\"[\\\"\\ud83d\\ude0a\\\"]\"', 'Alhamdulillah, terus semangat belajar sejarah Islam ya!', '2026-07-23 02:42:00', '2026-07-23 06:00:00'),
(11, 42, 'Reflection: Pengantar Persamaan Linear Satu Variabel', NULL, 4, '\"[\\\"\\ud83d\\ude0a\\\",\\\"\\ud83d\\ude15\\\"]\"', NULL, '2026-07-23 03:10:00', '2026-07-23 03:10:00'),
(12, 29, 'Reflection: Gerak Lurus Beraturan (GLB)', 'Ternyata GLB itu gampang kalau sudah paham konsepnya. Video nya sangat membantu.', 5, '\"[\\\"\\ud83d\\ude0a\\\"]\"', NULL, '2026-07-23 03:43:00', '2026-07-23 03:43:00'),
(13, 17, 'Reflection: Kerajaan Kutai dan Tarumanegara', NULL, 4, '\"[]\"', NULL, '2026-07-23 04:14:00', '2026-07-23 04:14:00'),
(14, 64, 'Reflection: Organisasi Pergerakan Nasional', 'Banyak organisasi pergerakan yang saya baru tahu. Sejarah Indonesia memang penuh perjuangan.', 4, '\"[\\\"\\ud83d\\ude22\\\",\\\"\\ud83d\\ude0a\\\"]\"', NULL, '2026-07-23 04:46:00', '2026-07-23 04:46:00'),
(15, 56, 'Reflection: Hukum Newton tentang Gerak', 'Hukum Newton III tentang aksi-reaksi menarik sekali. Contoh roketnya sangat mudah dipahami.', 3, '\"[\\\"\\ud83d\\ude15\\\"]\"', NULL, '2026-07-23 05:45:00', '2026-07-23 05:45:00'),
(16, 151, 'Reflection: Sejarah Berdirinya Dinasti Abbasiyah', 'Materinya menarik, saya jadi lebih paham tentang sejarah Islam.', 4, '\"[\\\"\\ud83d\\ude0a\\\"]\"', NULL, '2026-07-23 07:42:00', '2026-07-23 07:42:00');

INSERT INTO `reflectables` (`id`, `reflection_id`, `reflectable_type`, `reflectable_id`, `created_at`, `updated_at`) VALUES
(7, 10, 'App\\\\Models\\\\Material', 21, '2026-07-23 02:42:00', '2026-07-23 02:42:00'),
(8, 11, 'App\\\\Models\\\\Material', 25, '2026-07-23 03:10:00', '2026-07-23 03:10:00'),
(9, 12, 'App\\\\Models\\\\Material', 31, '2026-07-23 03:43:00', '2026-07-23 03:43:00'),
(10, 13, 'App\\\\Models\\\\Material', 35, '2026-07-23 04:14:00', '2026-07-23 04:14:00'),
(11, 14, 'App\\\\Models\\\\Material', 37, '2026-07-23 04:46:00', '2026-07-23 04:46:00'),
(12, 15, 'App\\\\Models\\\\Material', 33, '2026-07-23 05:45:00', '2026-07-23 05:45:00'),
(13, 16, 'App\\\\Models\\\\Material', 21, '2026-07-23 07:42:00', '2026-07-23 07:42:00');

-- =====================================================
-- 24. BOOKMARKS
-- =====================================================
INSERT INTO `bookmarks` (`id`, `student_id`, `bookmarkable_id`, `bookmarkable_type`, `created_at`, `updated_at`) VALUES
(6, 28, 22, 'App\\\\Models\\\\Material', '2026-07-23 02:55:00', '2026-07-23 02:55:00'),
(7, 29, 32, 'App\\\\Models\\\\Material', '2026-07-23 03:55:00', '2026-07-23 03:55:00'),
(8, 17, 36, 'App\\\\Models\\\\Material', '2026-07-23 04:27:00', '2026-07-23 04:27:00'),
(9, 42, 26, 'App\\\\Models\\\\Material', '2026-07-23 03:20:00', '2026-07-23 03:20:00'),
(10, 56, 34, 'App\\\\Models\\\\Material', '2026-07-23 06:00:00', '2026-07-23 06:00:00');

-- =====================================================
-- 25. PLANS & PLANABLES
-- =====================================================
INSERT INTO `plans` (`id`, `student_id`, `class_id`, `chapter_id`, `title`, `description`, `target_date`, `progress`, `completed_at`, `created_at`, `updated_at`) VALUES
(11, 28, 4, 6, 'Study: Sejarah Berdirinya Dinasti Abbasiyah', 'Saya ingin memahami sejarah Abbasiyah secara mendalam', '2026-07-30 17:00:00', 1, '2026-07-23 02:55:00', '2026-07-23 02:30:00', '2026-07-23 02:55:00'),
(12, 42, 5, 13, 'Study: Pengantar Persamaan Linear Satu Variabel', 'Target menyelesaikan bab PLSV', '2026-08-01 17:00:00', 0.5, NULL, '2026-07-23 03:00:00', '2026-07-23 03:10:00'),
(13, 29, 9, 16, 'Study: Gerak Lurus Beraturan (GLB)', NULL, '2026-07-28 17:00:00', 1, '2026-07-23 03:55:00', '2026-07-23 03:30:00', '2026-07-23 03:55:00'),
(14, 17, 11, 18, 'Study: Kerajaan Kutai dan Tarumanegara', 'Belajar sejarah kerajaan Hindu-Buddha', '2026-08-05 17:00:00', 0.5, NULL, '2026-07-23 04:00:00', '2026-07-23 04:27:00'),
(15, 64, 11, 19, 'Study: Organisasi Pergerakan Nasional', 'Persiapan ulangan tengah semester', '2026-08-10 17:00:00', 0, NULL, '2026-07-23 04:30:00', '2026-07-23 04:46:00');

INSERT INTO `planables` (`id`, `plan_id`, `planable_type`, `planable_id`, `created_at`, `updated_at`) VALUES
(7, 11, 'App\\\\Models\\\\Material', 21, '2026-07-23 02:30:00', '2026-07-23 02:30:00'),
(8, 12, 'App\\\\Models\\\\Material', 25, '2026-07-23 03:00:00', '2026-07-23 03:00:00'),
(9, 13, 'App\\\\Models\\\\Material', 31, '2026-07-23 03:30:00', '2026-07-23 03:30:00'),
(10, 14, 'App\\\\Models\\\\Material', 35, '2026-07-23 04:00:00', '2026-07-23 04:00:00'),
(11, 15, 'App\\\\Models\\\\Material', 37, '2026-07-23 04:30:00', '2026-07-23 04:30:00');

-- =====================================================
-- 26. TAGS & TAGGABLES
-- =====================================================
INSERT INTO `tags` (`id`, `name`, `slug`, `created_at`, `updated_at`) VALUES
(3, 'aljabar', 'aljabar', '2026-07-23 02:09:00', '2026-07-23 02:09:00'),
(4, 'trigonometri', 'trigonometri', '2026-07-23 02:09:00', '2026-07-23 02:09:00'),
(5, 'fisika', 'fisika', '2026-07-23 02:09:00', '2026-07-23 02:09:00'),
(6, 'sejarah', 'sejarah', '2026-07-23 02:09:00', '2026-07-23 02:09:00'),
(7, 'mekanika', 'mekanika', '2026-07-23 02:09:00', '2026-07-23 02:09:00');

INSERT INTO `taggables` (`id`, `tag_id`, `taggable_id`, `taggable_type`, `created_at`, `updated_at`) VALUES
-- Tag PLSV question with 'aljabar'
(3, 3, 5, 'App\\\\Models\\\\ClassQuestion', '2026-07-23 02:09:00', '2026-07-23 02:09:00'),
-- Tag fungsi question with 'aljabar'
(4, 3, 6, 'App\\\\Models\\\\ClassQuestion', '2026-07-23 02:09:00', '2026-07-23 02:09:00'),
-- Tag gradien question with 'aljabar'
(5, 3, 7, 'App\\\\Models\\\\ClassQuestion', '2026-07-23 02:09:00', '2026-07-23 02:09:00');

-- =====================================================
-- 27. ACTIVITY LOGS for the new data
-- =====================================================
INSERT INTO `activity_logs` (`id`, `actor_id`, `action`, `target_type`, `target_id`, `description`, `created_at`) VALUES
(73, 1, 'subject.teacher_linked', 'Subject', 6, 'Teacher #7', '2026-07-23 02:00:00'),
(74, 1, 'subject.teacher_linked', 'Subject', 6, 'Teacher #10', '2026-07-23 02:00:00'),
(75, 1, 'subject.teacher_linked', 'Subject', 7, 'Teacher #8', '2026-07-23 02:00:00'),
(76, 1, 'subject.teacher_linked', 'Subject', 7, 'Teacher #11', '2026-07-23 02:00:00'),
(77, 1, 'class.cohorts_updated', 'Class', 9, NULL, '2026-07-23 02:06:00'),
(78, 1, 'class.cohorts_updated', 'Class', 10, NULL, '2026-07-23 02:06:00'),
(79, 1, 'class.cohorts_updated', 'Class', 11, NULL, '2026-07-23 02:06:00'),
(80, 1, 'class.cohorts_updated', 'Class', 12, NULL, '2026-07-23 02:06:00');

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;
