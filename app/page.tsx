"use client";

import { useMemo, useRef, useState } from "react";

const chordLibrary = [
  {
    name: "Cmaj7",
    mood: "Warm & open",
    notes: ["C", "E", "G", "B"],
    fingering: {
      right: "1-2-3-5 (C-E-G-B)",
      left: "5-3-2-1 (C-G-B-E)",
    },
    frequencies: [261.63, 329.63, 392.0, 493.88],
  },
  {
    name: "Dm9",
    mood: "Cool & sophisticated",
    notes: ["D", "F", "A", "C", "E"],
    fingering: {
      right: "1-2-3-4-5 (D-F-A-C-E)",
      left: "5-2-1 (D-A-E)",
    },
    frequencies: [293.66, 349.23, 440.0, 523.25, 659.25],
  },
  {
    name: "G13",
    mood: "Bright & restless",
    notes: ["G", "B", "D", "F", "E"],
    fingering: {
      right: "1-2-3-4-5 (G-B-D-F-E)",
      left: "5-2-1 (G-D-F)",
    },
    frequencies: [196.0, 246.94, 293.66, 349.23, 659.25],
  },
  {
    name: "F#m7b5",
    mood: "Tense & cinematic",
    notes: ["F#", "A", "C", "E"],
    fingering: {
      right: "1-2-3-5 (F#-A-C-E)",
      left: "5-3-2-1 (F#-C-E-A)",
    },
    frequencies: [369.99, 440.0, 523.25, 659.25],
  },
];

const progressions = [
  {
    name: "II-V-I in C",
    description: "The cornerstone of jazz. Smooth resolution into home base.",
    chords: ["Dm9", "G13", "Cmaj7"],
  },
  {
    name: "Minor turnaround",
    description: "Moody and modern with a hint of suspense.",
    chords: ["F#m7b5", "B7alt", "Em9"],
  },
  {
    name: "Gospel glide",
    description: "Bright, uplifting movement with rich extensions.",
    chords: ["Cmaj7", "Am9", "Dm9", "G13"],
  },
];

const popReharm = [
  {
    song: "Someone Like You",
    artist: "Adele",
    original: "I - V - vi - IV",
    jazz: "Imaj7 - III7alt - vi9 - II7 - V13",
    vibe: "Turn the ballad into a smoky jazz lounge tune.",
  },
  {
    song: "Let It Be",
    artist: "The Beatles",
    original: "I - V - vi - IV",
    jazz: "Imaj7 - V13sus - ii9 - V13",
    vibe: "Adds gospel warmth and soft tension release.",
  },
  {
    song: "Stay",
    artist: "Rihanna",
    original: "vi - IV - I - V",
    jazz: "vi9 - IVmaj7 - Imaj7 - V13",
    vibe: "Keeps the pop feel, deepens the harmony.",
  },
];

const keyboardNotes = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

