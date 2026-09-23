import express from 'express';
import session from 'express-session';
import { fileURLToPath } from 'url';
import path from 'path';
import { testConnection } from './src/models/db.js';
import router from './src/routes.js';
import flash from './src/middleware/flash.js';

// Define the application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
// define port number server will listen on
const PORT = process.env.PORT || 3000;
// secret key used to sign the session ID cookie (keep this private, never commit .env)
const SESSION_SECRET = process.env.SESSION_SECRET;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// config. express middleware
//serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

//config calls must come before routes because express needs to know about the templating engine before it tries to render any templates.
app.set('view engine', 'ejs');

// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));

// Application Middleware

// In-memory session storage; gives each visitor a req.session object to persist data across requests
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

// Flash messages rely on req.session, so this must run after the session middleware
app.use(flash);

// Allow Express to receive and process common POST data (form submissions and JSON bodies)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware to log all incoming requests (runs on every request)
app.use((req, res, next) => {
    if (NODE_ENV === 'development') {
        console.log(`${req.method} ${req.url}`);
    }
    next(); // Pass control to the next middleware or route
});

// Middleware to make NODE_ENV available to all EJS templates via res.locals
app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV;
    next(); // Pass control to the next middleware or route
});

// Use the imported router to handle application routes
app.use(router);

// Error Handling Middleware

// Catch-all route for 404 errors (triggers if no routes matched above)
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err); // Forward 404 error to the global error handler
});

// Global error handler (4 parameters tells Express this is an error-handling middleware)
app.use((err, req, res, next) => {
    // Log error details to the server console for debugging
    console.error('Error occurred:', err.message);
    console.error('Stack trace:', err.stack);
    
    // Determine status and template based on error status
    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';
    
    // Prepare data context for the error template
    const context = {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: err.message,
        stack: err.stack
    };
    
    // Render the appropriate error template with the status code
    res.status(status).render(`errors/${template}`, context);
});

// Start listening for incoming connections
app.listen(PORT, async () => {
  try {
    await testConnection();
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
});