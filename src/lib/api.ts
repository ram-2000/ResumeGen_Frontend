import axios from "axios";
import { Profile, ApiProfile } from "./schema";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001",
  headers: {
    "Content-Type": "application/json",
  },
});

export const checkHealth = async () => {
  try {
    const response = await apiClient.get("/health");
    return response.data;
  } catch (error) {
    console.error("Health check failed:", error);
    throw error;
  }
};

export const generateResume = async (
  person_data: Profile,
  job_description: string
) => {
  const apiProfile: ApiProfile = {
    ...person_data,
    phone: person_data.phone.join(", "),
  };

  try {
    const response = await apiClient.post("/api/generate-resume", {
      person_data: apiProfile,
      job_description,
    });
    return response.data;
  } catch (error) {
    console.error("Resume generation failed:", error);
    throw error;
  }
};

export default apiClient; 