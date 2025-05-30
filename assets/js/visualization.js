document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const dataPreview = document.getElementById('dataPreview');
    const previewTable = document.getElementById('previewTable');
    const chartContainer = document.getElementById('chartContainer');
    const chartType = document.getElementById('chartType');
    const xAxis = document.getElementById('xAxis');
    const yAxis = document.getElementById('yAxis');
    const generateChartBtn = document.getElementById('generateChart');
    const saveChartBtn = document.getElementById('saveChart');
    const generateReportBtn = document.getElementById('generateReport');
    
    let parsedData = [];
    let chart = null;
    
    // Обработка drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--primary-color)';
        uploadArea.style.backgroundColor = 'var(--primary-light)';
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = 'var(--medium-gray)';
        uploadArea.style.backgroundColor = 'transparent';
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--medium-gray)';
        uploadArea.style.backgroundColor = 'transparent';
        
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            handleFileUpload(e.dataTransfer.files[0]);
        }
    });
    
    uploadArea.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => handleFileUpload(fileInput.files[0]));
    
    function handleFileUpload(file) {
        if (!file) return;
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const content = e.target.result;
            
            if (file.name.endsWith('.csv')) {
                parseCSV(content);
            } else if (file.name.endsWith('.xlsx')) {
                alert('Для работы с Excel файлами используйте CSV экспорт');
            }
        };
        
        reader.readAsText(file);
    }
    
    function parseCSV(content) {
        Papa.parse(content, {
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                parsedData = results.data;
                showDataPreview(results.meta.fields);
            }
        });
    }
    
    function showDataPreview(headers) {
        // Очищаем предыдущие данные
        previewTable.innerHTML = '';
        
        // Создаем заголовок таблицы
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        previewTable.appendChild(thead);
        
        // Заполняем тело таблицы (первые 10 строк)
        const tbody = document.createElement('tbody');
        const rowsToShow = Math.min(10, parsedData.length);
        
        for (let i = 0; i < rowsToShow; i++) {
            const row = document.createElement('tr');
            
            headers.forEach(header => {
                const td = document.createElement('td');
                td.textContent = parsedData[i][header] || '';
                row.appendChild(td);
            });
            
            tbody.appendChild(row);
        }
        
        previewTable.appendChild(tbody);
        dataPreview.style.display = 'block';
        
        // Заполняем выпадающие списки для осей
        fillAxisSelects(headers);
        chartContainer.style.display = 'block';
    }
    
    function fillAxisSelects(headers) {
        xAxis.innerHTML = '';
        yAxis.innerHTML = '';
        
        headers.forEach(header => {
            const optionX = document.createElement('option');
            optionX.value = header;
            optionX.textContent = header;
            xAxis.appendChild(optionX);
            
            const optionY = document.createElement('option');
            optionY.value = header;
            optionY.textContent = header;
            yAxis.appendChild(optionY);
        });
        
        // Выбираем первые два столбца по умолчанию
        if (headers.length >= 2) {
            xAxis.selectedIndex = 0;
            yAxis.selectedIndex = 1;
        }
    }
    
    generateChartBtn.addEventListener('click', generateChart);
    
    function generateChart() {
        const ctx = document.getElementById('dataChart').getContext('2d');
        const selectedX = xAxis.value;
        const selectedY = yAxis.value;
        const type = chartType.value;
        
        if (!selectedX || !selectedY) {
            alert('Выберите данные для осей X и Y');
            return;
        }
        
        // Группируем данные для категориальных графиков
        let labels, datasetData;
        
        if (type === 'pie' || type === 'doughnut') {
            const groupedData = {};
            
            parsedData.forEach(row => {
                const key = row[selectedX];
                const value = parseFloat(row[selectedY]) || 0;
                
                if (groupedData[key]) {
                    groupedData[key] += value;
                } else {
                    groupedData[key] = value;
                }
            });
            
            labels = Object.keys(groupedData);
            datasetData = Object.values(groupedData);
        } else {
            labels = parsedData.map(row => row[selectedX]);
            datasetData = parsedData.map(row => parseFloat(row[selectedY]) || 0);
        }
        
        // Уничтожаем предыдущий график
        if (chart) {
            chart.destroy();
        }
        
        // Создаем новый график
        chart = new Chart(ctx, {
            type: type,
            data: {
                labels: labels,
                datasets: [{
                    label: selectedY,
                    data: datasetData,
                    backgroundColor: getBackgroundColors(type, labels.length),
                    borderColor: type === 'line' ? 'rgba(0, 133, 66, 1)' : undefined,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: `${selectedY} по ${selectedX}`,
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: type === 'line' || type === 'bar' ? {
                    y: {
                        beginAtZero: true
                    }
                } : undefined
            }
        });
    }
    
    function getBackgroundColors(type, count) {
        if (type === 'line' || type === 'bar') {
            return 'rgba(0, 133, 66, 0.6)';
        }
        
        const colors = [
            'rgba(0, 133, 66, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 159, 64, 0.6)'
        ];
        
        return Array(count).fill().map((_, i) => colors[i % colors.length]);
    }
    
    saveChartBtn.addEventListener('click', saveChartAsImage);
    
    function saveChartAsImage() {
        if (!chart) {
            alert('Сначала создайте график');
            return;
        }
        
        const link = document.createElement('a');
        link.download = 'график.png';
        link.href = document.getElementById('dataChart').toDataURL('image/png');
        link.click();
    }
    
    generateReportBtn.addEventListener('click', generateReport);
    
    function generateReport() {
        if (!chart) {
            alert('Сначала создайте график');
            return;
        }
        
        const selectedX = xAxis.value;
        const selectedY = yAxis.value;
        const type = chartType.value;
        
        // Сохраняем данные отчета в sessionStorage для использования на странице отчета
        const chartElement = document.getElementById('dataChart');
if (chartElement && typeof chartElement.toDataURL === 'function') {
    sessionStorage.setItem('reportData', JSON.stringify({
        chartType: type,
        xAxis: selectedX,
        yAxis: selectedY,
        chartImage: chartElement.toDataURL('image/png'),
        dataPreview: Array.from(previewTable.querySelectorAll('tr')).map(row => 
            Array.from(row.querySelectorAll('th, td')).map(cell => cell.textContent)
        )
    }));
} else {
    console.error('Canvas элемент не найден или не поддерживает toDataURL');
}
        // Переходим на страницу отчета
        window.location.href = 'report.html';
    }
});