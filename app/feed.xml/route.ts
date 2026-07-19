import { buildAtomFeed } from "../content/feed";
import { feedPublications } from "../content/publications";

export function GET(): Response {
  return new Response(buildAtomFeed(feedPublications), {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
    },
  });
}
