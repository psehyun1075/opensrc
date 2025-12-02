// js/ui.js
export const els = {
  // 상단 컨트롤
  startBtn:      document.getElementById('start-btn'),
  btnFile:       document.getElementById('btn-file'),
  btnCam:        document.getElementById('btn-cam'),
  btnPick:       document.getElementById('btn-pick'),
  inputPick:     document.getElementById('pick-file'),

  musicPick:     document.getElementById('btn-music-pick'),
  musicInput:    document.getElementById('music-input'),
  musicStop:     document.getElementById('btn-music-stop'),

  btnPlay:       document.getElementById('btn-play'),
  btnReplay:     document.getElementById('btn-replay'),

  // 비디오/캔버스
  video:         document.getElementById('video'),
  canvas:        document.getElementById('canvas'),

  // 상태판
  status:        document.getElementById('status'),
  ear:           document.getElementById('ear'),
  thEar:         document.getElementById('th-ear'),
  thSec:         document.getElementById('th-sec'),

  // 오버레이
  alarm:         document.getElementById('alarm-overlay'),
};

// ✅ 반드시 여기서 컨텍스트 바인딩
els.ctx = els.canvas.getContext('2d');

export function setStatus(text, cls) {
  els.status.textContent = text;
  els.status.className = `text-3xl font-bold ${cls}`;
}
