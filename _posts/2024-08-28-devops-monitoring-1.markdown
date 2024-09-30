---
layout: post
title: '[Monitoring] 리눅스에서 추가 HDD 마운트하기'
subtitle: '리눅스에서 추가 HDD 마운트하기'
categories: devops
tags: monitoring
comments: true
---

# 리눅스에서 추가 HDD 마운트하기

리눅스 시스템에 새로운 HDD를 추가했을 때, 디스크를 사용하려면 먼저 파티션을 생성하고 파일 시스템을 만들어야 함. 그 후, 특정 디렉토리에 마운트하여 사용할 수 있음

## 1. 파티션 생성

새로운 HDD를 확인하고 파티션을 생성하기 위해 `fdisk` 명령어를 사용함

```bash
sudo fdisk /dev/sdb
```

`fdisk`가 실행되면 다음 옵션을 사용하여 새로운 파티션을 만듦

- `n`: 새 파티션 생성
- `p`: Primary 파티션 선택
- 파티션 번호 지정 (예: 1)
- 첫 번째 섹터와 마지막 섹터는 기본값을 사용합니다.
- `w`: 변경 사항을 저장하고 `fdisk`를 종료

## 2. 파일 시스템 생성

새로 생성된 파티션 `/dev/sdb1`에 파일 시스템을 생성

```bash
sudo mkfs.ext4 /dev/sdb1
```

## 3. 마운트 지점 생성 및 마운트

마운트할 디렉토리 `/storage`를 생성하고, 파티션을 해당 디렉토리에 마운트

```bash
sudo mkdir -p /storage
sudo mount /dev/sdb1 /storage
```

## 4. 마운트 상태 확인

마운트 상태는 `lsblk` 명령으로 확인할 수 있음

```bash
lsblk -f
```

---

# 2. 재부팅 시 자동 마운트 설정

시스템이 재부팅될 때마다 `/storage`에 자동으로 마운트되도록 설정하려면 `/etc/fstab` 파일에 해당 파티션의 설정을 추가해야 함

## 2-1. UUID 확인

`/dev/sdb1`의 UUID를 확인

```bash
sudo blkid /dev/sdb1
```

출력된 결과에서 `UUID="abcd-1234-efgh-5678"`와 같은 형식을 복사

## 2-2. /etc/fstab 파일 수정

`/etc/fstab` 파일을 열어 수정

```bash
sudo nano /etc/fstab
```

파일의 맨 아래에 다음과 같은 형식으로 새 항목을 추가

```
UUID=abcd-1234-efgh-5678   /storage   ext4   defaults,nofail   0   0
```

- `nofail` 옵션을 추가하여, 마운트가 실패해도 부팅이 중단되지 않도록 설정

## 2-3. 변경 사항 적용 및 확인

설정이 올바른지 확인하기 위해 모든 파일 시스템을 다시 마운트

```bash
sudo mount -a
```


---

# 3. 문제 해결: 잘못된 /etc/fstab 설정으로 인한 부팅 문제

`/etc/fstab` 파일에 잘못된 설정이 있으면 부팅 시 무한 재부팅 또는 CLI 모드로 진입하는 문제가 발생할 수 있음. 이 경우 복구 모드로 부팅하여 `fstab` 파일을 수정해야 함

## 3-1. 복구 모드로 부팅

시스템을 재부팅하고, GRUB 메뉴가 나타날 때까지 Shift 또는 Esc 키를 누름
- "Advanced options for Ubuntu" 또는 "Recovery mode"를 선택
- "Drop to root shell prompt"를 선택하여 루트 셸에 접근

## 3-2. /etc/fstab 파일 수정

`/etc/fstab` 파일을 열어 문제 있는 항목을 수정하거나 주석 처리

```bash
nano /etc/fstab
```

## 3-3. 파일 저장 후 재부팅

변경 사항을 저장하고 재부팅하여 문제가 해결되었는지 확인

```bash
reboot
```