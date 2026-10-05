# ModaGest Pro

ModaGest Pro es una aplicación web para la gestión integral de tiendas de moda, ropa, calzado y accesorios. Permite administrar usuarios, productos, categorías, inventario y ventas. También ofrece a los clientes un catálogo, carrito de compras, direcciones de entrega, pagos simulados e historial de compras.

El proyecto fue desarrollado como solución académica mediante una arquitectura cliente-servidor, una API REST y control de acceso basado en roles.

## Aplicación desplegada

- Aplicación web: https://modagest-pro-frontend.onrender.com
- API REST: https://modagest-pro.onrender.com
- Repositorio público: https://github.com/AngieFajardo245/Modagest-pro

El backend utiliza una instancia gratuita de Render, por lo que la primera solicitud puede tardar aproximadamente 50 segundos mientras el servicio se activa.

## Periodo de desarrollo

ModaGest Pro fue desarrollado entre **marzo de 2026** y **octubre de 2026**, mediante entregas incrementales registradas con Git.

## Funcionalidades principales

### Administrador

- Consulta del panel administrativo.
- Gestión de usuarios y roles.
- Gestión de categorías.
- Creación, consulta, actualización y eliminación de productos.
- Administración del inventario y las existencias.
- Consulta de ventas y estadísticas.

### Empleado

- Consulta del panel comercial.
- Consulta del catálogo y las existencias.
- Registro de ventas.
- Consulta del historial de ventas.

### Cliente

- Consulta del panel del cliente.
- Exploración y filtrado del catálogo.
- Carrito independiente por cliente.
- Gestión de direcciones de entrega.
- Compra mediante una pasarela de pago simulada.
- Métodos de pago: tarjeta, PSE, Nequi y contraentrega.
- Consulta del historial de compras.

## Tecnologías utilizadas

### Frontend

- React 19
- Vite 7
- React Router DOM
- Axios
- Bootstrap
- React Icons
- Chart.js
- React Chart.js 2
- Recharts
- jsPDF
- jsPDF AutoTable
- XLSX

### Backend

- Node.js
- Express
- Sequelize
- MySQL
- JSON Web Token
- bcrypt
- Multer
- CORS
- dotenv
- ImageKit

### Servicios en la nube

- Render: despliegue del frontend y backend.
- Aiven: base de datos MySQL.
- ImageKit: almacenamiento persistente de imágenes de productos.
- GitHub: repositorio y control de versiones.

### Herramientas de desarrollo

- Visual Studio Code
- MySQL Workbench
- Postman
- Git y GitHub

## Arquitectura

ModaGest Pro utiliza una arquitectura cliente-servidor:

- `frontend`: interfaz web desarrollada con React y Vite.
- `backend`: API REST desarrollada con Node.js y Express.
- MySQL: almacenamiento persistente de usuarios, categorías, productos, ventas, detalles, pagos y direcciones.
- ImageKit: almacenamiento persistente de las imágenes cargadas por el administrador.

El frontend se comunica con el backend mediante solicitudes HTTP. Las rutas privadas utilizan tokens JWT y autorización basada en los roles administrador, empleado y cliente.

## Requisitos previos

Para ejecutar el proyecto localmente se requiere:

- Node.js 20 o superior.
- npm.
- MySQL Server 8 o superior.
- MySQL Workbench, opcional pero recomendado.
- Git.

## Instalación local

### 1. Clonar el repositorio

```bash
git clone https://github.com/AngieFajardo245/Modagest-pro.git
cd Modagest-pro
```

### 2. Instalar las dependencias

```bash
npm --prefix backend install
npm --prefix frontend install
```

## Configuración de la base de datos

El repositorio incluye los siguientes scripts:

1. `scripts/01_Modagest_pro_estructura_FINAL.sql`: crea la base de datos y sus tablas.
2. `scripts/02_Modagest_pro_datos_iniciales_FINAL.sql`: carga los datos iniciales de demostración.

### Importación con MySQL Workbench

1. Iniciar MySQL Server.
2. Abrir MySQL Workbench.
3. Conectarse al servidor MySQL.
4. Ejecutar `scripts/01_Modagest_pro_estructura_FINAL.sql`.
5. Ejecutar `scripts/02_Modagest_pro_datos_iniciales_FINAL.sql`.
6. Actualizar la lista de esquemas y comprobar la creación de `modagest_pro`.

### Importación desde la terminal

```bash
mysql -u root -p < scripts/01_Modagest_pro_estructura_FINAL.sql
mysql -u root -p < scripts/02_Modagest_pro_datos_iniciales_FINAL.sql
```

## Variables de entorno

### Backend

Crear `backend/.env` a partir de `backend/.env.example`:

```powershell
Copy-Item backend/.env.example backend/.env
```

Configurar las siguientes variables:

```env
DB_HOST=localhost
DB_PORT=3306
DB_SSL=false
DB_NAME=modagest_pro
DB_USER=TU_USUARIO_MYSQL
DB_PASSWORD=TU_CONTRASENA_MYSQL

JWT_SECRET=GENERA_UNA_CLAVE_ALEATORIA_SEGURA

ADMIN_EMAIL=admin@modagest.com
ADMIN_PASSWORD=DEFINE_UNA_CONTRASENA_SEGURA

PORT=5000
FRONTEND_URL=http://localhost:5173

IMAGEKIT_PRIVATE_KEY=TU_CLAVE_PRIVADA_DE_IMAGEKIT
```

