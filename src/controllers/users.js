import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import { authenticateUser, createUser, getAllUsers } from '../models/users.js';
import { getVolunteerProjects } from '../models/projects.js';

const registrationValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required.')
        .isLength({ max: 100 })
        .withMessage('Name cannot exceed 100 characters.'),
    body('email')
        .trim()
        .isEmail()
        .withMessage('Enter a valid email address.')
        .isLength({ max: 100 })
        .withMessage('Email cannot exceed 100 characters.')
        .normalizeEmail(),
    body('password')
        .isString()
        .notEmpty()
        .withMessage('Password is required.')
];

const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

const processUserRegistrationForm = async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        validationErrors.array().forEach(({ msg }) => req.flash('error', msg));
        return res.redirect('/register');
    }

    const { name, email, password } = req.body;

    try {
        const passwordHash = await bcrypt.hash(password, 10);
        await createUser(name, email, passwordHash);
        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/login');
    } catch (error) {
        if (error.code === '23505') {
            req.flash('error', 'An account with that email already exists.');
        } else {
            console.error('Error registering user:', error);
            req.flash('error', 'An error occurred during registration. Please try again.');
        }
        res.redirect('/register');
    }
};

const showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

const processLoginForm = async (req, res) => {
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';

    if (!email || !password) {
        req.flash('error', 'Enter your email and password.');
        return res.redirect('/login');
    }

    try {
        const user = await authenticateUser(email, password);
        if (!user) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }

        await new Promise((resolve, reject) => {
            req.session.regenerate((error) => error ? reject(error) : resolve());
        });
        req.session.user = user;
        req.flash('success', 'Login successful!');

        if (res.locals.NODE_ENV === 'development') {
            console.log('User logged in:', user);
        }

        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error during login:', error);
        req.flash('error', 'An error occurred during login. Please try again.');
        res.redirect('/login');
    }
};

const processLogout = async (req, res) => {
    await new Promise((resolve, reject) => {
        req.session.regenerate((error) => error ? reject(error) : resolve());
    });
    req.flash('success', 'Logout successful!');
    res.redirect('/login');
};

const requireLogin = (req, res, next) => {
    if (!req.session?.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }

    next();
};

// Return middleware configured for one role, such as requireRole('admin').
const requireRole = (role, unauthorizedRedirect = '/') => (req, res, next) => {
    if (!req.session?.user) {
        req.flash('error', 'You must be logged in to access this page.');
        return res.redirect('/login');
    }

    if (req.session.user.role_name !== role) {
        req.flash('error', 'You do not have permission to access this page.');
        return res.redirect(unauthorizedRedirect);
    }

    next();
};

const showDashboard = async (req, res) => {
    const { name, email, role_name: role } = req.session.user;
    const volunteerProjects = await getVolunteerProjects(req.session.user.user_id);
    res.render('dashboard', { title: 'Dashboard', name, email, role, volunteerProjects });
};

const showUsersPage = async (req, res) => {
    const users = await getAllUsers();
    res.render('users', { title: 'Registered Users', users });
};

export {
    registrationValidation,
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    requireRole,
    showDashboard,
    showUsersPage
};