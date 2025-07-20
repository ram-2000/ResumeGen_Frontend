import { z } from "zod";

export const workHistorySchema = z
  .object({
    company: z.string().min(1, "Company name is required"),
    position: z.string().min(1, "Position is required"),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.end_date && data.end_date !== "Present" && data.start_date) {
        return new Date(data.end_date) > new Date(data.start_date);
      }
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["end_date"],
    }
  );

export const educationSchema = z
  .object({
    degree: z.string().min(1, "Degree is required"),
    school: z.string().min(1, "School name is required"),
    location: z.string(),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.end_date && data.end_date !== "Present" && data.start_date) {
        return new Date(data.end_date) > new Date(data.start_date);
      }
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["end_date"],
    }
  );

export const profileSchema = z.object({
  id: z.string().optional(),
  photoUrl: z.string().url().optional(),
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.array(z.string()),
  work_history: z.array(workHistorySchema),
  education: z.array(educationSchema),
});

export type Profile = z.infer<typeof profileSchema>;

export type ApiProfile = Omit<Profile, "phone"> & {
  phone?: string;
}; 