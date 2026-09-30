# JAYU PET Brush Game — final archive

## 프로젝트 개요

미국 반려견 관심층을 대상으로 만든 JAYU PET 덴탈 브러시 인터랙티브 게임의 최종 보관본이다. 기준 배포본은 아래 Meta 광고 추적용 완성본 링크이며, 2026-09-30에 배포 화면과 로컬 소스를 대조해 정리했다.

- 원본 작업 폴더: `work/vercel-game-public`
- 최종 보관 폴더: `work/jayupet-brush-game-final`
- 기준 배포 URL: <https://brush-jayupet.vercel.app/?utm_source=meta&utm_medium=paid_social&utm_campaign=us_pbdd_content_test_sep26&utm_content=brush_game_v1>
- 원본 및 현재 배포본: 수정·삭제하지 않음

## 처음 업무를 이어받는 경우

1. 회사 GitHub 저장소를 Clone하거나 ZIP으로 내려받습니다.
   - <https://github.com/grassmedimkt/jayupet-dental-brush-game>
2. 이 README와 `ASSET-LIST.md`를 먼저 확인합니다.
3. 아래 실행 방법에 따라 정적 화면과 게임 플레이를 로컬에서 확인합니다.
4. 수정 전 로컬 화면과 현재 배포본을 비교합니다.
5. 점수·순위·고객 동선까지 검증하려면 회사가 관리하는 Supabase 분석 환경을 준비합니다.
6. 수정이 끝나면 회사 Vercel 계정에서 GitHub 저장소를 Import해 배포합니다.
7. 배포 후 게임, 에셋, API, Supabase 이벤트, Amazon 이동을 확인합니다.
8. 정상 작동하는 새 Production URL을 인수인계 노션에 기록합니다.

## 로컬 실행

정적 화면과 게임 플레이는 이 폴더에서 HTTP 서버를 열어 확인한다.

### Windows PowerShell

```powershell
cd "다운로드한 jayupet-dental-brush-game 폴더의 전체 경로"
python -m http.server 8080
```

`python`이 인식되지 않으면 `py -m http.server 8080`을 사용합니다.

### macOS·Linux

```bash
cd "/다운로드한/jayupet-dental-brush-game/폴더"
python3 -m http.server 8080
```

브라우저에서 `http://127.0.0.1:8080/`을 엽니다. 파일을 직접 더블클릭하는 `file://` 실행은 브라우저 보안 정책 때문에 권장하지 않습니다. 로컬 HTTP 서버만으로는 정적 게임 화면을 확인할 수 있지만 Vercel Functions와 Supabase를 사용하는 점수·분석 기능은 동작하지 않습니다.

`/api/analytics`, `/api/config`, `/api/scores`는 Vercel Functions와 Supabase 환경을 전제로 한다. 전체 기능 검증에는 Vercel 또는 호환 서버리스 환경과 다음 환경 변수가 필요하다.

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

`META_PIXEL_ID`는 선택 항목이다. 현재 고객 동선 분석은 Meta Pixel이 아니라 Supabase의 `analytics_events` 데이터를 기준으로 하므로 설정하지 않아도 게임과 동선 기록 기능에 문제가 없다.

## 게임 진행 흐름

1. 페이지와 게임 에셋을 불러온다.
2. 사용자가 칫솔을 드래그해 치아의 오염 구역을 닦는다.
3. 구역이 정리될 때마다 점수가 올라간다.
4. 한 페이즈를 완료하면 먹기 연출 후 다음 페이즈로 진행한다.
5. 경고 후 실패하면 결과·점수·순위 화면을 보여준다.
6. 결과 이미지를 저장·공유하거나 Amazon 상품 링크를 통해 부활할 수 있다.

## 주요 수정 위치

- 게임 화면·로직·문구: `index.html`
- 웹앱 이름·아이콘: `manifest.webmanifest`
- 이미지: `asset/images/`
- 오디오: `asset/audio/`
- 고객 동선 저장 API: `api/analytics.js`
- 점수·순위 API: `api/scores.js`
- 선택적 Meta Pixel 설정 제공: `api/config.js`
- Supabase 기본 테이블: `supabase/schema.sql`
- 고객 동선 테이블: `supabase/analytics.sql`
- 성과 조회용 SQL: `supabase/analytics-report.sql`
- Amazon 부활·Attribution 링크: `index.html`의 `reviveProductUrl`
- 에셋별 파일명과 사용 위치: `ASSET-LIST.md`

## 폴더 구조

```text
jayupet-brush-game-final/
├─ index.html
├─ manifest.webmanifest
├─ package.json
├─ api/
│  ├─ analytics.js
│  ├─ config.js
│  └─ scores.js
├─ asset/
│  ├─ images/        # 실제 참조 이미지 20개
│  └─ audio/         # 실제 참조 오디오 7개
├─ supabase/
│  ├─ schema.sql
│  ├─ analytics.sql
│  └─ analytics-report.sql
├─ README.md
├─ ASSET-LIST.md
└─ SHA256SUMS.txt
```

## GitHub·Dropbox 분리 업로드

현재 보관본은 모든 에셋을 로컬 상대 경로(`asset/images/...`, `asset/audio/...`)로 참조하므로 그대로 실행된다.

