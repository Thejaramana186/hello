// Flask Auto-refresh functionality with visual countdown and API integration
let countdownInterval;
let refreshTimeout;
let autoRefreshEnabled = true;
let pageLoads = parseInt(localStorage.getItem('pageLoads') || '0') + 1;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    startAutoRefresh();
    updateClock();
    setInterval(updateClock, 1000);
    
    // Load API data on page load
    fetchServerStats();
    checkHealth();
});

function initializePage() {
    // Update page load counter
    localStorage.setItem('pageLoads', pageLoads.toString());
    const pageLoadsElement = document.getElementById('page-loads');
    if (pageLoadsElement) {
        pageLoadsElement.textContent = pageLoads;
    }
    
    // Add smooth entrance animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in-out';
        document.body.style.opacity = '1';
    }, 100);
    
    // Add interactive hover effects to cards
    addCardInteractions();
    
    console.log(`🎉 Flask App loaded! Visit #${pageLoads}`);
    console.log('🔄 Auto-refresh will occur in 10 seconds');
    console.log('🐍 Running on Flask Framework');
}

function startAutoRefresh() {
    if (!autoRefreshEnabled) return;
    
    let timeLeft = 10;
    const countdownElement = document.getElementById('countdown');
    const timerTextElement = document.getElementById('timer-text');
    
    // Update countdown display immediately
    updateCountdownDisplay(timeLeft, countdownElement, timerTextElement);
    
    // Start countdown
    countdownInterval = setInterval(() => {
        timeLeft--;
        updateCountdownDisplay(timeLeft, countdownElement, timerTextElement);
        
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            refreshPage();
        }
    }, 1000);
    
    // Set refresh timeout as backup
    refreshTimeout = setTimeout(refreshPage, 10000);
}

function updateCountdownDisplay(timeLeft, countdownElement, timerTextElement) {
    if (countdownElement) {
        countdownElement.textContent = timeLeft;
        
        // Add visual feedback for last 3 seconds
        if (timeLeft <= 3 && timeLeft > 0) {
            countdownElement.style.color = '#ef4444';
            countdownElement.style.transform = 'scale(1.1)';
        } else {
            countdownElement.style.color = '#667eea';
            countdownElement.style.transform = 'scale(1)';
        }
    }
    
    if (timerTextElement) {
        timerTextElement.textContent = timeLeft;
        timerTextElement.style.color = timeLeft <= 3 ? '#ef4444' : '#667eea';
    }
}

function refreshPage() {
    // Add fade out effect before refresh
    document.body.style.transition = 'opacity 0.3s ease-out';
    document.body.style.opacity = '0';
    
    setTimeout(() => {
        window.location.reload();
    }, 300);
}

function toggleAutoRefresh() {
    autoRefreshEnabled = !autoRefreshEnabled;
    
    if (autoRefreshEnabled) {
        console.log('🔄 Auto-refresh enabled');
        startAutoRefresh();
        showNotification('Auto-refresh enabled', 'success');
    } else {
        console.log('⏸️ Auto-refresh disabled');
        clearInterval(countdownInterval);
        clearTimeout(refreshTimeout);
        
        // Reset countdown display
        const countdownElement = document.getElementById('countdown');
        const timerTextElement = document.getElementById('timer-text');
        if (countdownElement) countdownElement.textContent = '∞';
        if (timerTextElement) timerTextElement.textContent = '∞';
        
        showNotification('Auto-refresh disabled', 'info');
    }
}

function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const clockElement = document.getElementById('current-time');
    if (clockElement) {
        clockElement.textContent = timeString;
    }
}

// Flask API Integration Functions
async function fetchServerStats() {
    const statsElement = document.getElementById('server-stats');
    if (!statsElement) return;
    
    try {
        statsElement.innerHTML = '<div class="loading">Loading stats...</div>';
        
        const response = await fetch('/api/stats');
        const data = await response.json();
        
        if (response.ok) {
            statsElement.innerHTML = `
                <div class="api-data">
                    <strong>Server:</strong> ${data.server}<br>
                    <strong>Status:</strong> <span class="api-success">${data.status}</span><br>
                    <strong>Framework:</strong> ${data.framework}<br>
                    <strong>Auto Refresh:</strong> ${data.auto_refresh ? 'Enabled' : 'Disabled'}<br>
                    <strong>Interval:</strong> ${data.refresh_interval}
                </div>
            `;
        } else {
            throw new Error('Failed to fetch stats');
        }
    } catch (error) {
        console.error('Error fetching server stats:', error);
        statsElement.innerHTML = `<div class="api-error">Error loading stats</div>`;
    }
}

async function checkHealth() {
    const healthElement = document.getElementById('health-status');
    if (!healthElement) return;
    
    try {
        healthElement.innerHTML = '<div class="loading">Checking health...</div>';
        
        const response = await fetch('/health');
        const data = await response.json();
        
        if (response.ok) {
            healthElement.innerHTML = `
                <div class="api-data">
                    <strong>Status:</strong> <span class="api-success">${data.status}</span><br>
                    <strong>Message:</strong> ${data.message}<br>
                    <strong>Timestamp:</strong> ${new Date().toLocaleString()}
                </div>
            `;
        } else {
            throw new Error('Health check failed');
        }
    } catch (error) {
        console.error('Error checking health:', error);
        healthElement.innerHTML = `<div class="api-error">Health check failed</div>`;
    }
}

function addCardInteractions() {
    // Add ripple effect to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('click', function(e) {
            createRipple(e, this);
        });
    });
    
    // Add parallax effect to images
    const imageCards = document.querySelectorAll('.image-card');
    imageCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        });
    });
}

function createRipple(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(102, 126, 234, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 1000;
    `;
    
    // Add ripple animation keyframes if not already added
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#667eea'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + R: Manual refresh
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        showNotification('Manual refresh triggered', 'info');
        setTimeout(refreshPage, 500);
    }
    
    // Space: Toggle auto-refresh
    if (e.code === 'Space' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        toggleAutoRefresh();
    }
    
    // F5: Refresh stats
    if (e.key === 'F5') {
        e.preventDefault();
        fetchServerStats();
        checkHealth();
        showNotification('API data refreshed', 'info');
    }
});

// Handle visibility change (pause when tab is not active)
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        clearInterval(countdownInterval);
        clearTimeout(refreshTimeout);
        console.log('⏸️ Auto-refresh paused (tab not visible)');
    } else if (autoRefreshEnabled) {
        startAutoRefresh();
        console.log('▶️ Auto-refresh resumed (tab visible)');
    }
});

// Performance monitoring
window.addEventListener('load', function() {
    const loadTime = performance.now();
    console.log(`⚡ Flask app loaded in ${Math.round(loadTime)}ms`);
    
    // Show load time in console with style
    console.log(
        '%c🐍 Flask Application Performance Stats',
        'color: #667eea; font-size: 16px; font-weight: bold;'
    );
    console.log(`📊 Load Time: ${Math.round(loadTime)}ms`);
    console.log(`🔢 Page Visits: ${pageLoads}`);
    console.log(`🕒 Current Time: ${new Date().toLocaleString()}`);
    console.log(`🌐 Framework: Flask (Python)`);
});

// Export functions for global access
window.toggleAutoRefresh = toggleAutoRefresh;
window.refreshPage = refreshPage;
window.fetchServerStats = fetchServerStats;
window.checkHealth = checkHealth;