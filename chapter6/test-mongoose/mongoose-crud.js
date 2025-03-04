const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Person = require('./person-model');

mongoose.set("strictQuery", false);

const app = express();
app.use(bodyParser.json());
app.listen(3000, async () => {
    console.log("Server started");
    const mongodbUri = "mongodb+srv://ppkk34:Loveghdl23@cluster0.ir7s4.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0";

    // 몽고디비에 커넥션 맺기
    mongoose.connect(mongodbUri).then(console.log("Connected to MongoDB"));
});

// 모든 person 데이터 출력
app.get("/person", async (req, res) => {
    const person = await Person.find({});
    res.send(person);
})

// 특정 이메일로 person 찾기
app.get("/person/:email", async (req, res) => {
    const person = await Person.findOne({email: req.params.email});
    res.send(person);
});

// person 데이터 추가하기
app.post("/person", async (req, res) => {
    const person = new Person(req.body);
    await person.save();
    /** 위 두줄을 아래와 같이 한 줄로 쓸수도 있다.(완전히 같은 동작)
     *  const person = await Person.create(req.body);
     */
    res.send(person);


});

// person 데이터 수정하기
app.put("/person/:email", async (req, res) => {
    const person = await Person.findOneAndUpdate(
        { email: req.params.email},
        { $set: req.body},
        {new: true}
    );
    /**
     * 하나만 수정할 경우는 findOneAndUpdate(), 혹은 updateOne()을 사용한다.
     * 여러개를 동시에 수정할 때는 updateMany()를 사용한다.
     */
    console.log(person);
    res.send(person);
});

// person 데이터 삭제하기
app.delete("/person/:email", async (req, res) => {
    await Person.deleteMany({ email: req.params.email });
    res.send({success: true});
    /**
     * 하나만 삭제하고 문서를 결과값으로 받을때는 findOneAndDelete()
     * 하나만 삭제할 때는 deleteOne()
     * 여러개를 삭제할때는 deleteMany()
     */
})

