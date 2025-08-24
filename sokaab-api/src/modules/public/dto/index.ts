import * as z from 'zod';

export const CheckAccountSchema = z.object({
  bank: z.string(),
  project_id: z.number(),
});
export type CheckAccountDto = z.infer<typeof CheckAccountSchema>;

export const PaymentSchema = z.object({
  name: z.string(),
  phone: z.string(),
  amount: z.string(),
  project_id: z.number(),
  accNo: z.string(),
  service: z.string(),
  bank: z.string(),
});
export type PaymentDto = z.infer<typeof PaymentSchema>;

export const PaystackSchema = z.object({
  name: z.string(),
  email: z.string(),
  amount: z.string(),
  project_id: z.number(),
  accNo: z.string(),
  // service: z.string(),
  // bank: z.string(),
  service: z.string().refine((val) => val === 'paystack', {
    // message: "Service must equal 'paystack'",
    message: 'Invalid value',
  }),
  bank: z.string().refine((val) => val === 'Paystack', {
    // message: "Bank must equal 'Paystack'",
    message: 'Invalid value',
  }),
});
export type PaystackDto = z.infer<typeof PaystackSchema>;

export const ProjectUpdateActivitytSchema = z.object({
  title: z.string(),
  description: z.string(),
  recaptcha: z.string().min(1, 'reCAPTCHA verification is required'),
  picture: z
    // .instanceof(File)
    .any(),
  // .refine((file) => file.size <= 2 * 1024 * 1024, 'Max file size is 2MB')
  // .refine(
  //   (file) => ['image/jpeg', 'image/png'].includes(file.type),
  //   'Only .jpg, .png, formats are supported.',
  // ),
  // .refine((file) => file.length <= 5 * 1024 * 1024, 'Max file size is 5MB')
  // .refine(
  //   (file: any) =>
  //     ['image/jpeg', 'image/png', 'image/gif'].includes(file.mimetype),
  //   'Only .jpg, .png, .gif formats are supported.',
  // ),
});
export type ProjectUpdateActivitytDto = z.infer<
  typeof ProjectUpdateActivitytSchema
>;

export const DahabshiilServiceSchema = z.object({
  transactionDate: z.string(),
  transactionNo: z.string(),
  transactionAmount: z.number(),
  accountNo: z.string(),
  donarName: z.string(),
  narration: z.string(),
  chargedAmount: z.string(),
  transactionType: z.string(),
  drcr: z.string(),
  currency: z.string(),
  uti: z.string(),
});
export type DahabshiilServiceDto = z.infer<typeof DahabshiilServiceSchema>;
