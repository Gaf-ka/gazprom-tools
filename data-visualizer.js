function initDataVisualizer() {
    let chart = null;
    let currentData = null;
    
    document.getElementById('data-file').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            processFile(e.target.result, file.name);
        };
        
        if (file.name.endsWith('.csv')) {
            reader.readAsText(file);
        } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
            reader.readAsArrayBuffer(file);
        } else {
            alert('Неподдерживаемый формат файла');
        }
    });
    
    document.getElementById('generate-chart').addEventListener('click', function() {
        if (!currentData) {
            alert('Сначала загрузите данные');
            return;
        }
        
        const chartType = document.getElementById('chart-type').value;
        renderChart(chartType);
    });
    
    document.getElementById('save-chart').addEventListener('click', function() {
        if (!chart) {
            alert('Нет диаграммы для сохранения');
            return;
        }
        
        const link = document.createElement('a');
        link.download = 'диаграмма.png';
        link.href = document.getElementById('data-chart').toDataURL('image/png');
        link.click();
    });
    
    document.getElementById('generate-report').addEventListener('click', function() {
        if (!chart) {
            alert('Нет диаграммы для отчёта');
            return;
        }
        
        generateReport();
    });
}

function processFile(data, fileName) {
    try {
        if (fileName.endsWith('.csv')) {
            const results = Papa.parse(data, {
                header: true,
                skipEmptyLines: true
            });
            
            if (results.errors.length > 0) {
                throw new Error('Ошибка парсинга CSV');
            }
            
            currentData = results.data;
            showDataPreview(currentData);
        } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
            const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
            
            if (jsonData.length < 2) {
                throw new Error('Файл Excel пуст или содержит только заголовки');
            }
            
            const headers = jsonData[0];
            const rows = jsonData.slice(1);
            
            currentData = rows.map(row => {
                const obj = {};
                headers.forEach((header, i) => {
                    obj[header] = row[i];
                });
                return obj;
            });
            
            showDataPreview(currentData);
        }
    } catch (error) {
        console.error(error);
        alert('Ошибка обработки файла: ' + error.message);
    }
}

