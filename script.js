// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    console.log('🎬 Страница загружена, начинаем инициализацию...');
    
    // Check if Logger is available
    if (typeof Logger === 'undefined') {
        console.error('❌ ОШИБКА: Logger не загружен! Проверьте, что logger.js подключен в HTML');
        alert('Ошибка: Logger не загружен. Откройте консоль (F12) для деталей.');
        return;
    }
    
    console.log('✅ Logger найден, создаем экземпляр...');
    
    // Initialize logger
    const logger = new Logger();
    
    console.log('✅ Logger инициализирован');
    console.log('📊 Отправляем событие SITE_OPENED...');
    
    // Log site opened event
    logger.logEvent('SITE_OPENED', {
        message: 'Оксана открыла сайт! 👀'
    });
    
    // Music control
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    let isMusicPlaying = false;
    
    // Set initial volume
    bgMusic.volume = 0.4;
    
    // Attempt to play music
    const playMusic = () => {
        bgMusic.play()
            .then(() => {
                isMusicPlaying = true;
                musicToggle.textContent = '🔊';
                musicToggle.classList.remove('muted');
                console.log('✅ Музыка играет');
            })
            .catch(err => {
                console.log('⚠️ Автовоспроизведение заблокировано браузером. Кликните на кнопку музыки.');
                isMusicPlaying = false;
                musicToggle.textContent = '🔇';
                musicToggle.classList.add('muted');
            });
    };
    
    // Pause music
    const pauseMusic = () => {
        bgMusic.pause();
        isMusicPlaying = false;
        musicToggle.textContent = '🔇';
        musicToggle.classList.add('muted');
        console.log('⏸️ Музыка на паузе');
    };
    
    // Toggle music on button click
    musicToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        if (isMusicPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    });
    
    // Try to play immediately and set up fallbacks
    playMusic();
    
    // If autoplay was successful, update state
    bgMusic.addEventListener('play', function() {
        isMusicPlaying = true;
        musicToggle.textContent = '🔊';
        musicToggle.classList.remove('muted');
    });
    
    bgMusic.addEventListener('pause', function() {
        isMusicPlaying = false;
        musicToggle.textContent = '🔇';
        musicToggle.classList.add('muted');
    });
    
    // Fallback: try to play on first user interaction anywhere on page
    const tryAutoplay = function() {
        if (!isMusicPlaying && bgMusic.paused) {
            playMusic();
        }
    };
    
    document.addEventListener('click', tryAutoplay, { once: true });
    document.addEventListener('touchstart', tryAutoplay, { once: true });
    document.addEventListener('keydown', tryAutoplay, { once: true });
    
    // Create falling petals
    createPetals();
    
    // Button click handler
    const acceptBtn = document.getElementById('acceptBtn');
    const thankYou = document.getElementById('thankYou');
    
    acceptBtn.addEventListener('click', function() {
        console.log('🎯 Кнопка нажата!');
        
        // Log button click event
        console.log('📊 Отправляем событие BUTTON_CLICKED...');
        logger.logEvent('BUTTON_CLICKED', {
            message: '💕 ОНА ПРИНЯЛА ИЗВИНЕНИЯ! 💕'
        });
        
        // Add clicked animation
        acceptBtn.classList.add('clicked');
        
        // Hide button and show thank you message
        setTimeout(() => {
            acceptBtn.style.display = 'none';
            thankYou.classList.add('show');
            
            // Create hearts explosion
            createHeartsExplosion();
            
            // Ensure music is playing
            playMusic();
        }, 500);
    });
});

// Function to create falling petals
function createPetals() {
    const container = document.getElementById('petals-container');
    const petalCount = 30;
    
    for (let i = 0; i < petalCount; i++) {
        createPetal(container);
    }
    
    // Continue creating petals periodically
    setInterval(() => {
        createPetal(container);
    }, 800);
}

function createPetal(container) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    
    // Random horizontal position
    petal.style.left = Math.random() * 100 + '%';
    
    // Random animation duration (falling speed)
    const duration = 8 + Math.random() * 7;
    petal.style.animationDuration = duration + 's';
    
    // Random delay
    petal.style.animationDelay = Math.random() * 5 + 's';
    
    // Random size variation
    const size = 10 + Math.random() * 10;
    petal.style.width = size + 'px';
    petal.style.height = size + 'px';
    
    // Random rotation
    petal.style.transform = `rotate(${Math.random() * 360}deg)`;
    
    container.appendChild(petal);
    
    // Remove petal after animation completes
    setTimeout(() => {
        if (petal.parentNode) {
            petal.parentNode.removeChild(petal);
        }
    }, (duration + 5) * 1000);
}

// Function to create hearts explosion
function createHeartsExplosion() {
    const container = document.getElementById('hearts-container');
    const hearts = ['❤️', '💕', '💖', '💗', '💓', '💞', '💝'];
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            
            // Random horizontal position
            heart.style.left = Math.random() * 100 + '%';
            
            // Start from bottom
            heart.style.bottom = '0';
            
            // Random animation duration
            heart.style.animationDuration = (2 + Math.random() * 2) + 's';
            
            container.appendChild(heart);
            
            // Remove heart after animation
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.parentNode.removeChild(heart);
                }
            }, 3000);
        }, i * 100);
    }
}

