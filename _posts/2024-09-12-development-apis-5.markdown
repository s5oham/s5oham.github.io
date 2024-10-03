---
layout: post
title: '[APIs] HTTP 204 상태 코드 처리 에러 해결'
subtitle: 'HTTP 204 상태 코드 처리 에러 해결'
categories: development
tags: apis
comments: true
---


# HTTP 204 상태 코드 처리 에러 해결

API에서 고객 데이터를 삭제하는 DELETE 요청을 처리하던 중, 데이터는 정상적으로 삭제되었지만 "Delete failed"라는 메시지만 반환되었음

```python
if code == 200:
    return {'message': 'Customer deleted successfully'}, 200
else:
    return {'message': 'Delete failed'}, 500
```

## 문제 분석
- MongoDB 응답 값을 출력해본 결과, 삭제가 정상적으로 완료되었음에도 불구하고 204 상태 코드가 반환됨
- DELETE 요청이 성공적으로 처리되었을 때 204 No Content도 반환될 수 있기 때문에, 이를 반영해 코드를 수정

## HTTP 상태 코드 정리
- **200 OK**: 요청이 성공적으로 처리됐고, 일반적으로 반환할 데이터가 있음
- **201 Created**: 요청이 성공적으로 처리됐고, 새로운 리소스가 생성됐을 때 사용됨
- **202 Accepted**: 요청이 접수됐지만 아직 처리되지 않았을 때 사용됨. 주로 비동기 작업에서 사용됨
- **204 No Content**: 요청이 성공적으로 처리됐지만, 반환할 데이터가 없을 때 사용됨. DELETE 요청 후 자주 사용됨

> DELETE 요청에서 204 No Content는 정상적인 응답 코드이므로, 이를 반드시 성공으로 간주하고 처리해야 함
