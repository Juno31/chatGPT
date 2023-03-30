import { Configuration, OpenAIApi } from "openai";
import axios from "axios";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function (req, res) {
  const book = req.body.book;
  const chapters = req.body.chapters;

  console.log(book + "에 대한 제목 추출");

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
        temperature: 0.5,
        messages: [
          // {
          //   role: "system",
          //   content: `
          //   [Knowledge]
          //   - 너는 성경의 장의 핵심 내용을 요약해서 제목을 추출하는 AI이다.
          //   - 무조건 한국어로만 답해야한다.
          //   - 요약은 핵심적인 내용이 반드시 포함되어야한다.
          //   - 대답은 다음 형식으로 대답해야한다. 1장: 요약 내용
          //   - 제목은 20자 이상이어야한다.
          //   - 각 장의 요약된 제목 끝에는 줄바꿈이 무조건 추가되어야한다.
          //   - 성경은 KRV 성경을 사용해야한다.
          //   `,
          // },
          {
            role: "system",
            content: `
            [Knowledge]
            - 너는 성경 내용을 요약해서 창의적으로 제목을 지어주는 AI야.
            - 한국어로만 답변해줘.
            - 성경은 KRV 성경을 사용해줘.
            - 제목은 무조건 15자 이상으로 만들어야해.
            - 장은 성경의 chapter이다.
            - 장마다 줄바꿈을 추가해.
            - 반드시 모든 장에 대해 대답해.
            `,
          },
          {
            role: "user",
            content: `성경의 ${book}에 포함된 ${chapters}개의 장마다 창의적인 제목을 지어줘.
            `,
          },
        ],
      },
    };
    console.time(chapters);
    const response = await axios(options);
    console.timeEnd(chapters);

    const data = response.data.choices;
    res.send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send("fail");
  }
}
