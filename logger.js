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
        console.log('🚀 Начинаем отправку в Telegram...');
        console.log('📝 Данные для отправки:', logData);
        
        const message = this.formatTelegramMessage(logData);
        console.log('💬 Сформированное сообщение:', message);
        
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        console.log('🌐 URL для отправки:', url.substring(0, 50) + '...');

        try {
            console.log('📡 Отправляем fetch запрос...');
            
            const response = await fetch(url, {
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
            
            console.log('📥 Получен ответ от Telegram, статус:', response.status);
            
            const data = await response.json();
            console.log('📊 Ответ от Telegram API:', data);
            
            if (data.ok) {
                console.log('✅ УСПЕХ! Уведомление отправлено в Telegram');
                console.log('📬 Message ID:', data.result.message_id);
            } else {
                console.error('❌ Telegram API вернул ошибку:', data);
                console.error('Код ошибки:', data.error_code);
                console.error('Описание:', data.description);
            }
        } catch (error) {
            console.error('❌ Ошибка при отправке в Telegram:', error);
            console.error('Тип ошибки:', error.name);
            console.error('Сообщение:', error.message);
            console.error('Стек:', error.stack);
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

