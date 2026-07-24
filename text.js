'use strict';

// Edit this file to change every user-facing string in the game.
window.GAME_TEXT=Object.freeze({
 title:'Side Scrolling Life',
 hud:{
  gameTitle:'SIDE SCROLLING LIFE',
  score:'Score',
  lives:'Lives',
  speed:'Speed',
  dogMarker:'🐕'
 },
 stages:[
  {id:'porto1',title:'PORTO',sub:'THE BEGINNING'},
  {id:'portoMeet',title:'PORTO',sub:'TOGETHER'},
  {id:'outbound',title:'THE ROAD NORTH',sub:'SPAIN · FRANCE · BELGIUM'},
  {id:'amsterdam1',title:'AMSTERDAM',sub:'A NEW HOME'},
  {id:'japan',title:'JAPAN',sub:'ACROSS THE WORLD'},
  {id:'korea',title:'KOREA',sub:'NEON NIGHTS'},
  {id:'amsterdam2',title:'AMSTERDAM',sub:'KYUUBI JOINS THE JOURNEY'},
  {id:'return',title:'THE ROAD HOME',sub:'BELGIUM · FRANCE · SPAIN'},
  {id:'portoFinal',title:'PORTO',sub:'THE WEDDING'}
 ],
 messages:{
  stage:number=>`STAGE ${number}`,
  gameOverTitle:'GAME OVER',
  gameOverDetail:'Press Enter, Space or R to restart',
  tryAgain:'TRY AGAIN',
  checkpoint:'CHECKPOINT',
  together:'TOGETHER',
  dogJoinedTitle:'KYUUBI JOINS YOU',
  dogJoinedDetail:'A small white heart on her chest',
  weddingTitle:'JUST MARRIED',
  weddingDetail:score=>`Everyone is here · Final score: ${score}`
 },
 controls:{
  tips:'K toggles visual style',
  moveLeft:'Move left',
  moveRight:'Move right',
  jump:'Jump'
 },
 errors:{
  startup:'The game could not start. Reload the page or check the browser console.',
  startupWithReason:reason=>`The game could not start: ${reason}`,
  unknown:'unknown error'
 }
});
