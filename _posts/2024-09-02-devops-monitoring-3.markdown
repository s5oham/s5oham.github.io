---
layout: post
title: '[Monitoring] 모니터링 구축 에러 해결'
subtitle: '모니터링 구축 에러 해결'
categories: devops
tags: monitoring
comments: true
---

# 오류 해결 과정

1. Telegraf Windows 서비스 설정 오류 해결
- sc.exe 명령어는 윈도우 파워쉘이 아닌 cmd창에 입력해야함. (관리자 권한으로 명령 프롬프트 실행)
- sc.exe delete "Telegraf" 로 기존 서비스 삭제 시에 삭제 반영까지 조금 걸림

2. InfluxDB에서 Windows와 Linux의 데이터를 구분하여 수집
- Windows와 Linux에서 각각 Telegraf를 설정하여 데이터를 수집할 때, 데이터베이스 이름이 같아 혼동이 발생할 수 있음
- Windows와 Linux에서 Telegraf의 설정 파일(telegraf.conf)이 동일한 이름을 사용하고 있어서 InfluxDB에서 두 시스템의 데이터가 혼동되었으며, 윈도우에서는 win_telegraf.conf, 리눅스에서는 telegraf.conf로 지정함

3. Telegraf 설정 파일 win_perf_counters 및 win_services 수정
- 기본 설정 파일에는 수집할 성능 카운터(메모리, 디스크, cpu 등의 리소스)와 서비스가 제대로 정의되어 있지 않았음. 따라서 Telegraf가 원하는 데이터를 수집하지 못하여, 아래와 같이 주석을 해제하여 수정하였다.

```bash
[[inputs.win_perf_counters]]
  ## CPU 사용률 수집
  [[inputs.win_perf_counters.object]]
    ObjectName = "Processor"
    Instances = ["*"]
    Counters = ["% Idle Time", "% Interrupt Time", "% Privileged Time", "% User Time", "% Processor Time"]
    Measurement = "win_cpu"

  ## 메모리 사용률 수집
  [[inputs.win_perf_counters.object]]
    ObjectName = "Memory"
    Counters = ["Available Bytes", "Cache Faults/sec", "Page Faults/sec", "Pages/sec"]
    Measurement = "win_mem"

  ## 디스크 I/O 성능 수집
  [[inputs.win_perf_counters.object]]
    ObjectName = "PhysicalDisk"
    Instances = ["*"]
    Counters = ["Disk Read Bytes/sec", "Disk Write Bytes/sec", "Current Disk Queue Length"]
    Measurement = "win_diskio"
```
4. 데이터 수집 오류: Telegraf와 InfluxDB 연결 문제
Telegraf가 InfluxDB에 데이터를 전송하지 못하는 문제가 있었음
- InfluxDB URL 확인: telegraf.conf에서 urls = ["http://<InfluxDB 서버 IP>:8086"]로 설정을 확인
- 사용자 이름과 비밀번호가 정확한지 확인

```bash
telegraf --config telegraf.conf --test
```
