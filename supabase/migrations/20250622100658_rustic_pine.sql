/*
  # Create MediScan AI Database Schema

  1. New Tables
    - `scan_results`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `image_url` (text)
      - `medicine_name` (text)
      - `description` (text)
      - `uses` (text)
      - `side_effects` (text)
      - `dosage` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `diagnosis_results`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `symptoms` (text)
      - `diet` (text)
      - `location` (text)
      - `possible_diseases` (jsonb)
      - `recommendations` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for users to access their own data only
*/

-- Create scan_results table
CREATE TABLE IF NOT EXISTS scan_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  medicine_name text NOT NULL,
  description text DEFAULT '',
  uses text DEFAULT '',
  side_effects text DEFAULT '',
  dosage text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create diagnosis_results table
CREATE TABLE IF NOT EXISTS diagnosis_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  symptoms text NOT NULL,
  diet text NOT NULL,
  location text NOT NULL,
  possible_diseases jsonb DEFAULT '[]'::jsonb,
  recommendations text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE scan_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnosis_results ENABLE ROW LEVEL SECURITY;

-- Create policies for scan_results
CREATE POLICY "Users can read own scan results"
  ON scan_results
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scan results"
  ON scan_results
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own scan results"
  ON scan_results
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own scan results"
  ON scan_results
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for diagnosis_results
CREATE POLICY "Users can read own diagnosis results"
  ON diagnosis_results
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own diagnosis results"
  ON diagnosis_results
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own diagnosis results"
  ON diagnosis_results
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own diagnosis results"
  ON diagnosis_results
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS scan_results_user_id_idx ON scan_results(user_id);
CREATE INDEX IF NOT EXISTS scan_results_created_at_idx ON scan_results(created_at);
CREATE INDEX IF NOT EXISTS diagnosis_results_user_id_idx ON diagnosis_results(user_id);
CREATE INDEX IF NOT EXISTS diagnosis_results_created_at_idx ON diagnosis_results(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_scan_results_updated_at 
  BEFORE UPDATE ON scan_results 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_diagnosis_results_updated_at 
  BEFORE UPDATE ON diagnosis_results 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();