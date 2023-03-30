import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import axios from "axios"

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const options = {
        url: '/api/today',
        method: 'POST',
        data: {
          data: input
        }
      }

      const response = await axios(options)

      console.log(response.data.data)

      const quote = response.data.data.quote
      const advise = response.data.data.advise
      const explain = response.data.data.explain

      setResult(`${quote}\n\n${explain}\n\n${advise}`);
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Jesus...</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>Jesus duckdam</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="animal"a
            placeholder="Enter an animl"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <input type="submit" value="하나님 말씀 듣기" />
        </form>
        <textarea spellCheck={false} style={{width: 500, height: 300, marginTop: 50, textAlign: 'center', border: 'none'}} value={result}></textarea>
      </main>
    </div>
  );
}
