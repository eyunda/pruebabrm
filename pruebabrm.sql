/*
SQLyog Community v13.2.0 (64 bit)
MySQL - 10.4.32-MariaDB : Database - inventario_db
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`inventario_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `inventario_db`;

/*Table structure for table `compras` */

DROP TABLE IF EXISTS `compras`;

CREATE TABLE `compras` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `productoId` int(11) DEFAULT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `estado` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `compras` */

insert  into `compras`(`id`,`productoId`,`cantidad`,`estado`,`created_at`) values 
(5,2,2,2,'2024-06-27 21:00:11'),
(6,4,6,2,'2024-06-27 21:00:11'),
(7,2,3,2,'2024-06-27 21:52:22'),
(8,4,3,2,'2024-06-27 21:52:22'),
(9,2,9,2,'2024-06-27 22:28:12'),
(10,4,9,2,'2024-06-27 22:28:12'),
(11,2,4,2,'2024-06-27 22:36:33'),
(12,4,4,2,'2024-06-27 22:36:33'),
(13,2,2,1,'2024-06-27 22:38:00'),
(14,4,1,1,'2024-06-27 22:38:00');

/*Table structure for table `links` */

DROP TABLE IF EXISTS `links`;

CREATE TABLE `links` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(150) NOT NULL,
  `url` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_user` (`user_id`),
  CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `links` */

/*Table structure for table `productos` */

DROP TABLE IF EXISTS `productos`;

CREATE TABLE `productos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `numeroLote` varchar(50) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `cantidadDisponible` int(11) NOT NULL,
  `fechaIngreso` date NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `productos` */

insert  into `productos`(`id`,`numeroLote`,`nombre`,`precio`,`cantidadDisponible`,`fechaIngreso`,`createdAt`,`updatedAt`) values 
(2,'L001','Productosassaas 3',1600000.00,100,'2024-06-21','2024-06-27 17:07:23','2024-06-27 18:20:25'),
(4,'pruebas nuevas','pruebas nuevas',1500000.00,15,'2024-06-27','2024-06-27 18:20:43','2024-06-27 18:20:43');

/*Table structure for table `products` */

DROP TABLE IF EXISTS `products`;

CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lotNumber` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity` int(11) NOT NULL,
  `entryDate` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `products` */

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `user` varchar(100) NOT NULL,
  `pass` varchar(60) NOT NULL,
  `rol` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `users` */

insert  into `users`(`id`,`name`,`user`,`pass`,`rol`,`created_at`) values 
(1,'','john@gmail.com','123456','','2024-06-27 14:15:21'),
(2,'ENDERSON YUNDA SANCHEZ','enderson_yundasa@fet.edu.co','$2a$08$.mbilkCQTErr2gHB5LAF8uaF1uKpK0hx8cwgzbNsHjXWz6qbxDHQe','','2024-06-27 14:56:18'),
(3,'pruebas nuevas','pruebas','$2a$08$36Ndn0WkCAZYxTu9Ym4Hte.ucrAY3buQJ8L/OB8EjAa8zXenzm3Aa','Administrador','2024-06-27 16:13:54'),
(4,'Enderson','pruebas1','$2a$08$wzkLVavjrQkporYUw1dg4OnMu6R376YeO5Cf5ETL26E7rnhHaVAJy','Cliente','2024-06-27 18:24:58');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
