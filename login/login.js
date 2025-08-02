document.addEventListener('DOMContentLoaded', function () {
  // Initialize the active tab
  switchAuthTab('login');

  // Password toggle functionality
  setupPasswordToggle('login-password', 'toggle-login-password');
  setupPasswordToggle('register-password', 'toggle-register-password');

  // Password strength indicator
  const registerPassword = document.getElementById('register-password');
  if (registerPassword) {
    registerPassword.addEventListener('input', function () {
      updatePasswordStrength(this.value);
    });
  }

  // Form submissions
  document.getElementById('login-form')?.addEventListener('submit', handleLogin);
  document.getElementById('register-form')?.addEventListener('submit', handleRegister);
});

function switchAuthTab(tab) {
  // Update tabs
  document.getElementById('login-tab').classList.toggle('active', tab === 'login');
  document.getElementById('register-tab').classList.toggle('active', tab === 'register');

  // Update forms
  document.getElementById('login-form').classList.toggle('active', tab === 'login');
  document.getElementById('register-form').classList.toggle('active', tab === 'register');

  // Update switch prompt
  const prompt = document.getElementById('switch-prompt');
  const link = document.getElementById('switch-link');
  if (tab === 'login') {
    prompt.textContent = "Don't have an account?";
    link.textContent = "Create account";
    link.onclick = () => switchAuthTab('register');
  } else {
    prompt.textContent = "Already have an account?";
    link.textContent = "Sign in";
    link.onclick = () => switchAuthTab('login');
  }
}

function setupPasswordToggle(inputId, toggleId) {
  const toggle = document.getElementById(toggleId);
  if (toggle) {
    toggle.addEventListener('click', function () {
      const input = document.getElementById(inputId);
      if (input.type === 'password') {
        input.type = 'text';
        this.classList.remove('fa-eye');
        this.classList.add('fa-eye-slash');
      } else {
        input.type = 'password';
        this.classList.remove('fa-eye-slash');
        this.classList.add('fa-eye');
      }
    });
  }
}

function updatePasswordStrength(password) {
  const strengthBar = document.querySelector('.strength-bar');
  const strengthStatus = document.getElementById('strength-status');
  const strength = calculatePasswordStrength(password);

  strengthBar.style.width = strength.percentage + '%';
  strengthBar.style.backgroundColor = strength.color;
  strengthStatus.textContent = strength.text;
  strengthStatus.style.color = strength.color;
}

function calculatePasswordStrength(password) {
  let strength = 0;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isLongEnough = password.length >= 8;

  if (isLongEnough) strength += 1;
  if (hasUpperCase) strength += 1;
  if (hasLowerCase) strength += 1;
  if (hasNumbers) strength += 1;
  if (hasSpecialChars) strength += 1;

  if (strength <= 1) {
    return { percentage: 25, color: '#ef233c', text: 'Weak' };
  } else if (strength <= 3) {
    return { percentage: 50, color: '#f8961e', text: 'Medium' };
  } else if (strength <= 4) {
    return { percentage: 75, color: '#4cc9f0', text: 'Strong' };
  } else {
    return { percentage: 100, color: '#4ade80', text: 'Very Strong' };
  }
}

async function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const response = await fetch('http://127.0.0.1:5000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Required to send/receive cookies
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    alert('Login successful! Redirecting...');
    window.location.href = '../tokens/token.html';
  } catch (error) {
    alert(`Login Error: ${error.message}`);
  }
}

async function handleRegister(e) {
  e.preventDefault();

  // Validate passwords match
  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  // In a real app, you would send the data to your backend
  try {
    const response = await fetch('http://127.0.0.1:5000/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Required to send/receive cookies
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    console.log(data)

    alert('Account created successfully! Redirecting to login...');
    switchAuthTab('login');
  } catch (error) {
    alert(`Registration Error: ${error.message}`);
  }
}

function openPasswordDialog() {
  document.getElementById('password-dialog').style.display = 'flex';
}

function closePasswordDialog() {
  document.getElementById('password-dialog').style.display = 'none';
}

// Make functions available globally
window.switchAuthTab = switchAuthTab;
window.openPasswordDialog = openPasswordDialog;
window.closePasswordDialog = closePasswordDialog;