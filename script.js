'use strict';

const input = document.querySelector('input[type="range"]');
input.style.setProperty('--thumb-position', input.value);

input.addEventListener('input', function() {
    this.style.setProperty('--thumb-position', input.value);
});
