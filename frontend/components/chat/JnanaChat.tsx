"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  X,
  RotateCcw,
  Sparkles,
  BookOpen,
  HeartHandshake,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  PhoneCall,
  Flame,
  ArrowRight,
} from "lucide-react";

export interface VerseMetadata {
  chapter: number;
  verse: number;
  speaker: string;
  scene_title?: string;
  scene_story?: string;
  sanskrit: string;
  transliteration?: string;
  translation: string;
  similarity_score?: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "krishna" | "crisis";
  content: string;
  timestamp: Date;
  verses?: VerseMetadata[];
  isStreaming?: boolean;
  helplines?: Array<{ name: string; number: string }>;
}

interface JnanaChatProps {
  onClose?: () => void;
  isOverlay?: boolean;
  initialPrompt?: string;
}


const SACRED_PROMPT_PILLS = [
  {
    title: "Overcoming Fear & Anxiety",
    prompt: "How do I overcome overwhelming anxiety and fear of failure?",
    chapter: "Chapter 2 • Sankhya Yoga",
  },
  {
    title: "Moral Dilemmas & Duty",
    prompt: "I am torn between my moral duty and personal attachment to those I care about.",
    chapter: "Chapter 1 & 2 • Karma Yoga",
  },
  {
    title: "Inner Calm Amidst Chaos",
    prompt: "How can I stay calm and focused when the world around me is noisy and chaotic?",
    chapter: "Chapter 6 • Dhyana Yoga",
  },
  {
    title: "Letting Go of Outcomes",
    prompt: "What is the true secret of performing my duties without clinging to results?",
    chapter: "Chapter 3 • Sacred Action",
  },
];

/**
 * Word component with subtle golden radiance on hover, matching landing page.
 */
function SacredWord({ word }: { word: string }) {
  const clean = word.toLowerCase().replace(/[^a-z0-9]/g, "");
  const isAccent =
    clean === "krishna" ||
    clean === "arjuna" ||
    clean === "partha" ||
    clean === "vatsa" ||
    clean === "saumya" ||
    clean === "priya" ||
    clean === "sakhe" ||
    clean === "truth" ||
    clean === "dharma" ||
    clean === "karma" ||
    clean === "yoga" ||
    clean === "peace" ||
    clean === "soul";

  return (
    <span
      className={`inline-block transition-all duration-200 cursor-default select-text ${
        isAccent
          ? "text-[#9A6A15] font-semibold hover:text-[#7A4E0B]"
          : "hover:text-[#9A6A15] hover:-translate-y-0.5"
      }`}
      onMouseEnter={(e) => {
        e.currentTarget.style.textShadow = "0 0 12px rgba(212, 160, 52, 0.45)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.textShadow = "none";
      }}
    >
      {word}&nbsp;
    </span>
  );
}

/**
 * Formats paragraph text with word hover effects and basic italics/bold handling.
 */
function FormattedKrishnaMessage({ content }: { content: string }) {
  const paragraphs = content.split(/\n\s*\n/);

  return (
    <div className="space-y-3.5 text-[#2A2723] leading-relaxed text-[13.5px] sm:text-[15px] font-sans">
      {paragraphs.map((para, pIdx) => {
        const trimmed = para.trim();
        if (!trimmed) return null;

        // Check for blockquote or sloka formatting
        const isVerseQuote =
          trimmed.startsWith("*") && trimmed.endsWith("*") ||
          trimmed.startsWith('"') && trimmed.endsWith('"');

        if (isVerseQuote) {
          return (
            <div
              key={pIdx}
              className="my-2.5 py-2.5 px-3.5 bg-[#FAF6EE] border-l-2 border-[#D4A034] rounded-r-lg font-serif italic text-[#4A3B22] text-[13px] sm:text-[14.5px] leading-relaxed shadow-2xs"
            >
              {trimmed}
            </div>
          );
        }

        const words = trimmed.split(" ");
        return (
          <p key={pIdx} className="leading-relaxed">
            {words.map((w, wIdx) => (
              <SacredWord key={wIdx} word={w} />
            ))}
          </p>
        );
      })}
    </div>
  );
}

