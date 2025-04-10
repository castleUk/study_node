const express = require('express');
const handlebars = require('express-handlebars');
const app = express();
// 몽고디비 연결 함수
const mongodbConnection = require("./configs/mongodb-connection");
const postService = require("./services/post-service");
const {json} = require("express");
const {ObjectId} = require("mongodb");

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

// 상세페이지로 이동
app.get("/detail/:id", async (req, res) => {
    // 게시글 정보 가져오기
    const result = await postService.getDetailPost(collection, req.params.id);
    console.log(result);
    res.render("detail", {
        title: "테스트 게시판",
        post :  result,
    });
});

// 패스워드 체크
app.post("/check-password", async (req, res) => {
    const { id, password} = req.body;
    // postService의 getPostByIdAndPassword() 함수를 사용해 게시글 데이터 확인
    const post = await postService.getPostByIdAndPassword(collection, {id, password});

    // 데이터가 있으면 isExist true, 없으면 false
    if (!post) {
        return res.status(404).json({isExist: false});
    } else {
        return res.json({isExist: true});
    }
})

// 쓰기 페이지 이동 mode는 create
app.get("/write", (req, res) => {
    res.render("write", {title: "테스트 게시판", mode: "create"});
});

// 수정 페이지로 이동 mode는 modify
app.get("/modify/:id", async (req, res) => {

    // getPostById() 함수로 게시글 데이터를 받아옴
    const post = await postService.getPostById(collection, req.params.id);
    console.log(post);
    res.render("write", {title: "테스트 게시판", mode: "modify", post});
});

// 게시글 수정 API
app.post("/modify/", async (req, res) => {
    const { id, title, writer, password, content } = req.body;

    const post = {
        title,
        writer,
        password,
        content,
        createdDt: new Date().toISOString(),
    };
    // 업데이트 결과
    const result = postService.updatePost(collection, id, post);
    res.redirect(`/detail/${id}`);
});

// 게시글 삭제
app.delete("/delete", async (req, res) => {
    const { id, password } = req.body;
    try {
        // collection의 deleteOne을 사용해 게시글 하나를 삭제
        const result = await collection.deleteOne({_id: new ObjectId(id), password: password});
        /* deleteOne() - 조건에 맞는 도큐먼트를 하나 삭제
        * 결과 : DeleteResult 객체 = acknowledged(boolean_삭제승인여부) + deletedCount(숫자_삭제한 도큐먼트 개수)
        */
        // 삭제 결과가 잘 못된 경우의 처리
        if (result.deletedCount !== 1) {
            console.log("삭제 실패");
            return res.json({isSuccess: false});
        }
        return res.json({isSuccess: true});
    } catch (error) {
        // 에러가 난 경우 처리
        console.error(error);
        return res.json({isSuccess: false});
    }
})

// 댓글 추가
app.post("/write-comment", async (req, res) => {
    const { id, name, password, comment } = req.body;
    const post = await postService.getPostById(collection, id);

    if (post.comments) {
        post.comments.push({
            idx: post.comments.length +1,
            name,
            password,
            comment,
            createdDt: new Date().toISOString(),
        });
    } else {
        post.comments = [
            {
                idx: 1,
                name,
                password,
                comment,
                createdDt: new Date().toISOString(),
            }
        ];
    }
    // 업데이트하기. 업데이트 후에는 상세페이지로 리다이렉트
    postService.updatePost(collection, id, post);
    return res.redirect(`/detail/${id}`);

});

app.delete("/delete-commnet", async (req, res) => {
    const { id, idx, password } = req.body;

    const post = await collection.findOne({
        _id: new ObjectId(id),
        comments: { $elemMatch: { idx: parseInt(idx), password } },
        },
        postService.projectionOption,
    );

    // 데이터가 없으면 isSuccess : false를 주면서 종료
    if (!post) {
        return res.json({isSuccess: false});
    }

    // 댓글 번호가 idx 이외인 것만 comments에 다시 할당 후 저장
    post.comments = post.comments.filter((comment) => comment.idx != idx);
    postService.updatePost(collection, id, post);
    return res.json({isSuccess: true});
});



app.listen(3000, async () => {
    console.log("Server started");
    // mongodbConnection()의 결과는 mongoClient
    const mongoClient = await mongodbConnection();
    // mongoClient.db()로 디비 선택 collection()으로 컬렉션 선택 후 collection에 할당
    collection = mongoClient.db().collection("post");
    console.log("MongoDB connected");
});



