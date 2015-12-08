var fft = document.getElementsByTagName('fft-ifft')[0];

var blocksize = 64;
var data = new Float32Array([0,5,2,-1]);
var dataWindowed = new Float32Array(blocksize*10);
var resultWindowed = new Float32Array(dataWindowed.length);
var returnCounter = 0;

for (var i=0; i<dataWindowed.length; i++) {
    if (Math.floor(i/8)%2===0)
        dataWindowed[i] = (i%8)-4;
    else
        dataWindowed[i] = 4-(i%8);
    dataWindowed[i] /= 10; //divide by ten so its in signal range of audio
}

//wait until everything has loaded
window.addEventListener('cifReady', function() {
    fft.setForward(JSON.parse(JSON.stringify(data)));
});

fft.addEventListener(window.cubx.EventFactory.types.CIF_MODEL_CHANGE, modelChangeEventListener);

function processResultFromFoward() {
    var result = fft.getResultFromForward();
    var magn = result[0];
    var phase = result[1];
    
    fft.setInverse(JSON.parse(JSON.stringify([magn, phase])));
}

function processResultFromInverse() {
    var returnData = fft.getResultFromInverse();
    
    if (returnData.length !== data.length) {
        console.log("ERROR in fft: size after forward & inverse unequal");
        return;
    }
    
    for (var i=0; i<returnData.length; i++) {
        if (Math.abs(returnData[i]-data[i]) > 0.0001) {
            console.log("ERROR in fft: error in element "+i+" too big.");
            return;
        }
    }
    
    console.log("fft forward and inverse leads to same data");
}

function forwardWindowed() {
    var numBlocks = dataWindowed.length/blocksize;
    var hopData = new Float32Array(blocksize);
    for (var i=0; i<numBlocks; i++) {
        for (var j=0; j<blocksize; j++) {
            hopData[j] = dataWindowed[i*blocksize+j];
        }
        fft.setForwardWindowed(JSON.parse(JSON.stringify(hopData)));
    }
}

function processResultFromForwardWindowed() {
    var result = fft.getResultFromForwardWindowed();
    var magn = result[0];
    var phase = result[1];
    fft.setInverseWindowed(JSON.parse(JSON.stringify([magn, phase])));
}

function processResultFromInverseWindowed() {
    var returnData = fft.getResultFromInverseWindowed();
    for (var i=0; i<returnData.length; i++) {
        resultWindowed[returnCounter] = returnData[i];
        returnCounter++;
    }
    
    //compare when we got everything
    if (returnCounter !== resultWindowed.length)
        return;
        
    //first halfblock with zeros due to windowing
    for (var i=0; i<returnCounter-blocksize/2; i++) {
        var error = Math.abs(resultWindowed[i+blocksize/2]-dataWindowed[i]);
        if (error > 0.01) {
            console.log("ERROR in fft windowed: error in element "+i+" too big.");
            return;
        }
    }
    
    console.log("fft windowed forward and inverse leads to same data");
}

function modelChangeEventListener(event) {    
    if (event.detail.slot === "resultFromForward") {
        processResultFromFoward();
    } else if (event.detail.slot === "resultFromInverse") {
        processResultFromInverse();
        forwardWindowed();
    }
    else if (event.detail.slot === "resultFromForwardWindowed") {
        processResultFromForwardWindowed();
    }
    else if (event.detail.slot === "resultFromInverseWindowed") {
        processResultFromInverseWindowed();
    }
}



