'use client'; 

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  // Función para Iniciar Sesión
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(`❌ Error: ${error.message}`);
      setLoading(false);
    } else {
      setMessage('✅ ¡Login correcto! Redirigiendo...');
      router.push('/'); // Nos manda a la Home
      router.refresh(); // Refresca la home para que sepa que has entrado
    }
  };

  // Función para Registrarse (Crear cuenta nueva)
  const handleSignUp = async () => {
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(`❌ Error al registrarse: ${error.message}`);
    } else {
      setMessage('✅ Usuario creado. ¡Revisa tu email o inicia sesión!');
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-gray-800 bg-gray-900 p-8 shadow-lg">
        
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Bienvenido</h2>
          <p className="mt-2 text-gray-400">Training Tracker Access</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 p-2 text-white focus:border-blue-500 focus:outline-none"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 p-2 text-white focus:border-blue-500 focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Mensajes de Feedback */}
          {message && (
            <div className={`p-3 rounded text-sm ${message.includes('❌') ? 'bg-red-900/50 text-red-200' : 'bg-green-900/50 text-green-200'}`}>
              {message}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50 font-semibold"
            >
              {loading ? 'Cargando...' : 'Entrar'}
            </button>
            
            <button
              type="button"
              onClick={handleSignUp}
              disabled={loading}
              className="flex-1 rounded-md border border-gray-600 py-2 text-gray-300 hover:bg-gray-800 disabled:opacity-50"
            >
              Registrarse
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}