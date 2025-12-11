import React, { useState, useEffect } from "react";
import TweetEmbed from "./TweetEmbed.jsx";
import "../../styles/stylesheet.css"; // import the CSS file


export default function TweetCard({ tweetId }) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {}, [tweetId]);


  return (
    <div className="w-72 max-h-48 flex flex-col bg-white shadow rounded-2xl p-4 overflow-hidden">
      <div
        className={`transition-all duration-300 ${
          expanded ? "max-h-88 overflow-y-auto" : "max-h-64 overflow-hidden"
        }`}
      >
        { tweetId === "id1" ? [] :  <TweetEmbed tweetId={tweetId} />}
      </div>
      <button
        className="text-blue-500 mt-2 text-sm self-start"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? "Show less" : "Show more"}
      </button>
    </div>
  );
}
