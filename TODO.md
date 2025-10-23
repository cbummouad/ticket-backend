# TODO List for Ticket Management Backend Initialization

- [x] Initialize npm project with package.json
- [x] Install necessary dependencies (express, @supabase/supabase-js, dotenv, cors)
- [x] Create MVC folder structure (controllers/, models/, routes/, config/)
- [x] Create config/supabase.js for Supabase configuration
- [x] Create models/Ticket.js for ticket model
- [x] Create controllers/ticketController.js for ticket logic
- [x] Create routes/ticketRoutes.js for ticket routes
- [x] Create app.js as the main entry point
- [x] Create .env file for environment variables
- [x] Update package.json with start script
- [x] Add authentication with JWT and Supabase Auth
- [x] Protect ticket routes with authentication middleware
- [x] Test server startup and health endpoint
- [ ] Configure Supabase project settings (allow all emails or specific domains)
- [ ] Create 'tickets' table in Supabase database with columns: id (uuid, primary), title (text), description (text), status (text, default 'open'), created_at (timestamptz), updated_at (timestamptz)
- [x] Test authentication endpoints with valid email
- [x] Test ticket CRUD operations
