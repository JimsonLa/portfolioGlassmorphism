// VisionOS Glassmorphism Portfolio JavaScript

// Attendre que le DOM (structure HTML) soit complètement chargé avant d'exécuter le code
document.addEventListener('DOMContentLoaded', () => {
    // Initialise toutes les fonctionnalités interactives du site
    initParallaxEffect();       // Effet de parallaxe sur les formes d'arrière-plan
    initScrollReveal();         // Animation d'apparition des éléments au défilement
    initContactForm();          // Gestion du formulaire de contact
    initCursorEffect();         // Curseur personnalisé qui suit la souris
    initProjectHover();         // Effets au survol des projets
    initMobileNav();            // Navigation mobile (menu hamburger)
});

// Effet de parallaxe - fait bouger les formes d'arrière-plan en fonction du mouvement de la souris
function initParallaxEffect() {
    // Sélectionne toutes les formes floues d'arrière-plan
    const shapes = document.querySelectorAll('.blur-shape');
    
    // Ajoute un écouteur d'événement pour suivre les mouvements de la souris
    window.addEventListener('mousemove', (e) => {
        // Calcule la position relative de la souris dans la fenêtre (entre 0 et 1)
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        // Applique un déplacement à chaque forme avec une vitesse différente
        shapes.forEach((shape, index) => {
            // Chaque forme a une vitesse légèrement différente (plus lente pour les formes plus lointaines)
            const speed = 0.05 - (index * 0.01);
            const xOffset = -30 + (x * 60);  // Calcule le déplacement horizontal
            const yOffset = -30 + (y * 60);  // Calcule le déplacement vertical
            
            // Applique la transformation à la forme
            shape.style.transform = `translate(${xOffset * speed}px, ${yOffset * speed}px)`;
        });
    });
}

// Animation des éléments lors du défilement de la page
function initScrollReveal() {
    // Sélectionne toutes les sections et cartes qui seront animées
    const sections = document.querySelectorAll('section');
    const cards = document.querySelectorAll('.glass-card, .glass-info-card');
    
    // Options pour l'observateur d'intersection
    const revealOptions = {
        threshold: 0.1,                // Déclenche quand 10% de l'élément est visible
        rootMargin: "0px 0px -100px 0px" // Marge négative en bas pour déclencher un peu plus tôt
    };
    
    // Crée un observateur pour les sections
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Si la section entre dans la vue, ajoute la classe pour l'animation
                entry.target.classList.add('revealed');
                // Arrête d'observer cet élément (l'animation ne se produit qu'une fois)
                sectionObserver.unobserve(entry.target);
            }
        });
    }, revealOptions);
    
    // Crée un observateur pour les cartes, avec un délai progressif
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Ajoute un délai progressif pour créer un effet d'apparition en cascade
                const delay = Array.from(cards).indexOf(entry.target) * 0.1;
                entry.target.style.transitionDelay = `${delay}s`;
                entry.target.classList.add('revealed');
                cardObserver.unobserve(entry.target);
            }
        });
    }, revealOptions);
    
    // Ajoute la classe fade-in et commence à observer chaque section
    sections.forEach(section => {
        section.classList.add('fade-in');
        sectionObserver.observe(section);
    });
    
    // Ajoute la classe fade-in et commence à observer chaque carte
    cards.forEach(card => {
        card.classList.add('fade-in');
        cardObserver.observe(card);
    });
    
    // Ajoute dynamiquement le CSS pour les animations d'apparition
    const style = document.createElement('style');
    style.textContent = `
        .fade-in {
            opacity: 0;                          /* Commence invisible */
            transform: translateY(30px);         /* Commence en dessous de sa position finale */
            transition: opacity 0.8s ease, transform 0.8s ease; /* Animation douce */
        }
        .fade-in.revealed {
            opacity: 1;                          /* Devient complètement visible */
            transform: translateY(0);            /* Remonte à sa position normale */
        }
    `;
    document.head.appendChild(style);
}

