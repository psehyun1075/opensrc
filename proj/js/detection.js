import { CONFIG } from './config.js';
import { MovingAvg, dist, now } from './utils.js';
import { setStatus, showOverlay, els } from './ui.js';
import { playMusic, beepOnce, stopMusic } from './audio.js';

const LIDX=[33,160,158,133,153,144], RIDX=[362,385,387,263,373,380];
function earOf(lm, idx){
  const [p1,p2,p3,p4,p5,p6] = [lm[idx[0]],lm[idx[1]],lm[idx[2]],lm[idx[3]],lm[idx[4]],lm[idx[5]]];
  const A=dist(p2,p6), B=dist(p3,p5), C=dist(p1,p4);
  return (A+B)/(2*C+1e-6);
}

const ctx = els.canvas.getContext('2d');
let lowStart=null, lastSeen=0, graceUntil=0;
const smooth = new MovingAvg(CONFIG.SMOOTH_N);

export function onResults(res){
  const W = els.video.videoWidth || CONFIG.VIDEO.WIDTH;
  const H = els.video.videoHeight || CONFIG.VIDEO.HEIGHT;
  if (els.canvas.width !== W){ els.canvas.width=W; els.canvas.height=H; }

  ctx.save();
  ctx.clearRect(0,0,W,H);
  ctx.drawImage(res.image,0,0,W,H);

  const faces = res.multiFaceLandmarks || [];
  if (faces.length){
    const lm = faces[0];
    drawConnectors(ctx, lm, FACEMESH_TESSELATION, {color:'#C0C0C070',lineWidth:1});
    drawConnectors(ctx, lm, FACEMESH_LEFT_EYE,   {color:'#30FF30',lineWidth:2});
    drawConnectors(ctx, lm, FACEMESH_RIGHT_EYE,  {color:'#FF3030',lineWidth:2});

    const ear = (earOf(lm, LIDX)+earOf(lm, RIDX))/2;
    const sear = smooth.push(ear);
    els.ear.textContent = sear.toFixed(2);
    lastSeen = now();

    if (now() < graceUntil){
      setStatus('재검출 관용 구간','text-yellow-400');
      showOverlay(false);
      stopMusic();
    } else {
      if (sear < CONFIG.EAR_THRESHOLD){
        if (lowStart===null) lowStart = now();
        const held = now()-lowStart;
        if (held >= CONFIG.HOLD_MS){
          setStatus('!! 졸음 감지 !!','text-red-500 animate-pulse');
          showOverlay(true);
          if (!playMusic()) beepOnce();
        } else {
          setStatus('눈 감김 감지됨...','text-yellow-400');
          showOverlay(false);
        }
      } else {
        lowStart=null;
        setStatus('정상 주행 중','text-green-400');
        showOverlay(false);
        stopMusic();
      }
    }
  } else {
    els.ear.textContent='--';
    setStatus('운전자를 찾을 수 없음','text-red-500');
    showOverlay(false);
    lowStart=null;
    stopMusic();
    if (now()-lastSeen>200) graceUntil = now()+CONFIG.GRACE_MS;
  }
  ctx.restore();
}

export function buildFaceMesh(){
  const fm = new FaceMesh({ locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${f}` });
  fm.setOptions({ maxNumFaces:1, refineLandmarks:true, minDetectionConfidence:0.5, minTrackingConfidence:0.5 });
  fm.onResults(onResults);
  return fm;
}
