# did I really need to make a auto corrector library? yep!

```
npm install zautocorrect
or
yarn add zautocorrect
```

Usage.

```
import { testAutoCorrect } from "zautocorrect";

//put this inside a functional component
const [inputVal, setInputVal] = useState("");
const [correctWords, setCorrectWords] = useState([])

const checkWordCorrectHandler = (word) => {
    let wordsArr = testAutoCorrect(word);
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

--I do not endorse the unoptimizaed handlers and functions inside of the onChange--
