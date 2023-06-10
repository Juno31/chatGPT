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
import Head from "next/head";

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

      setContent({
        title: title,
        explaination: explaination,
        message: message,
        prayer: prayer,
        reflection: reflection,
      });
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

  const copyToClipboard = function (value) {
    navigator.clipboard.writeText(value ?? "");
  };

  return (
    <>
      <Head>
        <title>3분 큐티 컨텐츠 추출기</title>
      </Head>
      <div className="min-w-full flex flex-col items-center">
        <div className="mt-20" />
        <h1 className="text-2xl font-bold">3분 큐티 컨텐츠 추출기</h1>
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
        <div className="flex flex-row flex-wrap gap-3 w-full p-6 justify-center">
          {content.title && (
            <div className="flex flex-col gap-4 p-4 rounded-lg border border-LightGrey max-w-xl">
              <p className="text-sm font-semibold">{"제목"}</p>
              {content?.title?.map(function (title) {
                return (
                  <TitleItem copyToClipboard={copyToClipboard} title={title} />
                );
              })}
            </div>
          )}
          {content.explaination && (
            <div className="flex flex-col gap-4 p-4 rounded-lg border border-LightGrey max-w-xl">
              <p className="text-sm font-semibold">{"본문 해설"}</p>
              {content?.explaination?.map(function (explaination) {
                return (
                  <ExplainationItem
                    copyToClipboard={copyToClipboard}
                    explaination={explaination}
                  />
                );
              })}
            </div>
          )}
          {content.message && (
            <div className="flex flex-col gap-4 p-4 rounded-lg border border-LightGrey max-w-xl">
              <p className="text-sm font-semibold">{"메세지"}</p>
              {content?.message?.map(function (message) {
                return (
                  <MessageItem
                    copyToClipboard={copyToClipboard}
                    message={message}
                  />
                );
              })}
            </div>
          )}
          {content.prayer && (
            <div className="flex flex-col gap-4 p-4 rounded-lg border border-LightGrey max-w-xl">
              <p className="text-sm font-semibold">{"성찰하기"}</p>
              {content?.prayer?.map(function (prayer) {
                return (
                  <PrayerItem
                    copyToClipboard={copyToClipboard}
                    prayer={prayer}
                  />
                );
              })}
            </div>
          )}
          {content.reflection && (
            <div className="flex flex-col gap-4 p-4 rounded-lg border border-LightGrey max-w-xl">
              <p className="text-sm font-semibold">{"기도문"}</p>
              {content?.reflection?.map(function (reflection) {
                return (
                  <ReflectionItem
                    copyToClipboard={copyToClipboard}
                    reflection={reflection}
                  />
                );
              })}
            </div>
          )}
        </div>
        <div className="mt-10" />
      </div>
    </>
  );
}

export default Daily;

const TitleItem = function ({ title, copyToClipboard }) {
  return (
    <>
      <section className="flex flex-col gap-2">
        <p className="text-xs whitespace-pre-wrap">{title.message.content}</p>
        <button
          className="bg-blue-500 hover:bg-blue-600 p-2 rounded-lg text-white"
          onClick={function () {
            copyToClipboard(title.message.content);
          }}
        >
          복사하기
        </button>
      </section>
    </>
  );
};

const ExplainationItem = function ({ explaination, copyToClipboard }) {
  return (
    <>
      <section className="flex flex-col gap-2">
        <p className="text-xs whitespace-pre-wrap">
          {explaination.message.content}
        </p>
        <button
          className="bg-blue-500 hover:bg-blue-600 p-2 rounded-lg text-white"
          onClick={function () {
            copyToClipboard(explaination.message.content);
          }}
        >
          복사하기
        </button>
      </section>
    </>
  );
};

const MessageItem = function ({ message, copyToClipboard }) {
  return (
    <>
      <section className="flex flex-col gap-2">
        <p className="text-xs whitespace-pre-wrap">{message.message.content}</p>
        <button
          className="bg-blue-500 hover:bg-blue-600 p-2 rounded-lg text-white"
          onClick={function () {
            copyToClipboard(message.message.content);
          }}
        >
          복사하기
        </button>
      </section>
    </>
  );
};

const PrayerItem = function ({ prayer, copyToClipboard }) {
  return (
    <>
      <section className="flex flex-col gap-2">
        <p className="text-xs whitespace-pre-wrap">{prayer.message.content}</p>
        <button
          className="bg-blue-500 hover:bg-blue-600 p-2 rounded-lg text-white"
          onClick={function () {
            copyToClipboard(prayer.message.content);
          }}
        >
          복사하기
        </button>
      </section>
    </>
  );
};

const ReflectionItem = function ({ reflection, copyToClipboard }) {
  return (
    <>
      <section className="flex flex-col gap-2">
        <p className="text-xs whitespace-pre-wrap">
          {reflection.message.content}
        </p>
        <button
          className="bg-blue-500 hover:bg-blue-600 p-2 rounded-lg text-white"
          onClick={function () {
            copyToClipboard(reflection.message.content);
          }}
        >
          복사하기
        </button>
      </section>
    </>
  );
};
