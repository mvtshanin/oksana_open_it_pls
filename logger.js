// Logger - отправка уведомлений о действиях на сайте

// ============================================
// НАСТРОЙКА TELEGRAM
// ============================================
const TELEGRAM_BOT_TOKEN = '8330558748:AAG4Gk2ANhrzf89VmrNbF3fai6eSwmw4pZk';
const TELEGRAM_CHAT_ID = '635452296';

// ============================================

class Logger {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.startTime = new Date();
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getDeviceInfo() {
        return {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screenSize: `${screen.width}x${screen.height}`,
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        };
    }

    async logEvent(eventType, eventData = {}) {
        const timestamp = new Date();
        const deviceInfo = this.getDeviceInfo();
        
        const logData = {
            eventType,
            timestamp: timestamp.toLocaleString('ru-RU'),
            sessionId: this.sessionId,
            timeOnSite: Math.round((timestamp - this.startTime) / 1000), // секунды
            device: deviceInfo,
            ...eventData
        };

        // Логируем в консоль
        console.log('📊 Event logged:', logData);

        // Отправляем уведомление в Telegram
        await this.sendTelegramNotification(logData);
    }

    async sendTelegramNotification(logData) {
        const message = this.formatTelegramMessage(logData);
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

        try {
            await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: message,
                    parse_mode: 'HTML'
                })
            });
            console.log('✅ Уведомление отправлено в Telegram');
        } catch (error) {
            console.error('❌ Ошибка отправки в Telegram:', error);
        }
    }

    formatTelegramMessage(logData) {
        const emoji = logData.eventType === 'SITE_OPENED' ? '👀' : 
                     logData.eventType === 'BUTTON_CLICKED' ? '💕' : '📊';
        
        const eventName = logData.eventType === 'SITE_OPENED' ? 'Сайт открыт!' : 
                         logData.eventType === 'BUTTON_CLICKED' ? '❤️ ОНА ПРИНЯЛА ИЗВИНЕНИЯ! ❤️' : 
                         logData.eventType;

        const deviceType = logData.device.isMobile ? '📱 Мобильное' : '💻 Десктоп';

        return `${emoji} <b>${eventName}</b>\n\n` +
               `🕒 Время: ${logData.timestamp}\n` +
               `⏱️ На сайте: ${logData.timeOnSite} сек\n` +
               `${deviceType} устройство\n` +
               `📱 Платформа: ${logData.device.platform}\n` +
               `🖥️ Экран: ${logData.device.screenSize}\n` +
               `🌐 Язык: ${logData.device.language}\n` +
               `🔑 Сессия: ${logData.sessionId.substr(0, 20)}...`;
    }
}

// Экспорт для использования в других файлах
window.Logger = Logger;

