const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../api-gateway/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials in api-gateway/.env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
  console.log("Verifying Supabase Connection to: " + supabaseUrl);
  
  // 1. Check assessment_questions
  const { data: questions, error: qError } = await supabase.from('assessment_questions').select('id');
  if (qError) {
    console.error("❌ Error querying assessment_questions:", qError.message);
  } else {
    console.log(`✅ assessment_questions: Found ${questions.length} seed rows`);
  }

  // 2. Check learning_resources
  const { data: resources, error: rError } = await supabase.from('learning_resources').select('id');
  if (rError) {
    console.error("❌ Error querying learning_resources:", rError.message);
  } else {
    console.log(`✅ learning_resources: Found ${resources.length} seed rows`);
  }

  // 3. Check profiles (should be empty but accessible)
  const { data: profiles, error: pError } = await supabase.from('profiles').select('id');
  if (pError) {
    console.error("❌ Error querying profiles:", pError.message);
  } else {
    console.log(`✅ profiles: Table is accessible (Found ${profiles.length} rows)`);
  }

  console.log("Verification Complete.");
}

verify();
