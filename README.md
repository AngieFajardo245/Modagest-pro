# ModaGest Pro

ModaGest Pro es una aplicación web para la gestión de tiendas de ropa, calzado y accesorios. Permite administrar usuarios, categorías, productos, inventario y ventas. Los clientes pueden explorar el catálogo, gestionar su carrito y sus direcciones, realizar compras con pagos simulados y consultar su historial.

Proyecto académico individual desarrollado en el Servicio Nacional de Aprendizaje (SENA), mediante una arquitectura cliente-servidor, una API REST y acceso basado en roles.

## Aplicación y repositorio

| Recurso | Dirección |
| --- | --- |
| Aplicación web | https://modagest-pro-frontend.onrender.com |
| API REST | https://modagest-pro.onrender.com |
| Código fuente | https://github.com/AngieFajardo245/Modagest-pro |

Render aloja el frontend y el backend, Aiven proporciona MySQL e ImageKit almacena las imágenes de productos. Si el backend está inactivo, su primera respuesta puede tardar mientras se reactiva. Antes de repetir una compra o venta, comprobar si la primera operación se registró.

## Periodo y control de versiones

El desarrollo inicial se realizó entre marzo y septiembre de 2026. Los ajustes de interfaz, despliegue y documentación continuaron durante octubre de 2026.

Las evidencias históricas corresponden a `master`. Los ajustes de despliegue se trabajan en `ajustes-despliegue`. Consultar el historial completo para revisar las fechas y los cambios realmente registrados; el periodo declarado no sustituye esa evidencia.

```powershell
git branch --show-current
git log -1 --oneline
git log --all --date=short --format="%h %ad %an %s"
```

## Funcionalidades

### Administrador

- Panel con indicadores generales.
- Gestión de usuarios y roles.
- Gestión de categorías y productos con imágenes.
- Administración de existencias.
- Consulta de ventas y estadísticas.

### Empleado

- Panel comercial.
- Consulta de productos y existencias.
- Registro de ventas.
- Consulta de su historial de ventas.

### Cliente

- Panel del cliente y catálogo con filtros.
- Carrito independiente por cliente.
- Gestión de direcciones de entrega.
- Compra con tarjeta, PSE, Nequi o Contra Entrega simuladas.
- Historial de compras.

La solución es una aplicación web adaptable a escritorio y móvil. Los pagos son académicos y no procesan dinero real.

## Tecnologías y arquitectura

| Componente | Tecnologías |
| --- | --- |
| Frontend | React 19, Vite 7, React Router DOM, Axios, Bootstrap, React Icons |
| Gráficos y exportación | Chart.js, react-chartjs-2, Recharts, jsPDF, jspdf-autotable, XLSX |
| Backend | Node.js, Express 4, Sequelize 6, mysql2, JSON Web Token, bcrypt, Multer, CORS, dotenv, ExcelJS |
| Imágenes | SDK de ImageKit; almacenamiento local alternativo durante desarrollo |
| Verificación | Node Test Runner, ESLint, Vite y Postman |

Las versiones de las dependencias se declaran en los archivos `package.json` y quedan fijadas, junto con sus dependencias transitivas, en `package-lock.json`.

El frontend consulta la API mediante HTTP y Axios. El backend concentra sus rutas en `server.js`, con modelos, configuración y middlewares separados; Sequelize accede a MySQL. Las rutas privadas utilizan JWT y autorización por rol.

## Requisitos locales

- Windows con PowerShell para seguir los ejemplos de esta guía.
- Node.js 22.12 o superior de la rama 22, con npm, compatible con Vite 7.
- MySQL Server 8 y cliente `mysql`, con el servicio activo.
- Git y navegador actualizado.
- MySQL Workbench, opcional para administrar e importar la base.
- Puertos locales 3306, 5000 y 5173 disponibles.

```powershell
git --version
node --version
npm --version
mysql --version
Get-Service *mysql*
```

Si `mysql` no se reconoce, añadir su carpeta `bin` a PATH o usar la ruta de instalación, por ejemplo:

```powershell
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" --version
```

## Instalación local

Los comandos siguientes se ejecutan desde la raíz del proyecto, salvo indicación.

### 1 Clonar e instalar dependencias

```powershell
git clone --branch ajustes-despliegue https://github.com/AngieFajardo245/Modagest-pro.git
cd Modagest-pro
npm --prefix backend ci
npm --prefix frontend ci
```

