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
  var nines, skybox, reflectiveMaterial, axisHelper, boxes;
  var rotation = 0;

  function _init() {
    // touch-friendly fast clicks
    // FastClick.attach(document.body);

    // Cache some common DOM queries
    $document = $(document);
    $('body').addClass('loaded');

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
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 100 );
    controls = new THREE.OrbitControls( camera );

    camera.position.set (0, 0 , 14);
    camera.lookAt(new THREE.Vector3( 0, 0 , 0));
    controls.update();


    // Create a scene
    scene = new THREE.Scene();

    // Make Reflective Material
    skybox = new THREE.CubeTextureLoader()
      .setPath('assets/skybox/')
      .load( [ 'x-pos.png','x-neg.png','y-pos.png','y-neg.png','z-pos.png','z-neg.png' ]);
    reflectiveMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff, envMap: skybox } );
       
    // Load Nines
    nines = [];
    boxes = [];
    loadNine(0);
    loadNine(1);
    loadNine(2);
    loadNine(3);
    loadNine(4);

    // Add axis helper
    axisHelper = new THREE.AxisHelper( 1.25 );
    scene.add( axisHelper );

    // Create renderer obj and append to body
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    // Begin animation/rendering
    animate3D();
  }


  function loadNine(whichNine) {
    daeLocation = 'assets/models/nine-'+(whichNine+1)+'.dae';

    var manager = new THREE.LoadingManager();

    var loader = new THREE.ColladaLoader(manager);
    loader.options.convertUpAxis = true;
    loader.load(daeLocation, function(collada) {
      nines[whichNine] = collada.scene;

      nines[whichNine].position.set(-10+5*whichNine,0,0);

      var nChildren = nines[whichNine].children.length;
      for (i = 0; i<nChildren; i++) {
        nines[whichNine].children[i].material = reflectiveMaterial;
      }

      boxes[whichNine] = new THREE.BoxHelper( nines[whichNine], 0xffff00 );
      scene.add( boxes[whichNine] );

      scene.add(nines[whichNine]);
    });
  }

  function resize3D() {

    // If renderer has been set up...
    if(typeof renderer !== 'undefined') {

      // Update the camera to reflect new window size
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      controls.handleResize();

      // Update size of renderer element
      renderer.setSize( window.innerWidth, window.innerHeight);
    }
  }

  function animate3D() {

    // Do this every time the system is ready to animate
    requestAnimationFrame( animate3D );

    controls.update();

    rotation += 0.01;

    // Rotate the mesh
    for(i=0;i<5;i++) {
       if ( nines[i] !== undefined ) {
        nines[i].rotation.y = rotation;
      } 
    }


    // Render
    renderer.render( scene, camera );
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
