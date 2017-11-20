var Main = (function($) {

  var screen_width = 0,
      breakpoint_small = false,
      breakpoint_medium = false,
      breakpoint_large = false,
      breakpoint_array = [480,1000,1200],
      $document,
      loadingTimer;

  // 3D Global Vars
  // Rendering
  var camera, scene, renderer;
  var nines=[], icosphere, skybox, sykboxLoaded = false;
  var animationStarted = false;
  var currentNine = 0;
  var noralizedPosition=0;

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

      }
    });

    // Smoothscroll links
    $('a.smoothscroll').click(function(e) {
      e.preventDefault();
      var href = $(this).attr('href');
      _scrollBody($(href));
    });

    // Scroll down to hash afer page load
    $(window).load(function() {
      if (window.location.hash) {
        _scrollBody($(window.location.hash)); 
      }
    });

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
    breakpoint_small = (screenWidth > breakpoint_array[0]);
    breakpoint_medium = (screenWidth > breakpoint_array[1]);
    breakpoint_large = (screenWidth > breakpoint_array[2]);

    resize3D();
  }

  function init3D() {

    // Check for webGL
    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

    // Configure the camera
    camera = new THREE.PerspectiveCamera( 65, window.innerWidth / window.innerHeight, 0.01, 100 );

    // Create a scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x090114 );

    // Create renderer obj
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );

    // Load the things
    loadSkybox();
    loadIcosphere();
    for(i=0;i<9;i++) {
      loadNine(i);
    }

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

  function checkIfEverythingLoaded() {
    // Check to see if each model is loaded
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
      sykboxLoaded
    ) {
      everythingLoaded();
    }
  }

  function everythingLoaded() {
    // Add the renderer to the DOM
    document.body.appendChild( renderer.domElement );

    objVisible(nines[0],true);

    // Throttled mousewatching (and will be accelerometer tracking)
    watchPosition();

    // Begin animation/rendering
    animate3D();

    // Animation Started
    $('body').addClass('loaded');
  }

  function watchPosition() {

    var lastMove = 0;
    var eventThrottle = 10;
    $(window).on('mousemove', function(e) {
      e.preventDefault();

      // Throttle (thanks Matt!)
      var now = Date.now();
      if (now > lastMove + eventThrottle) {
        lastMove = now;

        // Get vars
        var mouseX = e.pageX;
        var windowWidth = window.innerWidth;

        // Map mouse x position to continuum [0,1]
        noralizedPosition = (mouseX/windowWidth);
      }
    });
  }

  function animate3D() {
    animationStarted = true;

    // Do this every time the system is ready to animate
    requestAnimationFrame( animate3D );

    icosphere.rotation.z += 0.001;

    // Determine which nine to display based on which 10th of normalized
    var previousNine = currentNine;
    currentNine = Math.floor(noralizedPosition*9);

    // If we've changed nines, make it so
    if(currentNine !== previousNine) {
      objVisible(nines[previousNine],false);
      objVisible(nines[currentNine],true);
      console.log(currentNine);
    }

    // Move the camera to the right place
    camera.position.set ((noralizedPosition*2-1)*6, -2 , 7);

    // Repoint the camera
    camera.lookAt(new THREE.Vector3( 0, 0 , 0));

    // Render
    renderer.render( scene, camera );
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
