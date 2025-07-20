"use client";

import { useProfileStore } from "@/store/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

interface ProfileSelectorProps {
  setCreating: (creating: boolean) => void;
}

export default function ProfileSelector({ setCreating }: ProfileSelectorProps) {
  const { profiles, selectedProfileId, selectProfile } = useProfileStore();

  const handleAddClick = () => {
    selectProfile(null);
    setCreating(true);
  };

  return (
    <div className="flex justify-center items-start gap-8 py-12 flex-wrap">
      {profiles.map((profile) => (
        <div
          key={profile.id}
          className="flex flex-col items-center gap-2 cursor-pointer w-32 text-center"
          onClick={() => profile.id && selectProfile(profile.id)}
        >
          <Avatar className={`h-24 w-24 border-4 ${selectedProfileId === profile.id ? "border-primary" : "border-transparent"}`}>
            <AvatarImage src={profile.photoUrl} alt={profile.name} />
            <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <p className="text-lg font-medium break-words">{profile.name}</p>
        </div>
      ))}
      <div className="flex flex-col items-center gap-2 w-32 text-center">
        <Button
          className="h-24 w-24 rounded-full border-4 border-dashed"
          variant="outline"
          onClick={handleAddClick}
        >
          <PlusIcon className="h-12 w-12" />
        </Button>
        <p className="text-lg font-medium">Add Profile</p>
      </div>
    </div>
  );
} 