// Curseur personnalisé qui suit le curseur de la souris
function initCursorEffect() {
    // Détection d'appareil mobile - désactive le curseur personnalisé sur mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    
    if (isMobile) {
        return; // Ne pas initialiser le curseur personnalisé sur mobile
    }
    
    // Crée l'élément du curseur principal (petit point)
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    // Crée l'élément du contour du curseur (cercle plus grand)
    const cursorOutline = document.createElement('div');
    cursorOutline.className = 'cursor-outline';
    document.body.appendChild(cursorOutline);
    
    // Ajoute dynamiquement les styles CSS pour le curseur personnalisé
    const style = document.createElement('style');
    style.textContent = `
        .custom-cursor {
            width: 10px;
            height: 10px;
            background-color: var(--primary-color);
            border-radius: 50%;                  /* Forme circulaire */
            position: fixed;                     /* Reste à sa position même en défilement */
            top: 0;
            left: 0;
            pointer-events: none;                /* Ne bloque pas les clics */
            z-index: 9999;                       /* S'affiche au-dessus de tout */
            opacity: 0.8;
            transform: translate(-50%, -50%);    /* Centre le curseur sur le point exact */
            transition: width 0.2s, height 0.2s, opacity 0.2s; /* Animation douce */
        }
        
        .cursor-outline {
            width: 40px;
            height: 40px;
            border: 1px solid var(--primary-color);
            border-radius: 50%;
            position: fixed;
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: 9998;                       /* Juste en dessous du curseur principal */
            opacity: 0.3;
            transform: translate(-50%, -50%);
            transition: width 0.3s, height 0.3s, border-color 0.3s;
        }
        
        @media (hover: hover) {
            a, button, input, textarea, .glass-card, .glass-btn, .skill-pill {
                cursor: none !important;         /* Cache le curseur par défaut sur éléments interactifs */
            }
        }
        
        a:hover ~ .cursor-outline,
        button:hover ~ .cursor-outline,
        .glass-card:hover ~ .cursor-outline,
        .glass-btn:hover ~ .cursor-outline,
        .skill-pill:hover ~ .cursor-outline {
            width: 60px;                         /* Agrandit le contour au survol */
            height: 60px;
            border-color: var(--secondary-color); /* Change la couleur du contour */
        }
    `;
    document.head.appendChild(style);
    
    // Fait suivre le curseur principal immédiatement le mouvement de la souris
    document.addEventListener('mousemove', (e) => {
        // Positionne le curseur principal exactement où se trouve la souris
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        // Le contour suit avec un léger délai pour un effet plus fluide
        setTimeout(() => {
            cursorOutline.style.left = e.clientX + 'px';
            cursorOutline.style.top = e.clientY + 'px';
        }, 50);
    });
    
    // Effets de survol sur les éléments interactifs
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .glass-card, .glass-btn, .skill-pill');
    
    interactiveElements.forEach(el => {
        // Au survol d'un élément interactif
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '20px';              // Agrandit le curseur principal
            cursor.style.height = '20px';
            cursorOutline.style.width = '60px';       // Agrandit le contour
            cursorOutline.style.height = '60px';
            cursorOutline.style.borderColor = 'var(--secondary-color)'; // Change la couleur
        });
        
        // Quand la souris quitte l'élément
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '10px';              // Retour à la taille normale
            cursor.style.height = '10px';
            cursorOutline.style.width = '40px';
            cursorOutline.style.height = '40px';
            cursorOutline.style.borderColor = 'var(--primary-color)'; // Couleur normale
        });
    });
    
    // Cache le curseur quand il quitte la fenêtre
    document.addEventListener('mouseout', (e) => {
        if (e.relatedTarget === null) {
            cursor.style.opacity = '0';
            cursorOutline.style.opacity = '0';
        }
    });
    
    // Réaffiche le curseur quand il revient dans la fenêtre
    document.addEventListener('mouseover', () => {
        cursor.style.opacity = '0.8';
        cursorOutline.style.opacity = '0.3';
    });
}

