import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Profile } from "@/lib/schema";
import { createId } from "@paralleldrive/cuid2";
import { getRandomAvatar, sampleAvatars } from "@/lib/avatars";

interface AtsScore {
  score: number;
  match_rate: number;
  missing_keywords: string[];
  summary: string;
  matched_keywords: string[];
}

interface ResumeResult {
  job_id: string;
  pdf_filename: string;
  download_url: string;
  ats_score: AtsScore;
  timestamp: string;
}

interface ProfileState {
  profiles: Profile[];
  selectedProfileId: string | null;
  history: ResumeResult[];
  addHistory: (result: ResumeResult) => void;
  addProfile: (profile: Partial<Profile>) => void;
  updateProfile: (id: string, profile: Partial<Profile>) => void;
  removeProfile: (id: string) => void;
  selectProfile: (id: string | null) => void;
  resetProfiles: () => void;
}

const createInitialProfile = (): Profile => {
  const id = createId();
  return {
    id,
    photoUrl: sampleAvatars[0],
    name: "Shiva Narayana Abhiram Maddala",
    email: "abhiram2maddala@gmail.com",
    phone: ["+19372694852"],
    work_history: [
      {
        company: "BigCommerce",
        position: "Data Engineer II",
        start_date: "May 2023",
        end_date: "Present",
      },
      {
        company: "Fulton Bank",
        position: "Data Engineer I",
        start_date: "Jan 2020",
        end_date: "Aug 2022",
      },
    ],
    education: [
      {
        degree: "Master of Science in Computer Engineering",
        school: "University of Dayton",
        location: "Ohio, USA",
        start_date: "Aug 2022",
        end_date: "May 2024",
      },
      {
        degree: "Bachelor of Technology in Computer Science",
        school: "Andhra University",
        location: "Andhra Pradesh, India",
        start_date: "Aug 2017",
        end_date: "May 2021",
      },
    ],
  };
};

const initialProfile = createInitialProfile();

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profiles: [initialProfile],
      selectedProfileId: initialProfile.id!,
      history: [],
      addHistory: (result) =>
        set((state) => ({ history: [result, ...state.history] })),
      addProfile: (profile) =>
        set((state) => {
          const newId = createId();
          const newProfile: Profile = {
            id: newId,
            photoUrl: profile.photoUrl || getRandomAvatar(),
            name: profile.name || "New Profile",
            email: profile.email || "",
            phone: profile.phone || [],
            work_history: profile.work_history || [],
            education: profile.education || [],
          };
          return { profiles: [...state.profiles, newProfile] };
        }),
      updateProfile: (id, profile) =>
        set((state) => ({
          profiles: state.profiles.map((p) =>
            p.id === id ? { ...p, ...profile } : p
          ),
        })),
      removeProfile: (id) =>
        set((state) => ({
          profiles: state.profiles.filter((p) => p.id !== id),
        })),
      selectProfile: (id) => set({ selectedProfileId: id }),
      resetProfiles: () => {
        const newInitialProfile = createInitialProfile();
        set({ profiles: [newInitialProfile], selectedProfileId: newInitialProfile.id! });
      },
    }),
    {
      name: "profile-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
); 