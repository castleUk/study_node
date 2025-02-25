const express = require('express');
const app = express();
let posts = []; // 게시글 리스트로 사용할 posts에 빈 리스트 할당

// req.body를 사용하려면 JSON 미들웨어를 사용해야 한다.
// 사용하지 않으면 undefined로 반환
app.use(express.json()); // JSON 미들웨어 활성화

// POST 요청 시 컨텐트 타입이 application/x-www-form-urlencoded인 경우 파싱
app.use(express.urlencoded({extended: true}));

// /로 요청이 오면 게시글 리스트를 JSON 형식으로 보여줌
app.get('/', (req, res) => {
    res.json(posts);
});

app.post("/posts", (req, res) => {
    // 객체 타입은 비구조화 할당이 가능
    const { title, name, text} = req.body; // HTTP 요청의 body 데이터를 변수에 할당

    // 게시글 리스트에 새로운 게시글 정보 추가

    posts.push({ id: posts.length + 1, title, name, text, createdDt: Date()})
    res.json({ title, name, text})
});

// :id 해당 부분에 데이터가 들어오면 문자열 타입으로 params.id에 할당
app.delete("/posts/:id", (req, res) => {
    const id = req.params.id;
    const filteredPosts = posts.filter(post => post.id !== +id); //+id는 문자열인 id를 숫자형으로 변경한다는것
    const isLengthChanged = posts.length !== filteredPosts.length;
    posts = filteredPosts;
    if (isLengthChanged) {
        res.json("OK");
        return;
    }
    res.json("NOT CHANGED");
});

app.listen(8005, () => {
    console.log("welcome posts START!");
});

/** 짤막 Tip - JS에서 Array 메소드
 *
 * 1. map() : 배열 내의 모든 요소에 대해 주어진 함수를 호출한 결과를 모아 새로운 배열을 반환
 * const numbers = [1,2,3]
 * const doubleNumArray = numbers.map(num => num*2);
 * console.log(doubleNumArray) // [2,4,6]
 *
 *
 * 2. filter() : 만족시키는 모든 요소를 배열로 반환
 * * filter()을 활용한 검색
 * notes = {notes.filter(note) =>
 *      note.text.toLowerCase().includes(searchText)
 * }};
 * * filter()를 활용한 요소를 삭제하는 함수
 * const deleteNote = (id) => {
 *      const newNotes = notes.filter((note) => note.id !==id);
 *      setNotes(newNotes);
 * }
 * *값이 3 이상인 요소 추출
 * data.filter((it) => it.emotion>=3)
 *
 *
 * 3. reduce() : 누산기가 포함되어 있어ㅏ 배열의 각 요소에 대해 함수를 실행하고 누적된 값을 출력
 * reduce(callback, initialValue) # initialValue: callback의 최초 호출에서 첫 번째 인수로 제공되는 값, 제공 안할시 배열의 첫 요소 활용
 *
 * const array1 = [1,2,3,4];
 *
 * // 0 +1 + 2 + 3+ 4
 * const initialValue = 0;
 * const sumWithInitial = array1.reduce(
 *  (previousValue, currentValue) = > previousValue + currentValue, initialValue);
 * );
 *
 *
 * 4. find() : 만족시키는 첫 요소 반환, 없을 경우 undefined 반환
 * array.find((element,index,array)=>{})
 * array.find(function)
 *
 * 5. concat() : 2개 이상의 배열을 merge할 때 사용/ 최근에는 더 범용적으로 쓸수 있는 spread 연산자 사용
 * const fruitOne = ['apple', 'banana'];
 * const fruitTwo = ['grape', 'peach'];
 *
 * const fruitAll = fruitOne.concat(fruitTwo);
 *
 * const fruitAllWithSpread = [...fruitOne, ...fruitTwo];
 *
 *
 * 6. slice() : 잘라내어, 깊은 복사하여 return
 * array.slice(end), array.slice(start,end), array.slice()
 *
 * 7. forEach() : 데이터값과 인덱스 값을 모두 매핑
 */

