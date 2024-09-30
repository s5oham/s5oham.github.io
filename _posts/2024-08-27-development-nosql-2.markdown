---
layout: post
title: '[NoSQL] MongoDB: ObjectId와 데이터 타입 관리'
subtitle: 'MongoDB: ObjectId와 데이터 타입 관리l'
categories: development
tags: nosql
comments: true
---


# MongoDB에서의 ObjectId와 데이터 타입 관리

## 1. ObjectId란 무엇인가?

MongoDB에서 **ObjectId**는 각 문서를 고유하게 식별하기 위해 사용되는 데이터 타입. 모든 문서는 `_id` 필드를 가지고 있으며, 기본적으로 이 필드에는 ObjectId가 할당됨

ObjectId는 12바이트 크기의 고유한 식별자로 다음과 같은 정보를 포함

- **4바이트**: 유닉스 타임스탬프 (문서가 생성된 시간)
- **5바이트**: 머신 ID (서버를 식별)
- **3바이트**: 프로세스 ID (MongoDB 프로세스를 식별)
- **3바이트**: 자동 증가하는 카운터 (같은 초에 생성된 ObjectId를 구별)

이러한 구조를 통해 ObjectId는 전 세계에서 고유성을 유지하며, 시간 정보도 포함하고 있어 언제 생성되었는지 확인할 수 있음

---

## 2. 왜 ObjectId를 사용하는가?

ObjectId는 분산된 환경에서도 고유성을 보장하기 위해 사용됨. 여러 서버에서 동시에 문서를 생성할 때도 충돌 없이 고유한 식별자를 생성할 수 있음

또한, ObjectId는 인덱싱되어 있어 MongoDB의 검색 성능을 최적화할 수 있음

예를 들어, 고객 테이블에서 각 고객을 고유하게 식별하기 위해 ObjectId를 사용하면, 주문 테이블에서 `customer_id` 필드를 통해 고객을 참조할 때 동일한 ObjectId를 사용하여 관계를 유지할 수 있음

---

## 3. ObjectId와 다른 데이터 타입의 관계

만약 `customer` 테이블의 `_id`가 int 형식이라면, 이를 참조하는 필드(`customer_id` 등)도 int 형식이어야 함. MongoDB는 타입에 민감하기 때문에, 참조하는 필드의 데이터 타입은 반드시 참조 대상 필드와 일치해야 함

따라서, `customer`의 `_id`가 ObjectId 형식인 경우, 이를 참조하는 모든 필드(`customer_id` 등)도 ObjectId 형식으로 설정해야 함

---

## 4. double 대신 decimal 또는 int?

**double**은 소수점 이하의 정밀한 값을 저장하기 위해 사용되지만, 금전적인 데이터를 다룰 때는 **decimal** 데이터 타입이 더 적합, decimal은 고정 소수점 연산을 지원하여 정밀도를 보장하며, double은 부동 소수점 연산을 사용하므로 큰 숫자를 처리할 때 약간의 오차가 발생할 수 있음

따라서, 금전적인 데이터를 처리할 때는 **decimal**을 사용하는 것이 좋음

---

## 5. auto는 어디에 사용되는가?

**auto**는 시스템이 자동으로 값을 생성하거나 갱신하는 필드를 나타냄. 예를 들어, `created_datetime`와 `updated_datetime` 필드는 문서가 처음 생성되거나 수정될 때 시스템이 자동으로 해당 값을 설정

---

## 6. MongoDB에서 참조(Reference)와 내장(Embedded) 방식

- **참조(Reference) 방식**: 한 컬렉션의 필드가 다른 컬렉션의 문서 ID를 참조하는 방식. 예를 들어, Order 컬렉션의 `customer_id` 필드가 Customer 컬렉션의 `_id`를 참조하는 경우. 두 컬렉션 간의 관계를 유지할 수 있음

- **내장(Embedded) 방식**: 한 컬렉션의 문서에 다른 컬렉션의 문서를 직접 포함하는 방식. 예를 들어, Order 문서에 Customer 정보를 내장할 수 있음. 데이터를 한 번에 가져올 수 있어 읽기 성능을 최적화하지만, 중복 데이터가 많아질 수 있다는 단점이 있음

---

## 7. Optional 필드와 Null 값

Optional로 설정된 필드는 Null 값을 허용함. 이는 해당 필드가 필수가 아니며, 값이 제공되지 않을 수 있음을 의미

---

## 8. 테이블 및 컬럼 ID와 대문자 사용

데이터베이스 설계에서는 가독성과 일관성을 유지하기 위해 테이블 ID와 컬럼 ID를 대문자로 작성하는 것이 일반적

