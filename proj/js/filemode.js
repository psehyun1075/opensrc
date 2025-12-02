// js/filemode.js
import { setStatus } from './ui.js';

let rafId = 0;

export function stopLoop() {
  cancelAnimationFrame(rafId);
}

export function startFile(videoEl, faceMesh, src) {
  stopLoop();

  // 소스 지정
  if (src) videoEl.src = src;
  videoEl.muted = true;         // 자동재생 보장
  videoEl.playsInline = true;

  // 메타데이터 로드 후 재생 + 루프 시작
  videoEl.onloadeddata = () => {
    videoEl.play().catch(()=>{});
    loop(faceMesh, videoEl);
    setStatus('파일 재생 중', 'text-green-400');
  };

  videoEl.onerror = () => {
    setStatus('비디오 로드 실패(경로/코덱 확인)', 'text-red-500');
  };
}

function loop(faceMesh, videoEl) {
  const step = async () => {
    // 파일 모드에서만 반복 처리
    if (!videoEl.paused && !videoEl.ended) {
      // ✅ 프레임을 FaceMesh로 전달
      await faceMesh.send({ image: videoEl });
    }
    rafId = requestAnimationFrame(step);
  };
  rafId = requestAnimationFrame(step);
}
