'use client'

import { useEffect, useState } from 'react'

import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'


type Project = {
  id: number
  name: string
  description: string
}

type Task = {
  id: number
  title: string
  projectId: number
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [error, setError] = useState('')
  // Nuevo estado para el nombre del nuevo proyecto
  const [newProjectName, setNewProjectName] = useState('')


  // URLs base para tus servicios (ajusta si son diferentes)
  const PROJECTS_API_URL = 'http://localhost:3002/projects';
  const TASKS_API_URL = 'http://localhost:3003/tasks';


  const fetchProjects = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('No hay token de autenticación. Por favor, inicia sesión.');
      return;
    }

    try {
      // Usar la URL específica para proyectos
      const res = await fetch(PROJECTS_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }

      const data = await res.json()
      setProjects(data)
    } catch (err: any) { // Capturar el error como 'any' para acceder a 'message'
      console.error('Error al cargar proyectos:', err);
      setError(`Error al cargar proyectos: ${err.message || 'Desconocido'}`);
    }
  }

  // Cargar proyectos al inicio
  useEffect(() => {
    fetchProjects()
  }, [])

  // --- Lógica para agregar un nuevo proyecto ---
  const handleAddProject = async () => {
    if (!newProjectName.trim()) {
      alert('El nombre del proyecto no puede estar vacío');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('No hay token de autenticación. Por favor, inicia sesión.');
      return;
    }

    try {
      const res = await fetch(PROJECTS_API_URL, { // Usar la URL específica para proyectos
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newProjectName,
          description: 'Descripción por defecto', // Puedes añadir un input para esto si lo necesitas
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Error ${res.status}: ${res.statusText}`);
      }

      const newProject: Project = await res.json();
      setProjects((prev) => [...prev, newProject]); // Añadir el nuevo proyecto a la lista
      setNewProjectName(''); // Limpiar el input
      alert('Proyecto agregado con éxito');
      // No es estrictamente necesario fetchProjects() aquí si el backend devuelve el proyecto creado,
      // pero es una opción de fallback si no estás seguro de la respuesta.
      // fetchProjects();
    } catch (err: any) {
      console.error("Error al agregar proyecto:", err);
      setError(`Error al agregar proyecto: ${err.message || 'Desconocido'}`);
      alert(`Error al agregar proyecto: ${err.message || 'Desconocido'}`);
    }
  }


  // CODIGO EXISTENTE PARA TAREAS (lo he dejado como lo tenías)
  const [openModal, setOpenModal] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState('')

  // Abrir modal y cargar tareas
  const handleViewTasks = async (projectId: number) => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('No hay token de autenticación.');
      return;
    }

    try {
      // Usar la URL específica para tareas
      const res = await fetch(`${TASKS_API_URL}?projectId=${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      const data = await res.json()
      setTasks(data)
      setSelectedProjectId(projectId) // <- después de setTasks
      setOpenModal(true)
    } catch (err: any) {
      console.error('Error al cargar tareas:', err);
      alert(`Error al cargar tareas: ${err.message || 'Desconocido'}`);
    }
  }

  const handleAddTask = async () => {
    const token = localStorage.getItem('token')
    if (!newTaskTitle.trim() || !selectedProjectId || !token) {
      alert('El título de la tarea y el proyecto son requeridos.');
      return;
    }

    const payload = {
      title: newTaskTitle,
      projectId: selectedProjectId,
      // Añade otros campos si son obligatorios en tu Task entity o en tu DTO de backend
      // Por ejemplo:
      description: '', // Valor por defecto si no tienes un input para ello
      status: 'todo', // Valor por defecto si no tienes un input para ello
      dueDate: new Date().toISOString().split('T')[0], // Fecha actual como ejemplo
    }

    console.log("Payload enviado:", payload);

    try {
      // Usar la URL específica para tareas
      const res = await fetch(TASKS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Error ${res.status}: ${res.statusText}`);
      }

      const newTask: Task = await res.json()
      setTasks((prev) => [...prev, newTask])
      setNewTaskTitle('')
    } catch (error: any) {
      console.error("Error al agregar tarea:", error);
      alert(`Error al agregar tarea: ${error.message || 'Desconocido'}`);
    }
  }

  const handleDeleteTask = async (taskId: number) => {
    const token = localStorage.getItem('token')
    if (!token) return;

    if (!window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      return; // El usuario canceló la eliminación
    }

    try {
      // Usar la URL específica para tareas
      await fetch(`${TASKS_API_URL}/${taskId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      setTasks((prev) => prev.filter((t) => t.id !== taskId))
      alert('Tarea eliminada con éxito');
    } catch (err: any) {
      console.error('Error al eliminar tarea:', err);
      alert(`Error al eliminar tarea: ${err.message || 'Desconocido'}`);
    }
  }


  // handleCreateTask parece ser redundante si handleAddTask abre el modal. Lo comento.
  // const handleCreateTask = (projectId: number) => {
  //   alert(`Crear nueva tarea para proyecto ${projectId}`)
  // }

  const handleDeleteProject = async (projectId: number) => {
    const token = localStorage.getItem('token')
    if (!token) return

    if (!window.confirm('¿Estás seguro de que quieres eliminar este proyecto y todas sus tareas asociadas?')) {
      return; // El usuario canceló la eliminación
    }

    try {
      // Usar la URL específica para proyectos
      const res = await fetch(`${PROJECTS_API_URL}/${projectId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Error ${res.status}: ${res.statusText}`);
      }

      setProjects((prev) => prev.filter((p) => p.id !== projectId))
      alert('Proyecto eliminado con éxito');
    } catch (err: any) {
      console.error('Error al eliminar el proyecto:', err);
      alert(`Error al eliminar el proyecto: ${err.message || 'Desconocido'}`);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestor de Proyectos y Tareas</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* --- Nuevo bloque para agregar proyectos --- */}
      <div className="mb-6 p-4 border rounded-xl shadow bg-white">
        <h2 className="text-xl font-semibold mb-3">Agregar Nuevo Proyecto</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Nombre del proyecto"
            className="border p-2 rounded flex-grow"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
          <button
            onClick={handleAddProject}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Agregar Proyecto
          </button>
        </div>
      </div>
      {/* --- Fin del nuevo bloque --- */}


      {/* Lista de Proyectos Existente */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div key={project.id} className="bg-white p-4 rounded-xl shadow space-y-2">
              <h2 className="text-lg font-semibold">{project.name}</h2>
              <p className="text-sm text-gray-600">{project.description}</p>

              <div className="flex flex-wrap gap-2 pt-2"> {/* flex-wrap para botones en pantallas pequeñas */}
                <button
                  onClick={() => handleViewTasks(project.id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Ver tareas
                </button>

                {/* El botón "Crear tarea" dentro de cada tarjeta ya no sería necesario
                    si el modal de "Ver tareas" ya tiene la funcionalidad de agregar.
                    Lo dejo comentado por ahora.
                <button
                  onClick={() => handleCreateTask(project.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Crear tarea
                </button>
                */}

                <button
                  onClick={() => handleDeleteProject(project.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Eliminar Proyecto
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No hay proyectos disponibles. ¡Crea uno nuevo!</p>
        )}
      </div>

      {/* Modal de Tareas */}
      <Transition.Root show={openModal} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpenModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-6 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div>
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Tareas del proyecto
                  </Dialog.Title>

                  <div className="mt-4 space-y-2">
                    {tasks.length > 0 ? (
                      tasks.map((task) => (
                        <div key={task.id} className="flex justify-between items-center border p-2 rounded">
                          <span>{task.title}</span>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-sm text-red-500 hover:underline"
                          >
                            Eliminar
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600">No hay tareas para este proyecto.</p>
                    )}

                    <input
                      type="text"
                      placeholder="Nueva tarea"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      className="w-full p-2 border rounded mt-4" // Ajuste de margen
                    />
                    <button
                      onClick={handleAddTask}
                      className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full" // Botón de ancho completo
                    >
                      Agregar tarea
                    </button>
                  </div>

                  <div className="mt-5 sm:mt-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-700"
                      onClick={() => {
                        setOpenModal(false)
                        setTasks([])
                        setSelectedProjectId(null)
                        setNewTaskTitle('') // Limpiar input de tarea al cerrar
                      }}
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  )
}