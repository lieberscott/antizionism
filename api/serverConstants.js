// old server
// export const serverUrl = (() =>{
//   return {
//       // "development": "http://localhost:3000",
//       "development": "http://192.168.0.12:3000",
//       "test": "http://192.168.0.12:3000",
//       // "test": "http://localhost:3000",
//       "production": "https://www.rumbledebate.com"
//   }[process.env.NODE_ENV];
// })();


// node server
export const serverUrl = (() =>{
  return {
      // "development": "http://localhost:3000",
      "development": "http://localhost:5000",
      "test": "http://192.168.0.12:3000",
      // "test": "http://localhost:3000",
      "production": "https://rumbledebate.herokuapp.com"
  }[process.env.NODE_ENV];
})();