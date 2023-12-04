const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");
const authenticate = require("./src/middleware/authenticate");
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const delay = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

app.get("/check", async (req, res) => {
  return res.status(200).json({ message: "OK" });
});
app.post("/chat", authenticate.auth, async (req, res) => {
  try {
    const { input } = req.body;

    const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });
    const assistant = await openai.beta.assistants.retrieve(
      "asst_VaY1zWEmlw7bbDC8uuaEBpYP"
    );
    const thread = await openai.beta.threads.create();
    const message = await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: `Please read the json filed I provided to you. ${input}`,
    });
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
    });

    while (run.status !== "completed") {
      const targetRun = await openai.beta.threads.runs.retrieve(
        thread.id,
        run.id
      );
      run.status = targetRun.status;
      if (
        run.status === "cancelling" ||
        run.status === "cancelled" ||
        run.status === "failed" ||
        run.status === "expired"
      ) {
        throw new Error("openai failed to give response");
      }
      await delay(3000);
    }

    const messages = await openai.beta.threads.messages.list(thread.id);
    const assistantMessage = messages.body.data.find(
      (message) => message.role === "assistant"
    );
    if (assistantMessage) {
      return res
        .status(200)
        .json({ message: assistantMessage.content[0].text.value });
    } else {
      return res
        .status(404)
        .json({ message: "Can not find assistant message" });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

app.listen(8000, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:8000`);
});
