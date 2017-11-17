var Main = (function($) {

  var screen_width = 0,
      breakpoint_small = false,
      breakpoint_medium = false,
      breakpoint_large = false,
      breakpoint_array = [480,1000,1200],
      $document,
      loadingTimer;

  // 3D Global variables
  var camera, controls, scene, renderer;
  var nines=[], icosphere, skybox, skyboxReversed, nineMaterial, icosphereMaterial, axesHelper, boxes=[];
  var nineRotation = 0;
  var animationStarted = false;
  var currentNine = 0;

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
    controls = new THREE.OrbitControls( camera );

    camera.position.set (0, -2 , 7);
    camera.lookAt(new THREE.Vector3( 0, 0 , 0));
    controls.update();

    // Create a scene
    scene = new THREE.Scene();
    // scene.fog = new THREE.FogExp2( 0xFFFFFF, 0.04 );
    scene.background = new THREE.Color( 0x090114 );

    // Make Skyboxes for Reflective Materials
    skybox = new THREE.CubeTextureLoader()
      .setPath('assets/skybox/')
      .load( [ 'x-pos.png','x-neg.png','y-pos.png','y-neg.png','z-pos.png','z-neg.png' ]);
 
    // Make materials
    nineMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff, envMap: skybox } );
    icosphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x0c0061,
        wireframe: true
    });

    // Add axis helper
    // axesHelper = new THREE.AxesHelper( 1 );
    // scene.add( axesHelper );

    // Create renderer obj and append to body
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    // renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    // Load All Nine Models
    loadNine(0);
    loadNine(1);
    loadNine(2);
    loadNine(3);
    loadNine(4);
    loadIcosphere();
  }


  function loadNine(whichNine) {
    // Path of collada (dae) model file
    daeLocation = 'assets/models/nine-'+whichNine+'.dae';

    // Load Collada
    var manager = new THREE.LoadingManager();
    var loader = new THREE.ColladaLoader(manager);
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
      checkIfModelsLoaded();
    });
  }

  function loadIcosphere() {
    // Path of collada (dae) model file
    daeLocation = 'assets/models/icosphere.dae';

    // Load Collada
    var manager = new THREE.LoadingManager();
    var loader = new THREE.ColladaLoader(manager);
    loader.load(daeLocation, function(collada) {
      // Once that model is loaded...

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
      checkIfModelsLoaded();
    });
  }

  function checkIfModelsLoaded() {
    // Check to see if each model is loaded
    if (
      nines[0] &&
      nines[1] &&
      nines[2] &&
      nines[3] &&
      nines[4] &&
      icosphere
    ) {
      modelsLoaded();
    }
  }

  function modelsLoaded() {
    // Add the renderer to the DOM
    document.body.appendChild( renderer.domElement );

    objVisible(nines[0],true);

    // Begin animation/rendering
    animate3D();

    // Animation Started
    $('body').addClass('loaded');
  }


  function animate3D() {
    animationStarted = true;

    // Do this every time the system is ready to animate
    requestAnimationFrame( animate3D );

    // Update the controls
    controls.update();

    // Rotate icosphere
    icosphere.rotation.z -= 0.0001

    // Progress global nineRotation for use in nines
    nineRotation += 0.005

    // // Rotate the mesh
    // for(i=0;i<5;i++) {
    //    if ( nines[i] !== undefined ) {
    //     nines[i].rotation.z = nineRotation;
    //   } 
    // }

    // // Determine which nine to display based on which 5th of nineRotation
    // var previousNine = currentNine;
    // currentNine = Math.floor((( nineRotation / (2*Math.PI) ) % 1)*5);
    // if(currentNine !== previousNine) {
    //   objVisible(nines[previousNine],false);
    //   objVisible(nines[currentNine],true);
    // }

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
