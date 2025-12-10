const express = require('express');

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.sendFile(__dirname + '/index.html');
  // return res.json({ ok: true });
});

app.get("/test", (req, res) => {
  res.sendFile(__dirname + '/index.html');
  // return res.json({ test: true });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);

});
