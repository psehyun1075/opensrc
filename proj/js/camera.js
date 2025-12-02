import { CONFIG } from './config.js';
import { setStatus } from './ui.js';

let camera=null;

export async function startCamera(videoEl, faceMesh){
  stopCamera(videoEl);
  setStatus('카메라 초기화 중...','text-blue-400');
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
    alert('HTTPS 또는 http://localhost 에서 실행하세요.');
    setStatus('카메라 시작 실패(보안 컨텍스트 아님)','text-red-500'); return;
  }
  camera = new Camera(videoEl, {
    onFrame: async () => { await faceMesh.send({ image: videoEl }); },
    width: CONFIG.VIDEO.WIDTH, height: CONFIG.VIDEO.HEIGHT
  });
  await camera.start();
  setStatus('카메라 동작 중','text-green-400');
}

export function stopCamera(videoEl){
  if (camera && camera.stop) camera.stop();
  const s = videoEl.srcObject;
  if (s) s.getTracks().forEach(t=>t.stop());
  videoEl.srcObject=null;
}
