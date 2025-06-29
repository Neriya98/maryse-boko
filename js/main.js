// Main JavaScript file for Maryse's creative portfolio website

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initThemeToggle(); // Initialize theme toggle first for immediate visual effect
    initNavigation();
    initScrollEffects();
    initAnimations();
    initTestimonials();
    initProjectFilters();
    initContactForm();
    initSmoothScroll();
    initParallax();
    initFAQ();
    initFloatingElements();
    initSimpleAudioPlayer(); // Initialize the audio player
});

// Initialize simple audio player with autoplay
function initSimpleAudioPlayer() {
    const audioPlayer = document.getElementById('audioPlayer');
    const audioToggleBtn = document.getElementById('audioToggleBtn');
    const audioElement = document.getElementById('audioElement');
    
    if (!audioPlayer || !audioToggleBtn || !audioElement) return;
    
    let isPlaying = false;
    
    // Function to play audio
    function playAudio() {
        audioElement.play().catch(error => {
            console.error('Auto-play prevented:', error);
            // Modern browsers require user interaction before playing audio
            // We'll show a more prominent play button when auto-play is blocked
            audioToggleBtn.classList.add('attention');
        });
        audioToggleBtn.textContent = '⏸️';
        isPlaying = true;
    }
    
    // Function to pause audio
    function pauseAudio() {
        audioElement.pause();
        audioToggleBtn.textContent = '▶️';
        isPlaying = false;
    }
    
    // Toggle play/pause
    audioToggleBtn.addEventListener('click', function() {
        if (isPlaying) {
            pauseAudio();
        } else {
            playAudio();
        }
    });
    
    // Auto-play after 5 seconds
    setTimeout(() => {
        playAudio();
    }, 5000);
}

