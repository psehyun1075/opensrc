import { CONFIG } from './config.js';
import { now } from './utils.js';

let synth, gain, player, lastBeep=0, lastMusicAt=0, musicList=[], musicIdx=-1, enabled=CONFIG.MUSIC.ENABLED_DEFAULT;

export async function initAudio(){
  await Tone.start();
  synth = new Tone.Synth({ oscillator:{type:'sine'}, envelope:{attack:0.01,decay:0.05,sustain:0.3,release:0.1} }).toDestination();
  gain = new Tone.Gain(0).toDestination();
  player = new Tone.Player({loop:false,autostart:false}).connect(gain);
}

export function isMusicEnabled(){ return enabled; }
export function toggleMusic(){ enabled = !enabled; return enabled; }
export function setMusicFiles(files){
  musicList = [];
  for(const f of files){ musicList.push(URL.createObjectURL(f)); }
  return musicList.length;
}

export function beepOnce(){
  const t = now();
  if (t - lastBeep < CONFIG.BEEP_COOLDOWN_MS) return;
  lastBeep = t;
  synth?.triggerAttackRelease("A4", 0.2);
}

export function stopMusic(){
  const tt = Tone.now();
  gain?.gain.cancelScheduledValues(tt);
  gain?.gain.linearRampToValueAtTime(0.0, tt + CONFIG.MUSIC.FADEOUT_SEC);
  player?.stop(`+${CONFIG.MUSIC.FADEOUT_SEC}`);
}

export function playMusic(){
  if(!enabled) return false;
  const t = now();
  if (t - lastMusicAt < CONFIG.MUSIC.COOLDOWN_MS) return false;
  if (!musicList.length) return false;

  musicIdx = (musicIdx + 1) % musicList.length;
  const url = musicList[musicIdx];

  player.stop();
  player.load(url).then(()=>{
    const tt = Tone.now();
    gain.gain.cancelScheduledValues(tt);
    gain.gain.setValueAtTime(0, tt);
    player.start();
    gain.gain.linearRampToValueAtTime(1.0, tt + CONFIG.MUSIC.FADEIN_SEC);
    gain.gain.setValueAtTime(1.0, tt + CONFIG.MUSIC.MAXLEN_SEC - CONFIG.MUSIC.FADEOUT_SEC);
    gain.gain.linearRampToValueAtTime(0.0, tt + CONFIG.MUSIC.MAXLEN_SEC);
    player.stop(`+${CONFIG.MUSIC.MAXLEN_SEC}`);
    lastMusicAt = t;
  }).catch(e=>console.warn('Music load fail', e));
  return true;
}
