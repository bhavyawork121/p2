// Manage resume button visibility
function updateResumeVisibility() {
    const globalResume = document.getElementById('global-resume-wrapper');
    if (globalResume) {
        // Show resume on all tabs in interactive mode, hide in minimalist
        const isMinimal = document.body.classList.contains('minimal-mode');
        globalResume.style.display = isMinimal ? 'none' : 'block';
    }
}

// Style Toggle Logic
const styleToggleBtn = document.getElementById('toggle-style');
styleToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('minimal-mode');
    const isMinimal = document.body.classList.contains('minimal-mode');
    styleToggleBtn.textContent = isMinimal ? 'STYLE: MINIMALIST' : 'STYLE: INTERACTIVE';
    
    updateResumeVisibility();

    // Smooth scroll to top when switching to minimalist
    if (isMinimal) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// Minimalist Work Expansion
const workHeaders = document.querySelectorAll('.work-header');
workHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const item = header.closest('.work-item');
        item.classList.toggle('expanded');
    });
});

// Optimized Background Glare tracking
const glare = document.querySelector('.bg-glare');

let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function updateGlare() {
    glare.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(updateGlare);
}

requestAnimationFrame(updateGlare);

// Navigation & Panel Switching
const navItems = document.querySelectorAll('.nav-item');
const panels = document.querySelectorAll('.panel');

// Mode Toggle logic
const toggleBtn = document.getElementById('toggle-scroll');
toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('scrollable');
    const isScrollable = document.body.classList.contains('scrollable');
    toggleBtn.textContent = isScrollable ? 'MODE: SCROLL' : 'MODE: FIXED';
    
    if (isScrollable) {
        // When in scroll mode, reset any hidden panels or transitions
        panels.forEach(p => {
            p.classList.remove('active', 'exit');
        });
    } else {
        // Return to home panel when switching back to fixed
        switchPanel('home');
    }
});

function switchPanel(panelId) {
    updateResumeVisibility();

    if (document.body.classList.contains('scrollable')) {
        // In scroll mode, navigation scrolls to section
        const target = document.getElementById(panelId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Update Nav UI
        navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.panel === panelId);
        });
        return;
    }

    // Update Nav
    navItems.forEach(item => {
        if (item.dataset.panel === panelId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Update Panels
    const currentActive = document.querySelector('.panel.active');
    const nextActive = document.getElementById(panelId);

    if (currentActive === nextActive) return;

    if (currentActive) {
        currentActive.classList.remove('active');
        currentActive.classList.add('exit');
        
        setTimeout(() => {
            currentActive.classList.remove('exit');
        }, 400); // Match CSS transition speed
    }

    nextActive.classList.add('active');
}

navItems.forEach(item => {
    item.addEventListener('click', () => {
        switchPanel(item.dataset.panel);
    });
});

// Typewriter Quote Rotator
const quotes = [
    "This dev really said 'it works on my machine'",
    "Shipping features faster than reading docs",
    "sudo apt-get install confidence",
    "404: Sleep not found"
];

const quoteElement = document.getElementById('typewriter-quote');
let quoteIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function type() {
    const currentQuote = quotes[quoteIndex];
    if (!quoteElement) return;

    if (isDeleting) {
        quoteElement.textContent = currentQuote.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
    } else {
        quoteElement.textContent = currentQuote.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
    }

    if (!isDeleting && charIndex === currentQuote.length) {
        isDeleting = true;
        typeSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        quoteIndex = (quoteIndex + 1) % quotes.length;
        typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
}

// Milestone Data
const milestoneData = {
    "3rd_year": {
        title: "Research Intern: Air Quality & 3D Modeling",
        description: "Currently working under a university professor building IoT-based air quality sensors and complex 3D models. Simultaneously developing 'Collaborate' (https://collaborater.vercel.app) as a standalone decentralized platform.",
        image: null
    },
    "2nd_year": {
        title: "SDE Intern @ SR India",
        description: "Joined SR India as a Software Developer Intern. Architected and launched their corporate website from scratch, managing the full development lifecycle. Concurrently mastered DSA on LeetCode.",
        image: null
    },
    "1st_year": {
        title: "GSSoC, Hacktoberfest & SIH",
        description: "Active contributor to GSSoC and Hacktoberfest (Open Source). Selected for internal Smart India Hackathon (SIH) after placing 4th in a major campus hackathon with a gamified credit-based student portal.",
        image: null
    },
    "init": {
        title: "B.Tech AI/ML @ KR Mangalam University",
        description: "Began specialized B.Tech journey. Entered with a foundation in Python, SQL, and Scratch. Transitioned into low-level engineering with C++ and started exploring diverse CS domains.",
        image: null
    },
    "gfg": {
        title: "GeeksforGeeks Campus Mantri",
        description: "Appointed as the Campus Mantri for GFG. Responsible for fostering a coding culture on campus, organizing tech events, and bridging the gap between students and industry-standard DSA resources.",
        image: null
    },
    "gemini": {
        title: "Gemini Student Ambassador",
        description: "Representing Google's Gemini AI on campus. Focused on exploring LLM capabilities, integrating AI into local projects, and conducting peer learning sessions on the future of generative AI.",
        image: null
    },
    "cybersec": {
        title: "Cyber Security & Network Defense",
        description: "Currently deep-diving into Cyber Security with a focus on Network Security. Exploring packet analysis, firewall configurations, and vulnerability assessment. Built 'Netwatch' as part of this research into low-level network traffic.",
        image: null
    }
};

// Terminal Explorer Logic
const dirItems = document.querySelectorAll('.dir-item');
const fileItems = document.querySelectorAll('.file-item');
const outputContent = document.getElementById('output-content');
let isPrinting = false;

dirItems.forEach(item => {
    item.addEventListener('click', (e) => {
        if (e.target.classList.contains('file-item')) return;
        item.classList.toggle('expanded');
    });
});

fileItems.forEach(file => {
    file.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isPrinting) return;
        
        const milestoneKey = file.dataset.milestone;
        const data = milestoneData[milestoneKey];
        printToTerminal(data);
    });
});