// Navigation functionality with auto-hide on scroll
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');
    
    let lastScrollTop = 0;
    let scrollTimeout;

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }

    // Enhanced navbar scroll effects with auto-hide
    if (navbar) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add scrolled class for styling
            if (scrollTop > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Auto-hide navbar on scroll down, show on scroll up
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                // Scrolling down - hide navbar
                navbar.classList.add('hidden');
            } else {
                // Scrolling up - show navbar
                navbar.classList.remove('hidden');
            }
            
            lastScrollTop = scrollTop;
            
            // Clear timeout and set new one to show navbar after scroll stops
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                navbar.classList.remove('hidden');
            }, 1000);
        });
        
        // Show navbar on mouse move near top
        document.addEventListener('mousemove', function(e) {
            if (e.clientY < 100) {
                navbar.classList.remove('hidden');
            }
        });
    }

    // Active navigation link highlighting
    updateActiveNavLink();
    window.addEventListener('scroll', updateActiveNavLink);
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}` || 
            (current === '' && link.getAttribute('href') === '#hero')) {
            link.classList.add('active');
        }
    });
}

// Scroll effects and animations
function initScrollEffects() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                
                // Add special effects for certain elements
                if (entry.target.classList.contains('service-card')) {
                    setTimeout(() => {
                        entry.target.style.transform = 'translateY(0) scale(1)';
                    }, 100);
                }
            }
        });
    }, observerOptions);

    // Observe all elements with data-aos attribute
    const animatedElements = document.querySelectorAll('[data-aos]');
    animatedElements.forEach(el => observer.observe(el));
}

// Initialize animations
function initAnimations() {
    // Service card hover effects with enhanced animations
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.03)';
            this.style.boxShadow = '0 15px 40px rgba(255, 107, 157, 0.25)';
            
            const icon = this.querySelector('.service-icon');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(5deg)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 4px 20px rgba(255, 107, 157, 0.15)';
            
            const icon = this.querySelector('.service-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });

    // Project card enhanced hover effects
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const overlay = this.querySelector('.project-overlay');
            const image = this.querySelector('.project-image img');
            
            this.style.transform = 'translateY(-10px) scale(1.02)';
            if (overlay) overlay.style.opacity = '0.95';
            if (image) image.style.transform = 'scale(1.1) rotate(2deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            const overlay = this.querySelector('.project-overlay');
            const image = this.querySelector('.project-image img');
            
            this.style.transform = 'translateY(0) scale(1)';
            if (overlay) overlay.style.opacity = '0';
            if (image) image.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            if (this.classList.contains('btn-glow')) {
                this.style.boxShadow = '0 0 40px rgba(255, 107, 157, 0.6)';
            }
        });
        
        btn.addEventListener('mouseleave', function() {
            if (this.classList.contains('btn-glow')) {
                this.style.boxShadow = '0 0 30px rgba(255, 107, 157, 0.3)';
            }
        });
    });
}

// Testimonials carousel with enhanced functionality
function initTestimonials() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');
    
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    let autoPlayInterval;
    
    function showSlide(index) {
        slides.forEach(slide => {
            slide.classList.remove('active');
            slide.style.opacity = '0';
            slide.style.transform = 'translateY(20px)';
        });
        dots.forEach(dot => dot.classList.remove('active'));
        
        setTimeout(() => {
            slides[index].classList.add('active');
            slides[index].style.opacity = '1';
            slides[index].style.transform = 'translateY(0)';
        }, 150);
        
        if (dots[index]) dots[index].classList.add('active');
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 6000);
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoPlay();
            setTimeout(startAutoPlay, 3000);
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoPlay();
            setTimeout(startAutoPlay, 3000);
        });
    }
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            currentSlide = index;
            showSlide(currentSlide);
            stopAutoPlay();
            setTimeout(startAutoPlay, 3000);
        });
    });
    
    // Start auto-play
    startAutoPlay();
    
    // Pause on hover
    const testimonialSection = document.querySelector('.testimonials-carousel');
    if (testimonialSection) {
        testimonialSection.addEventListener('mouseenter', stopAutoPlay);
        testimonialSection.addEventListener('mouseleave', startAutoPlay);
    }
}

// Project filters with enhanced animations
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (filterBtns.length === 0) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button with animation
            filterBtns.forEach(b => {
                b.classList.remove('active');
                b.style.transform = 'scale(1)';
            });
            this.classList.add('active');
            this.style.transform = 'scale(1.05)';
            
            // Filter projects with staggered animation
            projectCards.forEach((card, index) => {
                const category = card.getAttribute('data-category');
                
                // Hide all cards first
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8) translateY(20px)';
                
                setTimeout(() => {
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1) translateY(0)';
                        }, index * 100);
                    } else {
                        card.style.display = 'none';
                    }
                }, 200);
            });
        });
    });
}

// Enhanced project modal functionality
function openProjectModal(projectId) {
    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');
    
    if (!modal || !modalBody) return;
    
    // Enhanced project data with French content
    const projectData = {
        cosmetics: {
            title: 'Campagne Cosmétiques Luxe',
            image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
            description: 'Voix-off sensuelle et élégante pour une campagne publicitaire de cosmétiques haut de gamme. Diffusion nationale sur les chaînes TV et radio premium.',
            technologies: ['Voix-off', 'Studio Pro', 'Mixage', 'Mastering'],
            features: [
                'Enregistrement en studio professionnel',
                'Voix sensuelle et élégante adaptée au luxe',
                'Livraison en plusieurs formats (TV, radio, web)',
                'Révisions incluses jusqu\'à satisfaction',
                'Délai respecté : 48h',
                'Diffusion nationale réussie'
            ],
            results: 'Campagne diffusée sur TF1, France 2 et RTL. Augmentation de 35% de la notoriété de la marque.',
            audioUrl: '#',
            clientUrl: '#'
        },
        techstart: {
            title: 'TechStart - Stratégie Social Media',
            image: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
            description: 'Community management complet pour une startup tech innovante. Croissance explosive de 0 à 150K followers en 8 mois avec un engagement exceptionnel.',
            technologies: ['Instagram', 'LinkedIn', 'TikTok', 'Analytics', 'Canva Pro'],
            features: [
                'Stratégie de contenu personnalisée',
                'Création visuelle quotidienne',
                'Animation de communauté 7j/7',
                'Campagnes d\'influence ciblées',
                'Reporting mensuel détaillé',
                'Gestion de crise proactive'
            ],
            results: '150K followers en 8 mois, taux d\'engagement 8.5%, 300% d\'augmentation du trafic web.',
            liveUrl: '#',
            caseStudyUrl: '#'
        }
        // Add more projects as needed
    };
    
    const project = projectData[projectId];
    if (!project) return;
    
    modalBody.innerHTML = `
        <div class="project-modal-content">
            <img src="${project.image}" alt="${project.title}" style="width: 100%; height: 300px; object-fit: cover; border-radius: 20px; margin-bottom: 2rem;">
            <h2 style="background: linear-gradient(135deg, #FF6B9D, #FFD93D); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${project.title}</h2>
            <p style="font-size: 1.1rem; margin-bottom: 2rem;">${project.description}</p>
            
            <h3>🛠️ Technologies utilisées</h3>
            <div class="project-tech" style="justify-content: flex-start; margin-bottom: 2rem;">
                ${project.technologies.map(tech => `<span style="background: linear-gradient(135deg, #FF6B9D, #FFD93D); color: white; padding: 8px 16px; border-radius: 20px; margin: 4px;">${tech}</span>`).join('')}
            </div>
            
            <h3>✨ Réalisations clés</h3>
            <ul style="margin-bottom: 2rem; list-style: none;">
                ${project.features.map(feature => `<li style="padding: 8px 0; position: relative; padding-left: 30px;"><span style="position: absolute; left: 0; color: #FF6B9D;">✨</span>${feature}</li>`).join('')}
            </ul>
            
            <div style="background: linear-gradient(135deg, rgba(255, 107, 157, 0.1), rgba(168, 230, 207, 0.1)); padding: 20px; border-radius: 15px; margin-bottom: 2rem;">
                <h3>📊 Résultats</h3>
                <p>${project.results}</p>
            </div>
            
            <div class="project-links" style="display: flex; gap: 1rem; justify-content: center;">
                <a href="${project.audioUrl || project.liveUrl}" class="btn btn-primary btn-glow" target="_blank">
                    ${project.audioUrl ? '🎧 Écouter' : '🌐 Voir le projet'}
                </a>
                <a href="${project.clientUrl || project.caseStudyUrl}" class="btn btn-outline" target="_blank">
                    📋 Case Study
                </a>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Add entrance animation
    setTimeout(() => {
        modal.querySelector('.modal-content').style.transform = 'scale(1)';
        modal.querySelector('.modal-content').style.opacity = '1';
    }, 10);
}

