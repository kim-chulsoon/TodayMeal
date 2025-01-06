# TodayMeal
> 요리 영상과 메모 기능을 통합한 웹 플랫폼

YOUTUBE api와 CKEditer를 활용한
유튜브 영상의 레시피를 메모로 정리할 수 있는 웹 플랫폼입니다.

![image](https://github.com/user-attachments/assets/9cc6794a-987d-4e16-8e40-6e2326c8a182)

## 프로젝트 개요

TodayMeal은 유튜브 동영상의 레시피를 간단하게 기록하고 저장할 수 있는 웹 서비스입니다.

목표: 수업에서 배운 웹 개발 기술을 활용하고 응용하여 웹 사이트 개발  
개발 인원: 4명(팀 프로젝트)  
개발 기간: 2024.12.09 ~ 2024.12.30  



## 주요 기능

### 1. 검색 기능

![SHANA 검색](https://github.com/user-attachments/assets/ce63173d-dc7f-4eed-8c6a-9dea9cb37984)

YOUTUBE API를 활용하여 검색 기능을 구현했습니다.


### 2. 메모 기능

![SHANA 메모](https://github.com/user-attachments/assets/830a207f-6f72-43b4-b93d-5db79d61cd84)


CKEditer를 활용해 문자 스타일링이 적용되는 메모의 작성 및 수정, 삭제 기능을 구현했습니다.


### 3. 회원가입 및 로그인

![SHANA 회원가입](https://github.com/user-attachments/assets/50da5a2b-f1a7-4807-b4e0-853e58c1e6a8)  
회원가입

![SHANA 로그인](https://github.com/user-attachments/assets/a62df80f-d50d-40b1-ad0d-6b6545053f04)

bcyrpt를 이용한 비밀번호 암호화와  
JWT를 활용한 로그인 기능을 구현했습니다.


### 4. 반응형 페이지

![SHANA 반응형](https://github.com/user-attachments/assets/41abf6e5-4ca7-4059-9c51-089b4a2da32b)

모바일 환경에서의 사용을 위한 반응형 페이지를 구현했습니다.


## 기술 스텍

|제목|내용|
|:---:|:---:|
|Frontend|![EJS Badge](https://img.shields.io/badge/EJS-8BC34A?style=for-the-badge&logoColor=white) ![CSS3 Badge](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) ![JavaScript Badge](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) ![CKEditor Badge](https://img.shields.io/badge/CKEditor-31A8FF?style=for-the-badge&logoColor=white)|
|Backend|![Node.js Badge](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![Express.js Badge](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) ![YouTube API Badge](https://img.shields.io/badge/YouTube_API-FF0000?style=for-the-badge&logo=youtube&logoColor=white)|
|Database|![MySQL Badge](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)|
|DevOps|![AWS Badge](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white)|


## ERD

![image](https://github.com/user-attachments/assets/9624a8f1-bec4-4ea8-8d44-6543aa6b7f44)

테이블간의 1:다 구조를 통해 효율적인 데이터 관리를 구현했습니다.


## 개발 과정

### 1. UI & UX

수업시간에 배운 기능의 복습이 목적이었기 때문에, 프레임워크 없이 순수 CSS로 스타일링했습니다.
Common.css로 자주 사용하는 스타일을 공용화하여 재사용했으며, 이를 통해 일관된 디자인을 유지하고 유지보수에 용이하게 만들었습니다.

또한, 모바일 유저를 위해 모바일 환경에서 Quick 메뉴 추가로 네비게이션 편의성 향상을 도모했습니다.

### 2. 코드 설계

프로젝트를 MVC 구조로 설계하고, Axios를 사용해 서버와의 비동기 통신을 구현했습니다.

### 3. 협업 & 버전관리

Notion과 slack을 통해 팀원과 소통하였으며, Git flow를 통해 main 브런치와 develop 브런치를 구분하여 버전 관리에 용이하게 하였습니다.
또한, Pull Request를 통해 push 전 팀원이 코드를 확인하게 하여 충돌의 가능성을 낮추었습니다.


## 설치 방법

### 1. 리포지토리 클론

```
git clone https://github.com/kim-chulsoon/TodayMeal.git
cd TodayMeal
```

### 2. 환경 변수 설정

.env 파일을 생성해주세요
```
DB_PASSWORD=1234
DB_DATABASE=meal
DB_HOST=127.0.0.1
DB_USERNAME=sesac

DB_PROD_PASSWORD=1234
DB_PROD_DATABASE=meal
DB_PROD_HOST=13.125.200.133
DB_PROD_USERNAME=user

SECRET_KEY=

YOUTUBE_API_KEY1 = 
YOUTUBE_API_KEY2 = 
YOUTUBE_API_KEY3 = 

PORT = 8080
```

### 3. 의존성 설치

```
npm install
```

### 4. 개발 서버 실행

```
nodemon app
```

### 5. 브라우저에서 확인

http://localhost:8000



## Contact
개발자: @kim-chulsoon, @BugSquasher2400, @juyun77, @hjink11  
이메일: nink90@gmail.com




