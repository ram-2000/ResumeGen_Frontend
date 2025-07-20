"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface AtsScoreData {
  score: number;
  summary: string;
  matched: string[];
  missing: string[];
}

interface AtsScoreProps {
  ats_score?: AtsScoreData;
}

export default function AtsScore({ ats_score }: AtsScoreProps) {
  if (!ats_score) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>ATS Score</CardTitle>
        </CardHeader>
        <CardContent>
          <p>ATS score data is not available.</p>
        </CardContent>
      </Card>
    );
  }

  const { score, summary, matched, missing } = ats_score;
  return (
    <Card>
      <CardHeader>
        <CardTitle>ATS Score</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Progress value={score} className="w-full" />
          <span className="text-2xl font-bold">{score}%</span>
        </div>
        <div>
          <h3 className="font-semibold">Summary</h3>
          <p>{summary}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-green-600">Matched Keywords</h3>
            <ul className="list-disc list-inside">
              {(matched || []).map((keyword, index) => (
                <li key={index}>{keyword}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-red-600">Missing Keywords</h3>
            <ul className="list-disc list-inside">
              {(missing || []).map((keyword, index) => (
                <li key={index}>{keyword}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 