export default function Home() {
  const [selectedChord, setSelectedChord] = useState(chordLibrary[0]);
  const [selectedProgression, setSelectedProgression] = useState(progressions[0]);
  const [selectedPracticeChord, setSelectedPracticeChord] = useState(chordLibrary[0]);
  const [playedNotes, setPlayedNotes] = useState<string[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);

  const recognitionStatus = useMemo(() => {
    const required = new Set(selectedPracticeChord.notes);
    const played = new Set(playedNotes);

    const missing = Array.from(required).filter((note) => !played.has(note));
    const extra = playedNotes.filter((note) => !required.has(note));

    if (playedNotes.length === 0) {
      return "Play notes to get feedback.";
    }

    if (missing.length === 0 && extra.length === 0) {
      return "Perfect! That chord is locked in.";
    }

    if (missing.length <= 2 && extra.length === 0) {
      return `Almost there. Add: ${missing.join(", ")}.`;
    }

    return `Close! Missing ${missing.join(", ") || "none"}. Extra ${
      extra.join(", ") || "none"
    }.`;
  }, [playedNotes, selectedPracticeChord]);

  const handlePlayChord = (frequencies: number[]) => {
    if (typeof window === "undefined") return;
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const context = audioContextRef.current;
    const now = context.currentTime;

    frequencies.forEach((frequency) => {
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.type = "triangle";
      oscillator.frequency.value = frequency;

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.2, now + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.start(now);
      oscillator.stop(now + 1.5);
    });
  };

  const toggleNote = (note: string) => {
    setPlayedNotes((prev) =>
      prev.includes(note) ? prev.filter((item) => item !== note) : [...prev, note]
    );
  };

  const resetPlayed = () => setPlayedNotes([]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-20 pt-10 md:px-10">
        <header className="flex flex-col gap-8">
          <nav className="flex items-center justify-between text-sm text-slate-300">
            <span className="font-semibold tracking-[0.2em] text-amber-300">
              JAZZ KEYS LAB
            </span>
            <div className="flex gap-4">
              <button className="rounded-full border border-slate-700 px-4 py-2 text-xs uppercase tracking-wide transition hover:border-amber-300 hover:text-amber-300">
                Guided Practice
              </button>
              <button className="rounded-full bg-amber-400 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-950">
                Start Session
              </button>
            </div>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
                Learn jazz chords with fingerings, playback, and real-time feedback.
              </h1>
              <p className="text-lg text-slate-300">
                Build lush voicings, hear how they move in progressions, and get
                instant recognition feedback when you play on the piano or tap
                notes on your phone.
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  "Guided voicings",
                  "Progression trainer",
                  "Chord recognition",
                  "Pop reharmonization",
                ].map((pill) => (
                  <span
                    key={pill}
                    className="rounded-full border border-slate-700 px-4 py-2 text-xs uppercase tracking-wide text-slate-200"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <p className="text-sm uppercase tracking-[0.3em] text-amber-300">
                  Chord of the day
                </p>
                <button
                  className="rounded-full border border-slate-700 px-4 py-2 text-xs uppercase tracking-wide transition hover:border-amber-300 hover:text-amber-300"
                  onClick={() => handlePlayChord(selectedChord.frequencies)}
                >
                  Hear it
                </button>
              </div>
              <h2 className="mt-6 text-4xl font-semibold text-white">
                {selectedChord.name}
              </h2>
              <p className="mt-2 text-slate-300">{selectedChord.mood}</p>
              <div className="mt-6 grid gap-4 text-sm text-slate-200">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Right hand
                  </p>
                  <p className="mt-1 text-base">{selectedChord.fingering.right}</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Left hand
                  </p>
                  <p className="mt-1 text-base">{selectedChord.fingering.left}</p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {selectedChord.notes.map((note) => (
                  <span
                    key={note}
                    className="rounded-full bg-amber-400/15 px-3 py-1 text-xs uppercase tracking-wide text-amber-200"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-amber-300">
                  Chord Explorer
                </p>
                <h3 className="mt-2 text-2xl font-semibold">Pick a voicing</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {chordLibrary.map((chord) => (
                  <button
                    key={chord.name}
                    onClick={() => setSelectedChord(chord)}
                    className={`rounded-full border px-4 py-2 text-xs uppercase tracking-wide transition ${
                      selectedChord.name === chord.name
                        ? "border-amber-300 text-amber-200"
                        : "border-slate-700 text-slate-300 hover:border-amber-300 hover:text-amber-200"
                    }`}
                  >
                    {chord.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Notes in the chord
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedChord.notes.map((note) => (
                    <span
                      key={note}
                      className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-200"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Listen & play
                </p>
                <p className="mt-3 text-sm text-slate-300">
                  Tap to hear the chord. Then mirror the fingering on your piano
                  or the on-screen keys below.
                </p>
                <button
                  onClick={() => handlePlayChord(selectedChord.frequencies)}
                  className="mt-4 w-full rounded-2xl bg-amber-400 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-slate-950"
                >
                  Play chord
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-300">
              Quick drills
            </p>
            <h3 className="mt-2 text-2xl font-semibold">3-minute routine</h3>
            <ol className="mt-6 space-y-4 text-sm text-slate-300">
              <li className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <strong className="text-slate-100">1.</strong> Play the chosen
                chord with the listed fingering.
              </li>
              <li className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <strong className="text-slate-100">2.</strong> Loop the II-V-I
                progression and sing the guide tones.
              </li>
              <li className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <strong className="text-slate-100">3.</strong> Record yourself
                and compare to the audio preview.
              </li>
            </ol>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-300">
              Progression Studio
            </p>
            <h3 className="mt-2 text-2xl font-semibold">Feel the movement</h3>
            <p className="mt-3 text-sm text-slate-300">
              Choose a progression and hear how the chords guide your ear toward
              resolution.
            </p>
            <div className="mt-6 space-y-3">
              {progressions.map((progression) => (
                <button
                  key={progression.name}
                  onClick={() => setSelectedProgression(progression)}
                  className={`w-full rounded-2xl border p-4 text-left text-sm transition ${
                    selectedProgression.name === progression.name
                      ? "border-amber-300 text-amber-100"
                      : "border-slate-800 text-slate-300 hover:border-amber-300"
                  }`}
                >
                  <h4 className="text-base font-semibold text-white">
                    {progression.name}
                  </h4>
                  <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">
                    {progression.chords.join("  •  ")}
                  </p>
                  <p className="mt-2 text-xs text-slate-400">
                    {progression.description}
                  </p>
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                const chord = chordLibrary.find(
                  (item) => item.name === selectedProgression.chords[0]
                );
                if (chord) {
                  handlePlayChord(chord.frequencies);
                }
              }}
              className="mt-6 w-full rounded-2xl border border-amber-300 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-amber-200"
            >
              Preview first chord
            </button>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-300">
              Chord Recognition
            </p>
            <h3 className="mt-2 text-2xl font-semibold">
              Tap or play to check yourself
            </h3>
            <p className="mt-3 text-sm text-slate-300">
              Tap the keys you play. The engine checks the notes and tells you if
              the chord matches.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {chordLibrary.map((chord) => (
                <button
                  key={chord.name}
                  onClick={() => {
                    setSelectedPracticeChord(chord);
                    resetPlayed();
                  }}
                  className={`rounded-full border px-4 py-2 text-xs uppercase tracking-wide transition ${
                    selectedPracticeChord.name === chord.name
                      ? "border-amber-300 text-amber-200"
                      : "border-slate-700 text-slate-300 hover:border-amber-300"
                  }`}
                >
                  {chord.name}
                </button>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-4 gap-2 rounded-2xl border border-slate-800 bg-slate-950 p-4">
              {keyboardNotes.map((note) => (
                <button
                  key={note}
                  onClick={() => toggleNote(note)}
                  className={`rounded-xl border px-2 py-3 text-xs font-semibold uppercase tracking-wide transition ${
                    playedNotes.includes(note)
                      ? "border-amber-300 bg-amber-400/20 text-amber-200"
                      : "border-slate-700 text-slate-300 hover:border-amber-300"
                  }`}
                >
                  {note}
                </button>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm">
              <span className="text-slate-300">{recognitionStatus}</span>
              <button
                onClick={resetPlayed}
                className="rounded-full border border-slate-700 px-4 py-2 text-xs uppercase tracking-wide text-slate-300 hover:border-amber-300 hover:text-amber-200"
              >
                Reset
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-amber-300">
                Pop to Jazz
              </p>
              <h3 className="mt-2 text-2xl font-semibold">
                Familiar songs, richer harmony
              </h3>
            </div>
            <button className="rounded-full border border-slate-700 px-4 py-2 text-xs uppercase tracking-wide text-slate-300 hover:border-amber-300 hover:text-amber-200">
              Save playlist
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {popReharm.map((song) => (
              <article
                key={song.song}
                className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
              >
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  {song.artist}
                </p>
                <h4 className="mt-2 text-lg font-semibold text-white">
                  {song.song}
                </h4>
                <p className="mt-3 text-xs uppercase tracking-wide text-slate-400">
                  Original: {song.original}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wide text-amber-200">
                  Jazz: {song.jazz}
                </p>
                <p className="mt-3 text-sm text-slate-300">{song.vibe}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-amber-300/50 bg-gradient-to-r from-amber-400/10 via-transparent to-amber-400/10 p-6 text-center">
          <h3 className="text-2xl font-semibold">Ready for a daily session?</h3>
          <p className="mt-2 text-sm text-slate-300">
            Set your tempo, record your practice, and track every chord you
            master.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {[
              "Slow tempo",
              "Guide tones",
              "Voice leading",
              "Audio recorder",
            ].map((label) => (
              <span
                key={label}
                className="rounded-full border border-amber-300/50 px-4 py-2 text-xs uppercase tracking-wide text-amber-200"
              >
                {label}
              </span>
            ))}
          </div>
        </section>

        <footer className="flex flex-col items-center gap-3 border-t border-slate-800 pt-6 text-xs uppercase tracking-[0.2em] text-slate-500">
          <span>Built for mobile-friendly jazz practice</span>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <span>Audio previews</span>
            <span>Chord feedback</span>
            <span>Practice streaks</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
