// ============================================================================
// FUNÇÕES GLOBAIS
// ============================================================================

/**
 * Registra a visualização de um post no Firestore.
 * Esta função agora usa o objeto 'window.firebase' criado pelo 'firebase-init.html'.
 * @param {string} postSlug - O identificador único do post.
 */
async function registrarVisualizacao(postSlug) {
  // Verifica se a 'ponte' do Firebase foi criada com sucesso.
  if (!window.firebase || !window.firebase.db) {
    console.error("Firebase não foi inicializado corretamente. O objeto window.firebase não foi encontrado.");
    return;
  }

  // Usa as funções e objetos disponibilizados pela 'ponte'.
  const { db, doc, getDoc, setDoc, increment } = window.firebase;

  try {
    const docRef = doc(db, 'views', postSlug); // Usa a função doc() da ponte
    const docSnap = await getDoc(docRef);     // Usa a função getDoc() da ponte

    if (docSnap.exists()) {
      // O documento já existe, incrementa o contador.
      // Usamos { merge: true } para garantir que não sobrescrevemos outros campos acidentalmente.
      await setDoc(docRef, { count: increment(1) }, { merge: true });
    } else {
      // O documento não existe, cria um novo com o contador em 1.
      await setDoc(docRef, { count: 1 });
    }
    console.log("%c[SUCESSO]%c Visualização registrada para o slug: " + postSlug, "color: #22c55e; font-weight: bold;", "color: inherit;");

  } catch (error) {
    console.error("Erro ao registrar visualização no Firestore:", error);
  }
}

/**
 * Função para lidar com o envio de formulários (ex: contato).
 * O conteúdo original deve ser inserido aqui se necessário.
 * @param {Event} event - O evento de submissão do formulário.
 */
function handleSubmit(event) {
  // event.preventDefault(); // Exemplo: previne o envio padrão
  // console.log("Formulário enviado.");
  // Adicione aqui a lógica de envio do seu formulário, se houver.
}


// ============================================================================
// INICIALIZADOR DE MÓDULOS
// ============================================================================

// Variável de controle para garantir que a inicialização ocorra apenas uma vez.
let appHasInitialized = false;

/**
 * Função principal que inicializa todos os componentes interativos do site.
 */
function initApp() {
  // Previne execução duplicada.
  if (appHasInitialized) {
    return;
  }
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
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // =================================================
  // MÓDULO: CONTADOR DE VISUALIZAÇÕES DE POST
  // =================================================
  const postSlugElement = document.getElementById('post-slug');
  if (postSlugElement) {
    const slug = postSlugElement.innerText;
    if (slug) {
      console.log("Módulo Contador de Views ATIVADO. Slug do post:", slug);
      registrarVisualizacao(slug);
    }
  }

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

  // ... (outros módulos como Crachá do LinkedIn e Swiper seriam ativados aqui) ...
}

// ============================================================================
// O GATILHO FINAL
// ============================================================================

// O evento 'DOMContentLoaded' é o gatilho padrão e mais confiável para iniciar
// scripts que manipulam o conteúdo da página.
// Como nosso script principal já tem o atributo 'defer' no HTML, ele só vai
// executar depois que o DOM estiver pronto, então podemos chamar initApp() diretamente.
initApp();