function showDataPreview(data) {
    const preview = document.createElement('div');
    preview.innerHTML = `
        <h4>Предпросмотр данных (первые 5 строк):</h4>
        <div class="table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        ${Object.keys(data[0]).map(key => `<th>${key}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${data.slice(0, 5).map(row => `
                        <tr>
                            ${Object.values(row).map(val => `<td>${val}</td>`).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        <p>Всего строк: ${data.length}</p>
    `;
    
    const container = document.querySelector('.data-upload-container');
    const existingPreview = container.querySelector('.data-preview');
    if (existingPreview) {
        container.replaceChild(preview, existingPreview);
    } else {
        preview.classList.add('data-preview');
        container.appendChild(preview);
    }
}

function renderChart(type) {
    const ctx = document.getElementById('data-chart').getContext('2d');
    
    if (chart) {
        chart.destroy();
    }
    
    const numericColumns = findNumericColumns(currentData);
    
    if (numericColumns.length < 2) {
        alert('Недостаточно числовых данных для построения диаграммы');
        return;
    }
    
    const labels = currentData.map(row => row[numericColumns[0]]);
    const dataValues = currentData.map(row => parseFloat(row[numericColumns[1]]));
    
    chart = new Chart(ctx, {
        type: type,
        data: {
            labels: labels,
            datasets: [{
                label: numericColumns[1],
                data: dataValues,
                backgroundColor: generateColors(dataValues.length, type),
                borderColor: '#0481d9',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Визуализация данных',
                    font: {
                        size: 18
                    }
                },
                legend: {
                    position: 'bottom'
                }
            },
            scales: type === 'bar' || type === 'line' ? {
                y: {
                    beginAtZero: true
                }
            } : {}
        }
    });
}

function findNumericColumns(data) {
    if (!data || data.length === 0) return [];
    
    const firstRow = data[0];
    return Object.keys(firstRow).filter(key => {
        const value = firstRow[key];
        return !isNaN(parseFloat(value)) && isFinite(value);
    });
}

function generateColors(count, type) {
    if (type === 'pie' || type === 'doughnut') {
        const colors = [];
        const hueStep = 360 / count;
        
        for (let i = 0; i < count; i++) {
            const hue = i * hueStep;
            colors.push(`hsl(${hue}, 70%, 60%)`);
        }
        
        return colors;
    } else {
        return ['rgba(4, 129, 217, 0.7)'];
    }
}

function generateReport() {
    const chartCanvas = document.getElementById('data-chart');
    const chartImage = chartCanvas.toDataURL('image/png');
    
    const numericColumns = findNumericColumns(currentData);
    const analysis = analyzeData(currentData, numericColumns[1]);
    
    const reportHTML = `
        <div class="report">
            <h3>Аналитический отчёт</h3>
            <p class="report-date">Дата создания: ${new Date().toLocaleDateString('ru-RU')}</p>
            
            <div class="report-image">
                <img src="${chartImage}" alt="Диаграмма данных">
            </div>
            
            <div class="report-analysis">
                <h4>Анализ данных:</h4>
                <p>Колонка "${numericColumns[1]}" содержит следующие статистические показатели:</p>
                <ul>
                    <li>Количество значений: ${analysis.count}</li>
                    <li>Среднее значение: ${analysis.mean.toFixed(2)}</li>
                    <li>Минимальное значение: ${analysis.min.toFixed(2)}</li>
                    <li>Максимальное значение: ${analysis.max.toFixed(2)}</li>
                    <li>Медиана: ${analysis.median.toFixed(2)}</li>
                </ul>
                
                <h4>Выводы:</h4>
                <p>На основании представленных данных можно сделать следующие выводы:</p>
                <ul>
                    <li>Диапазон значений составляет от ${analysis.min.toFixed(2)} до ${analysis.max.toFixed(2)}.</li>
                    <li>Среднее значение показателя - ${analysis.mean.toFixed(2)}.</li>
                    ${analysis.trend === 'up' ? 
                        '<li>Наблюдается положительная динамика значений.</li>' : 
                        analysis.trend === 'down' ? 
                        '<li>Наблюдается отрицательная динамика значений.</li>' : 
                        '<li>Явной тенденции к росту или снижению не наблюдается.</li>'}
                </ul>
            </div>
            
            <div class="report-actions">
                <button id="save-report" class="btn btn-primary"><i class="fas fa-download"></i> Сохранить отчёт</button>
            </div>
        </div>
    `;
    
    document.getElementById('report-output').innerHTML = reportHTML;
    
    document.getElementById('save-report').addEventListener('click', function() {
        const reportContent = document.querySelector('.report').outerHTML;
        const blob = new Blob([reportContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'аналитический_отчёт.html';
        link.click();
        
        URL.revokeObjectURL(url);
    });
}

function analyzeData(data, column) {
    const values = data.map(row => parseFloat(row[column])).filter(v => !isNaN(v));
    values.sort((a, b) => a - b);
    
    const sum = values.reduce((a, b) => a + b, 0);
    const mean = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    let median;
    if (values.length % 2 === 0) {
        median = (values[values.length/2 - 1] + values[values.length/2]) / 2;
    } else {
        median = values[Math.floor(values.length/2)];
    }
    
    let trend = 'stable';
    if (values.length > 1) {
        const first = values[0];
        const last = values[values.length - 1];
        const diff = last - first;
        
        if (diff > 0.1 * Math.abs(first)) trend = 'up';
        else if (diff < -0.1 * Math.abs(first)) trend = 'down';
    }
    
    return {
        count: values.length,
        mean,
        min,
        max,
        median,
        trend
    };
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', initDataVisualizer);