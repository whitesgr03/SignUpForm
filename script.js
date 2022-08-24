'use strict';

const inputs = document.querySelectorAll('input');
const signForm = document.querySelector('form');

signForm.addEventListener('submit', formValidation);

for(let el of inputs) {
    el.addEventListener('focusout', validation);
}

function formValidation (event) {
    event.preventDefault();

    let isValid = true

    for (let el of inputs) {
        const label = el.parentNode;
        const span = label.nextElementSibling;
        if (el.value.length === 0) {
            validationFailed.call(el, span, label);
            isValid = false;
        } else {
            validation.call(el, event);
            if (label.className !== 'success') {
                isValid = false
                return
            }
        }
    }

    if (isValid) {
        console.log('Success!')
    }
}

function validation(event) {
    // 約束驗證
    const inputState = this.validity;
    const label = this.parentNode;
    const span = label.nextElementSibling;
    
    if (this.value.length === 0 && inputState.valueMissing) {
        label.className = '';
        span.textContent = '';
        return;
    }

    const patterns = {
        'text': '^[A-Za-z]{1,15}$',
        'email':'^.+@.+$',
        'tel': '^[0-9]{10}$',
        'password': "(?=^.{8,}$)((?=.*\\d)|(?=.*_+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$",
    }
    const regex = new RegExp(patterns[this.type], 'g');
    const valid = regex.test(this.value);
    
    if (valid && inputState.valid)  {
        span.textContent = '';
        label.className = 'success';
    } else {
        validationFailed.call(this, span, label);
    }

    if (event.type === "focusout") {
        this.removeEventListener('focusout', validation);
        this.addEventListener('input', validation)

        if (this.id === 'password') {
            passwordCheck.call(this);
            this.addEventListener('input', passwordCheck);
        }
        if (this.id === 'confirm') {
            confirmPasswordCheck.call(this);
            this.addEventListener('input', confirmPasswordCheck);
        }
    }
}

function validationFailed(span, label) {
    let content = null;
    
    switch(this.type) {
        case 'text':
            content = 'The name must be alphabet.'
        break
        case 'email':
            content = 'The email must be a valid email.'
        break
        case 'tel':
            content = 'The phone number must be 10 numeric.'
        break
        case 'password':
            content = 'The password must be at least 8 characters.'
        break
        default:
            content = 'The field validation failed';
    }

    span.textContent = content
    label.className = 'failure'
}

function passwordValidation() {
    const patterns = {
        length: '.{8,}',
        lowerCase: '[a-z]',
        upperCase: '[A-Z]',
        numericUnderscore: '[0-9_]',
    }

    let countValid = 0
    let isValid = false;
    
    for (let re in patterns) {
        const regex = new RegExp(patterns[re]);
        const valid = regex.test(this.value);
        const el = document.querySelector(`li[data-rule="${re}"]`);
        if (valid) {
            el.className = 'success';
            countValid += 1;
        } else {
            el.className = '';
            countValid -= 1;
        }
    }

    const label = this.parentNode;

    if (countValid === 4) {
        const pattern = "(?=^.{8,}$)(?:(?=.*\\d)|(?=.*_))(?![\\.\\n\\s])(?=.*[A-Z])(?=.*[a-z]).*$";
        const regex = new RegExp(pattern, 'g');
        const valid = regex.test(this.value);

        if (valid) {
            label.className = 'success';
            isValid = true
        }
    } else {
        label.className = '';
}

    const el = document.querySelector(`input#confirm`);
    confirmPassword.call(el);

    if (isValid) {
        return 1
    }
}

function confirmPassword(event) {
    const label = this.parentNode;
    const span = label.nextElementSibling;
    let isValid = false;

    if (this.value.length === 0) {
        label.className = '';
        span.textContent = '';
        return;
    }

    if (this.value.length < 8) {
        validationFailed.call(this, span, label);
        return;
    }

    const el = document.querySelector(`input#password`);

    if (this.value === el.value) {
            span.textContent = '';
            label.className = 'success';
        isValid = true;
    } else {
        validationFailed.call(this, span, label);
        }

    if (event?.type === "focusout") {
        this.removeEventListener('focusout', confirmPassword);
        this.addEventListener('input', confirmPassword)
}

    if (isValid) {
        return 1
    }

}