import "./moduleAliases";
import express from "express";

const app = express();

app.use(express.static("public"));
app.use(express.json());

app.get("/events", async function (req, res) {
  console.log("Got /events");
  res.set({
    "Cache-Control": "no-cache",
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
  });
  res.flushHeaders();
  res.write("retry: 1000\n\n");
  let count = 0;
  const id = setInterval(() => {
    console.log(`Emit: ${id}`, ++count);
    res.write(`data: ${count}\n\n`);
  }, 1000);
  const { socket } = res;
  if (socket) {
    socket.on("end", () => {
      console.log(`Disconnect: ${id} `);
      clearInterval(id);
      res.end();
    });
  }
});
app.listen(3001, () => {
  console.log("listening http://localhost:3001");
});
