var coverChanged = 0;
var start;
var hide;

//
function uploadHIDE(){
    var hideCanvas = document.getElementById("hideIMGcanvas");
    var hideImageHolder = document.getElementById("hideIMG");
    hide = new SimpleImage(hideImageHolder);
    hide.drawTo(hideCanvas);
}
function uploadINSIDE(){
    var startCanvas = document.getElementById("inthisIMGcanvas");
    var coverHolder = document.getElementById("inthisIMG");
    start = new SimpleImage(coverHolder);
    //coverChanged = 1;
    start.drawTo(startCanvas);
}
//



function loadCover(){
    var startCanvas = document.getElementById("inthisIMGcanvas");
    start = new SimpleImage("originalCover.jpg");
    start.drawTo(startCanvas);
}


function cropIMGs(){
    // crop simple images
    // start = cropped start
    // hide = cropped hide
}

function clearBits(colorval){
    // Zero out the low bits
    var x = Math.floor(colorval/16) * 16;
    return x;
}
function chop2hide(image){
    // Iterate over each pixel
    for(var pixel of image.values()){
        // Clear low bits of the red, blue & green
        pixel.setRed(clearBits(pixel.getRed()));
        pixel.setGreen(clearBits(pixel.getGreen()));
        pixel.setBlue(clearBits(pixel.getBlue()));
    }
    return image;
}
function shift(image){
    // Iterate over each pixel & shift most significant bits to least significant positions
    for(var pixel of image.values()){
        pixel.setRed(pixel.getRed()/16);
        pixel.setGreen(pixel.getGreen()/16);
        pixel.setBlue(pixel.getBlue()/16);
    }
    return image;
}
function combine(show, hide){
    // do try cropping
    var answer = new SimpleImage(show.getWidth(), show.getHeight());
    
    for(var pixel of answer.values()){
        var x = pixel.getX();
        var y = pixel.getY();
        var showPixel = show.getPixel(x,y);
        var hidePixel = hide.getPixel(x,y);
        pixel.setRed(showPixel.getRed() + hidePixel.getRed());
        pixel.setGreen(showPixel.getGreen() + hidePixel.getGreen());
        pixel.setBlue(showPixel.getBlue() + hidePixel.getBlue());
    }
    return answer;
}
function extract(answer){
    var extracted = new SimpleImage(answer.getWidth(), answer.getHeight());
    // working remaining

    return extracted;
}
function dothestuff(){

    // All canvas obtained
    var resultCanvas = document.getElementById("resultCanvas");
    var extractCanvas = document.getElementById("extractionCanvas");
    // var hideCanvas = document.getElementById("hideIMGcanvas");
    // var startCanvas = document.getElementById("inthisIMGcanvas");


    // start and hide are already updated every time it is changed
    // cropIMGs();

    //if(coverChanged > 0)
    start = chop2hide(start);
    //start.drawTo(resultCanvas);
    //alert('Start chopping done');
    
    hide = shift(hide);
    //hide.drawTo(resultCanvas);
    //alert('hide shifting done');

    var result = combine(start,hide);
    result.drawTo(resultCanvas);
    
    var extracted = extract(result);
    extracted.drawTo(extractCanvas)
}
 
