document.addEventListener('DOMContentLoaded', function() {
  // Sample questions data
  const questions = [
    {
      id: 1,
      title: "How do I reset my password?",
      excerpt: "I'm having trouble resetting my password. The reset link doesn't seem to work...",
      votes: 12,
      status: "open",
      tags: ["technical", "authentication"],
      answers: 5,
      views: 42,
      author: "John Doe",
      time: "2 hours ago"
    },
    {
      id: 2,
      title: "When will the new feature be released?",
      excerpt: "I saw the roadmap mentioned a new dashboard feature. Is there an ETA for this release?",
      votes: 8,
      status: "open",
      tags: ["feature", "roadmap"],
      answers: 3,
      views: 28,
      author: "Sarah Smith",
      time: "5 hours ago"
    },
    {
      id: 3,
      title: "Billing issue for annual subscription",
      excerpt: "I was charged twice for my annual subscription. How can I get a refund for the duplicate charge?",
      votes: 15,
      status: "closed",
      tags: ["billing", "payment"],
      answers: 7,
      views: 64,
      author: "Mike Johnson",
      time: "2 days ago"
    }
  ];

  // DOM Elements
  const questionsList = document.getElementById('questionsList');
  const askQuestionBtn = document.getElementById('askQuestionBtn');
  const askQuestionModal = document.getElementById('askQuestionModal');
  const closeModal = document.querySelector('.close-modal');
  const questionForm = document.getElementById('questionForm');
  const tagInput = document.getElementById('tagInput');
  const tagsContainer = document.getElementById('tagsContainer');
  const searchBox = document.querySelector('.search-box input');
  const categoryDropdown = document.querySelectorAll('.dropdown')[0];
  const sortDropdown = document.querySelectorAll('.dropdown')[1];
  const statusDropdown = document.querySelectorAll('.dropdown')[2];
  const viewOptions = document.querySelectorAll('.view-options span');

  // Current filter state
  let currentFilters = {
    search: '',
    category: 'All Categories',
    sort: 'Most Recent',
    status: 'All Questions',
    view: 'Recent'
  };

  // Initialize the app
  function init() {
    renderQuestions();
    setupEventListeners();
  }

  // Render questions based on current filters
  function renderQuestions() {
    questionsList.innerHTML = '';
    
    let filteredQuestions = [...questions];
    
    // Apply filters
    if (currentFilters.search) {
      filteredQuestions = filteredQuestions.filter(q => 
        q.title.toLowerCase().includes(currentFilters.search.toLowerCase()) || 
        q.excerpt.toLowerCase().includes(currentFilters.search.toLowerCase())
      );
    }
    
    if (currentFilters.category !== 'All Categories') {
      filteredQuestions = filteredQuestions.filter(q => 
        q.tags.includes(currentFilters.category.toLowerCase().replace(' ', '-'))
      );
    }
    
    if (currentFilters.status !== 'All Questions') {
      filteredQuestions = filteredQuestions.filter(q => 
        q.status === currentFilters.status.toLowerCase()
      );
    }
    
    // Apply sorting
    switch(currentFilters.sort) {
      case 'Most Votes':
        filteredQuestions.sort((a, b) => b.votes - a.votes);
        break;
      case 'Most Active':
        filteredQuestions.sort((a, b) => b.answers - a.answers);
        break;
      case 'Unanswered':
        filteredQuestions = filteredQuestions.filter(q => q.answers === 0);
        break;
      default: // Most Recent
        filteredQuestions.sort((a, b) => new Date(b.time) - new Date(a.time));
    }
    
    // Apply view options
    if (currentFilters.view === 'Popular') {
      filteredQuestions.sort((a, b) => b.votes - a.votes);
    } else if (currentFilters.view === 'Unanswered') {
      filteredQuestions = filteredQuestions.filter(q => q.answers === 0);
    }
    
    // Render questions
    if (filteredQuestions.length === 0) {
      questionsList.innerHTML = '<div class="no-questions">No questions found matching your criteria.</div>';
      return;
    }
    
    filteredQuestions.forEach(question => {
      const questionEl = document.createElement('div');
      questionEl.className = 'question-card';
      questionEl.dataset.id = question.id;
      
      questionEl.innerHTML = `
        <div class="vote-section">
          <button class="vote-btn downvote" title="Downvote">👎</button>
          <span class="vote-count">${question.votes}</span>
          <button class="vote-btn upvote" title="Upvote">👍</button>
        </div>
        <div class="question-content">
          <div class="question-header">
            <h3>${question.title}</h3>
            <div class="question-meta">
              <span class="user-info">Asked by ${question.author}</span>
              <span class="time-info">${question.time}</span>
            </div>
          </div>
          <p class="question-excerpt">${question.excerpt}</p>
          <div class="question-footer">
            <div class="tags">
              ${question.tags.map(tag => `<span class="tag ${tag}">${tag.charAt(0).toUpperCase() + tag.slice(1)}</span>`).join('')}
            </div>
            <div class="activity-info">
              <span><i class="fas fa-comment"></i> ${question.answers} ${question.answers === 1 ? 'answer' : 'answers'}</span>
              <span><i class="fas fa-eye"></i> ${question.views} views</span>
              <label class="status-toggle">
                <input type="checkbox" ${question.status === 'closed' ? 'checked' : ''}>
                <span class="status-slider"></span>
                <div class="status-labels">
                  <span>✕</span>
                  <span>✓</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      `;
      
      questionsList.appendChild(questionEl);
    });
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
        } else if (dropdown === sortDropdown) {
          currentFilters.sort = value;
        } else if (dropdown === statusDropdown) {
          currentFilters.status = value;
        }
        
        // Re-render questions
        renderQuestions();
      });
    });

    // View options
    viewOptions.forEach(option => {
      option.addEventListener('click', function() {
        viewOptions.forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');
        currentFilters.view = this.textContent;
        renderQuestions();
      });
    });

    // Search functionality
    searchBox.addEventListener('input', function() {
      currentFilters.search = this.value;
      renderQuestions();
    });

    // Ask question modal
    askQuestionBtn.addEventListener('click', function() {
      askQuestionModal.style.display = 'block';
    });

    closeModal.addEventListener('click', function() {
      askQuestionModal.style.display = 'none';
    });

    window.addEventListener('click', function(e) {
      if (e.target === askQuestionModal) {
        askQuestionModal.style.display = 'none';
      }
    });

    // Tag input functionality
    const tags = [];
    
    tagInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && this.value.trim()) {
        e.preventDefault();
        const tag = this.value.trim().toLowerCase().replace(' ', '-');
        if (!tags.includes(tag)) {
          tags.push(tag);
          renderTags();
        }
        this.value = '';
      }
    });
    
    function renderTags() {
      tagsContainer.innerHTML = '';
      tags.forEach(tag => {
        const tagEl = document.createElement('div');
        tagEl.className = 'tag-input-tag';
        tagEl.innerHTML = `
          ${tag}
          <span class="remove-tag" data-tag="${tag}">&times;</span>
        `;
        tagsContainer.appendChild(tagEl);
      });
      
      // Add event listeners to remove buttons
      document.querySelectorAll('.remove-tag').forEach(btn => {
        btn.addEventListener('click', function() {
          const tagToRemove = this.dataset.tag;
          const index = tags.indexOf(tagToRemove);
          if (index > -1) {
            tags.splice(index, 1);
            renderTags();
          }
        });
      });
    }

    // Question form submission
    questionForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const title = document.getElementById('questionTitle').value;
      const details = document.getElementById('questionDetails').value;
      
      // Create new question
      const newQuestion = {
        id: questions.length + 1,
        title: title,
        excerpt: details.length > 100 ? details.substring(0, 100) + '...' : details,
        votes: 0,
        status: "open",
        tags: [...tags],
        answers: 0,
        views: 0,
        author: "You",
        time: "Just now"
      };
      
      questions.unshift(newQuestion);
      
      // Reset form
      this.reset();
      tags.length = 0;
      renderTags();
      
      // Close modal and refresh questions
      askQuestionModal.style.display = 'none';
      renderQuestions();
    });

    // Voting and status toggle functionality
    questionsList.addEventListener('click', function(e) {
      const upvoteBtn = e.target.closest('.upvote');
      const downvoteBtn = e.target.closest('.downvote');
      const statusToggle = e.target.closest('.status-toggle input');
      const questionCard = e.target.closest('.question-card');
      
      if (upvoteBtn || downvoteBtn) {
        const isUpvote = !!upvoteBtn;
        const voteBtn = isUpvote ? upvoteBtn : downvoteBtn;
        const voteCount = voteBtn.parentElement.querySelector('.vote-count');
        let count = parseInt(voteCount.textContent);
        
        if (voteBtn.classList.contains('active')) {
          // Remove vote
          count += isUpvote ? -1 : 1;
          voteBtn.classList.remove('active');
        } else {
          // Add vote
          const oppositeBtn = isUpvote 
            ? voteBtn.parentElement.querySelector('.downvote')
            : voteBtn.parentElement.querySelector('.upvote');
          
          if (oppositeBtn.classList.contains('active')) {
            count += isUpvote ? 2 : -2;
            oppositeBtn.classList.remove('active');
          } else {
            count += isUpvote ? 1 : -1;
          }
          voteBtn.classList.add('active');
        }
        
        voteCount.textContent = count;
        
        // Update in-memory data
        const questionId = parseInt(questionCard.dataset.id);
        const question = questions.find(q => q.id === questionId);
        if (question) question.votes = count;
      } 
      else if (statusToggle) {
        // Toggle question status
        const questionId = parseInt(questionCard.dataset.id);
        const question = questions.find(q => q.id === questionId);
        if (question) {
          question.status = statusToggle.checked ? 'closed' : 'open';
        }
      }
      else if (questionCard) {
        // Navigate to question detail
        console.log('Navigating to question:', questionCard.dataset.id);
      }
    });
  }

  // Initialize the app
  init();
});