/* ==========================================================================
   PUREVESTING — VIDEO CARDS
   Save at:  /assets/videos.js
   Shows on: the home page (the newest three videos) and /videos/ (all of
   them).

   Turns the list in /videos/list.js into video cards. Nothing to edit
   here: to add a video, add a line to /videos/list.js.

   Where cards go: any element with data-videos — data-videos="3" shows
   the newest three (the home page), data-videos="all" shows every video
   (the /videos/ page). Whatever is inside that element (a "watch on
   YouTube" line) stays as it is if the list can't be read, or without
   JavaScript.

   Each card links to YouTube and shows the video's picture from YouTube's
   image server (i.ytimg.com) — the privacy page says so.
   ========================================================================== */

(function () {

  var boxes = document.querySelectorAll('[data-videos]');
  if (!boxes.length || typeof window.PV_VIDEOS !== 'string') return;

  // "link | title" lines -> [{ id, url, title, isShort }]. Lines that are
  // empty, start with #, or have no recognisable YouTube link are skipped.
  function readList(text) {
    var videos = [];
    text.split('\n').forEach(function (line) {
      line = line.trim();
      if (!line || line.charAt(0) === '#') return;
      var bar = line.indexOf('|');
      var link = (bar < 0 ? line : line.slice(0, bar)).trim();
      var title = bar < 0 ? '' : line.slice(bar + 1).trim();
      var m = link.match(/(?:youtu\.be\/|[?&]v=|\/shorts\/|\/live\/|\/embed\/)([A-Za-z0-9_-]{11})/);
      if (!m) return;
      var isShort = /\/shorts\//.test(link);
      videos.push({
        id: m[1],
        isShort: isShort,
        title: title || 'Watch on YouTube',
        // a clean address, without YouTube's "?si=" sharing tag
        url: isShort ? 'https://www.youtube.com/shorts/' + m[1]
                     : 'https://www.youtube.com/watch?v=' + m[1]
      });
    });
    return videos;
  }

  // One card: the video's picture (cropped to 16:9, so YouTube's black
  // bars don't show) with a play button on it, a "Short" tag for Shorts,
  // then the title.
  function card(v) {
    var a = document.createElement('a');
    a.className = 'card card-video';
    a.href = v.url;

    var thumb = document.createElement('span');
    thumb.className = 'thumb';
    var img = document.createElement('img');
    img.src = 'https://i.ytimg.com/vi/' + v.id + '/hqdefault.jpg';
    img.width = 480;
    img.height = 360;
    img.alt = '';
    img.loading = 'lazy';
    thumb.appendChild(img);
    thumb.insertAdjacentHTML('beforeend',
      '<span class="play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5z"/></svg></span>');

    if (v.isShort) {
      var tag = document.createElement('span');
      tag.className = 'video-tag';
      tag.textContent = 'Short';
      thumb.appendChild(tag);
    }
    a.appendChild(thumb);

    var h = document.createElement('h3');
    h.textContent = v.title;   // text only, so a title can never break the page
    a.appendChild(h);
    return a;
  }

  var videos = readList(window.PV_VIDEOS);
  if (!videos.length) return;

  boxes.forEach(function (box) {
    var want = box.getAttribute('data-videos');
    var list = want === 'all' ? videos : videos.slice(0, parseInt(want, 10) || 3);
    box.textContent = '';
    list.forEach(function (v, i) {
      var c = card(v);
      c.style.setProperty('--i', Math.min(i, 8));   // they rise in turn
      box.appendChild(c);
    });
    if (window.makeFiguresTappable) window.makeFiguresTappable(box);   // site.js, part 3
  });

})();
