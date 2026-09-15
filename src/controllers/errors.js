// Import any needed model functions (none are needed for the error pages, so this is empty)

// Define any controller functions

// Test route to deliberately trigger a 500 error for testing error-handling middleware
const testErrorPage = (req, res, next) => {
    const err = new Error('This is a test error');
    err.status = 500;
    next(err); // Forward the error to the global error handler
};

// Export any controller functions
export { testErrorPage };
