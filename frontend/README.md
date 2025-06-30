# Task Manager App — Inlaze

Gestor de tareas construido como prueba técnica, utilizando una arquitectura de microservicios.

## 🧱 Arquitectura

Este proyecto está dividido en varios microservicios y un frontend:

```
task-manager-inlaze/
├── auth-service/        → Servicio de autenticación (JWT)
├── projects-service/    → Servicio de gestión de proyectos
├── tasks-service/       → Servicio de gestión de tareas
├── comments-service/    → (opcional) Comentarios sobre tareas
├── gateway/             → API Gateway (NestJS - WIP)
├── frontend/            → Interfaz web (Next.js)
```

---

## 🛠️ Tecnologías

### Backend:

- [NestJS](https://nestjs.com/) (TypeScript)
- MongoDB o PostgreSQL (según microservicio)
- JSON Web Tokens (JWT)
- Docker (WIP)

### Frontend:

- [Next.js 14 (App Router)](https://nextjs.org/)
- TailwindCSS
- Fetch API
- Context API (opcional)
- Protección de rutas con JWT

---

## ▶️ ¿Cómo correrlo?

### 1. Clona el repositorio

```bash
git clone https://github.com/DiegoGoGo03/Tasks_Inlaze.git
cd Tasks_Inlaze
```

### 2. Levanta los microservicios

En cada carpeta de microservicio:

```bash
cd auth-service
npm install
npm run start:dev
```

Haz lo mismo en `projects-service`, `tasks-service`, y opcionalmente `comments-service`.

### 3. Levanta el frontend

```bash
cd frontend
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) para ver la app.

---

## ✅ Funcionalidades Implementadas

- ✅ Registro y login de usuarios
- ✅ Protección con JWT
- ✅ Crear / ver / eliminar proyectos
- ✅ Crear / ver / eliminar tareas por proyecto (modal)
- ✅ Diseño limpio y responsive

---

## 🧩 Pendiente por implementar (si aplica)

- [ ] Edición de tareas/proyectos
- [ ] Comentarios por tarea
- [ ] Pasarela API Gateway completa
- [ ] Dockerización
- [ ] Pruebas (unitarias/e2e)

---

## 👨‍💻 Autor

Desarrollado por **Diego Gómez** como parte de una prueba técnica para **Inlaze**.

---

## 📄 Licencia

MIT
