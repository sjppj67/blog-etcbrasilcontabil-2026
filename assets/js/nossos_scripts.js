// ============================================================================
// FUNÇÕES GLOBAIS
// ============================================================================

/**
 * Registra a visualização de um post no Firestore e atualiza a tela.
 * ADAPTADO para o novo padrão da Manus IA (window.firebaseApp).
 */
async function registrarVisualizacao(postSlug) {
  // 1. Verificamos se o NOVO objeto da Manus IA está pronto
  if (!window.firebaseApp || !window.firebaseApp.db) {
    console.warn("Aguardando inicialização do FirebaseApp pela Manus IA...");
    return;
  }

  // 2. Buscamos o banco e as funções no novo endereço (functions)
  const db = window.firebaseApp.db;
  const { doc, getDoc, setDoc, increment } = window.firebaseApp.functions;

  const docRef = doc(db, 'views', postSlug);

  try {
    let novoTotal = 1;
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await setDoc(docRef, { count: increment(1) }, { merge: true });
      novoTotal = (docSnap.data().count || 0) + 1;
    } else {
      await setDoc(docRef, { count: 1 });
    }

    console.log("%c[SUCESSO]%c View registrada no novo padrão Manus: " + postSlug, "color: #22c55e; font-weight: bold;", "color: inherit;");

    const displayElement = document.getElementById('view-count-display');
    if (displayElement) {
      displayElement.textContent = novoTotal;
      const container = displayElement.closest('.view-count-container');
      if (container) container.classList.remove('hidden');
    }

  } catch (error) {
    console.error("Erro ao registrar view (v2):", error);
  }
}

// ============================================================================
// INICIALIZADOR DE MÓDULOS (O resto continua igual!)
// ============================================================================

let appHasInitialized = false;

function initApp() {
  if (appHasInitialized) return;
  appHasInitialized = true;
  
  console.log("App inicializado. Checando módulos...");

  // Módulo: Dark Mode
  if (localStorage.theme === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    document.documentElement.classList.add("dark");
  }

  // Módulo: Menu Mobile
  const mobileMenuButton = document.querySelector(".mobile-menu-button");
  const mobileMenu = document.querySelector(".mobile-menu");
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", () => mobileMenu.classList.toggle("hidden"));
  }

  // Módulo: Contador de Views
  const postSlugElement = document.getElementById('post-slug');
  if (postSlugElement) {
    const slug = postSlugElement.textContent.trim();
    if (slug) {
      // Pequeno atraso para garantir que o script da Manus carregou o módulo
      setTimeout(() => registrarVisualizacao(slug), 500);
    }
  }

  // Módulo: Texto Animado
  const typingElement = document.getElementById('typing-text');
  if (typingElement) {
    const texts = ["Bem-vindos ao", "Explore o", "Descubra o"];
    let textIndex = 0, charIndex = 0, isDeleting = false;
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
  }
}

// Inicialização segura
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
