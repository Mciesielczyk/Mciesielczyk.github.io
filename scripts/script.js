// script.js
import * as ui from './ui.js';
import * as handlers from './handlers.js';
// Musimy "wypchnąć" funkcje do window, żeby onclick w JSONie je widział
// POPRAWIONE: Przypisujemy funkcje pobrane z modułu handlers
window.showProjectDetails = handlers.showProjectDetails;
window.showSkillDetails = handlers.showSkillDetails;
window.goToProject = handlers.goToProject;
let currentLang = 'pl';

const loadData = async (lang) => {
    try {
        const [config, projects] = await Promise.all([
            fetch(`./data/${lang}/config.json`).then(res => res.json()),
            fetch(`./data/${lang}/projects.json`).then(res => res.json())
        ]);

        ui.renderProfile(config, lang);
        ui.renderSkills(config.skills_groups);
        ui.renderExperience(config.experience, lang);
        ui.renderProjects(projects, lang);

        handlers.initAvatarRotation(config.profile.avatars);

        // Nagłówki sekcji i stałe frazy
        const translations = {
            pl: {
                greeting: "Cześć, jestem",
                about: "O mnie",
                skills: "Stack Technologiczny",
                projects: "Wybrane projekty",
                experience: "Doświadczenie",
                contact: "Kontakt",
                toggleShow: "Pokaż inne doświadczenie",
                toggleHide: "Ukryj inne doświadczenie",
                langBtn: "EN"
            },
            en: {
                greeting: "Hi, I am",
                about: "About Me",
                skills: "Tech Stack",
                projects: "Featured Projects",
                experience: "Experience",
                contact: "Contact",
                toggleShow: "Show other experience",
                toggleHide: "Hide other experience",
                langBtn: "PL"
            }
        };

        const t = translations[lang];

// Mapowanie i18n
        document.querySelector('[data-i18n="greeting"]').textContent = t.greeting;
        document.querySelector('[data-i18n="about-title"]').textContent = t.about;
        document.querySelector('[data-i18n="skills-title"]').textContent = t.skills;
        document.querySelector('[data-i18n="projects-title"]').textContent = t.projects;
        document.querySelector('[data-i18n="experience-title"]').textContent = t.experience;
        document.querySelector('[data-i18n="contact-title"]').textContent = t.contact;

// Obsługa przycisku doświadczenia
        const isExpExpanded = document.getElementById('experience-list-other').classList.contains('show');
        document.getElementById('toggle-other-exp').textContent = isExpExpanded ? t.toggleHide : t.toggleShow;

// Przycisk języka
        document.getElementById('lang-btn').textContent = t.langBtn;

    } catch (err) {
        console.error("Błąd ładowania danych:", err);
    }
};

// Globalne listenery
document.addEventListener('click', (e) => {
    if(e.target.id === 'lang-btn') {
        currentLang = currentLang === 'pl' ? 'en' : 'pl';
        loadData(currentLang);
    }

    if(e.target.id === 'toggle-other-exp') {
        const otherDiv = document.getElementById('experience-list-other');
        const isExpanded = otherDiv.classList.contains('show');
        otherDiv.classList.toggle('show');
        e.target.textContent = currentLang === 'pl'
            ? (isExpanded ? 'Pokaż inne doświadczenia' : 'Ukryj')
            : (isExpanded ? 'Show other experience' : 'Hide other experience');
    }
});

const handleScrollSpy = () => {
    // Lista ID musi być IDENTYCZNA z tym, co masz w HTML i w tej samej kolejności
    const sections = ['about', 'skills', 'projects', 'experience', 'contact'];
    const navItems = document.querySelectorAll('.nav-item');

    let currentSection = sections[0];

    // Sprawdzenie dołu strony (dla sekcji Kontakt)
    const isAtBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100;

    if (isAtBottom) {
        currentSection = 'contact';
    } else {
        sections.forEach(id => {
            const section = document.getElementById(id);
            if (section) {
                const sectionTop = section.offsetTop;
                // Margines 150px, żeby numerek przeskoczył zanim sekcja dotknie samej góry
                if (window.scrollY >= sectionTop - 150) {
                    currentSection = id;
                }
            }
        });
    }

    navItems.forEach(item => {
        item.classList.remove('active');
        // Sprawdzamy czy href (np. "#about") zgadza się z aktualną sekcją
        if (item.getAttribute('href') === `#${currentSection}`) {
            item.classList.add('active');
        }
    });
};

// Listenery
window.addEventListener('scroll', handleScrollSpy);
window.addEventListener('resize', handleScrollSpy); // Dodatkowo przy zmianie wielkości okna
document.addEventListener('DOMContentLoaded', handleScrollSpy);



document.addEventListener('DOMContentLoaded', () => loadData(currentLang));