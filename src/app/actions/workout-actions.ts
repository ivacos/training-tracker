'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function addWorkoutLog(formData: FormData) {
  const supabase = await createClient()

  // 1. Obtener usuario
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 2. Extraer datos del formulario
  const exercise_id = formData.get('exercise_id') as string
  const weight = parseFloat(formData.get('weight') as string)
  const reps = parseInt(formData.get('reps') as string)

  // 3. BUSCAR SI YA HAY UN ENTRENAMIENTO HOY
  // Calculamos la fecha de hoy a las 00:00:00 para buscar desde ahí
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { data: existingWorkout } = await supabase
    .from('workouts')
    .select('id')
    .eq('user_id', user.id)
    .gte('date', today.toISOString()) // Que sea de hoy o más reciente
    .order('date', { ascending: false })
    .limit(1)
    .single()

  let workout_id = existingWorkout?.id

  // 4. SI NO HAY ENTRENAMIENTO HOY, LO CREAMOS
  if (!workout_id) {
    const { data: newWorkout, error: workoutError } = await supabase
      .from('workouts')
      .insert({
        user_id: user.id,
        name: 'Entrenamiento de Hoy',
        date: new Date().toISOString()
      })
      .select()
      .single()

    if (workoutError) {
      console.error('Error creando workout:', workoutError)
      return { success: false }
    }
    
    workout_id = newWorkout.id
  }

  // 5. INSERTAR LA SERIE EN EL ENTRENAMIENTO (El de hoy, o el nuevo)
  const { error: setError } = await supabase
    .from('sets')
    .insert({
      workout_id: workout_id, // 👈 Aquí está la magia de la agrupación
      exercise_id,
      weight,
      reps,
      type: 'top_set'
    })

  if (setError) {
    console.error('Error creando set:', setError)
    return { success: false }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteSet(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const setId = formData.get('setId') as string

  // Borramos la serie que coincida con el ID
  const { error } = await supabase
    .from('sets')
    .delete()
    .eq('id', setId)

  if (error) {
    console.error('Error borrando serie:', error)
    return { success: false }
  }

  // Recargamos la página para que desaparezca visualmente
  revalidatePath('/dashboard')
  return { success: true }
}