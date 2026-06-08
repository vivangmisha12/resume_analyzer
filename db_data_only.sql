-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: Resume_Analyzer
-- ------------------------------------------------------
-- Server version	8.0.42
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `__efmigrationshistory`
--

LOCK TABLES `__efmigrationshistory` WRITE;
/*!40000 ALTER TABLE `__efmigrationshistory` DISABLE KEYS */;
INSERT  IGNORE INTO `__efmigrationshistory` VALUES ('20260607151320_InitialCreate','9.0.0');
/*!40000 ALTER TABLE `__efmigrationshistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `resumes`
--

LOCK TABLES `resumes` WRITE;
/*!40000 ALTER TABLE `resumes` DISABLE KEYS */;
INSERT  IGNORE INTO `resumes` VALUES (27,1,'vivang__mishra__full_stack (5).pdf','https://res.cloudinary.com/dnodl6md7/raw/upload/v1780916450/resumes/e93779e0-42b4-47ee-8fc3-7f71f7ed6692_vivang__mishra__full_stack %285%29.pdf',29,'Action Required','2026-06-08 11:00:54.205563','High experience relevance;Moderate project relevance','ASP.NET;Android','Develop Android development skills;Acquire ASP.NET proficiency;Build role-specific project experience'),(28,1,'vivang__mishra__full_stack (5).pdf','https://res.cloudinary.com/dnodl6md7/raw/upload/v1780916561/resumes/81ab6564-e4b2-4cbe-9984-8b6d194d88c8_vivang__mishra__full_stack %285%29.pdf',39,'Action Required','2026-06-08 11:03:06.681360','Proficient in React;Strong JavaScript fundamentals;Experience with HTML markup;Node.js development;Python programming;MongoDB data modeling;Version control using Git;Backend development with Express','CSS;Django;Flask;AWS;Azure;Docker;Artificial Intelligence (AI);REST API design','Complete targeted training or projects on CSS to complement front‑end work;Build a Django or Flask micro‑service to demonstrate server‑side Python expertise;Earn cloud fundamentals certifications (AWS, Azure) and create a simple deployed app;Learn containerization basics with Docker and containerize an existing Node/Express project;Study RESTful API principles and implement CRUD endpoints for a personal project;Explore introductory AI/ML libraries (e.g., scikit‑learn) to add a data‑driven feature');
/*!40000 ALTER TABLE `resumes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT  IGNORE INTO `users` VALUES (1,'Vivang Mishra','vivangmishra@gmail.com','123123','2026-06-07 16:57:55.503780'),(2,'Ritik Pandey','pandeyritik278@gmail.com','123123','2026-06-08 11:21:29.778728'),(3,'Raj Tiwari','raj@gmail.com','123123','2026-06-08 12:26:47.955961');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-08 20:26:01
