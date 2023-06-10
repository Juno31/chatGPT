import { Configuration, OpenAIApi } from "openai";
import axios from "axios";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function (req, res) {
  const API_KEY = process.env.API_KEY;

  const citation = req.body.citation;
  const verse = req.body.verse;
  const count = req.body.count ?? 1;

  console.log(citation + "에 대한 3분 큐티 컨텐츠 생성");

  try {
    const titleOptions = {
      url: "https://api.openai.com/v1/chat/completions",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      data: {
        model: "gpt-3.5-turbo",
        temperature: 1.2,
        n: count,
        messages: [
          {
            role: "user",
            content: `성경 구절 ${citation}에 대한 설교문의 제목을 창의적으로 10개 지어줘. 반드시 KRV(개역한글) 번역본에 맞는 용어를 써줘. KRV 번역본은 다음과 같아: ${verse}`,
          },
        ],
      },
    };

    const explainationOption = {
      url: "https://api.openai.com/v1/chat/completions",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      data: {
        model: "gpt-3.5-turbo",
        temperature: 1,
        n: count,
        messages: [
          {
            role: "user",
            content: `성경 구절 ${citation}이 성경에서 뜻하는 바를 목사 입장에서 최대한 길게 해석해줘. 반드시 KRV(개역한글) 번역본에 맞는 용어를 써줘. KRV 번역본은 다음과 같아: ${verse}`,
          },
        ],
      },
    };

    const messageOption = {
      url: "https://api.openai.com/v1/chat/completions",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      data: {
        model: "gpt-3.5-turbo",
        temperature: 1,
        n: count,
        messages: [
          {
            role: "user",
            content: `성경 구절 ${citation}를 중심으로 목사 입장에서 사람들에게 위로 메시지를 작성해줘. 반드시 KRV(개역한글) 번역본에 맞는 용어를 써줘. KRV 번역본은 다음과 같아: ${verse}`,
          },
        ],
      },
    };

    const selfReflectOption = {
      url: "https://api.openai.com/v1/chat/completions",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      data: {
        model: "gpt-3.5-turbo",
        temperature: 1,
        n: count,
        messages: [
          {
            role: "user",
            content: `성경 구절 ${citation}를 중심으로 간단한 기도문을 써줘. 반드시 KRV(개역한글) 번역본에 맞는 용어를 써줘. KRV 번역본은 다음과 같아: ${verse}`,
          },
        ],
      },
    };

    const prayerOption = {
      url: "https://api.openai.com/v1/chat/completions",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      data: {
        model: "gpt-3.5-turbo",
        temperature: 1,
        n: count,
        messages: [
          {
            role: "user",
            content: `성경 구절 ${citation}를 묵상할 때 생각해볼만한 질문들을 몇가지 제안해줘. 반드시 KRV(개역한글) 번역본에 맞는 용어를 써줘. KRV 번역본은 다음과 같아: ${verse}`,
          },
        ],
      },
    };

    const [title, explaination, message, reflection, prayer] =
      await Promise.all([
        axios(titleOptions),
        axios(explainationOption),
        axios(messageOption),
        axios(selfReflectOption),
        axios(prayerOption),
      ]);

    const payload = {
      title: title?.data.choices,
      explaination: explaination?.data.choices,
      message: message?.data.choices,
      reflection: reflection?.data.choices,
      prayer: prayer?.data.choices,
    };

    res.send(payload);
  } catch (error) {
    console.log(error.response.status);
    if (error.status === 401) {
      res.status(401).send("fail");
    }

    res.status(500).send("fail");
  }
}
