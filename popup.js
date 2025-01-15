document.addEventListener('DOMContentLoaded', function() {
    // Load saved states when popup opens
    chrome.storage.sync.get('checklistStates', function(data) {
        if (data.checklistStates) {
            Object.keys(data.checklistStates).forEach(id => {
                const checkbox = document.getElementById(id);
                if (checkbox) {
                    checkbox.checked = data.checklistStates[id];
                }
            });
        }
    });

    // Save states when checkboxes are clicked
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            saveStates();
        });
    });

    // Reset button functionality
    document.getElementById('reset').addEventListener('click', function() {
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        saveStates();
    });

    // Save button functionality
    document.getElementById('save').addEventListener('click', saveStates);
});

// Function to save all checkbox states
function saveStates() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const states = {};
    
    checkboxes.forEach(checkbox => {
        states[checkbox.id] = checkbox.checked;
    });

    chrome.storage.sync.set({
        checklistStates: states
    }, function() {
        // Provide visual feedback for save
        const saveButton = document.getElementById('save');
        const originalText = saveButton.textContent;
        saveButton.textContent = 'Saved!';
        saveButton.style.backgroundColor = '#4CAF50';
        
        setTimeout(() => {
            saveButton.textContent = originalText;
            saveButton.style.backgroundColor = '#00796b';
        }, 1000);
    });
}

// Add hover effect for checkboxes to show completion percentage
document.addEventListener('change', function() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const totalItems = checkboxes.length;
    const checkedItems = document.querySelectorAll('input[type="checkbox"]:checked').length;
    const percentage = Math.round((checkedItems / totalItems) * 100);
    
    const title = document.querySelector('h3');
    title.textContent = `Code Review Checklist (${percentage}% Complete)`;
    
    // Also update title when reset button is clicked
    document.getElementById('reset').addEventListener('click', () => {
        title.textContent = 'Code Review Checklist';
    });
});