function printToTerminal(data) {
    if (!outputContent) return;
    isPrinting = true;
    outputContent.innerHTML = '';
    
    let titleHtml = `<span class="output-title">${data.title}</span>`;
    let imgHtml = '';
    
    if (data.image) {
        imgHtml = `<div class="terminal-image-container">
                    <img src="${data.image}" class="terminal-img" alt="${data.title}">
                    <p class="img-caption">[ PREVIEW_FILE: ${data.image} ]</p>
                   </div>`;
    }
    
    const description = data.description;
    
    // Show title and image immediately
    outputContent.innerHTML = titleHtml + imgHtml;
    
    // Create a container for text so we can type into it without overwriting img
    const textTarget = document.createElement('div');
    textTarget.className = 'typewritten-desc';
    outputContent.appendChild(textTarget);
    
    // Then, type out the description
    let i = 0;
    const speed = 15;
    
    function typeChar() {
        if (i < description.length) {
            textTarget.innerHTML += description.charAt(i);
            i++;
            setTimeout(typeChar, speed);
        } else {
            isPrinting = false;
        }
    }
    
    typeChar();
}

// Project Card Expansion
const infoToggles = document.querySelectorAll('.info-toggle');

infoToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
        const card = toggle.closest('.project-card');
        card.classList.toggle('expanded');
    });
});

// Resume Dropdown Logic
const resumeTrigger = document.getElementById('resume-trigger');
const resumeMenu = document.getElementById('resume-menu');

if (resumeTrigger && resumeMenu) {
    resumeTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        resumeMenu.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!resumeMenu.contains(e.target) && e.target !== resumeTrigger) {
            resumeMenu.classList.remove('active');
        }
    });
}

// Minimalist Resume Dropdown Logic
const minimalResumeTrigger = document.getElementById('minimal-resume-trigger');
const minimalResumeMenu = document.getElementById('minimal-resume-menu');

if (minimalResumeTrigger && minimalResumeMenu) {
    minimalResumeTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        minimalResumeMenu.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!minimalResumeMenu.contains(e.target) && e.target !== minimalResumeTrigger) {
            minimalResumeMenu.classList.remove('active');
        }
    });
}

// Scroll Spy for Nav highlighting in scroll mode
window.addEventListener('scroll', () => {
    if (!document.body.classList.contains('scrollable')) return;
    
    let current = '';
    panels.forEach(panel => {
        const panelTop = panel.offsetTop;
        if (window.pageYOffset >= (panelTop - 200)) {
            current = panel.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.toggle('active', item.dataset.panel === current);
    });

    // Update resume visibility in scroll mode
    updateResumeVisibility();
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    type();

    // Initial Resume visibility
    updateResumeVisibility();

    // In scroll mode, ensure the first item is active if we're at the top
    if (document.body.classList.contains('scrollable')) {
        navItems.forEach(item => item.classList.remove('active'));
        if (navItems[0]) navItems[0].classList.add('active');
    }

    // Coffee Widget Logic
    const coffeeBtn = document.getElementById('coffee-btn');
    const coffeeCount = document.getElementById('coffee-count');
    const NAMESPACE = 'bhavyawork121_portfolio';
    const KEY = 'reach_v1';
    
    if (coffeeBtn && coffeeCount) {
        let hasClicked = localStorage.getItem('coffee_has_reached') === 'true';

        const formatCount = (num) => {
            if (num <= 50) return num;
            const milestone = Math.floor(num / 50) * 50;
            return milestone + '+';
        };

        const animateCount = (target) => {
            const duration = 1500;
            const startTime = performance.now();

            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                const currentNum = Math.floor(easeProgress * target);
                coffeeCount.textContent = formatCount(currentNum);
                if (progress < 1) requestAnimationFrame(update);
                else coffeeCount.textContent = formatCount(target);
            }
            requestAnimationFrame(update);
        };

        // Fetch global count
        fetch(`https://api.counterapi.dev/v1/${NAMESPACE}/${KEY}`)
            .then(res => res.json())
            .then(data => {
                if (data.count !== undefined) animateCount(data.count);
            })
            .catch(() => {
                coffeeCount.textContent = '0';
            });

        if (hasClicked) {
            coffeeBtn.style.opacity = '0.5';
            coffeeBtn.style.cursor = 'default';
            coffeeBtn.title = "Thanks for your support!";
        }

        coffeeBtn.addEventListener('click', () => {
            if (localStorage.getItem('coffee_has_reached') === 'true') return;

            fetch(`https://api.counterapi.dev/v1/${NAMESPACE}/${KEY}/up`)
                .then(res => res.json())
                .then(data => {
                    if (data.count !== undefined) {
                        coffeeCount.textContent = formatCount(data.count);
                        localStorage.setItem('coffee_has_reached', 'true');
                        
                        coffeeBtn.style.transform = 'scale(1.2) rotate(15deg)';
                        coffeeBtn.style.opacity = '0.5';
                        coffeeBtn.style.cursor = 'default';
                        coffeeBtn.title = "Thanks for your support!";

                        setTimeout(() => {
                            coffeeBtn.style.transform = '';
                        }, 150);
                    }
                });
        });
    }
});
