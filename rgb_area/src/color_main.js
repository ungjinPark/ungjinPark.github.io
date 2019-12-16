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
const nav_focusableElements=scroll_nav.querySelectorAll('button,input:not([disabled]),input:not([type="hidden"]),[tabindex="0"]');

//content box for all
const content_wrapper=document.querySelector('#content-wrapper');

//event
btn_close.addEventListener('click',function(){
	close_nav();
})

btn_openNav.addEventListener('click',function(){
	open_nav();
})

const scroll_nav_item=scroll_nav.querySelectorAll('[data-scroll-target]');
for(let i=0; i<scroll_nav_item.length; i++){
	(function(c){
		scroll_nav_item[c].addEventListener('click',function(e){
			const t=e.target;
			const scrollClass=t.getAttribute('data-scroll-target');
			const scrollTarget=document.querySelector(scrollClass);
			window.scrollTo(0,scrollTarget.offsetTop-(scrollTarget.offsetHeight*0.1));
			scrollTarget.setAttribute('tabindex','0')
			setTimeout(function(){close_nav(scrollTarget)},100);
			setTimeout(function(){scrollTarget.removeAttribute('tabindex')},200);
		});
	})(i);
}

function focusTrap1(){
	window.addEventListener('focusin',function(e2){
			if(scroll_nav.contains(e2.target) == false ){
				nav_focusableElements[nav_focusableElements.length-1].focus();
			}
	})
}

function focusTrap2(){
	window.addEventListener('focusin',function(e2){
		if(scroll_nav.contains(e2.target) == false ){
			nav_focusableElements[0].focus();
		}
	})
}

function open_nav(){
	scroll_nav.style.display='block';
	content_wrapper.setAttribute('aria-hidden','true');
	document.body.style.overflow='hidden';
	scroll_nav.classList.add('menu-isActive');
	nav_focusableElements[0].addEventListener('focusout',focusTrap1)
	nav_focusableElements[nav_focusableElements.length-1].addEventListener('focusout',focusTrap2)
	btn_close.focus();
}

function close_nav(focusEl=btn_openNav){
	content_wrapper.removeAttribute('aria-hidden');
	scroll_nav.classList.remove('menu-isActive');
	scroll_nav.style.display='none';
	document.body.style.overflow='';
	focusEl.focus();
}

//scroll_nav.removeEventListener('focusin',tapping_trap)

//nav_focusableElements[0].addEventListener('keydown',tapping_trap)
//nav_focusableElements[nav_focusableElements.length-1].addEventListener('keydown',tapping_trap)