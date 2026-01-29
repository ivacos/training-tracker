# Diario de Desarrollo (DevLog)

## [2026-01-29] Día 1 - Inicialización del Proyecto y Configuración de Entorno

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