// ============================================================================
// FUNÇÕES GLOBAIS
// ============================================================================

/**
 * Registra a visualização de um post no Firestore e atualiza a tela.
 * @param {string} postSlug - O identificador único do post.
 */
async function registrarVisualizacao(postSlug) {
  // Verifica se a 'ponte' do Firebase foi criada no firebase-init.html
  if (!window.firebase || !window.firebase.db) {
    console.error("Erro: Objeto window.firebase não encontrado.");
    return;
  }

  const { db, doc, getDoc, setDoc, increment } = window.firebase;
  const docRef = doc(db, 'views', postSlug);

  try {
    let novoTotal = 1;
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Incrementa o contador no Firestore
      await setDoc(docRef, { count: increment(1) }, { merge: true });
      // Calcula o valor para exibição imediata (valor atual + 1)
      novoTotal = (docSnap.data().count || 0) + 1;
    } else {
      // Cria o primeiro registro se o post for novo no banco
      await setDoc(docRef, { count: 1 });
    }

    console.log("%c[SUCESSO]%c Visualização registrada para: " + postSlug, "color: #22c55e; font-weight: bold;", "color: inherit;");

    // --- ATUALIZAÇÃO DA INTERFACE (UI) ---
    const displayElement = document.getElementById('view-count-display');
    if (displayElement) {
      displayElement.textContent = novoTotal;
      // Se o elemento pai estiver escondido (ex: class="hidden"), nós o mostramos
      const container = displayElement.closest('.view-count-container');
      if (container) container.classList.remove('hidden');
    }

  } catch (error) {
    console.error("Erro ao processar visualização no Firestore:", error);
  }
}

// ============================================================================
// INICIALIZADOR DE MÓDULOS
// ============================================================================

let appHasInitialized = false;

function initApp() {
  if (appHasInitialized) return;
  appHasInitialized = true;
  
  console.log("App inicializado. Verificando módulos...");

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

  // Módulo: Rolagem Suave
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });

  // =================================================
  // MÓDULO: CONTADOR DE VISUALIZAÇÕES
  // =================================================
  const postSlugElement = document.getElementById('post-slug');
  if (postSlugElement) {
    // Usamos textContent.trim() para evitar quebras de linha do Jekyll
    const slug = postSlugElement.textContent.trim();
    if (slug) {
      console.log("Módulo Contador de Views ATIVADO. Slug:", slug);
      registrarVisualizacao(slug);
    }
  }

  // Módulo: Texto Animado (Typing effect)
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

// Gatilho de inicialização
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
