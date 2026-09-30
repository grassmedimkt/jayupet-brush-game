# Asset list

최종 보관본에 포함된 파일은 모두 `index.html` 또는 `manifest.webmanifest`가 실제로 참조한다.

## 이미지 — 실제 사용 20개

| 파일명 | 사용 위치·용도 |
|---|---|
| `오늘도-이빨-닦기_가로형_기본무광-잔상제거-v3.png` | 기본 게임 배경의 깨끗한 치아 강아지 |
| `dirty-concept-v2-plaque-tartar-앞송곳니보강-잔상제거-v6.png` | 치석·오염 마스터 레이어 |
| `zone-1-mask-exact-v6.png` | 닦기 판정 구역 1 마스크 |
| `zone-2-mask-draft-v5.png` | 닦기 판정 구역 2 마스크 |
| `zone-3-mask-draft-v1.png` | 닦기 판정 구역 3 마스크 |
| `zone-4-mask-draft-v1.png` | 닦기 판정 구역 4 마스크 |
| `zone-5-mask-draft-v1.png` | 닦기 판정 구역 5 마스크 |
| `zone-6-mask-draft-v1.png` | 닦기 판정 구역 6 마스크 |
| `zone-7-mask-draft-v1.png` | 닦기 판정 구역 7 마스크 |
| `zone-8-mask-draft-v1.png` | 닦기 판정 구역 8 마스크 |
| `zone-9-mask-draft-v1.png` | 닦기 판정 구역 9 마스크 |
| `zone-10-mask-draft-v1.png` | 닦기 판정 구역 10 마스크 |
| `phase-meal-dog.png` | 페이즈 완료 후 먹기 전환 연출 |
| `warning-dog.png` | 경고 표정 연출 |
| `kiss-dog.png` | 실패 시 뽀뽀 연출 |
| `lens-smear.png` | 실패 시 렌즈 침·음식물 오버레이 |
| `jayupet-logo-round.png` | 게임 로고, favicon, PWA 아이콘 |
| `jayupet-logo.png` | 결과 화면 로고 |
| `jayupet-toothbrush-real-v1.png` | 드래그 가능한 칫솔 |
| `gameplay-preview.png` | Open Graph 및 Twitter 공유 미리보기 |

## 오디오 — 실제 사용 7개

| 파일명 | 사용 위치·용도 |
|---|---|
| `button-tap-dog-bark.mp3` | 버튼 탭·짖음 효과 |
| `dog-panting-loop.wav` | 게임 중 헐떡임 루프 |
| `tooth-brushing-scrub.mp3` | 칫솔질 효과 |
| `warning-angry-dog.mp3` | 경고 효과 |
| `dog-eating-crunch.mp3` | 페이즈 전환 먹기 효과 |
| `kiss-smooch.mp3` | 실패 뽀뽀 효과 |
| `result-sad-trombone.mp3` | 결과 화면 효과 |

## 미사용 후보 파일

원본 작업 폴더에는 다음 계열의 후보·검토·테스트 파일이 있었으나 최종 코드가 참조하지 않아 보관본에서 제외했다.

- `경고신호_*`, `탈락연출_*`, `페이즈전환_*` 후보 이미지
- `오늘도-이빨-닦기_*`의 이전 버전 및 대안 표정 이미지
- `dirty-concept-*`, `sample-dirty-*`의 이전 오염 시안
- `zone-*-grid-review*`, `zone-*-dirty-*`, `zone-*-preview-*`, `zone-*-mask-review-*`, 이전 mask 버전
- `jayupet-toothbrush-game.svg` 및 이전 칫솔 시안
- `gameplay-preview-source.png`
- `tooth-brushing-loop.mp3`, `warning-growl.wav`

제외 판단 기준은 파일명이나 외관 추정이 아니라 최종 `index.html` 및 `manifest.webmanifest`의 실제 참조 여부다.
