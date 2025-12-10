import React, { useState } from "react";
import Preview from "./Preview.jsx"; // reuse your existing component for preview
import "../../styles/submitStyles.css";
import { claims } from "../../data/db.js";
import { submitExample } from "../../../api/api.js";


function SubmitPage() {
  const [claim, setClaim] = useState(claims[0].claimShortText || "");
  const [claimId, setClaimId] = useState(claims[0].claimId);
  const [explanation, setExplanation] = useState("");
  const [themTweets, setThemTweets] = useState("");
  const [usTweets, setUsTweets] = useState("");
  const [standaloneTweets, setStandaloneTweets] = useState("");
  const [thenTweets, setThenTweets] = useState("");
  const [nowTweets, setNowTweets] = useState("");
  const [copied, setCopied] = useState(false);


  const [statusMessage, setStatusMessage] = useState("");
  const [viewMode, setViewMode] = useState("themUs");  // "themUs" | "standalone" | "thenNow"

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(outputJson, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };


  const formatTweets = (str) =>
    str
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

  const previewData = {
    claim: claim,
    explanation,
    them:
      viewMode === "themUs"
        ? formatTweets(themTweets)
        : viewMode === "standalone"
          ? formatTweets(standaloneTweets)
          : formatTweets(thenTweets),

    us:
      viewMode === "themUs"
        ? formatTweets(usTweets)
        : viewMode === "standalone"
          ? []
          : formatTweets(nowTweets),
  };

  const outputJson = {
    claimId,
    claim,
    explanation,
    viewMode,
    them:
      viewMode === "themUs"
        ? formatTweets(themTweets)
        : viewMode === "standalone"
        ? formatTweets(standaloneTweets)
        : formatTweets(thenTweets),

    us:
      viewMode === "themUs"
        ? formatTweets(usTweets)
        : viewMode === "standalone"
        ? []
        : formatTweets(nowTweets),
  };


  return (
    <div className="submit-page">
      <h3>Submit Your Example</h3>

      {/* Toggle buttons */}
      <div className="toggle-row">
        <button 
          className={viewMode === "themUs" ? "toggle-active" : ""}
          onClick={() => {
            setStandaloneTweets("");
            setThenTweets("");
            setNowTweets("");
            setViewMode("themUs")
          }}
        >
          Them vs. Us
        </button>

        <button 
          className={viewMode === "standalone" ? "toggle-active" : ""}
          onClick={() => {
            setThemTweets("");
            setUsTweets("");
            setThenTweets("");
            setNowTweets("");
            setViewMode("standalone")
          }}
        >
          Standalone Tweet
        </button>

        <button 
          className={viewMode === "thenNow" ? "toggle-active" : ""}
          onClick={() => {
            setThemTweets("");
            setUsTweets("");
            setStandaloneTweets("");
            setViewMode("thenNow")
          }}
        >
          Then vs. Now
        </button>
      </div>


      {/* Claim */}
      <div className="form-line">
        <label>Select a Claim:</label>
        <select
          value={claimId}
          onChange={(e) => {
            const selectedClaim = claims.find((c) => c.claimId === e.target.value);
            if (selectedClaim) {
              setClaim(selectedClaim.claimText);
              setClaimId(selectedClaim.claimId);
            } else {
              setClaim("");
              setClaimId("newClaimId");
            }
          }}
        >
          {claims.map((c) => (
            <option key={c.claimId} value={c.claimId}>
              {c.claimShortText}
            </option>
          ))}
          <option value="newClaimId">➕ Add a new claim</option>
        </select>

        {claimId === "newClaimId" && (
          <input
            type="text"
            placeholder="Enter new claim..."
            value={claim}
            onChange={(e) => setClaim(e.target.value)}
          />
        )}
      </div>
      {/* Explanation */}
      <div className="form-line">
        <label>Explanation:</label>
        <textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          rows="3"
          placeholder="Write an explanation of exactly what the Tweets below are saying and how they are an example of the claim above."
        />
      </div>

      {/* --- DYNAMIC INPUT FIELDS BASED ON viewMode --- */}
      {viewMode === "themUs" && (
        <>
          <div className="form-line">
            <label>Them Tweet IDs (comma-separated):</label>
            <input
              type="text"
              value={themTweets}
              onChange={(e) => setThemTweets(e.target.value)}
              placeholder="1234567890, 2345678901"
            />
          </div>

          <div className="form-line">
            <label>Us Tweet IDs (comma-separated):</label>
            <input
              type="text"
              value={usTweets}
              onChange={(e) => setUsTweets(e.target.value)}
              placeholder="9876543210, 8765432109"
            />
          </div>
        </>
      )}

      {viewMode === "standalone" && (
        <div className="form-line">
          <label>Tweet IDs (comma separated):</label>
          <input
            type="text"
            value={standaloneTweets}
            onChange={(e) => setStandaloneTweets(e.target.value)}
            placeholder="1234567890, 2345678901"
          />
        </div>
      )}

      {viewMode === "thenNow" && (
        <>
          <div className="form-line">
            <label>Then Tweet IDs (comma-separated):</label>
            <input
              type="text"
              value={thenTweets}
              onChange={(e) => setThenTweets(e.target.value)}
              placeholder="1234567890, 2345678901"
            />
          </div>

          <div className="form-line">
            <label>Now Tweet IDs (comma-separated):</label>
            <input
              type="text"
              value={nowTweets}
              onChange={(e) => setNowTweets(e.target.value)}
              placeholder="9876543210, 8765432109"
            />
          </div>
        </>
      )}


      <img
        src="./images/tweetid.png"
        alt="Where to find TweetIds"
        className="form-image"
      />

      {/* Live Preview */}
      <div className="preview">
        <h2>Live Preview</h2>
        <Preview previewData={previewData} viewMode={ viewMode } />
      </div>

      {/* Send email section */}
      <div className="json-output">
        <h3>Copy & Paste This JSON Into Email to WSox1235@aol.com:</h3>

        <button className="copy-json-btn" onClick={handleCopyJson}>
          {copied ? "Copied!" : "Copy JSON"}
        </button>

        <pre className="json-box">
          {JSON.stringify(outputJson, null, 2)}
        </pre>
      </div>



    </div>
  );
}

export default SubmitPage;