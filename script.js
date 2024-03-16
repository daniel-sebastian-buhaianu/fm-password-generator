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

            const password = generatePassword();

            displayPassword(password);
        });


function displayPassword(password) {
    const passwordContainer = document.querySelector('form .result');

    passwordContainer.querySelector('.text').innerText = password;

    addClass('active', passwordContainer);

    if (window.outerWidth < 768 && password.length > 19
        || window.outerWidth >= 768 && password.length > 23) {
        addClass('smaller', passwordContainer.querySelector('.text'));
    } else {
        removeClass('smaller', passwordContainer.querySelector('.text'));
    }
}


function removeClass(_class, element) {
    if (hasClass(_class, element)) {
        element.className = element.className.replace(_class, '');
    }
}

function addClass(_class, element) {
    if (!hasClass(_class, element)) {
        element.className = element.className + ' ' + _class;
    }
}

function hasClass(_class, element) {
    return element.className.includes(_class);
}

function generatePassword() {
    let asciiCodes = getASCIICodesFor('lowercaseLetters');

    const requirements = {
        includeUppercaseLetters: false,
        includeNumbers: false,
        includeSpecialCharacters: false
    };

    document.querySelectorAll('form input[type="checkbox"]')
            .forEach(input => {
                if (input.checked) {
                    switch(true) {
                        case input.id.includes('Uppercase'):
                            requirements['includeUppercaseLetters'] = true;
                            asciiCodes = asciiCodes.concat(getASCIICodesFor('uppercaseLetters'));
                            break;

                        case input.id.includes('Numbers'):
                            requirements['includeNumbers'] = true;
                            asciiCodes = asciiCodes.concat(getASCIICodesFor('numbers'));
                            break;

                        case input.id.includes('SpecialCharacters'):
                            requirements['includeSpecialCharacters'] = true;
                            asciiCodes = asciiCodes.concat(getASCIICodesFor('specialCharacters'));
                            break;
                    }
                }
            });

    const chars = asciiCodes.map(charCode => String.fromCharCode(charCode));
    const passwordLength = parseInt(document.getElementById('setCharacterLength').value);
    let password;

    do {
        password = '';

        for (let i = 0; i < passwordLength; i++) {
            const randomIndex = getRandomNumberFromRange(0, chars.length - 1);
            password += chars[randomIndex];
        }
    } while (!passwordIsValid(password, requirements));

    return password;
}

function passwordIsValid(password, requirements) {
    if (requirements.includeUppercaseLetters && !stringContainsUppercaseLetters(password)) {
        return false;
    }
    if (requirements.includeNumbers && !stringContainsNumbers(password)) {
        return false;
    }
    if (requirements.includeSpecialCharacters && !stringContainsSpecialCharacters(password)) {
        return false;
    }
    return true;
}

function stringContainsSpecialCharacters(str) {
    for (let i = 0; i < str.length; i++) {
        if (!stringContainsLowercaseLetters(str[i])
            && !stringContainsUppercaseLetters(str[i])
            && !stringContainsNumbers(str[i])) {
            return true;
        }
    }
    return false;
}

function stringContainsNumbers(str) {
    return /\d/.test(str);
}

function stringContainsUppercaseLetters(str) {
    return /[A-Z]/.test(str);
}

function stringContainsLowercaseLetters(str) {
    return /[a-z]/.test(str);
}

function getRandomNumberFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getASCIICodesFor(charType) {
    switch(charType) {
        case 'lowercaseLetters':
            return createArrayFromRange(97, 122);
        case 'uppercaseLetters':
            return createArrayFromRange(65, 90);
        case 'numbers':
            return createArrayFromRange(48, 57);
        case 'specialCharacters':
            return createArrayFromRange(32, 47).concat(
                createArrayFromRange(58, 64),
                createArrayFromRange(91, 96),
                createArrayFromRange(123, 126));
        default:
            return [];
    }
}

function createArrayFromRange(min, max) {
    const array = [];

    for (let i = min; i <= max; i++) {
        array.push(i);
    }

    return array;
}

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
