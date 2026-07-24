'use strict';
(() => {
 const gradientFallback=()=>({addColorStop(){}});
 for(const name of ['createLinearGradient','createRadialGradient']){
  const native=typeof ctx[name]==='function'?ctx[name].bind(ctx):null;
  ctx[name]=(...args)=>native?.(...args)||gradientFallback();
 }
})();