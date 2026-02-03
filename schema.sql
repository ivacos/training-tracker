-- 1. Enum para el tipo de serie (Crucial para tu método HIT)
CREATE TYPE set_type AS ENUM ('warmup', 'top_set', 'back_off', 'failure', 'drop_set');

-- 2. Tabla de Perfiles (Se vincula con auth.users de Supabase)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabla de Ejercicios
CREATE TABLE public.exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  muscle_group TEXT NOT NULL, -- ej: 'chest', 'back', 'legs'
  created_by UUID REFERENCES public.profiles(id), -- NULL si es un ejercicio del sistema
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Tabla de Entrenamientos (Sesiones)
CREATE TABLE public.workouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  name TEXT, -- ej: "Torso Hipertrofia"
  date TIMESTAMPTZ DEFAULT now() NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Tabla de Series (Sets) - El Core de la App
CREATE TABLE public.sets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_id UUID REFERENCES public.workouts(id) ON DELETE CASCADE NOT NULL,
  exercise_id UUID REFERENCES public.exercises(id) NOT NULL,
  
  reps INTEGER NOT NULL,
  weight NUMERIC(5,2) NOT NULL, -- Soporta decimales (ej: 22.5 kg)
  rir INTEGER, -- Reps In Reserve (0-5)
  type set_type DEFAULT 'top_set', -- Usamos el ENUM creado arriba
  
  order_index INTEGER DEFAULT 0, -- Para ordenar las series en la pantalla
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Seguridad (Row Level Security - RLS)
-- Esto asegura que NADIE pueda ver tus entrenos salvo tú.
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sets ENABLE ROW LEVEL SECURITY;

-- Política simple: "Solo puedo ver/editar mis propios datos"
CREATE POLICY "Users can view own workouts" ON workouts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own workouts" ON workouts FOR INSERT WITH CHECK (auth.uid() = user_id);
-- (Nota: Faltarían políticas para update/delete y para las otras tablas, pero para empezar vale).