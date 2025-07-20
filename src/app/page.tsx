import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, FileText, BarChart } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-primary-foreground">
                  AI-Powered Resume Generator
                </h1>
                <p className="mx-auto max-w-[700px] text-primary-foreground/80 md:text-xl">
                  Create a professional, ATS-friendly resume in minutes. Our AI analyzes your profile and crafts a resume tailored to your dream job.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/generate">
                  <Button size="lg">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Why Choose ResumeGen?</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform is designed to help you land your next job with a resume that stands out.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="grid gap-1 text-center">
                <Bot className="h-12 w-12 mx-auto" />
                <h3 className="text-lg font-bold">AI-Powered Content</h3>
                <p className="text-sm text-muted-foreground">
                  Leverage the power of AI to generate compelling resume content that highlights your skills and experience.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <FileText className="h-12 w-12 mx-auto" />
                <h3 className="text-lg font-bold">Multiple Profiles</h3>
                <p className="text-sm text-muted-foreground">
                  Create and manage multiple profiles to tailor your resume for different job applications.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <BarChart className="h-12 w-12 mx-auto" />
                <h3 className="text-lg font-bold">ATS-Friendly</h3>
                <p className="text-sm text-muted-foreground">
                  Our resumes are optimized for Applicant Tracking Systems, ensuring your application gets seen by recruiters.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
