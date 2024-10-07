---
layout: post
title: '[APIs] 고객 관리 CRUD 구현 에러 해결'
subtitle: '고객 관리 CRUD 구현 에러 해결'
categories: development
tags: apis
comments: true
---

# 고객 정보 CRUD API 구현 중 발생한 문제들

## 1. 날짜 형식 변환 문제
클라이언트와 서버 간 날짜 형식 불일치로 인해 `time data does not match format` 오류 발생

**해결 방안**
- ISO 8601 형식(예: '%Y-%m-%dT%H:%M:%SZ')으로 일관되게 날짜를 파싱하고 변환하여 클라이언트와 서버 간의 형식 차이를 해결

## 2. Swagger 문서의 잘못된 필수 필드 설정
Swagger 문서에서 필수 필드와 선택적 필드가 제대로 구분되지 않아 사용자가 모든 필드를 입력해야 하는 문제 발생

**해결 방안**
- `required` 속성을 명확히 설정하여 필수 필드만 사용자가 입력하도록 변경

## 3. 날짜 필드 자동 설정 문제
고객 등록 시 `created_datetime`과 `updated_datetime`이 자동으로 설정되지 않음

**해결 방안**
- 고객 등록 및 업데이트 시 현재 시간을 기준으로 `created_datetime`과 `updated_datetime` 필드를 자동으로 설정하도록 수정

## 4. 데이터 삭제 오류 처리
삭제할 고객이 존재하지 않는 경우에도 일반적인 실패 메시지 반환

**해결 방안**
- 고객 삭제 시 존재 여부를 먼저 확인하고, 존재하지 않을 경우 적절한 404 오류 메시지를 반환하도록 수정
