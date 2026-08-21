const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create Supabase Admin client
const supabase = createClient(supabaseUrl, supabaseKey);

const verifySupabaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Authorization token required" });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Attach user to request
    req.user = user;
    
    // Since some roles might be in user_metadata or the DB, we try to fetch it
    // In our DB schema from 01_init.sql, role is stored in profiles table.
    // We will attach the profile role to req.user as well.
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
      
    if (!profileError && profileData) {
      req.user.role = profileData.role;
    } else {
      // fallback to metadata if profile not found
      req.user.role = user.user_metadata?.role || 'student';
    }

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ error: "Forbidden: No role assigned" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
    }

    next();
  };
};

module.exports = {
  verifySupabaseToken,
  requireRole,
  supabase
};
