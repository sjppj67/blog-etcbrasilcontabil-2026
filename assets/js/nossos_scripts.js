// ============================================================================
// FUNÇÕES GLOBAIS
// ============================================================================
// Estas funções são definidas globalmente para serem acessadas por outros scripts ou pelo HTML, se necessário.

// Função para registrar a visualização de um post no Firebase.
// (O conteúdo desta função deve ser o seu código original do Firebase)
async function registrarVisualizacao(postSlug) {
  /* 
     COLE AQUI O SEU CÓDIGO ORIGINAL DA FUNÇÃO registrarVisualizacao.
     Exemplo de como ele deve se parecer:

     try {
       const db = firebase.firestore();
       const docRef = db.collection('views').doc(postSlug);
       const doc = await docRef.get();

       if (doc.exists) {
         await docRef.update({ count: firebase.firestore.FieldValue.increment(1) });
       } else {
         await docRef.set({ count: 1 });
       }
       console.log("Visualização registrada com sucesso para:", postSlug);
     } catch (error) {
       console.error("Erro ao registrar visualização:", error);
     }
  */
}
// Torna a função acessível globalmente, se necessário.
window.registrarVisualizacao = registrarVisualizacao;

// Função para lidar com o envio de formulários.
// (O conteúdo desta função deve ser o seu código original)
function handleSubmit(event) {
  /* 
     COLE AQUI O SEU CÓDIGO ORIGINAL DA FUNÇÃO handleSubmit.
  */
}

// ============================================================================
// INICIALIZADOR DE MÓDULOS
// ============================================================================

// Variável de controle para garantir que a inicialização ocorra apenas uma vez.
let appHasInitialized = false;

// Função principal que inicializa todos os componentes interativos do site.
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
  if (
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  // Módulo: Menu Mobile
  const mobileMenuButton = document.querySelector(".mobile-menu-button");
  const mobileMenu = document.querySelector(".mobile-menu");
  if (mobileMenuButton && mobileMenu) {
    console.log("Módulo de Menu Mobile ATIVADO.");
    mobileMenuButton.addEventListener("click", () =>
      mobileMenu.classList.toggle("hidden")
    );
  }

  // Módulo: Rolagem Suave (Smooth Scroll)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetElement = document.querySelector(this.getAttribute("href"));
      if (targetElement) {
        console.log(
          "Módulo de Rolagem Suave ATIVADO para:",
          this.getAttribute("href")
        );
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // =================================================
  // MÓDULO: CONTADOR DE VISUALIZAÇÕES DE POST (CORREÇÃO APLICADA)
  // =================================================
  const postSlugElement = document.getElementById("post-slug");

  // Verifica se o elemento com o ID 'post-slug' existe na página atual.
  if (postSlugElement) {
    // Pega o texto de dentro do elemento, que é o slug do post.
    const slug = postSlugElement.innerText;

    // Verifica se o slug não está vazio antes de continuar.
    if (slug) {
      console.log("Módulo Contador de Views ATIVADO. Slug do post:", slug);
      // Chama a função global para registrar a visualização no Firebase.
      registrarVisualizacao(slug);
    } else {
      console.warn(
        "Módulo Contador de Views: Elemento 'post-slug' encontrado, mas está vazio."
      );
    }
  }
  // Se o elemento não for encontrado, o script simplesmente não faz nada,
  // o que é o comportamento esperado em páginas que não são posts (como a home).

  // Módulo: Texto Animado
  const typingElement = document.getElementById("typing-text");
  if (typingElement) {
    console.log("Módulo de Texto Animado ATIVADO.");
    const texts = ["Bem-vindos ao", "Explore o", "Descubra o"];
    let textIndex = 0,
      charIndex = 0,
      isDeleting = false;
    const cursor = document.getElementById("cursor");
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
        setTimeout(() => (isDeleting = true), 2000);
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
      }
      setTimeout(typeText, isDeleting ? 50 : 100);
    }
    typeText();
    if (cursor)
      setInterval(
        () => (cursor.style.opacity = cursor.style.opacity === "0" ? "1" : "0"),
        500
      );
  }

  // ... (outros módulos que você tenha, como Crachá do LinkedIn e Swiper, continuam aqui) ...
}

// ============================================================================
// O GATILHO FINAL (CORREÇÃO APLICADA)
// ============================================================================

// Gatilho principal e mais confiável para inicializar a aplicação.
// Ele espera o HTML da página ser totalmente carregado antes de executar o código que manipula o DOM.
document.addEventListener("DOMContentLoaded", () => {
  console.log("Página carregada (DOMContentLoaded). Inicializando o App...");
  initApp();
});
