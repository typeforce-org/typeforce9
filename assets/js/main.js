var Main = (function($) {

  var screen_width = 0,
      breakpoint_small = false,
      breakpoint_medium = false,
      breakpoint_large = false,
      breakpoint_array = [480,600,1200],
      $document,
      loadingTimer;

  // TOO MANY Global Vars

  // 3d Rendering
  var camera, scene, renderer;
  var nines=[], landscapes=[], icosphere, skybox, sykboxLoaded = false;
  var renderingStarted = false;

  // User sensor data
  var userX = 0;
  var userY = 0;

  // Page handling
  var currentPage = 'home';
  var lastPage = currentPage;

  // Animation
  var currentNineModel = 4;
  var cameraFovDesired = 72.2;
  var cameraPositionDesired = [0, -1.5, 8];
  var cameraSpeed = 1;
  var nineRotationDesired = [0+d2r(-90),0,0]; // For some reason needs a 90 deg correction in x axis, been meaning to solve that mystery, think it has to do with collada import
  var landscapeSpeed = 0.8;
  var nineRotationSpeed = 0.03;
  var landscapePositionYHidden = -20;
  var cameraAimYDesired = 0;
  var cameraAimYPrevious = 0;
  var landscape0PositionYDesired = landscapePositionYHidden;
  var landscape1PositionYDesired = landscapePositionYHidden;

  // Debugging Options / Vars
  var enableAxis = false;
  var enableKeyPositioning = false;
  var displayOrientation = false;
  var displayOrientation = false;
  var forceAssetReload = false;
  var assetHash = ''; // To force reload of 3d assets in debugging via a query string


  function _init() {
    // touch-friendly fast clicks
    FastClick.attach(document.body);

    // Cache some common DOM queries
    $document = $(document);

    // Set screen size vars
    _resize();

    // Set debugging vars based on query string
    readDebuggingVars();

    // Init functions
    init3D();

    // Esc handlers
    $(document).keyup(function(e) {
      if (e.keyCode === 27) {
        gotoPage('home');
      }
    });


    // ?enableKeyPositioning=true enables key press positioning/rotation of tricky elements (for debugging)
    $(document).keydown(function(e) {
      if(enableKeyPositioning){
        // q: Nine Rot X-
        if (e.keyCode === 81) {
          nineRotationDesired[0]-=d2r(1);
        }

        // w: Nine Rot X+
        if (e.keyCode === 87) {
          nineRotationDesired[0]+=d2r(1);
        }

        // a: Nine Rot Y-
        if (e.keyCode === 65) {
          nineRotationDesired[1]-=d2r(1);
        }

        // s: Nine Rot Y+
        if (e.keyCode === 83) {
          nineRotationDesired[1]+=d2r(1);
        }

        // z: Nine Rot Z-
        if (e.keyCode === 90) {
          nineRotationDesired[2]-=d2r(1);
        }

        // x: Nine Rot Z+
        if (e.keyCode === 88) {
          nineRotationDesired[2]+=d2r(1);
        }

        // o: FOV-
        if (e.keyCode === 79) {
          cameraFovDesired-=1;
        }

        // p: FOV+
        if (e.keyCode === 80) {
          cameraFovDesired+=1;
        }

        // d: Camera Aim Y-
        if (e.keyCode === 68) {
          cameraAimYDesired-=0.1;
        }

        // f: Camera Aim Y+
        if (e.keyCode === 70) {
          cameraAimYDesired+=0.1;
        }

        // Notify user of new values
        console.log('Nine Rot: ('+Math.floor(r2d(nines[0].rotation.x))+', '+Math.floor(r2d(nines[0].rotation.y))+', '+Math.floor(r2d(nines[0].rotation.z))+')');
        console.log('FOV: '+cameraFovDesired);
        console.log('Camera Aim Y: '+cameraAimYDesired);

      }
    });

  } // end init()

  // Track ajax pages in Analytics
  function _trackPage() {
    if (typeof ga !== 'undefined') { ga('send', 'pageview', document.location.href); }
  }

  // Track events in Analytics
  function _trackEvent(category, action) {
    if (typeof ga !== 'undefined') { ga('send', 'event', category, action); }
  }

  // Called in quick succession as window is resized
  function _resize() {
    screenWidth = document.documentElement.clientWidth;
    breakpoint_small = (screenWidth >= breakpoint_array[0]);
    breakpoint_medium = (screenWidth >= breakpoint_array[1]);
    breakpoint_large = (screenWidth >= breakpoint_array[2]);

    resize3D();
  }

  // Built a bunch of debugging features that can be accessed by query strings
  function readDebuggingVars() {

    // Get query string vars
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++){
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }

    // See if any of the debugging options are present in query string vars
    if ( typeof vars.enableAxis !== 'undefined' ) { enableAxis = vars.enableAxis; }
    if ( typeof vars.enableKeyPositioning !== 'undefined' ) { enableKeyPositioning = vars.enableKeyPositioning; }
    if ( typeof vars.displayOrientation !== 'undefined' ) { displayOrientation = vars.displayOrientation; }
    if ( typeof vars.forceAssetReload !== 'undefined' ) {
      forceAssetReload = vars.forceAssetReload;
      if (forceAssetReload) {
        assetHash = '?force_reload_'+(new Date().getTime());
      }
    }
  }

  function init3D() {

    // Check for webGL
    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

    // Configure the camera
    camera = new THREE.PerspectiveCamera( cameraFovDesired, window.innerWidth / window.innerHeight, 0.01, 100 );

    // Create a scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x090114 );

    // Ambient Light
    var light = new THREE.AmbientLight( 0xaaaaaa ); // soft white light
    scene.add( light );

    // Create renderer obj
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );

    // Show Axes helper if dictacted by query vars
    if(enableAxis){
      var axesHelper = new THREE.AxesHelper( 5 );
      scene.add( axesHelper );
    }

    // Load the things
    loadSkybox();
    loadIcosphere();
    for(i=0;i<9;i++) {
      loadNine(i);
    }
    loadLandscape(0);
    loadLandscape(1);

    // After eveything is loaded, everythingLoaded() will finish the init process
  }

  function loadSkybox() {
    // Make Skybox for Reflective Materials
    skybox = new THREE.CubeTextureLoader()
      .setPath('assets/skybox/')
      .load( [ 'x-pos.png'+assetHash,'x-neg.png'+assetHash,'y-pos.png'+assetHash,'y-neg.png'+assetHash,'z-pos.png'+assetHash,'z-neg.png'+assetHash ], function() {

        // On complete
        sykboxLoaded = true;
        checkIfEverythingLoaded();
      });
  }

  function loadIcosphere() {
    // Path of collada (dae) model file
    daeLocation = 'assets/models/icosphere.dae'+assetHash;
    console.log(daeLocation);

    // Load Collada
    var loader = new THREE.ColladaLoader();
    loader.load(daeLocation, function(collada) {
      // Once that model is loaded...

      // Wireframe material
      icosphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x0c0061,
        wireframe: true
      });

      // Grab the scene in the collada file
      icosphere = collada.scene;

      // Traverse each child of scene
      icosphere.traverse ( function (child) {

        // Set every child mesh to have wireframe material
        if (child instanceof THREE.Mesh) {
          child.material = icosphereMaterial;
        }

        // Remove light source in collada scene
        if (child instanceof THREE.PointLight) {
          child.remove();
        }
      });

      // Add to scene
      scene.add(icosphere);

      // Check if all the models have loaded
      checkIfEverythingLoaded();
    });
  }

  function loadNine(whichNine) {
    // Path of collada (dae) model file
    var daeLocation = 'assets/models/nine-'+whichNine+'.dae'+assetHash;

        // Make into material
    var nineMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff, envMap: skybox } );

    // Load Collada
    var loader = new THREE.ColladaLoader();
    loader.load(daeLocation, function(collada) {
      // Once that model is loaded...

      // Grab the scene in the collada file
      nines[whichNine] = collada.scene;

      // Traverse each child of scene
      nines[whichNine].traverse ( function (child) {

        // Set every child mesh to have reflective material
        if (child instanceof THREE.Mesh) {
          child.material = nineMaterial;
        }

        // Remove light source in collada scene
        if (child instanceof THREE.PointLight) {
          child.remove();
        }
      });

      // Add to scene
      scene.add(nines[whichNine]);

      // Make invisible
      setObjectVisiblity(nines[whichNine],false);

      // Check if all the models have loaded
      checkIfEverythingLoaded();
    });
  }

  function loadLandscape(whichLandscape) {
    // Path of collada (dae) model file
    var daeLocation = 'assets/models/landscape-'+whichLandscape+'.dae'+assetHash;

    // Make into material
    var landscapeMaterial = new THREE.MeshLambertMaterial( {color: 0x000aff, side: THREE.DoubleSide} );

    // Load Collada
    var loader = new THREE.ColladaLoader();
    loader.load(daeLocation, function(collada) {
      // Once that model is loaded...

      // Grab the scene in the collada file
      landscapes[whichLandscape] = collada.scene;

      // Traverse each child of scene
      landscapes[whichLandscape].traverse ( function (child) {

        // Set every child mesh to have lambert material
        if (child instanceof THREE.Mesh) {
          child.material = landscapeMaterial;
        }
      });

      // Add to scene
      scene.add(landscapes[whichLandscape]);

      // Send to the depths
      landscapes[whichLandscape].position.y = landscapePositionYHidden;

      // Check if all the models have loaded
      checkIfEverythingLoaded();
    });
  }

  function checkIfEverythingLoaded() {
    // Check to see if each model is loaded (if its associated global var is not empty)
    // and whether the skybox images have loaded (handled by boolean sykboxLoaded)
    if (
      nines[0] &&
      nines[1] &&
      nines[2] &&
      nines[3] &&
      nines[4] &&
      nines[5] &&
      nines[6] &&
      nines[7] &&
      nines[8] &&
      icosphere &&
      landscapes[0] &&
      landscapes[1] &&
      sykboxLoaded
    ) {
      everythingLoaded();
    }
  }

  // What to do when all 3d assets are loaded up
  function everythingLoaded() {
    // Add the renderer to the DOM
    document.body.appendChild( renderer.domElement );

    // Page handling/switching
    initPageNavigation();

    // Watch the users sensor (mouse or accelerometer)
    initUserPositioning();

    // Make first nine visible
    setObjectVisiblity(nines[currentNineModel],true);

    // Begin animation/rendering
    render3D();

    // Animation Started
    $('body').addClass('loaded');
  }

  // Handling of navigation between 3 "pages"
  function initPageNavigation() {

    // Start home (a lot of the corresponding values are hardcoded in index.php anyway)
    gotoPage('home');

    // Nav buttons
    $document.on('click','.goto-page', function (e) {
      e.preventDefault();
      var page = $(this).attr('data-target-page');
      gotoPage(page);
    });
  }

  // Goto a specific page
  function gotoPage(page) {
    currentPage = page;
    $('body').attr('data-current-page',page);
  }

  // Get the position of the users sensor (mouse of phone accelerometer)
  function initUserPositioning() {

    // For throttling
    var lastMove = 0;
    var eventThrottle = 10;

    // UI for testing acceleromater
    if(displayOrientation) { $('body').append('<div class="orientation"></div>'); }

    console.log(Modernizr);

    // UserX,Y will be given used to animate and will be read from accelerometers on devices that have those AND have touch screens
    // Otherwise we use mouse!
    // Note: Many laptops have acclerometers (hence the necessity of detecting touch)
    // It's not perfect but its the best I can figure to test...
    if (window.DeviceOrientationEvent && Modernizr.touchevents) {

      window.addEventListener("deviceorientation", function (event) {

        // Throttle (thanks Matt!)
        var now = Date.now();
        if (now > lastMove + eventThrottle) {
          lastMove = now;

          // Update debugging UI
          if(displayOrientation) {
            $('.orientation').empty().append('Gamma: '+event.gamma.toFixed(2)+'<br>userX: '+userX+'<br>Beta: '+event.beta.toFixed(2)+'<br>userY: '+userY+'<br>');
          }

          // Adjust position based on phone's angles
          userX = -Math.min(Math.max((event.gamma/90)*4,-1),1); // gamma: left to right  (negative to invert, multipliers and cutoffs are fine tunings to the mapping based on testing)
          userY = -Math.min(Math.max((event.beta/90),-1),1)*2; // beta: up and down
        }
      }, false);
    } else {

      // Update the debugging UI
      if (displayOrientation) {
        $('.orientation').empty().append((window.DeviceOrientationEvent ? 'Orientation Supported<br>': 'No Orientation Event<br>')+(Modernizr.touchevents ? 'Touch': 'No Touch'));
      }

      // Adjust position based on mouse (if present)
      $(document).on('mousemove', function(e) {
        e.preventDefault();

        // Throttle (thanks Matt!)
        var now = Date.now();
        if (now > lastMove + eventThrottle) {
          lastMove = now;

          // Get vars
          var mouseX = e.pageX;
          var mouseY = e.pageY;
          var windowWidth = window.innerWidth;
          var windowHeight = window.innerHeight;

          // Map mouse x position to continuum [-1,1]
          userX = (mouseX/windowWidth)*2-1;
          userY = (mouseY/windowHeight)*2-1;
        }
      });
    }
  }

  // Animate the letters on the homescreen
  function animateLetters() {
    $('.site-header .t').css({'left':(-userX*50+50)+'%'});
    $('.site-header .f').css({'left':(userX*50+50)+'%'});
  }

  // Render the scene
  function render3D() {
    renderingStarted = true;

    // Do this every time the system is ready to animate
    requestAnimationFrame( render3D );

    // Sphere is always rotating
    icosphere.rotation.z += 0.001;

    // Did we just change pages?
    var justChangedPage = lastPage !== currentPage;

    // We'll want to know if our calculations change the nine model, so store it
    var previousNineModel = currentNineModel;

    // First, choose desired values based on which page

    // Home scene
    if(currentPage==='home'){

      // Set desired paremeters that will be static on this page at moment of page change
      if(currentPage !== lastPage) {

        // Nine Rotation
        nineRotationDesired = [0+d2r(-90),0,0]; // For some reason needs a 90 deg correction in x axis, been meaning to solve that mystery, think it has to do with collada import

        // Camera
        cameraFovDesired = 72.2;
        cameraAimYDesired = 0;
        cameraSpeed = 2; // Camera moves fast w/ userX,Y

        // Landscape Y Pos
        landscape0PositionYDesired = landscapePositionYHidden;
        landscape1PositionYDesired = landscapePositionYHidden;
      }

      // Nine model (dynamic based on userX,Y)
      currentNineModel = Math.floor(((userX+0.70)/1.4)*9);
      if (currentNineModel < 0) { currentNineModel = 0; }
      if (currentNineModel > 8) { currentNineModel = 8; }

      // Camera positioning (dynamic based on userX,Y)
      cameraPositionDesired = [
        Math.pow(userX,3)*2.83+userX*4.08,
        -1.5-(userY*2),
        8
      ];
    }

    // Submit scene
    if(currentPage==='submit'){

      // Set desired paremeters that will be static on this page at moment of page change
      if(currentPage !== lastPage) {

        // Set which nine model
        currentNineModel = 8;

        // Rotate the nine
        nineRotationDesired = [d2r(-110),d2r(44),d2r(8)]; // For some reason needs a 90 deg correction in x axis, been meaning to solve that mystery, think it has to do with collada import

        // Camera changes
        cameraFovDesired = 18;
        cameraAimYDesired = 1;
        cameraSpeed = 0.5; // Camera is slow

        // Landscape Y Pos
        landscape0PositionYDesired = landscapePositionYHidden;
        landscape1PositionYDesired = -0.4;
      }

      // Camera positioning (dynamic based on userX,Y)
      cameraPositionDesired = [
        7+userX/2,
        -1.5+userY/2,
        8
      ];
    }

    // Details scene
    if(currentPage==='details'){

      // Set desired paremeters that will be static on this page at moment of page change
      if(currentPage !== lastPage) {

        // Set which nine model
        currentNineModel = 0;

        // Rotate the nine
        nineRotationDesired = [d2r(-121),d2r(-26),d2r(-30)]; // For some reason needs a 90 deg correction in x axis, been meaning to solve that mystery, think it has to do with collada import

        // Camera
        cameraFovDesired = 17;
        cameraAimYDesired = 0.4;
        cameraSpeed = 0.5;

        // Landscape Y Pos
        landscape0PositionYDesired = 0;
        landscape1PositionYDesired = landscapePositionYHidden;
      }

      // Camera static position
      cameraPositionDesired = [
        -7+userX/2,
        -1.5+userY/2,
        8
      ];
    }

    // Hide/show models and place/rotate/aim everything at their desired values or one increment closer to their desired values

    // Change nine model if necessary
    if(currentNineModel !== previousNineModel) {
      setObjectVisiblity(nines[previousNineModel],false);
      setObjectVisiblity(nines[currentNineModel],true);
    }

    // Animate landscape height
      landscapes[0].position.y = animateValue(landscape0PositionYDesired, landscapes[0].position.y, landscapeSpeed);
      landscapes[1].position.y = animateValue(landscape1PositionYDesired, landscapes[1].position.y, landscapeSpeed);


    // Animate camera position to desired values
    camera.position.set(
      animateValue(cameraPositionDesired[0],camera.position.x,cameraSpeed),
      animateValue(cameraPositionDesired[1],camera.position.y,cameraSpeed),
      animateValue(cameraPositionDesired[2],camera.position.z,cameraSpeed)
    );

    // Animate fov to desired value
    if(cameraFovDesired !== camera.fov) {
      camera.fov = animateValue(cameraFovDesired,camera.fov,2);
      camera.updateProjectionMatrix();
    }

    // Repoint the camera at the nine (or to same X and Z but slightly different prescribed Y coord)
    var cameraAimYCurrent = animateValue(cameraAimYDesired, cameraAimYPrevious, 0.05);
    camera.lookAt(new THREE.Vector3( 0, cameraAimYCurrent , 0));
    cameraAimYPrevious = cameraAimYCurrent;

    // Animate the rotatation every nine model
    for(i=0;i<9;i++) {
      nines[i].rotation.set(
        animateValue(nineRotationDesired[0],nines[i].rotation.x,nineRotationSpeed),
        animateValue(nineRotationDesired[1],nines[i].rotation.y,nineRotationSpeed),
        animateValue(nineRotationDesired[2],nines[i].rotation.z,nineRotationSpeed)
      );
    }

    // Render
    renderer.render( scene, camera );

    // Animate Letters
    animateLetters();

    // Remember the current page
    lastPage = currentPage;
  }

  // Linearly progresses a value to a desired valuse
  function animateValue(desired,current,speed) {

    // If we are within speed of desired value, just return desired value
    if (desired < current+speed && desired > current-speed) {
      return desired;
    }

    // If we are bigger, subtract speed
    if (current > desired) {
      return current - speed;
    }

    // If we are smaller, add speed
    if (current < desired) {
      return current + speed;
    }
  }

  // Turne a Three.js scene object visible or invisible
  function setObjectVisiblity(object,visibleOrHidden) {
    object.traverse ( function (child) {
      if (child instanceof THREE.Mesh) {
        child.visible = visibleOrHidden;
      }
    });
  }

  // Convenience function for converting degrees to radians
  function d2r(degrees) {
    var radians = degrees * Math.PI/180;
    return radians;
  }

  // Convenience function for converting radians to degrees
  function r2d(radians) {
    var degrees = radians * 180/Math.PI;
    return degrees;
  }

  // Handle resizing
  function resize3D() {

    // If renderer has been set up...
    if(renderingStarted) {

      // Update the camera to reflect new window size
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      // Update size of renderer element
      renderer.setSize( window.innerWidth, window.innerHeight);
    }
  }

  // Public functions
  return {
    init: _init,
    resize: _resize,
    scrollBody: function(section, duration, delay) {
      _scrollBody(section, duration, delay);
    }
  };

})(jQuery);

// Fire up the mothership
jQuery(document).ready(Main.init);

// Zig-zag the mothership
jQuery(window).resize(Main.resize);
