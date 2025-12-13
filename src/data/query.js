// src/data/query.js

import { allExamples, claimMap, examplesByClaimId } from "./db";

/* -------------------------------------------------------
 * HELPER FUNCTIONS
 * -----------------------------------------------------*/

/** Convert "YYYY-MM-DD" → Date object */
function toDate(d) {
  return new Date(d + "T00:00:00");
}

/** Returns true if example is in a given year + month */
function isInMonth(ex, year, month) {
  const [y, m] = ex.date.split("-").map(Number);
  return y === year && m === month;
}

/** Enrich an example with claim text data */
function enrichExample(ex) {
  return {
    ...ex,
    claims: ex.claimIds.map(id => ({
      claimId: id,
      claimText: claimMap[id]?.claimText || null,
      claimShortText: claimMap[id]?.claimShortText || null
    }))
  };
}

/* -------------------------------------------------------
 * OPERATION 1:
 * FIND EXAMPLES WITH OPTIONAL FILTERS (month, claimIds, keywordId)
 * -----------------------------------------------------*/

export function getData(
  dateString,
  claimId,
  keywordId,
  searchText
) {
  let results = [...allExamples];

  const [year, month] = dateString.split("-").map(Number);

  // Filter by month
  if (year && month) {
    results = results.filter(ex => isInMonth(ex, year, month));
  }

  // Filter by all claimIds
  if (claimId) {
    results = results.filter(ex => ex.claimIds?.includes(claimId));
  }

  // Filter by keywordId
  if (keywordId) {
    results = results.filter(ex => ex.keywordIds?.includes(keywordId));
  }

  // Filter by keywordId
  if (searchText) {
    results = results.filter(ex => JSON.stringify(ex).toLowerCase().includes(searchText));
  }

  return results;
}

/* -------------------------------------------------------
 * OPERATION 2:
 * NEXT / PREVIOUS EXAMPLE (with optional filters)
 * -----------------------------------------------------*/

const sortedByDate = [...allExamples].sort(
  (a, b) => toDate(a.date) - toDate(b.date)
);

export function getNext(dateString, filter = () => true) {
  // find the earliest example after this date that matches filter
  for (const ex of sortedByDate) {
    if (ex.date >= dateString && filter(ex)) {
      return ex;
    }
  }
  return null;
}

export function getPrev(dateString, filter = () => true) {
  for (let i = sortedByDate.length - 1; i >= 0; i--) {
    const ex = sortedByDate[i];
    if (ex.date <= dateString && filter(ex)) {
      return ex;
    }
  }
  return null;
}


/* -------------------------------------------------------
 * OPERATION 3:
 * SUMMARY: COUNT EXAMPLES PER DATE BY MONTH
 * -----------------------------------------------------*/

function getMonthlySummary(
  dateString,
  claimId,
  keywordId,
  searchText
) {
  if (!dateString) {
    throw new Error("Requires date 'YYYY-MM-DD'");
  }

  // Reuse your existing filters (keeps logic central + consistent)
  const filtered = getData(
    dateString,
    claimId,
    keywordId,
    searchText
  );

  // Group counts by date
  return filtered.reduce((acc, ex) => {
    acc[ex.date] = (acc[ex.date] || 0) + 1;
    return acc;
  }, {});
}


/* -------------------------------------------------------
 * OPERATION 4:
 * GROUP BY DATE + ENRICH WITH CLAIM TEXT
 * (This is your big custom operation)
 * -----------------------------------------------------*/

function getNormalizedData(
  dateString,
  claimId,
  keywordId,
  searchText
) {
  // Start with basic filters
  let results = getData(dateString, claimId, keywordId, searchText);

  // Enrich with claim text
  const enriched = results.map(enrichExample);

  // Group by date
  return enriched.reduce((acc, ex) => {
    if (!acc[ex.date]) acc[ex.date] = [];
    acc[ex.date].push(ex);
    return acc;
  }, {});
}

/* -------------------------------------------------------
 * OPTIONAL CONVENIENCE FILTERS
 * -----------------------------------------------------*/

