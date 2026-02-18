import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import LogWorkoutForm from '../../components/LogWorkoutForm'; // 👈 Importamos el nuevo componente

export default async function Dashboard() {
  const supabase = await createClient();

  // 1. Verificar Usuario
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // 2. Cargar ejercicios (para el selector)
  const { data: exercises } = await supabase.from('exercises').select('id, name').order('name');

  // 3. Cargar historial reciente del usuario
  // 3. Cargar historial reciente (Tabla 'sets')
  const { data: logs } = await supabase
    .from('sets')
    .select(`
      id,
      weight,
      reps,
      created_at,
      exercises (name)
    `)
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Encabezado */}
        <header className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
          <h1 className="text-2xl font-bold">Hola, {user.email?.split('@')[0]} 👋</h1>
          <form action="/auth/signout" method="post">
            <button className="text-sm text-gray-400 hover:text-white">Cerrar Sesión</button>
          </form>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* COLUMNA IZQUIERDA: Formulario */}
          <div>
            <LogWorkoutForm exercises={exercises || []} />
          </div>

          {/* COLUMNA DERECHA: Historial */}
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h3 className="text-lg font-bold mb-4 text-green-400">Últimos Registros</h3>
            
            {!logs || logs.length === 0 ? (
              <p className="text-gray-500 text-sm">No hay actividad reciente.</p>
            ) : (
              <ul className="space-y-3">
                {logs.map((log) => (
                  <li key={log.id} className="flex justify-between items-center border-b border-gray-800 pb-2">
                    <div>
                      <span className="block font-medium">{log.exercises?.name}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(log.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="block text-xl font-bold text-blue-400">{log.weight} kg</span>
                      <span className="text-xs text-gray-400">{log.reps} reps</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}