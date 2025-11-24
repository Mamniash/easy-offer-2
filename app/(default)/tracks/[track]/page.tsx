import { notFound } from "next/navigation";
import TrackQuestionsClient from "./TrackQuestionsClient";
import { trackMap } from "../tracks-data";

export default function TrackPage({ params }: { params: { track: string } }) {
  const track = trackMap[params.track];

  if (!track) {
    notFound();
  }

  return (
    <section className="relative pb-16 pt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <TrackQuestionsClient track={track} />
      </div>
    </section>
  );
}
