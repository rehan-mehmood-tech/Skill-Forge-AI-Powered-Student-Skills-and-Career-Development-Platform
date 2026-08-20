const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../api-gateway/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials in api-gateway/.env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const profilesData = [
  { name: 'Muhammad Hamza', email: 'hamza@arbisoft.mock', role: 'admin', target_role: 'Lead AI Engineer', bio: 'Lead AI Engineer @ Arbisoft', skill_vector: {"python": 0.95, "ai": 0.92, "devops": 0.85, "databases": 0.88}, skills: ["Python", "TensorFlow", "Kubernetes", "PostgreSQL"] },
  { name: 'Ayesha Siddiqa', email: 'ayesha@systems.mock', role: 'mentor', target_role: 'Senior DevOps Architect', bio: 'Senior DevOps Architect @ Systems Ltd', skill_vector: {"devops": 0.96, "git": 0.90, "web": 0.80, "python": 0.85}, skills: ["AWS", "Docker", "Terraform", "CI/CD"] },
  { name: 'Daniyal Tariq', email: 'daniyal@careem.mock', role: 'mentor', target_role: 'Staff Backend Engineer', bio: 'Staff Backend Engineer @ Careem', skill_vector: {"web": 0.92, "databases": 0.90, "python": 0.85, "devops": 0.82}, skills: ["Node.js", "Go", "Microservices", "Redis"] },
  { name: 'Zeeshan Ali', email: 'zeeshan@fast.mock', role: 'student', target_role: 'Full-Stack Web Developer', bio: 'CS Undergrad @ FAST Lahore', skill_vector: {"web": 0.70, "databases": 0.55, "git": 0.65}, skills: ["React", "JavaScript", "HTML/CSS"] },
  { name: 'Fatima Noor', email: 'fatima@nust.mock', role: 'student', target_role: 'AI / Machine Learning Specialist', bio: 'CS Undergrad @ NUST', skill_vector: {"python": 0.75, "ai": 0.60, "databases": 0.50}, skills: ["Python", "Scikit-learn", "Pandas"] },
  { name: 'Bilal Ahmed', email: 'bilal@umt.mock', role: 'student', target_role: 'Cloud DevOps Engineer', bio: 'CS Undergrad @ UMT Lahore', skill_vector: {"devops": 0.40, "git": 0.75, "python": 0.55}, skills: ["Linux", "Git", "Bash"] },
  { name: 'Maryam Tariq', email: 'maryam@pucit.mock', role: 'student', target_role: 'Python Backend Engineer', bio: 'CS Undergrad @ PUCIT', skill_vector: {"python": 0.82, "web": 0.65, "databases": 0.70}, skills: ["Python", "Django", "SQL"] },
  { name: 'Usman Khalid', email: 'usman@comsats.mock', role: 'student', target_role: 'Data Engineer', bio: 'CS Undergrad @ COMSATS', skill_vector: {"databases": 0.78, "python": 0.72, "devops": 0.45}, skills: ["SQL", "Python", "Data Modeling"] },
  { name: 'Zainab Raza', email: 'zainab@itu.mock', role: 'student', target_role: 'Frontend Specialist', bio: 'CS Undergrad @ ITU', skill_vector: {"web": 0.85, "git": 0.70}, skills: ["React", "Tailwind CSS", "TypeScript"] },
  { name: 'Haris Munir', email: 'haris@fast.mock', role: 'student', target_role: 'Autonomous AI Agents Engineer', bio: 'CS Undergrad @ FAST Islamabad', skill_vector: {"python": 0.88, "ai": 0.75, "devops": 0.60}, skills: ["Python", "LLMs", "LangChain"] },
  { name: 'Hiba Khan', email: 'hiba@giki.mock', role: 'student', target_role: 'Systems Architecture Engineer', bio: 'CS Undergrad @ GIKI', skill_vector: {"devops": 0.65, "web": 0.75, "databases": 0.80}, skills: ["C++", "System Design", "Networking"] }
];

