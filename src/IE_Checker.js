function isIE(){
	if(navigator.userAgent.indexOf('Trident') > -1 || navigator.userAgent.indexOf('MSIE') > -1 ){
		return true;
	}else{
		return false;
	}
}