var Main = (function($) {

  var screen_width = 0,
      breakpoint_small = false,
      breakpoint_medium = false,
      breakpoint_large = false,
      breakpoint_array = [480,600,1200],
      $document,
      loadingTimer;

  // 3D Global Vars
  // Rendering
  var camera, scene, renderer;
  var nines=[], landscapes=[], icosphere, skybox, sykboxLoaded = false;
  var animationStarted = false;
  var currentNine = 4;
  var sensorPositionNormalized = 0;
  var sensorPositionNormalized = sensorPositionNormalized;
  var currentPage = 'home';
  var lastPage = currentPage;

  // Animation Vars
  var cameraFovDesired = 65;
  var cameraXDesired = 0;
  var cameraYDesired = -1.5;
  var cameraZDesired = 8;
  var cameraSpeed = 1;

  function _init() {
    // touch-friendly fast clicks
    FastClick.attach(document.body);

    // Cache some common DOM queries
    $document = $(document);

    // Set screen size vars
    _resize();

    // Init functions
    init3D();

    // Esc handlers
    $(document).keyup(function(e) {
      if (e.keyCode === 27) {
        gotoPage('home');
      }
    });

    // Smoothscroll links
    $('a.smoothscroll').click(function(e) {
      e.preventDefault();
      var href = $(this).attr('href');
      _scrollBody($(href));
    });

    // Scroll down to hash afer page load
    // $(window).load(function() {
    //   if (window.location.hash) {
    //     _scrollBody($(window.location.hash)); 
    //   }
    // });

  } // end init()

  function _scrollBody(element, duration, delay) {
    if ($('#wpadminbar').length) {
      wpOffset = $('#wpadminbar').height();
    } else {
      wpOffset = 0;
    } 
    element.velocity("scroll", {
      duration: duration,
      delay: delay,
      offset: -wpOffset
    }, "easeOutSine");
  }

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
      objVisible(nines[whichNine],false);

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
        console.log('hi')
      });

      // Add to scene
      scene.add(landscapes[whichLandscape]);

      // Make invisible
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
    watchPosition();

    // Make first nine visible
    objVisible(nines[currentNine],true);

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

  function watchPosition() {

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
        var windowWidth = window.innerWidth;

        // Map mouse x position to continuum [-1,1]
        sensorPositionNormalized = (mouseX/windowWidth)*2-1;
      }
    });

    // Adjust position based on accelerometer (if present)
    if (window.DeviceOrientationEvent) {

      // UI for testing
      $('body').append('<div class="orientation"></div>');

      window.addEventListener("deviceorientation", function (event) {

        // Throttle (thanks Matt!)
        var now = Date.now();
        if (now > lastMove + eventThrottle) {
          lastMove = now;

          // Adjust position based on phone's "roll" (gamma)
          sensorPositionNormalized = Math.min(Math.max((event.gamma/90)*4,-0.99),0.99); // gamma: left to right

          // Update UI
          $('.orientation').empty().append(event.gamma);
        }
      }, false);
    }
  }

  function animateLetters() {
    $('.site-header .t').css({'left':(-sensorPositionNormalized*50+50)+'%'});
    $('.site-header .f').css({'left':(sensorPositionNormalized*50+50)+'%'});
  }

  function animate3D() {
    animationStarted = true;

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
      currentNine = Math.floor(((sensorPositionNormalized+1)/2)*9);

      // Camera follows sensor
      cameraXDesired = Math.pow(sensorPositionNormalized,3)*2.83+sensorPositionNormalized*4.08;
      cameraYDesired = -1.5;
      cameraZDesired = 8;

      // Change FOV
      cameraFovDesired = 65;

      // Position Landscapes
      landscapes[0].position.y = animateValue(-20, landscapes[0].position.y, 1);
      landscapes[1].position.y = animateValue(-20, landscapes[1].position.y, 1);
    }

    // Submit scene
    if(currentPage==='submit'){

      // Set the nine
      currentNine = 8;

      // Camera moves slow
      cameraSpeed = 0.5;

      // Camera static position
      cameraXDesired = 10;
      cameraYDesired = -1.5;
      cameraZDesired = 8;

      // Change FOV
      cameraFovDesired = 30;

      // Position Landscapes
      landscapes[0].position.y = animateValue(-20, landscapes[0].position.y, 1);
      landscapes[1].position.y = animateValue(0, landscapes[1].position.y, 1);
    }

    // Details scene
    if(currentPage==='details'){

      // Set the nine
      currentNine = 0;

      // Camera moves slow
      cameraSpeed = 0.5;

      // Camera static position
      cameraXDesired = -10;
      cameraYDesired = -1.5;
      cameraZDesired = 8;

      // Change FOV
      cameraFovDesired = 30;

      // Position Landscapes
      landscapes[0].position.y = animateValue(0, landscapes[0].position.y, 1);
      landscapes[1].position.y = animateValue(-20, landscapes[1].position.y, 1);
    }

    // Now execute/animate the changes

    // Change nine model
    if(currentNine !== previousNine) {
      objVisible(nines[previousNine],false);
      objVisible(nines[currentNine],true);
    }

    // Animate camera position to desired values
    camera.position.set(
      animateValue(cameraXDesired,camera.position.x,cameraSpeed), 
      animateValue(cameraYDesired,camera.position.y,cameraSpeed), 
      animateValue(cameraZDesired,camera.position.z,cameraSpeed)
    ); 

    // Animate fov to desired value
    if(cameraFovDesired !== camera.fov) {
      camera.fov = animateValue(cameraFovDesired,camera.fov,2);
      camera.updateProjectionMatrix();
    }

    // Repoint the camera at the nine
    camera.lookAt(new THREE.Vector3( 0, 0 , 0));

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
  function objVisible(object,visibleOrHidden) {
    object.traverse ( function (child) {
      if (child instanceof THREE.Mesh) {
        child.visible = visibleOrHidden;
      }
    });
  }

  // Handle resizing 
  function resize3D() {

    // If renderer has been set up...
    if(animationStarted) {

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
