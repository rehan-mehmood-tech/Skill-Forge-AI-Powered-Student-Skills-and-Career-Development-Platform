-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- Enums
CREATE TYPE user_role AS ENUM ('student', 'mentor', 'admin');
CREATE TYPE skill_domain AS ENUM ('python', 'web', 'git', 'devops', 'ai', 'databases');
CREATE TYPE proficiency_level AS ENUM ('novice', 'beginner', 'intermediate', 'advanced', 'expert');
CREATE TYPE assessment_status AS ENUM ('not_started', 'in_progress', 'completed', 'expired');
CREATE TYPE roadmap_status AS ENUM ('draft', 'active', 'completed', 'archived');
CREATE TYPE resource_type AS ENUM ('article', 'video', 'course', 'project', 'documentation', 'book');
CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'done', 'skipped');

-- Table: profiles
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    avatar_url TEXT,
    bio TEXT,
    target_role TEXT,                      
    resume_url TEXT,                       
    parsed_resume_skills JSONB DEFAULT '[]'::jsonb,  
    skill_vector JSONB DEFAULT '{}'::jsonb,          
    onboarding_completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_target_role ON profiles(target_role);

-- Table: assessment_questions
CREATE TABLE assessment_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain skill_domain NOT NULL,
    difficulty proficiency_level NOT NULL,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL,                
    correct_option_id TEXT NOT NULL,
    explanation TEXT,
    weight NUMERIC(3,2) NOT NULL DEFAULT 1.00 CHECK (weight BETWEEN 0.1 AND 5.0),
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_questions_domain_difficulty ON assessment_questions(domain, difficulty);
CREATE INDEX idx_questions_active ON assessment_questions(is_active) WHERE is_active = true;

-- Table: assessments
CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    domain skill_domain NOT NULL,
    status assessment_status NOT NULL DEFAULT 'not_started',
    question_ids UUID[] NOT NULL,
    responses JSONB DEFAULT '{}'::jsonb,   
    raw_score NUMERIC(5,2),                
    normalized_score NUMERIC(3,2),         
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    time_limit_seconds INTEGER NOT NULL DEFAULT 1800,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_score_range CHECK (raw_score IS NULL OR (raw_score >= 0 AND raw_score <= 100))
);

CREATE INDEX idx_assessments_student ON assessments(student_id);
CREATE INDEX idx_assessments_domain_status ON assessments(domain, status);

-- Table: roadmaps
CREATE TABLE roadmaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    target_role TEXT NOT NULL,
    status roadmap_status NOT NULL DEFAULT 'draft',
    gap_summary JSONB NOT NULL,            
    phases JSONB NOT NULL,                 
    generated_by TEXT NOT NULL DEFAULT 'ai-agent', 
    version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_roadmaps_student ON roadmaps(student_id);
CREATE INDEX idx_roadmaps_status ON roadmaps(status);

-- Table: learning_resources
CREATE TABLE learning_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    type resource_type NOT NULL,
    domain skill_domain NOT NULL,
    difficulty proficiency_level NOT NULL,
    tags TEXT[] DEFAULT '{}',
    curated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_resources_domain_type ON learning_resources(domain, type);
CREATE INDEX idx_resources_tags ON learning_resources USING GIN(tags);

-- Table: knowledge_base_chunks (pgvector)
CREATE TABLE knowledge_base_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_title TEXT NOT NULL,
    source_type TEXT NOT NULL,             
    domain skill_domain,
    content TEXT NOT NULL,
    embedding VECTOR(768),                 
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_kb_embedding ON knowledge_base_chunks
    USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Row Level Security (RLS) Policy Matrix
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base_chunks ENABLE ROW LEVEL SECURITY;

-- Helper: is_mentor_or_admin()
CREATE OR REPLACE FUNCTION is_mentor_or_admin() RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('mentor','admin')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- profiles
CREATE POLICY "profiles_select_own_or_staff" ON profiles FOR SELECT
  USING (id = auth.uid() OR is_mentor_or_admin());
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_insert_self" ON profiles FOR INSERT
  WITH CHECK (id = auth.uid());

-- assessments
CREATE POLICY "assessments_select_own_or_staff" ON assessments FOR SELECT
  USING (student_id = auth.uid() OR is_mentor_or_admin());
CREATE POLICY "assessments_insert_own" ON assessments FOR INSERT
  WITH CHECK (student_id = auth.uid());
CREATE POLICY "assessments_update_own" ON assessments FOR UPDATE
  USING (student_id = auth.uid()) WITH CHECK (student_id = auth.uid());

-- assessment_questions
CREATE POLICY "questions_select_all_authenticated" ON assessment_questions FOR SELECT
  USING (auth.role() = 'authenticated' AND is_active = true);
CREATE POLICY "questions_write_staff_only" ON assessment_questions FOR ALL
  USING (is_mentor_or_admin()) WITH CHECK (is_mentor_or_admin());

-- roadmaps
CREATE POLICY "roadmaps_select_own_or_staff" ON roadmaps FOR SELECT
  USING (student_id = auth.uid() OR is_mentor_or_admin());
CREATE POLICY "roadmaps_insert_own_or_service" ON roadmaps FOR INSERT
  WITH CHECK (student_id = auth.uid() OR is_mentor_or_admin());
CREATE POLICY "roadmaps_update_own_or_staff" ON roadmaps FOR UPDATE
  USING (student_id = auth.uid() OR is_mentor_or_admin());

-- learning_resources
CREATE POLICY "resources_select_all_authenticated" ON learning_resources FOR SELECT
  USING (auth.role() = 'authenticated' AND is_active = true);
CREATE POLICY "resources_write_staff_only" ON learning_resources FOR ALL
  USING (is_mentor_or_admin()) WITH CHECK (is_mentor_or_admin());

-- knowledge_base_chunks (service-role only; no direct client access)
CREATE POLICY "kb_no_client_access" ON knowledge_base_chunks FOR ALL
  USING (false);

-- =========================================================================
-- Verification & Seed Helpers (Sample Data)
-- =========================================================================

INSERT INTO assessment_questions (domain, difficulty, question_text, options, correct_option_id, explanation, weight, is_active)
VALUES
('python', 'beginner', 'Which of the following is a mutable data type in Python?', '[{"id":"a","text":"Tuple"}, {"id":"b","text":"List"}, {"id":"c","text":"String"}, {"id":"d","text":"Integer"}]', 'b', 'Lists can be modified after creation, while tuples, strings, and integers are immutable.', 1.0, true),
('python', 'intermediate', 'What is the output of [x for x in range(5) if x % 2 == 0]?', '[{"id":"a","text":"[0, 1, 2, 3, 4]"}, {"id":"b","text":"[1, 3]"}, {"id":"c","text":"[0, 2, 4]"}, {"id":"d","text":"[2, 4]"}]', 'c', 'This is a list comprehension filtering for even numbers between 0 and 4.', 1.5, true);

INSERT INTO learning_resources (title, description, url, type, domain, difficulty, tags, is_active)
VALUES
('Python Crash Course', 'A fast-paced, no-nonsense introduction to Python programming.', 'https://example.com/python-crash-course', 'book', 'python', 'beginner', '{"basics", "fundamentals"}', true),
('Docker for Beginners', 'Learn how to containerize your applications easily.', 'https://example.com/docker-course', 'course', 'devops', 'beginner', '{"docker", "containers"}', true);
