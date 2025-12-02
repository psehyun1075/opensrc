import { CONFIG } from './config.js';
import { els, setStatus } from './ui.js';
import { initAudio, beepOnce, playMusic, stopMusic, toggleMusic, setMusicFiles } from './audio.js';
import { buildFaceMesh } from './detection.js';
import { startCamera, stopCamera } from './camera.js';
import { startFile, stopLoop } from './filemode.js';

els.thEar.textContent = CONFIG.EAR_THRESHOLD.toFixed(2);
els.thSec.textContent = (CONFIG.HOLD_MS/1000).toFixed(1);

let faceMesh = buildFaceMesh();
let mode = 'file';

// 시작(오디오 권한)
els.startBtn.addEventListener('click', async ()=>{
  await initAudio();
  els.startBtn.classList.add('hidden');
  setStatus('대기 중','text-blue-400');
});

// 모드 전환
els.btnFile.addEventListener('click', ()=> {
  mode='file';
  stopCamera(els.video);
  startFile(els.video, faceMesh, 'assets/video/drowsy_test_video.mp4');
});
els.btnCam.addEventListener('click', async ()=>{
  mode='cam';
  stopLoop();
  await startCamera(els.video, faceMesh);
});

// 파일 선택
els.btnPick.addEventListener('click', ()=> els.inputPick.click());
els.inputPick.addEventListener('change', e=>{
  const f = e.target.files[0]; if(!f) return;
  mode='file';
  stopCamera(els.video);
  startFile(els.video, faceMesh, URL.createObjectURL(f));
});

// 재생/처음부터 (파일 모드만)
els.btnPlay.addEventListener('click', ()=>{
  if (mode!=='file') return;
  if (els.video.paused){ els.video.play().catch(()=>{}); }
  else { els.video.pause(); }
});
els.btnReplay.addEventListener('click', ()=>{
  if (mode!=='file') return;
  els.video.currentTime = 0;
  els.video.play().catch(()=>{});
});

// 음악 알람
els.musicToggle.addEventListener('click', ()=>{
  const on = toggleMusic();
  els.musicToggle.textContent = `음악 알람: ${on ? 'ON' : 'OFF'}`;
  if (!on) stopMusic();
});
els.musicPick.addEventListener('click', ()=> els.musicInput.click());
els.musicInput.addEventListener('change', ()=>{
  const n = setMusicFiles(els.musicInput.files);
  alert(n ? `음악 ${n}개 로드됨.` : '선택된 음악이 없습니다.');
});

// 초기: 파일 모드 시작
startFile(els.video, faceMesh, 'assets/video/drowsy_test_video.mp4');
