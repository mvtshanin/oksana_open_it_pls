#!/bin/bash

# Скрипт для быстрой загрузки на GitHub
# Использование: ./deploy-to-github.sh

echo "🚀 Подготовка к загрузке на GitHub..."
echo ""

# Проверка, установлен ли git
if ! command -v git &> /dev/null; then
    echo "❌ Git не установлен!"
    echo "Установите git командой: sudo apt install git"
    exit 1
fi

# Инициализация git (если еще не инициализирован)
if [ ! -d ".git" ]; then
    echo "📦 Инициализация Git репозитория..."
    git init
    echo "✅ Git инициализирован"
else
    echo "✅ Git уже инициализирован"
fi

# Добавление всех файлов
echo ""
echo "📁 Добавление файлов..."
git add .

# Создание коммита
echo ""
echo "💾 Создание коммита..."
git commit -m "Initial commit: Romantic apology website for Oksana 💕"

# Запрос информации о репозитории
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 ИНСТРУКЦИЯ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Перейдите на https://github.com/new"
echo "2. Создайте новый публичный репозиторий"
echo "3. Скопируйте URL репозитория"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
read -p "Введите URL вашего GitHub репозитория: " repo_url

if [ -z "$repo_url" ]; then
    echo "❌ URL не указан!"
    exit 1
fi

# Добавление remote
echo ""
echo "🔗 Подключение к GitHub..."
git remote remove origin 2>/dev/null
git remote add origin "$repo_url"

# Переименование ветки в main
git branch -M main

# Загрузка на GitHub
echo ""
echo "⬆️  Загрузка файлов на GitHub..."
git push -u origin main

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ УСПЕШНО ЗАГРУЖЕНО!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Следующие шаги:"
echo ""
echo "1. Перейдите в Settings вашего репозитория"
echo "2. Найдите раздел 'Pages' в боковом меню"
echo "3. В разделе 'Source' выберите:"
echo "   - Branch: main"
echo "   - Folder: / (root)"
echo "4. Нажмите 'Save'"
echo "5. Подождите 1-2 минуты"
echo ""
echo "🌐 Ваш сайт будет доступен по адресу:"
echo "   https://ваш-username.github.io/название-репо/"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💕 Удачи!"