function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    const modal = document.getElementById('project-modal');
    if (e.target === modal) {
        closeProjectModal();
    }
});

// Enhanced contact form functionality
function initContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn?.querySelector('.btn-text');
    const btnLoading = submitBtn?.querySelector('.btn-loading');
    const formSuccess = document.getElementById('form-success');
    
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Clear previous errors
        clearFormErrors();
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Show loading state with animation
        if (submitBtn && btnText && btnLoading) {
            submitBtn.disabled = true;
            submitBtn.style.transform = 'scale(0.95)';
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';
        }
        
        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        try {
            // Simulate API call (replace with actual endpoint)
            await simulateFormSubmission(data);
            
            // Show success message with animation
            if (formSuccess) {
                form.style.opacity = '0';
                form.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    form.style.display = 'none';
                    formSuccess.style.display = 'block';
                    formSuccess.style.opacity = '0';
                    formSuccess.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        formSuccess.style.opacity = '1';
                        formSuccess.style.transform = 'translateY(0)';
                    }, 100);
                }, 300);
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            showFormError('Une erreur est survenue. Veuillez réessayer ou me contacter directement ! 💌');
        } finally {
            // Reset button state
            if (submitBtn && btnText && btnLoading) {
                submitBtn.disabled = false;
                submitBtn.style.transform = 'scale(1)';
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
            }
        }
    });
    
    // Real-time validation with French messages
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

