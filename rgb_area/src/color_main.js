const main=document.querySelector('main')
const area_array=document.querySelectorAll('.color-area');
const color_array=['red','green','blue','purple']
area_array[0].classList.add('seen-region');
window.addEventListener('scroll',function(e){
	for(let i=0; i<area_array.length; i++){
		(function(c){
			if(
				window.scrollY >= area_array[c].offsetTop-(area_array[c].offsetHeight*0.2)
				&& (window.scrollY <= area_array[c].offsetTop+area_array[c].offsetHeight-(area_array[c].offsetHeight*0.1)) ){ //(area_array[c].offsetHeight*0.05)
				area_array[c].classList.add('seen-region');
				main.className='main-color '+color_array[c];
			}else{
				area_array[c].classList.remove('seen-region');
			}
		})(i);
		
	}
})