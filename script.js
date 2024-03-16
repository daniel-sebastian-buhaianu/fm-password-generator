'use strict';

window.addEventListener('load', function() {
    updateCharacterLength();
    displayPasswordStrength();
});

document.getElementById('setCharacterLength')
        .addEventListener('input', function() {
            updateCharacterLength();
            displayPasswordStrength();
        });

document.querySelectorAll('form input[type="checkbox"]')
        .forEach(input => input.addEventListener('input', displayPasswordStrength));

document.querySelector('form')
        .addEventListener('submit', function(event) {
            event.preventDefault();
        });

function displayPasswordStrength() {
    // reset colored bars
    document.querySelectorAll('.bar.colored').forEach(bar => {
        bar.className = bar.className.replace('colored', '');
    });

    // display password strength feedback text
    const passwordStrength = getPasswordStrength();
    document.querySelector('.feedback .rating .title')
            .innerHTML = passwordStrength.feedbackText;

    // color the first (passwordStrength.level + 1) bars
    const bars = document.querySelectorAll('.feedback .rating .bar');
    for (let i = 0; i <= passwordStrength.level; i++) {
        bars[i].className += ' colored';
        bars[i].style.setProperty('--colored-border-color', passwordStrength.feedbackColor);
        bars[i].style.setProperty('--colored-background-color', passwordStrength.feedbackColor);
    }
}

function getPasswordStrength() {
    const passwordLength = document.getElementById('setCharacterLength').value;

    let numberOfCheckedInputs = 0;
    document.querySelectorAll('form input[type="checkbox"]').forEach(input => {
        if (input.checked) {
            numberOfCheckedInputs++;
        }
    });

    let passwordStrengthLevel;
    switch(true) {
        case passwordLength < 8:
            passwordStrengthLevel = 0;
            break;
        case passwordLength < 15:
            passwordStrengthLevel = 1;
            break;
        default:
            passwordStrengthLevel = 2;
    }
    if (numberOfCheckedInputs == 3) {
        passwordStrengthLevel++;
    }

    const feedbackTexts = ['Too Weak!', 'Weak', 'Medium', 'Strong'];
    const feedbackColors = ['#F64A4A', '#FB7C58', '#F8CD65', '#A4FFAF'];

    return {
        level: passwordStrengthLevel,
        feedbackText: feedbackTexts[passwordStrengthLevel],
        feedbackColor: feedbackColors[passwordStrengthLevel]
    }
}

function updateCharacterLength() {
    const input = document.getElementById('setCharacterLength');
    const thumbPosition = Math.floor((input.value - input.min) / (input.max - input.min) * 100);

    input.style.setProperty('--thumb-position', thumbPosition);

    document.getElementById('characterLength').innerHTML = input.value;
}
