const photoDialog=document.querySelector('.photo-dialog');
const largePhoto=document.querySelector('#photo-large');
let previousOverflow='';
document.querySelectorAll('.photo-open').forEach(button=>button.addEventListener('click',()=>{
 const source=button.querySelector('img');
 largePhoto.src=source.getAttribute('src');
 largePhoto.alt=source.alt;
 document.querySelector('#photo-title').textContent=button.dataset.photoTitle;
 previousOverflow=document.body.style.overflow;
 document.body.style.overflow='hidden';
 photoDialog.showModal();
 if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)photoDialog.animate([{opacity:0,transform:'translateY(15px)'},{opacity:1,transform:'translateY(0)'}],{duration:250,easing:'cubic-bezier(.16,1,.3,1)'});
}));
document.querySelector('.dialog-close').addEventListener('click',()=>photoDialog.close());
photoDialog.addEventListener('click',event=>{if(event.target===photoDialog){const r=photoDialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)photoDialog.close();}});
photoDialog.addEventListener('close',()=>{document.body.style.overflow=previousOverflow;});
if('IntersectionObserver' in window){
 const links=[...document.querySelectorAll('nav a')];
 const navigation=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;links.forEach(link=>{if(link.getAttribute('href')==='#'+entry.target.id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});}),{rootMargin:'-18% 0px -58% 0px'});
 document.querySelectorAll('main section[id]').forEach(section=>navigation.observe(section));
}
