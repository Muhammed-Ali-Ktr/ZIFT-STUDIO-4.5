// Next-Gen QR Generator - Complete JavaScript with Working Download & Share

// State
const state = {
    content: 'https://example.com',
    contentType: 'url',
    qrColor: '#000000',
    bgColor: '#ffffff',
    size: 1024,
    margin: 4,
    errorCorrection: 'M',
    cornerStyle: 'square',
    logo: null,
    frameStyle: 'none',
    bottomText: '',
    theme: 'dark',
    qr: null
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    init();
});

function init() {
    setupEventListeners();
    generateQR();
}

// Event Listeners
function setupEventListeners() {
    // Content type change
    document.getElementById('contentType').addEventListener('change', (e) => {
        state.contentType = e.target.value;
        renderContentInput();
        generateQR();
    });

    // URL input
    document.getElementById('urlInput').addEventListener('input', debounce((e) => {
        state.content = e.target.value || 'https://example.com';
        generateQR();
    }, 500));

    // Color inputs
    document.getElementById('qrColor').addEventListener('input', (e) => {
        state.qrColor = e.target.value;
        generateQR();
    });

    document.getElementById('bgColor').addEventListener('input', (e) => {
        state.bgColor = e.target.value;
        generateQR();
    });

    // Size
    document.getElementById('qrSize').addEventListener('change', (e) => {
        state.size = parseInt(e.target.value);
        generateQR();
    });

    // Margin
    document.getElementById('margin').addEventListener('input', (e) => {
        state.margin = parseInt(e.target.value);
        document.getElementById('marginValue').textContent = state.margin;
        generateQR();
    });

    // Error correction buttons
    document.querySelectorAll('.ec-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.ec-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.errorCorrection = e.target.dataset.level;
            generateQR();
        });
    });

    // Style buttons
    document.querySelectorAll('.style-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.style-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            state.cornerStyle = e.currentTarget.dataset.style;
            generateQR();
        });
    });

    // Logo upload
    document.getElementById('logoBtn').addEventListener('click', () => {
        document.getElementById('logoUpload').click();
    });

    document.getElementById('logoUpload').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                state.logo = event.target.result;
                document.getElementById('logoImg').src = state.logo;
                document.getElementById('logoPreview').classList.remove('hidden');
                generateQR();
            };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('removeLogo').addEventListener('click', () => {
        state.logo = null;
        document.getElementById('logoPreview').classList.add('hidden');
        document.getElementById('logoUpload').value = '';
        generateQR();
    });

    // Frame style
    document.getElementById('frameStyle').addEventListener('change', (e) => {
        state.frameStyle = e.target.value;
        generateQR();
    });

    // Bottom text
    document.getElementById('bottomText').addEventListener('input', debounce((e) => {
        state.bottomText = e.target.value;
        generateQR();
    }, 500));

    // Templates
    document.querySelectorAll('.template-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const template = e.currentTarget.dataset.template;
            applyTemplate(template);
        });
    });

    // Download button
    document.getElementById('downloadBtn').addEventListener('click', downloadQR);

    // Share button
    document.getElementById('shareBtn').addEventListener('click', () => {
        document.getElementById('shareModal').classList.add('active');
    });

    // Close share modal
    document.getElementById('closeShare').addEventListener('click', () => {
        document.getElementById('shareModal').classList.remove('active');
    });

    // Share to platforms
    document.getElementById('shareWhatsApp').addEventListener('click', () => shareToWhatsApp());
    document.getElementById('shareTwitter').addEventListener('click', () => shareToTwitter());
    document.getElementById('shareFacebook').addEventListener('click', () => shareToFacebook());
    document.getElementById('downloadShare').addEventListener('click', () => {
        downloadQR();
        document.getElementById('shareModal').classList.remove('active');
    });

    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Close modal on outside click
    document.getElementById('shareModal').addEventListener('click', (e) => {
        if (e.target.id === 'shareModal') {
            document.getElementById('shareModal').classList.remove('active');
        }
    });
}

