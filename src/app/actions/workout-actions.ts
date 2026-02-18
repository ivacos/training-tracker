'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function addWorkoutLog(formData: FormData) {
  const supabase = await createClient()

  // 1. Obtener usuario
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 2. Datos del formulario
  const exercise_id = formData.get('exercise_id') as string
  const weight = parseFloat(formData.get('weight') as string)
  const reps = parseInt(formData.get('reps') as string)

  // 3. Crear una "Sesión Rápida" (Workout) para hoy
  // NOTA: En el futuro permitiremos elegir rutinas, por ahora creamos una sesión genérica
  const { data: workout, error: workoutError } = await supabase
    .from('workouts')
    .insert({
      user_id: user.id,
      name: 'Entrenamiento Rápido',
      date: new Date().toISOString()
    })
    .select()
    .single() // Nos devuelve el objeto creado (necesitamos su ID)

  if (workoutError) {
    console.error('Error creando workout:', workoutError)
    return { success: false }
  }

  // 4. Crear la Serie (Set) vinculada a esa sesión
  const { error: setError } = await supabase
    .from('sets')
    .insert({
      workout_id: workout.id, // 👈 Aquí enlazamos con la sesión creada arriba
      exercise_id,
      weight,
      reps,
      type: 'top_set' // Por defecto asumimos que es una serie efectiva
    })

  if (setError) {
    console.error('Error creando set:', setError)
    return { success: false }
  }

  revalidatePath('/dashboard')
  return { success: true }
}