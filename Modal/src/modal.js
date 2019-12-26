function Dialog(setDialog){
	var root=this;
	Dialog.prototype.active=false;
	Object.defineProperty(this,'setActiveState',{
		set:function(val){
			Dialog.prototype.active=val;
		},
		get:function(){
			return root.active;
		}
	})
	
	if(setDialog instanceof Object != true){
		setDialog={}
	}
	if(setDialog instanceof Object == true){
		root.DialogInfo=setDialog;
		var Info=root.DialogInfo;
			if(Info.hasOwnProperty('Title') == false){Info.Title='<strong>Please set your dialog title!</strong>'}
			if(Info.hasOwnProperty('Content') == false){Info.Content='<p>Please set your dialog content text.</p>'}
			if(Info.hasOwnProperty('Type') == false){Info.Type='alert'}
			if(Info.hasOwnProperty('ButtonText') == true){
				var btnText=Info.ButtonText;
				if(btnText.hasOwnProperty('OK') == false){OK='OK'}
				if(btnText.hasOwnProperty('Cancel') == false){Cancel='Cancel'}
				if(btnText.hasOwnProperty('Yes') == false){Yes='Yes'}
				if(btnText.hasOwnProperty('No') == false){No='No'}
			}else{
				Info.ButtonText={
					OK:'OK',Cancel:'Cancel',Yes:'Yes',No:'No'
				}
			}
		this.Element={
			DialogOverlay:document.createElement('div'),
			DialogWindow:document.createElement('div'),
			DialogTitleBar:document.createElement('div'),
			DialogTitle:document.createElement('h2'),
			BtnWindowClose:document.createElement('button'),
			DialogContent:document.createElement('div'),
			DialogButtonSet:document.createElement('div'),
			ButtonSet:{
				OK:document.createElement('button'),
				Cancel:document.createElement('button'),
				Yes:document.createElement('button'),
				No:document.createElement('button')
			}
		}
	}
		
	//Setting Dialog
	root.show=function(){
		document.body.appendChild(root.Element.DialogOverlay);
		root.Element.DialogOverlay.appendChild(root.Element.DialogWindow);
		root.Element.DialogWindow.appendChild(root.Element.DialogTitleBar);
		root.Element.DialogTitleBar.appendChild(root.Element.DialogTitle);
		root.Element.DialogTitleBar.appendChild(root.Element.BtnWindowClose);
		root.Element.DialogWindow.appendChild(root.Element.DialogContent);
		root.Element.DialogWindow.appendChild(root.Element.DialogButtonSet);
		root.Element.BtnWindowClose.innerHTML='Ｘ';
		root.Element.BtnWindowClose.setAttribute('aria-label','닫기');
		root.Element.DialogOverlay.className='SimpleDialog-Overlay';
		root.Element.DialogWindow.className='SimpleDialog-Window';
		root.Element.DialogWindow.setAttribute('aria-labelledby','TitleBar');
		root.Element.DialogWindow.setAttribute('role','dialog');
		root.Element.DialogWindow.setAttribute('aria-describedby','DialogContent');
		root.Element.BtnWindowClose.className='SimpleDialog-BtnWindowClose';
		root.Element.DialogTitleBar.className='SimpleDialog-TitleBar';
		root.Element.DialogTitle.className='SimpleDialog-Title';
		root.Element.DialogTitle.id='TitleBar';
		root.Element.DialogTitle.innerHTML=root.DialogInfo.Title;
		root.Element.DialogContent.id='DialogContent';
		root.Element.DialogContent.className='SimpleDialog-ContentArea';
		root.Element.DialogContent.innerHTML=root.DialogInfo.Content;
		root.Element.DialogButtonSet.className='SimpleDialog-ButtonBox';
		
		if(root.DialogInfo.Type=='alert'){
			root.Element.DialogButtonSet.appendChild(root.Element.ButtonSet.OK);
			root.Element.ButtonSet.OK.innerHTML=root.DialogInfo.ButtonText.OK;
			root.Element.ButtonSet.OK.focus()
		};
		if(root.DialogInfo.Type=='confirm'){
			root.Element.DialogButtonSet.appendChild(root.Element.ButtonSet.OK);
			root.Element.ButtonSet.OK.innerHTML=root.DialogInfo.ButtonText.OK;
			root.Element.DialogButtonSet.appendChild(root.Element.ButtonSet.Cancel);
			root.Element.ButtonSet.Cancel.innerHTML=root.DialogInfo.ButtonText.Cancel;
			root.Element.ButtonSet.OK.focus()
			
		};
		if(root.DialogInfo.Type=='ask'){
			root.Element.DialogButtonSet.appendChild(root.Element.ButtonSet.Yes);
			root.Element.ButtonSet.Yes.innerHTML=root.DialogInfo.ButtonText.Yes
			root.Element.DialogButtonSet.appendChild(root.Element.ButtonSet.No);
			root.Element.ButtonSet.No.innerHTML=root.DialogInfo.ButtonText.No
			root.Element.ButtonSet.Yes.focus();
		};
		root.setActiveState=true;
		if(typeof root.DialogInfo.EntryPoint!='undefined'){
			root.DialogInfo.EntryPoint.blur()
		}
	}
	//function
	root.Blocking=function(set=true){
		var AllElems=document.body.querySelectorAll('*');
			for(var i=0; i<AllElems.length; i++){
				if( set == true ){
					if(root.Element.DialogOverlay.contains(AllElems[i]) == false){
						AllElems[i].setAttribute('aria-hidden','true');
						AllElems[i].setAttribute('tabindex','-1');
					}
				}
				else if( set == false ){
					if(AllElems[i].hasAttribute('aria-hidden') == true && AllElems[i].hasAttribute('tabindex') == true){
					AllElems[i].removeAttribute('aria-hidden');
					AllElems[i].removeAttribute('tabindex')
				}
			}
		}
	}
	
	root.focusReturn=function(){
		if(typeof root.DialogInfo.EntryPoint!='undefined'){
			root.DialogInfo.EntryPoint.focus()
		}
	}
	
	root.Close=function(){
		document.body.removeChild(root.Element.DialogOverlay);
		root.setActiveState=false;
		root.Blocking(false);		
	}
	
	//Event	
	root.Element.DialogWindow.addEventListener('keydown',function(e){
		if(e.keyCode == 27){
			root.Close();
			root.focusReturn();
		}
	})
	root.Element.ButtonSet.OK.addEventListener('click',function(){
		root.Close();
		root.focusReturn();
	})
	root.Element.ButtonSet.Yes.addEventListener('click',function(){
		root.Close();
		root.focusReturn();
	})
	root.Element.BtnWindowClose.addEventListener('click',function(){	
		root.Close();
		root.focusReturn();
	})
	root.Element.ButtonSet.Cancel.addEventListener('click',function(){
		root.Close();
		root.focusReturn();
	})
	root.Element.ButtonSet.No.addEventListener('click',function(){
		root.Close();
		root.focusReturn();
	});
}
var count=0;
var c=0;
var currentStack=[];
function showDialog(Obj){
	c=0;
	count++;
	var itr=setInterval(function(){
		(function(c2){
		currentStack[c2]=new Dialog(Obj);
		if( document.querySelector('.SimpleDialog-Overlay') == null ){
			if( c2>=0 ){
				currentStack[c2].Blocking(true);
				currentStack[c2].show();
				c++;
			}
			if( c2<=count ){
				clearInterval(itr);
			}
		}
		})(c);
	},5)
}