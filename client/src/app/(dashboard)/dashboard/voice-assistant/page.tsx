"use client";

import React, { useState, useEffect } from "react";
import { script } from "@/lib/fonts";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  Play,
  RotateCw,
  Droplet,
  CloudRain,
  Sprout,
  Sun,
  CheckCircle2,
  HelpCircle,
  Radio,
} from "lucide-react";
import { TransparentNavSlot } from "../../header-context";
import { useLanguage } from "@/lib/language-context";
import DeviceConnectGate from "@/Components/modules/Device/DeviceConnectGate";


interface VoiceLog {
  id: string;
  sender: "user" | "ai";
  text: string;
  lang: "BN" | "EN";
  timestamp: string;
  recommendationTag?: string;
}

const sampleSpokenPrompts = [
  {
    lang: "BN",
    text: "আজকে আমন ধানের মাঠে সেচ দেওয়া লাগবে কি?",
    translation: "Do I need to irrigate the Aman rice field today?",
  },
  {
    lang: "BN",
    text: "আগামী সপ্তাহে রাজশাহীতে কেমন বৃষ্টিপাত হবে?",
    translation: "What is the rainfall forecast in Rajshahi next week?",
  },
  {
    lang: "EN",
    text: "Why is July 15-25 the recommended planting window?",
    translation: "১৫–২৫ জুলাই কেন রোপণের জন্য সেরা সময়?",
  },
  {
    lang: "BN",
    text: "কম পানিতে কোন ফসল ভালো ফলন দেবে?",
    translation: "Which crop yields best with less water?",
  },
];

