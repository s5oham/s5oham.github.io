---
layout: post
title: '[Monitoring] Telegraf, InfluxDB, Grafana를 활용한 시스템 모니터링 구축'
subtitle: 'Telegraf, InfluxDB, Grafana를 활용한 시스템 모니터링 구축'
categories: devops
tags: monitoring
comments: true
---

# Telegraf, InfluxDB, Grafana를 활용한 시스템 모니터링 구축

## 1. Telegraf: 다양한 시스템 메트릭(CPU, 메모리, 디스크 사용량 등)을 수집하는 에이전트
## 2. InfluxDB: 시계열 데이터베이스로, Telegraf가 수집한 데이터를 저장
## 3. Grafana: InfluxDB에 저장된 데이터를 시각화하여 모니터링 대시보드를 구축하는 도구

---

## 설치 및 설정 과정 (Windows & Linux)

### 1) Telegraf 설치 및 설정 (Windows)

#### Telegraf 다운로드 및 설치

```powershell
# PowerShell에서 Telegraf 다운로드
wget https://dl.influxdata.com/telegraf/releases/telegraf-1.31.2_windows_amd64.zip -UseBasicParsing -OutFile telegraf-1.31.2_windows_amd64.zip

# 다운로드한 파일의 압축을 풀기
Expand-Archive .	elegraf-1.31.2_windows_amd64.zip -DestinationPath 'C:	elegraf'
```

#### Telegraf 설정 파일(telegraf.conf) 편집

Windows에서 다양한 메트릭을 수집하기 위해 아래와 같이 설정

```powershell
notepad c:/telegraf/telegraf-1.31.2/telegraf.conf
```

```plaintext
[[inputs.win_perf_counters]]
  [[inputs.win_perf_counters.object]]
    ObjectName = "Processor"
    Instances = ["*"]
    Counters = ["% Idle Time", "% Interrupt Time", "% Privileged Time", "% User Time", "% Processor Time"]
    Measurement = "win_cpu"

  [[inputs.win_perf_counters.object]]
    ObjectName = "Memory"
    Counters = ["Available Bytes", "Committed Bytes", "Cache Faults/sec"]
    Measurement = "win_mem"

[[inputs.win_services]]
  servicenames = ["W3SVC", "BITS", "WinRM", "MSSQLSERVER"]

[[inputs.win_eventlog]]
  xpath_queries = [
    "Event[System[Provider[@Name='Microsoft-Windows-Security-Auditing']]]",
    "Event[System[Provider[@Name='Application Error']]]"
  ]
```

#### Telegraf 테스트 모드 실행

```powershell
cd "C:	elegraf	elegraf-1.31.2"
.	elegraf.exe --config .	elegraf.conf --test
```

#### Telegraf 서비스 시작 및 재시작

```powershell
Start-Service telegraf
Restart-Service telegraf
```

---

### 2) Telegraf 설치 및 설정 (Linux)

#### Telegraf 설치 (Ubuntu/Debian)

```bash
sudo apt-get update && sudo apt-get install -y telegraf
```

#### Telegraf 설정 파일(telegraf.conf) 편집

```bash
sudo nano /etc/telegraf/telegraf.conf
```

- **CPU 메트릭 수집**

```plaintext
[[inputs.cpu]]
  percpu = true
  totalcpu = true
  collect_cpu_time = false
  report_active = false
```

- **메모리 메트릭 수집**

```plaintext
[[inputs.mem]]
```

- **디스크 I/O 메트릭 수집**

```plaintext
[[inputs.diskio]]
```

- **디스크 사용량 메트릭 수집**

```plaintext
[[inputs.disk]]
  ignore_fs = ["tmpfs", "devtmpfs", "devfs", "iso9660", "overlay", "aufs", "squashfs"]
```

- **스왑 메모리 메트릭 수집**:

```plaintext
[[inputs.swap]]
```

#### Telegraf 테스트 모드 실행

```bash
sudo telegraf --config /etc/telegraf/telegraf.conf --test
```

#### Telegraf 서비스 시작 및 재시작

```bash
sudo systemctl start telegraf
sudo systemctl restart telegraf
```

---

### 3) InfluxDB 설치 및 설정

#### Ubuntu/Debian

```bash
wget -qO- https://repos.influxdata.com/influxdb.key | sudo apt-key add -
source /etc/os-release
echo "deb https://repos.influxdata.com/${ID} ${VERSION_CODENAME} stable" | sudo tee /etc/apt/sources.list.d/influxdb.list
sudo apt-get update && sudo apt-get install -y influxdb
```

#### InfluxDB 실행 (윈도우, 리눅스 각각)

- Windows

```powershell
cd "C:\Program Files\InfluxData\influxdb"
.\influxd.exe
```

- Linux

```bash
sudo systemctl start influxdb
```

#### InfluxDB 웹 UI를 통한 데이터베이스 설정

브라우저에서 http://localhost:8086로 이동하여 초기 설정을 완료하고 Telegraf 데이터를 저장할 Bucket을 생성

---

### 4) Grafana 설치 및 설정

#### Ubuntu/Debian

```bash
sudo apt-get install -y software-properties-common
wget -q -O - https://packages.grafana.com/gpg.key | sudo apt-key add -
sudo add-apt-repository "deb https://packages.grafana.com/oss/deb stable main"
sudo apt-get update && sudo apt-get install -y grafana
```

#### Grafana 서비스 시작 및 상태 확인

```bash
sudo systemctl start grafana-server
sudo systemctl status grafana-server
```

#### Grafana 웹 UI에 접근

브라우저에서 http://localhost:3000으로 이동하여 기본 로그인 정보는 admin/admin으로 로그인

---
