'use strict';

const inputs = document.querySelectorAll('input');
const signForm = document.querySelector('form');

signForm.addEventListener('submit', formValidation);

// 所有 input 字段執行各別的 event listener
for (let el of inputs) { 
    switch (el.id) {
        case 'password':
            el.addEventListener('input', passwordValidation);
            break;
        case 'confirm':
            el.addEventListener('focusout', confirmPassword);
            break;
        default:
            el.addEventListener('focusout', fieldValidation);
    }       
}

// submit 驗證, 未輸入值的字段將顯示錯誤, 排除 password 是因為它有自己的驗證規則, 有輸入值則執行驗證並收集通過驗證的字段
function formValidation (event) { 
    event.preventDefault();

    let countValid = 0

    for (let el of inputs) {
        const label = el.parentNode;
        const span = label.nextElementSibling;
        if (el.id !== 'password' && el.value.length === 0) {
            validationFailed.call(el, span, label);
        } else {
            switch (el.id) {
                case 'password':
                    countValid += passwordValidation.call(el, event);
                break;
                case 'confirm':
                    countValid += confirmPassword.call(el, event);
                break;
                default:
                    countValid += fieldValidation.call(el, event);
            }   
        }
    }       

    if (countValid === 5) {
        console.log('Success!')
    }
}

// 進行除了 password 和 confirm password 之外的其他所有字段驗證
function fieldValidation(event) {
    // Constraint validation
    const inputState = this.validity;
    const label = this.parentNode;
    const span = label.nextElementSibling;
    
    if (this.value.length === 0 && inputState.valueMissing) {
        label.className = '';
        span.textContent = '';
        return;
    }

    const patterns = {
        text: '^[A-Za-z]{1,15}$',
        email:'^.+@.+$',
        tel: '^\\d{10}$',
    }
    const regex = new RegExp(patterns[this.type], 'g');
    const valid = regex.test(this.value);
    let isValid = false;
    
    if (valid && inputState.valid)  {
        span.textContent = '';
        label.className = 'success';
        isValid = true
    } else {
        validationFailed.call(this, span, label);
    }

    if (event.type === "focusout") {
        this.removeEventListener('focusout', fieldValidation);
        this.addEventListener('input', fieldValidation)
    }

    if (isValid) {
        return 1
    }
}

// 驗證失敗後執行顯示錯誤訊息, 獨立寫出來是為了讓 submit 更方便執行
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
        default: 
            content = 'The password confirmation does not match.';
    }

    span.textContent = content
    label.className = 'failure'
}

// password 字段驗證
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

// confirm password 字段驗證
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