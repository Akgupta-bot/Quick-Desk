// Sample user data (in real app, this would come from backend)
const currentUser = {
  id: "user123",
  name: "John Doe",
  email: "john.doe@company.com",
  phone: "(123) 456-7890",
  role: "end-user", // "end-user", "support-agent", or "admin"
  category: "Technical Support",
  language: "en",
  lastLogin: "Today, 10:30 AM"
};

// Sample upgrade requests (in real app, this would come from backend)
const upgradeRequests = [
  {
    id: "req1",
    userId: "user456",
    userName: "Alice Smith",
    userEmail: "alice@company.com",
    justification: "I need to manage user accounts and ticket categories",
    status: "pending",
    date: new Date().toLocaleDateString()
  }
];

document.addEventListener('DOMContentLoaded', function() {
  initializeProfile();
  setupEventListeners();
});

function initializeProfile() {
  // Set user data
  document.getElementById('user-name').textContent = currentUser.name;
  document.getElementById('user-email').textContent = currentUser.email;
  document.getElementById('user-phone').textContent = currentUser.phone;
  document.getElementById('category-interest').textContent = currentUser.category;
  document.getElementById('language-select').value = currentUser.language;
  document.getElementById('last-login').textContent = currentUser.lastLogin;

  // Set role display
  const roleElement = document.getElementById('user-role');
  const roleNames = {
    'end-user': 'End User',
    'support-agent': 'Support Agent',
    'admin': 'Admin'
  };
  roleElement.textContent = roleNames[currentUser.role] || 'End User';
  roleElement.className = 'profile-role';
  roleElement.classList.add(`role-${currentUser.role}`);

  // Show/hide upgrade option based on role
  const upgradeOption = document.getElementById('upgrade-account');
  upgradeOption.style.display = currentUser.role === 'end-user' ? 'flex' : 'none';

  // Show admin approval section if user is admin
  const adminSection = document.getElementById('admin-approval-section');
  adminSection.style.display = currentUser.role === 'admin' ? 'block' : 'none';
  if (currentUser.role === 'admin') renderAdminRequests();
}

function setupEventListeners() {
  // Password field toggle
  document.getElementById('password-field').addEventListener('click', function() {
    this.textContent = this.textContent === '••••••••' ? 'mysecret123' : '••••••••';
  });

  // Change password button
  document.getElementById('change-password-btn').addEventListener('click', function() {
    alert('Redirecting to password change page...');
  });

  // Save changes button
  document.getElementById('save-changes-btn').addEventListener('click', function() {
    const newLanguage = document.getElementById('language-select').value;
    console.log('Saving changes with language:', newLanguage);
    alert('Profile changes saved successfully!');
  });

  // Upgrade account button
  document.getElementById('upgrade-account').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('upgrade-modal').style.display = 'flex';
  });

  // Modal buttons
  document.getElementById('cancel-upgrade-btn').addEventListener('click', closeUpgradeModal);
  document.getElementById('submit-upgrade-btn').addEventListener('click', submitUpgradeRequest);
}

function closeUpgradeModal() {
  document.getElementById('upgrade-modal').style.display = 'none';
  document.getElementById('justification').value = '';
}

function submitUpgradeRequest() {
  const justification = document.getElementById('justification').value.trim();
  
  if (!justification) {
    alert('Please provide a justification for your request');
    return;
  }

  // In a real app, this would send to backend
  const newRequest = {
    id: 'req' + (upgradeRequests.length + 1),
    userId: currentUser.id,
    userName: currentUser.name,
    userEmail: currentUser.email,
    justification: justification,
    status: "pending",
    date: new Date().toLocaleDateString()
  };
  
  upgradeRequests.push(newRequest);
  console.log('New upgrade request:', newRequest);
  
  alert('Your admin access request has been submitted for review');
  closeUpgradeModal();
}

function renderAdminRequests() {
  const container = document.getElementById('admin-requests');
  container.innerHTML = '';

  const pendingRequests = upgradeRequests.filter(req => req.status === 'pending');
  
  if (pendingRequests.length === 0) {
    container.innerHTML = '<p>No pending requests</p>';
    return;
  }

  pendingRequests.forEach(request => {
    const requestElement = document.createElement('div');
    requestElement.className = 'request-item';
    requestElement.innerHTML = `
      <div class="request-info">
        <div class="request-user">${request.userName}</div>
        <div class="request-email">${request.userEmail}</div>
        <div class="request-justification">${request.justification}</div>
        <div class="request-date">Requested on: ${request.date}</div>
      </div>
      <div class="request-actions">
        <button class="btn btn-outline reject-btn" data-id="${request.id}">Reject</button>
        <button class="btn btn-primary approve-btn" data-id="${request.id}">Approve</button>
      </div>
    `;
    container.appendChild(requestElement);
  });

  // Add event listeners to new buttons
  document.querySelectorAll('.approve-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      handleRequest(this.dataset.id, 'approved');
    });
  });

  document.querySelectorAll('.reject-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      handleRequest(this.dataset.id, 'rejected');
    });
  });
}

function handleRequest(requestId, action) {
  const request = upgradeRequests.find(req => req.id === requestId);
  if (!request) return;

  request.status = action;
  console.log(`Request ${requestId} ${action}`);
  
  // In a real app, would notify the user via email/notification
  if (action === 'approved') {
    console.log(`Notifying ${request.userEmail} of approval`);
    // Would update user role in backend
  } else {
    console.log(`Notifying ${request.userEmail} of rejection`);
  }

  alert(`Request has been ${action}`);
  renderAdminRequests();
}