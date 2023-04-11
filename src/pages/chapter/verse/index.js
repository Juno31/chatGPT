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

function Verse() {
  const [chapter, setChapter] = useState("");
  const [result, setResult] = useState([]);
  const [count, setCount] = useState(0);
  const [citations, setCitations] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const splitContent = function (content) {
    if (content.match("\n")) {
      return content.split("\n");
    } else if (content.match(", ")) {
      return content.split(", ");
    }

    throw "split error";
  };

  const extractCitation = function (contents) {
    return contents
      .map(function (content) {
        if (CitationRegExp.test(content)) {
          return content.match(CitationRegExp)[0];
        }

        if (CitationRegExpSecondary.test(content)) {
          return content.match(CitationRegExpSecondary)[0];
        }

        if (CitationRegExpTertiary.test(content)) {
          return content.match(CitationRegExpTertiary)[0];
        }

        if (CitationRegExpTertiary2.test(content)) {
          return content.match(CitationRegExpTertiary2)[0];
        }

        return null;
      })
      .filter((item) => item);
  };

  const getVerseOfChapter = async function (index) {
    try {
      const response = await axios.post(`/api/chapter/verse`, {
        chapters: BOOK_NAME[index].chapters,
        book: BOOK_NAME[index].name,
      });

      const content = response.data[0].message.content;
      const splittedContent = splitContent(content);
      const onlyCitation = extractCitation(splittedContent);

      console.log(splittedContent);
      console.log(onlyCitation);

      if (onlyCitation.length !== BOOK_NAME[index].chapters) {
        throw "retry";
      }

      const finalData = {
        number: index,
        data: [...onlyCitation],
      };

      console.log(finalData);

      setCitations((current) =>
        [...current, finalData].sort(function (a, b) {
          let aNum = a.number;
          let bNum = b.number;
          if (aNum < bNum) {
            return -1;
          }

          if (aNum > bNum) {
            return 1;
          }

          return 0;
        })
      );

      setCount((current) => current + 1);
    } catch (error) {
      console.log(error);
      if (error) {
        getVerseOfChapter(index);
      }
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

  const getAllChapterVerse = function () {
    BOOK_NAME.forEach(function (book, index) {
      setTimeout(function () {
        getVerseOfChapter(index);
      }, index * 1000);
    });
  };

  const exportAllToCsv = function () {
    citations.forEach(function (book) {
      exportTableToCsv(
        `table${book.number}`,
        `${book.number}_${BOOK_NAME[book.number].name}_대표구절`
      );
    });
  };

  useEffect(
    function () {
      if (count !== 0) {
        exportTableToCsv("table", "대표구절");
        getVerseOfChapter(count);
      }
    },
    [count]
  );

  return (
    <div className="min-w-full flex flex-col items-center">
      <div className="mt-20" />
      <h1 className="text-2xl">챕터별 하이라이트 구절 추출기</h1>
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
        onClick={function () {
          getVerseOfChapter(count);
        }}
        className="bg-blue-500 px-6 py-4 min-w-[300px] text-white rounded-lg disabled:bg-LightGrey"
      >
        {isLoading ? "로딩중..." : "하이라이트 구절 추출하기"}
      </button>
      <div className="mt-3" />
      <button
        onClick={getAllChapterVerse}
        className="bg-blue-500 px-6 py-4 min-w-[300px] text-white rounded-lg disabled:bg-LightGrey"
      >
        {isLoading ? "로딩중..." : "전체 하이라이트 구절 추출하기"}
      </button>
      <div className="mt-3" />
      <button
        className="bg-green-500 px-6 py-4 min-w-[300px] text-white rounded-lg disabled:bg-LightGrey"
        onClick={function () {
          exportTableToCsv("table", "대표구절");
        }}
      >
        다운로드
      </button>
      <div className="mt-3" />
      <button
        className="bg-green-500 px-6 py-4 min-w-[300px] text-white rounded-lg disabled:bg-LightGrey"
        onClick={exportAllToCsv}
      >
        전체 다운로드
      </button>
      <div className="flex flex-col">
        <div className="mt-6" />
        <div className="flex flex-col gap-1">
          <>
            {/* <h1>{BOOK_NAME[book.number].name}</h1> */}
            <table id={`table`}>
              <thead>
                <tr>
                  <th>chapter</th>
                  <th>citation</th>
                </tr>
              </thead>
              <tbody>
                {citations.map(function (book, index) {
                  return (
                    <>
                      {book?.data?.map(function (citation, index) {
                        return (
                          <tr key={index + "장"}>
                            <td>{index + 1}장</td>
                            <td>{citation}</td>
                          </tr>
                        );
                      })}
                    </>
                  );
                })}
              </tbody>
            </table>
          </>
          {/* <h1 className="font-bold text-2xl mt-6 mb-2">{chapter}</h1>
          <p>{result}</p> */}
        </div>
      </div>
      <div className="mt-24" />
    </div>
  );
}

export default Verse;
