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

function passwordCheck() {
    const el = document.querySelector(`input#confirm`);
    const label = el.parentNode;
    const span = label.nextElementSibling;

        if (label.className === 'success' && this.value !== el.value) {
            span.textContent = 'The password confirmation does not match.';
            label.className = 'failure'

        } else if (this.value === el.value){
            span.textContent = '';
            label.className = 'success';
        }
}

function confirmPasswordCheck() {
    const el = document.querySelector(`input#password`);
    const label = this.parentNode;
    const span = label.nextElementSibling;

        if (this.value.length >= 8 && this.value !== el.value) {
            span.textContent = 'The password confirmation does not match.';
            label.className = 'failure'

        } else if (this.value === el.value){
            span.textContent = '';
            label.className = 'success';
        }
}
