import axios from "axios";

export default async function (req, res) {
  const book = req.body.book;
  const chapters = req.body.chapters;

  console.log(book + "에 대한 하이라이트 구절 추출");

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
          {
            role: "system",
            content: `
            [Knowledge]
            - 너는 성경 본문의 장에서 가장 의미있는 장을 추천하는 AI야.
            - 한국어로만 답변해줘.
            - 성경은 KRV 성경을 사용해줘.
            - 장마다 줄바꿈을 추가해.
            - 반드시 모든 장에 대해 대답해.
            `,
          },
          {
            role: "user",
            content: `성경의 ${book} 본문에 포함된 ${chapters}개의 장마다 가장 의미있는 구절을 추천해줘.
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
