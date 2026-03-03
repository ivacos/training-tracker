import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import LogWorkoutForm from '@/components/LogWorkoutForm';
import { deleteSet } from '@/app/actions/workout-actions'; // 👈 IMPORTANTE: Importamos la nueva acción

export default async function Dashboard() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: exercises } = await supabase.from('exercises').select('id, name').order('name');

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
    .limit(3);

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
              {recentWorkouts?.map((workout: any) => {
                
                // 🧠 LÓGICA DE AGRUPACIÓN POR EJERCICIO
                // Convertimos una lista plana en un objeto agrupado por nombre de ejercicio
                const groupedSets = workout.sets?.reduce((acc: any, set: any) => {
                  const exerciseName = set.exercises?.name || 'Desconocido';
                  if (!acc[exerciseName]) acc[exerciseName] = [];
                  acc[exerciseName].push(set);
                  return acc;
                }, {});

                return (
                  <div key={workout.id} className="bg-gray-900 p-5 rounded-xl border border-gray-800">
                    <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
                      <h4 className="font-bold text-blue-400">{workout.name || 'Entrenamiento'}</h4>
                      <span className="text-xs text-gray-500">
                        {new Date(workout.date).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Pintamos los ejercicios agrupados */}
                    {groupedSets && Object.keys(groupedSets).length > 0 ? (
                      <div className="space-y-4">
                        {Object.entries(groupedSets).map(([exerciseName, sets]: [string, any]) => (
                          <div key={exerciseName}>
                            {/* Nombre del Ejercicio (Cabecera del grupo) */}
                            <h5 className="text-sm font-semibold text-gray-300 mb-2">{exerciseName}</h5>
                            
                            {/* Lista de series de ese ejercicio */}
                            <ul className="space-y-1">
                              {sets
                                .sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                                .map((set: any, index: number) => (
                                <li key={set.id} className="flex justify-between items-center text-sm bg-gray-950/50 p-2 rounded border border-gray-800/50 hover:border-gray-700 transition">
                                  <span className="text-gray-500 w-8 text-xs">#{index + 1}</span>
                                  
                                  <span className="font-mono flex-1 text-center">
                                    {set.weight} <span className="text-gray-500 text-xs">kg</span> × {set.reps}
                                  </span>

                                  {/* EL BOTÓN DE BORRAR 🗑️ */}
                                  <form action={deleteSet}>
                                    <input type="hidden" name="setId" value={set.id} />
                                    <button 
                                      type="submit" 
                                      className="text-red-900 hover:text-red-500 transition px-2"
                                      title="Borrar serie"
                                    >
                                      ✕
                                    </button>
                                  </form>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-600 italic">Sesión vacía</p>
                    )}
                  </div>
                );
              })}
              
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