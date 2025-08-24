// validationSchemas.ts
import * as yup from 'yup';

// Login form validation schema
export const loginSchema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});



export const signupSchema = yup.object({
  name: yup
    .string()
    .required('Name is required'),

  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),

  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')
    .required('Password is required'),

  password_confirm: yup
  .string()
  .oneOf([yup.ref('password'), undefined], 'Passwords must match')
  .required('Confirm password is required'),

});
