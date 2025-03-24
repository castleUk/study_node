const paginator = require("../utils/paginator");

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



module.exports = {
    list,
    writePost,
}