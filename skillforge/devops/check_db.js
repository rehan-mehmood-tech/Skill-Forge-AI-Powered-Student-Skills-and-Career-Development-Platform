const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../api-gateway/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDb() {
  console.log("Checking Supabase DB Connectivity...");
  
  const { data: questions, error: qErr } = await supabase.from('assessment_questions').select('id');
  if (qErr) {
    console.error("❌ Failed to read assessment_questions:", qErr.message);
  } else {
    console.log(`✅ Success: assessment_questions returned ${questions.length} rows.`);
  }

  const { data: resources, error: rErr } = await supabase.from('learning_resources').select('id');
  if (rErr) {
    console.error("❌ Failed to read learning_resources:", rErr.message);
  } else {
    console.log(`✅ Success: learning_resources returned ${resources.length} rows.`);
  }
}

checkDb();
