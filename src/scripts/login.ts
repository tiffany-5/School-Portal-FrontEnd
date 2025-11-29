const API_URL = 'http://localhost:8080/api/auth/login';
const ANIMATION_DURATION = 400;

export function initLogin() {
    const form = document.getElementById('loginForm') as HTMLFormElement | null;
    const errorMsg = document.getElementById('errorMessage') as HTMLElement | null;
    const emailInput = document.getElementById('email') as HTMLInputElement | null;
    const passwordInput = document.getElementById('password') as HTMLInputElement | null;

    if (!form || !emailInput || !passwordInput) return;

    // EVENT LISTENERS
    setupInputClearing([emailInput, passwordInput]);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleLogin(emailInput, passwordInput);
    });

    // HELPER FUNCTIONS

    async function handleLogin(emailField: HTMLInputElement, passField: HTMLInputElement) {
        const email = emailField.value;
        const password = passField.value;

        try {
            const data = await postLoginData(email, password);

            if (data.success) {
                alert(`Login Successful! Welcome, ${data.payload.name}`);
                // window.location.href = '/dashboard';
            } else {
                displayError(data.message || 'Invalid credentials');
                triggerShake([emailField, passField]);
            }
        } catch (error) {
            console.error(error);
            displayError('Cannot connect to server');
            triggerShake([emailField, passField]);
        }
    }

    async function postLoginData(email: string, password: string) {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const payload = await response.json();
        return { success: response.ok, message: payload.message, payload };
    }

    function displayError(message: string) {
        if (errorMsg) {
            errorMsg.innerText = message;
            errorMsg.style.display = 'block';
        }
    }

    function triggerShake(inputs: HTMLInputElement[]) {
        inputs.forEach(input => {
            input.classList.add('input-error', 'shake-animation');
            setTimeout(() => input.classList.remove('shake-animation'), ANIMATION_DURATION);
        });
    }

    function setupInputClearing(inputs: HTMLInputElement[]) {
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                input.classList.remove('input-error');
                if (errorMsg) errorMsg.style.display = 'none';
            });
        });
    }
}

initLogin();