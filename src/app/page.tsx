import { createClient } from '@/utils/supabase/server'; // Importamos el nuevo cliente
import { redirect } from 'next/navigation';

export default async function Home() {
  // 1. Iniciamos el cliente de servidor (con acceso a cookies)
  const supabase = await createClient();

  // 2. Pedimos el usuario de forma segura
  const { data: { user } } = await supabase.auth.getUser();

  // 3. Pedimos los ejercicios
  const { data: exercises } = await supabase.from('exercises').select('*');

  // 4. Lógica de saludo o login
  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-gray-950 text-white">
      <h1 className="text-4xl font-bold mb-8 text-blue-500">
        Training Tracker v0.2 🚀
      </h1>

      {/* ZONA DE USUARIO */}
      <div className="mb-8 p-4 rounded-lg bg-gray-900 border border-gray-800 text-center">
        {user ? (
          <div>
            <p className="text-green-400 font-medium mb-2">
              ✅ Sesión Activa: {user.email}
            </p>
            <form action="/auth/signout" method="post">
              {/* Nota: El logout lo haremos mañana, hoy solo visualizamos */}
              <button className="text-xs text-gray-500 hover:text-white transition">
                (Cerrar sesión - Próximamente)
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-yellow-500 text-sm">No estás identificado</p>
            <a 
              href="/login" 
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition font-bold"
            >
              Iniciar Sesión
            </a>
          </div>
        )}
      </div>
      
      {/* LISTA DE EJERCICIOS */}
      <div className="w-full max-w-md border border-gray-800 rounded-xl p-6 bg-gray-900">
        <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
          Catálogo Público
        </h2>
        <ul className="space-y-2">
          {exercises?.map((exercise) => (
            <li key={exercise.id} className="flex justify-between p-2 bg-gray-800 rounded">
              <span>{exercise.name}</span>
              <span className="text-xs bg-blue-900 px-2 py-1 rounded">{exercise.muscle_group}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}