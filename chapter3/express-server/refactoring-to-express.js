const url = require("url");
const express = require("express");
const app = express();
const port = 8005;

app.listen(port, () => {
    console.log("익스프레스로 라우터 리팩터링하기")
});

// GET 메서드의 라우팅 설정
app.get("/", (_, res) => res.end("HOME"));
app.get("/user", user);
app.get("/feed", feed);

function user (req, res) {
    const user = url.parse(req.url, true).query;

    // 결과값으로 유저명과 나이 제공
    // 응답을 JSON타입으로 보여주고, utf-8을 자동으로 설정해주므로 한글을 간단하게 처리할 수 있음
    res.json(`[user] name : ${user.name}, age: ${user.age}`);
}

// 호이스팅을 사용하기 위해 function으로 변경
// _기호 : 사용하지 않는 변수는 빼는것이 원칙이나, 함수 인터페이스 구조상 넣을 수 밖에 없을 때의 관례
function feed (_, res) {
    res.json(`<ul>
            <li>picture1</li>
            <li>picture2</li>
            <li>picture3</li>
            </ul>`);
}