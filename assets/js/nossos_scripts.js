// ============================================================================
// FUNÇÕES GLOBAIS
// ============================================================================
// ... (as funções registrarVisualizacao e handleSubmit continuam iguais aqui) ...
async function registrarVisualizacao(postSlug) { /* ...código... */ }
window.registrarVisualizacao = registrarVisualizacao;
function handleSubmit(event) { /* ...código... */ }

// ============================================================================
// INICIALIZADOR DE MÓDULOS
// ============================================================================

// Variável de controle para garantir que a inicialização ocorra apenas uma vez.
let appHasInitialized = false;

function initApp() {
    // Se o app já foi inicializado, não faz nada e sai da função.
    if (appHasInitialized) {
        console.log("App já inicializado. Ignorando chamada duplicada.");
        return;
    }
    // Marca o app como inicializado para prevenir futuras chamadas.
    appHasInitialized = true;
    
    console.log("App inicializado. Verificando módulos...");

    // Módulo: Dark Mode
    if (localStorage.theme === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }

    // Módulo: Menu Mobile
    const mobileMenuButton = document.querySelector(".mobile-menu-button");
    const mobileMenu = document.querySelector(".mobile-menu");
    if (mobileMenuButton && mobileMenu) {
        console.log("Módulo de Menu Mobile ATIVADO.");
        mobileMenuButton.addEventListener("click", () => mobileMenu.classList.toggle("hidden"));
    }

    // Módulo: Rolagem Suave (Smooth Scroll)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute("href"));
            if (targetElement) {
                console.log("Módulo de Rolagem Suave ATIVADO para:", this.getAttribute("href"));
                targetElement.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    // Módulo: Texto Animado
    const typingElement = document.getElementById('typing-text');
    if (typingElement) {
        console.log("Módulo de Texto Animado ATIVADO.");
        const texts = ["Bem-vindos ao", "Explore o", "Descubra o"];
        let textIndex = 0, charIndex = 0, isDeleting = false;
        const cursor = document.getElementById('cursor');
        function typeText() {
            const currentText = texts[textIndex];
            if (isDeleting) {
                typingElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }
            if (!isDeleting && charIndex === currentText.length) {
                setTimeout(() => isDeleting = true, 2000);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
            }
            setTimeout(typeText, isDeleting ? 50 : 100);
        }
        typeText();
        if (cursor) setInterval(() => cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0', 500);
    }

    // ... (outros módulos como Crachá do LinkedIn e Swiper) ...
}

// ============================================================================
// O GATILHO FINAL
// ============================================================================

// Gatilho principal via Alpine.js
document.addEventListener('alpine:init', () => {
    console.log('Alpine.js inicializado. Tentando rodar o App...');
    initApp();
});

// Gatilho de segurança via DOMContentLoaded (mais confiável)
document.addEventListener('DOMContentLoaded', () => {
    // Espera um pouquinho para dar chance ao Alpine de rodar primeiro.
    setTimeout(() => {
        console.log('Gatilho de segurança DOMContentLoaded disparado. Tentando rodar o App...');
        initApp();
    }, 150); // Aumentei um pouco o tempo
});
