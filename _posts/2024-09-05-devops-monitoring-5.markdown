---
layout: post
title: '[Monitoring] 리눅스 원격 연결 시 SSH 접속 에러 해결'
subtitle: 'Connection refused, Timed out 오류 해결'
categories: devops
tags: monitoring
comments: true
---

# 리눅스 원격 연결 시 에러

## 문제 상황

리눅스 서버에 SSH로 원격 접속하려고 했으나, "Connection refused" 또는 "Timed out" 오류가 발생하여 접속할 수 없었음. 서버는 고정 IP로 설정되어 있었음

## 원인 찾기

- **고정 IP 주소 중복 설정**: 네트워크에서 여러 장치가 동일한 고정 IP 주소를 사용하도록 설정되어 있었을 수 있음
- **DHCP 서버 문제**: DHCP 서버가 고유한 IP 주소를 각 장치에 제대로 할당하지 못했거나, IP 주소가 만료되지 않고 다른 장치에 재사용되었을 수 있음
- **네트워크 설정 오류**: 라우터나 스위치 등의 네트워크 장비 설정 오류로 IP 주소가 중복되었을 가능성이 있었음

## 해결하려고 시도했던 방법

### 1. 기본 설정 확인

- 서버의 IP 주소와 포트 번호가 올바른지 확인함
- 서버에 직접 접속해 SSH 설정 파일(`/etc/ssh/sshd_config`)을 확인하고, SSH가 적절한 포트에서 수신 대기 중인지 확인함
- SSH 서비스가 실행 중인지 확인하고, 실행 중이 아니면 `sudo service ssh start` 또는 `sudo systemctl start sshd` 명령어로 서비스를 시작했음

### 2. 네트워크 문제 해결

- 네트워크에서 충돌이 발생한 장치들을 확인하고, 동일한 IP 주소를 사용하고 있는 장치들을 찾아냄
- `ipconfig` (Windows) 또는 `ifconfig` (Linux/Mac) 명령어를 사용해 각 장치의 IP 주소를 확인

## 문제 해결 과정

- 리눅스 서버가 고정 IP로 설정되어 있었고, 다른 장치와 IP 주소가 중복되어 있었음
- 고정 IP 주소를 조정하고, DHCP 서버 설정을 검토해 IP 주소 충돌을 방지함
- 장치를 재부팅하고, IP 주소 충돌 문제를 해결한 후 SSH 접속이 정상적으로 이루어짐
