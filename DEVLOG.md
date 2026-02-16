# Diario de Desarrollo (DevLog)

## [2026-01-29] | Día 1: Inicialización del Proyecto y Configuración de Entorno

### Objetivo Principal
Arrancar el desarrollo de **Training Tracker**, una PWA (Progressive Web App) para seguimiento de entrenamiento de fuerza con métricas avanzadas (RIR, Top Sets, Dropsets).

### Stack Tecnológico Elegido
* **Framework:** Next.js 15 (App Router) - *Elegido por rendimiento, SSR (Service Side Rendering) y arquitectura de carpetas moderna.*
* **Lenguaje:** TypeScript - *Crítico para asegurar la integridad de los datos (tipado estático).*
* **Estilos:** Tailwind CSS - *Para iteración rápida de UI sin salir de los ficheros TSX (extensión que es HTML con puentes de Type/JavaSecript).*
* **IDE (Interfaz de desarrollo integrado):** VS Code (Ubuntu Native) con extensiones de productividad (Prettier, ESLint, Tailwind IntelliSense).

### Log de Incidencias e Infraestructura

#### 1. Error de Autenticación en Git
* **Error:** `fatal: Autenticación falló para 'https://github.com/...'` al intentar el primer push.
* **Causa:** GitHub deprecó la autenticación básica por contraseña vía HTTPS en 2021.
* **Solución Implementada:**
    * Generación de par de claves SSH (algoritmo Ed25519) mediante `ssh-keygen`.
    * Configuración de la clave pública en GitHub Settings.
    * Cambio del origen remoto de HTTPS a SSH.

#### 2. Error de Resolución DNS
* **Error:** `ssh: Could not resolve hostname github.com: Temporary failure in name resolution`.
* **Diagnóstico:** Fallo momentáneo en la resolución de nombres del sistema Linux.
* **Verificación:** Se realizaron pruebas de conectividad (`ping`, `ssh -T`) confirmando que el túnel SSH funciona correctamente tras el reintento.

#### 3. Setup del IDE
* Instalación de VS Code en Ubuntu mediante Snap (`--classic`).
* Configuración de **Prettier** con "Format on Save" para mantener consistencia de código desde el primer commit.

### Estado Actual
* [x] Repositorio inicializado y conectado a GitHub.
* [x] "Hola mundo" en Next.js corriendo localmente.
* [x] Entorno de desarrollo configurado y documentado.

### Siguientes Pasos
1.  **Diseño de Datos:** Definir el esquema Entidad-Relación (SQL) para Usuarios, Rutinas y Logs.
2.  **Arquitectura:** Configurar Supabase como backend.


## [2026-01-30] | Día 2: Arquitectura de Base de Datos

### Objetivo
Diseñar el esquema de datos relacional (ER) en Supabase para soportar la lógica de entrenamiento (Top Sets, RIR, Dropsets).

### Decisiones de Ingeniería
* **Base de Datos:** PostgreSQL (via Supabase) por la necesidad de integridad relacional estricta.
* **Modelo de Datos:**
    * Uso de **ENUMs** (`set_type`) para restringir los tipos de series y evitar datos sucios.
    * **UUIDs** para todas las claves primarias.
    * **Relaciones en Cascada:** Si se borra un entreno, se borran sus series automáticamente.
* **Seguridad:** Implementación de **RLS (Row Level Security)** para aislar los datos de cada usuario a nivel de motor de BBDD.

### Estado Actual
* [x] Proyecto Supabase creado en región EU.
* [x] Tablas desplegadas y operativas.
* [x] Variables de entorno (`.env.local`) configuradas con API Keys.
* [x] Script de creación de tablas respaldado en `schema.sql`.

### Siguientes Pasos
* Instalar cliente de Supabase en Next.js.
* Crear Singleton de conexión.
* Realizar la primera "query" de prueba desde el frontend.

## [2026-02-01] | Día 3: Integración Frontend-Backend

### Objetivo
Conectar la aplicación Next.js con la base de datos Supabase para leer datos reales.

