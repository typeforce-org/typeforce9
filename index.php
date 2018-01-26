<?php
  $title = 'Typeforce 9';
  $description = 'Announcing Typeforce 9 artists. Opening night Feb 23.';
  $image = 'http://typeforce.com/9/assets/images/social-media-sharing.jpg';
  $imageW = 1300;
  $imageH = 650;
  $url = 'http://typeforce.com/9/';
  $author = 'Firebelly Design';
  $email = 'submit@typeforce.com';
  $ga_tracking = 'UA-998109-32';
  $twitter_handle = '@firebellydesign';
?>

<!doctype html>
<!--[if IE 8]> <html lang="en" class="no-js ie8 lt-ie9 lt-ie10"> <![endif]-->
<!--[if IE 9 ]> <html lang="en" class="no-js ie9 lt-ie10"> <![endif]-->
<!--[if gt IE 9]><!--> <html lang="en" class="no-js"> <!--<![endif]-->
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge">
    <title><?= $title ?></title>
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
    <link rel="stylesheet" href="assets/css/main.min.css?1_9_18_v4">
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
          <li class="menu-item artists"><a href="#artists" class="goto-page" data-target-page="artists">Artists</a></li>
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
      <section id="artists" class="page page-wrap">
        <div class="content">
          <div class="scrollbox col-wrap">
            <h2><span class="tf9">TF-9</span> Artists</h2>
            <ul class="artist-list">
              <div class="col">
                <li class="artist-list-item">Abby Wynne</li>
                <li class="artist-list-item">Anna Mort</li>
                <li class="artist-list-item">Andrew Reaume</li>
                <li class="artist-list-item">Brian Lange</li>
                <li class="artist-list-item">Bud Rodecker</li>
                <li class="artist-list-item">Christina Zouras</li>
                <li class="artist-list-item">Don Zegler</li>
                <li class="artist-list-item">Dud Lawson</li>
                <li class="artist-list-item">Jacqueline Frole</li>
                <li class="artist-list-item">Jen Farrell</li>
                <li class="artist-list-item">Jeremiah Chiu</li>
                <li class="artist-list-item">Jesse Hora</li>
                <li class="artist-list-item">John Pobojewski</li>
                <li class="artist-list-item">Jordan Whitney Martin</li>
                <li class="artist-list-item">Kaleb Dean</li>
                <li class="artist-list-item">Kevin Winkler</li>
              </div>
              <div class="col">
                <li class="artist-list-item">Kristen Myers</li>
                <li class="artist-list-item">Kyle Green</li>
                <li class="artist-list-item">Lauren Gallagher</li>
                <li class="artist-list-item">Leah Wendzinski</li>
                <li class="artist-list-item">Linda Abdullah</li>
                <li class="artist-list-item">Megan Pryce</li>
                <li class="artist-list-item">Polina Osherov</li>
                <li class="artist-list-item">Rick Valicenti</li>
                <li class="artist-list-item">Robert Sołtys</li>
                <li class="artist-list-item">Rubani Shaw</li>
                <li class="artist-list-item">Satoru Nihei</li>
                <li class="artist-list-item">Selina Khounlo</li>
                <li class="artist-list-item">Taek Hyun Kim</li>
                <li class="artist-list-item">TotesFerosh</li>
                <li class="artist-list-item">Wendy Robles</li>
                <li class="artist-list-item">Zach Minnich</li>
              </div>
            </ul>
          </div>
          <button class="goto-page back-button" data-target-page="home">&lt; Go Back</button>
        </div>
      </section>
    </main>
    <script src="assets/js/build/site.js?1_9_18_v4"></script>
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