// Render Content Input
function renderContentInput() {
    const container = document.getElementById('contentInput');
    let html = '';

    switch (state.contentType) {
        case 'url':
            html = `
                <div class="mb-3">
                    <label class="block text-sm font-medium mb-2 text-gray-300">URL Adresi</label>
                    <input type="text" id="urlInput" value="${state.content}" class="glass-input w-full px-4 py-3 rounded-xl text-sm" placeholder="https://example.com">
                </div>
            `;
            break;
        
        case 'text':
            html = `
                <div class="mb-3">
                    <label class="block text-sm font-medium mb-2 text-gray-300">Metin</label>
                    <textarea id="textInput" class="glass-input w-full px-4 py-3 rounded-xl text-sm resize-none" rows="4" placeholder="Mesajınızı yazın...">${state.content}</textarea>
                </div>
            `;
            break;
        
        case 'wifi':
            html = `
                <div class="mb-3">
                    <label class="block text-sm font-medium mb-2 text-gray-300">Ağ Adı (SSID)</label>
                    <input type="text" id="wifiSSID" class="glass-input w-full px-4 py-3 rounded-xl text-sm" placeholder="WiFi-Network">
                </div>
                <div class="mb-3">
                    <label class="block text-sm font-medium mb-2 text-gray-300">Şifre</label>
                    <input type="password" id="wifiPassword" class="glass-input w-full px-4 py-3 rounded-xl text-sm" placeholder="••••••••">
                </div>
                <div class="mb-3">
                    <label class="block text-sm font-medium mb-2 text-gray-300">Şifreleme</label>
                    <select id="wifiEncryption" class="glass-input w-full px-4 py-2 rounded-xl text-sm">
                        <option value="WPA">WPA/WPA2</option>
                        <option value="WEP">WEP</option>
                        <option value="nopass">Açık Ağ</option>
                    </select>
                </div>
            `;
            break;
        
        case 'email':
            html = `
                <div class="mb-3">
                    <label class="block text-sm font-medium mb-2 text-gray-300">E-posta Adresi</label>
                    <input type="email" id="emailAddress" class="glass-input w-full px-4 py-3 rounded-xl text-sm" placeholder="ornek@example.com">
                </div>
                <div class="mb-3">
                    <label class="block text-sm font-medium mb-2 text-gray-300">Konu</label>
                    <input type="text" id="emailSubject" class="glass-input w-full px-4 py-3 rounded-xl text-sm" placeholder="E-posta konusu">
                </div>
            `;
            break;
        
        case 'phone':
            html = `
                <div class="mb-3">
                    <label class="block text-sm font-medium mb-2 text-gray-300">Telefon Numarası</label>
                    <input type="tel" id="phoneNumber" class="glass-input w-full px-4 py-3 rounded-xl text-sm" placeholder="+90 555 123 4567">
                </div>
            `;
            break;
    }

    container.innerHTML = html;

    // Attach new event listeners
    setTimeout(() => {
        const inputs = container.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('input', debounce(() => {
                updateContentFromInputs();
                generateQR();
            }, 500));
        });
    }, 0);
}

// Update content from inputs
function updateContentFromInputs() {
    switch (state.contentType) {
        case 'url':
            const urlInput = document.getElementById('urlInput');
            state.content = urlInput ? urlInput.value : 'https://example.com';
            break;
        
        case 'text':
            const textInput = document.getElementById('textInput');
            state.content = textInput ? textInput.value : '';
            break;
        
        case 'wifi':
            const ssid = document.getElementById('wifiSSID')?.value || '';
            const password = document.getElementById('wifiPassword')?.value || '';
            const encryption = document.getElementById('wifiEncryption')?.value || 'WPA';
            state.content = `WIFI:T:${encryption};S:${ssid};P:${password};;`;
            break;
        
        case 'email':
            const email = document.getElementById('emailAddress')?.value || '';
            const subject = document.getElementById('emailSubject')?.value || '';
            state.content = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
            break;
        
        case 'phone':
            const phone = document.getElementById('phoneNumber')?.value || '';
            state.content = `tel:${phone}`;
            break;
    }
}

// Generate QR Code
function generateQR() {
    const canvas = document.getElementById('qrCanvas');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    canvas.width = state.size;
    canvas.height = state.size;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    try {
        // Create QR code using QRious
        const qr = new QRious({
            element: canvas,
            value: state.content || 'https://example.com',
            size: state.size,
            level: state.errorCorrection,
            foreground: state.qrColor,
            background: state.bgColor,
            padding: state.margin * 10
        });

        state.qr = qr;

        // Apply additional modifications
        setTimeout(() => {
            applyModifications();
        }, 50);

    } catch (error) {
        console.error('QR Generation Error:', error);
    }
}

