const fs = require('fs');
const path = require('path');

// Конфигурация
const BASE_TAG = '<base href="/warm-rays-magazine/"/>';
const START_DIR = process.cwd(); // Начинаем с текущей директории
const FILE_EXTENSIONS = ['.html', '.htm']; // Ищем файлы с этими расширениями

let filesProcessed = 0;
let tagsRemoved = 0;

function processDirectory(dirPath) {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            // Рекурсивно обрабатываем поддиректории
            processDirectory(fullPath);
        } else if (FILE_EXTENSIONS.includes(path.extname(item).toLowerCase())) {
            // Обрабатываем HTML-файлы
            processHtmlFile(fullPath);
        }
    }
}

function processHtmlFile(filePath) {
    filesProcessed++;
    
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const originalLength = content.length;
        
        // Удаляем все вхождения BASE_TAG
        content = content.replace(new RegExp(BASE_TAG, 'g'), '');
        
        // Проверяем, были ли изменения
        if (content.length !== originalLength) {
            tagsRemoved++;
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Removed base tag from: ${filePath}`);
        }
    } catch (error) {
        console.error(`Error processing ${filePath}: ${error.message}`);
    }
}

// Запускаем обработку
console.log('Starting base tag removal...');
processDirectory(START_DIR);
console.log(`\nProcessed ${filesProcessed} HTML files`);
console.log(`Removed ${tagsRemoved} base tags`);