const questionBank = [
  { domain: 'python', difficulty: 'intermediate', text: 'How does asyncio achieve concurrency in Python?', opts: ['A) Multiple OS threads', 'B) Single-threaded event loop', 'C) Multi-processing', 'D) Global Interpreter Lock bypass'], correct: '1', exp: 'asyncio uses a single-threaded event loop to manage I/O bound concurrent operations.' },
  { domain: 'python', difficulty: 'advanced', text: 'Which Python tool is used to profile memory leaks?', opts: ['A) cProfile', 'B) tracemalloc', 'C) timeit', 'D) pdb'], correct: '1', exp: 'tracemalloc is a built-in module for tracing memory blocks allocated by Python.' },
  { domain: 'web', difficulty: 'advanced', text: 'In React 19, what is the primary benefit of Server Actions?', opts: ['A) Better CSS-in-JS', 'B) Client-side routing', 'C) Executing async code directly on the server without manual API endpoints', 'D) Replacing Redux'], correct: '2', exp: 'Server actions allow defining async functions that run on the server, simplifying mutations.' },
  { domain: 'web', difficulty: 'intermediate', text: 'What does the React useMemo hook do?', opts: ['A) Memorizes a component', 'B) Caches a computed value between renders', 'C) Re-renders automatically', 'D) Fetches data'], correct: '1', exp: 'useMemo caches the result of a calculation between renders to optimize performance.' },
  { domain: 'databases', difficulty: 'advanced', text: 'When tuning a pgvector IVFFlat index, what does the lists parameter control?', opts: ['A) Number of dimensions', 'B) Number of clusters to divide the vectors into', 'C) Distance metric', 'D) Number of probes'], correct: '1', exp: 'The lists parameter defines how many inverted lists (clusters) the dataset is partitioned into.' },
  { domain: 'databases', difficulty: 'intermediate', text: 'What is a PostgreSQL materialized view?', opts: ['A) A virtual table', 'B) A physical copy of query results that must be refreshed manually', 'C) A temporary table', 'D) An index'], correct: '1', exp: 'Materialized views store the result of a query physically and need to be refreshed.' },
  { domain: 'devops', difficulty: 'intermediate', text: 'What is the main advantage of Docker multi-stage builds?', opts: ['A) Faster download speed', 'B) Reduced final image size by discarding build dependencies', 'C) Running multiple containers', 'D) Better security via encryption'], correct: '1', exp: 'Multi-stage builds allow you to use intermediate images for building, keeping the final image lean.' },
  { domain: 'devops', difficulty: 'advanced', text: 'In Kubernetes, what is a DaemonSet used for?', opts: ['A) Load balancing', 'B) Running a copy of a pod on all (or some) nodes', 'C) Storing secrets', 'D) Database replication'], correct: '1', exp: 'DaemonSets ensure that all eligible nodes run a copy of a specific Pod, useful for logging or monitoring.' },
  { domain: 'git', difficulty: 'intermediate', text: 'What is the primary difference between git merge and git rebase?', opts: ['A) Rebase rewrites commit history to create a linear progression', 'B) Merge deletes the source branch', 'C) Rebase is only for remote branches', 'D) Merge is faster'], correct: '0', exp: 'Rebase moves the base of a branch to the tip of another, rewriting history for a clean linear log.' },
  { domain: 'git', difficulty: 'advanced', text: 'How do you interactively rebase the last 3 commits?', opts: ['A) git rebase -i HEAD~3', 'B) git merge -i HEAD~3', 'C) git rebase --amend 3', 'D) git commit --interactive'], correct: '0', exp: 'The -i flag starts an interactive rebase session for the specified commit range.' },
  { domain: 'ai', difficulty: 'intermediate', text: 'What is RAG in the context of LLMs?', opts: ['A) Random Access Generation', 'B) Retrieval-Augmented Generation', 'C) Recurrent Artificial Generation', 'D) Rapid Assessment Grading'], correct: '1', exp: 'RAG augments LLM prompts with relevant retrieved documents to improve accuracy and reduce hallucinations.' },
  { domain: 'ai', difficulty: 'advanced', text: 'What is the purpose of temperature in LLM generation?', opts: ['A) Controls the speed of generation', 'B) Controls the randomness of the output distribution', 'C) Limits the context window', 'D) Determines the embedding size'], correct: '1', exp: 'Higher temperature flattens the probability distribution, leading to more random/creative outputs.' },
];

const resourcesList = [
  { title: 'FastAPI Advanced Topics', domain: 'web', type: 'documentation', diff: 'advanced' },
  { title: 'LangGraph Concepts', domain: 'ai', type: 'documentation', diff: 'intermediate' },
  { title: 'pgvector IVFFlat Tuning Guide', domain: 'databases', type: 'article', diff: 'advanced' },
  { title: 'Docker Multi-stage Builds', domain: 'devops', type: 'article', diff: 'intermediate' },
  { title: 'Tailwind CSS in 100 Seconds', domain: 'web', type: 'video', diff: 'beginner' },
  { title: 'System Design Interview Prep', domain: 'devops', type: 'book', diff: 'advanced' },
  { title: 'Python Asyncio Deep Dive', domain: 'python', type: 'video', diff: 'advanced' },
  { title: 'React 19 Server Actions Tutorial', domain: 'web', type: 'course', diff: 'intermediate' },
  { title: 'Git Interactive Rebase Explained', domain: 'git', type: 'article', diff: 'intermediate' },
  { title: 'Supabase Vector Embeddings Guide', domain: 'databases', type: 'documentation', diff: 'intermediate' }
];

