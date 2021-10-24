var buff = new Buffer("#0mywave");
var numberOfWaves = 1;
var freq = 100;

function bang(){
		/*
		buff.poke( 1, 0, samples );
		*/
		
		///buff.send('sizeinsamps',  2048);
		
		setWaves('sine');
}

function frequency(){
	freq = arguments[0];
	outlet(0, freq / numberOfWaves );
}


function midievent(){
	post( arguments );
	
	if (arguments[0] === 144){
		midiFrequency( arguments[1] );
	}
	
}

function mtof(midinote){
	return 440.0 * Math.pow(2.0, (midinote - 69)/12);
}


function midiFrequency(){
	freq = mtof( arguments[0] );
	outlet(0, freq / numberOfWaves );
}


function testfill(){
	buff.send('fill', 'sin', 2);
}


function setWaves(){
		var args = arguments;
		numberOfWaves = args.length;
		
		var bufferLength = buff.framecount();
		var waveLength = bufferLength / args.length;
		var samples = new Array;

		// parse waves for valid list then proceed


		for( var i = 0; i < numberOfWaves; i++ ){
			post( args[i] );
			if( args[i] === "noise" ){
				samples = samples.concat( generateNoise( bufferLength/numberOfWaves) );
			}
			if( args[i] === "sin" ){
				samples = samples.concat( generateSin( bufferLength/numberOfWaves ) );
			}
			if( args[i] === "square"){
				samples = samples.concat( generateSquare( bufferLength/numberOfWaves ) );
			}
			if( args[i] === "saw" ){
				samples = samples.concat( generateSaw( bufferLength/numberOfWaves ) );
			}
			if( args[i] === "tri" ){
				samples = samples.concat( generateTriangle( bufferLength/numberOfWaves ) );
			}
			/// sine noise square // todo saw triangle
		}	
		
		buff.poke( 1, 0, samples );	 
		
		
		outlet( 0, freq / numberOfWaves);
}


function generateSin( numberOfSamples ){

	var samples = new Array;
	
	for( var i = 0; i < numberOfSamples; i++){
		samples[i] = Math.sin( (i / numberOfSamples) * Math.PI * 2);
	}
	
	return samples;
}

function generateNoise( numberOfSamples ){
	
		var samples = new Array;
		
		for ( var i = 0; i < numberOfSamples; i++){
				samples[i] = Math.random() * 2 - 1;
		}	
		
		return samples;
}

function generateSquare( numberOfSamples ){
		var samples = new Array;
	
		for( var i = 0; i < numberOfSamples; i++){
			samples[i] = (i < numberOfSamples/2)? 1 : -1;
		}
		return samples;
}


/// https://en.wikipedia.org/wiki/Triangle_wave
function generateTriangle( numberOfSamples ){
	var samples = new Array;
		
	var p = numberOfSamples;
	var a = 1;
	for (var i = 0; i < numberOfSamples; i++){
		samples[i] = 4*a/p * Math.abs((((i-p/4)%p)+p)%p - p/2) - a;
	}
		
	return samples; 
}

function generateSaw( numberOfSamples ){
	var samples = new Array;
	for(var i = 0; i  < numberOfSamples; i++ ){
		samples[i] =  2 * ( (i + numberOfSamples/2) %numberOfSamples / numberOfSamples  ) - 1;
	}
	return samples;
}