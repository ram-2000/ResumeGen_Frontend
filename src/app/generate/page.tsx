"use client";

import { useState } from "react";
import { useProfileStore } from "@/store/profile";
import { generateResume } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import AtsScore from "@/components/generate/AtsScore";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import Stepper from "@/components/generate/Stepper";

interface GenerationResult {
  ats_score: {
    score: number;
    summary: string;
    matched: string[];
    missing: string[];
  };
  download_url: string;
  job_id: string;
  pdf_filename: string;
  timestamp: string;
}

export default function GeneratePage() {
  const { profiles, history, addHistory } = useProfileStore();
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
    null
  );
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfileId || !jobDescription) {
      toast.error("Please select a profile and enter a job description.");
      return;
    }

    const selectedProfile = profiles.find((p) => p.id === selectedProfileId);
    if (!selectedProfile) {
      toast.error("Selected profile not found.");
      return;
    }

    setLoading(true);
    setResult(null);
    setCurrentStep(1);

    try {
      setTimeout(() => setCurrentStep(2), 2000);
      setTimeout(() => setCurrentStep(3), 4000);
      setTimeout(() => setCurrentStep(4), 6000);

      const data = await generateResume(selectedProfile, jobDescription);
      setResult(data);
      addHistory({ ...data, timestamp: new Date().toISOString() });
      toast.success("Resume generated successfully!");
      setCurrentStep(5);
    } catch {
      toast.error("Failed to generate resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Generate Resume</h1>
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="profile">Select Profile</Label>
                <Select onValueChange={setSelectedProfileId}>
                  <SelectTrigger id="profile">
                    <SelectValue placeholder="Select a profile" />
                  </SelectTrigger>
                  <SelectContent>
                    {profiles.map((profile) => (
                      <SelectItem key={profile.id} value={profile.id!}>
                        {profile.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="job-description">Job Description</Label>
                <Textarea
                  id="job-description"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  rows={10}
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Generating..." : "Generate Resume"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {(loading || result) && <Separator className="my-8" />}

        <div className="space-y-8">
          {loading && (
            <div className="flex justify-center items-center h-full my-16">
              <Stepper currentStep={currentStep} />
            </div>
          )}
          {result && (
            <>
              <AtsScore ats_score={result.ats_score} />
              <Card>
                <CardHeader>
                  <CardTitle>Download</CardTitle>
                </CardHeader>
                <CardContent>
                  <a
                    href={`http://127.0.0.1:8001${result.download_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button className="w-full">Download Resume</Button>
                  </a>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
      {history.length > 0 && (
        <div className="max-w-4xl mx-auto mt-16">
            <h2 className="text-2xl font-bold mb-4">Generation History</h2>
            <Card>
                <CardContent className="p-0">
                    <div className="divide-y">
                        {history.map((item) => {
                            if (!item || !item.job_id) return null;
                            return (
                            <div key={item.job_id} className="p-4 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{item.pdf_filename}</p>
                                    <p className="text-sm text-gray-500">
                                        Generated on {format(new Date(item.timestamp), "PPP p")}
                                    </p>
                                </div>
                                <a
                                    href={`http://127.0.0.1:8001${item.download_url}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button variant="outline">Download</Button>
                                </a>
                            </div>
                        )})}
                    </div>
                </CardContent>
            </Card>
        </div>
      )}
    </main>
  );
} 