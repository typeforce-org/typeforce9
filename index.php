<!doctype html>
  <?php 
    $title = 'Typeforce 9';
    $description = 'Typeforce 9 is now open for submissions. Submissions due Jan 12.';
    $image = 'http://typeforce.com/9/assets/images/social-media-sharing.jpg';
    $imageW = 1300;
    $imageH = 650;
    $url = 'http://typeforce.com/9/';
    $author = 'Firebelly Design';
    $email = 'submit@typeforce.com';
    $ga_tracking = 'UA-998109-32';
    $twitter_handle = '@firebellydesign';
  ?>
<!--[if IE 8]> <html lang="en" class="no-js ie8 lt-ie9 lt-ie10"> <![endif]-->
<!--[if IE 9 ]> <html lang="en" class="no-js ie9 lt-ie10"> <![endif]-->
<!--[if gt IE 9]><!--> <html lang="en" class="no-js"> <!--<![endif]-->
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge">
    <title>Typeforce 9</title>
    <!-- BEGIN meta -->
    <meta itemprop="name" content="<?= $title ?>">
    <meta itemprop="image" content="<?= $image ?>">
    <meta itemprop="description" content="<?= $description ?>">
    <meta name="description" content="<?= $description ?>">
    <meta name="author" content="<?= $author ?>">
    <!-- facebook/og -->
    <meta property="og:title" content="<?= $title ?>">
    <meta property="og:type" content="website">
    <meta property="og:description" content="<?= $description ?>">
    <meta property="og:image" content="<?= $image ?>">
    <meta property="og:image:width" content="<?= $imageW ?>">
    <meta property="og:image:height" content="<?= $imageH ?>">
    <meta property="og:url" content="<?= $url ?>">
    <meta property="og:site_name" content="<?= $title ?>">
    <meta property="og:locale" content="en_us">
    <!-- twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?= $title ?>">
    <meta name="twitter:creator" content="<?= $twitter_handle ?>">
    <meta name="twitter:site" content="<?= $twitter_handle ?>">
    <meta name="twitter:description" content="<?= $description ?>">
    <meta name="twitter:image" content="<?= $image ?>">
    <meta name="twitter:url" content="<?= $url ?>">
    <!-- END meta -->
    <link rel="stylesheet" href="assets/css/main.min.css?v24_4_17">
    <link type="text/plain" rel="author" href="humans.txt">
    <link rel="shortcut icon" type="image/ico" href="assets/images/favicon.png">
  </head>
  <body data-current-page="home">
    <div class="load-mask">
      <img id="preloadergif" src="assets/images/preloader.gif" />
      <div id="loading-progress-bar"></div>
    </div>
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
          <div class="scrollbox col-wrap">
            <h2><span class="tf9">TF-9</span> Details</h2>
            <div class="indented">
              <h3>Where</h3>
              <p><a href="https://goo.gl/maps/2pKAAsGnSpD2" target="_blank">Co-Prosperity Sphere<br>
                3219 S Morgan St<br>
                Chicago, IL 60607</a></p>
              <h3>When</h3>
              <p>02/23 - 03/10</p>
              <h3>Opening Night</h3>
              <p>02/23</p>
            </div>
          </div>
          <button class="goto-page back-button" data-target-page="home">Go Back &gt;</button>
        </div>
      </section>
      <section id="submit" class="page page-wrap">
        <div class="content">
          <div class="scrollbox col-wrap">
            <h2><span class="tf9">TF-9</span> Submit</h2>
            <div class="col">
              <h3>Deadline</h3>
              <p>1/12/18</p>
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
    <script src="assets/js/build/site.js?v24_4_17"></script>
    <script type="text/javascript">// Google Analytics
      var _gaq = _gaq || [];
      _gaq.push(['_setAccount', '<?= $ga_tracking ?>']); 
      _gaq.push(['_trackPageview']);
      (function() {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
      })();
    </script>
  </body>
</html>