"use strict";

import "./css/index.css";

const createSignUpForm = () => {
    const form = document.querySelector("form");
    const inputs = Array.from(form.querySelectorAll("input"));

    const init = () => {
        form.addEventListener("submit", submitData);

        for (let field of inputs) {
            switch (field.name) {
                case "password":
                    field.addEventListener("input", validPassword);
                    break;
                case "confirm":
                    field.addEventListener("focusout", validConfirm);
                    break;
                default:
                    field.addEventListener("focusout", validField);
            }
        }
    };

    function validField(e) {
        const item = this.closest(".item");
        const message = item.querySelector(".message");

        message.textContent = "";
        item.classList.remove(item.classList[1]);

        const inputState = this.validity; // Constraint validation

        if (
            e.type !== "submit" &&
            (this.value.length === 0 || inputState.valueMissing)
        ) {
            return false;
        }

        if (e.type === "focusout" || e.type === "submit") {
            this.removeEventListener("focusout", validField);
            this.addEventListener("input", validField);
        }

        const patterns = {
            username: "^[A-Za-z0-9]{5,30}$",
            email: "^.+@.+$",
            phone: "^[0-9]{10}$",
            address: "^[A-Za-z0-9]{1,}$",
            zip: "^[0-9]{3,6}$",
        };

        let regex = new RegExp(patterns[this.name], "g");

        const valid = regex.test(this.value);

        if (!valid || !inputState.valid) {
            message.textContent = getErrorMessage(this.name);
            item.classList.add("error");
            return false;
        }

        item.classList.add("success");
        return true;
    }

    function validPassword(e) {
        const item = this.closest(".item");
        const rules = form.querySelectorAll(".item.passwordRules ul li");

        item.classList.remove(item.classList[1]);

        for (let i of rules) {
            i.classList = "";
        }

        const inputState = this.validity;

        if (
            e.type !== "submit" &&
            (this.value.length === 0 || inputState.valueMissing)
        ) {
            return false;
        }

        const patterns = {
            length: "(?=^[^\\s]{8,}$).*$",
            numericUnderscore: "((?=.*\\d)|(?=.*_)).*$",
            lowerCase: "(?=.*[a-z]).*$",
            upperCase: "(?=.*[A-Z]).*$",
        };

        let isValid = true;

        for (let i in patterns) {
            const regex = new RegExp(patterns[i], "g");
            const valid = regex.test(this.value);

            const rule = form.querySelector(
                `.item.passwordRules ul li[data-rule='${i}']`
            );

            if (valid) {
                rule.className = "success";
            } else {
                rule.className = "error";
                item.classList.add("error");
                isValid = false;
            }
        }

        if (!isValid) return false;

        const pattern =
            "(?=^[^\\s]{8,}$)((?=.*\\d)|(?=.*_))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$";

        const regex = new RegExp(pattern, "g");

        const valid = regex.test(this.value);

        if (!valid || !inputState.valid) {
            item.classList.add("error");
            return false;
        }

        item.classList.add("success");
        validConfirm.call(form.elements.confirm, e);
        return true;
    }

    function validConfirm(e) {
        const item = this.closest(".item");
        const message = item.querySelector(".message");
        const password = form.elements.password.value;
        const inputState = this.validity;

        message.textContent = "";
        item.classList.remove(item.classList[1]);

        if (
            e.type !== "submit" &&
            (this.value.length === 0 || inputState.valueMissing)
        ) {
            return false;
        }

        if (e.type === "focusout" || e.type === "submit") {
            this.removeEventListener("focusout", validConfirm);
            this.addEventListener("input", validConfirm);
        }

        const pattern =
            "(?=^[^\\s]{8,}$)((?=.*\\d)|(?=.*_))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$";

        const regex = new RegExp(pattern, "g");

        const valid = regex.test(this.value);

        if (this.value !== password || !valid || !inputState.valid) {
            message.textContent = getErrorMessage(this.name);
            item.classList.add("error");
            return false;
        }

        item.classList.add("success");

        return true;
    }

    function submitData(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const formProps = Object.fromEntries(formData);

        let count = 0;

        for (let key in formProps) {
            const field = this.elements[key];

            let isValid = null;

            switch (field.name) {
                case "password":
                    isValid = validPassword.call(field, e);
                    break;
                case "confirm":
                    isValid = validConfirm.call(field, e);
                    break;
                default:
                    isValid = validField.call(field, e);
                    break;
            }

            if (isValid) {
                count += 1;
            }
        }

        if (count === inputs.length) {
            document.activeElement.blur();
            alert("You are an incredible human.");
        }
    }

    function getErrorMessage(field) {
        let errorMessage = null;

        switch (field) {
            case "username":
                errorMessage = "The username must be 5 to 30 alphabet.";
                break;
            case "email":
                errorMessage = "The email must contain prefix and domain.";
                break;
            case "phone":
                errorMessage = "The Phone must be 10 digits";
                break;
            case "address":
                errorMessage = "The address must be alphanumeric.";
                break;
            case "zip":
                errorMessage = "The zip must be 3 to 6 digits.";
                break;
            case "confirm":
                errorMessage =
                    "The confirm password must be the same as password.";
                break;
        }

        return errorMessage;
    }

    return {
        init,
    };
};

export { createSignUpForm };
