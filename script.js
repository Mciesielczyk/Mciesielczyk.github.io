let currentLang = 'pl';

const loadData = (lang) => {
    Promise.all([
        fetch(`./data/${lang}/config.json`).then(res => res.json()),
        fetch(`./data/${lang}/projects.json`).then(res => res.json())
    ])
        .then(([config, projects]) => {
            // 1. DANE PROFILOWE
            document.getElementById('header-name').textContent = config.profile.name;
            document.getElementById('header-role').textContent = config.profile.role;
            document.getElementById('about-description').textContent = config.about.description;
            document.getElementById('contact-email').textContent = `📧 ${config.profile.email}`;
            document.getElementById('linkedin-link').href = config.profile.linkedin;

            // 2. AWATAR
            const avatarElem = document.getElementById('profile-avatar');
            const avatars = config.profile.avatars;
            if (window.avatarInterval) clearInterval(window.avatarInterval);
            if (avatars && avatars.length > 0) {
                avatarElem.src = avatars[0];
                let currentIdx = 0;
                if (avatars.length > 1) {
                    window.avatarInterval = setInterval(() => {
                        avatarElem.classList.add('fade-out');
                        setTimeout(() => {
                            currentIdx = (currentIdx + 1) % avatars.length;
                            avatarElem.src = avatars[currentIdx];
                            avatarElem.classList.remove('fade-out');
                        }, 500);
                    }, 4000);
                }
            }

            // 3. SKILLE (POPRAWIONE GENEROWANIE)
            const skillsContainer = document.getElementById('skills-container');
            skillsContainer.innerHTML = '';
            config.skills_groups.forEach(group => {
                let groupHtml = `<div class="mb-4">
                <h6 class="skill-group-title mb-2 text-center text-secondary opacity-75">${group.name}</h6>
                <div class="d-flex flex-wrap justify-content-center gap-2">`;

                group.items.forEach(skill => {
                    // Używamy encodeURIComponent, żeby znaki specjalne w opisie nie psuły HTMLa
                    const safeDetails = encodeURIComponent(skill.details);
                    groupHtml += `
                    <span class="badge skill-badge" 
                          onclick="showSkillDetails('${skill.name}', decodeURIComponent('${safeDetails}'))"
                          style="cursor: pointer;"> 
                        ${skill.name}
                    </span>`;
                });
                groupHtml += `</div></div>`;
                skillsContainer.innerHTML += groupHtml;
            });

            // 4. DOŚWIADCZENIE
            const itExpContainer = document.getElementById('experience-list-it');
            const otherExpContainer = document.getElementById('experience-list-other');
            const toggleBtn = document.getElementById('toggle-other-exp');

            itExpContainer.innerHTML = '';
            otherExpContainer.innerHTML = '';

            const itJobs = config.experience.filter(e => e.category === 'it');
            const otherJobs = config.experience.filter(e => e.category === 'other');

            const createExpCard = (exp) => `
            <div class="card p-4 mb-3 border-secondary">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h4 style="color: #00d4ff;" class="mb-0">${exp.role}</h4>
                    <span class="badge bg-secondary">${exp.period}</span>
                </div>
                <h5 class="mb-2 text-white-50">${exp.company}</h5>
                <ul class="opacity-75 mb-0">${exp.tasks.map(t => `<li>${t}</li>`).join('')}</ul>
            </div>`;

            itJobs.forEach(job => itExpContainer.innerHTML += createExpCard(job));
            otherJobs.forEach(job => otherExpContainer.innerHTML += createExpCard(job));

            if (otherJobs.length > 0) {
                toggleBtn.style.display = 'inline-block';
                // Nie nadpisujemy całego tekstu, jeśli chcemy zachować stan (Pokaż/Ukryj)
                const isExpanded = document.getElementById('experience-list-other').classList.contains('show');
                if(!isExpanded) {
                    toggleBtn.textContent = lang === 'pl' ? 'Pokaż inne doświadczenie' : 'Show other experience';
                }
            } else {
                toggleBtn.style.display = 'none';
            }

            // 5. PROJEKTY
            const projectsContainer = document.getElementById('projects-container');
            projectsContainer.innerHTML = '';
            projects.forEach(project => {
                const techBadges = project.tech.map(t => `<span class="badge badge-tech me-1">${t}</span>`).join('');
                projectsContainer.innerHTML += `
            <div class="col-md-6 col-lg-4">
                <div class="card h-100 p-3">
                    <img src="${project.image}" class="card-img-top rounded mb-3" onerror="this.src='https://placehold.co/400x200?text=Project'">
                    <div class="card-body d-flex flex-column">
                        <div class="mb-2">${techBadges}</div>
                        <h5 class="card-title fw-bold">${project.title}</h5>
                        <p class="card-text small opacity-75">${project.description}</p>
                        <a href="${project.link}" class="btn btn-outline-info btn-sm mt-auto" target="_blank">
                            ${lang === 'pl' ? 'Zobacz kod' : 'View code'} &rarr;
                        </a>
                    </div>
                </div>
            </div>`;
            });

            // 6. TŁUMACZENIE NAGŁÓWKÓW
            document.querySelector('#about h2').textContent = lang === 'pl' ? 'O mnie' : 'About Me';
            document.querySelector('#projects h2').textContent = lang === 'pl' ? 'Wybrane projekty' : 'Featured Projects';
            document.querySelector('#contact h2').textContent = lang === 'pl' ? 'Kontakt' : 'Contact';
            const expHeader = document.querySelector('#experience h2');
            if(expHeader) expHeader.textContent = lang === 'pl' ? 'Doświadczenie' : 'Experience';

            // 7. AKTUALIZACJA PRZYCISKU JĘZYKA
            const langBtn = document.getElementById('lang-btn');
            if(langBtn) langBtn.textContent = lang === 'pl' ? 'EN' : 'PL';
        })
        .catch(err => console.error("Błąd ładowania danych:", err));
};

