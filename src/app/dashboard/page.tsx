import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const supabase = await createClient();

  // 1. VERIFICACIÓN DE SEGURIDAD (El Portero)
  const { data: { user } } = await supabase.auth.getUser();

  // Si no hay usuario, ¡FUERA! Te mando al login
  if (!user) {
    redirect('/login');
  }

  // 2. Si llegamos aquí, es que estás logueado.
  // Aquí es donde cargaríamos TUS entrenamientos de la BBDD.
  
  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-12 border-b border-gray-800 pb-4">
          <h1 className="text-3xl font-bold text-blue-500">Mi Panel de Control</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">{user.email}</span>
            <form action="/auth/signout" method="post">
              <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded text-sm transition">
                Salir
              </button>
            </form>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tarjeta 1: Resumen */}
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-2">📅 Últimos Entrenamientos</h2>
            <p className="text-gray-400 text-sm">Aún no has registrado ningún entrenamiento.</p>
            <button className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium transition">
              + Nuevo Entreno
            </button>
          </div>

          {/* Tarjeta 2: Estadísticas */}
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-2">📈 Progreso Semanal</h2>
            <div className="h-32 flex items-center justify-center bg-gray-950/50 rounded border border-gray-800 border-dashed">
              <span className="text-gray-600 text-xs">Gráfico próximamente...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}