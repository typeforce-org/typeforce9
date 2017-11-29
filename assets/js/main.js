var Main = (function($) {

  var screen_width = 0,
      breakpoint_small = false,
      breakpoint_medium = false,
      breakpoint_large = false,
      breakpoint_array = [480,600,1200],
      $document,
      loadingTimer;

  // Global Vars

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
  var currentNine = 4;
  var cameraFovDesired = 72.2;
  var cameraPositionDesired = [0, -1.5, 8];
  var cameraSpeed = 1;
  var nineRotationDesired = [0,0,0];
  var landscapeSpeed = 0.8;
  var nineRotationSpeed = 0.03;

  // Debugging Options
  var enableAxis = false;
  var enableKeyPositioning = false;
  var landscapeHeight = 0; // Only every used in debugging
  var cameraAimYDesired = 0;


  function _init() {
    // touch-friendly fast clicks
    FastClick.attach(document.body);

    // Cache some common DOM queries
    $document = $(document);

    // Set screen size vars
    _resize();

    // Set debugging vars based on query string
    readQueryVars();

    // Init functions
    init3D();

    // Esc handlers
    $(document).keyup(function(e) {
      if (e.keyCode === 27) {
        gotoPage('home');
      }
    });


    // Rotation (for debugging)
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

        // e: Landscape H-
        if (e.keyCode === 69) {
          landscapeHeight-=0.1;
        }

        // r: Landscape H+
        if (e.keyCode === 82) {
          landscapeHeight+=0.1;
        }

        // d: Camera Aim Y-
        if (e.keyCode === 68) {
          cameraAimYDesired-=0.1;
        }

        // f: Camera Aim Y+
        if (e.keyCode === 70) {
          cameraAimYDesired+=0.1;
        }

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

  // Get vars from query string (debugging features)
  function readQueryVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++){
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    if ( typeof vars.enableAxis !== 'undefined' ) { enableAxis = vars.enableAxis; }
    if ( typeof vars.enableKeyPositioning !== 'undefined' ) { enableKeyPositioning = vars.enableKeyPositioning; }
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
      .load( [ 'x-pos.png','x-neg.png','y-pos.png','y-neg.png','z-pos.png','z-neg.png' ], function() {

        // On complete
        sykboxLoaded = true;
        checkIfEverythingLoaded();
      });
  }

  function loadIcosphere() {
    // Path of collada (dae) model file
    daeLocation = 'assets/models/icosphere.dae';

    // Load Collada
    var loader = new THREE.ColladaLoader();
    loader.load(daeLocation, function(collada) {
      // Once that model is loaded...

      icosphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x0c0061,
        wireframe: true
      });

      // Grab the scene in the collada file
      icosphere = collada.scene;

      // Traverse each child of scene
      icosphere.traverse ( function (child) {

        // Set every child mesh to have reflective material
        if (child instanceof THREE.Mesh) {
          child.material = icosphereMaterial;
        }

        // Remove light souce in collada scene
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
    var daeLocation = 'assets/models/nine-'+whichNine+'.dae';

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

        // Remove light souce in collada scene
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
    var daeLocation = 'assets/models/landscape-'+whichLandscape+'.dae';

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

        // Set every child mesh to have reflective material
        if (child instanceof THREE.Mesh) {
          child.material = landscapeMaterial;
        }
      });

      // Add to scene
      scene.add(landscapes[whichLandscape]);

      // Send to the depths
      landscapes[whichLandscape].position.y = -20;

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

  function everythingLoaded() {
    // Add the renderer to the DOM
    document.body.appendChild( renderer.domElement );

    // Page handling/switching
    initPages();

    // Throttled mousewatching (and will be accelerometer tracking)
    initUserPositioning();

    // Make first nine visible
    setObjectVisiblity(nines[currentNine],true);

    // Begin animation/rendering
    animate3D();

    // Animation Started
    $('body').addClass('loaded');
  }

  function initPages() {
    gotoPage('home');
    $document.on('click','.goto-page', function (e) {
      e.preventDefault();
      var page = $(this).attr('data-target-page');
      gotoPage(page);
    });
  }

  function gotoPage(page) {
    currentPage = page;
    $('body').attr('data-current-page',page);
  }

  function initUserPositioning() {

    var lastMove = 0;
    var eventThrottle = 10;

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

    // Adjust position based on accelerometer (if present and a touch device)
    if (window.DeviceOrientationEvent && Modernizr.touchevents) {

      // UI for testing
      // $('body').append('<div class="orientation"></div>');

      window.addEventListener("deviceorientation", function (event) {

        // Throttle (thanks Matt!)
        var now = Date.now();
        if (now > lastMove + eventThrottle) {
          lastMove = now;

          // Adjust position based on phone's "roll" (gamma)
          userX = Math.min(Math.max((event.gamma/90)*4,-0.99),0.99); // gamma: left to right
          userY = Math.min(Math.max((event.beta/90)*4,-0.99),0.99); // beta: up and down

          // Update UI
          $('.orientation').empty().append(event.gamma);
        }
      }, false);
    }
  }

  function animateLetters() {
    $('.site-header .t').css({'left':(-userX*50+50)+'%'});
    $('.site-header .f').css({'left':(userX*50+50)+'%'});
  }

  function animate3D() {
    renderingStarted = true;

    // Do this every time the system is ready to animate
    requestAnimationFrame( animate3D );

    // Sphere is always rotating
    icosphere.rotation.z += 0.001;

    // Did we just change pages?
    var justChangedPage = lastPage !== currentPage;
    var previousNine = currentNine;

    // First, choose desired values based on which page

    // Home scene
    if(currentPage==='home'){

      // Camera moves fast (right with sensor)
      cameraSpeed = 2;

      // Determine which nine to display based on which 9th of normalized position we are in
      currentNine = Math.floor(((userX+0.75)/1.5)*9);
      if (currentNine < 0) { currentNine = 0; }
      if (currentNine > 8) { currentNine = 8; }
      // currentNine = 8;

      // Camera follows sensor
      cameraPositionDesired = [
        Math.pow(userX,3)*2.83+userX*4.08,
        -1.5-(userY*2),
        8
      ];

      // Change FOV
      cameraFovDesired = 72.2;

      // Position Landscapes
      landscapes[0].position.y = animateValue(-20, landscapes[0].position.y, landscapeSpeed);
      landscapes[1].position.y = animateValue(-20, landscapes[1].position.y, landscapeSpeed);

      // Rotate Nine
      nineRotationDesired = [0,0,0];

      cameraAimYDesired = 0;
    }

    // Submit scene
    if(currentPage==='submit'){

      // Set the nine
      currentNine = 8;

      // Camera moves slow
      cameraSpeed = 0.5;

      // Camera static position
      cameraPositionDesired = [
        7, //+userX/2,
        -1.5, //+userY/2,
        8
      ];

      // Position Landscapes
      landscapes[0].position.y = animateValue(-20, landscapes[0].position.y, landscapeSpeed);
      landscapes[1].position.y = animateValue(landscapeHeight, landscapes[1].position.y, landscapeSpeed);

      if(currentPage !== lastPage) {
        nineRotationDesired = [d2r(-35),d2r(50),d2r(0)]; // -125 50 0
        cameraFovDesired = 21;
        cameraAimYDesired = 0.5;
      }
    }

    // Details scene
    if(currentPage==='details'){

      // Set the nine
      currentNine = 0;

      // Camera moves slow
      cameraSpeed = 0.5;

      // Camera static position
      cameraPositionDesired = [
        -7, //+userX/2,
        -1.5, //+userY/2,
        8
      ];

      // Position Landscapes
      landscapes[0].position.y = animateValue(landscapeHeight, landscapes[0].position.y, landscapeSpeed);
      landscapes[1].position.y = animateValue(-20, landscapes[1].position.y, landscapeSpeed);

      if(currentPage !== lastPage) {
        nineRotationDesired = [d2r(-30),d2r(15),d2r(0)]; // -120, 15, 0
        cameraFovDesired = 21;
        cameraAimYDesired = 0.5;
      }
    }

    // Now execute/animate the changes

    // Change nine model
    if(currentNine !== previousNine) {
      setObjectVisiblity(nines[previousNine],false);
      setObjectVisiblity(nines[currentNine],true);
    }

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

    // Repoint the camera at the nine
    camera.lookAt(new THREE.Vector3( 0, cameraAimYDesired , 0));
    // console.log('('+camera.rotation.x+', '+camera.rotation.y+', '+camera.rotation.z+')');

    // Rotate every nine model
    for(i=0;i<9;i++) {
      nines[i].rotation.set(
        animateValue(nineRotationDesired[0]+d2r(-90),nines[i].rotation.x,nineRotationSpeed),
        animateValue(nineRotationDesired[1],nines[i].rotation.y,nineRotationSpeed),
        animateValue(nineRotationDesired[2],nines[i].rotation.z,nineRotationSpeed)
      );
    }
    if(enableKeyPositioning) {
      console.log('Nine Rot: ('+Math.floor(r2d(nines[0].rotation.x))+', '+Math.floor(r2d(nines[0].rotation.y))+', '+Math.floor(r2d(nines[0].rotation.z))+')');
      console.log('FOV: '+cameraFovDesired);
      console.log('Landscape h: '+landscapeHeight);
      console.log('Camera Aim Y: '+cameraAimYDesired);
    }

    // Render
    renderer.render( scene, camera );

    // Animate Letters
    animateLetters();

    // Remember the current page
    lastPage = currentPage;
  }


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
