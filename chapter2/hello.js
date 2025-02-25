const http = require('http');
// require() 함수는 모듈을 읽어오는 함수이다. http 모듈을 불러와서 http 변수에 할당함
// 특별한 경우가 아니라면 모듈명과 변수명을 같게 하는 것이 관행이다.
let count = 0;

const server = http.createServer((req, res) => {
    // createServer()는 서버 인스턴스를 만드는 함수이다. 인수로 콜백 함수를 받는데, 콜백 함수에서는 http 서버로 요청이 들어오면 해당 요청을 처리할 함수를 설정한다.
    // 콜백 함수는 요청 처리에 사용할 req와 res를 인수로 받는다.
    log(count);
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.write("hello\n");
    setTimeout(() => { // 2초 후 "Node.js"를 응답으로 주고 http 커넥션을 끝내는 동작
        res.end("Node.js");
    }, 2000);
})

function log(count) {
    console.log(count);
}

server.listen(8000, () => console.log("Hello Node.js"));
// 사용할 포트 번호를 8000번으로 지정, 또한 IP가 생략 되었으므로 기본값인 localhost 혹은 127.0.0.1로 서버에 접근

/**
 * 짤막 Tip
 * 포트 번호 0~1023번 포트를 사용하려면 루트 권한이 필요함.
 * 1024~49151의 구간은 IANA(인터넷 할당 번호 관리기관)에 등록되어 있지만, 슈퍼 유저 권한이 없이도 임의로 사용 할 수는 있음
 * 49152~65535번의 구간은 일반 사용자들이 자유롭게 사용할 수 있음
 */