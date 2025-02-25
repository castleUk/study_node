const http = require("http");
const url = require("url"); // url 모듈을 로딩
http.createServer((req, res) => {
    const path = url.parse(req.url, true).pathname;
    res.setHeader("Content-Type", "text/html; charset=utf-8");

    if (path in urlMap) {
        urlMap[path](req, res);
    } else {
        notFound(req, res);
    }
}).listen("8002", () => console.log("라우터를 만들어보자!"));

const user = (req, res) => {


    const userInfo = url.parse(req.url, true).query;
    res.end(`[user] name : ${userInfo.name}, age: ${userInfo.age}`);
};

const feed = (req, res) => {

    res.end(`<ul>
            <li>picture1</li>
            <li>picture2</li>
            <li>picture3</li>
            </ul>`);
}
const notFound = (req,res) => {

    res.statusCode = 404;
    res.end(" 404 page Not Found");
}

// 라우터 규칙 매핑 키로 path가 들어가고 값에 함수를 할당
const urlMap = {
    "/" : (req, res) => res.end("HOME"),
    "/user" : user,
    "/feed" : feed,
}


/**
 * 짤막 Tip, hoisting
 * 함수, 클래스, 변수를 끌어올려서 선언되기 전에 사용하도록 하는 기능
 * 자바스크립트에서는 var로 선언한 변수나, 함수, 그리고 클래스 선언이 호이스팅이 가능
 * 예시 1
 * hohoisting();
 * function hohoisting() { console.log("호이스팅이 됩니다.");}
 *
 * 반면 let, const, 함수 표현식, 클래스 표현식은 호이스팅이 불가능
 *
 * 예시2
 * constHosting();
 * const constHosting = () => console.log("호이스팅이 안돼요!");
 */