### Implementación
* **Cliente Supabase:** Instalado SDK `@supabase/supabase-js`.
* **Patrón Singleton:** Implementado en `src/lib/supabaseClient.ts` para reutilizar una única conexión en toda la app.
* **Seeding:** Inserción manual de datos de prueba ("Press Banca") en la tabla `exercises` desde el panel de Supabase.
* **Server Components:** Fetch de datos realizado directamente en `page.tsx` (Server-Side) para mejor rendimiento y SEO.

### Incidencias y Soluciones
* **Error:** `Module not found: Can't resolve '@/lib/supabaseClient'`.
* **Causa:** La carpeta `lib` se creó en la raíz del proyecto, pero el alias `@` en `tsconfig.json` apunta a `src/`.
* **Solución:** Mover la carpeta `lib` dentro del directorio `src`.

### Estado Actual
* [x] Conexión establecida y verificada.
* [x] La Home muestra la lista dinámica de ejercicios traída de la BBDD.

### Siguientes Pasos
* Crear sistema de Login (Auth) para que cada usuario vea SUS datos.

## 2026-02-06 | Día 4: Sistema de Autenticación (Login)

### Objetivo
Implementar la interfaz y la lógica de inicio de sesión y registro de usuarios mediante Email/Password usando Supabase Auth.

### Implementación
* **Ruta `/login`:** Creada nueva página con formulario (Client Component) que gestiona el estado de email/password.
* **Lógica de Auth:**
    * Implementado `supabase.auth.signInWithPassword` para usuarios existentes.
    * Implementado `supabase.auth.signUp` para nuevos registros.
    * Feedback visual de éxito/error y redirección automática a la Home.

### Notas Técnicas / Deuda Técnica
* **Persistencia de Sesión:** Actualmente, el login funciona en el cliente (navegador), pero al redirigir a la Home (Servidor), la sesión puede perderse visualmente.
* **Causa:** El cliente de Supabase básico (`createClient`) no gestiona automáticamente las cookies en componentes de servidor (Server Components) de Next.js.
* **Solución Pendiente:** Se implementará un `Middleware` y el helper `ssr` de Supabase en la próxima iteración para sincronizar las cookies entre Cliente y Servidor.

### Estado Actual
* [x] Formulario de Login/Registro funcional.
* [x] Usuarios se crean correctamente en el panel de Supabase.
* [x] Redirección tras login funcionando.

### Siguientes Pasos
* Configurar Middleware y Cookies para persistencia de sesión.
* Proteger rutas privadas (que no se pueda entrar a `/dashboard` sin login).

## 2026-02-16 | Día 5: Persistencia de Sesión (SSR y Middleware)

### Objetivo
Solucionar el problema de la pérdida de sesión al recargar y permitir que el Servidor (Next.js) acceda a la identidad del usuario.

### Cambio de Arquitectura (Refactor)
Se ha migrado del cliente básico (`@supabase/supabase-js`) a la librería de servidor (`@supabase/ssr`) para manejar Cookies.

* **Eliminado:** `src/lib/supabaseClient.ts` (Cliente único inseguro para SSR).
* **Creado:** Estructura en `src/utils/supabase/`:
    * `client.ts`: Para componentes interactivos (Browser Client).
    * `server.ts`: Para componentes de servidor y API (Server Client con acceso a cookies).
    * `middleware.ts`: Utilidad para gestionar la respuesta del servidor.

### Implementación del Middleware
* Creado `src/middleware.ts` en la raíz.
* **Función:** Intercepta cada petición, refresca el token de sesión si ha caducado y sincroniza las cookies entre el Navegador y el Servidor.

### Estado Actual
* [x] La sesión persiste tras F5 (Recarga).
* [x] La Home (`page.tsx`) ahora sabe quién es el usuario desde el servidor (SSR).
* [x] Eliminado el "parpadeo" de estado de login incorrecto.

### Siguientes Pasos
* Implementar botón de **Logout** (Cerrar Sesión).
* Proteger rutas privadas (Redirigir a `/login` si intentas entrar a `/dashboard` sin permiso).