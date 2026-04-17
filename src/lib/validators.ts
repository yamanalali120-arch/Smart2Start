import { z } from "zod";

/** Login form validation */
export const loginSchema = z.object({
  email: z.string().email("Bitte gib eine gültige E-Mail-Adresse ein."),
  password: z.string().min(6, "Passwort muss mindestens 6 Zeichen lang sein."),
});
export type LoginFormData = z.infer<typeof loginSchema>;

/** Reset password validation */
export const resetPasswordSchema = z.object({
  email: z.string().email("Bitte gib eine gültige E-Mail-Adresse ein."),
});
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

/** Set password validation */
export const setPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Passwort muss mindestens 8 Zeichen lang sein.")
      .regex(/[A-Z]/, "Mindestens ein Großbuchstabe erforderlich.")
      .regex(/[0-9]/, "Mindestens eine Zahl erforderlich."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwörter stimmen nicht überein.",
    path: ["confirmPassword"],
  });
export type SetPasswordFormData = z.infer<typeof setPasswordSchema>;

/** Create user validation (admin) */
export const createUserSchema = z.object({
  username: z
    .string()
    .min(5, "Username muss mindestens 5 Zeichen lang sein.")
    .regex(
      /^[a-z]+\.[a-z]+\.brillee$/,
      "Format: vorname.nachname.brillee"
    ),
  displayName: z.string().min(2, "Name muss mindestens 2 Zeichen lang sein."),
  email: z.string().email("Bitte gib eine gültige E-Mail-Adresse ein."),
  role: z.enum(["admin", "learner"]),
});
export type CreateUserFormData = z.infer<typeof createUserSchema>;

/** Daily goal update */
export const dailyGoalSchema = z.object({
  dailyGoalMinutes: z.enum(["5", "10", "15", "20"]),
});

/** Quiz answer validation */
export const quizAnswerSchema = z.object({
  questionId: z.string().uuid(),
  answer: z.any(), // flexible because different question types
  timeSpentSeconds: z.number().optional(),
});
