# did I really need to make a auto corrector library? yep!

0. Install the package as a dependency for version 0.1.2

```
npm install zautocorrect
or
yarn add zautocorrect
```

Usage:

1. Import the function to create the dictionary set, readEnglishFile() and the function to test a string with the current Set, testAutoCorrect()

```
import { testAutoCorrect, readEnglishFile } from "zautocorrect";
```

2. Initilize the set to be used for the test function

```
async function dictionarySetFunction() {
  const newSet = await readEnglishFile();
  return newSet;
}
const dictionarySet = await dictionarySetFunction();

```

3. Use the test function with the set, test will return a little of correct possible words

```

//put this inside a functional component
const [inputVal, setInputVal] = useState("");
const [correctWords, setCorrectWords] = useState([])

const checkWordCorrectHandler = (word) => {
    let wordsArr = testAutoCorrect(dictionarySet, word);
    setCorrectWords([wordsArr]);
};

//put this inside of a return wrapping jsx
<input
 type="text"
 value={inputVal}
 placeholder="Lets test zautocorrect"
 onChange={(e) => {
 setInputVal(e.target.value);
 checkWordCorrectHandler(e.target.value);
 }}
/>

{correctWords.map((word) => (
    <div key={word}>
     <p>{word}</p>
    </div>
))}

```

4. To support multiple words inside an input, you can use a useEffect to track input index caret and then resursively add to an array backwards until a space is reached or 0 and then reverse the letters and join to give to the test function, like so:

```
  const inputVal = useRef("");
  const [correctWords, setCorrectWords] = useState([]);
  const wordIndex = useRef(0);


  const checkWordCorrectHandler = (word) => {
    const currentWordsArr = word.split(" ");
    const completeWordsArr = word.split("");


    let wordArrForTestAutoCorrect = [];

    for (let i = wordIndex.current - 1; i >= 0; --i) {
        if (completeWordsArr[i] == " ") {
            break;
        }
        wordArrForTestAutoCorrect.push(completeWordsArr[i]);
    }
    const wordForTestAutoCorrect = wordArrForTestAutoCorrect.reverse().join("");

    let wordsArr = testAutoCorrect(dictionarySet, wordForTestAutoCorrect);
    setCorrectWords([wordsArr]);
  };

  useEffect(() => {
    const input = document.getElementById("txt");
    const updateCaret = () => {
      wordIndex.current = txt.selectionStart;
    };
    input.addEventListener("input", updateCaret);
    return () => {
      input.removeEventListener("input", updateCaret);
    };
  }, []);

    return (
        <div>
            <input
                id="txt"
                type="text"
                ref={inputVal}
                spellCheck={true}
                placeholder="Lets test zautocorrect"
                onChange={(e) => {
                checkWordCorrectHandler(e.target.value);
                }}
            />

            {correctWords.map((word, idx) => (
                <div key={idx}>
                    <li>{word}</li>
                </div>
            ))}
      </div>

    )


```

**React Native Expo Version**\
Usage:

1. Must of it is the same, although you do need to consider expos cli as well as the React Native core components, just going to copy/paste the entire snippet.

```
import React, { useEffect, useRef, useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import { readEnglishFile, testAutoCorrect } from "zautocorrect";

export default function Index() {
  const [dictionarySet, setDictionarySet] = useState<any>(null);
  const [correctWords, setCorrectWords] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const wordIndex = useRef(0);

  //effect to load dictionary, cant have async await in top code or outside the function
  useEffect(() => {
    const loadDictionary = async () => {
      const newSet = await readEnglishFile();
      setDictionarySet(newSet);
    };
    loadDictionary();
  }, []);

  const checkWordCorrectHandler = (text: string) => {
    //safe programming~ incase dictionary isnt rdy yet
    if (!dictionarySet) return;

    const completeWordsArr = text.split("");
    let wordArrForTestAutoCorrect: string[] = [];

    for (let i = wordIndex.current - 1; i >= 0; --i) {
      if (completeWordsArr[i] === " ") {
        break;
      }
      wordArrForTestAutoCorrect.push(completeWordsArr[i]);
    }

    const wordForTestAutoCorrect = wordArrForTestAutoCorrect.reverse().join("");
    const wordsArr = testAutoCorrect(dictionarySet, wordForTestAutoCorrect);

    setCorrectWords([wordsArr]);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
      }}
    >
      <TextInput
        style={{ width: "50%" }}
        value={inputValue}
        onChangeText={(text) => {
          setInputValue(text);
          checkWordCorrectHandler(text);
        }}
        placeholder="Let's test zautocorrect"
        onSelectionChange={(e) => {
          //track caret index (like selectionStart in web)
          wordIndex.current = e.nativeEvent.selection.start;
        }}
      />

      <FlatList
        data={correctWords}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item }) => (
          <Text style={{ marginTop: 8, fontSize: 16 }}>{item}</Text>
        )}
      />
    </View>
  );
}

```

--I do not endorse the unoptimizaed handlers and functions inside of the onChange--
