const express = require('express');
const handlebars = require('express-handlebars');
const app = express();
// 몽고디비 연결 함수
const mongodbConnection = require("./configs/mongodb-connection");
const postService = require("./services/post-service");

let collection;

// HTTP 요청의 body를 해석하기 위한 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars',
    handlebars.create({
    helpers: require("./configs/handlebars-helpers"),
}).engine,
    ); // 템플릿 엔진으로 핸들바 등록
app.set('view engine', 'handlebars'); // 웹페이지 로드 시 사용할 템플릿 엔진 설정(위 설정한 이름과 같이 설정 해야 함)
app.set("views", __dirname + "/views"); // 뷰 디렉토리를 views로 설정, __dirname은 node를 실행하는 디렉토리 경로


// 라우터 설정
app.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || "";
    try {
        // postService.list에서 글 목록과 페이지네이터를 가져옴
        const [posts, paginator] = await postService.list(collection, page, search);

        // 리스트 페이지 렌더링
        res.render("home", { title: "테스트 게시판", search, paginator, posts})
    } catch (error) {
        console.error(error);
        res.render("home", {title: "테스트 게시판"})
    }
    // home은 템플릿 파일 이름, views를 기본 디렉토리로 지정했으니, views/home.handlebars 파일의 데이터를 렌더링한다.
    // 렌더링 시에 title과 message값이 객체로 들어가게 설정
});

app.get("/write", (req, res) => {
    res.render("write", {title: "테스트 게시판"});
});

// 글쓰기
app.post("/write", async (req, res) => {
    const post = req.body;
    // 글쓰기 후 결과 반환
    const result = await postService.writePost(collection, post);
    // 생성된 도큐먼트의 _id를 사용해 상세페이지로 이동
    res.redirect(`/detail/${result.insertedId}`);
});

app.get("/detail/:id", async (req, res) => {
    res.render("detail", {title: "테스트 게시판",})
});


app.listen(3000, async () => {
    console.log("Server started");
    // mongodbConnection()의 결과는 mongoClient
    const mongoClient = await mongodbConnection();
    // mongoClient.db()로 디비 선택 collection()으로 컬렉션 선택 후 collection에 할당
    collection = mongoClient.db().collection("post");
    console.log("MongoDB connected");
});



