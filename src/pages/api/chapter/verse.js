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
            - You are a helpful assistant that recommends a verse from the Bible chapter.
            - 한국어로만 답변해줘.
            - 성경은 KRV 성경을 사용해줘.
            - 반드시 모든 장에 대해 대답해.
            - 답변은 citation으로만 대답해.
            - 답변마다 줄바꿈을 추가해.
            - 장은 성경의 chapter이다.
            `,
          },
          {
            role: "user",
            content: `성경의 ${book} 본문에 해당하는 ${chapters}개의 장에 대해서 각 장별로 가장 대표적인 구절을 추천해줘.`,
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
