-- ============================================================
-- MODAGEST PRO
-- Script DDL final corregido
-- Compatible con MySQL 8 y MariaDB 10.4 o superior
-- ============================================================

CREATE DATABASE IF NOT EXISTS `modagest_pro`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `modagest_pro`;

SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS;
SET FOREIGN_KEY_CHECKS = 0;

-- Eliminar primero las tablas dependientes.
DROP TABLE IF EXISTS `carrito`;
DROP TABLE IF EXISTS `direcciones`;
DROP TABLE IF EXISTS `pagos`;
DROP TABLE IF EXISTS `detalle_ventas`;
DROP TABLE IF EXISTS `ventas`;
DROP TABLE IF EXISTS `productos`;
DROP TABLE IF EXISTS `categorias`;
DROP TABLE IF EXISTS `usuarios`;

-- ============================================================
-- USUARIOS
-- ============================================================

CREATE TABLE `usuarios` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `rol` ENUM('administrador', 'cliente', 'empleado') NOT NULL DEFAULT 'cliente',
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_usuarios_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- CATEGORÍAS
-- ============================================================

CREATE TABLE `categorias` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `imagen` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_categorias_nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- PRODUCTOS
-- ============================================================

CREATE TABLE `productos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(150) NOT NULL,
  `descripcion` TEXT DEFAULT NULL,
  `precio` DECIMAL(10,2) NOT NULL,
  `stock` INT NOT NULL DEFAULT 0,
  `imagen` VARCHAR(255) DEFAULT NULL,
  `imagenId` VARCHAR(255) DEFAULT NULL,
  `categoriaId` INT DEFAULT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_productos_categoriaId` (`categoriaId`),
  CONSTRAINT `fk_productos_categoria`
    FOREIGN KEY (`categoriaId`) REFERENCES `categorias` (`id`)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- VENTAS
-- ============================================================

CREATE TABLE `ventas` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `clienteId` INT DEFAULT NULL,
  `empleadoId` INT DEFAULT NULL,
  `total` DECIMAL(10,2) NOT NULL,
  `direccionEntrega` VARCHAR(255) DEFAULT NULL,
  `ciudadEntrega` VARCHAR(100) DEFAULT NULL,
  `telefonoEntrega` VARCHAR(20) DEFAULT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_ventas_clienteId` (`clienteId`),
  KEY `idx_ventas_empleadoId` (`empleadoId`),
  CONSTRAINT `fk_ventas_cliente`
    FOREIGN KEY (`clienteId`) REFERENCES `usuarios` (`id`)
    ON UPDATE CASCADE
    ON DELETE SET NULL,
  CONSTRAINT `fk_ventas_empleado`
    FOREIGN KEY (`empleadoId`) REFERENCES `usuarios` (`id`)
    ON UPDATE CASCADE
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- DETALLE DE VENTAS
-- ============================================================

CREATE TABLE `detalle_ventas` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `ventaId` INT NOT NULL,
  `productoId` INT NOT NULL,
  `cantidad` INT NOT NULL,
  `precio` DECIMAL(10,2) NOT NULL,
  `subtotal` DECIMAL(10,2) NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_detalle_ventas_ventaId` (`ventaId`),
  KEY `idx_detalle_ventas_productoId` (`productoId`),
  CONSTRAINT `fk_detalle_ventas_venta`
    FOREIGN KEY (`ventaId`) REFERENCES `ventas` (`id`)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT `fk_detalle_ventas_producto`
    FOREIGN KEY (`productoId`) REFERENCES `productos` (`id`)
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- PAGOS
-- Una venta solo puede tener un pago.
-- ============================================================

CREATE TABLE `pagos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `ventaId` INT NOT NULL,
  `metodoPago` VARCHAR(50) NOT NULL,
  `estado` VARCHAR(30) NOT NULL DEFAULT 'aprobado',
  `referencia` VARCHAR(100) DEFAULT NULL,
  `monto` DECIMAL(10,2) NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_pagos_ventaId` (`ventaId`),
  CONSTRAINT `fk_pagos_venta`
    FOREIGN KEY (`ventaId`) REFERENCES `ventas` (`id`)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- CARRITO
-- Un producto solo aparece una vez por usuario.
-- ============================================================

CREATE TABLE `carrito` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `usuarioId` INT NOT NULL,
  `productoId` INT NOT NULL,
  `cantidad` INT NOT NULL DEFAULT 1,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_carrito_usuario_producto` (`usuarioId`, `productoId`),
  KEY `idx_carrito_productoId` (`productoId`),
  CONSTRAINT `fk_carrito_usuario`
    FOREIGN KEY (`usuarioId`) REFERENCES `usuarios` (`id`)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT `fk_carrito_producto`
    FOREIGN KEY (`productoId`) REFERENCES `productos` (`id`)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- DIRECCIONES
-- ============================================================

CREATE TABLE `direcciones` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `direccion` VARCHAR(255) NOT NULL,
  `ciudad` VARCHAR(100) NOT NULL,
  `telefono` VARCHAR(20) NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  `clienteId` INT NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_direcciones_clienteId` (`clienteId`),
  CONSTRAINT `fk_direcciones_cliente`
    FOREIGN KEY (`clienteId`) REFERENCES `usuarios` (`id`)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;

-- ============================================================
-- COMPROBACIONES RECOMENDADAS DESPUÉS DE EJECUTAR EL SCRIPT
-- ============================================================

SHOW TABLES;
SHOW INDEX FROM `pagos` WHERE `Column_name` = 'ventaId';

-- El índice uq_pagos_ventaId debe mostrar Non_unique = 0.
