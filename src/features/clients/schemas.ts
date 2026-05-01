import { z } from "zod";

export const createClientSchema = z.object({
  name: z
    .string()
    .min(1, "Client name is required")
    .max(100, "Client name must be under 100 characters"),
  company: z
    .string()
    .max(100, "Company name must be under 100 characters")
    .optional(),
  industry: z.string().optional(),
  email: z
    .string()
    .email("Enter a valid email address")
    .optional()
    .or(z.literal("")),
  notes: z
    .string()
    .max(500, "Notes must be under 500 characters")
    .optional(),
});

export type CreateClientSchema = z.infer<typeof createClientSchema>;
