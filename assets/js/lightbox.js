/*
 * Photo viewer for the Devotion Gallery archive.
 *
 * Without JavaScript every thumbnail is a plain link to the full image.
 * With it, clicking a linked image opens the full image in a <dialog>,
 * with previous/next buttons, arrow keys and Escape to close.
 * It only toggles attributes and swaps the image source; the look is in style.css.
 */

(function () {
  "use strict";

  // Links in the main content that point straight at an image file.
  var links = Array.prototype.slice.call(
    document.querySelectorAll('main a[href$=".jpg"], main a[href$=".jpeg"], main a[href$=".png"], main a[href$=".gif"]')
  );
  if (!links.length || typeof HTMLDialogElement !== "function") {
    return;
  }

  // Build the viewer once: image, caption, close / previous / next buttons.
  var dialog = document.createElement("dialog");
  dialog.className = "viewer";
  dialog.setAttribute("aria-label", "Photo viewer");
  dialog.innerHTML =
    '<figure class="viewer-figure"><img class="viewer-image" alt=""><figcaption class="viewer-caption"></figcaption></figure>' +
    '<button class="viewer-button viewer-close" type="button">Close</button>' +
    '<button class="viewer-button viewer-previous" type="button">Previous</button>' +
    '<button class="viewer-button viewer-next" type="button">Next</button>';
  document.body.appendChild(dialog);

  var image = dialog.querySelector(".viewer-image");
  var caption = dialog.querySelector(".viewer-caption");
  var current = 0;

  // Show link number `index`, wrapping round at either end.
  function show(index) {
    current = (index + links.length) % links.length;
    var link = links[current];
    var thumb = link.querySelector("img");
    var text = (thumb && thumb.alt) || link.title || "";
    image.src = link.href;
    image.alt = text;
    caption.textContent = text + "  (" + (current + 1) + " of " + links.length + ")";
  }

  links.forEach(function (link, index) {
    link.addEventListener("click", function (event) {
      // Let people open the image in a new tab with a modifier key.
      if (event.metaKey || event.ctrlKey || event.shiftKey) {
        return;
      }
      event.preventDefault();
      show(index);
      dialog.showModal();
    });
  });

  dialog.querySelector(".viewer-close").addEventListener("click", function () { dialog.close(); });
  dialog.querySelector(".viewer-previous").addEventListener("click", function () { show(current - 1); });
  dialog.querySelector(".viewer-next").addEventListener("click", function () { show(current + 1); });

  // Arrow keys step through; Escape is handled by <dialog> itself.
  dialog.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") { show(current - 1); }
    if (event.key === "ArrowRight") { show(current + 1); }
  });

  // Clicking the dark backdrop (outside the photo) closes the viewer.
  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) { dialog.close(); }
  });
})();
