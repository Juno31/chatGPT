import React, { useEffect, useState } from "react";
import axios from "axios";

//constants
import BOOK_NAME from "constants/book";
import {
  CitationRegExp,
  CitationRegExpSecondary,
  CitationRegExpTertiary,
  CitationRegExpTertiary2,
} from "regex";

function Daily() {
  const [citation, setCitation] = useState("");
  const [verse, setVerse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [content, setContent] = useState([]);

  const createContent = async function () {
    setIsLoading(true);
    setContent([]);
    try {
      const options = {
        url: `/api/daily`,
        method: "POST",
        data: {
          citation: citation,
          verse: verse,
          count: 5,
        },
      };
      const response = await axios(options);

      const title = response.data.title;
      const explaination = response.data.explaination;
      const message = response.data.message;
      const prayer = response.data.prayer;
      const reflection = response.data.reflection;

      let contentObj = [];

      for (let i = 0; i < title?.length; i++) {
        contentObj.push({
          title: title[i],
          explaination: explaination[i],
          message: message[i],
          prayer: prayer[i],
          reflection: reflection[i],
        });
      }

      console.log(contentObj);

      setContent((current) => [...contentObj]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onCitationChange = function (e) {
    setCitation(e.target.value);
  };

  const onVerseChange = function (e) {
    setVerse(e.target.value);
  };

  return (
    <div className="min-w-full flex flex-col items-center">
      <div className="mt-20" />
      <h1 className="text-2xl font-bold">3분 큐티 컨텐츠 추출하기</h1>
      <div className="mt-9" />
      <section className="flex flex-col gap-1">
        <p className="text-sm font-semibold">{"성경 구절"}</p>
        <input
          className="border focus:border-blue-500 border-LightGrey px-6 py-3 min-w-[300px] rounded-lg"
          onChange={onCitationChange}
        />
      </section>
      <div className="mt-3" />
      <section className="flex flex-col gap-1">
        <p className="text-sm font-semibold">{"성경 본문"}</p>
        <input
          className="border focus:border-blue-500 border-LightGrey px-6 py-3 min-w-[300px] rounded-lg"
          onChange={onVerseChange}
        />
      </section>
      <div className="mt-4" />
      <button
        onClick={createContent}
        className="bg-blue-500 px-6 py-4 min-w-[300px] text-white rounded-lg disabled:bg-LightGrey disabled:cursor-not-allowed"
        disabled={!citation || !verse}
      >
        {isLoading ? "추출..." : "추출하기"}
      </button>
      <div className="mt-10" />
      <div className="flex flex-col w-full px-12 gap-6">
        {content.length !== 0 &&
          content?.map(function (content, index) {
            return (
              <div className="flex flex-col">
                <h1 className="font-semibold text-lg">{index + 1}번 추출</h1>
                <ContentItem content={content} key={index} />
              </div>
            );
          })}
      </div>
      <div className="mt-10" />
    </div>
  );
}

export default Daily;

const ContentItem = function ({ content }) {
  const title = content.title.message.content;
  const explaination = content.explaination.message.content;
  const message = content.message.message.content;
  const reflection = content.reflection.message.content;
  const prayer = content.prayer.message.content;

  const copyToClipboard = function (value) {
    navigator.clipboard.writeText(value ?? "");
  };

  return (
    <>
      <div className="flex flex-col gap-4 p-4 border rounded-lg">
        <section className="flex flex-col gap-2">
          <p className="text-sm font-semibold">{"제목"}</p>
          <p className="text-xs whitespace-pre-wrap">{title}</p>
          <button
            className="bg-blue-400 hover:bg-blue-500 p-2 rounded-lg text-white"
            onClick={function () {
              copyToClipboard(title);
            }}
          >
            복사하기
          </button>
        </section>
        <section className="flex flex-col gap-2">
          <p className="text-sm font-semibold">{"본문 해설"}</p>
          <p className="text-xs whitespace-pre-wrap">{explaination}</p>
          <button
            className="bg-blue-400 hover:bg-blue-500 p-2 rounded-lg text-white"
            onClick={function () {
              copyToClipboard(explaination);
            }}
          >
            복사하기
          </button>
        </section>
        <section className="flex flex-col gap-2">
          <p className="text-sm font-semibold">{"메세지"}</p>
          <p className="text-xs whitespace-pre-wrap">{message}</p>
          <button
            className="bg-blue-400 hover:bg-blue-500 p-2 rounded-lg text-white"
            onClick={function () {
              copyToClipboard(message);
            }}
          >
            복사하기
          </button>
        </section>
        <section className="flex flex-col gap-2">
          <p className="text-sm font-semibold">{"성찰하기"}</p>
          <p className="text-xs whitespace-pre-wrap">{prayer}</p>
          <button
            className="bg-blue-400 hover:bg-blue-500 p-2 rounded-lg text-white"
            onClick={function () {
              copyToClipboard(prayer);
            }}
          >
            복사하기
          </button>
        </section>
        <section className="flex flex-col gap-2">
          <p className="text-sm font-semibold">{"기도문"}</p>
          <p className="text-xs whitespace-pre-wrap">{reflection}</p>
          <button
            className="bg-blue-400 hover:bg-blue-500 p-2 rounded-lg text-white"
            onClick={function () {
              copyToClipboard(reflection);
            }}
          >
            복사하기
          </button>
        </section>
      </div>
    </>
  );
};
