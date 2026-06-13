import { ArrowLeft, ExternalLink, Download, Smartphone, Settings, Calendar, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import type { ReactNode } from "react";

interface Step {
  icon: ReactNode;
  title: string;
  description: ReactNode;
  images?: string[];
}

const steps: Step[] = [
  {
    icon: <ExternalLink size={24} />,
    title: "Open Accounts Center",
    description: (
      <>
        Go to the{" "}
        <a
          href="https://accountscenter.instagram.com/info_and_permissions/dyi/?theme=dark"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-highlight underline"
        >
          Download Your Information
        </a>{" "}
        page in the Instagram Accounts Center.
      </>
    ),
  },
  {
    icon: <Download size={24} />,
    title: "Create Export",
    description: (
      <>
        Click the blue <strong className="text-accent-primary">&apos;Create export&apos;</strong> button.
        Then select the Instagram account you want to analyze.
      </>
    ),
    images: ["/guide/img1.png"],
  },
  {
    icon: <Smartphone size={24} />,
    title: "Export to Device",
    description: (
      <>
        When asked where to export, choose the{" "}
        <strong className="text-accent-primary">&apos;Export to device&apos;</strong> option.
      </>
    ),
    images: ["/guide/img2.png"],
  },
  {
    icon: <Settings size={24} />,
    title: "Customize Information",
    description: (
      <>
        Choose <strong className="text-text-primary">&apos;Customize information&apos;</strong> instead
        of all available data. Under the Connections section, check ONLY the{" "}
        <strong className="text-highlight">&apos;Followers and following&apos;</strong> option.
      </>
    ),
    images: ["/guide/img3.png", "/guide/img4.png"],
  },
  {
    icon: <Calendar size={24} />,
    title: "Format & Date Range",
    description: (
      <>
        Set the Date Range to <strong className="text-highlight">&apos;All time&apos;</strong> and the
        Format to <strong className="text-highlight">&apos;JSON&apos;</strong>. Media quality does not
        matter.
      </>
    ),
    images: ["/guide/img5.png"],
  },
  {
    icon: <CheckCircle2 size={24} />,
    title: "Download & Upload",
    description: (
      <>
        Submit your request. Instagram will email you a link when your file is ready.{" "}
        <strong className="text-text-primary">
          Download it, unzip it, and drop the files onto our home page!
        </strong>
      </>
    ),
  },
];

export default function GuidePage() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-bg-dark">
      <Header />
      <main className="flex-1 px-6 py-10">
        <div className="mx-auto w-full max-w-[800px]">
          <Link
            href="/"
            className="hover-link mb-8 inline-flex items-center gap-2 font-medium text-inherit"
          >
            <ArrowLeft size={20} /> Back to Home
          </Link>

          <h1 className="mb-4 text-[clamp(32px,5vw,48px)] font-extrabold tracking-[-0.03em]">
            How to get your <span className="gradient-text">Instagram Data</span>
          </h1>
          <p className="mb-12 text-lg leading-relaxed text-text-secondary">
            Follow these exact steps to export your followers and following data in the correct JSON format.
          </p>

          <div className="flex flex-col gap-6">
            {steps.map((step, i) => (
              <div
                key={i}
                className="card animate-fade-up flex flex-col sm:flex-row items-start gap-4 sm:gap-6 p-6 sm:p-8"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl border border-white/5 bg-gradient-to-br from-accent-primary/10 to-highlight/10 text-accent-primary">
                  {step.icon}
                </div>
                <div className="min-w-0 flex-1 w-full">
                  <div className="mb-2 text-[13px] font-bold uppercase tracking-[0.05em] text-highlight">
                    Step {i + 1}
                  </div>
                  <h2 className="mb-3 text-[20px] sm:text-[22px] font-bold text-text-primary">
                    {step.title}
                  </h2>
                  <div className="text-[15px] sm:text-[17px] font-normal leading-relaxed text-white/90">
                    {step.description}
                  </div>

                  {step.images && step.images.length > 0 && (
                    <div className="mt-6 flex flex-col gap-4">
                      {step.images.map((img, imgIdx) => (
                        <Image
                          key={imgIdx}
                          src={img}
                          alt={`Step ${i + 1} screenshot ${imgIdx + 1}`}
                          width={800}
                          height={450}
                          className="w-full h-auto rounded-xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="animate-fade-up mt-12 text-center [animation-delay:600ms]">
            <Link href="/" className="btn-primary inline-block rounded-xl px-10 py-4 text-lg">
              I have my files ready →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
