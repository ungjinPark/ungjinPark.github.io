const header = document.querySelector('.wrapper>header')
const main = document.querySelector('.wrapper main')
const navContainer = document.querySelector('nav');
const navList = navContainer.querySelectorAll('li>button')
const btnHamburger = document.querySelector('#hamburger-menu');
const media = window.matchMedia('screen and (max-width:1024px)');
let mainScroller;
let scrollbox;
const FocusInformationManager = {
    leaveFrom:null,
    arrived:null
}

for(let el of navList){
    el.setAttribute('aria-current','false');
}

window.addEventListener('DOMContentLoaded',function(){
    mainScroller= new SimpleBar(main.querySelector('.main-scroller'));
    scrollbox = mainScroller.getScrollElement();
    for(let h = 0; h<navList.length; h++){
        navList[h].setAttribute('aria-current','false');
        scrollbox.addEventListener('scroll',function(){
            if( 
                document.getElementById(navList[h].getAttribute('aria-controls')) &&
                this.scrollTop >= document.getElementById(navList[h].getAttribute('aria-controls')).offsetTop && 
                this.scrollTop <= document.getElementById(navList[h].getAttribute('aria-controls')).offsetTop+document.getElementById(navList[h].getAttribute('aria-controls')).offsetHeight
            ){
                navList[h].setAttribute('aria-current','true');
                for(let i=0; i<navList.length; i++){
                    if(navList[h] !== navList[i]){
                        navList[i].setAttribute('aria-current','false');
                    }
                }
            }
            if( this.scrollTop <= 0 ){
                for(let i=0; i<navList.length; i++){
                    navList[i].setAttribute('aria-current','false');
                }
            }
        })
    }
})

for ( list of navList){
    list.addEventListener('click',GoToHandler)
}

window.addEventListener('DOMContentLoaded',MediaDetector);
window.addEventListener('resize',MediaDetector);
window.addEventListener('focusout',SendFocusManagerInfo)
window.addEventListener('focusin',SendFocusManagerInfo)
btnHamburger.addEventListener('click',MenuController)
window.addEventListener('keydown',function(e){
    if(e.key === 'Escape'){
        CloseMobileMenu();
    }
})

function GoToHandler (e){
    const controls=this.getAttribute('aria-controls');    
    this.hasAttribute('aria-controls') ? (
        location.hash=controls,
        scrollbox.scrollTo(0,document.getElementById(controls).offsetTop+10)
    ) : false;
    if(media.matches){
        CloseMobileMenu();
    }
}

function SendFocusManagerInfo(e){
    e.type === 'focusin' ? FocusInformationManager.arrived = e.target : (
        e.type === 'focusout' ? FocusInformationManager.leaveFrom = e.target : false
    )
}

function SrHidden(bool){
    const Elem = document.querySelectorAll('.wrapper>header>*:not(#hamburger-menu),.wrapper>*:not(header):not(nav)')
    console.log(Elem)
    for(let i=0; i<Elem.length; i++){
        if(bool){
            Elem[i].setAttribute('aria-hidden',bool);
        }else{
            if(Elem[i].hasAttribute('aria-hidden')){
                Elem[i].removeAttribute('aria-hidden',bool);
            }
        }
    }
}

function MenuController(){
    if(navContainer.classList.contains('show')){
        CloseMobileMenu();
    }else if(navContainer.classList.contains('hide')){
        OpenMobileMenu();
    }
}

function FocusTrapForOpenedMenu(e){
    const EventRoot = this;
    if( e.key === 'Tab' && e.shiftKey ){
        setTimeout(() => {
        if( !EventRoot.contains(FocusInformationManager.arrived) ){
                navList[navList.length-1].focus();
            }
        }, 10);
    }
    if( (e.key === 'Tab' && !e.shiftKey) || !header.contains(FocusInformationManager.arrived) ){
        setTimeout(()=>{
            if( !EventRoot.contains(FocusInformationManager.arrived) ){
                btnHamburger.focus();
            }
        },10)
    }
}

function OpenMobileMenu(){
    navContainer.classList.replace('hide','show');
    btnHamburger.classList.replace('btnOpenIndexMenu','btnCloseIndexMenu');
    btnHamburger.setAttribute('aria-label','목차 전체 메뉴 닫기');
    navContainer.addEventListener('keydown',FocusTrapForOpenedMenu);
    SrHidden(true);
}


function CloseMobileMenu(){
    navContainer.classList.replace('show','hide');
    btnHamburger.classList.replace('btnCloseIndexMenu','btnOpenIndexMenu');
    btnHamburger.setAttribute('aria-label','목차 전체 메뉴 열기');
    navContainer.removeEventListener('keydown',FocusTrapForOpenedMenu);
    SrHidden(false);
}

function MediaDetector(){
    if(media.matches){
        navContainer.classList.add('hide');
    }else{
        if(navContainer.classList.contains('hide'&&'show')){
            navContainer.classList.remove('hide','show');
        }
    }
}