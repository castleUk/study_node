import http from "k6/http";

export const options = {  // 테스트 옵션값
    vus: 100, // 유저 100명
    duration: "10s", // 10초 동안 계속 요청을 보내는 설정
};

export default function () {
    http.get("http://localhost:8000"); // GET 메서드를 사용해 http://localhost:8000에 요청을 보낸다는 의미
}