`npm ci` instala las versiones fijadas en los archivos de bloqueo. En una copia existente, revisar `git status` antes de actualizarla.

### 2 Preparar MySQL

Scripts incluidos:

1. `scripts/01_Modagest_pro_estructura_FINAL.sql`: estructura de la base.
2. `scripts/02_Modagest_pro_datos_iniciales_FINAL.sql`: datos iniciales de demostración.

**Usar una instancia local de evaluación.** El SQL de estructura contiene `DROP TABLE` y los archivos seleccionan `modagest_pro`. No ejecutarlos sobre Aiven ni sobre una base cuyos datos deban conservarse. La selección previa de otro esquema no redirige las instrucciones `USE` incluidas en un SQL.

Desde PowerShell, abrir el cliente MySQL en la raíz del proyecto:

```powershell
mysql -h localhost -P 3306 -u root -p
```

Introducir la contraseña local cuando se solicite. Dentro del cliente MySQL, ejecutar:

```sql
CREATE DATABASE IF NOT EXISTS modagest_pro CHARACTER SET utf8mb4;
USE modagest_pro;
SOURCE scripts/01_Modagest_pro_estructura_FINAL.sql;
USE modagest_pro;
SOURCE scripts/02_Modagest_pro_datos_iniciales_FINAL.sql;
USE modagest_pro;
SHOW TABLES;
SELECT COUNT(*) AS usuarios FROM usuarios;
SELECT COUNT(*) AS productos FROM productos;
EXIT;
```

`SOURCE` se escribe dentro del cliente MySQL, no directamente en PowerShell. Si se abre desde otra carpeta, usar rutas absolutas con barras `/`.

Como alternativa, abrir Workbench conectado al servidor local y ejecutar primero el SQL de estructura y después el de datos. Revisar los mensajes de ejecución y actualizar Schemas.

Configurar el backend con una cuenta MySQL autorizada para operar sobre `modagest_pro`. Esa cuenta es diferente de los usuarios administrador, empleado y cliente de la aplicación.

### 3 Configurar el backend

Crear el archivo solo si todavía no existe:

```powershell
if (!(Test-Path backend/.env)) {
    Copy-Item backend/.env.example backend/.env
}
notepad backend/.env
```

Contenido de referencia:

```dotenv
DB_HOST=localhost
DB_PORT=3306
DB_SSL=false
DB_NAME=modagest_pro
DB_USER=TU_USUARIO_MYSQL
DB_PASSWORD="TU_CONTRASENA_MYSQL"
JWT_SECRET=TU_CLAVE_ALEATORIA
ADMIN_EMAIL=admin@modagest.com
ADMIN_PASSWORD="TU_CONTRASENA_ADMINISTRADOR"
PORT=5000
FRONTEND_URL=http://localhost:5173
IMAGEKIT_PRIVATE_KEY=
```

Sustituir los valores de referencia. `DB_PASSWORD` y `JWT_SECRET` no pueden estar vacíos. `ADMIN_PASSWORD` debe tener al menos 12 caracteres. Conservar las comillas en contraseñas que incluyan `#`, para que dotenv lea el valor completo.

Generar una clave para `JWT_SECRET`:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copiar el resultado en el archivo. Cambiar esta clave invalida las sesiones emitidas con la anterior.

Al iniciar, el backend crea o actualiza la cuenta de `ADMIN_EMAIL`: asigna la contraseña configurada y el rol administrador. Elegir deliberadamente la cuenta de prueba; no utilizar el correo de otro usuario. Para usar la cuenta administradora del SQL inicial, configurar los valores indicados en el documento privado de acceso.

Con `IMAGEKIT_PRIVATE_KEY` vacío, las nuevas imágenes se guardan en `backend/uploads`. Las URL remotas existentes siguen dependiendo de ImageKit. Las imágenes locales deben conservarse por separado: el SQL no incluye sus archivos físicos.

### 4 Configurar el frontend

Crear `frontend/.env.local` con:

```dotenv
VITE_API_URL=http://localhost:5000
```

La URL es pública para el navegador. No colocar contraseñas ni claves privadas en variables `VITE_`. Reiniciar Vite después de modificar el entorno.

### 5 Iniciar los servicios

Primera terminal, backend:

```powershell
npm --prefix backend run dev
```

