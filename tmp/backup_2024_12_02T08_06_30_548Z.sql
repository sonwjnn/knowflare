-- MySQL dump
-- Server version: 10.4.32-MariaDB
-- Date: 2024-12-02T08:06:30.507Z

SET FOREIGN_KEY_CHECKS=0;
SET UNIQUE_CHECKS=0;
SET sql_mode='NO_AUTO_VALUE_ON_ZERO';

--
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;
CREATE TABLE `account` (
  `userId` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `provider` varchar(255) NOT NULL,
  `providerAccountId` varchar(255) NOT NULL,
  `refresh_token` varchar(255) DEFAULT NULL,
  `access_token` varchar(255) DEFAULT NULL,
  `expires_at` int(11) DEFAULT NULL,
  `token_type` varchar(255) DEFAULT NULL,
  `scope` varchar(255) DEFAULT NULL,
  `id_token` varchar(2048) DEFAULT NULL,
  `session_state` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`provider`,`providerAccountId`),
  KEY `account_userId_user_id_fk` (`userId`),
  CONSTRAINT `account_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `attachment`
--

DROP TABLE IF EXISTS `attachment`;
CREATE TABLE `attachment` (
  `id` varchar(255) NOT NULL,
  `course_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `attachment_course_id_course_id_fk` (`course_id`),
  CONSTRAINT `attachment_course_id_course_id_fk` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `authenticator`
--

DROP TABLE IF EXISTS `authenticator`;
CREATE TABLE `authenticator` (
  `credentialID` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `providerAccountId` varchar(255) NOT NULL,
  `credentialPublicKey` varchar(255) NOT NULL,
  `counter` int(11) NOT NULL,
  `credentialDeviceType` varchar(255) NOT NULL,
  `credentialBackedUp` tinyint(1) NOT NULL,
  `transports` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`userId`,`credentialID`),
  UNIQUE KEY `authenticator_credentialID_unique` (`credentialID`),
  CONSTRAINT `authenticator_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
CREATE TABLE `cart` (
  `user_id` varchar(255) NOT NULL,
  `course_id` varchar(255) NOT NULL,
  `coupon_id` varchar(255) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`user_id`,`course_id`),
  KEY `cart_course_id_course_id_fk` (`course_id`),
  KEY `cart_coupon_id_coupon_id_fk` (`coupon_id`),
  CONSTRAINT `cart_coupon_id_coupon_id_fk` FOREIGN KEY (`coupon_id`) REFERENCES `coupon` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION,
  CONSTRAINT `cart_course_id_course_id_fk` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `cart_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` VALUES
('10b9fbbb-3be0-43db-96d6-54ffc1783e4f','English'),
('50b1b9b5-11bf-42de-8491-d155cfa92f6f','Health'),
('553d50fd-b62e-45a8-991c-291193db9a55','Teaching & Academics'),
('57bd49c9-1dc9-4652-8d99-f58862633ea8','Sales & Marketing'),
('62921f47-1c6e-46c3-9edd-040c6f0491a0','Personal Development'),
('7c423643-fc39-411c-8ee7-af1dfb0c5947','Language'),
('acfb30a8-397f-494d-8967-bd4ba9db1036','Engineering & Construction'),
('b8f47299-65a9-4e05-9b03-3e534bd6fd06','Business'),
('e9ca440a-afea-4eeb-b26e-15bb9b9d5773','IT'),
('ed012e88-b4e6-4ec6-8fd1-564011a13822','Management');

--
-- Table structure for table `chapter`
--

DROP TABLE IF EXISTS `chapter`;
CREATE TABLE `chapter` (
  `id` varchar(255) NOT NULL,
  `course_id` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `position` int(11) NOT NULL,
  `is_published` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `chapter_course_id_course_id_fk` (`course_id`),
  CONSTRAINT `chapter_course_id_course_id_fk` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chapter`
--

INSERT INTO `chapter` VALUES
('0648ce0f-ffd8-40a5-9655-e0e999aefe87','e10868d0-ba35-4cb9-a63d-d75af159368a','Building a Complete Application','Fetching and revalidating data with Next.js 13.',6,1),
('083cbaf5-8c28-4f8e-97d8-d0891f07f9d6','fdd95b16-e80d-40c5-a25f-972dbc317340','Advanced Routing and Data Fetching','Dive deeper into advanced routing techniques like parallel routes, conditional routes, and route interception.',4,1),
('0cb989bf-3459-4676-8e45-dee18ac1adbf','ed5e4b00-54e0-4c8e-8c0f-edea05cbf72e','Advanced State Management','Advanced State Management',5,1),
('10dac819-f95e-4d2e-898c-b06c8648d635','ed5e4b00-54e0-4c8e-8c0f-edea05cbf72e','Understanding Props in React ','Understanding Props in React ',2,1),
('175a1aa7-63b4-42a6-92b6-d12b80a29de5','ed5e4b00-54e0-4c8e-8c0f-edea05cbf72e','Introduction to React with TypeScript','Introduction to React with TypeScript',1,1),
('37a14003-1dec-4c56-95d1-1cd9e89d7b86','ed5e4b00-54e0-4c8e-8c0f-edea05cbf72e','Advanced Props Techniques','Advanced Props Techniques',8,1),
('46026336-bfb9-460b-b2dd-699e492486ae','e10868d0-ba35-4cb9-a63d-d75af159368a','Introduction','Overview of Next.js 13 and its new features.',1,1),
('49e0975d-f71b-4073-acbe-a84e2960cd98','ed5e4b00-54e0-4c8e-8c0f-edea05cbf72e','Managing State in React','Managing State in React',4,1),
('7cde72ae-bb18-43cb-915a-6e5818d60572','e10868d0-ba35-4cb9-a63d-d75af159368a','Routing and Navigation','Understanding server-side rendering and server components in Next.js 13.',2,1),
('8d198c78-acc4-408a-943f-e91aff22c798','e10868d0-ba35-4cb9-a63d-d75af159368a','Styling, Data Fetching, and Rendering','How to set up pages and routes in Next.js 13.',3,1),
('a0671544-1350-42e3-8164-2ee2c93c0013','fdd95b16-e80d-40c5-a25f-972dbc317340','Introduction & Fundamentals','Learn the basics of Next.js 14 and set up your first project.',1,1),
('a14a908f-4f88-4d69-a65c-697d4bbc167f','ed5e4b00-54e0-4c8e-8c0f-edea05cbf72e','TypeScript Utility Types and Polymorphism','TypeScript Utility Types and Polymorphism',9,1),
('b07e93a1-a346-4d73-a617-b4d4faaf2878','fdd95b16-e80d-40c5-a25f-972dbc317340','Rendering and Server Components','Learn how to handle HTTP requests with route handlers and implement various HTTP methods.',5,1),
('c3e7c1d3-8efe-446c-a781-4458011c8777','e10868d0-ba35-4cb9-a63d-d75af159368a','Interactive UI and Loading States','Applying styles, fonts, and managing images in Next.js 13.',5,1),
('cd006075-cb3d-43ba-b8b5-8b7e951f0fa5','e10868d0-ba35-4cb9-a63d-d75af159368a','Dynamic Routes, Static Rendering, and Error Handling','Building layouts and linking pages together in Next.js 13.',4,1),
('d38cc45c-64aa-4c81-b114-89384730d68d','ed5e4b00-54e0-4c8e-8c0f-edea05cbf72e','Context API in React','Context API in React',6,1),
('dcda7789-d9fa-4684-98c0-ed4c26a13d22','fdd95b16-e80d-40c5-a25f-972dbc317340','Routing and Navigation','Explore the powerful routing features of Next.js, including dynamic routes and nested navigation.',2,1),
('e6871d3f-43d6-412f-b382-f025196a3f32','fdd95b16-e80d-40c5-a25f-972dbc317340','Next.js 15','Explore different rendering strategies like Client-side, Server-side, and Static rendering.',7,1),
('e6b86cca-9f6a-40fb-a48e-44aa146a5ede','fdd95b16-e80d-40c5-a25f-972dbc317340','Data Fetching and Caching','Understand how middleware can enhance your Next.js applications.',6,1),
('ea092c70-db72-4c5e-a9e6-9083cb73ef44','ed5e4b00-54e0-4c8e-8c0f-edea05cbf72e','Ref and Class Components','Ref and Class Components',7,1),
('ea164ea5-6d96-4f2d-94bf-8a86ddb3de1c','ed5e4b00-54e0-4c8e-8c0f-edea05cbf72e','Conclusion','Conclusion',10,1),
('f8d6c3b5-d123-40f1-9bae-d63a63f1b228','fdd95b16-e80d-40c5-a25f-972dbc317340','Error Handling and User Interface','Build reusable templates, handle loading states gracefully, and implement robust error handling.',3,1),
('fe8fad48-c239-473e-aa50-3dc09ab2e621','ed5e4b00-54e0-4c8e-8c0f-edea05cbf72e','Handling Events and Styles','Handling Events and Styles',3,1);

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
  `id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `course_id` varchar(255) NOT NULL,
  `content` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `comment_user_id_user_id_fk` (`user_id`),
  KEY `comment_course_id_course_id_fk` (`course_id`),
  CONSTRAINT `comment_course_id_course_id_fk` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `comment_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `coupon`
--