1. GitHub에는 실행 가능한 전체 프로젝트와 `asset/` 폴더를 함께 올린다.
2. Dropbox에는 `asset/images/`와 `asset/audio/`를 원래 하위 구조 그대로 올려 별도 백업한다.
3. 일반적인 Vercel 배포에서는 GitHub에 포함된 현재 상대 경로를 그대로 사용한다.
4. 에셋을 GitHub에서 분리해 운영하기로 결정한 경우에만 직접 접근 가능한 공개 HTTPS URL 또는 CDN URL로 경로를 교체한다. 일반 Dropbox 공유 페이지 URL은 웹 에셋 URL로 사용할 수 없다.
5. 새 배포 도메인을 사용하면 `og:image`, `twitter:image`, 결과 공유 이미지와 공유 문구의 `brush-jayupet.vercel.app`도 새 주소로 변경한다.
6. 변경 후 브라우저 개발자 도구의 Network 탭에서 404와 CORS 오류가 없는지 확인한다.

## 재배포 주의사항

- Amazon 부활 링크와 어트리뷰션 파라미터는 `index.html`의 `reviveProductUrl`에 있다.
- 분석 및 점수 저장 API는 Supabase 서비스 역할 키를 사용하므로 키를 클라이언트 코드나 GitHub에 넣지 않는다.
- `supabase/` SQL은 데이터 구조와 리포트용이며 운영 DB에 다시 실행하기 전 내용을 검토한다.
- 현재 고객 동선은 `index.html` → `/api/analytics` → Supabase `analytics_events` 순서로 기록된다. Meta Pixel은 필수 분석 수단이 아니다.
- 향후 회사 계정에서 수정·재배포할 때는 회사가 관리하는 새 Supabase 프로젝트 또는 동등한 분석 서버를 먼저 구축한다.
- 새 Supabase를 사용하는 경우 `supabase/schema.sql`과 `supabase/analytics.sql`을 검토한 뒤 적용하고, 회사 Vercel 프로젝트의 Environment Variables에 `SUPABASE_URL`과 `SUPABASE_SERVICE_ROLE_KEY`를 등록한다.
- 기존 개인 Supabase의 URL과 서비스 역할 키를 복사해 GitHub·노션·문서에 기록하지 않는다. 새 서버를 사용한다면 회사 소유 환경변수로 교체한다.
- 다른 분석 서버를 구축하는 경우 `api/analytics.js`, `api/scores.js`, `api/config.js`와 `index.html`의 `/api/analytics` 호출부를 새 서버 구조에 맞게 수정한다.
- 재배포 후 `LandingView`, `GameReady`, `GameStart`, `FirstBrushContact`, `FirstZoneCleaned`, `GameOver`, `ResultViewed`, `AmazonOutboundClick` 등 주요 동선 이벤트가 새 분석 서버에 저장되는지 확인한다.
- 에셋 파일명을 바꾸면 `index.html`, `manifest.webmanifest`, 문서 및 체크섬을 함께 갱신한다.
- 새 배포 도메인을 쓰면 공유 문구, Open Graph/Twitter 이미지 URL도 함께 갱신한다.
- `SHA256SUMS.txt`는 파일 변경 후 다시 생성한다.

## 회사 계정으로 재배포

1. 회사 계정 `grassmedimkt@gmail.com`으로 Vercel에 로그인합니다.
2. 회사 GitHub 저장소 `grassmedimkt/jayupet-dental-brush-game`을 새 프로젝트로 Import합니다.
3. Framework Preset은 `Other`를 선택합니다. 별도 Build Command와 Output Directory는 설정하지 않습니다.
4. 회사가 관리하는 Supabase 프로젝트 또는 동등한 분석 서버를 준비합니다.
5. 새 Supabase를 사용할 경우 `supabase/schema.sql`과 `supabase/analytics.sql`을 검토한 뒤 적용합니다.
6. Vercel의 Settings → Environment Variables에 `SUPABASE_URL`과 `SUPABASE_SERVICE_ROLE_KEY`를 등록합니다.
7. `SUPABASE_SERVICE_ROLE_KEY`의 실제 값은 GitHub, 노션, README에 기록하지 않습니다.
8. 배포 후 아래 확인 항목을 점검하고 Production URL을 인수인계 노션에 기록합니다.

## 배포 후 확인

- 첫 화면과 게임 에셋이 정상적으로 표시되는가
- 이미지 20개와 오디오 7개가 누락되지 않는가
- 치아 판정 마스크와 점수 계산이 정상 작동하는가
- 경고·먹기·뽀뽀·결과 연출까지 진행되는가
- `/api/analytics`, `/api/config`, `/api/scores`가 오류 없이 응답하는가
- 점수 저장과 순위 조회가 새 Supabase에서 작동하는가
- `LandingView`, `GameReady`, `GameStart`, `FirstBrushContact`, `FirstZoneCleaned`, `GameOver`, `ResultViewed`, `AmazonOutboundClick` 이벤트가 저장되는가
- Amazon 부활 링크가 올바른 상품과 Attribution URL로 연결되는가
- 결과 저장·공유 문구와 이미지가 새 배포 도메인을 사용하는가
- 모바일 Safari와 Chrome에서 정상 작동하는가

## 관련 자료

- GitHub: <https://github.com/grassmedimkt/jayupet-dental-brush-game>
- 현재 배포본: <https://brush-jayupet.vercel.app/?utm_source=meta&utm_medium=paid_social&utm_campaign=us_pbdd_content_test_sep26&utm_content=brush_game_v1>
- Dropbox 이미지·오디오 백업: 업로드 후 인수인계 노션에 기록
- 업무 및 성과 기록: <https://app.notion.com/p/3c3d6c2c7d9d8018a105e1b3a1239c92>

## 보관본 변경 기록

게임 로직과 콘텐츠는 변경하지 않았다. 보관 폴더 구조를 통일하기 위해 복사본의 에셋 참조 경로만 `asset/images/`와 `asset/audio/`로 변경했고, manifest 아이콘 경로도 같은 구조로 맞췄다. 기준 원본과 배포본에는 변경을 가하지 않았다.
