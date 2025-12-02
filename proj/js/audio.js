// js/audio.js
// 단일 곡 무한반복 전용 오디오 모듈

let userGestureReady = false;   // 시작 버튼을 눌러 사용자 제스처 확보 여부
let fileBlobUrl = null;         // 선택된 음악 파일의 blob URL
let audioEl = null;             // <audio> 엘리먼트 (loop)
let isLooping = false;          // 현재 반복 재생 중 여부

export function markUserGestureReady(){ userGestureReady = true; }

// 사용자가 음악 파일 선택
export function setMusicFile(fileList){
  cleanupBlob();
  const f = (fileList && fileList[0]) ? fileList[0] : null;
  if(!f) return 0;

  fileBlobUrl = URL.createObjectURL(f);
  ensureAudio();
  audioEl.src = fileBlobUrl;
  return 1; // 1곡
}

// 감지 시 호출: 이미 재생 중이면 무시, 아니면 무한루프 시작
export async function startLooping(){
  if(!audioEl || !audioEl.src){
    console.warn('[audio] 음악 파일이 선택되지 않았습니다.');
    return false;
  }
  ensureAudio();
  audioEl.loop = true;
  try{
    // 사용자 제스처가 확보된 상태(시작 버튼 or 파일 선택)에서 play
    if (!userGestureReady){
      console.warn('[audio] 사용자 제스처가 없습니다. start-btn을 먼저 누르세요.');
      return false;
    }
    await audioEl.play();
    isLooping = true;
    console.log('[audio] looping start');
    return true;
  }catch(e){
    console.warn('audio play() 실패:', e);
    return false;
  }
}

// 수동 정지(버튼)
export function stopLooping(){
  if(!audioEl) return;
  try{ audioEl.pause(); }catch{}
  isLooping = false;
  console.log('[audio] looping stop');
}

// 외부에서 상태 조회용
export function isPlaying(){ return !!isLooping; }

// 내부 유틸
function ensureAudio(){
  if (!audioEl){
    audioEl = document.createElement('audio');
    audioEl.style.display = 'none';
    audioEl.preload = 'auto';
    audioEl.loop = true;
    document.body.appendChild(audioEl);
  }
}

function cleanupBlob(){
  if (fileBlobUrl){
    try{ URL.revokeObjectURL(fileBlobUrl); }catch{}
    fileBlobUrl = null;
  }
}
