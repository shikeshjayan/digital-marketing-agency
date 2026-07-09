import * as yup from "yup";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=])[A-Za-z\d@$!%*?&#^()_\-+=]{8,}$/;

export const registerSchema = yup.object().shape({
  username: yup
    .string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username cannot exceed 20 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address")
    .matches(
      emailRegex,
      "Please enter a valid email address (e.g., user@example.com)",
    ),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      passwordRegex,
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
  consent: yup
    .boolean()
    .oneOf([true], "You must agree to the Internal Data Policies."),
});
