/*
  # Create DevOps Orbit Projects Table

  1. New Tables
    - `orbits`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `prompt` (text) - User's project idea description
      - `archetype` (text) - Detected project type (e-commerce, ml-pipeline, etc)
      - `tools` (jsonb) - Array of selected SDLC tools
      - `artifacts` (jsonb) - Generated file structure and content
      - `status` (text) - pending, processing, completed, failed
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      
  2. Security
    - Enable RLS on `orbits` table
    - Add policies for authenticated users to manage their own orbits
*/

CREATE TABLE IF NOT EXISTS orbits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  prompt text NOT NULL,
  archetype text DEFAULT '',
  tools jsonb DEFAULT '[]'::jsonb,
  artifacts jsonb DEFAULT '{}'::jsonb,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orbits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orbits"
  ON orbits FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orbits"
  ON orbits FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orbits"
  ON orbits FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own orbits"
  ON orbits FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_orbits_user_id ON orbits(user_id);
CREATE INDEX IF NOT EXISTS idx_orbits_created_at ON orbits(created_at DESC);