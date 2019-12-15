const main=document.querySelector('main')
const area_array=document.querySelectorAll('.color-area');
const color_array=['red','green','blue','purple']
area_array[0].classList.add('seen-region');
window.addEventListener('scroll',function(e){
	for(let i=0; i<area_array.length; i++){
		(function(c){
			if(
				window.scrollY >= area_array[c].offsetTop-(area_array[c].offsetHeight*0.35)
				&& (window.scrollY <= area_array[c].offsetTop+area_array[c].offsetHeight-(area_array[c].offsetHeight*0.1)) ){ //(area_array[c].offsetHeight*0.05)
				area_array[c].classList.add('seen-region');
				main.className='main-color '+color_array[c];
			}else{
				area_array[c].classList.remove('seen-region');
			}
		})(i);
	}
})

const btn_close=document.querySelector('#btn_close');
const btn_openNav=document.querySelector('#btn_openNav');

//Navigation
const scroll_nav=document.querySelector('.scroll-nav');
const active_nav=document.querySelector('.menu-isActive');
const nav_innerElement=scroll_nav.querySelectorAll('*');

//content box for all
const content_wrapper=document.querySelector('#content-wrapper');

//event
btn_close.addEventListener('click',function(){
	scroll_nav.style.display='none';
	if( content_wrapper.getAttribute('aria-hidden') == 'true'){
		content_wrapper.removeAttribute('aria-hidden');
		scroll_nav.classList.remove('menu-isActive');
		scroll_nav.removeEventListener('focusin',tapping_trap)
		btn_openNav.focus();
	}
})
btn_openNav.addEventListener('click',function(){
	scroll_nav.style.display='block';
	content_wrapper.setAttribute('aria-hidden','true');
	scroll_nav.classList.add('menu-isActive');
	btn_close.focus();
})