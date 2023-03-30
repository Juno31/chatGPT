import React, { useEffect, useState } from "react";
import axios from "axios";

//constants
import BOOK_NAME from "constants/book";

function Title() {
  const [chapter, setChapter] = useState("");
  const [totalResult, setTotalResult] = useState([]);
  const [result, setResult] = useState([]);
  const [count, setCount] = useState(65);

  const [isLoading, setIsLoading] = useState(false);

  const getChapterTitle = async function () {
    setIsLoading(true);
    setResult([]);
    try {
      const options = {
        url: `/api/chapter/title?count=${count}`,
        method: "POST",
        data: {
          book: BOOK_NAME[count].name,
          chapters: BOOK_NAME[count].chapters,
        },
      };

      const response = await axios(options);
      console.log(response);
      const content = response.data[0].message.content;
      let chapterLength; // 장수

      //장수 생성
      if (content.match("\n")) {
        chapterLength = content.split("\n").length;
      } else if (content.match(", ")) {
        chapterLength = content.split(", ").length;
      }

      if (chapterLength !== BOOK_NAME[count].chapters) {
        throw "retry";
      }

      let filterResult = content;

      if (filterResult.match("-")) {
        let splittedResult;

        if (content.match("\n")) {
          splittedResult = content.split("\n");
        } else if (content.match(", ")) {
          splittedResult = content.split(", ");
        }

        splittedResult = splittedResult.map(function (title) {
          const index = title.indexOf("-");
          const slicedTitle = title.slice(index + 1);

          return slicedTitle;
        });

        console.log(splittedResult);
        setResult(splittedResult);
        setCount((current) => current + 1);
        return;
      }

      let filteredDash = filterResult.replaceAll(":", "");
      let filterChapter = filteredDash.replaceAll(chapter, "");
      let filterComma = filterChapter.replaceAll('"', "");
      let filterDash = filterComma.replaceAll("-", "");

      for (let i = 0; i < chapterLength; i++) {
        filterDash = filterDash.replaceAll(`${i}장`, "");
        filterDash = filterDash.replaceAll(`${i}.`, "");
      }

      for (let i = 0; i < chapterLength; i++) {
        filterDash = filterDash.replaceAll(`${i}`, "");
      }

      console.log(filterResult);

      if (filterResult.match("\n")) {
        setResult(filterDash.split("\n"));
      } else if (filterResult.match(",")) {
        setResult(filterDash.split(", "));
      }
      setCount((current) => current + 1);
    } catch (error) {
      if (error === "retry") {
        getChapterTitle();
        return;
      }

      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const exportTableToCsv = function (tableId, filename) {
    if (filename == null || typeof filename == undefined) filename = tableId;
    filename += ".csv";

    var BOM = "\uFEFF";

    var table = document.getElementById(tableId);
    var csvString = BOM;
    for (var rowCnt = 0; rowCnt < table.rows.length; rowCnt++) {
      var rowData = table.rows[rowCnt].cells;
      for (var colCnt = 0; colCnt < rowData.length; colCnt++) {
        var columnData = rowData[colCnt].innerHTML;
        if (columnData == null || columnData.length == 0) {
          columnData = "".replace(/"/g, '""');
        } else {
          columnData = columnData.toString().replace(/"/g, '""'); // escape double quotes
        }
        csvString = csvString + '"' + columnData + '",';
      }
      csvString = csvString.substring(0, csvString.length - 1);
      csvString = csvString + "\r\n";
    }
    csvString = csvString.substring(0, csvString.length - 1);

    // IE 10, 11, Edge Run
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      var blob = new Blob([decodeURIComponent(csvString)], {
        type: "text/csv;charset=utf8",
      });

      window.navigator.msSaveOrOpenBlob(blob, filename);
    } else if (window.Blob && window.URL) {
      // HTML5 Blob
      var blob = new Blob([csvString], { type: "text/csv;charset=utf8" });
      var csvUrl = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.setAttribute("style", "display:none");
      a.setAttribute("href", csvUrl);
      a.setAttribute("download", filename);
      document.body.appendChild(a);

      a.click();
      a.remove();
    } else {
      // Data URI
      var csvData =
        "data:application/csv;charset=utf-8," + encodeURIComponent(csvString);
      var blob = new Blob([csvString], { type: "text/csv;charset=utf8" });
      var csvUrl = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.setAttribute("style", "display:none");
      a.setAttribute("target", "_blank");
      a.setAttribute("href", csvData);
      a.setAttribute("download", filename);
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  useEffect(
    function () {
      if (result.length) {
        exportTableToCsv(
          "table",
          `${count}_${BOOK_NAME[count !== 0 ? count - 1 : 0].name}`
        );
        getChapterTitle();
      }
    },
    [result]
  );

  useEffect(
    function () {
      if (result.length) {
        setTotalResult((current) => [...current, ...result]);
      }
    },
    [result]
  );

  const filterBook = function (book) {
    let chapterLength; // 장수

    //장수 생성
    if (book.match("\n")) {
      chapterLength = book.split("\n").length;
    } else if (book.match(", ")) {
      chapterLength = book.split(", ").length;
    }

    if (chapterLength !== BOOK_NAME[count].chapters) {
      throw "retry";
    }

    let filterResult = book;

    if (filterResult.match("-")) {
      let splittedResult;

      if (book.match("\n")) {
        splittedResult = book.split("\n");
      } else if (book.match(", ")) {
        splittedResult = book.split(", ");
      }

      splittedResult = splittedResult.map(function (title) {
        const index = title.indexOf("-");
        const slicedTitle = title.slice(index + 1);

        return slicedTitle;
      });

      console.log(splittedResult);
      return splittedResult;
    }

    let filteredDash = filterResult.replaceAll(":", "");
    let filterChapter = filteredDash.replaceAll(chapter, "");
    let filterComma = filterChapter.replaceAll('"', "");
    let filterDash = filterComma.replaceAll("-", "");

    for (let i = 0; i < chapterLength; i++) {
      filterDash = filterDash.replaceAll(`${i}장`, "");
      filterDash = filterDash.replaceAll(`${i}.`, "");
    }

    for (let i = 0; i < chapterLength; i++) {
      filterDash = filterDash.replaceAll(`${i}`, "");
    }

    console.log(filterResult);

    if (filterResult.match("\n")) {
      return filterDash.split("\n");
    } else if (filterResult.match(",")) {
      return filterDash.split(", ");
    }
  };

  const fastGetter = async function () {
    try {
    } catch (error) {}
  };

  return (
    <div className="min-w-full flex flex-col items-center">
      <div className="mt-20" />
      <h1 className="text-2xl">챕터 제목 추출기</h1>
      <div className="mt-6" />
      {/* <input
        className="border focus:border-blue-500 border-LightGrey px-6 py-4 min-w-[300px] rounded-lg"
        onChange={function (e) {
          setChapter(e.target.value);
        }}
        onKeyUp={function (e) {
          if (e.key === "Enter" && chapter.length) {
            getChapterTitle();
          }
        }}
      /> */}
      <div className="mt-3" />
      <button
        onClick={getChapterTitle}
        className="bg-blue-500 px-6 py-4 min-w-[300px] text-white rounded-lg disabled:bg-LightGrey"
      >
        {isLoading ? "로딩중..." : "제목 뽑기"}
      </button>
      <div className="mt-6" />
      <button
        className="bg-blue-500 border py-3 mb-3 rounded-md text-white px-4"
        onClick={function () {
          exportTableToCsv("table", chapter);
        }}
      >
        다운로드
      </button>
      <div className="flex flex-col">
        <div className="mt-6" />
        <div className="flex flex-col gap-1">
          <table id="table">
            <thead>
              <tr>
                <th>chapter</th>
                <th>title</th>
              </tr>
            </thead>
            <tbody>
              {result.map(function (title, index) {
                return (
                  <tr key={index + "장"}>
                    <td>{index + 1}장</td>
                    <td>{title}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {/* <h1 className="font-bold text-2xl mt-6 mb-2">{chapter}</h1>
          <p>{result}</p> */}
        </div>
      </div>
      <div className="mt-24" />
    </div>
  );
}

export default Title;
