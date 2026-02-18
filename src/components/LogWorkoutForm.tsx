'use client'

import { addWorkoutLog } from '@/app/actions/workout-actions'
import { useRef } from 'react'

// Definimos qué forma tienen los ejercicios que recibiremos
type Exercise = {
  id: string
  name: string
}

export default function LogWorkoutForm({ exercises }: { exercises: Exercise[] }) {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
      <h3 className="text-lg font-bold mb-4 text-blue-400">Registrar Serie</h3>
      
      <form 
        ref={formRef}
        action={async (formData) => {
          await addWorkoutLog(formData)
          formRef.current?.reset() // Limpia el formulario tras enviar
        }} 
        className="flex flex-col gap-4"
      >
        
        {/* Selector de Ejercicio */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Ejercicio</label>
          <select 
            name="exercise_id" 
            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
            required
          >
            {exercises.map(ex => (
              <option key={ex.id} value={ex.id}>{ex.name}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          {/* Peso */}
          <div className="flex-1">
            <label className="block text-xs text-gray-400 mb-1">Kilos (kg)</label>
            <input 
              type="number" 
              name="weight" 
              step="0.5" 
              className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
              placeholder="0"
              required
            />
          </div>

          {/* Repeticiones */}
          <div className="flex-1">
            <label className="block text-xs text-gray-400 mb-1">Reps</label>
            <input 
              type="number" 
              name="reps" 
              className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
              placeholder="0"
              required
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded transition mt-2"
        >
          Guardar Serie
        </button>
      </form>
    </div>
  )
}