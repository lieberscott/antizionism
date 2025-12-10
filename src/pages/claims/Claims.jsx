import React, { useState } from "react";
import "../../styles/claimsStyles.css"; // import the CSS file
import { claims } from "../../data/db.js";

export default function Claims({ onClaimSelect }) {
  const [selectedClaim, setSelectedClaim] = useState({});

  const handleSelect = (claim) => {
    if (selectedClaim.claimId !== claim.claimId) {
      setSelectedClaim(claim);
      onClaimSelect(claim.claimId);
    }
  };

  const handleRemove = () => {
    const newSelected = {};
    setSelectedClaim(newSelected);
    onClaimSelect("");
  };

  return (
    <div className="claim-container">
      <div className="claim-selector-scroll-wrapper">
        <div className="claims-list">
          {claims.map((claim, index) => (
            <button
              key={index}
              onClick={() => handleSelect(claim)}
              className={`claim-button ${
                selectedClaim.claimId === claim.claimId ? "active" : ""
              }`}
            >
              {claim.claimShortText ? claim.claimShortText : claim.keyword }
            </button>
          ))}
        </div>
      </div>
      <div>
        {Object.keys(selectedClaim).length > 0 && (
          <div className="selected-claims-box">
            <div className="claim-bubble">
              {selectedClaim.claimShortText}
              <span className="remove-btn" onClick={() => handleRemove()}>
                ✕
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
