"use client";

import { cn } from "@/lib/utils";

const steps = [
  { id: "01", name: "Profile Sent", status: "complete" },
  { id: "02", name: "Cooking Resume", status: "current" },
  { id: "03", name: "Formatting PDF", status: "upcoming" },
  { id: "04", name: "Analyzing ATS Score", status: "upcoming" },
  { id: "05", name: "Done!", status: "upcoming" },
];

export default function Stepper({ currentStep }: { currentStep: number }) {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => {
            const status =
            currentStep > stepIdx
              ? "complete"
              : currentStep === stepIdx
              ? "current"
              : "upcoming";
          return (
          <li key={step.name} className={cn("relative", stepIdx !== steps.length - 1 ? "pr-8 sm:pr-20" : "")}>
            {status === 'complete' ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-indigo-600" />
                </div>
                <a
                  href="#"
                  className="relative flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-900"
                >
                  <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" />
                  </svg>
                  <span className="absolute top-full mt-2 w-28 text-center text-sm font-medium text-gray-900 left-1/2 -translate-x-1/2">{step.name}</span>
                </a>
              </>
            ) : status === 'current' ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <a
                  href="#"
                  className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-indigo-600 bg-white"
                  aria-current="step"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" aria-hidden="true" />
                  <span className="absolute top-full mt-2 w-28 text-center text-sm font-medium text-gray-900 left-1/2 -translate-x-1/2">{step.name}</span>
                </a>
              </>
            ) : (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <a
                  href="#"
                  className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white hover:border-gray-400"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300"
                    aria-hidden="true"
                  />
                  <span className="absolute top-full mt-2 w-28 text-center text-sm font-medium text-gray-900 left-1/2 -translate-x-1/2">{step.name}</span>
                </a>
              </>
            )}
          </li>
        )})}
      </ol>
    </nav>
  );
} 