/* Profile page script placeholder */
(function () {
  'use strict';

  const quickLinks = document.querySelectorAll('.profile-action:not(.logout)');
  quickLinks.forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      alert('This profile feature is not active yet.');
    });
  });
})();
