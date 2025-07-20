"use client";

import { useProfileStore } from "@/store/profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ProfileDetails({ setEditing }: { setEditing: (editing: boolean) => void }) {
  const { profiles, selectedProfileId, removeProfile, selectProfile } = useProfileStore();
  const profile = profiles.find((p) => p.id === selectedProfileId);

  if (!profile) {
    return null;
  }
  
  const handleDelete = () => {
    if (profile && profile.id) {
      removeProfile(profile.id);
      selectProfile(null);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{profile.name}&apos;s Profile</CardTitle>
        <div className="flex gap-2">
          <Button onClick={() => setEditing(true)}>Edit Profile</Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Profile</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this
                  profile and remove the data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold">Email</h3>
          <p>{profile.email}</p>
        </div>
        <div>
          <h3 className="font-semibold">Phone Numbers</h3>
          <ul className="list-disc list-inside">
            {Array.isArray(profile.phone)
              ? profile.phone.map((phone, index) => (
                  <li key={index}>{phone}</li>
                ))
              : <li>{profile.phone}</li>
            }
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">Work History</h3>
          {profile.work_history.map((job, index) => (
            <div key={`${job.company}-${index}`} className="mt-2 p-2 border-b">
              <p className="font-bold">{job.position} at {job.company}</p>
              <p className="text-sm text-gray-600">
                {job.start_date} - {job.end_date || 'Present'}
              </p>
            </div>
          ))}
        </div>
        <div>
          <h3 className="font-semibold">Education</h3>
          {profile.education.map((edu, index) => (
            <div key={`${edu.school}-${index}`} className="mt-2 p-2 border-b">
              <p className="font-bold">{edu.degree} from {edu.school}</p>
              <p className="text-sm text-gray-600">
                {edu.location} | {edu.start_date} - {edu.end_date || 'Present'}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 