async function seed() {
  console.log("🌱 Starting realistic seed data injection...");

  // 1. Profiles
  const userMap = {};
  for (const p of profilesData) {
    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
      email: p.email,
      password: 'Password123!',
      email_confirm: true
    });
    
    if (authErr && !authErr.message.includes('already registered')) {
      console.error(`Failed to create auth user ${p.email}:`, authErr);
      continue;
    }
    
    let userId;
    if (authData?.user) {
      userId = authData.user.id;
    } else {
      // If already registered, fetch user id
      const { data: listData } = await supabase.auth.admin.listUsers();
      const u = listData.users.find(u => u.email === p.email);
      userId = u?.id;
    }

    if (userId) {
      userMap[p.name] = userId;
      const { error: profErr } = await supabase.from('profiles').upsert({
        id: userId,
        full_name: p.name,
        email: p.email,
        role: p.role,
        target_role: p.target_role,
        bio: p.bio,
        skill_vector: p.skill_vector,
        parsed_resume_skills: p.skills,
        onboarding_completed: true
      });
      if (profErr) console.error(`Profile upsert error for ${p.name}:`, profErr.message);
    }
  }
  console.log(`✅ Seeded ${Object.keys(userMap).length} Pakistani profiles (Students, Mentors, Admins).`);

  // 2. Questions
  let questionIds = [];
  for (const q of questionBank) {
    const options = q.opts.map((opt, i) => ({ id: i.toString(), text: opt }));
    const { data: qData, error: qErr } = await supabase.from('assessment_questions').insert({
      domain: q.domain,
      difficulty: q.difficulty,
      question_text: q.text,
      options,
      correct_option_id: q.correct,
      explanation: q.exp,
      weight: q.difficulty === 'advanced' ? 2.0 : 1.0
    }).select('id').single();
    
    if (qErr) console.error(`Failed to insert question:`, qErr.message);
    else questionIds.push({ id: qData.id, domain: q.domain, correct: q.correct });
  }
  console.log(`✅ Seeded ${questionIds.length} realistic MCQs.`);

  // 3. Assessments & Roadmaps
  let assmtCount = 0;
  let roadmapCount = 0;
  const students = profilesData.filter(p => p.role === 'student');
  
  for (const s of students) {
    const sId = userMap[s.name];
    if (!sId) continue;
    
    // Assessments
    for (const domain of Object.keys(s.skill_vector)) {
      const dQs = questionIds.filter(q => q.domain === domain).slice(0, 5);
      if (dQs.length > 0) {
        const rawScore = 60 + Math.random() * 34; // 60 to 94
        const normScore = rawScore / 100;
        
        await supabase.from('assessments').insert({
          student_id: sId,
          domain: domain,
          status: 'completed',
          question_ids: dQs.map(q => q.id),
          responses: { [dQs[0].id]: dQs[0].correct },
          raw_score: parseFloat(rawScore.toFixed(2)),
          normalized_score: parseFloat(normScore.toFixed(2)),
          started_at: new Date(Date.now() - 86400000).toISOString(),
          completed_at: new Date().toISOString()
        });
        assmtCount++;
      }
    }
    
    // Roadmaps
    const gap = (1.0 - (s.skill_vector[Object.keys(s.skill_vector)[0]] || 0.5)).toFixed(2);
    await supabase.from('roadmaps').insert({
      student_id: sId,
      target_role: s.target_role,
      status: 'active',
      gap_summary: { main_gap: `Needs +${gap} improvement in core areas.` },
      phases: [
        { title: "Phase 1: Core Systems & Foundational Gaps", status: "in_progress" },
        { title: "Phase 2: Distributed Architecture & Concurrency", status: "pending" },
        { title: "Phase 3: Applied Production Engineering & AI Tooling", status: "pending" },
        { title: "Phase 4: Capstone Execution & Production Deployment", status: "pending" }
      ]
    });
    roadmapCount++;
  }
  console.log(`✅ Seeded ${assmtCount} completed assessments with realistic scores.`);
  console.log(`✅ Seeded ${roadmapCount} personalized roadmaps with 4 distinct phases.`);

  // 4. Learning Resources
  let resCount = 0;
  for (const r of resourcesList) {
    const { error: rErr } = await supabase.from('learning_resources').insert({
      title: r.title,
      description: 'Comprehensive guide covering advanced best practices.',
      url: 'https://example.com/resource',
      type: r.type,
      domain: r.domain,
      difficulty: r.diff,
      tags: [r.domain, r.diff]
    });
    if (rErr) console.error(`Resource insert error:`, rErr.message);
    else resCount++;
  }
  console.log(`✅ Seeded ${resCount} curated learning resources.`);
  
  console.log("🎉 Seeding completed successfully!");
}

seed();
