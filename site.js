// Gli elementi rimangono leggibili anche quando lo script o le animazioni non sono disponibili.
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
if(!reduced.matches&&'IntersectionObserver' in window){
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;const el=entry.target;const picture=el.tagName==='IMG';const heading=/^H[2-4]$/.test(el.tagName);el.animate(picture?[{transform:'scale(1.035)'},{transform:'scale(1)'}]:heading?[{transform:'translateX(-14px)',opacity:.7},{transform:'translateX(0)',opacity:1}]:[{transform:'translateY(22px)',opacity:.65},{transform:'translateY(0)',opacity:1}],{duration:picture?1000:650,delay:(Number(el.dataset.stagger)||0)*65,easing:'cubic-bezier(.16,1,.3,1)'});observer.unobserve(el)}),{threshold:.15});
 document.querySelectorAll('main section:not(.hero)').forEach(section=>section.querySelectorAll('h2,h3,h4,p,figure img,.dish,.button').forEach((el,index)=>{el.dataset.stagger=index%4;observer.observe(el)}));
}