// Apply modifications (logo, frame, etc.)
function applyModifications() {
    const canvas = document.getElementById('qrCanvas');
    const ctx = canvas.getContext('2d');
    
    // Save current canvas state
    const currentImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Calculate total height with frame
    let totalHeight = canvas.height;
    const frameHeight = state.frameStyle !== 'none' ? 80 : 0;
    const bottomTextHeight = state.bottomText ? 40 : 0;
    totalHeight += frameHeight + bottomTextHeight;

    // Create new canvas with frame
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = totalHeight;
    const tempCtx = tempCanvas.getContext('2d');

    // Fill background
    tempCtx.fillStyle = state.bgColor;
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Draw original QR
    tempCtx.putImageData(currentImageData, 0, 0);

    // Add logo if present
    if (state.logo) {
        const img = new Image();
        img.onload = () => {
            const logoSize = canvas.width * 0.15;
            const x = (canvas.width - logoSize) / 2;
            const y = (canvas.height - logoSize) / 2;

            // White background for logo
            tempCtx.fillStyle = state.bgColor;
            tempCtx.fillRect(x - 8, y - 8, logoSize + 16, logoSize + 16);

            // Draw logo
            tempCtx.drawImage(img, x, y, logoSize, logoSize);

            // Continue with frame
            addFrameAndText(tempCanvas, tempCtx, canvas.height, frameHeight, bottomTextHeight);
        };
        img.src = state.logo;
    } else {
        addFrameAndText(tempCanvas, tempCtx, canvas.height, frameHeight, bottomTextHeight);
    }
}

// Add frame and bottom text
function addFrameAndText(tempCanvas, tempCtx, qrHeight, frameHeight, bottomTextHeight) {
    let currentY = qrHeight;

    // Add frame
    if (state.frameStyle !== 'none') {
        tempCtx.fillStyle = state.qrColor;
        tempCtx.fillRect(0, currentY, tempCanvas.width, frameHeight);

        tempCtx.fillStyle = state.bgColor;
        tempCtx.font = 'bold 28px Arial';
        tempCtx.textAlign = 'center';
        tempCtx.textBaseline = 'middle';

        const frameText = state.frameStyle === 'scan' ? 'Scan Me' : 'Beni Tara';
        tempCtx.fillText(frameText, tempCanvas.width / 2, currentY + frameHeight / 2);

        currentY += frameHeight;
    }

    // Add bottom text
    if (state.bottomText) {
        tempCtx.fillStyle = state.bgColor;
        tempCtx.fillRect(0, currentY, tempCanvas.width, bottomTextHeight);

        tempCtx.fillStyle = state.qrColor;
        tempCtx.font = '20px Arial';
        tempCtx.textAlign = 'center';
        tempCtx.textBaseline = 'middle';
        tempCtx.fillText(state.bottomText, tempCanvas.width / 2, currentY + bottomTextHeight / 2);
    }

    // Update main canvas
    const canvas = document.getElementById('qrCanvas');
    canvas.width = tempCanvas.width;
    canvas.height = tempCanvas.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(tempCanvas, 0, 0);
}

// Download QR Code
function downloadQR() {
    const canvas = document.getElementById('qrCanvas');
    
    try {
        // Convert canvas to blob
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `qr-code-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 'image/png', 1.0);
    } catch (error) {
        console.error('Download Error:', error);
        alert('İndirme hatası oluştu. Lütfen tekrar deneyin.');
    }
}

// Share to WhatsApp
function shareToWhatsApp() {
    const canvas = document.getElementById('qrCanvas');
    
    canvas.toBlob((blob) => {
        const file = new File([blob], 'qr-code.png', { type: 'image/png' });
        
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            navigator.share({
                files: [file],
                title: 'QR Kod',
                text: 'QR Kodum'
            }).catch(err => {
                console.log('Share error:', err);
                fallbackShare('whatsapp');
            });
        } else {
            fallbackShare('whatsapp');
        }
    }, 'image/png');
}

// Share to Twitter
function shareToTwitter() {
    fallbackShare('twitter');
}

// Share to Facebook
function shareToFacebook() {
    fallbackShare('facebook');
}

// Fallback share method
function fallbackShare(platform) {
    const text = encodeURIComponent('QR Kodum: ' + state.content);
    
    let url = '';
    switch (platform) {
        case 'whatsapp':
            url = `https://wa.me/?text=${text}`;
            break;
        case 'twitter':
            url = `https://twitter.com/intent/tweet?text=${text}`;
            break;
        case 'facebook':
            url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(state.content)}`;
            break;
    }
    
    if (url) {
        window.open(url, '_blank', 'width=600,height=400');
    } else {
        alert('QR kodunuzu indirip manuel olarak paylaşabilirsiniz.');
    }
}

// Apply Template
function applyTemplate(template) {
    switch (template) {
        case 'default':
            state.qrColor = '#000000';
            state.bgColor = '#ffffff';
            break;
        case 'blue':
            state.qrColor = '#1e40af';
            state.bgColor = '#ffffff';
            break;
        case 'gradient':
            state.qrColor = '#7c3aed';
            state.bgColor = '#ffffff';
            break;
        case 'green':
            state.qrColor = '#059669';
            state.bgColor = '#ffffff';
            break;
    }

    document.getElementById('qrColor').value = state.qrColor;
    document.getElementById('bgColor').value = state.bgColor;
    generateQR();
}

// Toggle Theme
function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    document.body.classList.toggle('light-mode', state.theme === 'light');
}

// Debounce utility
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
