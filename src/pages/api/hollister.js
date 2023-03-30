import { Configuration, OpenAIApi } from "openai";
import axios from "axios";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  const context = req.body.context;
  const mood = req.body.mood;

  try {
    const options = {
      url: "https://api.openai.com/v1/chat/completions",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer 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",
      },
      data: {
        model: "gpt-3.5-turbo",
        temperature: 1.5,
        messages: [
          {
            role: 'system',
            content:
              '- We are in korea now.\n' +
              '\n' +
              `- reply to me like a ${mood} pastor as long as possible.`
          },
          {
            role: 'user',
            content: `${context}, Reply in English.`,
          },
        ],
      },
    };

    const response = await axios(options);
    
    const translateOption = {
      url: "https://api.openai.com/v1/chat/completions",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer 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",
      },
      data: {
        model: "gpt-3.5-turbo",
        temperature: 0.3,
        messages: [
            {
              role: 'system',
              content:
                "- You must translate 'sister' to '자매님'\n" +
                "- You must translate 'brother' to '형제님'\n",
            },
            {
              role: 'user',
              content: `${response.data.choices[0].message.content.replace(
                /As a pastor,|As a pastor/gi,
                '',
              )} 이 문장을 한국어로 자연스럽게 번역해줘`,
            },
          ],
      },
    };

    const translateResponse = await axios(translateOption);
    const data = translateResponse.data.choices;
    res.send(data);

  } catch (error) {
    console.log(error);
    res.status(500).send("fail");
  }
}
