import { supabase } from '@/lib/supabaseClient';
import { redirect } from 'next/navigation';

// Esta es una Server Component (se ejecuta en el servidor, no en el navegador del cliente)
export default async function Home() {
  // CÓDIGO PARA EVITAR USUARIOS NO AUTENTICADOS, COMENTADO PARA EVITAR BUCLE EN LA PAGINA DE LOGIN
  // const { data: { session } } = await supabase.auth.getSession();
  // if (!session) {
  //   redirect('/login');
  // }

  // 1. CONSULTA SQL: "SELECT * FROM exercises"
  const { data: exercises, error } = await supabase
    .from('exercises')
    .select('*');

  // 2. RENDERIZADO
  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-gray-950 text-white">
      <h1 className="text-4xl font-bold mb-8 text-blue-500">
        Training Tracker v0.1 🚀
      </h1>
      
      <div className="w-full max-w-md border border-gray-800 rounded-xl p-6 bg-gray-900">
        <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
          Catálogo de Ejercicios
        </h2>

        {/* Muestra error si falla la conexión */}
        {error && (
          <div className="p-4 bg-red-900/50 text-red-200 rounded-lg">
            ❌ Error: {error.message}
          </div>
        )}

        {/* Muestra lista vacía si no hay datos */}
        {exercises?.length === 0 && (
          <p className="text-gray-400 italic">No hay ejercicios registrados.</p>
        )}

        {/* Lista de ejercicios encontrados */}
        <ul className="space-y-2">
          {exercises?.map((exercise) => (
            <li 
              key={exercise.id} 
              className="flex justify-between items-center p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
            >
              <span className="font-medium">{exercise.name}</span>
              <span className="text-xs px-2 py-1 bg-blue-900 text-blue-200 rounded-full uppercase">
                {exercise.muscle_group}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}