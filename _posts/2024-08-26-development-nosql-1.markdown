---
layout: post
title: '[NoSQL] MongoDB 데이터베이스 및 컬렉션 관리'
subtitle: 'nosql, nosql'
categories: development
tags: nosql
comments: true
---

# MongoDB에서의 데이터베이스 및 컬렉션 관리

## 1. 데이터베이스 및 컬렉션 관리

```plaintext
show dbs                       // 모든 데이터베이스 목록 보기
use test                       // 특정 데이터베이스 사용 (없으면 생성)
show collections               // 현재 데이터베이스의 컬렉션 목록 보기
db.stats()                     // 현재 데이터베이스의 통계 정보 확인
db.dropDatabase()              // 현재 데이터베이스 삭제
db.test_2.drop()               // 특정 컬렉션(test_2) 삭제
db.createCollection("test_5", { capped: true, size: 1234, max: 100 })  // 새로운 컬렉션 생성 (크기 및 문서 수 제한)
db.test_5.renameCollection("test_6")  // 컬렉션 이름 변경
```

---

## 2. 비교 및 논리 연산자

MongoDB에서 데이터 조회 시, 다양한 비교 및 논리 연산자를 사용할 수 있다.

### 2-1. 비교 연산자 예제

```plaintext
db.test_2.find({ quantity: { $eq: 10 } })         // 특정 값과 같은 값 매칭
db.test_2.find({ quantity: { $gt: 5 } })          // 특정 값보다 큰 값 매칭
db.test_2.find({ quantity: { $gte: 15 } })        // 특정 값보다 크거나 같은 값 매칭
db.test_2.find({ item: { $in: ["banana", "mango"] } })  // 배열에 지정된 값들 중 하나와 매칭
db.test_2.find({ quantity: { $lt: 10 } })         // 특정 값보다 작은 값 매칭
db.test_2.find({ quantity: { $lte: 8 } })         // 특정 값보다 작거나 같은 값 매칭
db.test_2.find({ quantity: { $ne: 10 } })         // 특정 값과 같지 않은 값 매칭
db.test_2.find({ item: { $nin: ["apple", "orange"] } })  // 배열에 지정된 값들 중 어느 것도 매칭되지 않음
```

### 2-2. 논리 연산자 예제

```plaintext
db.test_2.find({ $or: [                           // 여러 조건 중 하나라도 만족하는 문서 매칭
    { item: "apple" }, 
    { quantity: { $gt: 10 } }
] })

db.test_2.find({ $and: [                          // 모든 조건을 만족하는 문서 매칭
    { item: "banana" }, 
    { quantity: { $lt: 15 } }
] })

db.test_2.find({ item: { $not: { $eq: "mango" } } })  // 조건을 만족하지 않는 문서 매칭
```

---

## 3. MongoDB에서의 CRUD 작업

### 3-1. Document 입력 - insertOne, insertMany

```plaintext
db.test_2.insertOne(
    { title: "MongoDB Guide", author: "Jane Doe", views: 100 }
)

db.test_2.insertMany([
    { title: "Python Tutorial", author: "John Smith", views: 150 },
    { title: "JavaScript Basics", author: "Sara Lee", views: 200 },
    { title: "Node.js in Action", author: "Mike Brown", views: 250 }
])
```

### 3-2. Document 읽기(검색) - findOne, find

```plaintext
db.test_2.findOne({ title: "MongoDB Guide" })
db.test_2.find({ views: { $gte: 150 } })
db.test_2.find({ views: { $gte: 150 } }, { title: 1, author: 1, _id: 0 })
```

### 3-3. Document 수정 - updateOne, updateMany

```plaintext
db.test_2.updateOne({ title: "MongoDB Guide" }, { $set: { views: 120 } })
db.test_2.updateMany({ author: "John Smith" }, { $set: { author: "Jonathan Smith" } })
```

### 3-4. Document 삭제 - deleteOne, deleteMany

```plaintext
db.test_2.deleteOne({ title: "Node.js in Action" })
db.test_2.deleteMany({ views: { $lt: 150 } })
```

---

## 4. MongoDB의 다양한 문법

### 4-1. 정규 표현식 ($regex)

```plaintext
db.test_2.find({ name: { $regex: /^b/ } })      // name이 'b'로 시작하는 문서들 조회
db.test_2.find({ name: { $regex: /apple$/ } })  // name이 'apple'로 끝나는 문서들 조회
```

### 4-2. 정렬 (.sort())

```plaintext
db.test_2.find().sort({ stock: 1 })             // stock 필드를 기준으로 오름차순 정렬
db.test_2.find().sort({ name: -1 })             // name 필드를 기준으로 내림차순 정렬
```

### 4-3. 문서 개수 세기 (.countDocuments(), .estimatedDocumentCount())

```plaintext
db.test_2.countDocuments({ category: "fruit" }) // 특정 조건을 만족하는 문서 개수
db.test_2.estimatedDocumentCount()              // 컬렉션 내 전체 문서 개수를 추정
```

### 4-4. 필드 존재 여부 확인 ($exists)

```plaintext
db.test_2.find({ price: { $exists: true } })    // price 필드가 존재하는 문서 조회
db.test_2.find({ discount: { $exists: false } }) // discount 필드가 존재하지 않는 문서 조회
```

### 4-5. 중복 제거 (.distinct())

```plaintext
db.test_2.distinct("category")                  // category 필드 중복 제거 및 고유 값 조회
```

### 4-6. 리미티드와 스킵 (.limit(), .skip())

```plaintext
db.test_2.find().limit(5)                       // 처음 5개의 문서만 가져오기
db.test_2.find().skip(2)                        // 처음 2개의 문서를 건너뛰고 가져오기
```

### 4-7. 집계 (.aggregate())

```plaintext
db.test_2.aggregate([
    { $match: { category: "fruit" } },          // category가 "fruit"인 문서 필터링
    { $group: { _id: "$category", totalStock: { $sum: "$stock" } } }
])
```
