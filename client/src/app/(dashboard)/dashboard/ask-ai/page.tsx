"use client";

import React, { useState, useRef, useEffect } from "react";
import { script } from "@/lib/fonts";
import {
  Bot,
  Send,
  Paperclip,
  ChevronDown,
  RefreshCw,
  Pencil,
  MapPin,
  Leaf,
  Target,
  BookOpen,
  Droplet,
  CloudRain,
  RotateCw,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { TransparentNavSlot } from "../../header-context";
import { useAnalysis } from "@/lib/analysis-context";
import { useAuth } from "@/lib/auth-context";
import { sendCropWiseChatMessage } from "@/lib/apis/analyzeAi";
import UserAvatar from "@/Components/common/UserAvatar";


const suggestions = [
  "আমার ESP32 ডিভাইসের বর্তমান অবস্থা কী?",
  "আমার আগের Climate Analysis অনুযায়ী এখন কী করা উচিত?",
  "মাটির বর্তমান আর্দ্রতা ও তাপমাত্রা কত?",
  "কেন এই রোপণের সময় পরামর্শ দেওয়া হয়েছে?",
  "কম পানিতে কোন ফসল ভালো হবে?",
  "পাম্প ৫ মিনিটের জন্য চালাও",
];

const resources = [
  { label: "Aman Rice Farming Guide", icon: BookOpen, tone: "bg-primary-50 text-primary-600" },
  { label: "Water Saving Techniques", icon: Droplet, tone: "bg-rose-50 text-rose-500" },
  { label: "Understanding Rainfall Patterns", icon: CloudRain, tone: "bg-sky-50 text-sky-500" },
  { label: "Crop Rotation Basics", icon: RotateCw, tone: "bg-amber-50 text-amber-500" },
];

interface Message {
  from: "bot" | "user";
  text: string;
  time: string;
  showChartsCta?: boolean;
  sources?: Array<{
    type: string;
    title: string;
    timestamp?: string;
    details?: any;
  }>;
}

const initialMessages: Message[] = [
  {
    from: "bot",
    time: "Just now",
    text:
      "Hello! I'm CropWise AI 🌱\nI am your context-aware agricultural assistant powered by NASA Earth observations, your saved climate analyses, and connected ESP32 field sensors.\n\nYou can ask me questions in বাংলা, Banglish, or English:\n• আমার ডিভাইসের বর্তমান অবস্থা ও sensor reading কী?\n• আমার আগের Climate Analysis অনুযায়ী এখন কী করা উচিত?\n• পাম্প চালু বা বন্ধ করার নির্দেশ দাও।\n• বৃষ্টির onset পরিবর্তনের প্রভাব ব্যাখ্যা করো।",
  },
];

// "•" diye shuru hoa line gulo green dot bullet hishebe render hobe
const renderText = (text: string) =>
  text.split("\n").map((line, i) =>
    line.startsWith("•") ? (
      <div key={i} className="flex gap-2.5">
        <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary-600" />
        <span>{line.slice(1).trim()}</span>
      </div>
    ) : line ? (
      <p key={i}>{line}</p>
    ) : (
      <div key={i} className="h-2" />
    )
  );

export default function AskAiPage() {
  const router = useRouter();
  const { activeAnalysis } = useAnalysis();
  const { user } = useAuth();

  const [location] = useState(activeAnalysis?.location?.district || "Rajshahi");
  const [crop] = useState(activeAnalysis?.crop?.cropType === "aman_rice" ? "Aman Rice" : (activeAnalysis?.crop?.cropType || "Aman Rice"));
  const [priority] = useState("Save Water");

  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [lang, setLang] = useState<"BN" | "EN">("BN");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const timeNow = () =>
    new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const send = async (text: string) => {
    if (!text.trim() || isSending) return;
    const userMsg = text.trim();
    setInput("");

    setMessages((prev) => [
      ...prev,
      { from: "user", text: userMsg, time: timeNow() },
    ]);
    setIsSending(true);

    try {
      const res = await sendCropWiseChatMessage({
        conversationId: conversationId || undefined,
        message: userMsg,
        location: { district: location },
        crop,
        language: lang,
      });

      if (res && res.success && res.data) {
        if (res.data.conversationId) {
          setConversationId(res.data.conversationId);
        }

        const isClimateQuestion =
          userMsg.toLowerCase().includes("climate") ||
          userMsg.toLowerCase().includes("analysis") ||
          userMsg.toLowerCase().includes("বৃষ্টি") ||
          userMsg.toLowerCase().includes("রোপণ");

        setMessages((prev) => [
          ...prev,
          {
            from: "bot",
            time: timeNow(),
            text: res.data.message.content,
            sources: res.data.sources,
            showChartsCta: isClimateQuestion || (res.data.sources && res.data.sources.some((s) => s.type === "climate_analysis")),
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            from: "bot",
            time: timeNow(),
            text: "দুঃখিত, কোনো উত্তর পাওয়া যায়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।",
          },
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          time: timeNow(),
          text: `সংযোগ ত্রুটি: ${err?.message || "সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না।"}`,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  // Auto-send query passed from Home or other pages via ?q=...
  const initialQueryHandled = useRef(false);

  useEffect(() => {
    if (initialQueryHandled.current) return;
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get("q") || params.get("query") || params.get("message");
    if (initialQuery && initialQuery.trim()) {
      initialQueryHandled.current = true;
      window.history.replaceState({}, "", "/dashboard/ask-ai");
      send(initialQuery.trim());
    }
  }, []);

  return (
    <div className="pb-24 sm:pb-8">
      <TransparentNavSlot />

      {/* ================= HERO ================= */}
      <section className="relative min-h-[300px] overflow-hidden bg-[#fbfcfa] sm:min-h-[320px]">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-[center_60%]"
            style={{
              backgroundImage:
                "url('https://i.ibb.co.com/23cWFG8j/Chat-GPT-Image-Sep-24-2026-05-53-43-PM.png')",
            }}
          />
          {/* Desktop: left fade */}
          <div className="absolute inset-y-0 left-0 hidden w-[45%] bg-gradient-to-r from-[#fbfcfa]/100 to-transparent sm:block" />
          {/* Mobile: dark overlay jeno white text pora jay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/10 to-black/45 sm:hidden" />
          {/* Top fade for navbar */}
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/20 to-transparent" />
          {/* Desktop: bottom blend */}
          <div className="absolute inset-x-0 bottom-0 hidden h-[35%] bg-gradient-to-t from-[#f5f7f5]/90 to-transparent sm:block" />
          <div className="absolute bottom-0 right-0 hidden h-[30%] w-[20%] bg-gradient-to-tl from-[#f5f7f5]/90 to-transparent sm:block" />
        </div>

        <div className="relative px-6 pb-20 pt-24 sm:px-10 sm:pb-24 sm:pt-24">
          <div className="max-w-md">
            {/* Mobile only label */}
            <p className="mb-3 flex items-center gap-3 text-[11px] font-medium tracking-[0.3em] text-white/90 sm:hidden">
              AI ASSISTANT
              <span className="h-px w-6 bg-white/70" />
            </p>

            <h1 className="text-[32px] font-bold leading-tight text-white drop-shadow sm:text-4xl sm:font-semibold sm:text-slate-900 sm:drop-shadow-none">
              Ask CropWise AI
            </h1>

            {/* Mobile: short subtitle */}
            <p className="mt-2 max-w-[260px] text-lg leading-snug text-white drop-shadow sm:hidden">
              Your farming companion, always here.
            </p>

            {/* Desktop: full description */}
            <p className="mt-2 hidden text-sm leading-relaxed text-slate-600 sm:block">
              Get simple, practical answers to your farming questions using NASA data
              and our climate analysis. Ask in Bangla or English — anytime, anything.
            </p>
          </div>

          <p
            className={`${script.className} absolute right-6 top-20 hidden -rotate-2 text-2xl leading-6 text-white drop-shadow sm:right-10 sm:block sm:top-24`}
          >
            Your Farming
            <br />
            Companion, Always Here.
          </p>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 -mt-6 mb-5 space-y-6 px-4 sm:-mt-10 sm:mb-8 sm:px-6">
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
          {/* Chat panel */}
          <div className="flex h-[600px] sm:h-[650px] lg:h-[700px] flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
            <div className="flex-1 min-h-0 space-y-4 overflow-y-auto p-4 sm:p-5 [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-3 ${m.from === "user" ? "flex-row-reverse" : ""}`}>
                  <span
                    className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full sm:h-8 sm:w-8 ${
                      m.from === "bot" ? "bg-primary-100 text-primary-700" : "bg-primary-800 text-white"
                    }`}
                  >
                    {m.from === "bot" ? (
                      <>
                        <Leaf className="h-4 w-4 sm:hidden" />
                        <Bot className="hidden h-4 w-4 sm:block" />
                      </>
                    ) : (
                      <UserAvatar user={user} size="sm" />
                    )}

                  </span>

                  <div className={`flex min-w-0 max-w-[88%] flex-col sm:max-w-[80%] ${m.from === "user" ? "items-end" : "items-start"}`}>
                    <div
                      className={`space-y-0.5 rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        m.from === "bot"
                          ? "bg-primary-50/70 text-slate-700 sm:bg-slate-50"
                          : "bg-primary-800 text-white"
                      }`}
                    >
                      {renderText(m.text)}

                      {/* Source references */}
                      {m.sources && m.sources.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5 border-t border-slate-200/60 pt-2.5">
                          {m.sources.map((s, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-medium text-slate-600 shadow-2xs border border-slate-200/70"
                            >
                              <span className={`h-1.5 w-1.5 rounded-full ${s.type.includes("device") ? "bg-emerald-500" : "bg-primary-500"}`} />
                              {s.title}
                            </span>
                          ))}
                        </div>
                      )}

                      {m.showChartsCta && (
                        <button
                          onClick={() => router.push("/dashboard/why-this-result")}
                          className="mt-3 flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                        >
                          <BarChart3 className="h-3.5 w-3.5 text-primary-600" /> Show data and charts
                        </button>
                      )}
                    </div>
                    <span className="mt-1 px-1 text-[11px] text-slate-400">{m.time}</span>
                  </div>
                </div>
              ))}

              {isSending && (
                <div className="flex gap-3">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 sm:h-8 sm:w-8">
                    <Bot className="h-4 w-4" />
                  </span>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-primary-600" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-primary-600 [animation-delay:0.2s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-primary-600 [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <div className="shrink-0 border-t border-slate-100 bg-white px-3.5 py-3 sm:px-4 sm:py-3">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/70 px-2.5 py-1 transition-all focus-within:border-primary-600 focus-within:bg-white focus-within:ring-1 focus-within:ring-primary-600/20">
                <button
                  type="button"
                  className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-200/60 hover:text-slate-600"
                  aria-label="Attach file"
                >
                  <Paperclip className="h-4 w-4" />
                </button>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send(input)}
                  placeholder="Ask anything about your farm..."
                  className="min-w-0 flex-1 bg-transparent py-1 text-xs text-slate-700 placeholder-slate-400 outline-none sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setLang(lang === "BN" ? "EN" : "BN")}
                  className="flex shrink-0 items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-600 shadow-2xs transition hover:bg-slate-50"
                >
                  {lang} <ChevronDown className="h-3 w-3 text-slate-400" />
                </button>
                <button
                  type="button"
                  onClick={() => send(input)}
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-primary-800 text-white transition hover:bg-primary-900"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="pb-0.5 pt-1.5 text-center text-[10px] text-slate-400">
                CropWise AI may make mistakes. Please verify important decisions.
              </p>
            </div>
          </div>

          {/* Right rail: mobile e hidden */}
          <div className="hidden space-y-4 sm:block">
            <div className="rounded-2xl border border-slate-100 bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Bot className="h-4 w-4 text-primary-600" /> Suggested Questions
                </p>
                <RefreshCw className="h-3.5 w-3.5 text-slate-300" />
              </div>
              <div className="mt-3 space-y-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="flex w-full items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-left text-xs text-slate-600 hover:bg-slate-50"
                  >
                    {s}
                    <ChevronDown className="h-3.5 w-3.5 flex-shrink-0 -rotate-90 text-slate-300" />
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">Current Context</p>
                <button className="flex items-center gap-1 text-xs font-medium text-primary-700">
                  <Pencil className="h-3 w-3" /> Edit
                </button>
              </div>
              <div className="mt-3 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-500"><MapPin className="h-3.5 w-3.5" /> Location <span className="ml-auto font-medium text-slate-800">{location}</span></div>
                <div className="flex items-center gap-2 text-slate-500"><Leaf className="h-3.5 w-3.5" /> Crop <span className="ml-auto font-medium text-slate-800">{crop}</span></div>
                <div className="flex items-center gap-2 text-slate-500"><Target className="h-3.5 w-3.5" /> Priority <span className="ml-auto font-medium text-slate-800">{priority}</span></div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">Helpful Resources</p>
                <span className="flex items-center gap-1 text-xs font-medium text-primary-700">
                  View All <ArrowRight className="h-3 w-3" />
                </span>
              </div>
              <div className="mt-3 space-y-2.5">
                {resources.map((r) => (
                  <div key={r.label} className="flex items-center gap-2.5 text-xs text-slate-600">
                    <span className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md ${r.tone}`}>
                      <r.icon className="h-3.5 w-3.5" />
                    </span>
                    {r.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}