2026-05-14 jaemin
header 부분 

App
└── Header
    ├── header_logo
    ├── header_nav
    │   ├── nav-item (Home) ← active
    │   ├── nav-item (Explore)
    │   ├── nav-item (Create)
    │   └── nav-item (Chat) ← hasBadge
    └── header_right
        ├── header_bell ← hasBadge
        └── header_profile

header_nav에서 margin-left로 navbar 조절 가능하다. 
다차원 배열을 활용하여 데이터를 분리했음 -> map을 통하여 순회하면서 값을 넣었다. 그래서 값을 추가하거나 수정할 때 찾기 용이하다.
나중에 채팅이나 알람 활용을 대비해 badge 기능을 만들었다. 
각 navbar을 hover하면 색깔이 바뀐다. 

Position: 
[CKR]  ←── auto gap ──→  [Home Explore Create Chat]  [margin-left: 24px on header_right ]  [🔔  ●]


