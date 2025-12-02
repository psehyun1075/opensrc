import { setStatus } from './ui.js';

let rafId=0;

export function stopLoop(){ cancelAnimationFrame(rafId); }

export function startFile(videoEl, faceMesh, src){
  stopLoop();
  videoEl.srcObject = null;
  videoEl.src = src;
  videoEl.onloadeddata = () => {
    videoEl.play().catch(()=>{});
    loop(videoEl, faceMesh);
    setStatus('파일 재생 중','text-green-400');
  };
  videoEl.onerror = () => setStatus('비디오 로드 실패(경로/코덱 확인)','text-red-500');
}

function loop(videoEl, faceMesh){
  const step = async () => {
    if (!videoEl.paused && !videoEl.ended){
      await faceMesh.send({ image: videoEl });
    }
    rafId = requestAnimationFrame(step);
  };
  rafId = requestAnimationFrame(step);
}
