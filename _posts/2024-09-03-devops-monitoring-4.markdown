---
layout: post
title: '[Monitoring] InfluxDB v1 웹 인터페이스 에러'
subtitle: 'InfluxDB v1.x에서 웹 인터페이스 사용 불가 오류'
categories: devops
tags: monitoring
comments: true
---

# InfluxDB v1 웹 인터페이스 에러

## 문제 상황

InfluxDB v1.x 버전에서는 `localhost:8086`으로 접속했을 때 "404 page not found" 오류가 발생

## 원인

InfluxDB v1.x는 기본적으로 웹 인터페이스를 제공하지 않음. 웹 인터페이스는 InfluxDB v2부터 지원

## 결론

웹 인터페이스는 사용할 수 없으며, CLI나 외부 도구(Grafana 등)를 사용해야 함