function VoiceAssistantContent() {
  const { lang, setLang } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceLogs, setVoiceLogs] = useState<VoiceLog[]>([
    {
      id: "1",
      sender: "ai",
      text:
        lang === "BN"
          ? "নমস্কার! আমি ক্রপওয়াইজ ভয়েস অ্যাসিস্ট্যান্ট। আপনার খামারের আবহাওয়া, সেচ বা ফসল রোপণ নিয়ে যে কোনো প্রশ্ন বাংলায় বা ইংরেজিতে সরাসরি মুখে বলুন।"
          : "Hello! I am CropWise Voice Assistant. Ask any question about your farm's weather, irrigation, or planting schedule using your voice in English or Bengali.",
      lang: lang === "BN" ? "BN" : "EN",
      timestamp: "Just now",
      recommendationTag: "Voice AI Active",
    },
  ]);

  // Text to speech playback
  const speakText = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "BN" ? "bn-BD" : "en-US";
    utterance.rate = 0.95;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleStartListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);
    setTranscript(lang === "BN" ? "শুনছি... আপনার প্রশ্ন বলুন..." : "Listening... Speak your question...");

    // Check for Web Speech API
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = lang === "BN" ? "bn-BD" : "en-US";
        recognition.interimResults = true;
        recognition.continuous = false;

        recognition.onresult = (event: any) => {
          const current = event.results[0][0].transcript;
          setTranscript(current);
        };

        recognition.onend = () => {
          setIsListening(false);
          if (transcript && transcript !== "Listening..." && !transcript.includes("শুনছি")) {
            processVoiceQuery(transcript);
          }
        };

        recognition.onerror = () => {
          setIsListening(false);
          // Fallback simulation
          simulateVoiceResponse(sampleSpokenPrompts[0].text);
        };

        recognition.start();
        return;
      } catch {
        // Fallback simulation below
      }
    }

    // Fallback simulation after 2.5 seconds if speech recognition not permitted
    setTimeout(() => {
      setIsListening(false);
      const chosenPrompt = lang === "BN" ? sampleSpokenPrompts[0].text : sampleSpokenPrompts[2].text;
      simulateVoiceResponse(chosenPrompt);
    }, 2500);
  };

  const simulateVoiceResponse = (query: string) => {
    processVoiceQuery(query);
  };

  const processVoiceQuery = (query: string) => {
    const userMsg: VoiceLog = {
      id: Date.now().toString(),
      sender: "user",
      text: query,
      lang: lang === "BN" ? "BN" : "EN",
      timestamp: "Just now",
    };

    let aiAnswer = "";
    if (query.includes("সেচ") || query.includes("water") || query.includes("irrigate")) {
      aiAnswer =
        lang === "BN"
          ? "আজকে সেচ দেওয়ার প্রয়োজন নেই। নাসার SMAP স্যাটেলাইট ও আপনার মাটির সেন্সর অনুযায়ী বর্তমান রুট-জোন আর্দ্রতা ৩২.৪%, যা আমন ধানের বৃদ্ধির জন্য পর্যাপ্ত। আগামী ৪৮ ঘণ্টায় হালকা বৃষ্টির সম্ভাবনাও রয়েছে।"
          : "No irrigation needed today. NASA SMAP observations and field sensor probe A1 indicate 32.4% root-zone moisture, which is well above the stress threshold. Light rain is also expected within 48 hours.";
    } else if (query.includes("বৃষ্টি") || query.includes("forecast") || query.includes("rain")) {
      aiAnswer =
        lang === "BN"
          ? "নাসার GPM আবহাওয়া মডেল অনুযায়ী রাজশাহীতে আগামী ৩ দিনে প্রায় ১৮ থেকে ২২ মিমি বৃষ্টিপাত হতে পারে। ১৫ থেকে ১৮ জুলাইয়ের মধ্যে স্বাভাবিক বৃষ্টিপাত শুরু হওয়ার সম্ভাবনা রয়েছে।"
          : "According to NASA GPM precipitation estimates, Rajshahi is projected to receive 18–22mm of rainfall over the next 3 days, maintaining optimal conditions for field preparation.";
    } else {
      aiAnswer =
        lang === "BN"
          ? "১৫–২৫ জুলাইয়ের মধ্যে রোপণ করলে সাম্প্রতিক জলবায়ু পরিবর্তন ও বৃষ্টিপাতের দেরির সাথে সবচেয়ে ভালো সামঞ্জস্য বজায় থাকে। এটি পানির ঘাটতি কমায় ও ফলন বাড়ায়।"
          : "Planting between 15–25 July aligns best with the 11-day delay in seasonal rainfall detected in NASA 25-year climate trends, optimizing soil moisture and yield.";
    }

    const aiMsg: VoiceLog = {
      id: (Date.now() + 1).toString(),
      sender: "ai",
      text: aiAnswer,
      lang: lang === "BN" ? "BN" : "EN",
      timestamp: "Just now",
      recommendationTag: "NASA Earth Data Insight",
    };

    setVoiceLogs((prev) => [...prev, userMsg, aiMsg]);
    setTranscript("");

    // Read answer aloud automatically
    setTimeout(() => {
      speakText(aiAnswer);
    }, 300);
  };

  return (
    <div className="pb-24 sm:pb-12">
      <TransparentNavSlot />

      {/* ================= HERO ================= */}
      <section className="relative min-h-[300px] overflow-hidden bg-[#fbfcfa] sm:min-h-[320px]">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-[center_55%]"
            style={{
              backgroundImage:
                "url('https://i.ibb.co.com/PG31PycM/Chat-GPT-Image-Sep-24-2026-05-42-01-PM.png')",
            }}
          />
          <div className="absolute inset-y-0 left-0 hidden w-[45%] bg-gradient-to-r from-[#fbfcfa]/100 to-transparent sm:block" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/15 to-black/55 sm:hidden" />
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 hidden h-[35%] bg-gradient-to-t from-[#f5f7f5]/90 to-transparent sm:block" />
        </div>

        <div className="relative px-6 pb-20 pt-24 sm:px-10 sm:pb-24 sm:pt-24">
          <div className="max-w-lg">
            <p className="mb-2 flex items-center gap-2 text-[11px] font-semibold tracking-wider text-primary-700 uppercase sm:text-primary-800">
              <Sparkles className="h-3.5 w-3.5" />
              {lang === "BN" ? "এআই স্পিচ ইন্টারঅ্যাকশন" : "Hands-Free Voice AI"}
            </p>

            <h1 className="text-3xl font-bold leading-tight text-white drop-shadow sm:text-4xl sm:font-semibold sm:text-slate-900 sm:drop-shadow-none">
              {lang === "BN" ? "ক্রপওয়াইজ ভয়েস অ্যাসিস্ট্যান্ট" : "CropWise Voice Assistant"}
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-white/90 drop-shadow sm:text-slate-600 sm:drop-shadow-none">
              {lang === "BN"
                ? "মাঠে কাজ করার সময় মুখে বাংলায় বা ইংরেজিতে প্রশ্ন করুন। নাসা উপাত্তের ভিত্তিতে সাথে সাথে অডিও উত্তর শুনুন।"
                : "Ask questions naturally using your voice in Bengali or English. Hear immediate, spoken advice grounded in NASA Earth observations."}
            </p>
          </div>

          <p
            className={`${script.className} absolute right-6 top-20 hidden -rotate-2 text-2xl leading-6 text-white drop-shadow sm:right-10 sm:block sm:top-24`}
          >
            Your Field Companion
            <br />
            Just Speak.
          </p>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 -mt-8 space-y-6 px-4 sm:-mt-10 sm:px-6">
        {/* Interactive Voice Mic Section */}
        <div className="rounded-3xl border border-primary-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col items-center text-center">
            {/* Animated Mic Button */}
            <div className="relative flex items-center justify-center">
              {isListening && (
                <>
                  <span className="absolute h-32 w-32 animate-ping rounded-full bg-primary-400 opacity-20" />
                  <span className="absolute h-24 w-24 animate-pulse rounded-full bg-primary-300 opacity-35" />
                </>
              )}

              <button
                type="button"
                onClick={handleStartListening}
                className={`relative flex h-20 w-20 items-center justify-center rounded-full text-white shadow-xl transition-all duration-300 ${
                  isListening
                    ? "scale-105 bg-rose-600 shadow-rose-900/30"
                    : "bg-primary-800 hover:scale-105 hover:bg-primary-900 shadow-primary-900/25"
                }`}
                aria-label={isListening ? "Stop listening" : "Tap to speak"}
              >
                {isListening ? (
                  <MicOff className="h-8 w-8 animate-bounce" />
                ) : (
                  <Mic className="h-8 w-8" />
                )}
              </button>
            </div>

            <p className="mt-4 text-base font-semibold text-slate-800">
              {isListening
                ? lang === "BN"
                  ? "আপনার প্রশ্ন শুনছি... কথা বলুন..."
                  : "Listening to your voice..."
                : lang === "BN"
                ? "কথা বলতে মাইক বাটনে ট্যাপ করুন"
                : "Tap to Speak with CropWise AI"}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {lang === "BN"
                ? "বাংলা অথবা ইংরেজিতে যে কোনো প্রশ্ন করুন"
                : "Supports spoken Bengali (বাংলা) and English naturally"}
            </p>

            {transcript && (
              <div className="mt-4 rounded-xl border border-primary-200 bg-primary-50/60 px-4 py-2.5 text-sm font-medium text-primary-900">
                "{transcript}"
              </div>
            )}
          </div>
        </div>

        {/* Suggested Voice Prompts */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {lang === "BN" ? "যে বিষয়গুলো মুখে জিজ্ঞেস করতে পারেন" : "Quick Spoken Voice Queries"}
          </h3>

          <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {sampleSpokenPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => simulateVoiceResponse(p.text)}
                className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-left transition hover:border-primary-300 hover:bg-white"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-700">
                  <Volume2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-800">"{p.text}"</p>
                  <p className="text-[10px] text-slate-400">{p.translation}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Spoken Conversation Logs */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-900">
            {lang === "BN" ? "ভয়েস কথোপকথন ইতিহাস" : "Voice Conversation Feed"}
          </h3>

          <div className="space-y-3">
            {voiceLogs.map((log) => (
              <div
                key={log.id}
                className={`rounded-2xl p-4 shadow-sm transition ${
                  log.sender === "user"
                    ? "ml-auto max-w-xl border border-primary-200 bg-primary-800 text-white"
                    : "border border-slate-100 bg-white text-slate-800"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                        log.sender === "user"
                          ? "bg-white text-primary-800"
                          : "bg-primary-100 text-primary-700"
                      }`}
                    >
                      {log.sender === "user" ? "You" : <Bot className="h-4 w-4" />}
                    </span>
                    <span className="text-xs font-medium">
                      {log.sender === "user" ? "Spoken Voice Command" : "CropWise Voice AI"}
                    </span>
                  </div>

                  {log.sender === "ai" && (
                    <button
                      type="button"
                      onClick={() => speakText(log.text)}
                      className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600 transition hover:bg-slate-100"
                    >
                      <Volume2 className="h-3.5 w-3.5 text-primary-700" />
                      <span>{isSpeaking ? "Speaking..." : "Read Aloud"}</span>
                    </button>
                  )}
                </div>

                <p className={`mt-2 text-sm leading-relaxed ${log.sender === "user" ? "text-white" : "text-slate-700"}`}>
                  {log.text}
                </p>

                {log.recommendationTag && (
                  <div className="mt-2.5 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-0.5 text-[10px] font-semibold text-primary-700">
                      <Sparkles className="h-3 w-3" />
                      {log.recommendationTag}
                    </span>
                    <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VoiceAssistantPage() {
  return (
    <DeviceConnectGate
      pageTitle="Voice Assistant & Hands-Free Commands"
      pageSubtitle="Connect your ESP32 device to use voice commands to toggle irrigation motors and query field sensors."
    >
      <VoiceAssistantContent />
    </DeviceConnectGate>
  );
}
