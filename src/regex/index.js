// export const CitationRegExp =
//   /(?<bookName>\d \w+|\w+ \d)[\s]+(?<chapter>[0-9]{1,3})[\:](?<verseStart>[0-9]{1,3})-?(?<verseEnd>[0-9]{1,3})?/i;
// export const CitationRegExpSecondary =
//   /(?<bookName>\w+)[\s]+(?<chapter>[0-9]{1,3})[\:](?<verseStart>[0-9]{1,3})-?(?<verseEnd>[0-9]{1,3})?/i;

export const CitationRegExp =
  /(?<bookName>\d [가-힣]+|[가-힣]+ \d)[\s]+(?<chapter>[0-9]{1,3})[\:]\s?(?<verseStart>[0-9]{1,3})-?(?<verseEnd>[0-9]{1,3})?/i;
export const CitationRegExpSecondary =
  /(?<bookName>[가-힣]+)[\s]+(?<chapter>[0-9]{1,3})[\:]\s?(?<verseStart>[0-9]{1,3})-?(?<verseEnd>[0-9]{1,3})?/i;
export const CitationRegExpTertiary =
  /(?<bookName>\d [가-힣]+|[가-힣]+ \d)[\s]+(?<chapter>[0-9]{1,3})장\s?(?<verseStart>[0-9]{1,3})절/i;
export const CitationRegExpTertiary2 =
  /(?<bookName>[가-힣0-9]+)[\s]+(?<chapter>[0-9]{1,3})장\s?(?<verseStart>[0-9]{1,3})절/i;
