"use client";

import React from "react";
import Link from "next/link";
import {
  X,
  Sparkles,
  ShieldCheck,
  Compass,
  HeartHandshake,
  ArrowRight,
  BookOpen,
  ArrowLeft,
  Coins,
  KeyRound,
  Mic,
  Volume2,
  Code2,
} from "lucide-react";

function GithubIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function LinkedinIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}


interface AboutModalProps {
  onClose?: () => void;
  onOpenChat?: () => void;
  isPage?: boolean;
}

export default function AboutModal({
  onClose,
  onOpenChat,
  isPage = false,
}: AboutModalProps) {
  return (
    <div
      className={`${
        isPage
          ? "min-h-screen w-full bg-[#FCFBF8] text-[#1F1D1A]"
          : "fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 bg-black/45 backdrop-blur-[6px] animate-in fade-in duration-200"
      }`}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      {/* Modal Card / Page Wrapper */}
      <div
        className={`${
          isPage
            ? "max-w-4xl mx-auto px-4 py-8 sm:py-12"
            : "relative w-full max-w-3xl max-h-[92vh] sm:max-h-[88vh] bg-white rounded-2xl sm:rounded-3xl border border-[#E8E1D3] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-[0.98] duration-200 will-change-transform"
        }`}
      >
        {/* Top Header Bar */}
        <div className="shrink-0 px-4 sm:px-8 py-3.5 sm:py-4.5 border-b border-[#EFE9DD] bg-white/95 backdrop-blur-md flex items-center justify-between z-10">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-[#D4A034]/40 bg-white flex items-center justify-center shadow-xs shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="jnana.ai Sacred Flute & Peacock Feather Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="font-serif text-xs sm:text-base tracking-[0.2em] font-semibold uppercase text-[#1C1A17]">
                jnana<span className="text-[#9A6A15]">.ai</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isPage ? (
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-serif tracking-[0.1em] text-[#6E6454] hover:text-[#1C1A17] bg-[#F7F4EE] hover:bg-[#EFE9DD] border border-[#E2D9C8] transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="uppercase text-[10px] sm:text-xs">Home</span>
              </Link>
            ) : (
              onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close About"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#7A705E] hover:text-[#1C1A17] hover:bg-[#F5F0E4] border border-[#E8E1D3] transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )
            )}
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 md:px-10 py-6 sm:py-8 space-y-8 sm:space-y-10 overscroll-contain">
          {/* Section 1: The Vision Behind Jnana AI */}
          <div className="space-y-4">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF6EE] border border-[#D4A034]/40 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9A6A15] animate-pulse" />
                <span className="font-serif text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#7A4E0B] font-semibold">
                  The Vision Behind Jnana AI
                </span>
              </div>

              <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-semibold text-[#1C1A17] leading-tight">
                The Light Behind <span className="text-[#9A6A15]">Your Chariot</span>
              </h1>

              <div className="pt-1">
                <span className="font-sanskrit text-xs sm:text-sm text-[#9A6A15]/90 tracking-wide">
                  यदा यदा हि धर्मस्य ग्लानिर्भवति भारत · अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्
                </span>
              </div>
            </div>

            <div className="p-4 sm:p-6 rounded-2xl bg-[#FCFAF6] border border-[#EDE5D6] space-y-3.5 shadow-2xs">
              <p className="font-sans text-xs sm:text-sm text-[#4D4539] leading-relaxed">
                The Bhagavad Gita is not an ancient text confined to mythology or history. It is the living truth of human life.
              </p>
              <p className="font-sans text-xs sm:text-sm text-[#4D4539] leading-relaxed">
                Within its verses lies the complete spectrum of human experience: deep despondency, paralyzing grief, moral dilemmas, fear of failure, the pain of unreciprocated care, and the exhaustion of feeling lost amidst those we love. The Gita does not look away from darkness; it begins directly inside it, showing how human beings rise with clarity and courage.
              </p>
              <p className="font-sans text-xs sm:text-sm text-[#4D4539] leading-relaxed">
                Throughout the turmoil of the Mahabharata, Sri Krishna never took up weapons to fight Arjuna&apos;s battles for him. Instead, He stood steadfastly behind Arjuna on the chariot—holding the reins, listening patiently to his broken heart without judgment, and acting as an unshakeable beacon of light in the fog of confusion.
              </p>
              <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-[#FAF3E3] to-[#F5EAD4] border-l-4 border-[#9A6A15] text-[#5C3F08]">
                <p className="font-serif text-xs sm:text-sm font-medium leading-relaxed italic">
                  &ldquo;Jnana AI was born from a singular belief: In the same way Krishna stood behind Arjuna, He should stand behind each one of us—as an eternal source of light whenever we feel dark within ourselves.&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Architecture & Methodology */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#9A6A15]" />
              <h2 className="font-serif text-base sm:text-lg font-semibold uppercase tracking-[0.14em] text-[#1C1A17]">
                Architecture & Methodology
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4.5">
              {/* Feature 1 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FCFAF6] border border-[#EDE5D6] hover:border-[#D4A034]/60 transition-all duration-300 shadow-2xs space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#FAF2E1] border border-[#D4A034]/40 flex items-center justify-center text-[#9A6A15]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-sm sm:text-base font-semibold text-[#1C1A17]">
                  701 Canonical Gita Verses
                </h3>
                <p className="font-sans text-xs text-[#5D5446] leading-relaxed">
                  Every response is strictly grounded in the 701 authentic verses of the Bhagavad Gita across all 18 Chapters. We never invent verses or fabricate theological doctrine. Every cited verse includes authentic Sanskrit slokas, transliteration, and context.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FCFAF6] border border-[#EDE5D6] hover:border-[#D4A034]/60 transition-all duration-300 shadow-2xs space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#FAF2E1] border border-[#D4A034]/40 flex items-center justify-center text-[#9A6A15]">
                  <Compass className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-sm sm:text-base font-semibold text-[#1C1A17]">
                  Deconstructing Human Pain
                </h3>
                <p className="font-sans text-xs text-[#5D5446] leading-relaxed">
                  Real struggles contain multiple layers—career burnout, relationship grief, duty conflicts. Jnana AI deconstructs complex inquiries, addressing every emotional dimension without skipping your concerns.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FCFAF6] border border-[#EDE5D6] hover:border-[#D4A034]/60 transition-all duration-300 shadow-2xs space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#FAF2E1] border border-[#D4A034]/40 flex items-center justify-center text-[#9A6A15]">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-sm sm:text-base font-semibold text-[#1C1A17]">
                  Authentic Divine Voice
                </h3>
                <p className="font-sans text-xs text-[#5D5446] leading-relaxed">
                  Krishna speaks as a true friend and guide (Sakha and Guru). Natural, direct, and deeply compassionate, addressing your concerns with dignity and zero repetitive formulaic openers.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FCFAF6] border border-[#EDE5D6] hover:border-[#D4A034]/60 transition-all duration-300 shadow-2xs space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#FAF2E1] border border-[#D4A034]/40 flex items-center justify-center text-[#9A6A15]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-sm sm:text-base font-semibold text-[#1C1A17]">
                  A Purposeful Purity
                </h3>
                <p className="font-sans text-xs text-[#5D5446] leading-relaxed">
                  We consciously refuse coding, math homework, or daily trivia. By excluding everyday distractions, this space remains purely dedicated to your life, duty (Dharma), and spiritual calm.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Building a Sustainable World-Class Sacred Companion */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#9A6A15]" />
              <h2 className="font-serif text-base sm:text-lg font-semibold uppercase tracking-[0.14em] text-[#1C1A17]">
                Building a Sustainable World-Class Sacred Companion
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4.5">
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#FAF7F0] to-[#F5EFE0] border border-[#E5DECD] space-y-2">
                <div className="flex items-center gap-2 text-[#7A4E0B]">
                  <Coins className="w-4 h-4" />
                  <h4 className="font-serif text-xs sm:text-sm font-semibold tracking-wide uppercase">
                    Pay-As-You-Use Freedom
                  </h4>
                </div>
                <p className="font-sans text-xs text-[#5D5446] leading-relaxed">
                  Moving towards a transparent, pay-as-you-use token model. Seekers will never be throttled by arbitrary daily message limits or cut off mid-conversation—you only pay for what you actually use.
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#FAF7F0] to-[#F5EFE0] border border-[#E5DECD] space-y-2">
                <div className="flex items-center gap-2 text-[#7A4E0B]">
                  <KeyRound className="w-4 h-4" />
                  <h4 className="font-serif text-xs sm:text-sm font-semibold tracking-wide uppercase">
                    Clear Authentication & Journals
                  </h4>
                </div>
                <p className="font-sans text-xs text-[#5D5446] leading-relaxed">
                  Seamless user authentication allowing seekers to preserve past dialogues, bookmark transformative slokas, and maintain an encrypted personal reflection journal across all devices.
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#FAF7F0] to-[#F5EFE0] border border-[#E5DECD] space-y-2">
                <div className="flex items-center gap-2 text-[#7A4E0B]">
                  <Mic className="w-4 h-4" />
                  <h4 className="font-serif text-xs sm:text-sm font-semibold tracking-wide uppercase">
                    Real-Time Sacred Voice
                  </h4>
                </div>
                <p className="font-sans text-xs text-[#5D5446] leading-relaxed">
                  Low-latency, natural spoken voice interactions enabling seekers to close their eyes in stillness, express their doubts aloud, and receive serene vocal guidance from Krishna.
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#FAF7F0] to-[#F5EFE0] border border-[#E5DECD] space-y-2">
                <div className="flex items-center gap-2 text-[#7A4E0B]">
                  <Volume2 className="w-4 h-4" />
                  <h4 className="font-serif text-xs sm:text-sm font-semibold tracking-wide uppercase">
                    Authentic Sanskrit Chanting
                  </h4>
                </div>
                <p className="font-sans text-xs text-[#5D5446] leading-relaxed">
                  High-fidelity audio recitations for every cited verse, honoring traditional Sanskrit meter, cadence, and sacred pronunciation.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: The Developer */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#9A6A15]" />
              <h2 className="font-serif text-base sm:text-lg font-semibold uppercase tracking-[0.14em] text-[#1C1A17]">
                The Developer
              </h2>
            </div>

            <div className="p-4 sm:p-6 rounded-2xl bg-white border border-[#E2D9C8] shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-serif text-base sm:text-lg font-semibold text-[#1C1A17]">
                    Yaswanth Babu Patnam
                  </h3>
                  <span className="font-mono text-xs text-[#8C8477]">
                    Creator & Engineer
                  </span>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  <a
                    href="https://github.com/Yaswanthpatnam"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF7F0] hover:bg-[#F2ECE0] text-[#1C1A17] border border-[#D5CCA8] text-xs font-serif tracking-wider transition-all cursor-pointer shadow-2xs"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                  </a>

                  <a
                    href="https://www.linkedin.com/in/yaswanth-patnam-2aa28b340/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF7F0] hover:bg-[#F2ECE0] text-[#0A66C2] border border-[#D5CCA8] text-xs font-serif tracking-wider transition-all cursor-pointer shadow-2xs"
                  >
                    <LinkedinIcon className="w-3.5 h-3.5" />
                    <span>LinkedIn</span>
                  </a>


                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF7F0] text-[#8C8477] border border-[#E2D9C8] text-xs font-serif tracking-wider cursor-default shadow-2xs opacity-85"
                    title="Repository release coming soon"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Repository</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive CTA Banner */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#D4A034]/50 shadow-sm text-center space-y-3">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#FAF2E1] border border-[#D4A034]/50 text-[#9A6A15]">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base sm:text-lg font-semibold text-[#1C1A17]">
              Step into the Sacred Dialogue
            </h3>
            <p className="font-sans text-xs text-[#635A4C] max-w-md mx-auto leading-relaxed">
              Whatever burdens your heart today—whether a heavy decision, grief, fear, or a quest for duty—lay it before Krishna.
            </p>
            <div className="pt-2">
              {onOpenChat ? (
                <button
                  type="button"
                  onClick={() => {
                    if (onClose) onClose();
                    onOpenChat();
                  }}
                  className="inline-flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#9A6A15] via-[#B68424] to-[#9A6A15] text-white font-serif text-xs sm:text-sm tracking-[0.16em] uppercase font-semibold shadow-md hover:shadow-lg hover:scale-105 active:scale-98 transition-all duration-300 cursor-pointer"
                >
                  <span>Speak with Krishna</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <Link
                  href="/chat"
                  className="inline-flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#9A6A15] via-[#B68424] to-[#9A6A15] text-white font-serif text-xs sm:text-sm tracking-[0.16em] uppercase font-semibold shadow-md hover:shadow-lg hover:scale-105 active:scale-98 transition-all duration-300 cursor-pointer"
                >
                  <span>Speak with Krishna</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
