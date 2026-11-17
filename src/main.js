const pages = [...document.querySelectorAll("[data-page]")]
const menuToggle = document.querySelector(".menu-toggle")
const mobileNav = document.querySelector(".mobile-nav")
const header = document.querySelector(".site-header")
const pageTitles = {
  inicio: "Inicio",
  adopcion: "Perritos en Adopción",
  proceso: "Proceso de Adopción",
  ayudar: "¿Cómo Puedes Ayudar?",
  contacto: "Contáctanos",
}

function closeMenu() {
  mobileNav.hidden = true
  menuToggle.setAttribute("aria-expanded", "false")
  menuToggle.setAttribute("aria-label", "Abrir menú")
}

function showPage(moveFocus = false) {
  const requested = window.location.hash.slice(1) || "inicio"
  const current = Object.hasOwn(pageTitles, requested) ? requested : "inicio"
  pages.forEach((page) => {
    page.hidden = page.dataset.page !== current
  })
  document.querySelectorAll("[data-nav]").forEach((link) => {
    if (link.dataset.nav === current) {
      link.setAttribute("aria-current", "page")
    } else {
      link.removeAttribute("aria-current")
    }
  })
  document.title = `${pageTitles[current]} | Salvando Patitas Tampico`
  closeMenu()
  if (moveFocus) {
    window.scrollTo({ top: 0, behavior: "instant" })
    document
      .querySelector(`[data-page="${current}"] h1`)
      .focus({ preventScroll: true })
  }
}

menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true"
  mobileNav.hidden = !open
  menuToggle.setAttribute("aria-expanded", String(open))
  menuToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú")
})
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !mobileNav.hidden) {
    closeMenu()
    menuToggle.focus()
  }
})
mobileNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu()
})
window.addEventListener("hashchange", () => showPage(true))
window.addEventListener(
  "scroll",
  () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8)
  },
  { passive: true },
)
showPage()
header.classList.toggle("is-scrolled", window.scrollY > 8)

// All cards are real HTML; JavaScript only controls which six are visible.
const adoptionCards = [...document.querySelectorAll("#adoption-grid .dog-card")]
const paginationButtons = [...document.querySelectorAll("[data-dog-page]")]
function showDogs(index) {
  adoptionCards.forEach((card, position) => {
    card.hidden = Math.floor(position / 6) !== index
  })
  paginationButtons.forEach((button, position) => {
    if (position === index) button.setAttribute("aria-current", "page")
    else button.removeAttribute("aria-current")
  })
}
paginationButtons.forEach((button) => {
  button.addEventListener("click", () =>
    showDogs(Number(button.dataset.dogPage)),
  )
})
showDogs(0)

const slides = [...document.querySelectorAll(".testimonial-slide")]
const dots = [...document.querySelectorAll("[data-slide]")]
let currentSlide = 0
function showSlide(index) {
  currentSlide = (index + slides.length) % slides.length
  slides.forEach((slide, position) => {
    slide.hidden = position !== currentSlide
  })
  dots.forEach((dot, position) => {
    dot.setAttribute("aria-pressed", String(position === currentSlide))
  })
}
document
  .querySelector('[data-carousel="previous"]')
  .addEventListener("click", () => showSlide(currentSlide - 1))
document
  .querySelector('[data-carousel="next"]')
  .addEventListener("click", () => showSlide(currentSlide + 1))
dots.forEach((dot) =>
  dot.addEventListener("click", () => showSlide(Number(dot.dataset.slide))),
)
showSlide(0)

// No backend is configured: open the mail client instead of claiming delivery.
document.querySelector("#contact-form").addEventListener("submit", (event) => {
  event.preventDefault()
  const form = event.currentTarget
  if (!form.reportValidity()) return
  const data = new FormData(form)
  const subjectField = form.elements.namedItem("asunto")
  const subject = data.get("asunto")
    ? subjectField.selectedOptions[0].textContent
    : "Contacto desde Salvando Patitas Tampico"
  const body = `Nombre: ${data.get("nombre")}\nCorreo: ${data.get("email")}\n\n${data.get("mensaje")}`
  const email = `mailto:hola@salvandopatitastampico.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  document.querySelector("#email-draft").href = email
  document.querySelector("#form-feedback").hidden = false
  window.location.href = email
})
