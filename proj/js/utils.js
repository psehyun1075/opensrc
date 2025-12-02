export const now = () => performance.now();
export const avg = arr => arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : 0;

export class MovingAvg {
  constructor(n){ this.n=n; this.buf=[]; }
  push(v){ this.buf.push(v); if(this.buf.length>this.n) this.buf.shift(); return avg(this.buf); }
}

export function dist(a,b){
  const dx=a.x-b.x, dy=a.y-b.y, dz=(a.z||0)-(b.z||0);
  return Math.hypot(dx,dy,dz);
}
