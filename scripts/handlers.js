// handlers.js
export const initAvatarRotation = (avatars) => {
    const avatarElem = document.getElementById('profile-avatar');
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
};

export const showSkillDetails = (name, details, projects) => {
    const modalTitle = document.getElementById('skillModalTitle');
    const modalBody = document.getElementById('skillModalBody');
    const modalElem = document.getElementById('skillModal');

    modalTitle.textContent = name;

    // Budujemy treść modala
    let content = `<p>${details}</p>`;

    if (projects && projects.length > 0) {
        content += `<hr><p class="small fw-bold">Powiązane projekty:</p><div class="d-flex gap-2 flex-wrap">`;
        projects.forEach(projectId => {
            // Zamieniamy ID na ładniejszą nazwę (np. "car-service" -> "Car Service")
            const displayName = projectId.replace(/-/g, ' ').toUpperCase();
            content += `<button class="btn btn-sm btn-info text-white" onclick="goToProject('${projectId}')">
                            Zobacz: ${displayName} &rarr;
                        </button>`;
        });
        content += `</div>`;
    }

    modalBody.innerHTML = content;

    let myModal = bootstrap.Modal.getOrCreateInstance(modalElem);
    myModal.show();
};


export const goToProject = (projectId) => {
    const modalElem = document.getElementById('skillModal');
    bootstrap.Modal.getOrCreateInstance(modalElem).hide();

    const target = document.getElementById(projectId);
    if (target) {
        setTimeout(() => {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            target.classList.add('project-highlight');
            setTimeout(() => target.classList.remove('project-highlight'), 2000);
        }, 350);
    }
};


export const showProjectDetails = (title, description, link, tech, lang) => {
    const modalTitle = document.getElementById('skillModalTitle');
    const modalBody = document.getElementById('skillModalBody');
    const modalElem = document.getElementById('skillModal');

    // Tłumaczenia etykiet w modalu
    const labels = {
        pl: {
            stack: "Stack technologiczny:",
            button: "Zobacz kod na GitHub"
        },
        en: {
            stack: "Tech Stack:",
            button: "View code on GitHub"
        }
    };

    const currentLabels = labels[lang] || labels.pl;

    modalTitle.textContent = title;
    modalBody.innerHTML = `
        <div class="project-modal-content">
            <p class="mb-4">${description}</p>
            <div class="mb-4">
                <small class="text-secondary d-block mb-2 text-uppercase fw-bold">${currentLabels.stack}</small>
                <p>${tech}</p>
            </div>
            <hr>
            <div class="d-grid">
                <a href="${link}" target="_blank" class="btn btn-info text-white fw-bold">
                    <i class="fab fa-github me-2"></i> ${currentLabels.button} &rarr;
                </a>
            </div>
        </div>
    `;

    const myModal = bootstrap.Modal.getOrCreateInstance(modalElem);
    myModal.show();
};

// Pamiętaj o eksporcie do window
window.showProjectDetails = showProjectDetails;
// Pamiętaj o eksporcie i przypisaniu do window w script.js!
window.showProjectDetails = showProjectDetails;

// Rejestracja globalna
window.showSkillDetails = showSkillDetails;
window.goToProject = goToProject;