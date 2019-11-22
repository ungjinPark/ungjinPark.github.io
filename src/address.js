let footer_address=new Address('.address-text','.change-address-form')
function Address(install,btnChange){
	const root=this;
	root.address_text=document.querySelector(install);
	root.changeForm=document.querySelector(btnChange);
	root.addressString={
		'old':'서울특별시 종로구 가회동 1-29 어둠속의 대화 (주) 엔비전스',
		'new':'서울특별시 종로구 북촌로 71 어둠속의 대화 (주) 엔비전스'
	}
	root.addressObject={
		set setFormType (str) {
			if(str=='new'){
				root.addressObject.state=str;
				root.address_text.innerHTML=root.addressString[str];
				root.changeForm.innerHTML='지번';
				root.changeForm.setAttribute('aria-label','지번 주소로 보기');
			}else if(str=='old'){
				root.addressObject.state=str;
				root.address_text.innerHTML=root.addressString[str];
				root.changeForm.innerHTML='도로명';
				root.changeForm.setAttribute('aria-label','도로명 주소로 보기');
			}
		},
		state:'new'
	}
	root.addressObject.setFormType='new'
	root.changeForm.addEventListener('click',function(){
		let state=root.addressObject.state;
		if( state=='new'){
			root.addressObject.setFormType='old';
		}else if(state=='old'){
			root.addressObject.setFormType='new';
		}
	})
}