// Effets de survol des cartes de projet
function initProjectHover() {
    // Sélectionne toutes les cartes de projet
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        // Quand la souris entre sur une carte
        card.addEventListener('mouseenter', () => {
            // Force l'application des styles directement via JavaScript pour assurer la fluidité
            card.style.transform = 'translateY(-8px)';              // Soulève la carte
            card.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.2)'; // Ombre plus prononcée
            card.style.borderColor = 'rgba(255, 255, 255, 0.4)';     // Bordure plus visible
            
            // Change la couleur du titre
            const title = card.querySelector('.project-title');
            if (title) {
                title.style.color = 'var(--primary-color)';
            }
            
            // Agrandit légèrement l'image
            const img = card.querySelector('.project-img');
            if (img) {
                img.style.transform = 'scale(1.05)';
            }
        });
        
        // Quand la souris quitte la carte
        card.addEventListener('mouseleave', () => {
            // Réinitialise tous les styles modifiés
            card.style.transform = '';
            card.style.boxShadow = '';
            card.style.borderColor = '';
            
            const title = card.querySelector('.project-title');
            if (title) {
                title.style.color = '';
            }
            
            const img = card.querySelector('.project-img');
            if (img) {
                img.style.transform = '';
            }
        });
    });
}

// Gestion du formulaire de contact
function initContactForm() {
    // Sélectionne le formulaire de contact
    const form = document.getElementById('contact-form');
    
    if (form) {
        // Ajoute un écouteur d'événement pour la soumission du formulaire
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Empêche l'envoi standard du formulaire
            
            // Récupère les valeurs des champs
            const name = form.querySelector('#name').value;
            const email = form.querySelector('#email').value;
            const message = form.querySelector('#message').value;
            
            // Validation simple des champs
            if (!name || !email || !message) {
                showFormMessage('Veuillez remplir tous les champs', 'error');
                return;
            }
            
            // Validation de l'email avec regex
            if (!isValidEmail(email)) {
                showFormMessage('Veuillez entrer une adresse email valide', 'error');
                return;
            }
            
            // Ajoute une animation de chargement sur le bouton
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';
            submitBtn.disabled = true;
            
            // Affiche un message d'envoi en cours
            showFormMessage('Envoi en cours...', 'sending');
            
            // Simule l'envoi d'email (à remplacer par une solution réelle)
            setTimeout(() => {
                // Dans un environnement de production, utilisez une vraie solution d'envoi d'email
                // comme EmailJS, un webhook, ou une fonction serverless
                
                // Log les données qui seraient envoyées
                console.log({
                    to: 'jlasselin.pro@gmail.com',
                    name,
                    email,
                    message
                });
                
                // Réinitialise le formulaire
                form.reset();
                
                // Affiche un message de succès
                showFormMessage('Message envoyé avec succès! Je vous recontacterai dès que possible.', 'success');
                
                // Restaure le bouton après un délai
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 1000);
            }, 2000); // Délai fictif pour simuler l'envoi
        });
    }
    
    // Fonction utilitaire pour valider le format de l'email
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    // Fonction pour afficher les messages de statut du formulaire
    function showFormMessage(message, status) {
        const messageEl = document.getElementById('form-message');
        
        if (messageEl) {
            messageEl.textContent = message;
            messageEl.className = 'form-message ' + status; // Applique la classe CSS correspondante au statut
            
            // Si c'est un message de succès, le faire disparaître après un délai
            if (status === 'success') {
                setTimeout(() => {
                    messageEl.style.opacity = '0';
                    setTimeout(() => {
                        messageEl.textContent = '';
                        messageEl.className = 'form-message';
                        messageEl.style.opacity = '1';
                    }, 300);
                }, 5000);
            }
        }
    }
}

