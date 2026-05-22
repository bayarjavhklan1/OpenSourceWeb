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





검색 기능 도중에 카테고리를 누르면 검색이 안되는 오류 발생 
-> 카테고리 누르면 검색 키워드를 다 삭제 시키는 기능 추가 

카드 그리드의 경우 조건에 안 맞으면 홤녀에서 숨겨야하는 것이여서 fliltered 배열에서 완전히 삭제 되어서 그냥 추출하면 되었는데 
카테고리 탭은 선택이 안되든 되든 다 보여줘야하기 때문에 선택을 해도 여전히 화면에 남아 있어야한다.
1. 항상 화면에 보여주기 
2. 선택을 하면 해당 선택된거 스타일 적용되기 -> 이걸 하려면 조건부로 삼항 연산자를 사용해서 구현해야함 => 문법을 찾아보기 = 조건부 랜더링 


// React 공식 문서 예시 -> isPacked가 true이면 name + ' ✅'를 렌더링하고, false이면 name만 렌더링한다 +. 
return (
  <li className="item">
    {isPacked ? name + ' ✅' : name}
  </li>
);


className={`dp-tab ${activeTab === tab ? "dp-tab--active" : ""}`}
ㄴ 이렇게 문법을 깔끔하게 하기 위해서 js 문법인 ``을 사용함 
ex: 
var a = 5;
var b = 10;
console.log(`Fifteen is ${a + b} and
not ${2 * a + b}.`);
// "Fifteen is 15 and
// not 20."
참고 링크 : https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Template_literals




css: 
gap 사용으로 사이 간격 넓힘 
반응형 웹 구현을 위해 display : flex 활용 
bootstrap의 
ㄴ @media query 이용해서 태블릿 or 작은 노트북에서도 알맞는 비율로 사용 가능 
db에 있는 정보를 어떤식으로 화면에 송출 할 지에 대해서 고민을 함

1. 전통적인 방식 css -> react라서 따로 구현하기가 복잡함 
2. flexbox 활용 -> flex-wrap:wrap을 활용해서 자리가 부족하면 다음 줄 자동 넘김을 활용해서 구현하려고 했음 
width : calc(100% / 3) -> 비율 조정 
ㄴ 100% -30px해야지 비율이 맞음 
min-width: 250px로 고정 

근데 이러면 다른 모바일 환경에 대해서 잘 안됨 -> 비율이 안맞음 

찾아본게 grid 방식 
참고 링크: https://developer.mozilla.org/ko/docs/Web/CSS/Guides/Grid_layout/Basic_concepts



``으로 