// Initialize Theme Toggle for Dark/Light Mode
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check user's preferred theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    
    // Apply saved theme or check system preference
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
    } else if (savedTheme === null) {
        // If no saved preference, check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    }
    
    // Toggle theme when the button is clicked
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            body.classList.toggle('dark-theme');
            
            // Save user preference to localStorage
            if (body.classList.contains('dark-theme')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    }
    
    // Listen for system theme changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (localStorage.getItem('theme') === null) { // Only apply if user hasn't set a preference
                if (e.matches) {
                    body.classList.add('dark-theme');
                } else {
                    body.classList.remove('dark-theme');
                }
            }
        });
    }
}

// Enhanced form validation with French messages
function validateForm() {
    const prenom = document.getElementById('prenom');
    const nom = document.getElementById('nom');
    const email = document.getElementById('email');
    const serviceType = document.getElementById('service-type');
    const message = document.getElementById('message');
    
    let isValid = true;
    
    if (!validateField(prenom)) isValid = false;
    if (!validateField(nom)) isValid = false;
    if (!validateField(email)) isValid = false;
    if (!validateField(serviceType)) isValid = false;
    if (!validateField(message)) isValid = false;
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        errorMessage = `Ce champ est requis 💫`;
        isValid = false;
    }
    
    // Email validation
    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage = 'Merci de saisir un email valide 📧';
            isValid = false;
        }
    }
    
    // Name validation
    if ((fieldName === 'prenom' || fieldName === 'nom') && value && value.length < 2) {
        errorMessage = 'Au moins 2 caractères s\'il vous plaît ✨';
        isValid = false;
    }
    
    // Message validation
    if (fieldName === 'message' && value && value.length < 20) {
        errorMessage = 'Parlez-moi un peu plus de votre projet (min. 20 caractères) 💭';
        isValid = false;
    }
    
    // Show/hide error with animation
    const errorElement = document.getElementById(`${fieldName}-error`);
    if (errorElement) {
        if (!isValid) {
            errorElement.textContent = errorMessage;
            errorElement.style.display = 'block';
            errorElement.style.opacity = '1';
            field.style.borderColor = '#FF6B9D';
            field.style.boxShadow = '0 0 0 3px rgba(255, 107, 157, 0.1)';
        } else {
            errorElement.style.opacity = '0';
            setTimeout(() => {
                errorElement.style.display = 'none';
            }, 200);
            field.style.borderColor = '#A8E6CF';
            field.style.boxShadow = '0 0 0 3px rgba(168, 230, 207, 0.1)';
        }
    }
    
    return isValid;
}

function clearFieldError(field) {
    const fieldName = field.name;
    const errorElement = document.getElementById(`${fieldName}-error`);
    if (errorElement) {
        errorElement.style.opacity = '0';
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 200);
        field.style.borderColor = '#E9ECEF';
        field.style.boxShadow = 'none';
    }
}

function clearFormErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    const inputs = document.querySelectorAll('input, textarea, select');
    
    errorElements.forEach(error => {
        error.style.opacity = '0';
        setTimeout(() => {
            error.style.display = 'none';
        }, 200);
    });
    
    inputs.forEach(input => {
        input.style.borderColor = '#E9ECEF';
        input.style.boxShadow = 'none';
    });
}

function showFormError(message) {
    // Create or update error display
    let errorDiv = document.getElementById('form-error');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'form-error';
        errorDiv.style.cssText = `
            background: linear-gradient(135deg, #FF6B9D, #FFD93D);
            color: white;
            padding: 1rem;
            border-radius: 15px;
            margin-top: 1rem;
            text-align: center;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.3s ease;
        `;
        document.querySelector('.contact-form').appendChild(errorDiv);
    }
    
    errorDiv.textContent = message;
    setTimeout(() => {
        errorDiv.style.opacity = '1';
        errorDiv.style.transform = 'translateY(0)';
    }, 100);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        errorDiv.style.opacity = '0';
        errorDiv.style.transform = 'translateY(-10px)';
    }, 5000);
}

