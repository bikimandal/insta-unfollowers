"use client";

import { useCallback, useRef, useState } from "react";
import { readFileAsJSON, parseInstagramFile, buildAnalytics } from "@/lib/parseInstagram";
import { saveAnalytics } from "@/lib/storage";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UploadCloud, CheckCircle, AlertTriangle, FileJson, Users, User } from "lucide-react";

type UploadState = "idle" | "dragging" | "processing" | "success" | "error";

/** Classifies a file into "following", "followers", or null based on its name. */
function classifyFile(file: File): "following" | "followers" | null {
  const name = file.name.toLowerCase();
  // "follower" must come before "following" to avoid false match
  if (name.includes("follower") && !name.includes("following")) return "followers";
  if (name.includes("following") || name.includes("follow")) return "following";
  return null;
}

export default function FileUpload() {
  const router = useRouter();
  const [state, setState] = useState<UploadState>("idle");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState<{ step: string; pct: number } | null>(null);
  const mainInputRef = useRef<HTMLInputElement>(null);
  const followingInputRef = useRef<HTMLInputElement>(null);
  const followersInputRef = useRef<HTMLInputElement>(null);

  // Use refs for the "pending" files so callbacks always read the latest value
  // without being recreated on every render.
  const pendingFollowingRef = useRef<File | null>(null);
  const pendingFollowersRef = useRef<File | null>(null);

  // Mirror refs into state so the UI can react to them
  const [pendingFollowing, _setPendingFollowing] = useState<File | null>(null);
  const [pendingFollowers, _setPendingFollowers] = useState<File | null>(null);

  function setPendingFollowing(f: File | null) {
    pendingFollowingRef.current = f;
    _setPendingFollowing(f);
  }
  function setPendingFollowers(f: File | null) {
    pendingFollowersRef.current = f;
    _setPendingFollowers(f);
  }

  async function processFiles(followingFile: File | null, followersFile: File | null) {
    if (!followingFile && !followersFile) {
      setError("Please upload at least one file (followers.json or following.json).");
      setState("error");
      return;
    }

    setState("processing");
    setError("");

    try {
      setProgress({ step: "Reading files…", pct: 10 });
      await new Promise((r) => setTimeout(r, 200));

      let followingUsers: ReturnType<typeof parseInstagramFile> = [];
      let followerUsers: ReturnType<typeof parseInstagramFile> = [];

      if (followingFile) {
        setProgress({ step: "Parsing following.json…", pct: 30 });
        const raw = await readFileAsJSON(followingFile);
        followingUsers = parseInstagramFile(raw);
      }

      if (followersFile) {
        setProgress({ step: "Parsing followers.json…", pct: 55 });
        const raw = await readFileAsJSON(followersFile);
        followerUsers = parseInstagramFile(raw);
      }

      setProgress({ step: "Building analytics…", pct: 80 });
      await new Promise((r) => setTimeout(r, 200));

      const analytics = buildAnalytics(followingUsers, followerUsers);
      saveAnalytics(analytics);

      setProgress({ step: "Done!", pct: 100 });
      await new Promise((r) => setTimeout(r, 400));

      setState("success");
      setTimeout(() => router.push("/analytics"), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error processing files.");
      setState("error");
      setProgress(null);
    }
  }

  /** Merges a list of dropped/selected files into the current pending state. */
  function mergeFiles(files: File[]): { following: File | null; followers: File | null } {
    let newFollowing = pendingFollowingRef.current;
    let newFollowers = pendingFollowersRef.current;

    for (const f of files) {
      const type = classifyFile(f);
      if (type === "following") newFollowing = f;
      else if (type === "followers") newFollowers = f;
      else {
        // Unrecognised name — fill whichever slot is empty
        if (!newFollowing) newFollowing = f;
        else if (!newFollowers) newFollowers = f;
      }
    }
    return { following: newFollowing, followers: newFollowers };
  }

  const onDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setState("idle");
    const files = Array.from(e.dataTransfer.files).filter((f) => f.name.endsWith(".json"));
    if (!files.length) {
      setError("Please drop JSON files only.");
      setState("error");
      return;
    }

    const { following, followers } = mergeFiles(files);
    setPendingFollowing(following);
    setPendingFollowers(followers);

    if (following && followers) {
      await processFiles(following, followers);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onMainFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).filter((f) => f.name.endsWith(".json"));
    e.target.value = ""; // Reset so the same files can be re-selected
    if (!files.length) return;

    const { following, followers } = mergeFiles(files);
    setPendingFollowing(following);
    setPendingFollowers(followers);

    if (following && followers) {
      await processFiles(following, followers);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "following" | "followers") => {
    const file = e.target.files?.[0] ?? null;
    e.target.value = "";
    if (!file) return;
    if (type === "following") setPendingFollowing(file);
    else setPendingFollowers(file);
  };

  async function handleAnalyze() {
    await processFiles(pendingFollowingRef.current, pendingFollowersRef.current);
  }

  const isDragging = state === "dragging";
  const fileCount = [pendingFollowing, pendingFollowers].filter(Boolean).length;

  return (
    <div className="mx-auto w-full max-w-[680px]">
      {/* Drop zone */}
      <div
        className={`upload-zone animate-fade-up relative cursor-pointer rounded-[20px] border-2 border-dashed px-8 py-[60px] text-center transition-all duration-300 ${
          isDragging 
            ? "border-accent-primary bg-gradient-to-br from-accent-primary/10 to-highlight/10 scale-102" 
            : "border-border-glass bg-bg-surface backdrop-blur-md [animation:borderCycle_4s_linear_infinite,pulseUpload_4s_infinite_ease-in-out] hover:scale-102 hover:border-accent-primary hover:bg-gradient-to-br hover:from-accent-primary/10 hover:to-highlight/10 hover:[animation:none]"
        }`}
        onDragEnter={(e) => { e.preventDefault(); setState("dragging"); }}
        onDragOver={(e) => { e.preventDefault(); setState("dragging"); }}
        onDragLeave={(e) => { e.preventDefault(); setState("idle"); }}
        onDrop={onDrop}
        onClick={() => { if (state !== "processing") mainInputRef.current?.click(); }}
        role="button"
        aria-label="File upload area"
      >
        {state === "processing" ? (
          <div className="flex flex-col items-center gap-6">
            <div className="h-[72px] w-[72px] animate-spin rounded-full border-4 border-accent-primary/20 border-t-accent-primary" />
            <div>
              <div className="mb-3 text-lg font-semibold text-text-primary">
                {progress?.step}
              </div>
              <div className="mx-auto h-2 w-[300px] overflow-hidden rounded-full bg-bg-slate shadow-[inset_0_1px_3px_rgba(0,0,0,0.2)]">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-accent-primary to-highlight shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-[width] duration-400 ease-out" 
                  style={{ width: `${progress?.pct ?? 0}%` }}
                />
              </div>
            </div>
          </div>
        ) : state === "success" ? (
          <div className="flex flex-col items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-success to-emerald-400 text-white shadow-[0_10px_25px_rgba(16,185,129,0.4)]">
              <CheckCircle size={40} />
            </div>
            <div>
              <div className="mb-1.5 text-2xl font-extrabold text-white">Upload Successful!</div>
              <div className="text-base text-text-secondary">Redirecting to your dashboard...</div>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-5 text-[56px] leading-none drop-shadow-[0_10px_15px_rgba(0,0,0,0.2)] flex justify-center">
              <UploadCloud size={64} className="text-accent-primary" />
            </div>
            <div className="mb-3 text-2xl font-bold text-text-primary">
              {isDragging ? "Drop files to analyze" : "Drag your Instagram export JSON files here"}
            </div>
            <div className="mb-8 text-base text-text-secondary">
              or click to browse your files
            </div>
            <div className="flex justify-center gap-3 text-sm text-text-secondary">
              {["followers.json", "following.json"].map((name) => (
                <span key={name} className="rounded-lg border border-white/10 bg-white/5 px-4 py-1.5">
                  {name}
                </span>
              ))}
            </div>
          </>
        )}
        <input type="file" accept=".json" multiple ref={mainInputRef} onChange={onMainFileSelect} className="hidden" />
      </div>

      {/* Manual file selectors */}
      {state !== "processing" && state !== "success" && (
        <div className="animate-fade-up mt-6 grid grid-cols-2 gap-4 [animation-delay:100ms]">
          {([
            { ref: followingInputRef, type: "following" as const, label: "following.json", icon: <User size={28} />, desc: "People you follow", file: pendingFollowing },
            { ref: followersInputRef, type: "followers" as const, label: "followers.json", icon: <Users size={28} />, desc: "Your followers", file: pendingFollowers },
          ]).map(({ ref, type, label, icon, desc, file }) => (
            <div key={type}>
              <input ref={ref} type="file" accept=".json" className="hidden" onChange={(e) => onFileChange(e, type)} id={`file-${type}`} />
              <label
                htmlFor={`file-${type}`}
                className={`flex cursor-pointer flex-col items-center gap-2.5 rounded-2xl border px-4 py-6 text-center backdrop-blur-md transition-all duration-300 ${
                  file 
                    ? "border-accent-primary bg-accent-primary/10" 
                    : "card border-border-glass bg-bg-surface"
                }`}
              >
                <div className={`mb-2 flex justify-center ${file ? "text-success drop-shadow-[0_0_8px_var(--color-accent-primary)]" : "text-text-secondary"}`}>
                  {file ? <FileJson size={32} /> : icon}
                </div>
                <div className="text-center">
                  <div className="text-[15px] font-semibold text-text-primary">
                    {file ? file.name : label}
                  </div>
                  <div className="mt-1 text-[13px] text-text-secondary">
                    {file ? "Click to change" : desc}
                  </div>
                </div>
              </label>
            </div>
          ))}
        </div>
      )}

      {/* Error message */}
      {state === "error" && (
        <div className="animate-fade-up mt-5 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/15 px-5 py-4 text-[15px] text-red-300 backdrop-blur-md">
          <AlertTriangle size={24} />
          <span>{error}</span>
        </div>
      )}

      {/* Analyze button */}
      {(pendingFollowing || pendingFollowers) && state !== "processing" && state !== "success" && (
        <div className="animate-fade-up mt-7 text-center">
          <button onClick={handleAnalyze} className="btn-primary rounded-xl px-12 py-4 text-lg" id="analyze-button">
            Analyze Data →
          </button>
          <div className="mt-3 text-sm text-text-secondary">
            {fileCount} file{fileCount !== 1 ? "s" : ""} ready for processing
          </div>
        </div>
      )}

      {/* How to export guide */}
      {state === "idle" && !pendingFollowing && !pendingFollowers && (
        <div className="card animate-fade-up mt-10 p-8 [animation-delay:200ms]">
          <div className="mb-4 text-sm font-bold uppercase tracking-[0.08em] text-text-secondary">
            How to get your data
          </div>
          <div className="grid gap-4">
            {[
              <><a href="https://accountscenter.instagram.com/info_and_permissions/dyi/?theme=dark" target="_blank" rel="noopener noreferrer" className="font-semibold text-highlight no-underline">Open the Download Your Information</a> page in the Instagram Accounts Center</>,
              'Select "Followers and following" and choose JSON format',
              "Request download and wait for the email from Instagram",
              'Unzip and upload the "followers.json" and "following.json" files here',
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent-primary/20 bg-gradient-to-br from-accent-primary/15 to-highlight/15 text-sm font-bold text-accent-primary">
                  {i + 1}
                </div>
                <span className="text-[15px] leading-relaxed text-text-primary">{step}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/guide" className="btn-primary inline-block rounded-xl px-6 py-2.5 text-[15px]">
              View Detailed Guide with Images →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
