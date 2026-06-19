document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.view-section');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            navButtons.forEach(b => b.classList.remove('active'));
            sections.forEach(s => s.classList.add('hidden'));

            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.remove('hidden');
            
            if (targetId === 'dashboard') {
                renderTrendGraph();
            }
        });
    });

    const subTabs = document.querySelectorAll('.subsection-tab');
    const subPanels = document.querySelectorAll('.subsection-panel');

    subTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            subTabs.forEach(t => t.classList.remove('active'));
            subPanels.forEach(p => p.classList.add('hidden'));

            tab.classList.add('active');
            const panelId = tab.getAttribute('data-panel');
            document.getElementById(panelId).classList.remove('hidden');
        });
    });

    function renderTrendGraph() {
        const canvas = document.getElementById('trendCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = 250;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const dataPoints = [150.00, 89.99, 45.00, 48.00, 15.50, 4.75, 238.75];
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        
        const maxVal = 250;
        const padding = 40;
        const graphHeight = canvas.height - padding * 2;
        const graphWidth = canvas.width - padding * 2;

        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = padding + (graphHeight / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(canvas.width - padding, y);
            ctx.stroke();
        }

        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';
        ctx.beginPath();

        dataPoints.forEach((val, index) => {
            const x = padding + (graphWidth / (dataPoints.length - 1)) * index;
            const y = canvas.height - padding - (val / maxVal) * graphHeight;
            if (index === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        ctx.fillStyle = '#1e293b';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        dataPoints.forEach((val, index) => {
            const x = padding + (graphWidth / (dataPoints.length - 1)) * index;
            ctx.fillText(days[index], x, canvas.height - 15);
            
            const y = canvas.height - padding - (val / maxVal) * graphHeight;
            ctx.fillStyle = '#059669';
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#1e293b';
        });
    }

    renderTrendGraph();
});
