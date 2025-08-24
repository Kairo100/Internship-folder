  // src/auth/auth.controller.ts
  import { Request, Response, NextFunction } from 'express';
  import * as authService from './auth.service';
  import catchAsync from '../utils/catchAsync';
  import AppError from '../utils/AppError';
  import { signupSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, updatePasswordSchema } from './auth.validation';
  import { AuthRequest } from '../auth/auth.middleware'; // For authenticated requests

  // Helper function to send JWT token in a cookie and as JSON
  const sendTokenResponse = (user: any, statusCode: number, token: string, res: Response) => {
    const cookieOptions = {
      expires: new Date(Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRES_IN_DAYS || '90', 10)) * 24 * 60 * 60 * 1000), // Convert to milliseconds
      httpOnly: true, // Prevents client-side JS from accessing the cookie
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
    };

    res.cookie('jwt', token, cookieOptions);

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user,
      },
    });
  };


  // Register a new user
  export const signup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validatedData = signupSchema.safeParse(req.body);
  console.log("[Signup Controller] Incoming body:", req.body); // raw request body
  console.log("[Signup Controller] Validation result:", validatedData); // Zod validation result

    if (!validatedData.success) {
      // FIX: Changed .errors to .issues
      
      return next(new AppError(validatedData.error.issues[0].message, 400));
    }

    const { user, token } = await authService.registerUser(validatedData.data);
    sendTokenResponse(user, 201, token, res);
  });

  // Login a user
  export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const validatedData = loginSchema.safeParse(req.body);
     console.log("[Login Controller] Incoming body:", req.body); // raw request body
  console.log("[Login Controller] Validation result:", validatedData); // Zod validation result
    if (!validatedData.success) {
      // FIX: Changed .errors to .issues
      return next(new AppError(validatedData.error.issues[0].message, 400));
    }

    const { email, password } = validatedData.data;
    const { user, token } = await authService.loginUser(email, password);
    sendTokenResponse(user, 200, token, res);
  });

  // Logout user
  export const logout = (req: Request, res: Response) => {
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000), // Expires in 10 seconds
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    res.status(200).json({ status: 'success', message: 'Logged out successfully' });
  };

  // Request password reset
  export const forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const validatedData = forgotPasswordSchema.safeParse(req.body);
    if (!validatedData.success) {
      // FIX: Changed .errors to .issues
      return next(new AppError(validatedData.error.issues[0].message, 400));
    }

    const { message } = await authService.requestPasswordReset(validatedData.data.email);
    res.status(200).json({
      status: 'success',
      message,
    });
  });

  // Reset password using token
  export const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Combine params and body for validation
    const validatedData = resetPasswordSchema.safeParse({ ...req.params, ...req.body });
    if (!validatedData.success) {
      // FIX: Changed .errors to .issues
      return next(new AppError(validatedData.error.issues[0].message, 400));
    }

    // FIX: Destructure 'password' from validatedData.data, not 'new_password'
    const { token, password: newPassword } = validatedData.data;
    const { user, token: newToken } = await authService.resetUserPassword(token, newPassword);
    sendTokenResponse(user, 200, newToken, res);
  });

  // Update password for authenticated user
  export const updatePassword = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const validatedData = updatePasswordSchema.safeParse(req.body);
    if (!validatedData.success) {
      // FIX: Changed .errors to .issues
      return next(new AppError(validatedData.error.issues[0].message, 400));
    }

    // FIX: Destructure 'new_password' as 'newPassword' from validatedData.data
    const { current_password: currentPassword, new_password: newPassword } = validatedData.data;
    const { user, token } = await authService.updateCurrentUserPassword(req.user!.id, currentPassword, newPassword);
    sendTokenResponse(user, 200, token, res);
  });










  // import { Request, Response, NextFunction } from 'express';
  // import * as authService from './auth.service';
  // import catchAsync from '../utils/catchAsync';
  // import AppError from '../utils/AppError';
  // // CORRECTED IMPORT PATH for Yup schemas
  // import { signupSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, updatePasswordSchema } from './auth.validation';
  // import { AuthRequest } from '../auth/auth.middleware'; // For authenticated requests
  // import { ValidationError } from 'yup'; // Import ValidationError from yup

  // // Helper function to send JWT token in a cookie and as JSON
  // const sendTokenResponse = (user: any, statusCode: number, token: string, res: Response) => {
  //   const cookieOptions = {
  //     expires: new Date(Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRES_IN_DAYS || '90', 10)) * 24 * 60 * 60 * 1000), // Convert to milliseconds
  //     httpOnly: true, // Prevents client-side JS from accessing the cookie
  //     secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
  //   };

  //   res.cookie('jwt', token, cookieOptions);

  //   // Remove password from output
  //   user.password = undefined;

  //   res.status(statusCode).json({
  //     status: 'success',
  //     token,
  //     data: {
  //       user,
  //     },
  //   });
  // };


  // // Register a new user
  // export const signup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  //   // Add this console.log to confirm what req.body receives
  //   console.log('Incoming req.body in signup controller:', req.body);

  //   try {
  //     // Correct Yup validation: use .validate()
  //     // Line 37 will be here or very close, where the validation logic is applied.
  //     const validatedData = await signupSchema.validate(req.body, { abortEarly: false });

  //     // validatedData now contains the properly parsed and validated object
  //     const { user, token } = await authService.registerUser(validatedData);
  //     sendTokenResponse(user, 201, token, res);

  //   } catch (error: any) {
  //     if (error instanceof ValidationError) { // Check if it's a Yup validation error
  //       // Yup validation errors have an 'errors' array
  //       return next(new AppError(error.errors.join(', '), 400));
  //     }
  //     // Handle other unexpected errors
  //     console.error("Signup error (unexpected):", error);
  //     return next(new AppError('An unexpected error occurred during signup.', 500));
  //   }
  // });

  // // Login a user
  // export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  //   console.log('Incoming req.body in login controller:', req.body);
  //   try {
  //     // Correct Yup validation: use .validate()
  //     const validatedData = await loginSchema.validate(req.body, { abortEarly: false });

  //     const { email, password } = validatedData; // Destructure directly from validatedData
  //     const { user, token } = await authService.loginUser(email, password);
  //     sendTokenResponse(user, 200, token, res);
  //   } catch (error: any) {
  //     if (error instanceof ValidationError) {
  //       return next(new AppError(error.errors.join(', '), 400));
  //     }
  //     console.error("Login error (unexpected):", error);
  //     return next(error);
  //   }
  // });

  // // Logout user
  // export const logout = (req: Request, res: Response) => {
  //   res.cookie('jwt', 'loggedout', {
  //     expires: new Date(Date.now() + 10 * 1000), // Expires in 10 seconds
  //     httpOnly: true,
  //     secure: process.env.NODE_ENV === 'production',
  //   });
  //   res.status(200).json({ status: 'success', message: 'Logged out successfully' });
  // };

  // // Request password reset
  // export const forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  //   console.log('Incoming req.body in forgotPassword controller:', req.body);
  //   try {
  //     // Correct Yup validation: use .validate()
  //     const validatedData = await forgotPasswordSchema.validate(req.body, { abortEarly: false });

  //     const { message } = await authService.requestPasswordReset(validatedData.email);
  //     res.status(200).json({
  //       status: 'success',
  //       message,
  //     });
  //   } catch (error: any) {
  //     if (error instanceof ValidationError) {
  //       return next(new AppError(error.errors.join(', '), 400));
  //     }
  //     console.error("Forgot password error (unexpected):", error);
  //     return next(error);
  //   }
  // });

  // // Reset password using token
  // export const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  //   console.log('Incoming req.body/params in resetPassword controller:', { body: req.body, params: req.params });
  //   try {
  //     // Combine params and body for validation
  //     const dataToValidate = { ...req.params, ...req.body };
  //     // Correct Yup validation: use .validate()
  //     const validatedData = await resetPasswordSchema.validate(dataToValidate, { abortEarly: false });

  //     // Destructure 'password' from validatedData, as per your schema
  //     const { token, password: newPassword } = validatedData;
  //     const { user, token: newToken } = await authService.resetUserPassword(token, newPassword);
  //     sendTokenResponse(user, 200, newToken, res);
  //   } catch (error: any) {
  //     if (error instanceof ValidationError) {
  //       return next(new AppError(error.errors.join(', '), 400));
  //     }
  //     console.error("Reset password error (unexpected):", error);
  //     return next(error);
  //   }
  // });

  // // Update password for authenticated user
  // export const updatePassword = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  //   console.log('Incoming req.body in updatePassword controller:', req.body);
  //   try {
  //     // Correct Yup validation: use .validate()
  //     const validatedData = await updatePasswordSchema.validate(req.body, { abortEarly: false });

  //     // Destructure using the names from your schema (e.g., current_password, new_password)
  //     const { current_password: currentPassword, new_password: newPassword } = validatedData;
  //     const { user, token } = await authService.updateCurrentUserPassword(req.user!.id, currentPassword, newPassword);
  //     sendTokenResponse(user, 200, token, res);
  //   } catch (error: any) {
  //     if (error instanceof ValidationError) {
  //       return next(new AppError(error.errors.join(', '), 400));
  //     }
  //     console.error("Update password error (unexpected):", error);
  //     return next(error);
  //   }
  // });
