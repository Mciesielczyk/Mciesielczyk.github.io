export const renderProfile = (config, lang) => {
    document.getElementById('header-name').textContent = config.profile.name;
    document.getElementById('header-role').textContent = config.profile.role;
    document.getElementById('about-description').textContent = config.about.description;

    const contactContainer = document.querySelector('.contact-details');
    contactContainer.innerHTML = ''; // Czyścimy wszystko, żeby zbudować od nowa

    const contactData = [
        { label: 'Email', value: config.profile.email, href: `mailto:${config.profile.email}` },
        { label: lang === 'pl' ? 'Tel' : 'Phone', value: config.profile.phone, href: `tel:${config.profile.phone.replace(/\s/g, '')}` },
        { label: 'Linkedin', value: `${config.profile.name} ${config.profile.surname}`, href: config.profile.linkedin },
        { label: 'GitHub', value: config.profile.github_username, href: `https://github.com/${config.profile.github_username}` },
        {label: lang === 'pl' ? 'Miasto' : 'City', value: config.profile.city}

    ];

    contactData.forEach(item => {
        if (item.value) {
            // Sprawdzamy, czy to miasto (zakładam, że label to 'City' lub 'Miasto')
            const isCity = item.label === 'City' || item.label === 'Miasto';

            // Tworzymy 'div' dla miasta, a 'a' dla reszty
            const element = document.createElement(isCity ? 'div' : 'a');

            element.className = 'contact-item text-decoration-none';

            if (!isCity) {
                element.href = item.href;
                element.target = (item.label === 'In' || item.label === 'Git') ? '_blank' : '_self';
            } else {
                element.classList.add('no-click'); // Opcjonalna klasa do CSS
            }

            element.innerHTML = `
            <span class="contact-label">${item.label}:</span>
            <span class="contact-value">${item.value}</span>
        `;

            contactContainer.appendChild(element);
        }
    });
};
export const renderSkills = (skillsGroups, lang) => {
    const container = document.getElementById('skills-container');
    if (!container) return;
    container.innerHTML = '';

    skillsGroups.forEach(group => {
        let groupHtml = `
            <div class="skill-group-box mb-4">
                <h6 class="skill-group-title">${group.name}</h6>
                <div class="skills-wrapper">`;

        group.items.forEach((skill, index) => {
            const safeDetails = encodeURIComponent(skill.details);
            // Przetwarzamy tablicę projektów na bezpieczny ciąg znaków dla HTML
            const projectsList = skill.projects ? JSON.stringify(skill.projects).replace(/"/g, '&quot;') : "[]";
            const delay = (index * 0.2).toFixed(1);

            groupHtml += `
                <span class="badge skill-badge floating-skill" 
                      style="animation-delay: ${delay}s; cursor: pointer;"
                      onclick="showSkillDetails('${skill.name}', decodeURIComponent('${safeDetails}'), ${projectsList}, '${lang}')">
                      ${skill.name}
                </span>`;
        });
        groupHtml += `</div></div>`;
        container.innerHTML += groupHtml;
    });
};
export const renderExperience = (experience, lang) => {
    const itContainer = document.getElementById('experience-list-it');
    const otherContainer = document.getElementById('experience-list-other');
    const toggleBtn = document.getElementById('toggle-other-exp');

    itContainer.innerHTML = '';
    otherContainer.innerHTML = '';

    const itJobs = experience.filter(e => e.category === 'it');
    const otherJobs = experience.filter(e => e.category === 'other');
    const cardTemplate = (exp) => `
    <div class="card p-4 mb-3">
        <div class="d-flex justify-content-between align-items-center mb-2">
            <h4 class="experience-role mb-0">${exp.role}</h4>
            <span class="badge experience-period">${exp.period}</span>
        </div>
        <h5 class="experience-company mb-2">${exp.company}</h5>
        <ul class="experience-tasks mb-0">${exp.tasks.map(t => `<li>${t}</li>`).join('')}</ul>
    </div>`;

    itJobs.forEach(job => itContainer.innerHTML += cardTemplate(job));
    otherJobs.forEach(job => otherContainer.innerHTML += cardTemplate(job));

    toggleBtn.style.display = otherJobs.length > 0 ? 'inline-block' : 'none';
    if(otherJobs.length > 0) {
        const isExpanded = otherContainer.classList.contains('show');
        if(!isExpanded) toggleBtn.textContent = lang === 'pl' ? 'Pokaż inne doświadczenie' : 'Show other experience';
    }
};

export const renderProjects = (projects, lang) => {
    const container = document.getElementById('projects-container');
    if (!container) return;
    container.innerHTML = '';

    projects.forEach(project => {
// Zmieniamy na czystą klasę, którą ostylujemy w CSS
        const techBadges = project.tech.map(t => `<span class="badge tech-badge">${t}</span>`).join('');
        const safeDesc = encodeURIComponent(project.description);
        const safeTech = encodeURIComponent(project.tech.join(', '));
        const safeTitle = encodeURIComponent(project.title);

        container.innerHTML += `
            <div class="col-md-6 col-lg-4" id="${project.id}"> 
                <div class="card h-100 p-0 overflow-hidden shadow-sm project-card" 
                     onclick="showProjectDetails(decodeURIComponent('${safeTitle}'), decodeURIComponent('${safeDesc}'), '${project.link}', decodeURIComponent('${safeTech}'), '${lang}')"
                     style="cursor: pointer;">
                    <img src="${project.image}" class="card-img-top" onerror="this.src='https://placehold.co/400x200?text=Project'">
                    <div class="card-body">
                        <h5 class="card-title fw-bold mb-2">${project.title}</h5>
                        <div class="mb-0">${techBadges}</div>
                    </div>
                </div>
            </div>`;
    });
};