import React, { useState, useEffect, useRef } from "react";
import "../../styles/stylesheet.css"; // import the CSS file

import CalendarComponent from "../calendar/Calendar.jsx";
import Claims from "../claims/Claims.jsx";
import TweetCarousel from "./TweetCarousel.jsx";

import { fetchMonth, fetchNext } from "../../data/query";

/*

1. Collapse all rhetoric folders into single "rhetorical games" file (?)

2. Add manual Tweet cards (not using the Twitter widget and TweetIds, but having all the data stored in a database) and then displaying it

*/


const defaultDayData = [{ usTweets: [ { id: "id1" }], themTweets: [{id: "id1"}], claimText: "", text: "", keywordIds: [], claimIds: [], claims: [] }];


// Main Page
export default function MainPage() {

  const debounceRef = useRef(null);

  const [viewState, setViewState] = useState({
    displayedDate: "2023-10-07",
    summaryData: {},
    monthlyData: {},
    dayData: {},
    currentIndex: 0,
    calendarDate: new Date("2023-10-07"),
    usTweetsIndex: 0,
    themTweetsIndex: 0,
  })
  const [keywordId, setKeywordId] = useState(null);
  const [claimId, setClaimId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    findNextExample(viewState.displayedDate, true, false);
  }, []);

  const onDateSelect = (_dateString, _getNextMonth) => {

    if (_getNextMonth) {
      const responseData =  fetchNext(_dateString, keywordId, claimId, searchText);
      handleNextResponse(responseData);
    }

    else {
      const newDayData = viewState.monthlyData[_dateString] ? viewState.monthlyData[_dateString] : defaultDayData;
  
      setViewState(prev => ({
        ...prev,
        dayData: newDayData,
        displayedDate: _dateString,
        calendarDate: new Date(_dateString),
        themTweetsIndex: 0,
        usTweetsIndex: 0,
        currentIndex: 0
      }));
    }
  }