/**
 * Collapsible Authentic Sanskrit Scripture Card.
 */
function VerseScriptureCard({ verse, defaultOpen = false }: { verse: VerseMetadata; defaultOpen?: boolean }) {
  const [isExpanded, setIsExpanded] = useState(defaultOpen);

  return (
    <div className="mt-2.5 rounded-xl border border-[#E8DFCC] bg-gradient-to-b from-[#FDFBF7] to-[#F9F5EC] overflow-hidden shadow-xs transition-all duration-300">
      {/* Header Bar */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 flex items-center justify-between text-left hover:bg-[#F4EEE0]/60 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-[#9A6A15]/10 flex items-center justify-center text-[#9A6A15]">
            <BookOpen className="w-3 h-3" />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-serif text-[11px] sm:text-xs font-semibold tracking-[0.16em] uppercase text-[#7A4E0B]">
              BG {verse.chapter}.{verse.verse}
            </span>
            <span className="text-[#C4BAA7]">•</span>
            <span className="text-[10px] sm:text-[11.5px] font-sans text-[#7A7264] italic">
              {verse.speaker}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sacred Canonical Topic Badge */}
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#9A6A15]/10 text-[9.5px] font-serif text-[#7A4E0B] font-semibold border border-[#9A6A15]/20 uppercase tracking-[0.1em]">
            <span className="w-1 h-1 rounded-full bg-[#9A6A15]" />
            {verse.scene_title ? verse.scene_title.split(":")[0] : "Canonical Grounding"}
          </span>
          <span className="text-[9.5px] font-serif uppercase tracking-[0.1em] text-[#8C6B32] hidden sm:inline">
            {isExpanded ? "Hide" : "View Shloka"}
          </span>
          <span className="text-xs text-[#8C8477]">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </span>
        </div>
      </button>

      {/* Expandable Authentic Scripture Details */}
      {isExpanded && (
        <div className="px-3.5 pb-3.5 pt-1 space-y-2.5 border-t border-[#EFE7D7]">
          {/* Sanskrit Sloka in Noto Serif Devanagari */}
          <div className="p-3 bg-white/90 rounded-lg border border-[#E8E1D2] shadow-2xs text-center">
            <p className="font-sanskrit text-[14px] sm:text-[16px] text-[#4A3818] font-medium leading-loose tracking-wide">
              {verse.sanskrit}
            </p>
            {verse.transliteration && (
              <p className="font-serif italic text-[11px] sm:text-xs text-[#827663] mt-1 tracking-wide">
                {verse.transliteration}
              </p>
            )}
          </div>

          {/* Translation */}
          <div className="text-[11.5px] sm:text-[12.5px] font-sans text-[#5A5246] leading-relaxed italic bg-[#F7F3EB]/60 p-2.5 rounded-md border border-[#E9E2D4]">
            <span className="font-semibold not-italic text-[#7A4E0B]">Translation: </span>
            &ldquo;{verse.translation}&rdquo;
          </div>

          {/* Scene Narrative (Kurukshetra Battlefield Context) */}
          {verse.scene_story && (
            <p className="text-[10px] sm:text-[11px] font-sans text-[#7A7264] leading-normal">
              <span className="font-medium text-[#5A5246]">Battlefield Context: </span>
              {verse.scene_story}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

const MAX_DIALOGUES = 3;

function getSavedDialogueCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const val =
      localStorage.getItem("jnana_dialogue_count") ||
      sessionStorage.getItem("jnana_dialogue_count");
    return val ? parseInt(val, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

function saveDialogueCount(count: number) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("jnana_dialogue_count", count.toString());
  } catch {}
  try {
    sessionStorage.setItem("jnana_dialogue_count", count.toString());
  } catch {}
}

export default function JnanaChat({
  onClose,
  isOverlay = true,
  initialPrompt,
}: JnanaChatProps) {

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 3-Chance Dialogue Limit for Token Preservation
  const [dialogueCount, setDialogueCount] = useState<number>(() =>
    getSavedDialogueCount()
  );
  const [showLimitModal, setShowLimitModal] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const resetLimitForTesting = () => {
    try {
      localStorage.removeItem("jnana_dialogue_count");
      sessionStorage.removeItem("jnana_dialogue_count");
    } catch {}
    setDialogueCount(0);
    setShowLimitModal(false);
  };

  const dialoguesRemaining = Math.max(0, MAX_DIALOGUES - dialogueCount);
  const isLimitReached = dialoguesRemaining === 0;

  // Auto-scroll to bottom of conversation
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Adjust textarea height dynamically
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {

    setInputValue(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        140
      )}px`;
    }
  };

  const handleCopyMessage = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
    }
  };

  const resetDialogue = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setMessages([]);
    setIsLoading(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const sendMessage = useCallback(
    async (overrideText?: string) => {
      const currentCount = getSavedDialogueCount();
      if (currentCount >= MAX_DIALOGUES) {
        setShowLimitModal(true);
        return;
      }

      const textToSend = (overrideText || inputValue).trim();
      if (!textToSend || isLoading) return;

      // Increment dialogue count
      const nextCount = currentCount + 1;
      setDialogueCount(nextCount);
      saveDialogueCount(nextCount);

    setInputValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    const userMessageId = `user-${Date.now()}`;
    const krishnaMessageId = `krishna-${Date.now()}`;

    // Append seeker message
    const userMsg: ChatMessage = {
      id: userMessageId,
      role: "user",
      content: textToSend,
      timestamp: new Date(),
    };

    // Pre-create Krishna streaming message placeholder
    const krishnaMsg: ChatMessage = {
      id: krishnaMessageId,
      role: "krishna",
      content: "",
      timestamp: new Date(),
      verses: [],
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMsg, krishnaMsg]);
    setIsLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/v1/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: textToSend }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("ReadableStream not supported by browser!");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        let currentEvent = "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) {
            currentEvent = "";
            continue;
          }

          if (trimmed.startsWith("event:")) {
            currentEvent = trimmed.replace("event:", "").trim();
          } else if (trimmed.startsWith("data:")) {
            const dataStr = trimmed.replace("data:", "").trim();
            try {
              const data = JSON.parse(dataStr);

              if (currentEvent === "metadata" && data.retrieved_verses) {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === krishnaMessageId
                      ? { ...msg, verses: data.retrieved_verses }
                      : msg
                  )
                );
              } else if (currentEvent === "token" && data.text) {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === krishnaMessageId
                      ? { ...msg, content: msg.content + data.text }
                      : msg
                  )
                );
              } else if (currentEvent === "crisis") {
                // Urgent compassionate safety response
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === krishnaMessageId
                      ? {
                          ...msg,
                          role: "crisis",
                          content:
                            data.message ||
                            "Beloved soul, you are not alone in this pain. Please reach out to compassionate guides ready to listen to you right now.",
                          helplines: data.helplines || [
                            { name: "Tele-MANAS (India)", number: "14416" },
                            { name: "AASRA (24/7)", number: "91-9820466726" },
                            { name: "Crisis Lifeline", number: "988" },
                          ],
                          isStreaming: false,
                        }
                      : msg
                  )
                );
              } else if (currentEvent === "done") {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === krishnaMessageId
                      ? { ...msg, isStreaming: false }
                      : msg
                  )
                );
              } else if (currentEvent === "error") {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === krishnaMessageId
                      ? {
                          ...msg,
                          content:
                            msg.content ||
                            "A brief disturbance swept across the ether. Peace be with you, please speak once more.",
                          isStreaming: false,
                        }
                      : msg
                  )
                );
              }
            } catch {
              // Ignore partial JSON parse errors
            }
          }
        }
      }

      // Finalize streaming flag
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === krishnaMessageId ? { ...msg, isStreaming: false } : msg
        )
      );
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === krishnaMessageId
            ? {
                ...msg,
                content:
                  msg.content ||
                  "The sacred dialogue paused. Please ask again, noble seeker.",

                isStreaming: false,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [inputValue, isLoading]);

  const hasSentInitialPrompt = useRef(false);
  useEffect(() => {
    if (initialPrompt && !hasSentInitialPrompt.current) {
      hasSentInitialPrompt.current = true;
      const timer = setTimeout(() => {
        void sendMessage(initialPrompt);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [initialPrompt, sendMessage]);



  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      className={`flex flex-col w-full h-full max-w-full overflow-x-hidden bg-[#FFFFFF] ${
        isOverlay
          ? "fixed inset-0 z-50 animate-in fade-in zoom-in-[0.98] duration-300"
          : "relative min-h-screen"
      }`}
    >
      {/* Top Navigation Bar */}
      <header className="shrink-0 h-14 sm:h-18 px-2.5 sm:px-8 border-b border-[#EDE6D6] bg-white/95 backdrop-blur-md flex items-center justify-between z-20">

        {/* Left Branding: Clean jnana.ai matching landing page */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full overflow-hidden shadow-sm flex items-center justify-center bg-white border border-[#D4A034]/40 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="jnana.ai Sacred Flute and Peacock Feather Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="font-serif text-sm sm:text-lg tracking-[0.2em] sm:tracking-[0.3em] font-semibold uppercase text-[#1C1A17]">
              jnana<span className="text-[#9A6A15]">.ai</span>
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Subtle Sacred Dialogue Quota Indicator */}
          <button
            type="button"
            onClick={() => setShowLimitModal(true)}
            title="Session dialogues: 3 sacred inquiries granted per visitor to preserve AI tokens"
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full text-xs font-serif tracking-[0.06em] uppercase transition-all cursor-pointer ${
              isLimitReached
                ? "bg-[#FAF3E0] border border-[#D4A034] text-[#8C5D12] font-semibold hover:bg-[#F5E8C8]"
                : "bg-[#FAF7F0] border border-[#E8DECA] text-[#7A7264] hover:border-[#D4A034]/60"
            }`}
          >
            <div className="flex gap-0.5 sm:gap-1 items-center">
              {[0, 1, 2].map((idx) => (
                <span
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    idx < dialoguesRemaining
                      ? "bg-[#9A6A15] shadow-xs"
                      : "bg-[#D9D0BE]"
                  }`}
                />
              ))}
            </div>
            <span className="text-[9px] sm:text-[10px]">
              {dialoguesRemaining > 0 ? (
                <>
                  <span className="hidden sm:inline">Dialogues: </span>
                  {dialoguesRemaining}/3<span className="hidden sm:inline"> left</span>
                </>
              ) : (
                "Complete"
              )}
            </span>
          </button>

          {messages.length > 0 && (
            <button
              type="button"
              onClick={resetDialogue}
              title="Reset Dialogue"
              className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-full text-xs font-serif tracking-[0.1em] text-[#7A7264] hover:text-[#1C1A17] hover:bg-[#F5F0E4] border border-[#E2D9C8] transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline uppercase text-[10px]">New</span>
            </button>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-[#FAF7F0] hover:bg-[#F2ECE0] border border-[#D9D0BE] text-[#554D42] hover:text-[#1C1A17] transition-all cursor-pointer group"
              title="Return to Journey"
            >
              <span className="hidden sm:inline font-serif text-[10.5px] tracking-[0.16em] uppercase font-semibold text-[#7A4E0B]">
                Return
              </span>
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#7A4E0B] group-hover:rotate-90 transition-transform duration-300" />
            </button>
          )}
        </div>
      </header>

      {/* Main Dialogue Scrollable Body */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 sm:px-8 py-3.5 sm:py-6 max-w-4xl w-full mx-auto space-y-4 sm:space-y-6">
        {/* Welcome Empty State */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center max-w-xl mx-auto py-2 sm:py-6">
            <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-md border-2 border-[#D4A034] p-0.5 bg-white mb-2.5 sm:mb-4 animate-pulse-slow">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Sacred Jnana Logo"
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#FAF5E8] border border-[#E8DECA] shadow-2xs mb-1.5 sm:mb-2 max-w-full">
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#9A6A15] shrink-0" />
              <span className="font-serif text-[8.5px] sm:text-xs tracking-[0.12em] sm:tracking-[0.2em] uppercase font-semibold text-[#7A4E0B]">
                The Chariot of Kurukshetra Awaits
              </span>
            </div>

            <h2 className="font-serif text-base sm:text-2xl font-semibold text-[#1C1A17] tracking-[0.02em] mb-1 sm:mb-2 leading-tight px-2">
              Lay Down Your Burdens Before Krishna
            </h2>

            <p className="font-sans text-[11px] sm:text-sm text-[#5D5548] leading-relaxed max-w-sm sm:max-w-md mx-auto mb-3.5 sm:mb-6">
              Speak your unvoiced sorrow, moral doubts, or inner turmoil. Every word
              whispered here is held in stillness and answered purely through the timeless
              wisdom of the Bhagavad Gita.
            </p>

            {/* Quick Prompt Pills */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 text-left">
              {SACRED_PROMPT_PILLS.map((pill, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(pill.prompt)}
                  className="p-2.5 sm:p-3.5 rounded-xl border border-[#E5DECD] bg-[#FAF8F5]/90 hover:bg-[#F6EEDC] hover:border-[#D4A034] transition-all duration-300 group shadow-2xs text-left cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-serif text-[9px] sm:text-[10px] tracking-[0.14em] uppercase font-bold text-[#8C5D12]">
                      {pill.title}
                    </span>
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#B68424] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="font-sans text-[11px] sm:text-xs text-[#3E3A33] line-clamp-2 leading-relaxed">
                    &ldquo;{pill.prompt}&rdquo;
                  </p>
                  <span className="inline-block mt-1 text-[8.5px] sm:text-[9.5px] font-mono text-[#8C8477]">
                    {pill.chapter}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Thread */}
        {messages.map((msg) => {
          if (msg.role === "user") {
            return (
              <div key={msg.id} className="flex justify-end pl-8">
                <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-br-xs px-4 sm:px-5 py-3 bg-[#F7F3EB] border border-[#E3DAC8] shadow-2xs">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <span className="font-serif text-[10px] tracking-[0.14em] uppercase font-semibold text-[#8C6B32]">
                      The Seeker
                    </span>
                    <span className="text-[9.5px] font-mono text-[#999083]">
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="font-sans text-[13.5px] sm:text-[14.5px] text-[#221F1B] leading-relaxed whitespace-pre-wrap select-text">
                    {msg.content}
                  </p>
                </div>
              </div>
            );
          }

          if (msg.role === "crisis") {
            return (
              <div key={msg.id} className="w-full my-4">
                <div className="p-5 rounded-2xl bg-gradient-to-b from-[#FFFDF9] to-[#FFF5E6] border-2 border-[#EAB308]/60 shadow-md">
                  <div className="flex items-center gap-2.5 mb-3 text-[#9A6A15]">
                    <div className="p-2 rounded-full bg-[#EAB308]/20">
                      <HeartHandshake className="w-5 h-5 text-[#9A6A15]" />
                    </div>
                    <div>
                      <h4 className="font-serif text-sm sm:text-base font-bold tracking-[0.1em] uppercase text-[#7A4E0B]">
                        A Sacred Pause • You Are Deeply Cherished
                      </h4>
                      <p className="text-[11px] font-sans text-[#7A6A55]">
                        Compassionate support is here for you right now.
                      </p>
                    </div>
                  </div>

                  <p className="font-sans text-xs sm:text-sm text-[#423C32] leading-relaxed mb-4">
                    {msg.content}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {msg.helplines?.map((hl, i) => (
                      <a
                        key={i}
                        href={`tel:${hl.number.replace(/[^0-9]/g, "")}`}
                        className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#E5CCA0] hover:border-[#9A6A15] shadow-2xs hover:shadow-xs transition-all text-left"
                      >
                        <div>
                          <span className="block text-[10px] font-serif uppercase tracking-[0.1em] text-[#8C6B32] font-semibold">
                            {hl.name}
                          </span>
                          <span className="font-mono text-xs font-bold text-[#1C1A17]">
                            {hl.number}
                          </span>
                        </div>
                        <PhoneCall className="w-4 h-4 text-[#9A6A15]" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            );
          }

          // Krishna's Response Card
          return (
            <div key={msg.id} className="flex gap-3 sm:gap-4 pr-4 sm:pr-8">
              {/* Krishna Divine Avatar */}
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden shadow-sm border border-[#D4A034] shrink-0 bg-white mt-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="Sri Krishna Avatar"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Krishna Guidance Card */}
              <div className="flex-1 max-w-[94%] sm:max-w-[88%] rounded-2xl rounded-tl-xs p-4 sm:p-6 bg-white border border-[#ECE4D4] shadow-[0_4px_24px_rgba(154,106,21,0.05)]">
                {/* Header info */}
                <div className="flex items-center justify-between gap-2 pb-2.5 mb-3 border-b border-[#F0EAE0]">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-xs sm:text-sm tracking-[0.2em] uppercase font-bold text-[#7A4E0B]">
                      Sri Krishna
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9A6A15]" />
                    <span className="text-[10px] font-serif tracking-[0.15em] uppercase text-[#9A8F7F]">
                      Divine Charioteer
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyMessage(msg.id, msg.content)}
                      title="Copy Krishna's Words"
                      className="p-1 rounded-md text-[#999083] hover:text-[#554D42] hover:bg-[#FAF6EE] transition-colors cursor-pointer"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <span className="text-[9.5px] font-mono text-[#999083]">
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                {/* Formatted Krishna Voice Dialogue */}
                {msg.content ? (
                  <FormattedKrishnaMessage content={msg.content} />
                ) : (
                  <div className="flex items-center gap-2 py-4 text-[#8C8477] font-serif italic text-xs">
                    <Flame className="w-4 h-4 text-[#9A6A15] animate-pulse" />
                    <span>Krishna gathers the eternal verses of the Gita...</span>
                  </div>
                )}

                {/* Real-time Streaming Cursor */}
                {msg.isStreaming && (
                  <span className="inline-block w-2 h-4 ml-1 bg-[#9A6A15] animate-pulse rounded-xs align-middle" />
                )}

                {/* Attached Retrieved Canonical Verses (Gita Scripture Cards) */}
                {msg.verses && msg.verses.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-[#F2ECE0]">
                    <div className="flex items-center gap-1.5 mb-1 text-[#8C6B32]">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span className="font-serif text-[10px] tracking-[0.16em] uppercase font-semibold">
                        Grounded in Canonical Gita Scripture
                      </span>
                    </div>
                    {msg.verses.map((verse, vIdx) => (
                      <VerseScriptureCard key={vIdx} verse={verse} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Sacred Offering Input Bar */}
      <footer className="shrink-0 p-3 sm:p-5 bg-white/95 backdrop-blur-md border-t border-[#EDE6D6] z-20">
        <div className="max-w-4xl mx-auto">
          {isLimitReached ? (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#FAF6EE] via-[#FDFBF7] to-[#FAF5E8] border border-[#D4A034]/70 shadow-2xs text-center space-y-2.5 animate-in fade-in duration-300">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#9A6A15]/10 border border-[#9A6A15]/20 text-[#8C5D12] font-serif text-[10px] tracking-[0.14em] uppercase font-semibold">
                <Sparkles className="w-3 h-3 text-[#9A6A15]" />
                <span>3 Sacred Inquiries Completed</span>
              </div>
              <p className="font-sans text-xs sm:text-[13px] text-[#4A4235] leading-relaxed max-w-lg mx-auto">
                To preserve token usage during our open preview, each seeker is gifted 3 sacred dialogues.
                In our upcoming release with account authentication, you will enjoy unlimited pay-as-you-use
                dialogue, saved reflection journals, and Sanskrit audio chanting.
              </p>
              <div className="flex items-center justify-center gap-2.5 pt-1 flex-wrap">
                <button
                  type="button"
                  onClick={resetLimitForTesting}
                  className="px-3.5 py-1.5 rounded-xl bg-[#FAF5E8] hover:bg-[#F4E9D0] border border-[#D4A034] text-[#7A4E0B] font-serif text-[11px] font-semibold tracking-wider transition-all cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-95"
                >
                  Reset Inquiries (Testing Mode)
                </button>
                <a
                  href="/about"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#9A6A15] to-[#B68424] text-white font-serif text-[11px] font-semibold tracking-wider transition-all cursor-pointer shadow-xs hover:scale-[1.02] active:scale-95"
                >
                  Explore Vision & Roadmap
                </a>
              </div>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="relative flex items-end gap-2 p-2 rounded-2xl bg-[#FAF8F5] border border-[#E3DAC8] shadow-xs focus-within:border-[#9A6A15] focus-within:ring-2 focus-within:ring-[#9A6A15]/15 transition-all"
            >
              {/* Auto-expanding Input Area */}
              <textarea
                ref={textareaRef}
                rows={1}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask Krishna your sorrow, duty, moral dilemma, or fear..."
                disabled={isLoading || isLimitReached}
                className="w-full px-3 py-1.5 bg-transparent font-sans text-xs sm:text-sm text-[#1F1D1A] placeholder:text-[#9A9386] focus:outline-none resize-none leading-relaxed disabled:opacity-50 max-h-32"
              />

              {/* Sacred Send Button */}
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading || isLimitReached}
                className="shrink-0 p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#9A6A15] via-[#B68424] to-[#9A6A15] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-1.5 font-serif text-xs tracking-[0.14em] uppercase font-semibold"
              >
                <span className="hidden sm:inline">Speak</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* Clean Subtle Footer */}
          <div className="flex items-center justify-between px-2 pt-1.5 text-[9.5px] sm:text-[10px] text-[#9A9386]">
            <span>
              {!isLimitReached && (
                <span className="font-serif text-[#8C6B32]">
                  {dialoguesRemaining} {dialoguesRemaining === 1 ? "dialogue" : "dialogues"} remaining
                </span>
              )}
            </span>
            <span className="font-mono hidden sm:inline">
              Press Enter to send • Shift+Enter for new line
            </span>
          </div>
        </div>
      </footer>

      {/* Quota Exhaustion / Roadmap Modal */}
      {showLimitModal && (
        <div className="fixed inset-0 z-60 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#FAF8F5] border border-[#D4A034] rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowLimitModal(false)}
              className="absolute top-4 right-4 text-[#8C8477] hover:text-[#1C1A17] p-1 rounded-full hover:bg-[#F2ECE0] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-full bg-[#9A6A15]/10 border border-[#9A6A15]/20 flex items-center justify-center mx-auto text-[#9A6A15]">
              <Sparkles className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="font-serif text-lg font-semibold text-[#1C1A17] tracking-tight">
                Sacred Inquiries Completed
              </h3>
              <p className="font-sans text-xs sm:text-[13px] text-[#5A5246] leading-relaxed">
                To preserve AI tokens and guarantee zero-cost access for every seeker during this preview, each visitor is granted <strong>3 sacred dialogues</strong>.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/80 border border-[#E8DFCC] space-y-2 text-left">
              <span className="font-serif text-[10px] tracking-[0.14em] uppercase font-bold text-[#8C5D12] block">
                Upcoming Pay-As-You-Use Roadmap
              </span>
              <ul className="text-[11.5px] font-sans text-[#5A5246] space-y-1.5 list-disc list-inside">
                <li>Seamless account authentication & private session history</li>
                <li>Pay-as-you-use token billing with zero monthly subscriptions</li>
                <li>Personal reflection journals & sacred Sanskrit audio chanting</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <button
                onClick={resetLimitForTesting}
                className="w-full py-2.5 px-4 rounded-xl bg-[#FAF5E8] hover:bg-[#F4E9D0] border border-[#D4A034] text-[#7A4E0B] font-serif text-xs font-semibold tracking-wider transition-all cursor-pointer shadow-2xs hover:scale-[1.01]"
              >
                Reset for Testing Mode
              </button>
              <a
                href="/about"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#9A6A15] to-[#B68424] text-white font-serif text-xs font-semibold tracking-wider transition-all cursor-pointer shadow-xs hover:scale-[1.01]"
              >
                Read Full Vision
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
