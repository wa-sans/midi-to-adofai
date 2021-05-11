# midi-to-adofai

[node.js](https://nodejs.org/ko/) 설치해야함

*모듈까는법알려주기기차나서대신너어드렷습니다~*

## 사용법

`run.bat` 실행하면 됨

나오는숫자는 타일수

## 설정

midiToAdofai(  `midi파일`, `bpm`, `트랙(일반적으로 1, 아니면 0부터 계속 올라가다보면 됨)`, `출력파일이름(선택사항)`, `아티스트(선택사항)`, `노래(선택사항)`)

### 음 옥타브 조정

`conveter.js` 13번째줄

```javascript
function nHz(n)
{
  return 55*Math.pow(2,(n-9-12*(내릴 옥타브))/12);
}
```