// Menu de navigation mobile (hamburger)
function initMobileNav() {
    // Sélectionne la barre de navigation
    const nav = document.querySelector('.glass-nav');
    
    if (nav) {
        // Crée l'icône de menu hamburger
        const menuIcon = document.createElement('div');
        menuIcon.className = 'menu-icon';
        menuIcon.innerHTML = '<span></span><span></span><span></span>'; // Trois barres
        nav.appendChild(menuIcon);
        
        // Sélectionne les liens de navigation
        const navLinks = document.querySelector('.nav-links');
        
        // Ajoute dynamiquement les styles CSS pour le menu mobile
        const style = document.createElement('style');
        style.textContent = `
            .menu-icon {
                display: none;                   /* Caché par défaut, visible seulement sur mobile */
                flex-direction: column;          /* Empile les barres verticalement */
                justify-content: space-between;  /* Espace entre les barres */
                width: 30px;
                height: 20px;
                cursor: pointer;
                z-index: 1001;                   /* Au-dessus du menu */
            }
            
            .menu-icon span {
                display: block;
                width: 100%;
                height: 2px;
                background-color: var(--text-color);
                transition: all 0.3s ease;       /* Animation pour l'effet X */
            }
            
            /* Transforme le hamburger en X quand ouvert */
            .menu-open .menu-icon span:nth-child(1) {
                transform: translateY(9px) rotate(45deg); /* Barre du haut -> diagonale */
            }
            
            .menu-open .menu-icon span:nth-child(2) {
                opacity: 0;                      /* Barre du milieu invisible */
            }
            
            .menu-open .menu-icon span:nth-child(3) {
                transform: translateY(-9px) rotate(-45deg); /* Barre du bas -> diagonale */
            }
            
            /* Affiche les liens quand le menu est ouvert */
            .menu-open .nav-links {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }
            
            /* Styles spécifiques pour mobiles */
            @media (max-width: 768px) {
                .menu-icon {
                    display: flex;               /* Affiche l'icône hamburger */
                }
                
                .nav-links {
                    position: fixed;             /* Menu en plein écran */
                    top: 70px;                   /* Juste en dessous de la barre de navigation */
                    left: 0;
                    right: 0;
                    background: rgba(10, 15, 30, 0.9);
                    backdrop-filter: blur(15px);
                    -webkit-backdrop-filter: blur(15px);
                    display: flex;
                    flex-direction: column;      /* Liens empilés verticalement */
                    align-items: center;
                    padding: 2rem 0;
                    gap: 1.5rem;
                    opacity: 0;                  /* Invisible par défaut */
                    visibility: hidden;
                    transform: translateY(-20px); /* Légèrement vers le haut */
                    transition: all 0.3s ease;    /* Animation d'apparition */
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }
            }
        `;
        document.head.appendChild(style);
        
        // Bascule la classe menu-open quand on clique sur l'icône
        menuIcon.addEventListener('click', () => {
            document.body.classList.toggle('menu-open');
        });
        
        // Ferme le menu quand on clique en dehors
        document.addEventListener('click', (e) => {
            if (document.body.classList.contains('menu-open') && 
                !e.target.closest('.nav-links') && 
                !e.target.closest('.menu-icon')) {
                document.body.classList.remove('menu-open');
            }
        });
        
        // Ferme le menu quand on clique sur un lien
        const navItems = document.querySelectorAll('.nav-links a');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                document.body.classList.remove('menu-open');
            });
        });
    }
}

// Défilement doux pour les liens de navigation interne
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Empêche le comportement par défaut
        
        // Trouve l'élément cible (section) vers lequel défiler
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            // Défile vers la cible avec une animation fluide
            window.scrollTo({
                top: target.offsetTop - 80, // 80px de décalage pour tenir compte de la navigation fixe
                behavior: 'smooth'          // Animation de défilement fluide
            });
        }
    });
});

// Animation des icônes flottantes dans la carte de profil
function animateFloatingIcons() {
    const icons = document.querySelectorAll('.floating-icons i');
    
    icons.forEach((icon, index) => {
        // Calcule des positions aléatoires en utilisant des fonctions trigonométriques
        // et le timestamp actuel pour créer un mouvement fluide et organique
        const xPos = Math.sin(Date.now() * 0.001 + index) * 15; // Mouvement horizontal
        const yPos = Math.cos(Date.now() * 0.001 + index) * 15; // Mouvement vertical
        
        // Applique la transformation à l'icône
        icon.style.transform = `translate(${xPos}px, ${yPos}px)`;
    });
    
    // Demande au navigateur d'appeler cette fonction avant la prochaine repeinture
    // Crée une animation fluide à 60 FPS
    requestAnimationFrame(animateFloatingIcons);
}

// Démarre l'animation des icônes flottantes
animateFloatingIcons();
