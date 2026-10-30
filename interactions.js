const photoDialog=document.querySelector('.photo-dialog');
const largePhoto=document.querySelector('#photo-large');
const photoMotionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');
let dialogAnimation;
let previousOverflow='';
document.querySelectorAll('.photo-open').forEach(button=>button.addEventListener('click',()=>{
 const source=button.querySelector('img');
 largePhoto.src=source.getAttribute('src');
 largePhoto.alt=source.alt;
 largePhoto.width=source.naturalWidth||source.width;
 largePhoto.height=source.naturalHeight||source.height;
 document.querySelector('#photo-title').textContent=button.dataset.photoTitle;
 previousOverflow=document.body.style.overflow;
 document.body.style.overflow='hidden';
 photoDialog.showModal();
 if(!photoMotionPreference.matches)dialogAnimation=photoDialog.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:220,easing:'cubic-bezier(.22,.61,.36,1)'});
}));
document.querySelector('.dialog-close').addEventListener('click',()=>photoDialog.close());
photoDialog.addEventListener('click',event=>{if(event.target===photoDialog){const r=photoDialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)photoDialog.close();}});
photoDialog.addEventListener('close',()=>{dialogAnimation?.cancel();document.body.style.overflow=previousOverflow;});
photoMotionPreference.addEventListener('change',event=>{if(event.matches)dialogAnimation?.cancel();});
if('IntersectionObserver' in window){
 const links=[...document.querySelectorAll('nav a')];
 const navigation=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;links.forEach(link=>{if(link.getAttribute('href')==='#'+entry.target.id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});}),{rootMargin:'-18% 0px -58% 0px'});
 document.querySelectorAll('main section[id]').forEach(section=>navigation.observe(section));
}
