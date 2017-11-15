var Main = (function($) {

  var screen_width = 0,
      breakpoint_small = false,
      breakpoint_medium = false,
      breakpoint_large = false,
      breakpoint_array = [480,1000,1200],
      $document,
      loadingTimer;

  // 3D Global variables
  var camera, scene, renderer;
  var geometry, material, mesh;

  function _init() {
    // touch-friendly fast clicks
    FastClick.attach(document.body);

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
    // Configure the camera
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
    camera.position.z = 1;

    // Create a scene
    scene = new THREE.Scene();

    // Build a 3d box mesh out of [geometry, material] as example
    geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
    material = new THREE.MeshNormalMaterial();
    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    // Create renderer and append to body
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    // Begin animation/rendering
    animate3D();
  }

  function resize3D() {
    if(typeof renderer !== 'undefined') {
      // renderer.setSize( window.innerWidth, window.innerHeight ); // This doesn't maintain aspect ratio of 3d content...
    }
  }

  function animate3D() {

    // Do this every time the system is ready to animate
    requestAnimationFrame( animate3D );

    // Rotate the cube
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;

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
