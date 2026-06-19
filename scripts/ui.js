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
});
