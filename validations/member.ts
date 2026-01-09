import { z } from "zod";

export const MemberSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  position: z.string().optional(),
  email: z.string().email().optional(),
  avatarUrl: z.string().url().optional(),
});

export type Member = z.infer<typeof MemberSchema>;