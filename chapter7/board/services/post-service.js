const paginator = require("../utils/paginator");
const  {ObjectId}  = require("mongodb");

// 글쓰기
async function writePost(collection, post) {
    // 생성일시와 조회수를 넣어줍니다.
    post.hits = 0;
    post.createdDt = new Date().toISOString();
    return await collection.insertOne(post);
}

// 글목록
async function list(collection, page, search) {
    const perPage = 10;
    // title이 search와 부분일치하는지 확인
    const query = { title: new RegExp(search, "i")};
    // limit는 10개만 가져온다는 의미, skip은 설정된 개수만큼 건너뛴다, 생성일 역순으로 정렬
    const cursor = collection.find(query, { limit: perPage, skip: (page - 1) * perPage}).sort({createdDt: -1,});
    // 검색어에 걸리는 게시물의 총합
    const totalCount = await collection.count(query);
    const posts = await cursor.toArray();
    // 페이지네이터 생성
    const paginatorObj = paginator({ totalCount, page, perPage: perPage });
    return [posts, paginatorObj];
}

// 패스워드는 노출 할 필요가 없으므로 결괏값으로 가져오지 않음
// 0은 가져오지 않는 설정, 1은 가져오는 설정
const projectionOption = {
    projection: {
        // 프로젝션(투영) 결괏값에서 일부만 가져올 때 사용
        password: 0, "comments.password" : 0,
    },
};

// db.collection.findOneAndupdate(filter, update, options)
// filter는 원하는 데이터를 가져오고, update는 필터를 사용해 찾은 도큐먼트에 갱신할 데이터에 대한 내용을 넣음
// options는 프로젝션, 소팅 등의 항목을 넣을수 있음
// $inc는 값을 증가 시킬때 사용 하는 연산자

async function getDetailPost(collection, id) {
    // 몽고디비 Collection의 findOneAndUpdate() 함수를 사용
    // 게시글을 읽을 때마다 hits를 1 증가
    return await collection.findOneAndUpdate({ _id : new ObjectId(id) }, {$inc: {hits: 1}}, projectionOption);
};

async function getPostByIdAndPassword(collection, {id, password}) {
    // findOne() 함수 사용
    return await collection.findOne({_id : new ObjectId(id), password: password}, projectionOption);
}

// id로 데이터 불러오기
async function getPostById(collection, id) {
    return await collection.findOne({ _id: ObjectId(id)}, projectionOption)
}

// 게시글 수정
async function updatePost(collection, id, post) {
    const toUpdatePost = {
        $set : {
            ...post,
        },
    };
    return await collection.updateOne({ _id: new ObjectId(id)}, toUpdatePost);
}



module.exports = {
    list,
    writePost,
    getDetailPost,
    getPostById,
    getPostByIdAndPassword,
    updatePost,
}