También puede usarse `npm --prefix backend start`, sin vigilancia de cambios. Elegir una sola opción. Esperar la conexión a MySQL y el inicio en el puerto 5000.

Segunda terminal, frontend:

```powershell
npm --prefix frontend run dev -- --host localhost --port 5173 --strictPort
```

Abrir http://localhost:5173. `--strictPort` evita que Vite cambie de puerto; el origen debe coincidir con la configuración de CORS. Mantener ambas terminales abiertas y detener cada proceso con `Ctrl+C`.

### 6 Comprobar la instalación

```powershell
Invoke-RestMethod -Uri 'http://localhost:5000/' -Method Get
Invoke-RestMethod -Uri 'http://localhost:5000/productos' -Method Get
```

Verificar acceso con cada rol, imágenes, productos, dirección de entrega y una compra simulada con datos de prueba. Comparar historial y existencias antes y después. La ruta de autenticación de la API es `POST /auth/login`.

## Validación y pruebas

```powershell
npm --prefix backend test
npm --prefix frontend run lint
npm --prefix frontend run build
```

El build genera `frontend/dist`. Para revisar esa compilación local, detener el servidor de desarrollo y ejecutar:

```powershell
npm --prefix frontend run preview -- --host localhost --port 5173 --strictPort
```

La API debe permanecer activa. Vite preview permite revisar el build y no sustituye el alojamiento de producción.

El informe de resultados conserva las ejecuciones y sus evidencias. En la revisión técnica del 21 de octubre de 2026 sobre `75586d1`:

- Las diez pruebas unitarias de middlewares completaron correctamente.
- La compilación del frontend completó con una advertencia por fragmentos mayores de 500 kB.
- ESLint detectó dos errores en `DashboardEmpleado.jsx`; una propuesta corregida pasó en una copia aislada, sin acreditar su publicación.
- La auditoría registró dependencias con avisos de seguridad y se identificó la exposición del hash en la respuesta de registro.

Estos resultados corresponden a esa referencia. Repetir las verificaciones y registrar la revisión utilizada después de corregir el código. Las once aserciones históricas de Postman y las capturas anteriores no se presentan como una nueva campaña sobre el despliegue actual. La aceptación formal se registra por separado con resultados y firmas reales.

## Configuración del despliegue

### Backend en Render

| Parámetro | Valor |
| --- | --- |
| Tipo | Web Service |
| Rama | `ajustes-despliegue`, o la rama final comprobada |
| Root Directory | `backend` |
| Build Command | `npm ci` |
| Start Command | `npm start` |
| Health Check Path | `/` |
| Node.js | Rama 22 con versión igual o superior a 22.12 |

Configurar en el entorno del servicio:

```dotenv
DB_HOST=HOST_DE_AIVEN
DB_PORT=PUERTO_DE_AIVEN
DB_NAME=modagest_pro
DB_USER=USUARIO_DE_AIVEN
DB_PASSWORD=CONTRASENA_PRIVADA_DE_AIVEN
DB_SSL=true
JWT_SECRET=CLAVE_PRIVADA_DEL_AMBIENTE
ADMIN_EMAIL=CORREO_ADMINISTRADOR_CONFIGURADO
ADMIN_PASSWORD=CONTRASENA_ADMINISTRADOR_CONFIGURADA
FRONTEND_URL=https://modagest-pro-frontend.onrender.com
IMAGEKIT_PRIVATE_KEY=CLAVE_PRIVADA_DE_IMAGEKIT
```

En los campos de Render se ingresan los valores reales directamente, sin agregar las comillas usadas en un archivo `.env`. Render proporciona `PORT` como puerto interno del servicio. No sustituir la configuración existente por los valores locales.

En el código revisado, `DB_SSL=true` activa TLS con `rejectUnauthorized:false`; queda pendiente verificar la identidad del servidor mediante CA en el backend. Esto es diferente de la verificación `VERIFY_IDENTITY` utilizada por los clientes de respaldo.

### Frontend en Render

| Parámetro | Valor |
| --- | --- |
| Tipo | Static Site |
| Rama | La rama final comprobada |
| Root Directory | `frontend` |
| Build Command | `npm ci && npm run build` |
| Publish Directory | `dist` |
| Variable | `VITE_API_URL=https://modagest-pro.onrender.com` |
| Rewrite | `/*` hacia `/index.html`, acción Rewrite |

