"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { Track } from "@/data/tracks";

type Props = {
  directionSlug: string;
  tracks: Track[];
};

export default function TrackCatalog({ directionSlug, tracks }: Props) {
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  const availableLevels = useMemo(
    () => Array.from(new Set(tracks.map((track) => track.level))),
    [tracks],
  );

  const filteredTracks = useMemo(() => {
    return tracks.filter((track) => {
      const matchesLevel =
        selectedLevels.length === 0 || selectedLevels.includes(track.level);
      const matchesQuery = track.title
        .toLowerCase()
        .includes(query.toLowerCase().trim());

      return matchesLevel && matchesQuery;
    });
  }, [query, selectedLevels, tracks]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm shadow-black/[0.03]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            {availableLevels.map((level) => {
              const isActive = selectedLevels.includes(level);

              return (
                <button
                  key={level}
                  type="button"
                  onClick={() =>
                    setSelectedLevels((prev) =>
                      prev.includes(level)
                        ? prev.filter((item) => item !== level)
                        : [...prev, level],
                    )
                  }
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${isActive ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"}`}
                >
                  {level}
                </button>
              );
            })}
          </div>
          <div className="w-full md:w-80">
            <label className="sr-only" htmlFor="track-search">
              Поиск трека
            </label>
            <input
              id="track-search"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800 shadow-inner shadow-gray-100 focus:border-blue-500 focus:outline-none"
              placeholder="Поиск по названию"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {filteredTracks.map((track) => (
          <div
            key={track.slug}
            className="relative overflow-hidden rounded-2xl bg-white p-5 shadow-lg shadow-black/[0.03] before:absolute before:inset-x-0 before:bottom-0 before:h-28 before:bg-linear-to-t before:from-gray-900/5 before:to-transparent"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-gray-500">{track.stats.updatedAt}</p>
                <h3 className="mt-1 text-xl font-semibold text-gray-900">{track.title}</h3>
              </div>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-800">
                {track.level}
              </span>
            </div>
            <p className="mt-3 text-sm text-gray-700">{track.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {track.badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700"
                >
                  {badge}
                </span>
              ))}
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {track.questions.length} вопросов
              </span>
            </div>
            <div className="mt-5 flex items-center justify-between text-sm text-gray-600">
              <span>
                {track.stats.interviewCount} собеседований в выборке
              </span>
              <Link
                href={`/tracks/${directionSlug}/${track.slug}`}
                className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-gray-800"
              >
                Открыть вопросы <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        ))}
        {filteredTracks.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white/60 p-10 text-center text-gray-600">
            Ничего не нашлось. Сбросьте фильтры или попробуйте другое ключевое слово.
          </div>
        )}
      </div>
    </div>
  );
}
