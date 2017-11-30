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
  </head>
  <body data-current-page="home">
    <div class="load-mask"><img id="preloadergif" src="assets/images/preloader.gif" /></div>
    <header id="home" class="site-header page">
      <h1 class="title">
        <span class="t">T</span>
        <span class="f">F</span>
        <span class="sr-only">9</span>
      </h1>
      <nav class="site-nav">
        <ul class="menu-item-list">
          <li class="menu-item details"><a href="#details" class="goto-page" data-target-page="details">Details</a></li>
          <li class="menu-item submit"><a href="#submit" class="goto-page" data-target-page="submit">Submit</a></li>
        </ul>
      </nav>
    </header>
    <main>
      <section id="details" class="page page-wrap">
        <div class="content">
          <h2><span class="tf9">TF-9</span> Details</h2>
          <div class="indented">
            <h3>Where</h3>
            <p><a href="https://goo.gl/maps/2pKAAsGnSpD2" target="_blank">3219-21 S Morgan St<br>
            Chicago, IL 60607</a></p>
            <h3>When</h3>
            <p>02/18 - 03/20</p>
            <h3>Opening</h3>
            <p>02/18, 99:99</p>
          </div>
          <button class="goto-page back-button" data-target-page="home">Go Back &gt;</button>
        </div>
      </section>
      <section id="submit" class="page page-wrap">
        <div class="content">
          <div class="scrollbox">
            <h2><span class="tf9">TF-9</span> Submit</h2>
            <div class="col">
              <h3>Deadline</h3>
              <p>1/9/18</p>
            </div>
            <div class="col">
              <h3>Send to</h3>
              <a href="mailto:submit@typeforce.com" class="email" target="_blank"><span class="wrap-break">submit</span><span class="wrap-break">@typeforce.com</span></a>
              <p>Include a PDF file with description of work, approximate size, images of work or previous work if not yet completed. Ideally, we would like a series of pieces or enough work to take up a 10'×10' wall.</p>
            </div>
          </div>
          <button class="goto-page back-button" data-target-page="home">&lt; Go Back</button>
        </div>
      </section>
    </main>
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