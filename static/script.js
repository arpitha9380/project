document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('file-input');
    const dropZone = document.getElementById('drop-zone');
    const uploadBtn = document.getElementById('upload-btn');
    const previewImg = document.getElementById('image-preview');
    const resultSection = document.getElementById('result-section');
    const predictionText = document.getElementById('prediction-text');
    const confidenceText = document.getElementById('confidence-text');
    const confidenceBar = document.getElementById('confidence-bar');

    // Click to browse
    dropZone.addEventListener('click', () => fileInput.click());

    // File selection
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length) {
            updatePreview(fileInput.files[0]);
        }
    });

    // Drag and drop handlers
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#ff0000';
        dropZone.style.background = 'rgba(255, 0, 0, 0.1)';
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = '#2a2a2a';
        dropZone.style.background = '#1a1a1a';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#2a2a2a';
        dropZone.style.background = '#1a1a1a';

        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            updatePreview(e.dataTransfer.files[0]);
        }
    });

    function updatePreview(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImg.src = e.target.result;
            resultSection.classList.add('hidden');
        };
        reader.readAsDataURL(file);
    }

    // Upload and predict
    uploadBtn.addEventListener('click', async () => {
        if (!fileInput.files.length) {
            showNotification('Please select an image first', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('file', fileInput.files[0]);

        // Show result section with loading state
        resultSection.classList.remove('hidden');
        predictionText.innerText = 'ANALYZING...';
        confidenceText.innerText = '';
        confidenceBar.style.width = '0%';

        // Scroll to results
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'center' });

        try {
            const response = await fetch('/predict', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();

            if (data.error) {
                predictionText.innerText = 'ERROR';
                confidenceText.innerText = data.error;
                showNotification(data.error, 'error');
            } else if (data.result) {
                // Simulate processing delay for effect
                setTimeout(() => {
                    predictionText.innerText = data.result.toUpperCase();
                    confidenceText.innerText = `Confidence: ${data.confidence}`;

                    // Animate confidence bar
                    const confidenceValue = parseFloat(data.confidence);
                    setTimeout(() => {
                        confidenceBar.style.width = `${confidenceValue}%`;
                    }, 100);
                }, 1200);
            }
        } catch (error) {
            console.error('Error:', error);
            predictionText.innerText = 'CONNECTION ERROR';
            confidenceText.innerText = 'Unable to reach server';
            showNotification('Connection error. Please try again.', 'error');
        }
    });

    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'error' ? '#ff0000' : '#00ff00'};
            color: white;
            border-radius: 8px;
            font-family: 'Inter', sans-serif;
            font-weight: 600;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Add CSS animations for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});