// Simulate form submission (replace with actual backend integration)
async function simulateFormSubmission(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate success (95% of the time)
            if (Math.random() > 0.05) {
                console.log('Form submitted:', data);
                resolve();
            } else {
                reject(new Error('Submission failed'));
            }
        }, 2000);
    });
}

// FAQ functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggle = item.querySelector('.faq-toggle');
        
        if (question && answer && toggle) {
            question.addEventListener('click', function() {
                const isOpen = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        const otherToggle = otherItem.querySelector('.faq-toggle');
                        if (otherAnswer) otherAnswer.style.maxHeight = '0';
                        if (otherToggle) otherToggle.textContent = '+';
                    }
                });
                
                // Toggle current item
                if (isOpen) {
                    item.classList.remove('active');
                    answer.style.maxHeight = '0';
                    toggle.textContent = '+';
                } else {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    toggle.textContent = '−';
                }
            });
        }
    });
}

// Enhanced smooth scrolling
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                
                // Add smooth scroll with easing
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Add visual feedback
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            }
        });
    });
}

// Enhanced parallax effects
function initParallax() {
    const heroImage = document.querySelector('.hero-image');
    const floatingShapes = document.querySelectorAll('.floating-shape');
    
    if (!heroImage && floatingShapes.length === 0) return;
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.3;
        
        // Hero parallax
        if (heroImage && scrolled < window.innerHeight) {
            heroImage.style.transform = `translateY(${rate}px) scale(1.1)`;
        }
        
        // Floating shapes parallax
        floatingShapes.forEach((shape, index) => {
            const speed = 0.1 + (index * 0.05);
            const yPos = -(scrolled * speed);
            shape.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.1}deg)`;
        });
    });
}

// Initialize floating elements animation
function initFloatingElements() {
    const shapes = document.querySelectorAll('.floating-shape');
    
    shapes.forEach((shape, index) => {
        // Random initial position
        const randomX = Math.random() * 100;
        const randomY = Math.random() * 100;
        
        shape.style.left = randomX + '%';
        shape.style.top = randomY + '%';
        
        // Add random animation delay
        shape.style.animationDelay = (Math.random() * 5) + 's';
        
        // Add mouse interaction
        shape.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.5) rotate(180deg)';
            this.style.opacity = '1';
        });
        
        shape.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
            this.style.opacity = '0.6';
        });
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Performance optimizations
const debouncedScrollHandler = debounce(updateActiveNavLink, 100);
const throttledParallaxHandler = throttle(initParallax, 16);

// Add page visibility API for performance
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pause animations when page is not visible
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations when page becomes visible
        document.body.style.animationPlayState = 'running';
    }
});

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading if there are lazy images
if (document.querySelectorAll('img[data-src]').length > 0) {
    initLazyLoading();
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You could send this to an error tracking service
});

// Add some fun easter eggs
let clickCount = 0;
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('logo-accent')) {
        clickCount++;
        if (clickCount === 5) {
            // Easter egg: make all floating elements dance
            const shapes = document.querySelectorAll('.floating-shape');
            shapes.forEach(shape => {
                shape.style.animation = 'none';
                shape.style.animation = 'bounce 0.5s ease-in-out 3';
            });
            clickCount = 0;
        }
    }
});

// Export functions for global access
window.openProjectModal = openProjectModal;
window.closeProjectModal = closeProjectModal;

// Add some magic ✨
console.log('✨ Bienvenue dans l\'univers créatif de Maryse ! ✨');
console.log('🎤 Voix-off • 💬 Community • ✨ Digital');
console.log('Fait avec 💖 et beaucoup de créativité !');