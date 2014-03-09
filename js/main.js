/*jslint browser:true, devel:true, white:true, vars:true, eqeq:true */
/*global $:false, intel:false*/
/** 
 * This function runs once the page is loaded, but intel is not yet active 
 */

var windowHeight;
var init = function () {
    windowHeight=window.innerHeight;
    var currentpic = document.getElementById("slideshowpicid");  
    currentpic.onload=alignImageMiddle;
};

window.addEventListener("load", init, false);  

/**
 * Prevent Default Scrolling 
 */
var preventDefaultScroll = function(event) 
{
    // Prevent scrolling on this element
    event.preventDefault();
    window.scroll(0,0);
    return false;
};
    
window.document.addEventListener("touchmove", preventDefaultScroll, false);

/**
 * Device Ready Code 
 * This event handler is fired once the JavaScript bridge library is ready
 */
function onDeviceReady()
{
    //lock orientation
    intel.xdk.device.setRotateOrientation("portrait");
    intel.xdk.device.setAutoRotate(false);
        
    //manage power
    intel.xdk.device.managePower(true,false);

    //hide splash screen
    intel.xdk.device.hideSplashScreen();
}
    
document.addEventListener("intel.xdk.device.ready",onDeviceReady,false); 
   
//Event listener for camera
document.addEventListener("intel.xdk.camera.picture.add",onSuccess); 
document.addEventListener("intel.xdk.camera.picture.busy",onSuccess); 
document.addEventListener("intel.xdk.camera.picture.cancel",onSuccess); 
var picturecount=0;

function onSuccess(event) 
{
    if (event.success === true)
    {
        var imagesrc = intel.xdk.camera.getPictureURL(event.filename);
        var pic1 = document.getElementById("photoone");
        var pic2 = document.getElementById("phototwo");
        var pic3 = document.getElementById("photothree");
        var changebutton = document.getElementById("buttonid");    

        pic3.src = pic2.src;
        pic2.src = pic1.src;
        pic1.src = imagesrc;

        if(picturecount>=2)  
        {
            changebutton.innerHTML = "Make Slideshow";
            changebutton.className = "button showbutton";
            changebutton.onclick=makeslideshow;
        } 
        picturecount++;       
    }
    else
    {
        if (event.message !== undefined)
        {
            alert(event.message);
        }
        else
        {
            alert("error capturing picture");
        }
    }
}

//This function creates the slideshow of the captured pictures.
function makeslideshow()
{
    var changebutton = document.getElementById("buttonid");
    var pic1 = document.getElementById("photoone");
    var pic2 = document.getElementById("phototwo");
    var pic3 = document.getElementById("photothree");
    pic1.className="hide";
    pic2.className="hide";
    pic3.className="hide"; 
    changebutton.innerHTML="Take Picture";   
    changebutton.className="button hide";
    document.getElementById("imagecontent").className="show";
    var currentpic = document.getElementById("slideshowpicid");
    currentpic.src=pic1.src;
}

function alignImageMiddle(){
    var currentpic = document.getElementById("slideshowpicid");  
    var height = window.innerHeight;
    currentpic.style.marginTop=(height-currentpic.offsetHeight)/2+"px";
}

/**
 * The following functions could be a single function that moves forwards or backwards.
 * For the demo we want users to be able to see exactly what is going on
 */

//Move to the next picture.  If we are at the last picture, we jump to the first.
function Next()
{
    var pic1 = document.getElementById("photoone");
    var pic2 = document.getElementById("phototwo");
    var pic3 = document.getElementById("photothree");
    var currentpic = document.getElementById("slideshowpicid");
    var currentsrc = currentpic.src;

    if(currentsrc===pic1.src)
    {
        document.getElementById("slideshowpicid").src=pic2.src;  
    }
    else if(currentsrc===pic2.src)
    {
        document.getElementById("slideshowpicid").src=pic3.src;
    }
    else
    {
        document.getElementById("slideshowpicid").src=pic1.src;
    }
    
}

//Move to previous picture.  If we are at the first picutre, we jump to the last.
function Previous()
{
    var pic1 = document.getElementById("photoone");
    var pic2 = document.getElementById("phototwo");
    var pic3 = document.getElementById("photothree");

    var currentsrc = document.getElementById("slideshowpicid").src;

     if(currentsrc===pic1.src)
    {
       document.getElementById("slideshowpicid").src=pic3.src; 
    }
    else if(currentsrc===pic2.src)
    {
        document.getElementById("slideshowpicid").src=pic1.src;
    }
    else
    {
       document.getElementById("slideshowpicid").src=pic2.src;
    }

}

//Functionality to end the slideshow
function endslideshow()
{
    document.getElementById("imagecontent").className="hide";
    picturecount=0;

    var pic1 = document.getElementById("photoone");
    var pic2 = document.getElementById("phototwo");
    var pic3 = document.getElementById("photothree");
    var changebutton = document.getElementById("buttonid");
    
    pic1.className="";
    pic2.className="";
    pic3.className="";  

    pic1.src="images/EmptyBox-Phone.png";
    pic2.src="images/EmptyBox-Phone.png";
    pic3.src="images/EmptyBox-Phone.png";
    
    changebutton.onclick=takepicture;  
    changebutton.className="button";
}

//Camera button functionality
function takepicture()
{
    intel.xdk.camera.takePicture(80, true, "jpg");
} 
