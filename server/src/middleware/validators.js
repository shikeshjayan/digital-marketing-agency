import { body, validationResult } from 'express-validator';

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=])[A-Za-z\d@$!%*?&#^()_\-+=]{8,}$/;

const passwordMessage =
  'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.array().map((e) => e.msg).join(', ');
    return res.status(400).json({ success: false, message });
  }
  next();
};

export const registerRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters')
    .isLength({ max: 20 }).withMessage('Username cannot exceed 20 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(passwordRegex).withMessage(passwordMessage),
];

export const loginRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address'),
  body('password')
    .notEmpty().withMessage('Password is required'),
];

export const forgotPasswordRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address'),
];

export const resetPasswordRules = [
  body('otp')
    .trim()
    .notEmpty().withMessage('OTP code is required')
    .isNumeric().withMessage('OTP must contain numbers only')
    .isLength({ min: 6, max: 6 }).withMessage('OTP must be exactly 6 digits'),
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(passwordRegex).withMessage(passwordMessage),
];