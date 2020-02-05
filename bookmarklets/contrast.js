var body=document.body;var contrast=document.createElement('style');contrast.className='self-contrast';
var getByClass=document.querySelector('.self-contrast');
if(MSG === undefined ){
	var MSG={
		TurnON:document.createElement('div'),
		TurnOFF:document.createElement('div')
	}
	with(MSG){
		body.appendChild(TurnON);
		body.appendChild(TurnOFF);
		TurnON.innerHTML='<span class="blind" lang="ko">어두운 고대비 모드가 활성화되었습니다,</span><span class="blind" lang="en">Dark contrast mode is now turned on!</span>';
		TurnON.style.display='none';
		TurnON.setAttribute('role','alert');
		TurnOFF.innerHTML='<span class="blind" lang="ko">어두운 고대비 모드가 비활성화되었습니다,</span><span class="blind" lang="en">Dark contrast mode is now turned off!</span>';
		TurnOFF.style.display='none';
		TurnOFF.setAttribute('role','alert');
	}
}
if(isContrastEnabled === undefined ){
	var isContrastEnabled =  false;
}
(function(){
	contrast.innerHTML=`
		html{color:#fff;background-color:#444;border-color:#fff;}
		a:visited{color:#ea0;}a:link{color:#0ff;}
	`;
	if( isContrastEnabled == false ){
		body.appendChild(contrast);
		isContrastEnabled = true;
		MSG.TurnON.style.display=''
		MSG.TurnOFF.style.display='none'
	}else if( isContrastEnabled == true ){
		body.removeChild(getByClass);
		isContrastEnabled = false;
		MSG.TurnON.style.display='none'
		MSG.TurnOFF.style.display=''
	}
})();