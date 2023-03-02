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
  
  let knowledge = "It was a normal day. A phone rang during the lunch break, all IT staff went out except a late-30s man sitting in front of his computer surfing for the Internet. When he picked up the call, he found that a foreigner was on the line inquiring for the information relevant to his IT department. Despite being utterly baffled, he tried his best to handle the call until the end. After that, he rushed to the operator and asked for the reason why she transferred that call to the IT department. The operator gently replied, Nobody can speak English and IT staff are supposed to speak more fluent. The common IT guy went back to his seat and started thinking. All high-ranking human source, marketing, and finance managers were still in the office and did not go out for lunch yet. Some managers even achieved a higher education in developed countries. The question was why they did not take that call? From what happened, this enlightened him on a couple of things. Firstly, he could speak average English and would like to cultivate this skill. The second thing was no matter how proficient his English skill is, his company will never value it. There was less occasion to polish his English if he was still complacent with the status quo. He should belong somewhere else. Yes, that IT man was me and that was the first time I began looking for an opportunity elsewhere. ATA IT employees looking at camera while enjoy with lunch By convention, in terms of career certainty, most Thais, especially middle class, of my age were taught to pursue their career as a state officer or employee in any private company listed on the SET (Stock Exchange of Thailand). Of course, my previous company is one on the list, and quitting this decent job seemed to be an absurd move. But, eventually, my passion for advancing my English to the next level was stronger. Weighting between job security and an educational journey was a bit imbalanced. Hurriedly, I prepared and rewrote my resume, this time, aiming only for international companies. After a short time, ATA-IT called me for an interview. In the first place, I was still reluctant and thought that I would just try to gain experiences for being interviewed by a foreigner. But when the HR manager elaborated about the days off, I was thrilled. The 14 days of annual leave is simply unheard of in Thai companies and, if that is not tempting enough, gaining one more every year of service. A trembling voice echoed in my hollow head, what have I been doing for my whole life? Compared to my employers at the time, they started with 6 days annual leave and an addition day for every 3 years. I swore an oath, “In the name of the (recreational) god, I must be a part of this tribe, whatever it takes”. What I quickly learnt was that most international companies offer a huge amount (in my view at that time) of vacation. Time is precious so having more holidays is a big thing for a salary man. Side view on ATA IT open space office with comfortabl workplaces Soon enough, I became an ATA-ITs employee as I aspired to be. For the first weeks and months, I found myself in a strange place where bureaucratic red tape is less, and time flexibility is more. No one keeps vigil on your attendance but your delivery. You could even go out to play Badminton or jog in the park nearby and back to work if that helps your work life. With various types of working areas, roaming around the office, between 2 floors, is also doable. You are not locked up permanently in a specific seat for your entire tenure. It has been 4 years since I joined ATA-IT. I can not make conclusion that I made the right decision for venturing with ATA-IT because I still do not know the answer. People are varied and have different expectations. I left my previous company not because it was an unpleasant place, but it just could not serve my appetite. A load of days off, business trips to Canada, and working from home are an unprecedented and invaluable experiences that would never be attainable at my SET-listed company. Maybe I was foolish for choosing my current path other than life security. What I have learned from getting older is sometimes you must learn to unlearn the old sayings and ways of working. Career certainty may be only a myth that needs to be forgotten because the only certain thing is uncertainty.";

  const basePromptPrefix = `This is a conversation between Gaan and a stranger.\nRelevant information that Gaan knows:\n${knowledge}`;
  console.log(basePromptPrefix);
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${basePromptPrefix}\n\nStranger:${message}\n\Gaan:`,
    max_tokens: 100,
    temperature: 0.7,
  });
  res.json({
    message: response.data.choices[0].text,
  });
})

// Get Models Route

// Start the server
app.listen(port, () => {
  console.log(`server running`);
});

module.exports = app;