function makeFilter({ claimId = null, keywordId = null, searchText = null } = {}) {
  const search = searchText ? searchText : null;

  return function (ex) {
    // Filter by claimId (if provided)
    if (claimId && !(ex.claimIds ?? []).includes(claimId)) {
      return false;
    }

    // Filter by keywordId (if provided)
    if (keywordId && !(ex.keywordIds ?? []).includes(keywordId)) {
      return false;
    }

    if (search) {
      const blob = JSON.stringify(ex).toLowerCase();
      return blob.includes(search);
    }


    return true; // passes all requested filters
  };
}

function getNextFiltered(dateString, { claimId = null, keywordId = null, searchText = null } = {}) {
  return getNext(dateString, makeFilter({ claimId, keywordId, searchText }));
}

function getPrevFiltered(dateString, { claimId = null, keywordId = null, searchText = null } = {}) {
  return getPrev(dateString, makeFilter({ claimId, keywordId, searchText }));
}

function shiftDate(dateString, direction = "increment") {
  const [year, month, day] = dateString ? dateString.split("-").map(Number) : "1900-01-01";

  // Convert direction to +1 or -1
  const delta = direction === "decrement" ? -1 : 1;

  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() + delta);

  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");

  return `${y}-${m}-${dd}`;
}



/* -------------------------------------------------------
 * API-REPRODUCED FUNCTIONS (MADE BY ME, NOT CHATGPT)
 * -----------------------------------------------------*/

/** Get any month's data */
export const fetchMonth = (dateString, keywordId, claimId, searchQuery = "", findNext, findPrev) => {

  const searchText = searchQuery === "" ? null : searchQuery.trim().toLowerCase();

  const summaryData = getMonthlySummary(dateString, claimId, keywordId, searchText);
  const data = getNormalizedData(dateString, claimId, keywordId, searchText);

  return { data, summaryData }
};


/** Get next or previous month's data */
export const fetchNext = (dateString, keywordId, claimId, searchQuery, findNext, findPrev) => {

  console.log("dateString 2 : ", dateString);

  console.log("claimId : ", claimId);

  console.log("findNext : ", findNext);
  console.log("findPrev : ", findPrev);

  const searchText = searchQuery === "" ? null : searchQuery.trim().toLowerCase();

  // If findNext, increment the date by +1, because there may be days with 2+ examples, so it could return the "next" example on the same day,
  // On the front end, it already accounts for that (backend ordering may be different than front end)
  // so we increment the day by +1 to ensure the "next" or previous example isn't on the same day
  // Same logic applies to findPrev examples, decrement the day -1
  let newDateString = findNext ? shiftDate(dateString, "incremeent"): findPrev ? shiftDate(dateString, "decrement") : dateString;

  const [y, m, d = "01"] = newDateString.split("-");
  newDateString = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;

  console.log("newDateString 3 : ", newDateString);

  // When arrowing forward or backward on the Calendar, you want the next (or previous) month, even if they have no matching examples
  if (!findNext && !findPrev) {
    const summaryData = getMonthlySummary(dateString, claimId, keywordId, searchText);
    const data = getNormalizedData(dateString, claimId, keywordId, searchText);

    // This line of code ensures that if an actual Example exists for the given month, it will display on the front end rather than having it blank
    const returnedDate = Object.keys(summaryData).length ? Object.keys(summaryData)[0] : newDateString;

    console.log("returnedDate : ", returnedDate);

    return { data, summaryData, nextDate: returnedDate }
  }

  // Get next or previous example
  let newExample;
  
  if (findNext) {
    newExample = getNextFiltered(newDateString, { claimId, keywordId, searchText });
    if (!newExample) {
      newExample = getNextFiltered("1700-01-01", { claimId, keywordId, searchText }); // wraparound
    }
  }
  else {
    newExample = getPrevFiltered(newDateString, { claimId, keywordId, searchText });
    if (!newExample) {
      newExample = getPrevFiltered("2099-01-01", { claimId, keywordId, searchText }); // wraparound
    }
  }

  if (!newExample) {
    return { noTarget: true }
  }

  // Extract the date, then get the data for that month
  const newDate = newExample.date;

  const summaryData = getMonthlySummary(newDate, claimId, keywordId, searchText);
  const data = getNormalizedData(newDate, claimId, keywordId, searchText);

  return { data, summaryData, nextDate: newDate }

};