La reescritura permite recargar rutas internas como `/admin` o `/cliente`. Los cambios de `VITE_API_URL` requieren recompilar el frontend.

Con Auto Deploy habilitado, el push a la rama vinculada inicia la actualización. Comprobar su finalización y el commit activo de cada servicio. Un push no confirma por sí solo el despliegue correcto de ambos componentes.

La base existente en Aiven no debe reinicializarse para publicar cambios de código. Las migraciones y restauraciones siguen el plan de migración y respaldo.

## Usuarios de prueba

Las credenciales de demostración de administrador, empleado y cliente se entregan al evaluador por un medio independiente. Las cuentas del SQL inicial corresponden al entorno local preparado; los accesos del servicio publicado deben comprobarse con sus credenciales vigentes.

No publicar contraseñas, tokens JWT ni claves de Aiven o ImageKit en este README.

## Organización del código

| Ruta | Contenido |
| --- | --- |
| `backend/server.js` | Arranque y rutas de la API |
| `backend/config/` | Configuración de la base de datos |
| `backend/models/` | Modelos de Sequelize |
| `backend/middlewares/` | Autenticación, autorización y carga de imágenes |
| `backend/tests/` | Pruebas automatizadas |
| `backend/uploads/` | Imágenes locales; excluidas de Git |
| `frontend/src/` | Componentes, páginas, rutas, servicios y recursos |
| `frontend/src/services/api.js` | Cliente Axios y configuración de la API |
| `scripts/` | Estructura SQL, datos de demostración y utilidades de respaldo |
| `README.md` | Presentación e instrucciones del proyecto |

## Respaldo y seguridad

Las contraseñas de usuarios se almacenan con bcrypt y las rutas privadas validan JWT y permisos. Las compras comprueban dirección propia, productos, cantidades y existencias. Las imágenes admitidas son JPG, PNG y WEBP, con un límite de 2 MB.

Mantener fuera de Git los archivos de entorno con secretos, respaldos del servicio publicado y credenciales. Las plantillas `.env.example` contienen referencias. El respaldo de MySQL debe complementarse con la conservación de las imágenes.

El plan de migración documenta el ensayo de restauración y la tarea de respaldo de Aiven configurada en el equipo de desarrollo. Ese perfil de MySQL y la tarea de Windows no se crean al clonar el repositorio. La guía técnica y el plan describen sus requisitos, resultados y pendientes.

## Problemas frecuentes

- **MySQL Access denied:** revisar usuario, contraseña y permisos del entorno local.
- **Unknown database:** comprobar la importación y `DB_NAME`.
- **Puerto ocupado:** detener una instancia anterior y mantener los puertos acordados.
- **Error CORS:** revisar `FRONTEND_URL`, `VITE_API_URL` y el origen abierto en el navegador.
- **401:** iniciar sesión nuevamente y comprobar el token.
- **403:** comprobar que el rol tenga permiso para la operación.
- **Imágenes ausentes:** revisar las URL remotas o los archivos de `backend/uploads`.
- **Error en npm ci:** comprobar Node.js, la conexión y la correspondencia entre manifiesto y lockfile.

## Documentación académica

La carpeta documental de entrega acompaña al código e incluye:

- Requisitos IEEE 830 e historias de usuario.
- Casos de uso con plantillas extendidas y diagramas de clases, actividades, componentes y despliegue.
- Diagrama entidad-relación y diccionario de datos.
- Mapa de empatía, Lean Canvas y propuesta técnica y económica.
- Documento técnico de diseño y manuales de usuario y técnico.
- Guías de instalación, despliegue y acceso; scripts SQL.
- Informe de pruebas, protocolo de aceptación y evidencias del software.
- Planes de migración, respaldo, mantenimiento, soporte y capacitación.
- Cierre técnico, acta de entrega y video pitch de máximo cinco minutos.

## Autoría

Desarrollado por:

- **Angie Lorena Fajardo Nuñez**
- **Servicio Nacional de Aprendizaje (SENA)**
- Programa: **Análisis y Desarrollo de Software**
- Ficha: **2977373**

## Derechos de autor

Copyright © 2026. Todos los derechos reservados por la autora de ModaGest Pro.

Este proyecto fue desarrollado con fines académicos. No se autoriza su reproducción, distribución, comercialización o modificación por terceros sin la autorización expresa de su autora.

Las dependencias utilizadas conservan sus respectivas licencias.
