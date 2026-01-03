// API Call Counter Management
const STORAGE_KEY = 'weatherApiCounter';
const DATE_KEY = 'weatherApiDate';
const MAX_CALLS = 1000;

class ApiCounter {
    constructor() {
        this.checkAndResetCounter();
    }

    // Get today's date string (YYYY-MM-DD)
    getTodayDateString() {
        const today = new Date();
        return today.toISOString().split('T')[0];
    }

    // Check if it's a new day and reset if needed
    checkAndResetCounter() {
        const savedDate = localStorage.getItem(DATE_KEY);
        const todayDate = this.getTodayDateString();

        if (!savedDate || savedDate !== todayDate) {
            // It's a new day, reset counter
            this.resetCounter();
        }
    }

    // Reset counter to zero for new day
    resetCounter() {
        localStorage.setItem(STORAGE_KEY, '0');
        localStorage.setItem(DATE_KEY, this.getTodayDateString());
    }

    // Get current counter value
    getCount() {
        const count = localStorage.getItem(STORAGE_KEY);
        return count ? parseInt(count) : 0;
    }

    // Increment counter
    incrementCounter() {
        this.checkAndResetCounter(); // Check before incrementing
        const currentCount = this.getCount();
        const newCount = currentCount + 1;
        localStorage.setItem(STORAGE_KEY, newCount.toString());
        this.updateDisplay();
        return newCount;
    }

    // Check if limit is reached
    isLimitReached() {
        return this.getCount() >= MAX_CALLS;
    }

    // Get remaining calls
    getRemainingCalls() {
        return Math.max(0, MAX_CALLS - this.getCount());
    }

    // Get time until midnight (end of day)
    getTimeUntilMidnight() {
        const now = new Date();
        const midnight = new Date(now);
        midnight.setHours(24, 0, 0, 0); // Set to next midnight
        
        return midnight.getTime() - now.getTime();
    }

    // Format time until midnight
    formatTimeUntilReset() {
        const milliseconds = this.getTimeUntilMidnight();
        const hours = Math.floor(milliseconds / (1000 * 60 * 60));
        const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
        
        return `${hours}h ${minutes}m`;
    }

    // Update the display in the UI
    updateDisplay() {
        const counterElement = document.getElementById('apiCallCount');
        const remainingElement = document.getElementById('remainingCalls');
        const resetTimeElement = document.getElementById('resetTime');
        
        if (counterElement) {
            counterElement.textContent = this.getCount();
        }
        
        if (remainingElement) {
            const remaining = this.getRemainingCalls();
            remainingElement.textContent = remaining;
            
            // Add warning color if running low
            if (remaining < 100) {
                remainingElement.style.color = '#e74c3c';
            } else if (remaining < 250) {
                remainingElement.style.color = '#f39c12';
            } else {
                remainingElement.style.color = '#27ae60';
            }
        }
        
        if (resetTimeElement) {
            resetTimeElement.textContent = this.formatTimeUntilReset();
        }
    }
}

// Create global instance
const apiCounter = new ApiCounter();

// Update display when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => apiCounter.updateDisplay());
} else {
    apiCounter.updateDisplay();
}

// Update display every minute
setInterval(() => apiCounter.updateDisplay(), 60000);
