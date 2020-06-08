var coverChanged = 0;
var start;
var hide;
// 0 -> hide ,  1 -> extract
// By default task: hiding
var currentTask = 0;

function hideMode(){
    if(currentTask == 1){
        document.getElementById("extractContext").style.visibility = "hidden";
        document.getElementById("hideContext").style.visibility = "visible";
        currentTask = 0;
    }
}
function extractMode(){
    if(currentTask == 0){
        document.getElementById("hideContext").style.visibility = "hidden";
        document.getElementById("extractContext").style.visibility = "visible";
        currentTask = 1;
    }

}
function fetchSuitableWidthForCanvas(ImageHeight, ImageWidth, CanvasHeight){
    var ratio = CanvasHeight/ImageHeight;
    var result = ratio*ImageWidth;
    return result+"vh";
}
function fetchSuitableWidthForForm(ImageHeight, ImageWidth, CanvasHeight){
    var ratio = CanvasHeight/ImageHeight;
    var result = ratio*ImageWidth;
    result = result + 2;
    return result+"vh";
}
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
    var h = start.getHeight();
    var w = start.getWidth();
    //coverChanged = 1;
    start.drawTo(startCanvas);
}
//



function loadCover(){
    var startCanvas = document.getElementById("inthisIMGcanvas");
    start = new SimpleImage("../static/Photos/originalCover.jpg");
    start.drawTo(startCanvas);
}


function cropIMGs(){
    // crop simple images
    // start = cropped start
    // hide = cropped hide
    var x, y;
    
    var croppedHeight = hide.getHeight();
    var croppedWidth = hide.getWidth();

    var newCover = new SimpleImage(croppedWidth,croppedHeight);
     for(var pixel of newCover.values()){
   	    x = pixel.getX();
        y = pixel.getY();
        var oldPixel = start.getPixel(x,y);

        pixel.setRed(oldPixel.getRed());
        pixel.setBlue(oldPixel.getBlue());
        pixel.setGreen(oldPixel.getGreen()); 
     }
     start = newCover;
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
    var x;
    var y;
    // working remaining
    for( var pixel of extracted.values()){
        x = pixel.getX();
        y = pixel.getY();
        var ansPixel = answer.getPixel(x,y);

        pixel.setRed( (ansPixel.getRed()%16) * 16 );
        pixel.setGreen( (ansPixel.getGreen()%16) * 16 );
        pixel.setBlue( (ansPixel.getBlue()%16) * 16 );
    }
    return extracted;
}
function dothestuff(){

    // All canvas obtained
    var resultCanvas = document.getElementById("resultCanvas");
    var extractCanvas = document.getElementById("extractionCanvas");
    // var hideCanvas = document.getElementById("hideIMGcanvas");
    // var startCanvas = document.getElementById("inthisIMGcanvas");


    // start and hide are already updated every time it is changed

    if(  (hide.getHeight() > start.getHeight()) || (hide.getWidth() > start.getWidth())  ){
        alert("Resoultion of image to be hidden is greater than covering image :(");
        return;
    }
    else if( (hide.getHeight() != start.getHeight()) || (hide.getWidth() != start.getWidth())){
        cropIMGs();
        alert("Cover image cropped to match up the resolution of hidden image !");
    }
        
    

    //if(coverChanged > 0)
    start = chop2hide(start);
    //start.drawTo(resultCanvas);
    //alert("Start chopping done");
    
    hide = shift(hide);
    //hide.drawTo(resultCanvas);
    //alert("hide shifting done");



    var result = combine(start,hide);
    result.drawTo(resultCanvas);
    
    var extracted = extract(result);
    extracted.drawTo(extractCanvas);

    var suitableWidthForResultCanvas = fetchSuitableWidthForCanvas(result.getHeight(), result.getWidth(), 72);
    var suitableWidthForExtractedCanvas = fetchSuitableWidthForCanvas(extracted.getHeight(), extracted.getWidth() , 72);

    //alert("result width: "+suitableWidthForResultCanvas+". canvas width: "+suitableWidthForExtractedCanvas);
    
    document.getElementById("resultCanvas").style.width = suitableWidthForResultCanvas;
    document.getElementById("extractionCanvas").style.width = suitableWidthForExtractedCanvas;
    document.getElementById("resultCanvas").style.height="72vh";
    document.getElementById("extractionCanvas").style.height="72vh";
    document.getElementById("result").style.width = fetchSuitableWidthForForm(result.getHeight(), result.getWidth(), 72);
    document.getElementById("extraction").style.width = fetchSuitableWidthForForm(extracted.getHeight(), extracted.getWidth() , 72);
}
 

// Extraction code 
var givenImage, extractedImage;
function uploadExtractSrc(){
    var givenCanvas = document.getElementById("extractSrcImgCanvas");
    var givenImageHolder = document.getElementById("extractSrcInput");
    givenImage = new SimpleImage(givenImageHolder);
    givenImage.drawTo(givenCanvas);
}
function doExtraction(){
    var extractCanvas = document.getElementById("extractResultImgCanvas")
    extractedImage = extract(givenImage);
    extractedImage.drawTo(extractCanvas);
    document.getElementById("extractResultImgCanvas").style.height="75vh";
    document.getElementById("extractResultImgCanvas").style.width=fetchSuitableWidthForCanvas(extractedImage.getHeight(), extractedImage.getWidth(), 75);
    document.getElementById("extractResult").style.width = fetchSuitableWidthForForm(extractedImage.getHeight(), extractedImage.getWidth(), 75);
    
}




// Downloads:
function download() {
    var download = document.getElementById("download");
    var image = document.getElementById("resultCanvas").toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
    download.setAttribute("href", image);
    //download.setAttribute("download","archive.png");
}
function downloadOriginalIMG(){
    var download = document.getElementById("downloadOriginal");
    var image = document.getElementById("extractionCanvas").toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
    download.setAttribute("href", image);
}
function downloadExtractedIMG(){
    var download = document.getElementById("downloadExtracted");
    var image = document.getElementById("extractResultImgCanvas").toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
    download.setAttribute("href", image);
}