import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [input, setInput] = useState("");
  const [mood, setMood] = useState("");
  const [contents, setContents] = useState([]);
  const [translated, setTranslated] = useState([]);

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const options = {
        url: "/api/hollister",
        method: "POST",
        data: {
          context: input,
          mood: mood,
        },
      };

      const response = await axios(options);
      const messages = response.data;

      const contents = messages.map(function (message) {
        return message.message.content;
      });

      setContents(contents);
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  const handleTranslate = async function () {
    try {
      const response = await axios.post("/api/translate", {
        data: contents,
      });

      const translates = response.data.map(function (message) {
        return message.message.content;
      });

      console.log(translates);

      setTranslated(translates);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(function () {
    const logHeight = function () {
      const scrollviewOffsetY = window.scrollY;

      console.log("scrollviewOffsetY", scrollviewOffsetY);
    };

    window.addEventListener("scroll", logHeight);

    return function () {
      window.removeEventListener("scroll", logHeight);
    };
  }, []);

  return (
    <div>
      <Head>
        <title>Hollister</title>
        <link rel="icon" href="/dog.png" />
      </Head>
      <main>
        <Image
          src={"/cross.png"}
          width={50}
          height={50}
          style={{ width: 50, height: 50 }}
        />
        <h3>Hollister</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="animal"
            placeholder="Enter an animl"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter mood"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
          />
          <input type="submit" value="하나님 말씀 듣기" />
        </form>
        <button
          style={{ marginTop: "20px", padding: "12px 24px" }}
          onClick={handleTranslate}
        >
          Translate
        </button>
        <div style={{ marginTop: 20 }} />
        {contents.map(function (message, index) {
          return (
            <textarea
              style={{ width: 400, height: 200, padding: 20, marginBottom: 20 }}
              value={message}
              spellCheck={false}
            />
          );
        })}
        {translated.length !== 0 && <p>translate</p>}
        {translated.map(function (message, index) {
          return (
            <textarea
              style={{ width: 400, height: 200, padding: 20, marginBottom: 20 }}
              value={message}
              spellCheck={false}
            />
          );
        })}
        <div style={{ marginTop: 2000 }} />
      </main>
    </div>
  );
}
