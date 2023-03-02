const { Configuration, OpenAIApi } = require("openai");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const operandClient = require("@operandinc/sdk").operandClient;
const indexIDHeaderKey = require("@operandinc/sdk").indexIDHeaderKey;
const ObjectService = require("@operandinc/sdk").ObjectService;

// Open AI Configuration
const configuration = new Configuration({
  organization: process.env.OPENAI_ORG_KEY,
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);

// Express Configuration
const app = express();
const port = 3080;

app.use(bodyParser.json());
app.use(cors());
app.use(require("morgan")("dev"));

// Routing

// Primary Open AI Route
app.post("/", async (req, res) => {
  const { message } = req.body;
  console.log(message)
  const runIndex = async () => {
    const operand = operandClient(
      ObjectService,
      "6lp0exovccwddoc1mo92gyhrk7sktb1u2c3g",
      "https://api.operand.ai",
      {
        [indexIDHeaderKey]: "pq0c67bu3t0q",
      }
    );

    try {
      const results = await operand.searchWithin({
        query: `${message}`,
        limit: 5,
      });

      if (results) {
        return results.matches.map((m) => `- ${m.content}`).join("\n");
      } else {
        return "";
      }
    } catch (error) {
      console.log(error);
    }
  };


  let operandSearch = await runIndex(message);

  const basePromptPrefix = `This is a conversation between Nacha and a stranger.\nRelevant information that Nacha knows:\n${operandSearch}`;
  console.log(basePromptPrefix);
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${basePromptPrefix}\n\nStranger:${message}\n\nNacha:`,
    max_tokens: 256,
    temperature: 0.7,
  });
  res.json({
    message: response.data.choices[0].text,
  });
});

// Get Models Route

// Start the server
app.listen(port, () => {
  console.log(`server running`);
});

module.exports = app;