DROP TABLE IF EXISTS `coupon`;
CREATE TABLE `coupon` (
  `id` varchar(255) NOT NULL,
  `category_id` varchar(255) DEFAULT NULL,
  `code` varchar(255) NOT NULL,
  `discount_amount` int(11) NOT NULL,
  `expires` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `type` enum('private','public') NOT NULL DEFAULT 'public',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `coupon_code_unique` (`code`),
  KEY `coupon_category_id_category_id_fk` (`category_id`),
  CONSTRAINT `coupon_category_id_category_id_fk` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
CREATE TABLE `course` (
  `id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `category_id` varchar(255) DEFAULT NULL,
  `level` enum('beginner','intermediate','advanced','all level') NOT NULL DEFAULT 'all level',
  `title` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `price` int(11) NOT NULL DEFAULT 0,
  `avg_rating` float NOT NULL DEFAULT 0,
  `is_published` tinyint(1) NOT NULL DEFAULT 0,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `course_user_id_user_id_fk` (`user_id`),
  KEY `course_category_id_category_id_fk` (`category_id`),
  CONSTRAINT `course_category_id_category_id_fk` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION,
  CONSTRAINT `course_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `course`
--

INSERT INTO `course` VALUES
('0ce861be-2a84-4045-84f4-27f68ac291ea','46d13d88-9a5f-43b8-b379-8de4178d3320','e9ca440a-afea-4eeb-b26e-15bb9b9d5773','all level','Flutter Crash Course',NULL,'https://i.ytimg.com/vi/j_rCDc_X-k8/hqdefault.jpg?sqp=-oaymwEXCOADEI4CSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLDq5ApclBMJkKX-BiiqP2mxkNDnXA',8,0,1,'2024-12-02 00:29:18'),
('0e51fad8-15a9-46b9-8bf2-4be7cd149351','46d13d88-9a5f-43b8-b379-8de4178d3320','50b1b9b5-11bf-42de-8491-d155cfa92f6f','advanced','ULTIMATE HEALTH PLAYLIST! Fitness, Nutrition, Mental Health',NULL,'https://i.ytimg.com/vi/i7Xlvd4J_G8/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLBVPEklfwSqWDC6SOxLWstSt0f_Cw',150,0,1,'2024-12-02 00:29:18'),
('0f90e57d-4404-407c-ac76-25f8f5e4b07c','46d13d88-9a5f-43b8-b379-8de4178d3320','7c423643-fc39-411c-8ee7-af1dfb0c5947','advanced','Common French Verbs',NULL,'https://i.ytimg.com/vi/sA82J16mNfU/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLC4XYlhIkyMle-AiIbkUSTzYczjpQ',80,0,1,'2024-12-02 00:29:18'),
('12070b91-e0ba-40bf-819e-ee8eeadc83df','46d13d88-9a5f-43b8-b379-8de4178d3320','ed012e88-b4e6-4ec6-8fd1-564011a13822','advanced','Google Project Management Certificate',NULL,'https://i.ytimg.com/vi/rck3MnC7OXA/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLAo7_uGHHIfMR3VuBFovWKhuZ1GyQ',100,0,1,'2024-12-02 00:29:18'),
('1225d7ee-c976-4a92-8017-6054ec6faa93','46d13d88-9a5f-43b8-b379-8de4178d3320','e9ca440a-afea-4eeb-b26e-15bb9b9d5773','all level','Supabase Crash Course',NULL,'https://i.ytimg.com/vi/ydz7Dj5QHKY/hqdefault.jpg?sqp=-oaymwEXCOADEI4CSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCHLnBB3sNcs0tEcFZt9BOXOJLK6Q',2,0,1,'2024-12-02 00:29:18'),
('127d976c-8753-4cd3-9456-24a2a46b3095','46d13d88-9a5f-43b8-b379-8de4178d3320','10b9fbbb-3be0-43db-96d6-54ffc1783e4f','beginner','English Course - Beginner 2',NULL,'https://i.ytimg.com/vi/qKdtyu5NTPA/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLBMa5XfWCX0bRBrLlb3PdecJ3g8GQ',12,0,1,'2024-12-02 00:29:18'),
('12f1c8c7-b230-4824-8e94-715b5f902003','46d13d88-9a5f-43b8-b379-8de4178d3320','acfb30a8-397f-494d-8967-bd4ba9db1036','beginner','Civil Engineering: Crash Course Engineering',NULL,'https://i.ytimg.com/vi/-xbtnz4wdaA/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBs2zY69ptEXO8uibzdcepjCDxKiw',40,0,1,'2024-12-02 00:29:18'),
('1494a970-6882-4409-95d3-5266602fd42e','46d13d88-9a5f-43b8-b379-8de4178d3320','e9ca440a-afea-4eeb-b26e-15bb9b9d5773','intermediate','Node.js Tutorial',NULL,'https://i.ytimg.com/vi/LAUi8pPlcUM/hqdefault.jpg?sqp=-oaymwEXCOADEI4CSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLANsMIsCM_ymftUEiye-G0nswiaWQ',2,0,1,'2024-12-02 00:29:18'),
('14a5e150-f151-462a-9c6c-5339356096c2','46d13d88-9a5f-43b8-b379-8de4178d3320','62921f47-1c6e-46c3-9edd-040c6f0491a0','beginner','Personality Development',NULL,'https://i.ytimg.com/vi/v2euEwGnas8/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLB5jk26z8IsP8YO3B1PfPB4J4fJDA',100,0,1,'2024-12-02 00:29:18'),
('1b47dbe9-f285-4484-b52a-39e531e2cfd8','46d13d88-9a5f-43b8-b379-8de4178d3320','10b9fbbb-3be0-43db-96d6-54ffc1783e4f','beginner','How to Learn English On Your Own',NULL,'https://i.ytimg.com/vi/tLULIzOj-Ew/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDuwlTQ7jLKqTc-tV5xM1kw2pRiHA',10,0,1,'2024-12-02 00:29:18'),
('2228070d-34fc-41aa-ac54-1cecc9f04eae','46d13d88-9a5f-43b8-b379-8de4178d3320','7c423643-fc39-411c-8ee7-af1dfb0c5947','advanced','Learn the Most Common Chinese Characters 301-600',NULL,'https://i.ytimg.com/vi/-eGQ5RyKGZE/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLBlpes8MB8VayVqAFCDyNZZgtdsFQ',70,0,1,'2024-12-02 00:29:18'),
('29c657eb-cc85-44fc-a4b2-9e57fe19f110','46d13d88-9a5f-43b8-b379-8de4178d3320','e9ca440a-afea-4eeb-b26e-15bb9b9d5773','intermediate','Dart Crash Course',NULL,'https://i.ytimg.com/vi/QGqMJzywasg/hqdefault.jpg?sqp=-oaymwEXCOADEI4CSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLC-nbnCl8HBwMp6hzy0jqAvp-M-Dw',7,0,1,'2024-12-02 00:29:18'),
('31fe5e1c-9414-4e8f-aba2-dcfdec231d9b','46d13d88-9a5f-43b8-b379-8de4178d3320','50b1b9b5-11bf-42de-8491-d155cfa92f6f','advanced','The Ultimate Health and Fitness Playlist',NULL,'https://i.ytimg.com/vi/jrVd4-PpUuY/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLBYWjVQkHN-HAIpaP3ySID-5XbBdw',90,0,1,'2024-12-02 00:29:18'),
('329a2391-9a97-41bd-b45f-593a34e16d2d','46d13d88-9a5f-43b8-b379-8de4178d3320','b8f47299-65a9-4e05-9b03-3e534bd6fd06','advanced','Business Strategy A-Z Course ',NULL,'https://i.ytimg.com/vi/bLvNaSTcX9o/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCXJIXAngEUSaiLvvdojxudVaif6A',130,0,1,'2024-12-02 00:29:18'),
('34cdbbae-947e-4803-85a7-1b4be6fa6eb7','46d13d88-9a5f-43b8-b379-8de4178d3320','50b1b9b5-11bf-42de-8491-d155cfa92f6f','advanced','GENERAL HEALTH',NULL,'https://i.ytimg.com/vi/wZU_3xFdPS4/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCGJk6fsAHoytJA1rTRcLNQ41izaw',80,0,1,'2024-12-02 00:29:18'),
('35209ac8-ca03-4453-8a2a-fd7d858a4ef5','46d13d88-9a5f-43b8-b379-8de4178d3320','ed012e88-b4e6-4ec6-8fd1-564011a13822','advanced','IRDAI Grade A exam preparation Management Complete Syllabus',NULL,'https://i.ytimg.com/vi/K1GlTGZOBeM/hqdefault.jpg?sqp=-oaymwExCNACELwBSFryq4qpAyMIARUAAIhCGAHwAQH4Af4JgALQBYoCDAgAEAEYNyBMKH8wDw==&rs=AOn4CLD77FfnQyrTFun-hajg0dEUnCo28A',110,0,1,'2024-12-02 00:29:18'),
('35ab7285-388b-4a5f-a95d-578dd4b212f2','46d13d88-9a5f-43b8-b379-8de4178d3320','7c423643-fc39-411c-8ee7-af1dfb0c5947','advanced','English Grammar Lessons',NULL,'https://i.ytimg.com/vi/jul2urONzOQ/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCI---XL9pvMdpKsaKGj7Up49q_Cg',150,0,1,'2024-12-02 00:29:18'),
('35c81d46-e10e-4627-899f-661a45291a17','46d13d88-9a5f-43b8-b379-8de4178d3320','ed012e88-b4e6-4ec6-8fd1-564011a13822','advanced','Management Principles and Practices',NULL,'https://i.ytimg.com/vi/K1GlTGZOBeM/hqdefault.jpg?sqp=-oaymwExCNACELwBSFryq4qpAyMIARUAAIhCGAHwAQH4Af4JgALQBYoCDAgAEAEYNyBMKH8wDw==&rs=AOn4CLD77FfnQyrTFun-hajg0dEUnCo28A',50,0,1,'2024-12-02 00:29:18'),
('388053f5-d621-4cd0-ad99-adc01b6694f4','46d13d88-9a5f-43b8-b379-8de4178d3320','7c423643-fc39-411c-8ee7-af1dfb0c5947','advanced','Learn Basic Spanish Vocabulary',NULL,'https://i.ytimg.com/vi/KrRsGsOt-EM/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLAlwmiX5njIwpzIlfTk_pljMn6wCQ',80,0,1,'2024-12-02 00:29:18'),
('3ef11ca0-d848-4c74-a5b9-1125f1887841','46d13d88-9a5f-43b8-b379-8de4178d3320','57bd49c9-1dc9-4652-8d99-f58862633ea8','beginner','How to Perfect Your Sales Process and Increase Sales FAST!',NULL,'https://i.ytimg.com/vi/3eM4psQQiQ4/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLC5o-AbyG_THfcDA5oJSIV-5he2hQ',130,0,1,'2024-12-02 00:29:18'),
('4254cc6f-019e-4522-89f7-49ea5856d53a','46d13d88-9a5f-43b8-b379-8de4178d3320','e9ca440a-afea-4eeb-b26e-15bb9b9d5773','advanced','Complete Django Tutorial',NULL,'https://i.ytimg.com/vi/ZpKl3U-arN8/hqdefault.jpg?sqp=-oaymwEXCOADEI4CSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLDgFtN7AcQlhKitpAVCNLlBA4mw5Q',3,0,1,'2024-12-02 00:29:18'),
('4d2d3879-5ec4-4aa5-9413-d66b44844f91','46d13d88-9a5f-43b8-b379-8de4178d3320','b8f47299-65a9-4e05-9b03-3e534bd6fd06','advanced','Business Analyst Tutorials',NULL,'https://i.ytimg.com/vi/pDpXn5bgMDM/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLA-doeCBVdHHDFkxNjEB4GLsAgGAw',80,0,1,'2024-12-02 00:29:18'),
('4dbc1151-6377-4ed8-918a-a6574c59e018','46d13d88-9a5f-43b8-b379-8de4178d3320','b8f47299-65a9-4e05-9b03-3e534bd6fd06','advanced','Business And Management',NULL,'https://i.ytimg.com/vi/NjOa6l4GFJA/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLBDgyIZpsMPkkv6THW1pJcYMZT_ug',150,0,1,'2024-12-02 00:29:18'),
('4f4384e1-4076-4270-9fdb-9335e5a4b2f2','46d13d88-9a5f-43b8-b379-8de4178d3320','e9ca440a-afea-4eeb-b26e-15bb9b9d5773','all level','Nuxt 3 Tutorial',NULL,'https://i.ytimg.com/vi/GBdO5myZNsQ/hqdefault.jpg?sqp=-oaymwEXCOADEI4CSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLANM0Pw2FckfcEDwrPRrp2aEuPIzA',3,0,1,'2024-12-02 00:29:18'),
('4feba467-95dc-419a-8590-2058cdce4ff9','46d13d88-9a5f-43b8-b379-8de4178d3320','e9ca440a-afea-4eeb-b26e-15bb9b9d5773','advanced','Angular Tutorial For Beginners',NULL,'https://i.ytimg.com/vi/0eWrpsCLMJQ/hqdefault.jpg?sqp=-oaymwEXCOADEI4CSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLB_bQXTa4Q4KUl1rT8LngUlHBQoow',2,0,1,'2024-12-02 00:29:18'),
('51f51d8e-3191-4602-a176-4c092529d1bb','46d13d88-9a5f-43b8-b379-8de4178d3320','e9ca440a-afea-4eeb-b26e-15bb9b9d5773','advanced','Typescript for beginners',NULL,'https://i.ytimg.com/vi/_yfpSc6ubLE/hqdefault.jpg?sqp=-oaymwEXCOADEI4CSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCllipkhH2f54dDW6QOv8vAl5YBow',2,0,1,'2024-12-02 00:29:18'),
('58a95f77-9c65-4c4c-a9ee-57979db33459','46d13d88-9a5f-43b8-b379-8de4178d3320','62921f47-1c6e-46c3-9edd-040c6f0491a0','beginner','Best Personal Development Course',NULL,'https://i.ytimg.com/vi/d479F8VuaJA/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLBP8pUnUtG-OWALRkpz3y5cVjC49w',50,0,1,'2024-12-02 00:29:18'),
('5fa5f08c-2655-4c65-9b36-0bf88f2c716c','46d13d88-9a5f-43b8-b379-8de4178d3320','50b1b9b5-11bf-42de-8491-d155cfa92f6f','advanced','Most Popular Health Videos',NULL,'https://i.ytimg.com/vi/F7gDIshc-S0/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLBEcOkVlMH6PIOB4Vu2B47ksxW4YA',80,0,1,'2024-12-02 00:29:18'),
('60679795-ebe6-4494-9067-599680faba84','46d13d88-9a5f-43b8-b379-8de4178d3320','10b9fbbb-3be0-43db-96d6-54ffc1783e4f','beginner','Beginner English Introduction',NULL,'https://i.ytimg.com/vi/CbPy_CjJR90/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLBuQAP2pv46R-eBU12G0Db60ONvaw',20,0,1,'2024-12-02 00:29:18'),
('62dad452-4a2f-4752-afa2-666cf8768c36','46d13d88-9a5f-43b8-b379-8de4178d3320','b8f47299-65a9-4e05-9b03-3e534bd6fd06','advanced','Business Analyst Training Videos',NULL,'https://i.ytimg.com/vi/f9DzS6NdgwU/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLDcC35c-Al-sTxzVdrwYJlptbLv1w',100,0,1,'2024-12-02 00:29:18'),
('68d8ee30-f5f7-4e06-b448-095b03e43df6','46d13d88-9a5f-43b8-b379-8de4178d3320','7c423643-fc39-411c-8ee7-af1dfb0c5947','advanced','Basic French Vocabulary',NULL,'https://i.ytimg.com/vi/dPRBkFpl6IA/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLBy05w8hhxVkS8HNC_hx0aEc7LOew',120,0,1,'2024-12-02 00:29:18'),
('6a3f7569-1f35-4028-80e6-d51bd4e08b72','46d13d88-9a5f-43b8-b379-8de4178d3320','b8f47299-65a9-4e05-9b03-3e534bd6fd06','advanced','Start an Online Business',NULL,'https://i.ytimg.com/vi/JT00xhBosjY/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLDAm3s4CIUL4S894-rFG_GYOdRnhg',70,0,1,'2024-12-02 00:29:18'),
('6c8478c3-b066-4746-a1b3-9155d4f6d5b3','46d13d88-9a5f-43b8-b379-8de4178d3320','e9ca440a-afea-4eeb-b26e-15bb9b9d5773','intermediate','JavaScript Algorithms',NULL,'https://i.ytimg.com/vi/coqQwbDezUA/hqdefault.jpg?sqp=-oaymwEXCOADEI4CSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLACUdflCaZWmlVFOrQrMmsX5zxpJA',4,0,1,'2024-12-02 00:29:18'),
('6d4594ec-470f-4ea6-9848-863290082ddc','46d13d88-9a5f-43b8-b379-8de4178d3320','ed012e88-b4e6-4ec6-8fd1-564011a13822','advanced','Operations Management Full Course',NULL,'https://i.ytimg.com/vi/Kt3wUDiUYvw/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLBD3UFeKvbocnUBJsIOfFNKfakBzg',100,0,1,'2024-12-02 00:29:18'),
('6e4d536b-8b76-40b7-a40c-717576bbba58','46d13d88-9a5f-43b8-b379-8de4178d3320','57bd49c9-1dc9-4652-8d99-f58862633ea8','beginner','10 Steps That’ll Turn You Into A Sales Machine',NULL,'https://i.ytimg.com/vi/amdXa3CfzHw/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBpNw7-ozILLWIYandkJC19OTHF5g',70,0,1,'2024-12-02 00:29:18'),
('702eba0a-560e-42b3-8b41-fafed3147138','46d13d88-9a5f-43b8-b379-8de4178d3320','ed012e88-b4e6-4ec6-8fd1-564011a13822','advanced','Delhi University Bcom (Hons) Sem 1 MPP ',NULL,'https://i.ytimg.com/vi/K1GlTGZOBeM/hqdefault.jpg?sqp=-oaymwExCNACELwBSFryq4qpAyMIARUAAIhCGAHwAQH4Af4JgALQBYoCDAgAEAEYNyBMKH8wDw==&rs=AOn4CLD77FfnQyrTFun-hajg0dEUnCo28A',90,0,1,'2024-12-02 00:29:18'),
('74019faf-a18e-4b7b-88bb-13fc15576278','46d13d88-9a5f-43b8-b379-8de4178d3320','e9ca440a-afea-4eeb-b26e-15bb9b9d5773','advanced','Go tutorial (Golang) for Beginners',NULL,'https://i.ytimg.com/vi/etSN4X_fCnM/hqdefault.jpg?sqp=-oaymwEXCOADEI4CSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCrticKKYhWCPH_Ul31OkB8E4fBgw',2,0,1,'2024-12-02 00:29:18'),
('77b73a7b-93f9-42cc-9d40-337fb95e12bd','46d13d88-9a5f-43b8-b379-8de4178d3320','e9ca440a-afea-4eeb-b26e-15bb9b9d5773','intermediate','GraphQL Crash Course',NULL,'https://i.ytimg.com/vi/xMCnDesBggM/hqdefault.jpg?sqp=-oaymwEXCOADEI4CSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLDuXOGMuMKAHRjt5SvYVaS6JnLX2w',4,0,1,'2024-12-02 00:29:18'),
('7bb1d7c7-554b-4e6f-97d2-a5f96cc307ae','46d13d88-9a5f-43b8-b379-8de4178d3320','e9ca440a-afea-4eeb-b26e-15bb9b9d5773','intermediate','Stripe Tutorial (with React & GraphQL)',NULL,'https://i.ytimg.com/vi/4Ntd414raYc/hqdefault.jpg?sqp=-oaymwEXCOADEI4CSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLB6DHRMuO2yNzbk1HrIrm6bEhuw7Q',8,0,1,'2024-12-02 00:29:18'),
('7ce143fc-80df-4978-8e22-e5fa1d461343','46d13d88-9a5f-43b8-b379-8de4178d3320','b8f47299-65a9-4e05-9b03-3e534bd6fd06','advanced','Business Entrepreneurship',NULL,'https://i.ytimg.com/vi/YHBVjv4MYXE/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLC08Pb3Ya1KTZdGa6Wjo_9n42iuXA',120,0,1,'2024-12-02 00:29:18'),
('7e22bc8b-6c02-4575-ba4d-313575bc5251','46d13d88-9a5f-43b8-b379-8de4178d3320','ed012e88-b4e6-4ec6-8fd1-564011a13822','advanced','Principles of Management',NULL,'https://i.ytimg.com/vi/nz0uEZbnrzs/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLDpBTe5zf4JrgyAyMyYQGoOdpNysw',50,0,1,'2024-12-02 00:29:18'),
('807a4f4f-c437-4fd4-8474-008715945668','46d13d88-9a5f-43b8-b379-8de4178d3320','b8f47299-65a9-4e05-9b03-3e534bd6fd06','advanced','Small Business Marketing 101 Course',NULL,'https://i.ytimg.com/vi/IIE-bbp2Ios/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLBnYE0y4YyF9ZYXsdbwLFIKv5HVtA',120,0,1,'2024-12-02 00:29:18'),
('82b4108a-7153-4a39-aed7-7caae21040e0','46d13d88-9a5f-43b8-b379-8de4178d3320','ed012e88-b4e6-4ec6-8fd1-564011a13822','advanced','MBA Lectures - Principles of Marketing',NULL,'https://i.ytimg.com/vi/6jobOJy96jM/hqdefault.jpg?sqp=-oaymwExCNACELwBSFryq4qpAyMIARUAAIhCGAHwAQH4AdQGgALgA4oCDAgAEAEYZSBlKGUwDw==&rs=AOn4CLDvgCdvPecU1BEoCtDEMihEpCYe9g',120,0,1,'2024-12-02 00:29:18'),
('87798260-1a99-4e9a-93e9-139a28877d9c','46d13d88-9a5f-43b8-b379-8de4178d3320','b8f47299-65a9-4e05-9b03-3e534bd6fd06','advanced','Master of Business Administration',NULL,'https://i.ytimg.com/vi/EVkg38OOtZs/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLADWTr_xOXywKvWpjA1U47YTN18SQ',90,0,1,'2024-12-02 00:29:18'),
('91d7944c-999d-4503-b96d-703f2d2877a4','46d13d88-9a5f-43b8-b379-8de4178d3320','7c423643-fc39-411c-8ee7-af1dfb0c5947','advanced','Learn spanish - Learn With Video',NULL,'https://i.ytimg.com/vi/T8_4KHuMm00/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLDNB-Dnf8IfExsyvANtOJw0XDPtDg',50,0,1,'2024-12-02 00:29:18'),
('996c8190-2564-489c-a4c0-5e625cfa7ff3','46d13d88-9a5f-43b8-b379-8de4178d3320','e9ca440a-afea-4eeb-b26e-15bb9b9d5773','all level','Javascript Data Structures',NULL,'https://i.ytimg.com/vi/_yfpSc6ubLE/hqdefault.jpg?sqp=-oaymwEXCOADEI4CSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCllipkhH2f54dDW6QOv8vAl5YBow',3,0,1,'2024-12-02 00:29:18'),
('99b768e5-f8d4-4bdd-be96-0a73680e21ec','46d13d88-9a5f-43b8-b379-8de4178d3320','50b1b9b5-11bf-42de-8491-d155cfa92f6f','advanced','Gentle Strength Training (Level 1)',NULL,'https://i.ytimg.com/vi/_0vtnVMd26E/hqdefault.jpg?sqp=-oaymwEpCNACELwBSFryq4qpAxsIARUAAIhCGAHYAQHiAQwIHBACGAYgATgBQAE=&rs=AOn4CLCWPKmlOiQTRKJFua2ZGd7z8fxs4Q',50,0,1,'2024-12-02 00:29:18'),
('9c407851-bcde-461d-91c3-2800c5aa56a2','46d13d88-9a5f-43b8-b379-8de4178d3320','ed012e88-b4e6-4ec6-8fd1-564011a13822','advanced','Financial Management',NULL,'https://i.ytimg.com/vi/wkXP8_MWcbQ/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLAalwVvZLjAZ1tvic7_onTv7Tp4fQ',50,0,1,'2024-12-02 00:29:18'),
('9c9d3b1c-1ca2-4a0b-933b-5a5f68790f5e','46d13d88-9a5f-43b8-b379-8de4178d3320','7c423643-fc39-411c-8ee7-af1dfb0c5947','advanced','Learn the Most Common Chinese Characters 1 - 300',NULL,'https://i.ytimg.com/vi/pCqnrMlyBIY/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLBHyURhY-YbCmP72ENskmVu1XepzQ',90,0,1,'2024-12-02 00:29:18'),
('a3e63a10-f58e-47bb-bc54-37925e963f87','46d13d88-9a5f-43b8-b379-8de4178d3320','e9ca440a-afea-4eeb-b26e-15bb9b9d5773','advanced','React Testing Tutorial',NULL,'https://i.ytimg.com/vi/T2sv8jXoP4s/hqdefault.jpg?sqp=-oaymwEXCOADEI4CSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCxlABk6e17HXjqN2-sZ3bLqh4uqQ',1,0,1,'2024-12-02 00:29:18'),
('a92927a1-6c3f-41b2-91b5-0ad0cba53e1b','46d13d88-9a5f-43b8-b379-8de4178d3320','b8f47299-65a9-4e05-9b03-3e534bd6fd06','advanced','How to Write a Business Plan Full Course',NULL,'https://i.ytimg.com/vi/u76jqbqgbmc/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLB1ddSXckzwpAeFp_2Oxer9loLQcw',80,0,1,'2024-12-02 00:29:18'),
('aa765b0d-8d90-45c3-a5f9-027c59bd74e8','46d13d88-9a5f-43b8-b379-8de4178d3320','7c423643-fc39-411c-8ee7-af1dfb0c5947','advanced','Innovative Language',NULL,'https://i.ytimg.com/vi/bex2D4yX6cA/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLBQpZZgI49uUmm9CFgXn2hoyk-SZg',120,0,1,'2024-12-02 00:29:18'),
('acb266d2-7455-4bc0-810c-ff6c088acdb4','46d13d88-9a5f-43b8-b379-8de4178d3320','e9ca440a-afea-4eeb-b26e-15bb9b9d5773','intermediate','Node.js Auth Tutorial (JWT)',NULL,'https://i.ytimg.com/vi/SnoAwLP1a-0/hqdefault.jpg?sqp=-oaymwEXCOADEI4CSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLADRYbjQYppGEy4yvfNnEahhe7IUw',3,0,1,'2024-12-02 00:29:18'),
('afb81d6d-cccd-4540-b994-7c5d4d28f166','46d13d88-9a5f-43b8-b379-8de4178d3320','ed012e88-b4e6-4ec6-8fd1-564011a13822','advanced','Principles of Management',NULL,'https://i.ytimg.com/vi/JH4srpPMgAc/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLAoTUBpnQiwpIzKyvJmt4l7KUY2oQ',70,0,1,'2024-12-02 00:29:18'),
('b057f09a-3d98-4c2f-ba57-aec91871d04b','46d13d88-9a5f-43b8-b379-8de4178d3320','e9ca440a-afea-4eeb-b26e-15bb9b9d5773','advanced','Docker Crash Course Tutorial',NULL,'https://i.ytimg.com/vi/31ieHmcTUOk/hqdefault.jpg?sqp=-oaymwEXCOADEI4CSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCVasS1zV1njrPhehcto-5tTMMK7g',2,0,1,'2024-12-02 00:29:18'),
('b1ab7205-e53a-4c2a-a556-1a2f9f7c1e17','46d13d88-9a5f-43b8-b379-8de4178d3320','b8f47299-65a9-4e05-9b03-3e534bd6fd06','advanced','Business Management Course 101',NULL,'https://i.ytimg.com/vi/T3l51Psce3c/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCW0nkF-xEeJJqu5vTOa0uCL2q2_w',50,0,1,'2024-12-02 00:29:18'),
('b3f65691-70f1-450a-bd64-9dfed035f7f7','46d13d88-9a5f-43b8-b379-8de4178d3320','b8f47299-65a9-4e05-9b03-3e534bd6fd06','advanced','Small Business Education for Beginners',NULL,'https://i.ytimg.com/vi/ydau_q9OJVA/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCd-43vrbGHY3bRfYgbbzvNIBWumw',100,0,1,'2024-12-02 00:29:18'),
('b6ae734d-5a87-4d73-8962-da3a4b3d0b0f','46d13d88-9a5f-43b8-b379-8de4178d3320','7c423643-fc39-411c-8ee7-af1dfb0c5947','advanced','English Vocabulary Lessons',NULL,'https://i.ytimg.com/vi/hoyhPZDp3dE/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLBPkKZ7L61RAUcPo31sTl-XhK90VA',100,0,1,'2024-12-02 00:29:18'),
('b7ca4119-7e57-402a-b078-3952de6aea05','46d13d88-9a5f-43b8-b379-8de4178d3320','10b9fbbb-3be0-43db-96d6-54ffc1783e4f','beginner','English for Beginners: Learn English Online',NULL,'https://i.ytimg.com/vi/xTLK0iHLxFs/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLBmkunaAoS4hTH5YJx8qpk0SICQ1w',22,0,1,'2024-12-02 00:29:18'),
('baa93473-6baa-4af0-b0cc-75a416e95554','46d13d88-9a5f-43b8-b379-8de4178d3320','b8f47299-65a9-4e05-9b03-3e534bd6fd06','advanced','How to Start a Business With No Money - Free Business Course',NULL,'https://i.ytimg.com/vi/FvaQHgQ6-0Y/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLAVGwcM7NVcYvBW1HwaFUbw3YEUOA',130,0,1,'2024-12-02 00:29:18'),
('bbeb271f-8f00-434e-a4a5-eac685eb7014','46d13d88-9a5f-43b8-b379-8de4178d3320','62921f47-1c6e-46c3-9edd-040c6f0491a0','beginner','Personality Development Training Course',NULL,'https://i.ytimg.com/vi/cDHGpfpw9kY/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCgXTCEM6YwaHZHStXgpQFzT9LZxA',60,0,1,'2024-12-02 00:29:18'),
('be5b7bcb-c742-4800-9fd4-33513cbf4ccb','46d13d88-9a5f-43b8-b379-8de4178d3320','7c423643-fc39-411c-8ee7-af1dfb0c5947','advanced','Free full lessons',NULL,'https://i.ytimg.com/vi/YhXYEEDFCsg/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCSjbBvf5n7tsz0aJkUOf8EZ8C9yA',130,0,1,'2024-12-02 00:29:18'),
('c18df82d-b4fc-4569-a39d-b1adb4f510a2','46d13d88-9a5f-43b8-b379-8de4178d3320','7c423643-fc39-411c-8ee7-af1dfb0c5947','advanced','Japanese Vocabulary - Learn Japanese Words and Phrases',NULL,'https://i.ytimg.com/vi/Mz3uCFOStt4/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLBf8KFR9DZTOLm95RHFKROEKaOf6w',130,0,1,'2024-12-02 00:29:18'),
('c54cc373-7e5f-4256-8f9f-e537aa3d0539','46d13d88-9a5f-43b8-b379-8de4178d3320','e9ca440a-afea-4eeb-b26e-15bb9b9d5773','advanced','Nuxt & Pinia with Firestore Tutorial',NULL,'https://i.ytimg.com/vi/nm069pZBFTg/hqdefault.jpg?sqp=-oaymwEXCOADEI4CSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLBw6pOkzpIseFkAdcii-IvbvLlEkA',5,0,1,'2024-12-02 00:29:18'),
('c7899d7f-7b8f-4a09-8000-c49e201499b2','46d13d88-9a5f-43b8-b379-8de4178d3320','50b1b9b5-11bf-42de-8491-d155cfa92f6f','advanced','Self-Care Videos',NULL,'https://i.ytimg.com/vi/-eGQ5RyKGZE/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLBlpes8MB8VayVqAFCDyNZZgtdsFQ',70,0,1,'2024-12-02 00:29:18'),
('c7a33743-21b7-4d34-ac72-7fd80e9a7fd1','46d13d88-9a5f-43b8-b379-8de4178d3320','50b1b9b5-11bf-42de-8491-d155cfa92f6f','advanced','Physical Health',NULL,'https://i.ytimg.com/vi/8ZIqsKCq_tw/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLAIAP2xyo_L_Gv6AWWRCBxG2MHacw',120,0,1,'2024-12-02 00:29:18'),
('cc04cf32-9327-4206-a5d7-485d9d19f3f1','46d13d88-9a5f-43b8-b379-8de4178d3320','e9ca440a-afea-4eeb-b26e-15bb9b9d5773','all level','Tanstack Query v5',NULL,'https://i.ytimg.com/vi/zzgrHUn4kb4/hqdefault.jpg?sqp=-oaymwEXCOADEI4CSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLB8sTf4xEstnfIYX4Kz0rtZCxOzEQ',1,0,1,'2024-12-02 00:29:18'),
('d3d490a9-828a-48bb-b941-1f126d3202c8','46d13d88-9a5f-43b8-b379-8de4178d3320','50b1b9b5-11bf-42de-8491-d155cfa92f6f','advanced','Beginner Strength Training (Level 2)',NULL,'https://i.ytimg.com/vi/2qI3RwOZfsY/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLBFMEF2fMu3LNCBPVl5slpO2ZWvWA',120,0,1,'2024-12-02 00:29:18'),
('d8e7a260-77c1-4888-bca5-988042b6b9c0','46d13d88-9a5f-43b8-b379-8de4178d3320','50b1b9b5-11bf-42de-8491-d155cfa92f6f','advanced','Self Care Tips & Routines',NULL,'https://i.ytimg.com/vi/CHaeoyfti-w/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLDpDzVfsUCwYY65qvk9Q308TsxWTw',100,0,1,'2024-12-02 00:29:18'),
('dd12e497-09f4-4dea-9763-28b4e3b687a1','46d13d88-9a5f-43b8-b379-8de4178d3320','e9ca440a-afea-4eeb-b26e-15bb9b9d5773','beginner','Redux Toolkit Tutorial',NULL,'https://i.ytimg.com/vi/0awA5Uw6SJE/hqdefault.jpg?sqp=-oaymwEXCOADEI4CSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCXUfi_JwruX6gE4Y2xmoqhxzBVnA',5,0,1,'2024-12-02 00:29:18'),
('e10868d0-ba35-4cb9-a63d-d75af159368a','46d13d88-9a5f-43b8-b379-8de4178d3320','e9ca440a-afea-4eeb-b26e-15bb9b9d5773','intermediate','Next.js 13 Crash Course',NULL,'https://i.ytimg.com/vi/TJQbDPGzm0Y/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCmQt8pp9F4sofRDy_t2-lNSKosEg',7,0,1,'2024-12-02 00:29:18'),
('e450af61-74fa-4446-a8cb-adcea4adb62a','46d13d88-9a5f-43b8-b379-8de4178d3320','10b9fbbb-3be0-43db-96d6-54ffc1783e4f','beginner','60 Days Spoken English Course',NULL,'https://i.ytimg.com/vi/OnSUWIyQqIc/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCkO4Ow7ld6Uq36qmwwdMfa8midEA',15,0,1,'2024-12-02 00:29:18'),
('e464df18-bc58-4614-ac1b-5e59c461c565','46d13d88-9a5f-43b8-b379-8de4178d3320','7c423643-fc39-411c-8ee7-af1dfb0c5947','advanced','Learn Beginner Chinese: Phrase of the Day Series',NULL,'https://i.ytimg.com/vi/YjRAxl2RrHI/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCAfHM4I5liHOhGUZaA5K52rPTarg',100,0,1,'2024-12-02 00:29:18'),
('e74f04a2-f749-4da9-9e9c-1179554695b0','46d13d88-9a5f-43b8-b379-8de4178d3320','50b1b9b5-11bf-42de-8491-d155cfa92f6f','advanced','Your Ultimate Health Playlist: Empowering Wellness and Vitalityl',NULL,'https://i.ytimg.com/vi/cfpITyzu-Ys/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLD4fpjQljZx-RKVLR6BXAp6rjQhLQA',100,0,1,'2024-12-02 00:29:18'),
('e86be867-e649-4b93-9c9a-fa39c2091027','46d13d88-9a5f-43b8-b379-8de4178d3320','ed012e88-b4e6-4ec6-8fd1-564011a13822','advanced','Principles of Management',NULL,'https://i.ytimg.com/vi/vOykcERGw9Y/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLD4xfmZon4IVaML-7JGPUxx4pHtxg',90,0,1,'2024-12-02 00:29:18'),
('ec542ea8-e7b0-490c-8e40-4ca92db27275','46d13d88-9a5f-43b8-b379-8de4178d3320','e9ca440a-afea-4eeb-b26e-15bb9b9d5773','all level','Redis for Beginners',NULL,'https://i.ytimg.com/vi/8sHCdz_tOjk/hqdefault.jpg?sqp=-oaymwEXCOADEI4CSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCaE9iL3F83rCNxoXeEt_4Ig1dF5w',2,0,1,'2024-12-02 00:29:18'),
('ed5e4b00-54e0-4c8e-8c0f-edea05cbf72e','46d13d88-9a5f-43b8-b379-8de4178d3320','e9ca440a-afea-4eeb-b26e-15bb9b9d5773','all level','React TypeScript Tutorial',NULL,'https://i.ytimg.com/vi/TiSGujM22OI/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLAZaoCQQ_WDeCzeimnEpif-qah-2g',20,0,1,'2024-12-02 00:29:18'),
('f053064b-8d0e-48b3-8439-db7bdc99ea9f','46d13d88-9a5f-43b8-b379-8de4178d3320','50b1b9b5-11bf-42de-8491-d155cfa92f6f','advanced','Nutrition and Exercise',NULL,'https://i.ytimg.com/vi/AuDbvBlDer4/hqdefault.jpg?sqp=-oaymwExCNACELwBSFryq4qpAyMIARUAAIhCGAHwAQH4AdQGgALgA4oCDAgAEAEYZSBlKGUwDw==&rs=AOn4CLCi4Eyq0gpIiIecXrR70UxNECg3JA',130,0,1,'2024-12-02 00:29:18'),
('f1c3e718-e39f-4a07-ae31-ee49d15290d0','46d13d88-9a5f-43b8-b379-8de4178d3320','e9ca440a-afea-4eeb-b26e-15bb9b9d5773','beginner','Chakra UI Tutorial',NULL,'https://i.ytimg.com/vi/iXsM6NkEmFc/hqdefault.jpg?sqp=-oaymwEXCOADEI4CSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCt0AzVoUsWtlSz7vQu0voye8b7fw',1,0,1,'2024-12-02 00:29:18'),
('f6c04836-9bc1-469a-bff0-0dd5dee5c04c','46d13d88-9a5f-43b8-b379-8de4178d3320','50b1b9b5-11bf-42de-8491-d155cfa92f6f','advanced','Ask HIV: Provider to Provider',NULL,'https://i.ytimg.com/vi/ND__mOG6czA/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLBG5fSKg9F5Fv-3j0YDn6f-DWkMRA',130,0,1,'2024-12-02 00:29:18'),
('f7728945-1eda-48bc-ad73-10913da8c0e1','46d13d88-9a5f-43b8-b379-8de4178d3320','ed012e88-b4e6-4ec6-8fd1-564011a13822','advanced','Principle of Management playlist',NULL,'https://i.ytimg.com/vi/eH6VgHs5mwU/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLD29CWeEPwyKIleET3j9jINhbx8YA',60,0,1,'2024-12-02 00:29:18'),
('f911ea58-45b9-4e1b-b785-a65005d89531','46d13d88-9a5f-43b8-b379-8de4178d3320','ed012e88-b4e6-4ec6-8fd1-564011a13822','advanced','Introduction to Management',NULL,'https://i.ytimg.com/vi/UJS9JrFDuRo/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLA2g46vP1xkHZG4E4MWl-Q0sTh75g',80,0,1,'2024-12-02 00:29:18'),
('fc1dbadc-4fb7-4295-affd-0504646aad71','46d13d88-9a5f-43b8-b379-8de4178d3320','e9ca440a-afea-4eeb-b26e-15bb9b9d5773','beginner','Shadcn UI Tutorial',NULL,'https://i.ytimg.com/vi/wcTzlJi2Oz4/hqdefault.jpg?sqp=-oaymwEXCOADEI4CSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLDt-09Ko5uG-7e-qe58eMvMGFjzZA',12,0,1,'2024-12-02 00:29:18'),
('fc807fc4-f437-480e-9a93-d086c3c8ddba','46d13d88-9a5f-43b8-b379-8de4178d3320','e9ca440a-afea-4eeb-b26e-15bb9b9d5773','advanced','Python Crash Course',NULL,'https://i.ytimg.com/vi/wdp7smAtqZI/hqdefault.jpg?sqp=-oaymwEXCOADEI4CSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLAR6kk-LpgazA2jz8ZwBwYs99_K5Q',12,0,1,'2024-12-02 00:29:18'),
('fc8791e0-024b-47b0-be8f-676617813e4d','46d13d88-9a5f-43b8-b379-8de4178d3320','e9ca440a-afea-4eeb-b26e-15bb9b9d5773','advanced','Firebase 9 Tutorial',NULL,'https://i.ytimg.com/vi/9zdvmgGsww0/hqdefault.jpg?sqp=-oaymwEXCOADEI4CSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLBqZKXHC7mBRl2f_FoRYtn_bWljkQ',4,0,1,'2024-12-02 00:29:18'),
('fdd95b16-e80d-40c5-a25f-972dbc317340','46d13d88-9a5f-43b8-b379-8de4178d3320','e9ca440a-afea-4eeb-b26e-15bb9b9d5773','advanced','Next.js Tutorial - Beginner to Advanced',NULL,'https://i.ytimg.com/vi/ZjAqacIC_3c/hqdefault.jpg?sqp=-oaymwEXCOADEI4CSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCFrkxkw_AUBpKpLPESu8U6OleRlw',12,0,1,'2024-12-02 00:29:18');

--
-- Table structure for table `lesson`
--

DROP TABLE IF EXISTS `lesson`;
CREATE TABLE `lesson` (
  `id` varchar(255) NOT NULL,
  `course_id` varchar(255) NOT NULL,
  `chapter_id` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `lesson_type` enum('video','quiz') NOT NULL DEFAULT 'video',
  `position` int(11) NOT NULL,
  `is_published` tinyint(1) DEFAULT 0,
  `is_free` tinyint(1) DEFAULT 0,
  `video_url` varchar(255) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `question` varchar(255) DEFAULT NULL,
  `type` enum('single_choice','multiple_choice','true_false') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `lesson_course_id_course_id_fk` (`course_id`),
  KEY `lesson_chapter_id_chapter_id_fk` (`chapter_id`),
  CONSTRAINT `lesson_chapter_id_chapter_id_fk` FOREIGN KEY (`chapter_id`) REFERENCES `chapter` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `lesson_course_id_course_id_fk` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lesson`
--

INSERT INTO `lesson` VALUES
('033b4211-5a17-473c-a24c-9b1398d916ee','fdd95b16-e80d-40c5-a25f-972dbc317340','b07e93a1-a346-4d73-a617-b4d4faaf2878','Server and Client Components','Server and Client Components','video',6,1,0,'https://www.youtube.com/watch?v=KvjWqn1VpPc',NULL,NULL,NULL),
('048d1a9b-6c3d-4fa4-a285-2f635183717b','fdd95b16-e80d-40c5-a25f-972dbc317340','e6871d3f-43d6-412f-b382-f025196a3f32','Next.js 15 is FINALLY here!','Next.js 15 is FINALLY here!','video',1,1,0,'https://www.youtube.com/watch?v=RxSAUaAkHxA',NULL,NULL,NULL),
('04f0444e-fc73-4ccf-8a1a-78b9a4342f88','e10868d0-ba35-4cb9-a63d-d75af159368a','46026336-bfb9-460b-b2dd-699e492486ae','Introduction & New Features','Introduction & New Features','video',1,1,1,'https://www.youtube.com/watch?v=TJQbDPGzm0Y',NULL,NULL,NULL),
('0a68eea7-c930-470b-bdc9-7ea2ae1722e8','ed5e4b00-54e0-4c8e-8c0f-edea05cbf72e','49e0975d-f71b-4073-acbe-a84e2960cd98','useState Future Value','useState Future Value','video',3,1,0,'https://www.youtube.com/watch?v=LNpWuRUIR5A',NULL,NULL,NULL),
('0a9708e6-379d-4a12-a91a-3df3f4df022a','fdd95b16-e80d-40c5-a25f-972dbc317340','083cbaf5-8c28-4f8e-97d8-d0891f07f9d6','Conditional Routes','Conditional Routes','video',3,1,0,'https://www.youtube.com/watch?v=7HrOjvKIfRs',NULL,NULL,NULL),
('0f5a26cf-5c42-4901-8664-fdac068743af','fdd95b16-e80d-40c5-a25f-972dbc317340','b07e93a1-a346-4d73-a617-b4d4faaf2878','Client-side Rendering (CSR)','Client-side Rendering (CSR)','video',2,1,0,'https://www.youtube.com/watch?v=OXrNQPhzH84',NULL,NULL,NULL),
('0f7847ae-1884-46e6-95e3-ff44072b05e0','ed5e4b00-54e0-4c8e-8c0f-edea05cbf72e','a14a908f-4f88-4d69-a65c-697d4bbc167f','Polymorphic Components','Polymorphic Components','video',4,1,0,'https://www.youtube.com/watch?v=uZ8GZm5KEXY',NULL,NULL,NULL),
('1193cc00-330c-4847-b56d-e9a4a1c24302','ed5e4b00-54e0-4c8e-8c0f-edea05cbf72e','10dac819-f95e-4d2e-898c-b06c8648d635','Advanced Props','Advanced Props','video',3,1,0,'https://www.youtube.com/watch?v=zLyeWSfTMa8',NULL,NULL,NULL),
('12316c99-dc90-4dc7-9d5b-27e278ab4e22','e10868d0-ba35-4cb9-a63d-d75af159368a','c3e7c1d3-8efe-446c-a781-4458011c8777','Loading UI & Suspense','Loading UI & Suspense','video',1,1,0,'https://www.youtube.com/watch?v=Lzml9L3f4IM',NULL,NULL,NULL),
('14b2ed94-518e-476d-8777-cab5ea2aeb1c','fdd95b16-e80d-40c5-a25f-972dbc317340','dcda7789-d9fa-4684-98c0-ed4c26a13d22','Route Group Layout','Route Group Layout','video',12,1,0,'https://www.youtube.com/watch?v=V5GKwuzKQV0',NULL,NULL,NULL),
('16d30497-5876-4cba-83f1-b2ec3c167417','fdd95b16-e80d-40c5-a25f-972dbc317340','dcda7789-d9fa-4684-98c0-ed4c26a13d22','Dynamic Routes','Dynamic Routes','video',3,1,0,'https://www.youtube.com/watch?v=N4-EkNJ6RFM',NULL,NULL,NULL),
('17137d29-4875-4e97-9585-1352faea4499','fdd95b16-e80d-40c5-a25f-972dbc317340','083cbaf5-8c28-4f8e-97d8-d0891f07f9d6','Redirects in Route Handlers','Redirects in Route Handlers','video',13,1,0,'https://www.youtube.com/watch?v=54eKbXPrvuo',NULL,NULL,NULL),
('1dfe388e-81b3-48d1-9e92-05c0959a106e','ed5e4b00-54e0-4c8e-8c0f-edea05cbf72e','a14a908f-4f88-4d69-a65c-697d4bbc167f','Wrapping HTML Elements','Wrapping HTML Elements','video',2,1,0,'https://www.youtube.com/watch?v=4GchlC06ca0',NULL,NULL,NULL),
('2455abb8-75f7-4dd5-aa3e-f1987594154f','fdd95b16-e80d-40c5-a25f-972dbc317340','083cbaf5-8c28-4f8e-97d8-d0891f07f9d6','Handling POST Request','Handling POST Request','video',8,1,0,'https://www.youtube.com/watch?v=pzPS7Fn-8tE',NULL,NULL,NULL),
('252cde38-0873-43dc-9f9b-63cd75810d01','ed5e4b00-54e0-4c8e-8c0f-edea05cbf72e','d38cc45c-64aa-4c81-b114-89384730d68d','useContext Future Value','useContext Future Value','video',2,1,0,'https://www.youtube.com/watch?v=9726Yq3Scjk',NULL,NULL,NULL),
('255a51bb-ed12-4af4-92f2-e4335fb13e5f','e10868d0-ba35-4cb9-a63d-d75af159368a','cd006075-cb3d-43ba-b8b5-8b7e951f0fa5','Static Rendering','Static Rendering','video',2,1,0,'https://www.youtube.com/watch?v=ihmyC4Ei2zY',NULL,NULL,NULL),
('2620a8a7-6dc1-419f-b716-e20862d7b0de','fdd95b16-e80d-40c5-a25f-972dbc317340','e6b86cca-9f6a-40fb-a48e-44aa146a5ede','Fetching Data with Server Components','Fetching Data with Server Components','video',2,1,0,'https://www.youtube.com/watch?v=WAm-T04ztrs',NULL,NULL,NULL),
('26e41e7d-eb0b-4fa4-8955-f6e83e89388c','fdd95b16-e80d-40c5-a25f-972dbc317340','083cbaf5-8c28-4f8e-97d8-d0891f07f9d6','Cookies in Route Handlers','Cookies in Route Handlers','video',15,1,0,'https://www.youtube.com/watch?v=1qd3_OGL5Ko',NULL,NULL,NULL),
('279722c8-3f8f-47f1-aecf-24094f0dbbe0','fdd95b16-e80d-40c5-a25f-972dbc317340','dcda7789-d9fa-4684-98c0-ed4c26a13d22','Nested Dynamic Routes','Nested Dynamic Routes','video',4,1,0,'https://www.youtube.com/watch?v=Vn4p4K6_M44',NULL,NULL,NULL),
('285837b8-c869-468c-a79b-12d3c4f7d11c','fdd95b16-e80d-40c5-a25f-972dbc317340','dcda7789-d9fa-4684-98c0-ed4c26a13d22','File Colocation','File Colocation','video',7,1,0,'https://www.youtube.com/watch?v=kO2nTCgcJLc',NULL,NULL,NULL),
('29ba9c16-a425-4df4-bedc-fd759805a917','fdd95b16-e80d-40c5-a25f-972dbc317340','083cbaf5-8c28-4f8e-97d8-d0891f07f9d6','Dynamic Route Handlers','Dynamic Route Handlers','video',9,1,0,'https://www.youtube.com/watch?v=TGbC8F0gjC8',NULL,NULL,NULL),
('2cba9587-b462-4803-93f5-1cdb4db2c86a','fdd95b16-e80d-40c5-a25f-972dbc317340','e6b86cca-9f6a-40fb-a48e-44aa146a5ede','Client-side Data Fetching','Client-side Data Fetching','video',10,1,0,'https://www.youtube.com/watch?v=zfaDdKH5Zv8',NULL,NULL,NULL),
('2db67132-1d2f-407d-8c2a-071d4796164d','ed5e4b00-54e0-4c8e-8c0f-edea05cbf72e','ea092c70-db72-4c5e-a9e6-9083cb73ef44','Class Component','Class Component','video',2,1,0,'https://www.youtube.com/watch?v=JOhIMtMxjpU',NULL,NULL,NULL),
('2eca51d6-e997-4e97-a313-c36f0e17d0f5','e10868d0-ba35-4cb9-a63d-d75af159368a','7cde72ae-bb18-43cb-915a-6e5818d60572','Pages & Routes','Pages & Routes','video',1,1,0,'https://www.youtube.com/watch?v=vwg4Wrk-kWE',NULL,NULL,NULL),
('304cb5ee-c092-4aed-82c2-16aa526de3de','ed5e4b00-54e0-4c8e-8c0f-edea05cbf72e','49e0975d-f71b-4073-acbe-a84e2960cd98','Prop Types and Tips','Prop Types and Tips','video',1,1,0,'https://www.youtube.com/watch?v=4Ml7Lp_QcSo',NULL,NULL,NULL),
('307744e9-90bc-43aa-9da3-60404b037b28','fdd95b16-e80d-40c5-a25f-972dbc317340','e6b86cca-9f6a-40fb-a48e-44aa146a5ede','Loading and Error States','Loading and Error States','video',3,1,0,'https://www.youtube.com/watch?v=Or2aZfITRpU',NULL,NULL,NULL),
('35029801-4921-4e2a-b924-40444026ce2e','fdd95b16-e80d-40c5-a25f-972dbc317340','dcda7789-d9fa-4684-98c0-ed4c26a13d22','Not Found Page','Not Found Page','video',6,1,0,'https://www.youtube.com/watch?v=tW3rVL7xc8Y',NULL,NULL,NULL),
('35dc09c7-d99c-4031-a489-ff094c2a95f1','fdd95b16-e80d-40c5-a25f-972dbc317340','f8d6c3b5-d123-40f1-9bae-d63a63f1b228','Handling Errors in Nested Routes','Handling Errors in Nested Routes','video',5,1,0,'https://www.youtube.com/watch?v=YG98I2Bj7qw',NULL,NULL,NULL),
('397e5146-b8b1-49c2-a6e6-5601afbbf953','fdd95b16-e80d-40c5-a25f-972dbc317340','dcda7789-d9fa-4684-98c0-ed4c26a13d22','Link Component Navigation','Link Component Navigation','video',15,1,0,'https://www.youtube.com/watch?v=TVAF5Fr_2QA',NULL,NULL,NULL),
('3a4c2d79-43ff-41c5-92ef-082f44b447bd','fdd95b16-e80d-40c5-a25f-972dbc317340','dcda7789-d9fa-4684-98c0-ed4c26a13d22','Nested Layouts','Nested Layouts','video',11,1,0,'https://www.youtube.com/watch?v=FWlUf4FEQ1M',NULL,NULL,NULL),
('3dd2c6c4-bb4e-4228-a9ee-b1102b7bdc08','fdd95b16-e80d-40c5-a25f-972dbc317340','f8d6c3b5-d123-40f1-9bae-d63a63f1b228','Recovering from Errors','Recovering from Errors','video',4,1,0,'https://www.youtube.com/watch?v=f7LqNoMAAUc',NULL,NULL,NULL),
('3e7585ae-f7c6-4a8d-9d8a-8d28cd12a95a','fdd95b16-e80d-40c5-a25f-972dbc317340','a0671544-1350-42e3-8164-2ee2c93c0013','Hello World','Hello World','video',2,1,0,'https://www.youtube.com/watch?v=kVddMV-TrSw',NULL,NULL,NULL),
('3e83d17b-5afa-4f04-903d-c7c0a79000db','fdd95b16-e80d-40c5-a25f-972dbc317340','083cbaf5-8c28-4f8e-97d8-d0891f07f9d6','Handling DELETE Request','Handling DELETE Request','video',11,1,0,'https://www.youtube.com/watch?v=x3KCt1Oc278',NULL,NULL,NULL),
('3f956978-11c4-4730-9c56-22d87cfa2a37','fdd95b16-e80d-40c5-a25f-972dbc317340','b07e93a1-a346-4d73-a617-b4d4faaf2878','RSC Rendering Lifecycle','RSC Rendering Lifecycle','video',7,1,0,'https://www.youtube.com/watch?v=o57paErp8Pc',NULL,NULL,NULL),
('3ffaf366-3360-415f-910e-3393bcc8795e','fdd95b16-e80d-40c5-a25f-972dbc317340','a0671544-1350-42e3-8164-2ee2c93c0013','Before We Start','Before We Start','video',4,1,0,'https://www.youtube.com/watch?v=x7oQC_R_yVo',NULL,NULL,NULL),
('407df733-9d81-407b-a899-06e1009e9a9f','ed5e4b00-54e0-4c8e-8c0f-edea05cbf72e','175a1aa7-63b4-42a6-92b6-d12b80a29de5','Getting Started','Getting Started','video',2,1,1,'https://www.youtube.com/watch?v=Kt4PQlcLHco',NULL,NULL,NULL),
('46f9623d-05f2-4844-8f82-cd76d7976faf','fdd95b16-e80d-40c5-a25f-972dbc317340','e6b86cca-9f6a-40fb-a48e-44aa146a5ede','Request Memoization','Request Memoization','video',8,1,0,'https://www.youtube.com/watch?v=tcLe3Xi0fJE',NULL,NULL,NULL),
('479dabb6-3027-4f02-8a1a-138839ecb17c','fdd95b16-e80d-40c5-a25f-972dbc317340','b07e93a1-a346-4d73-a617-b4d4faaf2878','Client-only Code','Client-only Code','video',15,1,0,'https://www.youtube.com/watch?v=xn1LpTw-pzc',NULL,NULL,NULL),
('47e45abc-f727-404d-986f-0dc1a2e08c59','fdd95b16-e80d-40c5-a25f-972dbc317340','a0671544-1350-42e3-8164-2ee2c93c0013','Project Structure','Project Structure','video',3,1,0,'https://www.youtube.com/watch?v=FmerxXWD66g',NULL,NULL,NULL),
('481aa998-0ee2-4db1-af00-c1354f66cbe5','ed5e4b00-54e0-4c8e-8c0f-edea05cbf72e','175a1aa7-63b4-42a6-92b6-d12b80a29de5','Introduction','Introduction','video',1,1,1,'https://www.youtube.com/watch?v=TiSGujM22OI',NULL,NULL,NULL),
('48258eb9-90b5-47eb-9d0b-7606e1fd789b','e10868d0-ba35-4cb9-a63d-d75af159368a','cd006075-cb3d-43ba-b8b5-8b7e951f0fa5','Custom 404 Page','Custom 404 Page','video',3,1,0,'https://www.youtube.com/watch?v=PbFH_VE1Iks',NULL,NULL,NULL),
('4b563aca-3559-4c85-90fc-b88bb7a28b59','fdd95b16-e80d-40c5-a25f-972dbc317340','dcda7789-d9fa-4684-98c0-ed4c26a13d22','Navigating Programmatically','Navigating Programmatically','video',17,1,0,'https://www.youtube.com/watch?v=7jBHW98vNjw',NULL,NULL,NULL),
('4fd75c1f-587e-40c4-91f7-5be547f639f9','fdd95b16-e80d-40c5-a25f-972dbc317340','b07e93a1-a346-4d73-a617-b4d4faaf2878','Third Party Packages','Third Party Packages','video',13,1,0,'https://www.youtube.com/watch?v=I4w5uZzdT1A',NULL,NULL,NULL),
('525e216e-98e3-461f-b33f-c7f38f0bdbc0','fdd95b16-e80d-40c5-a25f-972dbc317340','083cbaf5-8c28-4f8e-97d8-d0891f07f9d6','Handling PATCH Request','Handling PATCH Request','video',10,1,0,'https://www.youtube.com/watch?v=bDbBh7lEamE',NULL,NULL,NULL),
('52616bac-73ff-4f8e-9900-39e80ebccb78','ed5e4b00-54e0-4c8e-8c0f-edea05cbf72e','37a14003-1dec-4c56-95d1-1cd9e89d7b86','Component Prop','Component Prop','video',1,1,0,'https://www.youtube.com/watch?v=qvdnTfyv7y8',NULL,NULL,NULL),
('5264157a-ab99-4755-b4d2-9aab259c477f','fdd95b16-e80d-40c5-a25f-972dbc317340','dcda7789-d9fa-4684-98c0-ed4c26a13d22','Routing','Routing','video',1,1,0,'https://www.youtube.com/watch?v=Vm7qM1wmXwE',NULL,NULL,NULL),
('52bd307d-ce24-4657-889f-4506db9f2d5a','ed5e4b00-54e0-4c8e-8c0f-edea05cbf72e','0cb989bf-3459-4676-8e45-dee18ac1adbf','useReducer Strict Action Types','useReducer Strict Action Types','video',2,1,0,'https://www.youtube.com/watch?v=bcmes6hUO3U',NULL,NULL,NULL),
('52d1ce05-46da-4551-a80a-75f1080c0cc3','fdd95b16-e80d-40c5-a25f-972dbc317340','b07e93a1-a346-4d73-a617-b4d4faaf2878','Client Component Placement','Client Component Placement','video',16,1,0,'https://www.youtube.com/watch?v=MdpoBLCDmJo',NULL,NULL,NULL),
('573ce7b9-5a28-45e2-8dfd-c5641bf97b4a','e10868d0-ba35-4cb9-a63d-d75af159368a','c3e7c1d3-8efe-446c-a781-4458011c8777','Client Form Component','Client Form Component','video',2,1,0,'https://www.youtube.com/watch?v=nSfu7sHPE9M',NULL,NULL,NULL),
('5c462383-7054-4706-9744-34f831935720','ed5e4b00-54e0-4c8e-8c0f-edea05cbf72e','ea092c70-db72-4c5e-a9e6-9083cb73ef44','useRef Hook','useRef Hook','video',1,1,0,'https://www.youtube.com/watch?v=hA4i1RTbZ2A',NULL,NULL,NULL),
('61cc3c4f-2c5c-4b8f-b41e-fe39b99354cd','fdd95b16-e80d-40c5-a25f-972dbc317340','083cbaf5-8c28-4f8e-97d8-d0891f07f9d6','Parallel Intercepting Routes','Parallel Intercepting Routes','video',5,1,0,'https://www.youtube.com/watch?v=mVOvx9eVHg0',NULL,NULL,NULL),
('6465ca3f-8303-4ba5-ac78-230c676bfe76','ed5e4b00-54e0-4c8e-8c0f-edea05cbf72e','37a14003-1dec-4c56-95d1-1cd9e89d7b86','Restricting Props','Restricting Props','video',3,1,0,'https://www.youtube.com/watch?v=yqn9Fkv7f2M',NULL,NULL,NULL),
('6518e1bf-957b-49ed-91d4-d9a44aa5e475','fdd95b16-e80d-40c5-a25f-972dbc317340','e6b86cca-9f6a-40fb-a48e-44aa146a5ede','Data Fetching','Data Fetching','video',1,1,0,'https://www.youtube.com/watch?v=gBLro0UcwKw',NULL,NULL,NULL),
('6cc24b3a-fc93-4e20-ad00-9840486ed9a3','ed5e4b00-54e0-4c8e-8c0f-edea05cbf72e','fe8fad48-c239-473e-aa50-3dc09ab2e621','Style Props','Style Props','video',2,1,0,'https://www.youtube.com/watch?v=FNfHtujZE4k',NULL,NULL,NULL),
('6ce6935a-c88c-466c-8dd9-551d6a318d78','fdd95b16-e80d-40c5-a25f-972dbc317340','f8d6c3b5-d123-40f1-9bae-d63a63f1b228','Handling Errors in Layouts','Handling Errors in Layouts','video',6,1,0,'https://www.youtube.com/watch?v=3V6ho699MDg',NULL,NULL,NULL),
('6d72024f-da58-444e-962b-15444857750d','fdd95b16-e80d-40c5-a25f-972dbc317340','b07e93a1-a346-4d73-a617-b4d4faaf2878','Rendering','Rendering','video',1,1,0,'https://www.youtube.com/watch?v=fjLXVGDqix0',NULL,NULL,NULL),
('6df7350a-ef20-41a2-9fe1-b2eebbd8e0df','ed5e4b00-54e0-4c8e-8c0f-edea05cbf72e','10dac819-f95e-4d2e-898c-b06c8648d635','Typing Props','Typing Props','video',1,1,0,'https://www.youtube.com/watch?v=KpA6oEaCHtk',NULL,NULL,NULL),
('71c596f0-e012-4d4c-9d2a-01ba9524e5a9','fdd95b16-e80d-40c5-a25f-972dbc317340','083cbaf5-8c28-4f8e-97d8-d0891f07f9d6','Parallel Routes','Parallel Routes','video',1,1,0,'https://www.youtube.com/watch?v=8I5-OTNOni0',NULL,NULL,NULL),
('759a17a2-7bab-43bc-8c07-51146b0ac394','fdd95b16-e80d-40c5-a25f-972dbc317340','dcda7789-d9fa-4684-98c0-ed4c26a13d22','Nested Routes','Nested Routes','video',2,1,0,'https://www.youtube.com/watch?v=mEral6yz130',NULL,NULL,NULL),
('770a63de-9ce1-48de-ba9e-54bc5bd6ab8a','fdd95b16-e80d-40c5-a25f-972dbc317340','f8d6c3b5-d123-40f1-9bae-d63a63f1b228','Templates','Templates','video',1,1,0,'https://www.youtube.com/watch?v=7xVWvL-37EE',NULL,NULL,NULL),
('78a186c9-7858-429f-a0e8-3952d4cc27e3','ed5e4b00-54e0-4c8e-8c0f-edea05cbf72e','49e0975d-f71b-4073-acbe-a84e2960cd98','useState Type Assertion','useState Type Assertion','video',4,1,0,'https://www.youtube.com/watch?v=U3UizPM4aSk',NULL,NULL,NULL),
('7f2c9b17-ada2-49af-b0c3-bc5deca70c8a','fdd95b16-e80d-40c5-a25f-972dbc317340','b07e93a1-a346-4d73-a617-b4d4faaf2878','Suspense for SSR','Suspense for SSR','video',4,1,0,'https://www.youtube.com/watch?v=NdSthd1Ek8Q',NULL,NULL,NULL),
('8a703741-0ac7-4bef-b962-20d069335b47','fdd95b16-e80d-40c5-a25f-972dbc317340','b07e93a1-a346-4d73-a617-b4d4faaf2878','Streaming','Streaming','video',10,1,0,'https://www.youtube.com/watch?v=9REGGiU8hck',NULL,NULL,NULL),
('8a7ee57d-6b84-429e-bae1-220d09149795','fdd95b16-e80d-40c5-a25f-972dbc317340','083cbaf5-8c28-4f8e-97d8-d0891f07f9d6','Route Handlers','Route Handlers','video',6,1,0,'https://www.youtube.com/watch?v=25yY2RVRq_M',NULL,NULL,NULL),
('8bc83a9b-a680-4642-9104-ff1ea28ed951','fdd95b16-e80d-40c5-a25f-972dbc317340','083cbaf5-8c28-4f8e-97d8-d0891f07f9d6','Headers in Route Handlers','Headers in Route Handlers','video',14,1,0,'https://www.youtube.com/watch?v=pxHbFrahyLY',NULL,NULL,NULL),
('8ce4d6a0-d210-4440-aeed-9105eb9de7a3','ed5e4b00-54e0-4c8e-8c0f-edea05cbf72e','37a14003-1dec-4c56-95d1-1cd9e89d7b86','Generic Props','Generic Props','video',2,1,0,'https://www.youtube.com/watch?v=xFNk2nfDh4M',NULL,NULL,NULL),
('94e54173-2bbc-415f-8105-d55f6a2f7816','fdd95b16-e80d-40c5-a25f-972dbc317340','083cbaf5-8c28-4f8e-97d8-d0891f07f9d6','URL Query Parameters','URL Query Parameters','video',12,1,0,'https://www.youtube.com/watch?v=fuxSl-K0oI0',NULL,NULL,NULL),
('9854e884-c740-40e8-99d5-b7fbcb08ebcc','fdd95b16-e80d-40c5-a25f-972dbc317340','dcda7789-d9fa-4684-98c0-ed4c26a13d22','Layouts','Layouts','video',10,1,0,'https://www.youtube.com/watch?v=f93g238p9tM',NULL,NULL,NULL),
('988ac54f-1639-49bc-886c-0e1cfd0aa72f','fdd95b16-e80d-40c5-a25f-972dbc317340','dcda7789-d9fa-4684-98c0-ed4c26a13d22','Routing Metadata','Routing Metadata','video',13,1,0,'https://www.youtube.com/watch?v=yE_y4EBq-EA',NULL,NULL,NULL),
('998c9267-89b7-4bd8-8ec6-bb57213bc09c','fdd95b16-e80d-40c5-a25f-972dbc317340','083cbaf5-8c28-4f8e-97d8-d0891f07f9d6','Unmatched Routes','Unmatched Routes','video',2,1,0,'https://www.youtube.com/watch?v=NPtnJ6Ivv9k',NULL,NULL,NULL),
('9b90f506-e89e-499b-a398-a123c12f1a4a','ed5e4b00-54e0-4c8e-8c0f-edea05cbf72e','49e0975d-f71b-4073-acbe-a84e2960cd98','useState Hook','useState Hook','video',2,1,0,'https://www.youtube.com/watch?v=2NKNjeB0WVs',NULL,NULL,NULL),
('9d4e8037-4657-4ad9-9907-9c13134c8911','fdd95b16-e80d-40c5-a25f-972dbc317340','b07e93a1-a346-4d73-a617-b4d4faaf2878','Server-side Rendering (SSR)','Server-side Rendering (SSR)','video',3,1,0,'https://www.youtube.com/watch?v=3e017ih7pOA',NULL,NULL,NULL),
('9ee82554-dcc2-4240-85e6-debf4301ccff','fdd95b16-e80d-40c5-a25f-972dbc317340','083cbaf5-8c28-4f8e-97d8-d0891f07f9d6','Intercepting Routes','Intercepting Routes','video',4,1,0,'https://www.youtube.com/watch?v=nr_kRfTJfKc',NULL,NULL,NULL),
('9f0277a4-64ce-4adf-af28-461a4055e468','fdd95b16-e80d-40c5-a25f-972dbc317340','e6b86cca-9f6a-40fb-a48e-44aa146a5ede','JSON Server Setup','JSON Server Setup','video',4,1,0,'https://www.youtube.com/watch?v=bG6boMwCvk4',NULL,NULL,NULL),
('a2dee70c-6af3-4aa1-8084-164545e104cb','fdd95b16-e80d-40c5-a25f-972dbc317340','b07e93a1-a346-4d73-a617-b4d4faaf2878','Context Providers','Context Providers','video',14,1,0,'https://www.youtube.com/watch?v=Ou2IAs7W1Ig',NULL,NULL,NULL),
('a3afa6bd-72bd-4ed5-8379-7224aeb92a4c','fdd95b16-e80d-40c5-a25f-972dbc317340','f8d6c3b5-d123-40f1-9bae-d63a63f1b228','Error Handling','Error Handling','video',3,1,0,'https://www.youtube.com/watch?v=UcnCZ0lXZbo',NULL,NULL,NULL),
('a587964b-1129-47ab-9797-498313a46be3','fdd95b16-e80d-40c5-a25f-972dbc317340','b07e93a1-a346-4d73-a617-b4d4faaf2878','React Server Components (RSC)','React Server Components (RSC)','video',5,1,0,'https://www.youtube.com/watch?v=5h-e5hNKx-c',NULL,NULL,NULL),
('a5d514b4-4809-4c62-bf55-5ab8a0ff61c2','fdd95b16-e80d-40c5-a25f-972dbc317340','b07e93a1-a346-4d73-a617-b4d4faaf2878','Static Rendering','Static Rendering','video',8,1,0,'https://www.youtube.com/watch?v=WCcqnFRF9YA',NULL,NULL,NULL),
('a629d041-8118-4cb4-859b-c144eb235488','e10868d0-ba35-4cb9-a63d-d75af159368a','cd006075-cb3d-43ba-b8b5-8b7e951f0fa5','Dynamic Segments (Params)','Dynamic Segments (Params)','video',1,1,0,'https://www.youtube.com/watch?v=ZwajQ9ywgIU',NULL,NULL,NULL),
('a80508dc-e7de-47ac-9805-113daeda6860','ed5e4b00-54e0-4c8e-8c0f-edea05cbf72e','10dac819-f95e-4d2e-898c-b06c8648d635','Basic Props','Basic Props','video',2,1,0,'https://www.youtube.com/watch?v=mDu54a5U3OU',NULL,NULL,NULL),
('b4ba369d-aef1-40c3-b1d9-08a440e8d509','fdd95b16-e80d-40c5-a25f-972dbc317340','083cbaf5-8c28-4f8e-97d8-d0891f07f9d6','Middleware','Middleware','video',17,1,0,'https://www.youtube.com/watch?v=xrvul-JrKFI',NULL,NULL,NULL),
('b56ba7fe-47f7-4fa6-be6c-c7b2248de4f9','e10868d0-ba35-4cb9-a63d-d75af159368a','8d198c78-acc4-408a-943f-e91aff22c798','Fetching & Revalidating Data','Fetching & Revalidating Data','video',2,1,0,'https://www.youtube.com/watch?v=PAXWRgEo7Ns',NULL,NULL,NULL),
('b6cce741-0eaf-42b9-8fae-7c8283f5d2fd','fdd95b16-e80d-40c5-a25f-972dbc317340','dcda7789-d9fa-4684-98c0-ed4c26a13d22','Route Groups','Route Groups','video',93,1,0,'https://www.youtube.com/watch?v=Tpo5wBuk3po',NULL,NULL,NULL),
('b9ab49a3-46f3-4c71-bc00-ab019776d781','fdd95b16-e80d-40c5-a25f-972dbc317340','dcda7789-d9fa-4684-98c0-ed4c26a13d22','Catch all Segments','Catch all Segments','video',5,1,0,'https://www.youtube.com/watch?v=Ssw6-69KLRo',NULL,NULL,NULL),
('bb2fffa0-1d51-4e00-8cf0-8ee16dd48439','fdd95b16-e80d-40c5-a25f-972dbc317340','dcda7789-d9fa-4684-98c0-ed4c26a13d22','Active Links','Active Links','video',16,1,0,'https://www.youtube.com/watch?v=jzD1mUd35a0',NULL,NULL,NULL),
('bbc157de-2af6-4051-a01e-d457ef1931c0','fdd95b16-e80d-40c5-a25f-972dbc317340','dcda7789-d9fa-4684-98c0-ed4c26a13d22','Private Folders','Private Folders','video',8,1,0,'https://www.youtube.com/watch?v=nQKtuiccMLs',NULL,NULL,NULL),
('bdf15863-4c4f-48d4-8998-bf4e7c5cb0c1','ed5e4b00-54e0-4c8e-8c0f-edea05cbf72e','fe8fad48-c239-473e-aa50-3dc09ab2e621','Event Props','Event Props','video',1,1,0,'https://www.youtube.com/watch?v=xNSIHFi8o2M',NULL,NULL,NULL),
('c1e5b913-c252-405b-b271-7d286d5c36e0','fdd95b16-e80d-40c5-a25f-972dbc317340','e6b86cca-9f6a-40fb-a48e-44aa146a5ede','Time based Data Revalidation','Time based Data Revalidation','video',9,1,0,'https://www.youtube.com/watch?v=dR0diq3EvDE',NULL,NULL,NULL),
('c29c5976-48ed-4d2e-98d3-db78f328fd5c','fdd95b16-e80d-40c5-a25f-972dbc317340','b07e93a1-a346-4d73-a617-b4d4faaf2878','Interleaving Server and Client Components','Interleaving Server and Client Components','video',17,1,0,'https://www.youtube.com/watch?v=-RRiLnKSj8k',NULL,NULL,NULL),
('c5da5fbb-af26-417f-aba1-9b8da249b413','fdd95b16-e80d-40c5-a25f-972dbc317340','083cbaf5-8c28-4f8e-97d8-d0891f07f9d6','Handling GET Request','Handling GET Request','video',7,1,0,'https://www.youtube.com/watch?v=b3ue9WL5fk8',NULL,NULL,NULL),
('c6c1e36e-0b78-4f58-8660-baca4c7676bb','fdd95b16-e80d-40c5-a25f-972dbc317340','a0671544-1350-42e3-8164-2ee2c93c0013','Introduction','Introduction','video',1,1,1,'https://www.youtube.com/watch?v=ZjAqacIC_3c',NULL,NULL,NULL),
('ceda4727-9563-484c-8819-19678915e731','e10868d0-ba35-4cb9-a63d-d75af159368a','7cde72ae-bb18-43cb-915a-6e5818d60572','Layouts & Links','Layouts & Links','video',2,1,0,'https://www.youtube.com/watch?v=R7A5vBDfZ18',NULL,NULL,NULL),
('cfb73178-fe80-4028-8960-f27234b070d6','e10868d0-ba35-4cb9-a63d-d75af159368a','8d198c78-acc4-408a-943f-e91aff22c798','Styles, Fonts & Images','Styles, Fonts & Images','video',1,1,0,'https://www.youtube.com/watch?v=oWUQQD97Rz0',NULL,NULL,NULL),
('d067b379-bd5d-4ef9-866a-ecf386568688','ed5e4b00-54e0-4c8e-8c0f-edea05cbf72e','ea164ea5-6d96-4f2d-94bf-8a86ddb3de1c','Wrapping up','Wrapping up','video',1,1,0,'https://www.youtube.com/watch?v=YmATkdc-5NY',NULL,NULL,NULL),
('d14705b3-c08b-4901-95b0-be2119ead818','e10868d0-ba35-4cb9-a63d-d75af159368a','0648ce0f-ffd8-40a5-9655-e0e999aefe87','Building the App','Building the App','video',1,1,0,'https://www.youtube.com/watch?v=Yi_zS8jSln8',NULL,NULL,NULL),
('d49c488c-77de-49a8-88b0-170b4d62fd54','fdd95b16-e80d-40c5-a25f-972dbc317340','b07e93a1-a346-4d73-a617-b4d4faaf2878','Server-only Code','Server-only Code','video',12,1,0,'https://www.youtube.com/watch?v=t2tNpubt4y0',NULL,NULL,NULL),
('d89a3b2f-6f83-4ec2-93ff-d8023f0fbd98','ed5e4b00-54e0-4c8e-8c0f-edea05cbf72e','0cb989bf-3459-4676-8e45-dee18ac1adbf','useReducer Hook','useReducer Hook','video',1,1,0,'https://www.youtube.com/watch?v=lSh9RyYcnPA',NULL,NULL,NULL),
('d99b2045-0e86-4967-9500-0c37829f54d6','fdd95b16-e80d-40c5-a25f-972dbc317340','b07e93a1-a346-4d73-a617-b4d4faaf2878','Server and Client Composition Patterns','Server and Client Composition Patterns','video',11,1,0,'https://www.youtube.com/watch?v=7bsYcb3nWYA',NULL,NULL,NULL),
('daa88f2b-5489-43cf-9b3a-375d6380abe2','ed5e4b00-54e0-4c8e-8c0f-edea05cbf72e','a14a908f-4f88-4d69-a65c-697d4bbc167f','Template Literals and Exclude','Template Literals and Exclude','video',1,1,0,'https://www.youtube.com/watch?v=jrnIh0RPeCw',NULL,NULL,NULL),
('dfc26c58-7110-4b82-ab5b-f0e245b0715c','fdd95b16-e80d-40c5-a25f-972dbc317340','e6b86cca-9f6a-40fb-a48e-44aa146a5ede','Data Cache','Data Cache','video',6,1,0,'https://www.youtube.com/watch?v=_sIug3Y1YcA',NULL,NULL,NULL),
('e0db1375-53ea-47ea-b240-dfce7ccc3ab4','ed5e4b00-54e0-4c8e-8c0f-edea05cbf72e','a14a908f-4f88-4d69-a65c-697d4bbc167f','Extracting a Component''s Prop Types','Extracting a Component''s Prop Types','video',3,1,0,'https://www.youtube.com/watch?v=AHadSDk7i6s',NULL,NULL,NULL),
('e12e37ed-84b2-4bc9-ac3e-04774b22f12f','fdd95b16-e80d-40c5-a25f-972dbc317340','b07e93a1-a346-4d73-a617-b4d4faaf2878','Dynamic Rendering','Dynamic Rendering','video',9,1,0,'https://www.youtube.com/watch?v=-7Rrjy-lfcE',NULL,NULL,NULL),
('e3ed0bbc-81b8-4507-bac6-b7b74250eafd','ed5e4b00-54e0-4c8e-8c0f-edea05cbf72e','d38cc45c-64aa-4c81-b114-89384730d68d','useContext Hook','useContext Hook','video',1,1,0,'https://www.youtube.com/watch?v=rbtTb9hLYS8',NULL,NULL,NULL),
('e3ff25b3-f29d-4aee-88ab-b6552c1582bb','e10868d0-ba35-4cb9-a63d-d75af159368a','46026336-bfb9-460b-b2dd-699e492486ae','SSR & Server Components (theory)','SSR & Server Components (theory)','video',2,1,0,'https://www.youtube.com/watch?v=YEG2_fSJswc',NULL,NULL,NULL),
('eaf15d0d-4cb2-4377-8335-e4bcec647edd','fdd95b16-e80d-40c5-a25f-972dbc317340','f8d6c3b5-d123-40f1-9bae-d63a63f1b228','Loading UI','Loading UI','video',2,1,0,'https://www.youtube.com/watch?v=PrxdiJrrrWs',NULL,NULL,NULL),
('f08ee73d-4b5d-43fe-86d4-063642e633f2','fdd95b16-e80d-40c5-a25f-972dbc317340','083cbaf5-8c28-4f8e-97d8-d0891f07f9d6','Caching in Route Handlers','Caching in Route Handlers','video',16,1,0,'https://www.youtube.com/watch?v=5_cJFYZSiDM',NULL,NULL,NULL),
('f9ba3a30-0277-4ff9-8199-03f7c50ab0e3','fdd95b16-e80d-40c5-a25f-972dbc317340','e6b86cca-9f6a-40fb-a48e-44aa146a5ede','Caching Data','Caching Data','video',5,1,0,'https://www.youtube.com/watch?v=6rRHJZAAV1E',NULL,NULL,NULL),
('fe6d5bc2-5a9c-4193-95a2-41970b1d44eb','fdd95b16-e80d-40c5-a25f-972dbc317340','e6b86cca-9f6a-40fb-a48e-44aa146a5ede','Opting Out of Caching','Opting Out of Caching','video',7,1,0,'https://www.youtube.com/watch?v=PlgDOhWFOno',NULL,NULL,NULL),
('fefe760e-c015-42d7-a73b-5bc71b7fdec0','fdd95b16-e80d-40c5-a25f-972dbc317340','dcda7789-d9fa-4684-98c0-ed4c26a13d22','title Metadata','title Metadata','video',14,1,0,'https://www.youtube.com/watch?v=1OqftoKO2V0',NULL,NULL,NULL);

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
CREATE TABLE `order` (
  `id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `payment_id` varchar(255) NOT NULL,
  `customer_id` varchar(255) NOT NULL,
  `total_amount` int(11) NOT NULL DEFAULT 0,
  `status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `order_user_id_user_id_fk` (`user_id`),
  CONSTRAINT `order_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `password_reset_token`
--

DROP TABLE IF EXISTS `password_reset_token`;
CREATE TABLE `password_reset_token` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`email`,`token`),
  UNIQUE KEY `password_reset_token_token_unique` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `purchases`
--

DROP TABLE IF EXISTS `purchases`;
CREATE TABLE `purchases` (
  `id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `course_id` varchar(255) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `purchases_user_id_user_id_fk` (`user_id`),
  KEY `purchases_course_id_course_id_fk` (`course_id`),
  CONSTRAINT `purchases_course_id_course_id_fk` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `purchases_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchases`
--

INSERT INTO `purchases` VALUES
('02cfa3b4-64dd-4276-988a-2c9bbbb6caf6','46d13d88-9a5f-43b8-b379-8de4178d3320','b6ae734d-5a87-4d73-8962-da3a4b3d0b0f','2024-06-23 10:00:00'),
('0520f488-10e6-4685-80ce-18fabdb3d94d','06593b75-4be3-4af0-94d7-0c5f2da07eb9','ed5e4b00-54e0-4c8e-8c0f-edea05cbf72e','2024-06-08 10:00:00'),
('0a9deb6c-4f27-4d43-a3a2-a68d542adc2c','06593b75-4be3-4af0-94d7-0c5f2da07eb9','7bb1d7c7-554b-4e6f-97d2-a5f96cc307ae','2024-11-27 10:00:00'),
('0f81caf5-56d6-47d0-b841-ba0b26eab16c','06593b75-4be3-4af0-94d7-0c5f2da07eb9','6d4594ec-470f-4ea6-9848-863290082ddc','2024-03-12 10:00:00'),
('0f946ef5-1abf-4293-946e-f87c15c78786','06593b75-4be3-4af0-94d7-0c5f2da07eb9','afb81d6d-cccd-4540-b994-7c5d4d28f166','2024-04-09 10:00:00'),
('1518e895-c899-42b3-b03e-b3dec6714db6','06593b75-4be3-4af0-94d7-0c5f2da07eb9','35ab7285-388b-4a5f-a95d-578dd4b212f2','2024-06-03 10:00:00'),
('15acd89d-2e37-4dc6-a508-c81a5f95324a','46d13d88-9a5f-43b8-b379-8de4178d3320','4254cc6f-019e-4522-89f7-49ea5856d53a','2024-10-11 10:00:00'),
('20f08b00-5564-4150-a5c5-b00df103e91d','06593b75-4be3-4af0-94d7-0c5f2da07eb9','12070b91-e0ba-40bf-819e-ee8eeadc83df','2024-07-04 10:00:00'),
('24b0f409-8510-4d0f-8c74-6f25ce8579d5','46d13d88-9a5f-43b8-b379-8de4178d3320','f6c04836-9bc1-469a-bff0-0dd5dee5c04c','2024-10-01 10:00:00'),
('2ab20863-a1e2-4b07-a616-4dcb47a2c5a6','46d13d88-9a5f-43b8-b379-8de4178d3320','c7899d7f-7b8f-4a09-8000-c49e201499b2','2024-01-24 10:00:00'),
('42301bd6-e089-4775-8cc7-3e64cd9c4fa4','06593b75-4be3-4af0-94d7-0c5f2da07eb9','12070b91-e0ba-40bf-819e-ee8eeadc83df','2024-04-23 10:00:00'),
('4465c06f-4454-4718-a3cc-87dffd911921','46d13d88-9a5f-43b8-b379-8de4178d3320','4feba467-95dc-419a-8590-2058cdce4ff9','2024-09-21 10:00:00'),
('45024679-d3e7-4465-aacf-c1a59d19cc8e','06593b75-4be3-4af0-94d7-0c5f2da07eb9','1225d7ee-c976-4a92-8017-6054ec6faa93','2024-07-12 10:00:00'),
('45a342de-6e41-4026-b9f8-7a7f854aa1cb','06593b75-4be3-4af0-94d7-0c5f2da07eb9','bbeb271f-8f00-434e-a4a5-eac685eb7014','2024-11-09 10:00:00'),
('46215231-2b88-42cc-9a38-5e0b40ee495a','46d13d88-9a5f-43b8-b379-8de4178d3320','fdd95b16-e80d-40c5-a25f-972dbc317340','2024-08-14 10:00:00'),
('4b2ee1b1-f963-4b8a-997b-479913b33dbd','46d13d88-9a5f-43b8-b379-8de4178d3320','f1c3e718-e39f-4a07-ae31-ee49d15290d0','2024-04-09 10:00:00'),
('517e4d1e-b7c8-49c7-9dca-b75859ee1658','46d13d88-9a5f-43b8-b379-8de4178d3320','4254cc6f-019e-4522-89f7-49ea5856d53a','2024-02-25 10:00:00'),
('600f10f8-863a-4dca-ae7d-da6c74a5dc3f','06593b75-4be3-4af0-94d7-0c5f2da07eb9','e86be867-e649-4b93-9c9a-fa39c2091027','2024-08-05 10:00:00'),
('6747db17-9fd4-4cea-b845-2622730de89a','06593b75-4be3-4af0-94d7-0c5f2da07eb9','6e4d536b-8b76-40b7-a40c-717576bbba58','2024-02-25 10:00:00'),
('6bcbcf78-be9e-4972-a078-cffdfd0f08c9','06593b75-4be3-4af0-94d7-0c5f2da07eb9','4d2d3879-5ec4-4aa5-9413-d66b44844f91','2024-08-26 10:00:00'),
('709d0a2e-b91a-4098-894c-5a7b02c6adeb','06593b75-4be3-4af0-94d7-0c5f2da07eb9','f7728945-1eda-48bc-ad73-10913da8c0e1','2024-05-10 10:00:00'),
('7441388a-3836-4176-81b5-b7474dc45162','06593b75-4be3-4af0-94d7-0c5f2da07eb9','91d7944c-999d-4503-b96d-703f2d2877a4','2024-05-02 10:00:00'),
('7e1d7fff-dc3b-47a9-81d9-e5bdfab19fb2','06593b75-4be3-4af0-94d7-0c5f2da07eb9','0f90e57d-4404-407c-ac76-25f8f5e4b07c','2024-03-21 10:00:00'),
('803600a5-29d3-4581-a01a-836ef38ea422','06593b75-4be3-4af0-94d7-0c5f2da07eb9','c18df82d-b4fc-4569-a39d-b1adb4f510a2','2024-09-02 10:00:00'),
('816aebb2-4450-42b7-b049-1c77e19956c2','46d13d88-9a5f-43b8-b379-8de4178d3320','acb266d2-7455-4bc0-810c-ff6c088acdb4','2024-01-25 10:00:00'),
('950e9a4d-fa6b-4263-a24d-08e2b65c1e86','06593b75-4be3-4af0-94d7-0c5f2da07eb9','b057f09a-3d98-4c2f-ba57-aec91871d04b','2024-10-12 10:00:00'),
('aa568af6-aaa0-4eb4-9831-0aa194c42d90','06593b75-4be3-4af0-94d7-0c5f2da07eb9','4dbc1151-6377-4ed8-918a-a6574c59e018','2024-06-05 10:00:00'),
('ac04effd-892f-4b01-bf04-4ee593870683','06593b75-4be3-4af0-94d7-0c5f2da07eb9','d3d490a9-828a-48bb-b941-1f126d3202c8','2024-08-13 10:00:00'),
('b73cd90f-1878-40cf-8e86-960427818b0d','46d13d88-9a5f-43b8-b379-8de4178d3320','0e51fad8-15a9-46b9-8bf2-4be7cd149351','2024-05-25 10:00:00'),
('bcdd33ec-6a7b-49ca-aaa6-57187f1dd5a5','06593b75-4be3-4af0-94d7-0c5f2da07eb9','0ce861be-2a84-4045-84f4-27f68ac291ea','2024-09-25 10:00:00'),
('bd9e64ad-fbd3-41b3-855f-541db469413a','46d13d88-9a5f-43b8-b379-8de4178d3320','329a2391-9a97-41bd-b45f-593a34e16d2d','2024-11-25 10:00:00'),
('cae255ac-924d-401c-aeb7-fe49d453d108','06593b75-4be3-4af0-94d7-0c5f2da07eb9','f053064b-8d0e-48b3-8439-db7bdc99ea9f','2024-06-13 10:00:00'),
('cb49d219-cc8d-4bc6-9de5-34b463e52a85','06593b75-4be3-4af0-94d7-0c5f2da07eb9','4feba467-95dc-419a-8590-2058cdce4ff9','2024-07-24 10:00:00'),
('d19e2cc5-257c-47f8-bcc8-82196cd6da43','06593b75-4be3-4af0-94d7-0c5f2da07eb9','4d2d3879-5ec4-4aa5-9413-d66b44844f91','2024-05-16 10:00:00'),
('d1c786bf-76dc-4bce-a160-d8b179140574','46d13d88-9a5f-43b8-b379-8de4178d3320','12070b91-e0ba-40bf-819e-ee8eeadc83df','2024-02-22 10:00:00'),
('d649da94-2ae9-4c13-aff2-47f7081f2c66','06593b75-4be3-4af0-94d7-0c5f2da07eb9','aa765b0d-8d90-45c3-a5f9-027c59bd74e8','2024-07-07 10:00:00'),
('d7da9a30-784a-4e1c-8069-dc1a9e1ef720','46d13d88-9a5f-43b8-b379-8de4178d3320','fdd95b16-e80d-40c5-a25f-972dbc317340','2024-11-17 10:00:00'),
('db44a4fa-6c0b-4c5e-8263-59801a68d60a','06593b75-4be3-4af0-94d7-0c5f2da07eb9','12f1c8c7-b230-4824-8e94-715b5f902003','2024-03-10 10:00:00'),
('dd37dc14-5656-4808-b75c-3229509e6a56','46d13d88-9a5f-43b8-b379-8de4178d3320','9c407851-bcde-461d-91c3-2800c5aa56a2','2024-08-31 10:00:00'),
('ded62f28-b0ad-4128-aa22-f70ddead524f','06593b75-4be3-4af0-94d7-0c5f2da07eb9','b1ab7205-e53a-4c2a-a556-1a2f9f7c1e17','2024-05-08 10:00:00'),
('e58faa2f-2555-4287-a9d1-39aa29d26a4d','46d13d88-9a5f-43b8-b379-8de4178d3320','34cdbbae-947e-4803-85a7-1b4be6fa6eb7','2024-10-11 10:00:00'),
('f36d8fb1-e345-4033-ba93-ddb9a5fd27dd','06593b75-4be3-4af0-94d7-0c5f2da07eb9','baa93473-6baa-4af0-b0cc-75a416e95554','2024-08-02 10:00:00'),
('fa26379e-1b37-49d5-986e-62fbb71f85c1','46d13d88-9a5f-43b8-b379-8de4178d3320','b7ca4119-7e57-402a-b078-3952de6aea05','2024-04-06 10:00:00'),
('fa6a8517-5655-49bd-801a-d9758966f2e4','46d13d88-9a5f-43b8-b379-8de4178d3320','31fe5e1c-9414-4e8f-aba2-dcfdec231d9b','2024-10-24 10:00:00'),
('fa9172a4-0ddd-4d8d-a8df-be0bc4ceb14b','06593b75-4be3-4af0-94d7-0c5f2da07eb9','6c8478c3-b066-4746-a1b3-9155d4f6d5b3','2024-07-23 10:00:00'),
('fd70514a-d80c-4673-97b3-ca9a8c1928b0','46d13d88-9a5f-43b8-b379-8de4178d3320','f053064b-8d0e-48b3-8439-db7bdc99ea9f','2024-01-24 10:00:00');

--
-- Table structure for table `quiz_answer`
--

DROP TABLE IF EXISTS `quiz_answer`;
CREATE TABLE `quiz_answer` (
  `id` varchar(255) NOT NULL,
  `lesson_id` varchar(255) NOT NULL,
  `content` varchar(255) NOT NULL,
  `is_correct` tinyint(1) NOT NULL,
  `explanation` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `quiz_answer_lesson_id_lesson_id_fk` (`lesson_id`),
  CONSTRAINT `quiz_answer_lesson_id_lesson_id_fk` FOREIGN KEY (`lesson_id`) REFERENCES `lesson` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
CREATE TABLE `review` (
  `user_id` varchar(255) NOT NULL,
  `course_id` varchar(255) NOT NULL,
  `rating` int(11) NOT NULL,
  `content` varchar(255) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`user_id`,`course_id`),
  KEY `review_course_id_course_id_fk` (`course_id`),
  CONSTRAINT `review_course_id_course_id_fk` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `review_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `session`
--

DROP TABLE IF EXISTS `session`;
CREATE TABLE `session` (
  `sessionToken` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `expires` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`sessionToken`),
  KEY `session_userId_user_id_fk` (`userId`),
  CONSTRAINT `session_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `subscription`
--

DROP TABLE IF EXISTS `subscription`;
CREATE TABLE `subscription` (
  `id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `subscription_id` varchar(255) NOT NULL,
  `customer_id` varchar(255) NOT NULL,
  `price_id` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `current_period_end` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `subscription_user_id_user_id_fk` (`user_id`),
  CONSTRAINT `subscription_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `emailVerified` datetime(3) DEFAULT NULL,
  `role` enum('admin','user','teacher') NOT NULL DEFAULT 'user',
  `image` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` VALUES
('06593b75-4be3-4af0-94d7-0c5f2da07eb9','hoangsonj4f','hoangsonj4f@gmail.com','2024-12-02 00:29:18','user',NULL,'$2y$12$iP/xAKD1q.L5YHiBEASuk.zn21vrb5jF0SQfLkpTE4m9fpftMyDq2'),
('46d13d88-9a5f-43b8-b379-8de4178d3320','admin01','admin@gmail.com','2024-12-02 00:29:18','admin',NULL,'$2y$12$iP/xAKD1q.L5YHiBEASuk.zn21vrb5jF0SQfLkpTE4m9fpftMyDq2');

--
-- Table structure for table `user_lesson_progress`
--

DROP TABLE IF EXISTS `user_lesson_progress`;
CREATE TABLE `user_lesson_progress` (
  `user_id` varchar(255) NOT NULL,
  `lesson_id` varchar(255) NOT NULL,
  `is_completed` tinyint(1) DEFAULT 0,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`user_id`,`lesson_id`),
  KEY `user_lesson_progress_lesson_id_lesson_id_fk` (`lesson_id`),
  CONSTRAINT `user_lesson_progress_lesson_id_lesson_id_fk` FOREIGN KEY (`lesson_id`) REFERENCES `lesson` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `user_lesson_progress_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `verification_token`
--

DROP TABLE IF EXISTS `verification_token`;
CREATE TABLE `verification_token` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`email`,`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `wishlist`
--

DROP TABLE IF EXISTS `wishlist`;
CREATE TABLE `wishlist` (
  `user_id` varchar(255) NOT NULL,
  `course_id` varchar(255) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`user_id`,`course_id`),
  KEY `wishlist_course_id_course_id_fk` (`course_id`),
  CONSTRAINT `wishlist_course_id_course_id_fk` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `wishlist_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

SET FOREIGN_KEY_CHECKS=1;
SET UNIQUE_CHECKS=1;
