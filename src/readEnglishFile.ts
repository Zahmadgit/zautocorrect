import { readFile } from "fs/promises";
//edge cases? what are those lol

async function readEnglishFile() {
  try {
    const response = await readFile("../assets/en-US.dic", "utf8");
    //gotta split the words before putting it into a set
    const words = response.split("\n").map((word: string) => word.trim());
    const wordDictionarySet = new Set<string>(words);
    // console.log(wordDictionary.has("apple"));
    // const wordDictionaryMap = new Map(Object.entries(words));
    // console.log(wordDictionarySet);
    // console.log(wordDictionary.includes("apple"));

    return wordDictionarySet;
  } catch (e) {
    console.log("ERROR BRUH: ", e);
  }
}

export const testAutoCorrect = async (word: string) => {
  console.time("readEnglishFile");
  const englishSet = await readEnglishFile();
  console.timeEnd("readEnglishFile");
  console.time("testAutoCorrect");
  let correctCandidates: string[] = [];
  if (englishSet!.has(word)) {
    console.log(word);
    return word;
  }
  //limit the word change to 1 because otherwise the amount of differences is massive for examples like wha's
  for (const dictWord of englishSet!) {
    if (levenshteinDistance(word, dictWord) <= 1) {
      correctCandidates.push(dictWord);
    }
  }

  console.log(correctCandidates);
  console.timeEnd("testAutoCorrect");
  return correctCandidates || word;
};

//no way Im spending time learning this, misterAI plz help me
function levenshteinDistance(a: string, b: string) {
  const matrix: any = Array.from({ length: b.length + 1 }, () => []);
  for (let i = 0; i <= b.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      matrix[i][j] =
        b[i - 1] === a[j - 1]
          ? matrix[i - 1][j - 1]
          : Math.min(
              matrix[i - 1][j] + 1, // deletion
              matrix[i][j - 1] + 1, // insertion
              matrix[i - 1][j - 1] + 1 // substitution
            );
    }
  }
  return matrix[b.length][a.length];
}

const testWord1 = "this";
const testWord2 = "wha's";
const testWord3 = "maybda";
const testWord4 = "nit";

testAutoCorrect(testWord2);
// testAutoCorrect(englishSet, testWord2);
// testAutoCorrect(englishSet, testWord3);
// testAutoCorrect(englishSet, testWord4);
