// js/detection.js
import { CONFIG } from './config.js';
import { els, setStatus } from './ui.js';
import { startLooping, isPlaying } from './audio.js';

const LIDX = [33,160,158,133,153,144];
const RIDX = [362,385,387,263,373,380];

const earBuf = [];
let lowStart = null;
let lastSeen = 0;
let graceUntil = 0;

const now = () => performance.now();
const avg = a => a.length ? a.reduce((x,y)=>x+y,0)/a.length : 0;
function pushEar(v){ earBuf.push(v); if(earBuf.length>CONFIG.SMOOTH_N) earBuf.shift(); return avg(earBuf); }
function dist(a,b){ const dx=a.x-b.x, dy=a.y-b.y, dz=(a.z||0)-(b.z||0); return Math.hypot(dx,dy,dz); }
function earOf(lm, idx){ const A=dist(lm[idx[1]],lm[idx[5]]), B=dist(lm[idx[2]],lm[idx[4]]), C=dist(lm[idx[0]],lm[idx[3]]); return (A+B)/(2*C+1e-6); }

export function buildFaceMesh(){
  const fm = new FaceMesh({ locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${f}` });
  fm.setOptions({ maxNumFaces:1, refineLandmarks:true, minDetectionConfidence:0.5, minTrackingConfidence:0.5 });
  fm.onResults(onResults);
  return fm;
}

function drawLandmarks(img, lms, ctx){
  drawConnectors(ctx, lms, FACEMESH_TESSELATION, {color:'#C0C0C070', lineWidth:1});
  drawConnectors(ctx, lms, FACEMESH_LEFT_EYE,   {color:'#30FF30',   lineWidth:2});
  drawConnectors(ctx, lms, FACEMESH_RIGHT_EYE,  {color:'#FF3030',   lineWidth:2});
}

async function onResults(res){
  const video = els.video, canvas = els.canvas;
  const ctx = canvas.getContext('2d');         // ✅ 프레임마다 안전 확보
  if (!ctx) return;

  const W = video.videoWidth  || CONFIG.VIDEO.WIDTH;
  const H = video.videoHeight || CONFIG.VIDEO.HEIGHT;
  if (canvas.width !== W){ canvas.width = W; canvas.height = H; }

  ctx.save();
  ctx.clearRect(0,0,W,H);
  if (res.image) ctx.drawImage(res.image, 0, 0, W, H);

  const faces = (res.multiFaceLandmarks || []);
  if (faces.length){
    const lms = faces[0];
    drawLandmarks(res.image, lms, ctx);

    const ear = (earOf(lms,LIDX)+earOf(lms,RIDX))/2;
    const sear = pushEar(ear);
    els.ear.textContent = sear.toFixed(2);
    lastSeen = now();

    if (now()<graceUntil){
      setStatus('재검출 관용 구간','text-yellow-400'); els.alarm.classList.add('hidden');
    } else {
      if (sear < CONFIG.EAR_THRESHOLD){
        if (lowStart===null) lowStart = now();
        const held = now() - lowStart;

        if (held >= CONFIG.HOLD_MS){
          setStatus('!! 졸음 감지 !!','text-red-500 animate-pulse');
          els.alarm.classList.remove('hidden');
          if (!isPlaying()){ await startLooping(); }      // 최초 감지만 시작
        } else {
          setStatus('눈 감김 감지됨...','text-yellow-400');
          els.alarm.classList.add('hidden');
        }
      } else {
        lowStart = null;
        setStatus('정상 주행 중','text-green-400');
        els.alarm.classList.add('hidden');
      }
    }
  } else {
    els.ear.textContent = '--';
    setStatus('운전자를 찾을 수 없음','text-red-500');
    els.alarm.classList.add('hidden');
    lowStart = null;
    if (now()-lastSeen>200) graceUntil = now()+CONFIG.GRACE_MS;
  }
  ctx.restore();
}
