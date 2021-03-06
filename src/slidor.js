var Slidor = function(id,options){


	this.options 		= options || {};
	this.pageWidth 		= window.innerWidth;

	this.sliderId		= id
	this.slider         = document.getElementById(id);

	this.slideWidth 	= this.slider.children[0].offsetWidth;

	this.sliderContainerClass 	= 'slidor_container';
	this.scrollIngVertically 	= false
	this.lastSlideOffset 		= 0;
	this.lastSlideTo 			= 0;

	this.defaultOptions =	{
		'changeUrl' 				: true,
		'slideThreshold'  			: this.pageWidth*0.50,
		'allowDrag' 				: true,
		'allowSwipe' 				: true,
		'swipeDuration' 			: 200,
		'slideMode'					: 'copy',
		'keepSlides'				: 1,
		'activeSlide'   			: 0,
		'thresholdSkipTime' 		: 400
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
	this.slider.addEventListener("touchstart",this.onTouchStart.bind(this),{'passive':true});
	this.slider.addEventListener("touchmove",this.onTouchMove.bind(this),{'passive':true});
	this.slider.addEventListener("touchend",this.onTouchEnd.bind(this),{'passive':true});

};


Slidor.prototype.onTouchStart = function(e){

    this.startX = e.touches[0].pageX;
    this.startY = e.touches[0].pageY;

    this.touchStartTime    = (new Date()).getTime();
}

Slidor.prototype.onTouchMove = function(event){


	var _ = this,
			deltaX          = event.touches[0].pageX - _.startX,
			deltaY          = event.touches[0].pageY - _.startY,
			_r              = Math.atan2(deltaY, deltaX),
			swipeAngle      = Math.round(_r * 180 / Math.PI),
			timestampNow    = (new Date()).getTime(),
			swipeDirection,r,currentScrollX,slideTo;



    //Disble during vertical scroll
    if(this.scrollIngVertically)
    {
        return;
    }

    
    //Allow only swipe upto 10 degree , upward
    if(swipeAngle < -40 && swipeAngle > -140){

        return false;   
    }
    //Allow only swipe upto 10 degree , downwards
    else if(swipeAngle > 40 && swipeAngle < 140)
    {
        
        return;
    }

    //Modifying deltaX to use with transfrom3d 
    slideTo          = this.lastSlideOffset + (0 - deltaX);



    //Do not slide too far when its an dead-end
    // if(slideTo < (-1*(window.onefeed.page_width*0.25)))
    // {

    //     //For previous deadend
    //     window.onefeed.lastDeltaX = 0;
    //     return ;
    // }
    // else if(window.onefeed.currentStoryIndex==(window.onefeed.sliderOptions.total_slides-1)  && (deltaX < (-1*(window.onefeed.page_width*0.25))))
    // {

    //     //For next deadend
    //     window.onefeed.lastDeltaX = 0;
    //     return;
    // }

    _.slider.style.transform  	= "translate3d("+(-1*slideTo)+"px, 0px, 0px)";
    this.lastSlideTo 			= slideTo;
}
	

Slidor.prototype.onTouchEnd = function(){

	//Store the lastOffset
	this.lastSlideOffset = this.lastSlideTo;


	var slideTo,
		timestampNow    = (new Date()).getTime(),        
    	slideDuration 	= timestampNow - this.touchStartTime,
    	slideDirection 	= this.getSlideDirection(this.lastSlideTo);

    if(this.skipThresholdCheck(slideDuration,this.lastSlideTo)){

    	console.log('Skipping  slide thresold check');

    }else{

    	console.log('Checking for slide threshold');

        if(this.thresholdPassed(slideDirection))   
        {

            //Threshold is  not passed, we need to go to staring position
            slideTo = -1*(this.getOption('activeSlide')*this.slideWidth);
                        
            this.animateSlideTo(slideTo);            
            return;
        }


    }

}

Slidor.prototype.animateSlideTo = function(slideTo){
	this.slider.style.transform="translate3d("+slideTo+"px, 0px, 0px)";
	this.lastSlideOffset = slideTo;
}

Slidor.prototype.getSlideDirection = function(slideOffset){
	
	return slideOffset < (this.getOption('activeSlide')*this.slideWidth) ? "ltr":"rtl"	
}

Slidor.prototype.thresholdPassed = function(slideDirection){
	return (slideDirection=="ltr" && this.getOption('slideThreshold') > Math.abs(this.lastSlideTo)) || (slideDirection=="rtl" &&  this.getOption('slideThreshold') > this.lastSlideTo)
}

Slidor.prototype.skipThresholdCheck = function(slideDuration,slideOffset){

	if(slideDuration > this.getOption('thresholdSkipTime')
		|| slideOffset == 0 
        || (this.getOption("activeSlide") && this.getSlideDirection(slideOffset)=="ltr")
        || (this.getOption("activeSlide") == (this.getSlideCount-1) && this.getSlideDirection(slideOffset)=="rtl")  
    )
    {
    	//We will do the check
    	console.log(slideDuration,slideDuration > this.getOption('thresholdSkipTime'),slideOffset==0,(this.getOption("activeSlide") && this.getSlideDirection(slideOffset)=="ltr"),(this.getOption("activeSlide") == (this.getSlideCount-1) && this.getSlideDirection(slideOffset)=="rtl"));
		return false;
    }


    //We will do the threshold check
    return true;
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