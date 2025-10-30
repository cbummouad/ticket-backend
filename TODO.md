# TODO: Fix Serverless Function Crash and Enable CORS for Frontend

## Steps to Complete:
1. **Modify app.js to conditionally disable Socket.IO for serverless environments** - Check if running on Vercel and skip Socket.IO setup to prevent crashes.
2. **Verify CORS configuration** - Ensure frontend origins are allowed (currently set to localhost:5173 and Vercel backend URL).
3. **Test the changes** - Deploy to Vercel or run locally to confirm no more 500 errors and CORS works.
4. **Update if needed** - If frontend URL changes, add it to AllowedCors array.

## Progress:
- [ ] Step 1: Edit app.js for Socket.IO conditional setup
- [ ] Step 2: Confirm CORS origins
- [ ] Step 3: Test deployment
- [ ] Step 4: Final verification
