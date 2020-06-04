function sortElement (elList){
    let copiedlist;
    copiedlist = Array.prototype.slice.call(elList,0,elList.length)
    copiedlist.sort(function(){
        return Math.random() - 0.5
    });
    const container = elList[0].parentElement;
    for(let i=0; i<copiedlist.length; i++){
        container.appendChild(copiedlist[i]);
    }
    return copiedlist;
}

class A11YSecurityScreenNumPad extends HTMLFormElement {
    constructor(){
        super();
        const root = this;

        //Numpad panel
        this.mode=0; // 0 = input mode, 1 = browse mode
        this.controller = document.createElement('div');
        this.passwordInput = document.createElement('input');
        this.passwordInput.classList.add('TransferOnly');
        this.passwordInput.setAttribute('type','password');
        this.passwordInput.setAttribute('maxlength','4');
        this.padDescription = document.createElement('p');
        this.padDescription.innerHTML = '보안 키패드 영역입니다. 마우스로 버튼을 누르거나, 버튼의 순서에 맞는 숫자 키를 눌러 입력하고, Backspace 키로 삭제할 수 있습니다. 비밀번호 한 자리를 입력할 때 마다 숫자가 뒤섞입니다. 버튼 순서를 들으려면 Alt+쉼표를 누르십시오.';
        this.padDescription.setAttribute('tabindex','0')
        this.prepend(this.padDescription)
        this.controller.setAttribute('role','application');
        this.controller.setAttribute('aria-label','보안 키패드');
        this.controller.setAttribute('tabindex','0');
        this.controller.appendChild(this.passwordInput)
        this.addEventListener('submit',function(){
            event.preventDefault();
        })
        this.addEventListener('keydown',speechNumpadLayoutHandler)
        this.controller.addEventListener('keydown',inputHandler)
        this.appendChild(this.controller);
        this.NumpadButtons=[];
        this.NumpadDeleteButton = document.createElement('button');
        this.submitButton = document.createElement('button');
        this.submitButton.innerHTML = "입력 완료";
        this.submitButton.classList.add('btnSubmit');
        this.NumpadDeleteButton.innerHTML = 'Χ'
        this.NumpadDeleteButton.classList.add('btnDelete');
        this.NumpadDeleteButton.setAttribute('aria-label','삭제');
        
        for(let i=0; i<10; i++){
            this.NumpadButtons[i]=document.createElement('button');
            this.NumpadButtons[i].innerHTML=i;
            this.NumpadButtons[i].classList.add('numpadButtons');
            this.controller.appendChild(this.NumpadButtons[i]);
            sortElement(this.NumpadButtons);
            this.NumpadDeleteButton.addEventListener('click',function(){
            if(root.mode === 0 ){
                if(root.passwordInput.value.length > 0){
                    let deletedResult=root.passwordInput.value.substring(0,root.passwordInput.value.length-1);
                    setTimeout(function(){
                        root.passwordInput.value=deletedResult;
                        console.log(root.passwordInput.value)
                        if(navigator.userAgent.indexOf('Firefox/' > -1 )){
                            root.controller.setAttribute('aria-label','보안 키패드, 비밀번호 '+root.passwordInput.value.length+'자리 입력됨');
                            root.controller.focus();
                        }else{
                            SecurityNumpadUiAnnouncement('polite','비밀번호 '+root.passwordInput.value.length+'자리 입력됨.')
                        }
                    },50)
                }else{
                    if(navigator.userAgent.indexOf('Firefox/' > -1 )){
                        root.controller.setAttribute('aria-label','보안 키패드, 입력된 글자 없음')
                        root.controller.focus();
                    }else{
                        SecurityNumpadUiAnnouncement('polite','입력된 글자 없음');
                    }
                }
            }
            })
            this.passwordInput.addEventListener('change',function(e){
                e.preventDefault();
            })
            this.NumpadButtons[i].addEventListener('click',function(){
                if(root.mode === 0){
                    root.NumpadButtons=sortElement(root.NumpadButtons);
                    root.controller.appendChild(root.NumpadDeleteButton);
                    root.controller.appendChild(root.submitButton);
                    if( root.passwordInput.value.length < Number(root.passwordInput.getAttribute('maxlength')) ){
                        root.passwordInput.value+=this.textContent;
                        root.controller.focus();
                        if(navigator.userAgent.indexOf('Firefox/' > -1 )){
                            root.controller.setAttribute('aria-label','보안 키패드, 비밀번호 '+root.passwordInput.value.length+'자리 입력됨')
                        }else{
                            SecurityNumpadUiAnnouncement('polite','비밀번호 '+root.passwordInput.value.length+'자리 입력됨')
                        }
                    }else{
                        root.controller.focus();
                        if(navigator.userAgent.indexOf('Firefox/' > -1 )){
                            root.controller.setAttribute('aria-label','보안 키패드, 비밀번호 4자리 모두 입력됨')
                        }else{
                            SecurityNumpadUiAnnouncement('polite','비밀번호 4자리 모두 입력됨')
                        }
                    }
                }
            })
            this.controller.appendChild(root.NumpadDeleteButton);
            this.controller.appendChild(root.submitButton);
        }

        //Announce
        this.announcer=document.createElement('div');
        this.announcer.setAttribute('aria-live','polite');
        this.announcer.classList.add('srLive');
        this.UrgentAnnouncer=document.createElement('div');
        this.UrgentAnnouncer.setAttribute('aria-live','assertive');
        this.UrgentAnnouncer.classList.add('srLive');
        this.appendChild(this.announcer)
        this.appendChild(this.UrgentAnnouncer)

        //Set Labe For FIREFOX
        window.addEventListener('DOMContentLoaded',function(){
            setTimeout(function(){
                if(navigator.userAgent.indexOf('Firefox/' > -1 )){
                    root.controller.setAttribute('aria-label','보안 키패드, 비밀번호 '+root.passwordInput.value.length+'자리 입력됨')
                }
            },100)
        })

        function speechNumpadLayoutHandler(e){
            const numButtons=document.querySelectorAll('.numpadButtons');
            if(e.altKey && e.key === ','){
                if(root.mode === 0){
                    root.mode = 1;
                    SecurityNumpadUiAnnouncement('assertive','보안 키패드 입력 도움말 시작, 숫자 키를 눌러 배열을 탐색할 수 있습니다. 입력 도움말 모드 중, Alt + A 키를 눌러 배열 전체 듣기를 실행할 수 있습니다.  Alt + 쉼표 키를 한 번 더 누르면 종료됩니다.')
                }else{
                    root.mode = 0;
                    SecurityNumpadUiAnnouncement('assertive','보안 키패드 입력 도움말 종료')
                }
            }
            if(e.altKey && e.key === 'a' && root.mode === 1 ){
                let ReadAll = '키패드 전체 읽기: ';
                for(var i=0; i<numButtons.length; i++){
                    ReadAll+=numButtons[i].textContent;
                    if(i!==numButtons.length-1){
                        ReadAll+=' ';
                    }
                }
                SecurityNumpadUiAnnouncement('assertive',ReadAll)
            }

            if( root.mode === 1 && (/^[1-9]$/).test(e.key) ){
                SecurityNumpadUiAnnouncement('assertive',numButtons[Number(e.key-1)].textContent);
            }else if( root.mode === 1 && e.key == 0 ){
                SecurityNumpadUiAnnouncement('assertive',numButtons[9].textContent);
            }
        }

        function inputHandler(e){
            const num_buttons = root.querySelectorAll('.numpadButtons')
            if( (/^[0-9]$/).test(e.key) ){
                num_buttons[e.key].click();
            }

            if( e.key === 'Backspace' ){
                root.NumpadDeleteButton.click();
            }
        }

        function SecurityNumpadUiAnnouncement(type,string){
            if(type === 'polite'){
                root.announcer.innerHTML=string;
                setTimeout(function(){
                    root.announcer.innerHTML='';
                },10);
            }
            if(type === 'assertive'){
                root.UrgentAnnouncer.innerHTML=string;
                setTimeout(function(){
                    root.UrgentAnnouncer.innerHTML='';
                },10);
            }
        }
    }
}

customElements.define('scr-numpad',A11YSecurityScreenNumPad,{extends:'form'})