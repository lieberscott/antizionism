import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "../../styles/stylesheet.css"; // import the CSS file


import TweetCard from "./TweetCard.jsx";

// Carousel component
export default function TweetCarousel({ tweets, displayedDate, currentIndex, tweetIndex, handleTweetsIndex }) {
  // const [index, setIndex] = useState(0);

  const prev = () =>{
    if (clickCooldown.current) return;
    clickCooldown.current = true;
    setTimeout(() => (clickCooldown.current = false), 400);

    if (tweets.length === 0) {
      handleTweetsIndex(0)
    }
    else if (tweetIndex === 0) {
      handleTweetsIndex(tweets.length - 1);
    }
    else {
      handleTweetsIndex(tweetIndex - 1);
    }
  }

  const next = () => {
    if (clickCooldown.current) return;
    clickCooldown.current = true;
    setTimeout(() => (clickCooldown.current = false), 400);

    if (tweetIndex === tweets.length - 1 || tweets.length === 0) {
      handleTweetsIndex(0);
    }
    else {
      handleTweetsIndex(tweetIndex + 1);
    }
  }
  const clickCooldown = useRef(false);

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Header bar */}
      <div className="flex items-center justify-center gap-4 mb-2">
        <button onClick={prev} className="p-2 bg-gray-200 rounded-full icon-black">
          <ChevronLeft size={18} />
        </button>
        <p className="font-bold text-gray-700 text-sm horizontal-padding">
          Tweet {tweetIndex + 1} of {tweets.length}
        </p>
        <button onClick={next} className="p-2 bg-gray-200 rounded-full icon-black">
          <ChevronRight size={18} />
        </button>
      </div>

      <motion.div
        key={displayedDate + currentIndex + tweetIndex}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.3 }}
      >
        <TweetCard tweetId={ tweets.length > 0 ? tweets[tweetIndex] : "id1" } />
      </motion.div>

    </div>
  );
}
