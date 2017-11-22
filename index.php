<!doctype html>
<!--[if IE 8]> <html lang="en" class="no-js ie8 lt-ie9 lt-ie10"> <![endif]-->
<!--[if IE 9 ]> <html lang="en" class="no-js ie9 lt-ie10"> <![endif]-->
<!--[if gt IE 9]><!--> <html lang="en" class="no-js"> <!--<![endif]-->
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge">
    <title>Typeforce 9</title>
    <link rel="canonical" href="">
    <meta name="description" content="">
    <meta property="og:title" content="" />
    <meta property="og:image" content="" />
    <meta property="og:url" content="" />
    <meta property="og:description" content="" />
    <link rel="stylesheet" href="assets/css/main.min.css?force-reload<?= time(); ?>">
    <link type="text/plain" rel="author" href="humans.txt">
    <link rel="shortcut icon" type="image/ico" href="assets/images/favicon.png">
    <link rel="apple-touch-icon-precomposed" sizes="152x152" href="assets/images/apple-touch-icon-152x152-precomposed.png"><!-- For iStuff -->
    <meta name="msapplication-TileColor" content="#FFFFFF"><!-- For MS stuff -->
    <meta name="msapplication-TileImage" content="assets/images/ms-icon.png"><!-- For MS stuff -->
    <!--[if lt IE 9]>
      <script src="assets/js/no-build/respond.min.js"></script>
      <script src="assets/js/no-build/svg4everybody.min.js"></script>
    <![endif]-->
    <script src="assets/js/no-build/modernizr.custom.js"></script>
  </head>
  <body data-current-scene="home">
    <div class="load-mask"><img id="preloadergif" src="/assets/images/preloader.gif" /></div>
    <header id="home" class="site-header scene">
      <h1 class="title">
        <span class="top"><span class="t">T</span></span>
        <span class="bottom"><span class="f">F</span></span>
        <span class="sr-only">9</span>
      </h1>
      <nav class="site-nav">
        <ul class="menu-item-list">
          <li class="menu-item details"><a href="#details" class="goto-scene" data-target-scene="details">Details</a></li>
          <li class="menu-item submit"><a href="#submit" class="goto-scene" data-target-scene="submit">Submit</a></li>
        </ul>
      </nav>
    </header>
    <script type="text/javascript">
      // var preloaderImage = new Image();
      // preloaderImage.src = '/assets/images/preloader.gif';
      // preloaderImage.onload = function() {
      //   document.getElementById('preloadergif').src = preloaderImage.src;
      // }​
    </script>
    <script src="assets/js/build/site.js?force-reload<?= time(); ?>"></script>
    <script type="text/javascript">// Google Analytics
      var _gaq = _gaq || [];
      _gaq.push(['_setAccount', 'UA-XXXXX-X']); // Replace "XXXXX-X" with your account code
      _gaq.push(['_trackPageview']);
      (function() {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
      })();
    </script>
  </body>
</html>