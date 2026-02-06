import { supabase } from '@/lib/supabaseClient';
import { redirect } from 'next/navigation'; // 1. IMPORTAR ESTO ⬅️

export default async function Home() {
  
  // --- ZONA DE LÓGICA (CEREBRO) ---

  // 1. Pedimos los ejercicios a la Base de Datos
  const { data: exercises, error } = await supabase
    .from('exercises')
    .select('*');

  // 2. NUEVO: Pedimos ver si hay alguien logueado (La Sesión) ⬅️
  // Nota: Al usar el cliente básico, es posible que el servidor no vea la cookie
  // inmediatamente, pero dejamos la estructura lista.
  const { data: { session } } = await supabase.auth.getSession();

  // (Opcional) Si descomentas esto, expulsará a quien no esté logueado:
  // if (!session) {
  //   redirect('/login');
  // }


  // --- ZONA DE DISEÑO (LO QUE SE VE) ---
  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-gray-950 text-white">
      <h1 className="text-4xl font-bold mb-8 text-blue-500">
        Training Tracker v0.1 🚀
      </h1>

      {/* 3. NUEVO: EL CHIVATO DE SESIÓN ⬅️ */}
      {/* Esto es un "If/Else" visual: ¿Hay sesión? Pinta Hola. ¿No? Pinta Link. */}
      <div className="mb-8">
        {session ? (
          <p className="text-green-400 font-medium border border-green-800 bg-green-900/30 px-4 py-2 rounded-full">
            👋 Hola, usuario conectado ({session.user.email})
          </p>
        ) : (
          <a 
            href="/login" 
            className="text-blue-400 hover:text-blue-300 underline font-medium px-4 py-2"
          >
            👤 Iniciar Sesión / Registrarse
          </a>
        )}
      </div>
      
      <div className="w-full max-w-md border border-gray-800 rounded-xl p-6 bg-gray-900">
        <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
          Catálogo de Ejercicios
        </h2>

        {error && (
          <div className="p-4 bg-red-900/50 text-red-200 rounded-lg">
            ❌ Error: {error.message}
          </div>
        )}

        {exercises?.length === 0 && (
          <p className="text-gray-400 italic">No hay ejercicios registrados.</p>
        )}

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