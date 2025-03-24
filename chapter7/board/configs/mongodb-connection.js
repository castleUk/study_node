const { MongoClient } = require("mongodb");

//MongoDB 연결 주소
const uri = "mongodb+srv://ppkk34:Loveghdl23@cluster0.ir7s4.mongodb.net/board";
// 마지막에 board는 기본값, 없다면 자동으로 생성됨.

module.exports = function (callback) { //몽고디비 커넥션 연결 함수 반환
    return MongoClient.connect(uri, callback);
}

// MongoClient.connect() 함수는 두번째 인수로 콜백 함수를 받는다.
// 콜백 함수의 두번째 인수로 mongodb에 연결된 MongoClient 객체가 주어진다.