`IMAGEKIT_PRIVATE_KEY` permite almacenar las imágenes en ImageKit. Si no se configura durante el desarrollo local, el backend utiliza la carpeta local `backend/uploads`.

### Frontend

Crear `frontend/.env` a partir de `frontend/.env.example`:

```powershell
Copy-Item frontend/.env.example frontend/.env
```

Configurar:

```env
VITE_API_URL=http://localhost:5000
```

Los archivos `.env` contienen datos sensibles y deben permanecer excluidos de Git. Los archivos `.env.example` solo contienen valores de referencia.

## Ejecución local

Se necesitan dos terminales.

### Terminal 1: backend

```bash
npm --prefix backend start
```

Backend local:

```text
http://localhost:5000
```

### Terminal 2: frontend

```bash
npm --prefix frontend run dev
```

Frontend local:

```text
http://localhost:5173
```

## Comandos de validación

### Frontend

```bash
npm --prefix frontend run dev
npm --prefix frontend run lint
npm --prefix frontend run build
npm --prefix frontend run preview
```

### Backend

```bash
npm --prefix backend start
npm --prefix backend test
```

## Pruebas realizadas

El proyecto cuenta con las siguientes verificaciones:

- Validación estática del frontend mediante ESLint.
- Compilación de producción mediante Vite.
- Pruebas automatizadas del backend con Node Test Runner.
- Pruebas de autenticación y autorización.
- Pruebas de API realizadas con Postman.
- Pruebas funcionales de los roles administrador, empleado y cliente.
- Validación del flujo completo de compra y actualización de inventario.
- Validación de creación, actualización y eliminación de imágenes con ImageKit.
- Validación del despliegue en Render y la persistencia de datos en Aiven.

Resultado de la última validación:

- Frontend: cero errores de ESLint.
- Frontend: compilación de producción completada correctamente.
- Backend: 10 pruebas aprobadas de 10 ejecutadas.
- Despliegue: frontend y backend activos en Render.

La advertencia de Vite relacionada con fragmentos mayores a 500 kB no impide la compilación ni la ejecución del sistema.

## Usuarios de prueba

ModaGest Pro dispone de cuentas de demostración para los roles administrador, empleado y cliente.

Por seguridad, las credenciales se entregan al instructor mediante un documento privado independiente y no se publican en el repositorio.

| Rol | Disponibilidad |
| --- | --- |
| Administrador | Cuenta disponible para evaluación |
| Empleado | Cuenta disponible para evaluación |
| Cliente | Cuenta disponible para evaluación |

## Estructura general

```text
modagest-pro/
├── backend/
│   ├── config/
│   ├── middlewares/
│   ├── models/
│   ├── tests/
│   ├── uploads/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
├── scripts/
│   ├── 01_Modagest_pro_estructura_FINAL.sql
│   ├── 02_Modagest_pro_datos_iniciales_FINAL.sql
│   └── respaldo_modagest.ps1
├── .gitignore
└── README.md
```

## Seguridad

- Las contraseñas se almacenan mediante hash con bcrypt.
- La autenticación utiliza tokens JWT.
- Las rutas privadas validan la identidad del usuario.
- Los permisos se controlan mediante roles.
- CORS limita los orígenes autorizados.
- Las compras validan sesión, productos, cantidades y existencias.
- Las imágenes admitidas son JPG, PNG y WEBP, con un tamaño máximo de 2 MB.
- La pasarela de pago es una simulación académica y no realiza cobros reales.
- Los secretos y credenciales reales no se almacenan en el repositorio.

## Documentación académica

La documentación de ModaGest Pro incluye:

- Especificación de requisitos IEEE 830.
- Historias de usuario.
- Casos de uso y plantillas extendidas.
- Diagramas de clases, actividades, componentes y despliegue.
- Diagrama entidad-relación y diccionario de datos.
- Mapa de empatía y Lean Canvas.
- Documento técnico de diseño.
- Propuesta técnica y económica.
- Manual técnico.
- Manual de usuario.
- Informe de resultados de pruebas.
- Planes de migración, respaldo, mantenimiento, soporte y capacitación.

## Estado del proyecto

ModaGest Pro se encuentra funcional y desplegado en la nube para fines académicos. Sus módulos principales fueron implementados, probados y respaldados en el repositorio público.

## Autoría

Desarrollado por:

- **ANGIE LORENA FAJARDO NUÑEZ**
- **Servicio Nacional de Aprendizaje (SENA)**
- Programa: **ANÁLISIS Y DESARROLLO DE SOFTWARE**
- Ficha: **2977373**

## Derechos de autor

Copyright © 2026. Todos los derechos reservados por la autora de ModaGest Pro.

Este proyecto fue desarrollado con fines académicos. No se autoriza su reproducción, distribución, comercialización o modificación por terceros sin la autorización expresa de su autora.