const findNextExample = (_dateString, _findNext, _findPrev) => {

    const [hasExample, newDate] = checkForNextDatesData(_findNext); // if we want next, findNext is true; else findNext is false (and we want previous)

    if (_findNext) {
      if (viewState.currentIndex < viewState.dayData.length - 1) {
        setViewState(prev => ({
          ...prev,
          themTweetsIndex: 0,
          usTweetsIndex: 0,
          currentIndex: prev.currentIndex + 1
        }));
      }
      else if (hasExample) {
        setViewState(prev => ({
          ...prev,
          dayData: prev.monthlyData[newDate],
          displayedDate: newDate,
          themTweetsIndex: 0,
          usTweetsIndex: 0,
          currentIndex: 0,
          calendarDate: new Date(newDate)
        }));
      }
      else {
        const responseData =  fetchNext(_dateString, keywordId, claimId, searchText, _findNext, _findPrev);
        handleNextResponse(responseData);
      }
    }

    else if (_findPrev) {
      if (viewState.currentIndex > 0) {
        setViewState(prev => ({
          ...prev,
          themTweetsIndex: 0,
          usTweetsIndex: 0,
          currentIndex: prev.currentIndex - 1
        }));
      }
      else if (hasExample) {
        setViewState(prev => ({
          ...prev,
          dayData: prev.monthlyData[newDate],
          displayedDate: newDate,
          themTweetsIndex: 0,
          usTweetsIndex: 0,
          currentIndex: 0,
          calendarDate: new Date(newDate)
        }));
      }
      else {
        const responseData =  fetchNext(_dateString, keywordId, claimId, searchText, _findNext, _findPrev);
        handleNextResponse(responseData);
      }
    }
  }


  const handleNextResponse = (_responseData) => {
    if (_responseData.noTarget) {
      // window.alert(`No results. Try a different search criteria.`);
    }
    else {

      const newDate = _responseData.nextDate; // both next or previous dates, depending on which direction we're going
      const newData = _responseData.data[newDate] ? _responseData.data[newDate] : defaultDayData;

      setViewState(prev => ({
        ...prev,
        dayData: newData,
        summaryData: _responseData.summaryData,
        monthlyData: _responseData.data,
        displayedDate: newDate,
        themTweetsIndex: 0,
        usTweetsIndex: 0,
        currentIndex: 0,
        calendarDate: new Date(newDate)
      }));
     
      if (!loaded) {
        setLoaded(true);
      }
    }
  }

  // _claimIdSelected will be a string or "" (if none)
  const onClaimSelect = (_claimIdSelected) => {
    const newClaimId = _claimIdSelected === "" ? null : _claimIdSelected;
    const findNext = true;
    const findPrev = false;
    const responseData =  fetchNext(viewState.displayedDate, keywordId, newClaimId, searchText, findNext, findPrev);
    setClaimId(newClaimId);
    handleNextResponse(responseData);
  }

  const fetchSearchResults = (text) => {
    const findNext = true;
    const findPrev = false;
    const [year, month] = viewState.displayedDate.split("-");
    const responseData = fetchNext(`${year}-${month}-01`, keywordId, claimId, text, findNext, findPrev);
    handleNextResponse(responseData);
  }

  // next is a boolean of whether you're checking for the next date or previous date
  const checkForNextDatesData = (next) => {
    const dates = Object.keys(viewState.monthlyData).sort(); // sorted chronologically (YYYY-MM-DD format)
    const index = dates.indexOf(viewState.displayedDate);

    if (next) {
      const hasNext = index < dates.length - 1;
      const nextDate = hasNext ? dates[index + 1] : null;
      return [hasNext, nextDate];
    }
    else {
      const hasPrev = index > 0;
      const prevDate = hasPrev ? dates[index - 1] : null;
      return [hasPrev, prevDate];
    }
  }


  const handleThemTweetsIndex = (index) => {
    setViewState(prev => ({
      ...prev,
      themTweetsIndex: index
    }));
  }

  const handleUsTweetsIndex = (index) => {
    setViewState(prev => ({
      ...prev,
      usTweetsIndex: index
    }));
  }


  if (!loaded) {
    return <div style={{ color: "white" }}>Loading ...</div>
  }

  return (
    <div className="p-6 space-y-8">

      <CalendarComponent onDateSelect={onDateSelect} displayedDate={ viewState.displayedDate } summaryData={ viewState.summaryData } calendarDate={ viewState.calendarDate } />
      
      <Claims onClaimSelect={ onClaimSelect } />

      <div>
        <div className="search-container">
          <input
            className="search-input"
            type="text"
            placeholder="Search…"
            value={searchText}
            onChange={(e) => {
              const value = e.target.value;
              setSearchText(value);

              // CLEAR previous timer
              if (debounceRef.current) {
                clearTimeout(debounceRef.current);
              }

              // SET new debounce
              debounceRef.current = setTimeout(() => {
                fetchSearchResults(value);
              }, 250); // 250ms debounce
            }}
          />
        </div>

        {(() => {
          const claimsArr = viewState.dayData[viewState.currentIndex].claims;

          const selectedClaim =
            claimId
              ? claimsArr.find((item) => item.claimId === claimId)
              : claimsArr.find((item) => item.claimShortText) || null;

          const shortText = selectedClaim?.claimShortText || "";
          const fullText  = selectedClaim?.claimText || "";

          return (
            <p className="font-bold text-gray-700">
              {shortText}{shortText ? ": " : ""}{fullText}
            </p>
          );
        })()}
      </div>

      <div>
        <p className="font-bold text-gray-700">{new Date(`${viewState.displayedDate}T00:00:00Z`).toLocaleString("default",{
          month: "long",
          day: "numeric",
          year: "numeric",
          timeZone: "UTC"
        })}:
          <span style={{ marginLeft: "10px", marginRight: "10px" }}>{viewState.dayData[0].text === "" ? "0" : viewState.currentIndex + 1} of {viewState.dayData[0].text === "" ? "0" : viewState.dayData.length}</span>
          <button onClick={() => findNextExample(viewState.displayedDate, false, true)}>&lt;</button>
          <button onClick={() => findNextExample(viewState.displayedDate, true, false)}>&gt;</button>
        </p>
        {/* <p className="font-bold text-gray-700">{dayData[currentIndex].keywordIds.map((item, i) => <span key={item}>{item}, </span>)}</p> */}
        <p className="pl-6 text-gray-700">{ viewState.dayData[viewState.currentIndex].text }</p>
        { viewState.dayData[viewState.currentIndex].source ? <p className="pl-6"><a href={viewState.dayData[viewState.currentIndex].sourceLink}>{viewState.dayData[viewState.currentIndex].sourceLink}</a></p> : []}
      </div>

      <div className="flex-row">
        
        { viewState.dayData[viewState.currentIndex].standaloneTweets && viewState.dayData[viewState.currentIndex].standaloneTweets.length ?
        
          <div className="flex-1">
            <p className="font-bold mb-2 text-gray-700">Proof:</p>
            <TweetCarousel tweets={viewState.dayData[viewState.currentIndex].standaloneTweets} displayedDate={ viewState.displayedDate } currentIndex={ viewState.currentIndex } tweetIndex={viewState.themTweetsIndex} handleTweetsIndex={handleThemTweetsIndex} />
          </div>

          :

          <div className="flex-row">
            <div className="flex-1">
              <p className="font-bold mb-2 text-gray-700">{viewState.dayData[viewState.currentIndex].thenVsNowFormat ? "Then" : "Them"}:</p>
              <TweetCarousel
                tweets={viewState.dayData[viewState.currentIndex].thenVsNowFormat ? viewState.dayData[viewState.currentIndex].thenTweets : viewState.dayData[viewState.currentIndex].themTweets}
                displayedDate={ viewState.displayedDate }
                currentIndex={ viewState.currentIndex }
                tweetIndex={viewState.themTweetsIndex}
                handleTweetsIndex={handleThemTweetsIndex}
              />
            </div>

            <div className="flex-1">
              <p className="font-bold mb-2 text-gray-700">{ viewState.dayData[viewState.currentIndex].thenVsNowFormat ? "Now" : "Us"}:</p>
              <TweetCarousel
                tweets={viewState.dayData[viewState.currentIndex].thenVsNowFormat ? viewState.dayData[viewState.currentIndex].nowTweets : viewState.dayData[viewState.currentIndex].usTweets}
                displayedDate={ viewState.displayedDate }
                currentIndex={ viewState.currentIndex }
                tweetIndex={viewState.usTweetsIndex}
                handleTweetsIndex={handleUsTweetsIndex}
              />
            </div>
          </div>
        }
      </div>
    </div>
  );
}
