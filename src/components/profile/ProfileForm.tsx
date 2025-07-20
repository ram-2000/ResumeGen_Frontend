"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, Profile } from "@/lib/schema";
import { useProfileStore } from "@/store/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PhoneInput, { formatPhoneNumber, isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { sampleAvatars, getRandomAvatar } from "@/lib/avatars";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface ProfileFormProps {
  profile?: Profile;
  onSave: () => void;
  onCancel: () => void;
}

export default function ProfileForm({ profile, onSave, onCancel }: ProfileFormProps) {
  const { addProfile, updateProfile } = useProfileStore();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<Omit<Profile, "phone">>({
    resolver: zodResolver(profileSchema.omit({ phone: true })),
    defaultValues: profile || {
      name: "New Profile",
      email: "",
      photoUrl: getRandomAvatar(),
    },
  });

  const [phones, setPhones] = useState<string[]>([]);
  const photoUrl = watch("photoUrl");

  useEffect(() => {
    if (profile) {
      setPhones(profile.phone);
    }
  }, [profile]);

  const handleAvatarChange = () => {
    const currentIndex = sampleAvatars.findIndex((avatar) => avatar === photoUrl);
    const nextIndex = (currentIndex + 1) % sampleAvatars.length;
    setValue("photoUrl", sampleAvatars[nextIndex]);
  };

  const {
    fields: workFields,
    append: appendWork,
    remove: removeWork,
  } = useFieldArray({
    control,
    name: "work_history",
  });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: "education",
  });

  const onSubmit = (data: Omit<Profile, "phone">) => {
    const formattedPhones = phones.map(p => (p && isValidPhoneNumber(p) ? formatPhoneNumber(p) : p));
    const profileData = { ...data, phone: formattedPhones };
    if (profile) {
      updateProfile(profile.id!, profileData);
      toast.success("Profile updated successfully!");
    } else {
      addProfile(profileData);
      toast.success("Profile created successfully!");
    }
    onSave();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{profile ? "Edit Profile" : "Create Profile"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={photoUrl} alt={profile?.name} />
                    <AvatarFallback>{profile?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button type="button" onClick={handleAvatarChange}>Change Avatar</Button>
            </div>
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" {...register("email")} />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div>
              <Label>Phone Numbers</Label>
              {phones.map((phone, index) => (
                <div key={index} className="flex items-center gap-2 mt-2">
                  <PhoneInput
                    international
                    defaultCountry="US"
                    value={phone}
                    onChange={(value) => {
                      const newPhones = [...phones];
                      newPhones[index] = value || "";
                      setPhones(newPhones);
                    }}
                  />
                  <Button type="button" variant="destructive" onClick={() => setPhones(phones.filter((_, i) => i !== index))}>
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" className="mt-2" onClick={() => setPhones([...phones, ""])}>
                Add Phone Number
              </Button>
            </div>
          
            <Card>
                <CardHeader>
                    <CardTitle>Work History</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {workFields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-md space-y-2">
                        <div className="flex justify-end">
                        <Button type="button" variant="destructive" size="sm" onClick={() => removeWork(index)}>
                            Remove
                        </Button>
                        </div>
                        <div>
                        <Label>Company</Label>
                        <Input {...register(`work_history.${index}.company` as const)} />
                        </div>
                        <div>
                        <Label>Position</Label>
                        <Input {...register(`work_history.${index}.position` as const)} />
                        </div>
                        <div>
                        <Label>Start Date</Label>
                        <Controller
                            control={control}
                            name={`work_history.${index}.start_date`}
                            render={({ field }) => {
                                const selectedDate = field.value ? new Date(field.value) : undefined;
                                return (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                        variant={"outline"}
                                        className="w-full justify-start text-left font-normal"
                                        >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {field.value ? field.value : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={(date) => field.onChange(date ? format(date, "MMM yyyy") : "")}
                                        initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            )}}
                        />
                    </div>
                    <div>
                        <Label>End Date</Label>
                         <Controller
                            control={control}
                            name={`work_history.${index}.end_date`}
                            render={({ field, fieldState }) => {
                                const isPresent = field.value === "Present";
                                return (
                                <>
                                <div className="flex items-center gap-2">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                            variant={"outline"}
                                            className="w-full justify-start text-left font-normal"
                                            disabled={isPresent}
                                            >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {field.value ? field.value : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                            mode="single"
                                            selected={field.value && field.value !== "Present" ? new Date(field.value) : undefined}
                                            onSelect={(date) => field.onChange(date ? format(date, "MMM yyyy") : "")}
                                            initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={isPresent}
                                            onChange={(e) => field.onChange(e.target.checked ? "Present" : "")}
                                        />
                                        <Label className="ml-2">Present</Label>
                                    </div>
                                </div>
                                {fieldState.error && <p className="text-red-500 text-sm">{fieldState.error.message}</p>}
                                </>
                            )}}
                        />
                    </div>
                    </div>
                    ))}
                    <Button type="button" onClick={() => appendWork({ company: "", position: "", start_date: "", end_date: "" })}>
                    Add Work Experience
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Education</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {educationFields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-md space-y-2">
                        <div className="flex justify-end">
                        <Button type="button" variant="destructive" size="sm" onClick={() => removeEducation(index)}>
                            Remove
                        </Button>
                        </div>
                        <div>
                        <Label>Degree</Label>
                        <Input {...register(`education.${index}.degree` as const)} />
                        </div>
                        <div>
                        <Label>School</Label>
                        <Input {...register(`education.${index}.school` as const)} />
                        </div>
                        <div>
                        <Label>Location</Label>
                        <Input {...register(`education.${index}.location` as const)} />
                        </div>
                        <div>
                        <Label>Start Date</Label>
                        <Controller
                            control={control}
                            name={`education.${index}.start_date`}
                            render={({ field }) => {
                                const selectedDate = field.value ? new Date(field.value) : undefined;
                                return (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                        variant={"outline"}
                                        className="w-full justify-start text-left font-normal"
                                        >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {field.value ? field.value : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={(date) => field.onChange(date ? format(date, "MMM yyyy") : "")}
                                        initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            )}}
                        />
                        </div>
                        <div>
                        <Label>End Date</Label>
                        <Controller
                            control={control}
                            name={`education.${index}.end_date`}
                            render={({ field }) => {
                                const selectedDate = field.value ? new Date(field.value) : undefined;
                                const isPresent = field.value === "Present";
                                return (
                                <div className="flex items-center gap-2">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                            variant={"outline"}
                                            className="w-full justify-start text-left font-normal"
                                            disabled={isPresent}
                                            >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {field.value ? field.value : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                            mode="single"
                                            selected={selectedDate}
                                            onSelect={(date) => field.onChange(date ? format(date, "MMM yyyy") : "")}
                                            initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={isPresent}
                                            onChange={(e) => field.onChange(e.target.checked ? "Present" : "")}
                                        />
                                        <Label className="ml-2">Present</Label>
                                    </div>
                                </div>
                                
                            )}}
                        />
                        </div>
                    </div>
                    ))}
                    <Button type="button" onClick={() => appendEducation({ degree: "", school: "", location: "", start_date: "", end_date: "" })}>
                    Add Education
                    </Button>
                </CardContent>
            </Card>

        </CardContent>
      </Card>
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Profile</Button>
      </div>
    </form>
  );
} 