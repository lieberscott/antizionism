import React, { useState } from "react";

import TweetCarousel from "../singleExample/TweetCarousel.jsx";

function Preview({ previewData, viewMode }) {
  const { claim, explanation, them, us } = previewData;
  const displayedDate = "preview";

  const [themTweetsIndex, setThemTweetsIndex] = useState(0);
  const [usTweetsIndex, setUsTweetsIndex] = useState(0);

  return (
    <div className="preview-container">
      <h4>Claim: {claim}</h4>
      <p className="preview-text">Explanation: {explanation}</p>

      <div className="preview-carousels">

        {/* Standalone Mode → One TweetCarousel */}
        {viewMode === "standalone" && (
          <div className="preview-column">
            <h4>Tweet</h4>
            <TweetCarousel
              tweets={them}
              displayedDate={displayedDate}
              currentIndex={0}
              tweetIndex={themTweetsIndex}
              handleTweetsIndex={setThemTweetsIndex}
            />
          </div>
        )}

        {/* Them vs Us OR Then vs Now → Two Carousels */}
        {(viewMode === "themUs" || viewMode === "thenNow") && (
          <>
            <div className="preview-column">
              <h4>{viewMode === "thenNow" ? "Then" : "Them"}</h4>
              <TweetCarousel
                tweets={them}
                displayedDate={displayedDate}
                currentIndex={0}
                tweetIndex={themTweetsIndex}
                handleTweetsIndex={setThemTweetsIndex}
              />
            </div>

            <div className="preview-column">
              <h4>{viewMode === "thenNow" ? "Now" : "Us"}</h4>
              <TweetCarousel
                tweets={us}
                displayedDate={displayedDate}
                currentIndex={0}
                tweetIndex={usTweetsIndex}
                handleTweetsIndex={setUsTweetsIndex}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Preview;