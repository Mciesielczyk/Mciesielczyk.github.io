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
            const link = document.createElement('a');
            link.href = item.href;
            link.className = 'contact-item text-decoration-none'; // Dodajemy klasę Bootstrapa wyłączającą podkreślenie
            link.target = item.label === 'In' || item.label === 'Git' ? '_blank' : '_self';

            link.innerHTML = `
                <span class="contact-label">${item.label}:</span>
                <span class="contact-value">${item.value}</span>
            `;
            contactContainer.appendChild(link);
        }
    });
};
export const renderSkills = (skillsGroups) => {
    const container = document.getElementById('skills-container');
    container.innerHTML = '';
    skillsGroups.forEach(group => {
        let groupHtml = `<div class="mb-4">
            <h6 class="skill-group-title mb-2 text-center text-secondary opacity-75">${group.name}</h6>
            <div class="d-flex flex-wrap justify-content-center gap-2">`;

        group.items.forEach(skill => {
            const safeDetails = encodeURIComponent(skill.details);
            // Przekształcamy tablicę projektów w stringa, jeśli istnieje
            const projectsList = skill.projects ? JSON.stringify(skill.projects) : "[]";

            groupHtml += `
        <span class="badge skill-badge" 
              onclick='showSkillDetails("${skill.name}", decodeURIComponent("${safeDetails}"), ${projectsList})' 
              style="cursor: pointer;">
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
        <div class="card p-4 mb-3 border-secondary">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h4 style="color: #00d4ff;" class="mb-0">${exp.role}</h4>
                <span class="badge bg-secondary">${exp.period}</span>
            </div>
            <h5 class="mb-2 text-white-50">${exp.company}</h5>
            <ul class="opacity-75 mb-0">${exp.tasks.map(t => `<li>${t}</li>`).join('')}</ul>
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
        const techBadges = project.tech.map(t => `<span class="badge badge-tech me-1">${t}</span>`).join('');

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