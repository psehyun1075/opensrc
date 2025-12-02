const $ = sel => document.querySelector(sel);

export const els = {
  startBtn:  $('#start-btn'),
  btnFile:   $('#btn-file'),
  btnCam:    $('#btn-cam'),
  btnPick:   $('#btn-pick'),
  inputPick: $('#pick-file'),
  musicToggle: $('#btn-music-toggle'),
  musicPick:   $('#btn-music-pick'),
  musicInput:  $('#music-input'),
  video:     $('#video'),
  canvas:    $('#canvas'),
  status:    $('#status'),
  ear:       $('#ear'),
  overlay:   $('#alarm-overlay'),
  thEar:     $('#th-ear'),
  thSec:     $('#th-sec'),
  btnPlay:   $('#btn-play'),
  btnReplay: $('#btn-replay'),
};

export function setStatus(text, cls){
  els.status.textContent = text;
  els.status.className = `text-3xl font-bold ${cls}`;
}
export function showOverlay(on){ els.overlay.classList.toggle('hidden', !on); }
