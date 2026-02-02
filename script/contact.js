document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contact-form");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");
    const responseMessage = document.getElementById("form-response");

    function showError(input, message) {
        const errorMessage = input.nextElementSibling;
        errorMessage.textContent = message;
        errorMessage.style.display = "block";
        input.style.borderColor = "red";
    }

    function clearError(input) {
        const errorMessage = input.nextElementSibling;
        errorMessage.textContent = "";
        errorMessage.style.display = "none";
        input.style.borderColor = "#ccc";
    }

    function isValidEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        let isValid = true;

        if (nameInput.value.trim() === "") {
            showError(nameInput, "Name is required.");
            isValid = false;
        } else {
            clearError(nameInput);
        }

        if (emailInput.value.trim() === "") {
            showError(emailInput, "Email is required.");
            isValid = false;
        } else if (!isValidEmail(emailInput.value.trim())) {
            showError(emailInput, "Enter a valid email address.");
            isValid = false;
        } else {
            clearError(emailInput);
        }

        if (messageInput.value.trim() === "") {
            showError(messageInput, "Message cannot be empty.");
            isValid = false;
        } else {
            clearError(messageInput);
        }

        if (isValid) {
            responseMessage.classList.remove("hidden");
            form.reset();
            setTimeout(() => {
                responseMessage.classList.add("hidden");
            }, 3000);
        }
    });
});