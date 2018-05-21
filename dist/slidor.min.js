var Slidor = function(id,options){


	this.options 		= options || {};
	this.pageWidth 		= window.innerWidth;

	this.sliderId		= id
	this.slider         = document.getElementById(id);

	this.slideWidth 	= this.slider.children[0].offsetWidth;

	this.sliderContainerClass = 'slidor_container';

	this.defaultOptions =	{
		'changeUrl' 	: true,
		'threshold'  	: this.pageWidth*0.50,
		'allowDrag' 	: true,
		'allowSwipe' 	: true,
		'swipeDuration' : 200,
		'slideMode'		: 'copy',
		'keepSlides'	: 1
	} 


	//Initial settings
	this.initCSS();

	//Make slides
	switch(this.getOption("slideMode")){
		case  'given' : 
			//TODO
			console.log("This is to  be implemented yet");
		default :
			//Store the template for future
			this.slideTemplate = this.slider.innerHTML;

			this.initCopySlides();
	}

	//Register touchevents
	this.slider.addEventListener("touchmove",this.onTouchMove,{'passive':true});

};


Slidor.prototype.onTouchMove = function(e){
	console.log(e.touches);
}
	

Slidor.prototype.initCopySlides = function(){
	console.log("init copy slides");

	//Add next cards
	this.addNextSlide();
}

Slidor.prototype.addNextSlide = function(){

	//Make space for next card
	this.slider.style.width = this.slideWidth*(this.getSlideCount()+1)+"px";

	console.log("Modifying slidor width : "+this.slideWidth*(this.getSlideCount()+1)+"px")

	//Add the card
	this.slider.innerHTML += this.slideTemplate;

}


Slidor.prototype.getSlideCount = function(){
	return this.slider.childElementCount;
}


Slidor.prototype.initCSS = function(){
	console.log("init css");

	//Add the slider_container class
	if(!this.hasClass(this.slider,this.sliderContainerClass)){

		this.addClass(this.slider,this.sliderContainerClass);
	}

	//Freeze the child width
	this.slider.children[0].style.width = this.slideWidth+'px';	
}



Slidor.prototype.addClass = function(target,className){
	
	if(target.className==""){
		
		target.className = className;
	}
	else{	

		target.className += " "+className;
	}
}


Slidor.prototype.hasClass = function(target, className){
    return new RegExp('(\\s|^)' + className + '(\\s|$)').test(target.className);
}

Slidor.prototype.getOption = function(option){

	return (typeof this.options[option] == "undefined") ? this.getDefaultOption(option):this.options[option];

}

Slidor.prototype.setOption = function(option,value){

	return this.options.option = value;

}


Slidor.prototype.getDefaultOption = function(option){
	return this.defaultOptions[option];
}