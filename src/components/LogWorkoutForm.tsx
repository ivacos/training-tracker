'use client'

import { addWorkoutLog } from '@/app/actions/workout-actions'
import { useRef } from 'react'
import { useFormStatus } from 'react-dom'

// 1. CREAMOS EL BOTÓN INTELIGENTE (Tiene que estar en su propia función)
function SubmitButton() {
  const { pending } = useFormStatus() // 👈 Esto detecta si la acción se está ejecutando

  return (
    <button 
      type="submit" 
      disabled={pending}
      className={`w-full font-bold py-2 rounded mt-2 transition flex justify-center items-center gap-2
        ${pending ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
    >
      {pending ? (
        <>
          <span className="animate-spin text-xl">⏳</span> Guardando...
        </>
      ) : (
        'Guardar Serie'
      )}
    </button>
  )
}

// 2. TU FORMULARIO DE SIEMPRE
export default function LogWorkoutForm({ exercises }: { exercises: any[] }) {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
      <h3 className="text-lg font-bold mb-4 text-blue-400">Registrar Serie</h3>
      <form 
        ref={formRef}
        action={async (formData) => {
          await addWorkoutLog(formData)
          formRef.current?.reset() // Limpia el formulario
        }} 
        className="flex flex-col gap-4"
      >
        <div>
          <label className="block text-xs text-gray-400 mb-1">Ejercicio</label>
          <select name="exercise_id" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" required>
            <option value="">Selecciona...</option>
            {exercises?.map((ex: any) => (
              <option key={ex.id} value={ex.id}>{ex.name}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xs text-gray-400 mb-1">Kilos (kg)</label>
            <input type="number" name="weight" step="0.5" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" required />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-400 mb-1">Reps</label>
            <input type="number" name="reps" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" required />
          </div>
        </div>
        
        {/* 3. USAMOS EL NUEVO BOTÓN */}
        <SubmitButton />
      </form>
    </div>
  )
}