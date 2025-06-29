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

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem('token')
      if (!token) return

      try {
        const res = await fetch('http://localhost:3002/projects', {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = await res.json()
        setProjects(data)
      } catch (err) {
        setError('Error al cargar proyectos')
      }
    }

    fetchProjects()
  }, [])

  // CODIGO NUEVO
  const [openModal, setOpenModal] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState('')

  // Abrir modal y cargar tareas
  const handleViewTasks = async (projectId: number) => {
    const token = localStorage.getItem('token')
    if (!token) return
  
    try {
      const res = await fetch(`http://localhost:3003/tasks?projectId=${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setTasks(data)
      setSelectedProjectId(projectId) // <- después de setTasks
      setOpenModal(true)
    } catch {
      alert('Error al cargar tareas')
    }
  }

  const handleAddTask = async () => {
    const token = localStorage.getItem('token')
    if (!newTaskTitle.trim() || !selectedProjectId || !token) return

    const payload = {
      title: newTaskTitle,
      project: { id: selectedProjectId }, // ✅ importante que sea un objeto
    }


    try {
      const res = await fetch(`http://localhost:3003/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
        //body: JSON.stringify({
          //title: newTaskTitle,
          //project: { id: selectedProjectId },
        //}),
      })
      const newTask = await res.json()
      setTasks((prev) => [...prev, newTask])
      setNewTaskTitle('')
    } catch {
      alert('Error al agregar tarea')
    }
  }

  const handleDeleteTask = async (taskId: number) => {
    const token = localStorage.getItem('token')
    try {
      await fetch(`http://localhost:3003/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      setTasks((prev) => prev.filter((t) => t.id !== taskId))
    } catch {
      alert('Error al eliminar tarea')
    }
  }


  //const handleViewTasks = (projectId: number) => {
    // Más adelante: redirigir a otra ruta o mostrar en modal
    //alert(`Ver tareas del proyecto ${projectId}`)
  //}

  const handleCreateTask = (projectId: number) => {
    alert(`Crear nueva tarea para proyecto ${projectId}`)
  }

  const handleDeleteProject = async (projectId: number) => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      await fetch(`http://localhost:3002/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setProjects((prev) => prev.filter((p) => p.id !== projectId))
    } catch (err) {
      alert('Error al eliminar el proyecto')
    }
  }

  // CODIGO NUEVO

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Proyectos</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-white p-4 rounded-xl shadow space-y-2">
            <h2 className="text-lg font-semibold">{project.name}</h2>
            <p className="text-sm text-gray-600">{project.description}</p>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleViewTasks(project.id)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Ver tareas
              </button>

              <button
                onClick={() => handleCreateTask(project.id)}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                Crear tarea
              </button>

              <button
                onClick={() => handleDeleteProject(project.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
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
              {tasks.map((task) => (
                <div key={task.id} className="flex justify-between items-center border p-2 rounded">
                  <span>{task.title}</span>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              ))}

              <input
                type="text"
                placeholder="Nueva tarea"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full p-2 border rounded mt-2"
              />
              <button
                onClick={handleAddTask}
                className="mt-2 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
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
