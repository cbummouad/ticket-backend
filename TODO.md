# Integration of Supabase Auth with Local User Model Sync

## Tasks
- [x] Update authController.js: Modify register to use supabase.auth.signUp() and sync to local 'users' table
- [x] Update authController.js: Modify login to use supabase.auth.signInWithPassword() and return session token
- [x] Update authController.js: Ensure logout uses Supabase signOut
- [x] Update middleware/auth.js: Replace JWT verification with Supabase session check
- [x] Verify User model handles Supabase user ID correctly
- [x] Remove unused bcrypt and jwt dependencies if no longer needed
- [x] Test the authentication flow
