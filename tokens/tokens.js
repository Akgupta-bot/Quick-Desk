document.addEventListener('DOMContentLoaded', function() {
  // Sample tokens data
  const tokens = [
    {
      id: 1,
      title: "Login issues after recent update",
      excerpt: "I'm unable to login to my account after the latest app update. Getting error 500.",
      status: "open",
      category: "technical",
      author: "John Doe",
      time: "2 hours ago",
      content: "After updating the app to version 2.4.1, I'm unable to login to my account. Every time I try to login, I get an error 500. I've tried resetting my password but the issue persists. This is preventing me from accessing my work.",
      replies: []
    },
    {
      id: 2,
      title: "Billing discrepancy for May subscription",
      excerpt: "I was charged twice for my monthly subscription in May.",
      status: "in-progress",
      category: "billing",
      author: "Sarah Smith",
      time: "1 day ago",
      content: "I noticed that my credit card was charged twice for the monthly subscription fee in May. The first charge was on May 1st for $9.99 and the second charge was on May 3rd for the same amount. I only signed up for one subscription.",
      replies: [
        {
          author: "Support Agent",
          time: "12 hours ago",
          content: "We've identified the issue and are working on a refund for the duplicate charge."
        }
      ]
    },
    {
      id: 3,
      title: "Feature request: Dark mode",
      excerpt: "Would love to see a dark mode option in the settings.",
      status: "resolved",
      category: "general",
      author: "Mike Johnson",
      time: "3 days ago",
      content: "The current white interface is too bright for nighttime use. Please consider adding a dark mode option in the settings panel. Many other apps have this feature and it would be great for eye strain.",
      replies: [
        {
          author: "Support Agent",
          time: "2 days ago",
          content: "Thank you for your suggestion! We've added this to our roadmap for the next update."
        },
        {
          author: "Support Agent",
          time: "1 day ago",
          content: "Update: Dark mode has been implemented and will be available in version 2.5.0 releasing next week."
        }
      ]
    }
  ];

  // DOM Elements
  const tokensList = document.getElementById('tokensList');
  const createTokenBtn = document.getElementById('createTokenBtn');
  const createTokenDialog = document.getElementById('createTokenDialog');
  const closeTokenDialog = document.getElementById('closeTokenDialog');
  const tokenForm = document.getElementById('tokenForm');
  const tokenDetailDialog = document.getElementById('tokenDetailDialog');
  const closeTokenDetail = document.getElementById('closeTokenDetail');
  const tokenDetailTitle = document.getElementById('tokenDetailTitle');
  const tokenDetailContent = document.getElementById('tokenDetailContent');
  const tokenAuthor = document.getElementById('tokenAuthor');
  const tokenTime = document.getElementById('tokenTime');
  const tokenCategory = document.getElementById('tokenCategory');
  const tokenStatusIndicator = document.getElementById('tokenStatusIndicator');
  const tokenStatusText = document.getElementById('tokenStatusText');
  const tokenShareLink = document.getElementById('tokenShareLink');
  const copyLinkBtn = document.getElementById('copyLinkBtn');
  const adminSection = document.getElementById('adminSection');
  const agentReply = document.getElementById('agentReply');
  const submitReplyBtn = document.getElementById('submitReplyBtn');
  const resolveTokenBtn = document.getElementById('resolveTokenBtn');
  const searchBox = document.querySelector('.search-box input');
  const categoryDropdown = document.querySelectorAll('.dropdown')[0];
  const statusDropdown = document.querySelectorAll('.dropdown')[1];
  const viewOptions = document.querySelectorAll('.view-options span');

  // Current filter state
  let currentFilters = {
    search: '',
    category: 'All Categories',
    status: 'All Statuses',
    view: 'Recent'
  };

  // Current user role (change to 'admin' to see admin features)
  const currentUserRole = 'user'; // or 'admin'

  // Initialize the app
  function init() {
    renderTokens();
    setupEventListeners();
    
    // Show admin section if user is admin
    if (currentUserRole === 'admin') {
      adminSection.style.display = 'block';
    }
  }

  // Render tokens based on current filters
  function renderTokens() {
    tokensList.innerHTML = '';
    
    let filteredTokens = [...tokens];
    
    // Apply filters
    if (currentFilters.search) {
      filteredTokens = filteredTokens.filter(t => 
        t.title.toLowerCase().includes(currentFilters.search.toLowerCase()) || 
        t.excerpt.toLowerCase().includes(currentFilters.search.toLowerCase())
      );
    }
    
    if (currentFilters.category !== 'All Categories') {
      filteredTokens = filteredTokens.filter(t => 
        t.category === currentFilters.category.toLowerCase().replace(' ', '-')
      );
    }
    
    if (currentFilters.status !== 'All Statuses') {
      filteredTokens = filteredTokens.filter(t => 
        t.status === currentFilters.status.toLowerCase().replace(' ', '-')
      );
    }
    
    // Apply sorting
    switch(currentFilters.view) {
      case 'Priority':
        // Sort by status (open first, then in-progress, then resolved)
        const statusOrder = { 'open': 1, 'in-progress': 2, 'resolved': 3 };
        filteredTokens.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
        break;
      case 'Unassigned':
        // Filter unassigned tokens (none in our sample data)
        filteredTokens = filteredTokens.filter(t => !t.assignedTo);
        break;
      default: // Recent
        filteredTokens.sort((a, b) => new Date(b.time) - new Date(a.time));
    }
    
    // Render tokens
    if (filteredTokens.length === 0) {
      tokensList.innerHTML = '<div class="no-tokens">No tokens found matching your criteria.</div>';
      return;
    }
    
    filteredTokens.forEach(token => {
      const tokenEl = document.createElement('div');
      tokenEl.className = 'token-card';
      tokenEl.dataset.id = token.id;
      
      // Status indicator class
      const statusClass = token.status === 'in-progress' ? 'in-progress' : token.status;
      
      tokenEl.innerHTML = `
        <div class="token-card-header">
          <div class="token-title">${token.title}</div>
          <div class="token-status">
            <span class="status-indicator ${statusClass}"></span>
            <span>${token.status.replace('-', ' ')}</span>
          </div>
        </div>
        <div class="token-meta">
          <span><i class="fas fa-user"></i> ${token.author}</span>
          <span><i class="fas fa-clock"></i> ${token.time}</span>
          <span><i class="fas fa-tag"></i> ${token.category}</span>
        </div>
        <div class="token-excerpt">${token.excerpt}</div>
        <div class="token-footer">
          <span><i class="fas fa-comment"></i> ${token.replies.length} ${token.replies.length === 1 ? 'reply' : 'replies'}</span>
        </div>
      `;
      
      tokensList.appendChild(tokenEl);
    });
  }

  // Open token detail dialog
  function openTokenDetail(tokenId) {
    const token = tokens.find(t => t.id == tokenId);
    if (!token) return;
    
    tokenDetailTitle.textContent = token.title;
    tokenDetailContent.textContent = token.content;
    tokenAuthor.textContent = token.author;
    tokenTime.textContent = token.time;
    tokenCategory.textContent = token.category;
    
    // Set status indicator
    tokenStatusIndicator.className = 'status-indicator';
    tokenStatusIndicator.classList.add(token.status === 'in-progress' ? 'in-progress' : token.status);
    tokenStatusText.textContent = token.status.replace('-', ' ');
    
    // Set shareable link
    tokenShareLink.value = `${window.location.origin}/tickets/${tokenId}`;
    
    // Store current token ID in dialog for later use
    tokenDetailDialog.dataset.tokenId = tokenId;
    
    // Show dialog
    tokenDetailDialog.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  // Setup event listeners
  function setupEventListeners() {
    // Dropdown functionality
    document.querySelectorAll('.dropdown').forEach(dropdown => {
      const btn = dropdown.querySelector('.dropdown-btn');
      const content = dropdown.querySelector('.dropdown-content');
      
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        // Close all other dropdowns
        document.querySelectorAll('.dropdown-content').forEach(d => {
          if (d !== content) d.style.display = 'none';
        });
        // Toggle current dropdown
        content.style.display = content.style.display === 'block' ? 'none' : 'block';
      });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
      document.querySelectorAll('.dropdown-content').forEach(d => {
        d.style.display = 'none';
      });
    });

    // Dropdown item selection
    document.querySelectorAll('.dropdown-content a').forEach(item => {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        const dropdown = this.closest('.dropdown');
        const btn = dropdown.querySelector('.dropdown-btn');
        const value = this.textContent;
        
        // Update button text
        btn.innerHTML = `${btn.textContent.split(' ')[0]} <i class="fas fa-chevron-down"></i>`;
        
        // Update current filters
        if (dropdown === categoryDropdown) {
          currentFilters.category = value;
        } else if (dropdown === statusDropdown) {
          currentFilters.status = value;
        }
        
        // Re-render tokens
        renderTokens();
      });
    });

    // View options
    viewOptions.forEach(option => {
      option.addEventListener('click', function() {
        viewOptions.forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');
        currentFilters.view = this.textContent;
        renderTokens();
      });
    });

    // Search functionality
    searchBox.addEventListener('input', function() {
      currentFilters.search = this.value;
      renderTokens();
    });

    // Open create token dialog
    createTokenBtn.addEventListener('click', function() {
      createTokenDialog.style.display = 'block';
      document.body.style.overflow = 'hidden';
    });

    // Close create token dialog
    closeTokenDialog.addEventListener('click', function() {
      createTokenDialog.style.display = 'none';
      document.body.style.overflow = 'auto';
    });

    // Close dialogs when clicking outside
    document.addEventListener('click', function(e) {
      if (e.target === createTokenDialog) {
        createTokenDialog.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
      if (e.target === tokenDetailDialog) {
        tokenDetailDialog.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });

    // Token form submission
    tokenForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const title = document.getElementById('tokenTitle').value;
      const details = document.getElementById('tokenDetails').value;
      const category = document.getElementById('tokenCategory').value;
      
      // Create new token
      const newToken = {
        id: tokens.length + 1,
        title: title,
        excerpt: details.length > 100 ? details.substring(0, 100) + '...' : details,
        status: "open",
        category: category,
        author: "You",
        time: "Just now",
        content: details,
        replies: []
      };
      
      tokens.unshift(newToken);
      
      // Reset form and close dialog
      this.reset();
      createTokenDialog.style.display = 'none';
      document.body.style.overflow = 'auto';
      
      // Refresh tokens list
      renderTokens();
    });

    // Token card click
    tokensList.addEventListener('click', function(e) {
      const tokenCard = e.target.closest('.token-card');
      if (tokenCard) {
        openTokenDetail(tokenCard.dataset.id);
      }
    });

    // Close token detail dialog
    closeTokenDetail.addEventListener('click', function() {
      tokenDetailDialog.style.display = 'none';
      document.body.style.overflow = 'auto';
    });

    // Copy share link
    copyLinkBtn.addEventListener('click', function() {
      tokenShareLink.select();
      document.execCommand('copy');
      
      // Show copied feedback
      const originalText = this.innerHTML;
      this.innerHTML = '<i class="fas fa-check"></i> Copied!';
      setTimeout(() => {
        this.innerHTML = originalText;
      }, 2000);
    });

    // Admin reply submission
    submitReplyBtn.addEventListener('click', function() {
      const replyContent = agentReply.value.trim();
      if (!replyContent) return;
      
      const tokenId = tokenDetailDialog.dataset.tokenId;
      const token = tokens.find(t => t.id == tokenId);
      if (!token) return;
      
      // Add reply
      token.replies.push({
        author: "Support Agent",
        time: "Just now",
        content: replyContent
      });
      
      // If status was open, change to in-progress
      if (token.status === 'open') {
        token.status = 'in-progress';
        tokenStatusIndicator.className = 'status-indicator in-progress';
        tokenStatusText.textContent = 'in progress';
      }
      
      // Clear reply field
      agentReply.value = '';
      
      // Refresh tokens list and keep dialog open
      renderTokens();
    });

    // Resolve token
    resolveTokenBtn.addEventListener('click', function() {
      const tokenId = tokenDetailDialog.dataset.tokenId;
      const token = tokens.find(t => t.id == tokenId);
      if (!token) return;
      
      // Change status to resolved
      token.status = 'resolved';
      tokenStatusIndicator.className = 'status-indicator resolved';
      tokenStatusText.textContent = 'resolved';
      
      // Refresh tokens list and keep dialog open
      renderTokens();
    });
  }

  // Initialize the app
  init();
});