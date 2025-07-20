"use client";

import { useState } from "react";
import { useProfileStore } from "@/store/profile";
import ProfileSelector from "@/components/profile/ProfileSelector";
import ProfileDetails from "@/components/profile/ProfileDetails";
import ProfileForm from "@/components/profile/ProfileForm";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { educationSchema } from "@/lib/schema";
import { z } from "zod";

type Education = z.infer<typeof educationSchema> & { duration?: string };

export default function ProfilePage() {
  const { profiles, selectedProfileId, resetProfiles, addProfile } = useProfileStore();
  const [editing, setEditing] = useState(false);
  const [creating, setCreating] = useState(false);

  const selectedProfile = profiles.find((p) => p.id === selectedProfileId);

  const handleSave = () => {
    setEditing(false);
    setCreating(false);
  };

  const handleCancel = () => {
    setEditing(false);
    setCreating(false);
  };

  const handleJsonUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          
          if (typeof json.phone === 'string') {
            const digitsOnly = json.phone.replace(/\D/g, '');
            json.phone = [`+${digitsOnly}`];
          }

          if (json.education) {
            json.education = json.education.map((edu: Education) => {
              if (edu.duration) {
                const [start_date, end_date] = edu.duration.split(' -- ');
                return { ...edu, start_date, end_date: end_date || 'Present' };
              }
              return edu;
            });
          }

          addProfile(json);
          toast.success("Profile imported successfully!");
        } catch {
          toast.error("Invalid JSON file or data structure.");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-center">Manage Profiles</h1>
        <div className="flex gap-2">
          <Button
            onClick={resetProfiles}
            variant="secondary"
            disabled={profiles.length <= 1}
          >
            Reset Profiles
          </Button>
          <Button asChild variant="outline">
            <label htmlFor="json-upload">
              Import from JSON
              <input
                id="json-upload"
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleJsonUpload}
              />
            </label>
          </Button>
        </div>
      </div>
      
      {!selectedProfileId && !creating && (
        <ProfileSelector setCreating={setCreating} />
      )}
      
      {creating && (
        <ProfileForm onSave={handleSave} onCancel={handleCancel} />
      )}
      
      {selectedProfile && !editing && (
        <>
          <ProfileSelector setCreating={setCreating} />
          <div className="mt-8">
            <ProfileDetails setEditing={setEditing} />
          </div>
        </>
      )}

      {selectedProfile && editing && (
        <ProfileForm profile={selectedProfile} onSave={handleSave} onCancel={handleCancel} />
      )}
    </main>
  );
} 