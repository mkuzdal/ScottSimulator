var noiseHeight = 128;
var noiseWidth = 128;
var noise = [];

function smoothNoise (x, y) {
	var fractX = x - Math.floor (x);
	var fractY = y - Math.floor (y);

	var x1 = (Math.floor (x) + noiseWidth) % noiseWidth;
	var y1 = (Math.floor (x) + noiseHeight) % noiseHeight;

	var x2 = (x1 + noiseWidth - 1) % noiseWidth;
	var y2 = (y1 + noiseWidth - 1) % noiseHeight;

	var value = 0.0;
	value += fractX       * fractY       * noise[y1][x1];
   	value += (1 - fractX) * fractY       * noise[y1][x2];
   	value += fractX       * (1 - fractY) * noise[y2][x1];
   	value += (1 - fractX) * (1 - fractY) * noise[y2][x2];

    return value;
}

function turbulence (x, y, size) {
	var value = 0.0;
	var initialSize = size;

	while (size >= 1) {
		value += smoothNoise (x / size, y / size) * size;
		size /= 2.0;
	}

	return (128.0 * value / initialSize);
}

function generateNoise () {
  	for (var y = 0; y < noiseHeight; y++) {
  		var noise_y = [];
 		for (var x = 0; x < noiseWidth; x++) {
    		noise_y.push (Math.random ());
  		}
  		noise.push (noise_y);
  	}

  	console.log (noise);
}

