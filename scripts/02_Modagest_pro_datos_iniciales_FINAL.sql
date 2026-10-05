-- ============================================================
-- MODAGEST PRO
-- Script de datos iniciales / demostración
-- Ejecutar DESPUÉS de: 01_Modagest_pro_estructura_FINAL.sql
-- Base de datos: modagest_pro
-- ============================================================

USE `modagest_pro`;

SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS;
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- ------------------------------------------------------------
-- USUARIOS DE PRUEBA
-- Cada cuenta utiliza una contraseña de prueba diferente.
-- Las contraseñas se almacenan con bcrypt (10 rondas).
-- ------------------------------------------------------------

INSERT INTO `usuarios`
(`id`, `nombre`, `email`, `password`, `rol`, `createdAt`, `updatedAt`)
VALUES
(1, 'Administrador Demo', 'admin@modagest.com', '$2b$10$eQntgH61jGp8TREXArh9ZuLNFzSaKow6rAHNVD3xV0.i1Tm1bOXLa', 'administrador', NOW(), NOW()),
(2, 'Empleado Demo', 'empleado@modagest.com', '$2b$10$HFi7Fme8bwxYoUsaQeUF9uqmOA4wfFHZ2Qn6Bo3wIaex5cIXnRexu', 'empleado', NOW(), NOW()),
(3, 'Cliente Demo', 'cliente@modagest.com', '$2b$10$QF.iW.TgTXRwY3CjCSbYf.eDKwkm.lWj2LdvWg0qHRu48KEvqP/ki', 'cliente', NOW(), NOW());

-- ------------------------------------------------------------
-- CATEGORÍAS INICIALES
-- ------------------------------------------------------------

INSERT INTO `categorias` (`id`, `nombre`, `imagen`) VALUES
(1, 'Camisetas', NULL),
(2, 'Chaquetas', NULL),
(3, 'Pantalones', NULL),
(4, 'Tenis', NULL),
(5, 'Vestidos', NULL),
(6, 'Accesorios', NULL),
(7, 'Deportivos', NULL),
(8, 'Sudaderas', NULL),
(9, 'Jeans', NULL),
(10, 'Bolsos', NULL),
(11, 'Blusas', NULL),
(12, 'Faldas', NULL),
(13, 'Gorras', NULL),
(15, 'Gafas', NULL);

-- ------------------------------------------------------------
-- PRODUCTOS DE DEMOSTRACIÓN
-- Basados en registros reales de la base usada en ModaGest Pro.
-- ------------------------------------------------------------

INSERT INTO `productos`
(`id`, `nombre`, `descripcion`, `precio`, `stock`, `imagen`, `categoriaId`, `createdAt`, `updatedAt`)
VALUES
(1, 'Camiseta', 'Camiseta moderna deportiva', 45000.00, 15, 'camiseta.png', 1, NOW(), NOW()),
(2, 'Chaqueta de cuero', 'Chaqueta elegante negra', 120000.00, 10, 'chaqueta-de-cuero.png', 2, NOW(), NOW()),
(4, 'Pantalón', 'Pantalón casual moderno', 65000.00, 15, 'pantalon.png', 3, NOW(), NOW()),
(5, 'Tenis', 'Tenis deportivos unisex', 150000.00, 10, 'tenis.jpg', 4, NOW(), NOW()),
(11, 'Tenis Urbanos Blancos', 'Tenis urbanos blancos cómodos para uso diario.', 150000.00, 8, 'tenis-urbanos-blancos.png', 4, NOW(), NOW()),
(13, 'Blusa Elegante Satinada', 'Blusa femenina de tela satinada, diseño elegante y cómodo, ideal para ocasiones especiales y eventos.', 85000.00, 15, 'blusa-elegante-satinada.png', 11, NOW(), NOW()),
(14, 'Vestido Midi Elegante', 'Vestido midi elegante confeccionado en tela suave y ligera, con diseño femenino y moderno.', 129500.00, 12, 'vestido-elegante.png', 5, NOW(), NOW()),
(15, 'Gorra Elegante Rosa', 'Gorra de estilo urbano y sofisticado diseñada para uso casual.', 25000.00, 8, 'gorra.png', 13, NOW(), NOW());

-- ------------------------------------------------------------
-- DATOS TRANSACCIONALES
-- ventas, detalle_ventas, pagos, carrito y direcciones inician
-- vacías para que el instructor pueda probar los flujos del sistema.
-- ------------------------------------------------------------

COMMIT;

SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;

-- ------------------------------------------------------------
-- COMPROBACIÓN DE DATOS CARGADOS
-- ------------------------------------------------------------

SELECT `id`, `nombre`, `email`, `rol`
FROM `usuarios`
ORDER BY `id`;

SELECT COUNT(*) AS `total_categorias` FROM `categorias`;
SELECT COUNT(*) AS `total_productos` FROM `productos`;

-- ============================================================
-- CREDENCIALES DE PRUEBA
-- Administrador: admin@modagest.com / AdminMODAGESTPRO2026*$#
-- Empleado:      empleado@modagest.com / Empleado2026*
-- Cliente:       cliente@modagest.com / Cliente2026*
-- ============================================================