// OBSŁUGA PRZYCISKU ZMIANY JĘZYKA
document.addEventListener('click', (e) => {
    if(e.target && e.target.id === 'lang-btn') {
        currentLang = currentLang === 'pl' ? 'en' : 'pl';
        loadData(currentLang);
    }
});

// OBSŁUGA PRZYCISKU "POKAŻ INNE"
document.addEventListener('click', (e) => {
    if(e.target && e.target.id === 'toggle-other-exp') {
        const otherDiv = document.getElementById('experience-list-other');
        const isExpanded = otherDiv.classList.contains('show');
        if (isExpanded) {
            otherDiv.classList.remove('show');
            e.target.textContent = currentLang === 'pl' ? 'Pokaż inne doświadczenie' : 'Show other experience';
        } else {
            otherDiv.classList.add('show');
            e.target.textContent = currentLang === 'pl' ? 'Ukryj inne doświadczenie' : 'Hide other experience';
        }
    }
});

// START
document.addEventListener('DOMContentLoaded', () => {
    loadData(currentLang);
});

// FUNKCJA MODALA (GLOBALNA)
window.showSkillDetails = (name, details) => {
    const modalTitle = document.getElementById('skillModalTitle');
    const modalBody = document.getElementById('skillModalBody');
    const modalElem = document.getElementById('skillModal');

    if (modalTitle && modalBody && modalElem) {
        modalTitle.textContent = name;
        modalBody.textContent = details;

        // Sprawdzamy, czy obiekt bootstrap na pewno istnieje
        if (typeof bootstrap !== 'undefined') {
            const myModal = new bootstrap.Modal(modalElem);
            myModal.show();
        } else {
            console.error("Błąd: Biblioteka Bootstrap nie została załadowana!");
            // Opcjonalnie: prosty alert, jeśli modal nie zadziała
            alert(name + ": " + details);
        }
    }
};