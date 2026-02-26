import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import LogWorkoutForm from '@/components/LogWorkoutForm';

export default async function Dashboard() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: exercises } = await supabase.from('exercises').select('id, name').order('name');

  // 👇 LA NUEVA SÚPER CONSULTA (Trae Sesiones -> Series -> Nombre del Ejercicio)
  const { data: recentWorkouts } = await supabase
    .from('workouts')
    .select(`
      id,
      name,
      date,
      sets (
        id,
        weight,
        reps,
        created_at,
        exercises (name)
      )
    `)
    .order('date', { ascending: false })
    .limit(3); // Traemos las últimas 3 sesiones

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
          <h1 className="text-2xl font-bold">Panel de Control</h1>
          <form action="/auth/signout" method="post">
            <button className="text-sm text-gray-400 hover:text-white transition">Cerrar Sesión</button>
          </form>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* COLUMNA IZQUIERDA: Formulario */}
          <div>
            <LogWorkoutForm exercises={exercises || []} />
          </div>

          {/* COLUMNA DERECHA: Historial Agrupado */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-green-400">Últimas Sesiones</h3>
            
            <div className="space-y-6">
              {recentWorkouts?.map((workout: any) => (
                <div key={workout.id} className="bg-gray-900 p-5 rounded-xl border border-gray-800">
                  {/* Cabecera de la sesión */}
                  <div className="flex justify-between items-center mb-3 border-b border-gray-800 pb-2">
                    <h4 className="font-bold text-blue-400">
                      {workout.name || 'Entrenamiento'}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {new Date(workout.date).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Lista de series dentro de esta sesión */}
                  {workout.sets && workout.sets.length > 0 ? (
                    <ul className="space-y-2">
                      {workout.sets
                        .sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) // Ordenar series por tiempo
                        .map((set: any, index: number) => (
                        <li key={set.id} className="flex justify-between items-center text-sm">
                          <span className="text-gray-300">
                            <span className="text-gray-600 mr-2">#{index + 1}</span>
                            {set.exercises?.name}
                          </span>
                          <span className="font-mono bg-gray-950 px-2 py-1 rounded border border-gray-800">
                            {set.weight} <span className="text-gray-500 text-xs">kg</span> × {set.reps}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-600 italic">Sesión vacía</p>
                  )}
                </div>
              ))}
              
              {(!recentWorkouts || recentWorkouts.length === 0) && (
                <p className="text-gray-500 text-sm">Aún no hay entrenamientos.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}