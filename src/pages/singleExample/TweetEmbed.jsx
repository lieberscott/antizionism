import { useEffect, useRef } from "react";

export default function TweetEmbed({ tweetId }) {
  const containerRef = useRef(null);

  useEffect(() => {
    // Ensure the Twitter script runs after embed insertion
    if (window.twttr && window.twttr.widgets) {
      window.twttr.widgets.load(containerRef.current);
    }
  }, [tweetId]);

  return (
    <div ref={containerRef}>
      <blockquote
        className="twitter-tweet"
        data-conversation="none"         // Hides thread replies
        data-cards="visible"             // Media visible (default)
        data-align="center"              // Align center
      >
        <a href={`https://twitter.com/x/status/${tweetId}`}></a>
      </blockquote>
    </div>
  );
}
