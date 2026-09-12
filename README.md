# ModaGest Pro

ModaGest Pro es una aplicación web para la gestión integral de tiendas de moda, ropa, calzado y accesorios. El sistema permite administrar usuarios, productos, categorías, inventario y ventas, además de ofrecer a los clientes un catálogo, carrito de compras, direcciones de entrega, pagos simulados e historial de compras.

El proyecto fue desarrollado como solución académica aplicando una arquitectura cliente-servidor, una API REST y control de acceso basado en roles.

## Repositorio

Código fuente e historial de desarrollo:

[Repositorio público de ModaGest Pro](https://github.com/AngieFajardo245/Modagest-pro.git)

## Periodo de desarrollo

El desarrollo de ModaGest Pro se realizó entre **mayo de 2026** y **septiembre de 2026**, mediante entregas incrementales registradas en Git.

## Funcionalidades principales

### Administrador

- Consulta del dashboard general.
- Gestión de usuarios y roles.
- Gestión de categorías.
- Creación, consulta, actualización y eliminación de productos.
- Administración del inventario y existencias.
- Consulta de ventas y estadísticas.

### Empleado

- Consulta del dashboard comercial.
- Consulta del catálogo y existencias.
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
- Chart.js y React Chart.js 2
- Recharts
- jsPDF y jsPDF AutoTable
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

### Herramientas

- Visual Studio Code
- MySQL Workbench
- Postman
- Git y GitHub

## Arquitectura

ModaGest Pro utiliza una arquitectura cliente-servidor dividida en dos aplicaciones:

- `frontend`: interfaz web desarrollada con React y Vite.
- `backend`: API REST desarrollada con Node.js y Express.
- MySQL: almacenamiento persistente de usuarios, categorías, productos, ventas, detalles, pagos y direcciones.

El frontend se comunica con el backend mediante solicitudes HTTP. Las rutas protegidas utilizan tokens JWT y autorización por roles.

## Requisitos previos

Antes de ejecutar el proyecto se requiere:

- Node.js 20 o superior.
- npm.
- MySQL Server 8 o superior.
- MySQL Workbench, opcional pero recomendado.
- Git.

## Instalación local

### 1. Clonar el repositorio

```bash
git clone https://github.com/AngieFajardo245/Modagest-pro.git
cd modagest-pro
```

Si la carpeta clonada utiliza otro nombre, ingrese a esa carpeta antes de continuar.

### 2. Instalar las dependencias del backend

```bash
npm --prefix backend install
```

### 3. Instalar las dependencias del frontend

```bash
npm --prefix frontend install
```

## Configuración de la base de datos

La entrega incluye dos scripts SQL:

1. `01_Modagest_pro_estructura_FINAL.sql`: crea la base de datos y sus tablas.
2. `02_Modagest_pro_datos_iniciales_FINAL.sql`: carga los datos iniciales.

### Importación con MySQL Workbench

1. Iniciar MySQL Server.
2. Abrir MySQL Workbench.
3. Conectarse al servidor local.
4. Abrir y ejecutar `01_Modagest_pro_estructura_FINAL.sql`.
5. Abrir y ejecutar `02_Modagest_pro_datos_iniciales_FINAL.sql`.
6. Actualizar la lista de esquemas y comprobar que la base de datos fue creada.

### Importación desde la terminal

Ejecutar primero la estructura y después los datos iniciales:

```bash
mysql -u root -p < 01_Modagest_pro_estructura_FINAL.sql
mysql -u root -p < 02_Modagest_pro_datos_iniciales_FINAL.sql
```

Los nombres o ubicaciones de los scripts pueden ajustarse según la carpeta en la que se encuentren.

## Variables de entorno

Dentro de `backend`, crear el archivo `.env` a partir de `.env.example`:

```powershell
Copy-Item backend/.env.example backend/.env
```

Configurar las variables requeridas por el backend. No se deben publicar contraseñas reales ni secretos en GitHub.

Ejemplo:

```env
JWT_SECRET=GENERA_UNA_CLAVE_ALEATORIA_DE_AL_MENOS_32_CARACTERES

ADMIN_EMAIL=admin@modagest.com
ADMIN_PASSWORD=DEFINE_UNA_CONTRASENA_DE_AL_MENOS_12_CARACTERES

PORT=5000
```

También se deben conservar en `.env` las variables de conexión a MySQL que utilice `backend/config/database.js`.

El archivo `.env` debe permanecer excluido de Git mediante `.gitignore`. El archivo `.env.example` sí puede incluirse porque no contiene credenciales reales.

## Ejecución del sistema

Se necesitan dos terminales abiertas.

### Terminal 1: backend

Desde la raíz del proyecto:

```bash
npm --prefix backend run dev
```

También se puede ejecutar ingresando a su carpeta:

```bash
cd backend
npm run dev
```

El backend estará disponible normalmente en:

```text
http://localhost:5000
```

### Terminal 2: frontend

Desde la raíz del proyecto:

```bash
npm --prefix frontend run dev
```

También se puede ejecutar ingresando a su carpeta:

```bash
cd frontend
npm run dev
```

El frontend estará disponible normalmente en:

```text
http://localhost:5173
```

## Comandos disponibles

### Frontend

```bash
npm --prefix frontend run dev
npm --prefix frontend run lint
npm --prefix frontend run build
npm --prefix frontend run preview
```

### Backend

```bash
npm --prefix backend run dev
npm --prefix backend test
```

## Pruebas y validación

El proyecto cuenta con las siguientes verificaciones:

- Validación estática del frontend mediante ESLint.
- Compilación de producción mediante Vite.
- Pruebas automatizadas del backend con Node Test Runner.
- Pruebas de autenticación y autorización.
- Pruebas de API realizadas con Postman.
- Pruebas funcionales para administrador, empleado y cliente.

Comandos de verificación:

```bash
npm --prefix frontend run lint
npm --prefix frontend run build
npm --prefix backend test
```

Resultado de la última validación:

- Frontend: cero errores y cero advertencias de ESLint.
- Frontend: compilación de producción completada correctamente.
- Backend: 10 pruebas aprobadas de 10 ejecutadas.

La advertencia de Vite relacionada con fragmentos mayores a 500 kB no impide la compilación ni la ejecución del sistema.

## Usuarios de prueba

ModaGest Pro dispone de cuentas de demostración para los roles administrador, empleado y cliente.

Por seguridad, las credenciales de acceso se entregan al instructor mediante un documento privado independiente y no se publican en el repositorio.

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
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
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
│   │   ├── routes/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

La estructura puede incluir archivos adicionales correspondientes a documentación, scripts SQL y evidencias del proyecto.

## Seguridad

- Las contraseñas se almacenan mediante hash con bcrypt.
- La autenticación utiliza tokens JWT.
- Las rutas privadas validan el token del usuario.
- Los permisos se controlan según los roles administrador, empleado y cliente.
- Las compras verifican la sesión, los productos, las cantidades y el stock.
- La pasarela incluida es una simulación académica y no realiza cobros reales.
- Los secretos y credenciales reales no deben subirse al repositorio.

## Documentación

La documentación académica de ModaGest Pro incluye:

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
- Plan de migración, respaldo, mantenimiento, soporte y capacitación.

## Estado del proyecto

ModaGest Pro se encuentra funcional para fines académicos. Los módulos principales fueron implementados, verificados localmente y respaldados en el repositorio público.

## Autoría

Desarrollado por:

- **ANGIE LORENA FAJARDO NUÑEZ**
- **Servicio Nacional de Aprendizaje (SENA)**
- Programa: **ANALISIS Y DESARROLLO DE SOFTWARE**
- Ficha: **2977373**

## Derechos de autor

Copyright © 2026. Todos los derechos reservados por la autora de ModaGest Pro.

Este proyecto fue desarrollado con fines académicos. No se autoriza su reproducción, distribución, comercialización o modificación por terceros sin la autorización expresa de sus autoras.
