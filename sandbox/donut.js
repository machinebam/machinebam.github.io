var canvas = document.createElement('canvas'),
		    width = canvas.width = window.innerWidth,
		    height = canvas.height = window.innerHeight,
		    halfWidth = width / 2,
		    halfHeight = height / 2,
		    fov = 450,
		    mouseX = 120,
		    mouseY = 73;

		var context = canvas.getContext('2d');
		document.body.appendChild(canvas);
		document.body.addEventListener("mousemove", onMouseMove);


		// set up a torus shape of pixels
		var pixels = []; 

		for(var i = 0; i<Math.PI*2-0.0001; i+=Math.PI/90) { 

		    for(var j =0;j<Math.PI*2-0.0001; j+=Math.PI/24) { 

		                var pixel = new Pixel3D(40,0,0);
		                pixel.rotateZ(j);
		                pixel.x+=120; 
		                pixel.rotateY(i); 
		                pixels.push(pixel); 
		        
		    }
		}
		    

		// call the render function 30 times a second
		setInterval(render, 1000 / 30);


		function render() {
		    
		    // clear the canvas
		    context.clearRect(0, 0, width, height);
		    // and get the imagedata out of it
		    var imagedata = context.getImageData(0, 0, canvas.width, canvas.height);

		    // iterate through every point in the array
		    var i = pixels.length;
		    while (i--) {
		        var pixel = pixels[i];

		        // here's the 3D to 2D formula, first work out 
		        // scale for that pixel's z position (distance from 
		        // camera)
		        var scale = fov / (fov + pixel.z);
		        // and multiply our 3D x and y to get our
		        // 2D x and y. Add halfWidth and halfHeight
		        // so that our 2D origin is in the middle of 
		        // the screen.
		        var x2d = (pixel.x * scale) + halfWidth; 
		        var y2d = (pixel.y * scale) + halfHeight; 

		        // and add the pixel colour to whatever's there
		        // already
		        additiveBlendPixel(imagedata, x2d, y2d, 1,0,200); 
		        
		        // now rotate each 3d pixel around the origin
		        // dependent on the mouse position
		        pixel.rotateX(mouseY*0.0001); 
		        pixel.rotateY(mouseX*0.0001); 


		    }

		    // and write all those pixel values into the canvas
		    context.putImageData(imagedata, 0, 0);

		}

		function additiveBlendPixel(imagedata, x, y, r, g, b) {
		    
		    if((x<0) || (x>width) || (y<0) || (y>width)) return; 
		    
		    var i = ((y>>0) * imagedata.width + (x>>0)) * 4;
		    
		    r=(imagedata.data[i]+r);
		    g=(imagedata.data[i+1]+g); 
		    b=(imagedata.data[i+2]+b); 

		    //console.log(r,g,b); 
		    imagedata.data[i] = r;
		    imagedata.data[i+1] = g;
		    imagedata.data[i+2] = b;
		    imagedata.data[i+3] = 255;
		}

		function Pixel3D(x,y,z) { 
		    this.x = x; 
		    this.y = y; 
		    this.z = z;
		    
		    this.rotateY = function(angle){

		        cosRY = Math.cos(angle);
		        sinRY = Math.sin(angle);

		        var tempz = this.z;; 
		        var tempx = this.x; 

		        this.x= (tempx*cosRY)+(tempz*sinRY);
		        this.z= (tempx*-sinRY)+(tempz*cosRY);


		    };
		    this.rotateX = function(angle){

		        cosRY = Math.cos(angle);
		        sinRY = Math.sin(angle);

		        var tempz = this.z;; 
		        var tempy = this.y; 

		        this.y= (tempy*cosRY)+(tempz*sinRY);
		        this.z= (tempy*-sinRY)+(tempz*cosRY);


		    };

		    this.rotateZ = function(angle){

		        cosRY = Math.cos(angle);
		        sinRY = Math.sin(angle);

		        var tempx = this.x;; 
		        var tempy = this.y; 

		        this.y= (tempy*cosRY)+(tempx*sinRY);
		        this.x= (tempy*-sinRY)+(tempx*cosRY);


		    };
		}


		function onMouseMove(e) {
		    mouseX = (halfWidth - e.clientX);
		    mouseY = (halfHeight - e.clientY);

		}