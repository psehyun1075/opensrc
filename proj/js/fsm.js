// 간단 FSM: NORMAL -> PRE -> DROWSY -> NORMAL
export const STATE = { NORMAL:'NORMAL', PRE:'PRE', DROWSY:'DROWSY' };
export class DrowsyFSM{
  constructor(){ this.state=STATE.NORMAL; }
  reset(){ this.state=STATE.NORMAL; }
}
