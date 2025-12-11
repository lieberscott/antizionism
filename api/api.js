// // import * as fetch from "node-fetch";
// import { serverUrl } from "./serverConstants";


// /**
//   * @summary fetch the Example records for a given month when user chooses a date or scrolls the months
//   * @param {string} authToken identifier for user
//   * @param {string} dateString yyyy-mm-dd for the date and month to search
//   * @param {boolean} summaryOnly whether to only get month's summary data or to get full records for each day
// */
// export const fetchMonth = async (dateString, summaryOnly, keywordId, claimId, findNext, findPrev, findFirst) => {
//   const url = `${serverUrl}/fetch_month`;
//   try {
//     const responseData = await fetch(url, {
//       headers: {
//         "Content-Type": "application/json"
//       },
//       method: "POST",
//       body: JSON.stringify({ dateString, summaryOnly, keywordId, claimId, findNext, findPrev, findFirst })
//     });

//     let json = await responseData.json();
    
//     if (json.error) {
//       console.log("error")
//       return { error: true };
//     }

//     return json;

//   } catch (error) {
//     return { errors: [error] };
//   }
// };



// /**
//   * @summary fetch the next Example when the user presses the "View next" button
//   * @param {string} authToken identifier for user
//   * @param {string} dateString yyyy-mm-dd for the date greater-than to search
//   * @param {boolean} summaryOnly whether to only get month's summary data or to get full records for each day
//   * @param {string} keywordId keywordId or null
//   * @param {string} claimId claimId or null
//   * @param {boolean} findNext true if looking forward for next example, false if looking for previous example
// */
// export const fetchNext = async (dateString, summaryOnly, keywordId, claimId, findNext, findPrev) => {
//   const url = `${serverUrl}/fetch_next`;
//   try {
//     const responseData = await fetch(url, {
//       headers: {
//         "Content-Type": "application/json"
//       },
//       method: "POST",
//       body: JSON.stringify({ dateString, summaryOnly, keywordId, claimId, findNext, findPrev })
//     });

//     let json = await responseData.json();

//     if (json.noTarget) {
//       console.log("No target");
//       return { noTarget: true };
//     }
    
//     if (json.error) {
//       console.log("error")
//       return { error: true };
//     }

//     return json;

//   } catch (error) {
//     return { errors: [error] };
//   }
// };



// /**
//   * @summary user-generated Example submission
//   * @param {string} authToken identifier for user
//   * @param {string} claimId
//   * @param {string} explanation user-generated explanation on what this Example is and how it demonstrates the claim
//   * @param {array} themTweets [{ id: "tweetId1"}, { id: "tweetId2"}, ... ]
//   * @param {array} usTweets [{ id: "tweetId1"}, { id: "tweetId2"}, ... ]
// */
// export const submitExample = async (claimId, claimText, explanation, themTweets, usTweets) => {
//   const url = `${serverUrl}/submit_example`;
//   try {
//     const responseData = await fetch(url, {
//       headers: {
//         "Content-Type": "application/json"
//       },
//       method: "POST",
//       body: JSON.stringify({ claimId, claimText, explanation, themTweets, usTweets })
//     });

//     let json = await responseData.json();
    
//     if (json.error) {
//       console.log("error")
//       return { error: true };
//     }

//     return json;

//   } catch (error) {
//     return { errors: [error] };
//   }
// };

