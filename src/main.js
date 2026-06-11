const STORAGE_KEY = "ideamos-ecommerce-brief";
const FORM_ENDPOINT = "https://formsubmit.co/ajax/hola@ideamos.com.ar";

const form = document.querySelector("#campaign-form");
const steps = Array.from(document.querySelectorAll(".step"));
const prevButton = document.querySelector("#prev-button");
const nextButton = document.querySelector("#next-button");
const submitButton = document.querySelector("#submit-button");
const submitFeedback = document.querySelector("#submit-feedback");
const reviewSummary = document.querySelector("#review-summary");
const progressLabel = document.querySelector("#progress-label");
const progressTitle = document.querySelector("#progress-title");
const progressBar = document.querySelector("#progress-bar");
const successState = document.querySelector("#success-state");
const restartButton = document.querySelector("#restart-button");

const stepCount = steps.length;
const formSteps = steps.filter((step) => step.dataset.step !== "revision");
let currentStepIndex = 0;

const summarySections = [
  {
    title: "Contacto y negocio",
    items: [
      ["Empresa o marca", "company_name"],
      ["Sitio o canal principal", "website"],
      ["Contacto responsable", "contact_name"],
      ["Email", "contact_email"],
      ["WhatsApp", "contact_phone"],
      ["Redes o canales", "social_links"],
      ["Resumen del negocio", "business_overview"],
      ["Restriccion +18", "age_restriction"],
    ],
  },
  {
    title: "Marca",
    items: [
      ["Estado de la identidad", "brand_status"],
      ["Logo y assets", "logo_assets"],
      ["Paleta o preferencias", "color_preferences"],
      ["Tipografias", "brand_typography"],
      ["Manual de marca", "brand_manual"],
      ["Slogan", "brand_slogan"],
      ["Estilo visual", "visual_style"],
    ],
  },
  {
    title: "Referencias",
    items: [
      ["Webs de referencia", "reference_sites"],
      ["Que les gusta de esas referencias", "reference_feedback"],
    ],
  },
  {
    title: "Catalogo",
    items: [
      ["Categorias principales", "main_categories"],
      ["Cantidad estimada", "sku_count"],
      ["Catalogo en planilla", "catalog_format"],
      ["Informacion disponible por producto", "catalog_scope"],
      ["Productos prioritarios", "priority_products"],
      ["Fotos de producto", "product_photos"],
    ],
  },
  {
    title: "Imagenes",
    items: [
      ["Imagenes generales", "general_images"],
      ["Banners o promos", "banner_assets"],
      ["Uso de stock", "stock_image_support"],
    ],
  },
  {
    title: "Contenidos",
    items: [
      ["Contenido de Home", "homepage_content"],
      ["Contenido de Nosotros", "about_content"],
      ["FAQ y temas clave", "faq_topics"],
      ["Datos de contacto", "contact_content"],
      ["Politicas y legales", "policy_content"],
      ["Soporte de copy", "copy_support"],
    ],
  },
  {
    title: "Configuracion",
    items: [
      ["Plataforma actual", "current_platform"],
      ["Medios de pago", "payment_methods"],
      ["Transferencia bancaria", "bank_transfer_setup"],
      ["Metodos de envio", "shipping_methods"],
      ["Integraciones", "required_integrations"],
      ["Funciones especiales", "special_features"],
    ],
  },
  {
    title: "Tecnico y marketing",
    items: [
      ["Fecha ideal", "launch_timing"],
      ["Dominio, hosting y activos", "domains_assets"],
      ["Estado del hosting", "hosting_status"],
      ["Material de marketing", "marketing_assets"],
      ["Email administrador", "admin_email"],
      ["Vinculacion de Instagram", "instagram_connection"],
      ["Comentarios finales", "final_notes"],
    ],
  },
];

const validators = {
  contacto: [
    ["company_name", "Decinos el nombre de la empresa o marca."],
    ["contact_name", "Indicanos el contacto responsable."],
    ["contact_email", "Necesitamos un email de contacto valido."],
    ["contact_phone", "Compartinos un telefono o WhatsApp."],
    ["business_overview", "Contanos brevemente de que trata el negocio."],
    ["age_restriction", "Indicanos si la tienda necesita restriccion +18."],
  ],
  marca: [
    ["brand_status", "Contanos en que estado esta la identidad visual."],
    ["logo_assets", "Indicanos que logo o assets de marca tienen disponibles."],
    ["visual_style", "Defini el estilo visual deseado para la tienda."],
  ],
  referencias: [
    ["reference_sites", "Compartinos algunas webs de referencia."],
    ["reference_feedback", "Contanos que les gusta de esas referencias."],
  ],
  catalogo: [
    ["main_categories", "Especificanos las categorias principales del sitio."],
    ["sku_count", "Necesitamos una estimacion de productos o SKU."],
    ["catalog_format", "Indicanos si ya tienen el catalogo en planilla."],
    ["catalog_scope", "Contanos que informacion tienen disponible por producto."],
    ["product_photos", "Necesitamos saber con que fotos de producto cuentan."],
  ],
  imagenes: [
    ["general_images", "Contanos que imagenes generales tienen disponibles."],
    ["stock_image_support", "Indicanos si podemos complementar con banco de imagenes."],
  ],
  contenidos: [
    ["homepage_content", "Contanos que contenido tienen para la Home."],
    ["faq_topics", "Indicanos las preguntas frecuentes o temas clave."],
    ["contact_content", "Necesitamos los datos de contacto que debe mostrar el sitio."],
    ["copy_support", "Indicanos si necesitan apoyo con textos y contenidos."],
  ],
  configuracion: [
    ["payment_methods", "Defini los medios de pago a implementar."],
    ["shipping_methods", "Contanos como piensan resolver envios o entregas."],
    ["required_integrations", "Necesitamos conocer las integraciones clave."],
  ],
  tecnico: [
    ["launch_timing", "Contanos la fecha ideal o la prioridad del proyecto."],
    ["domains_assets", "Indicanos que dominio, hosting o activos tecnicos ya tienen."],
  ],
};

function sanitizeValue(value) {
  return value ? value.trim() : "";
}

function getFieldNodes(name) {
  return Array.from(form.querySelectorAll(`[name="${name}"]`));
}

function getFieldValue(name) {
  const nodes = getFieldNodes(name);

  if (!nodes.length) {
    return "";
  }

  const firstNode = nodes[0];

  if (firstNode.type === "checkbox") {
    return nodes.filter((node) => node.checked).map((node) => node.value);
  }

  if (firstNode.type === "radio") {
    const checked = nodes.find((node) => node.checked);
    return checked ? checked.value : "";
  }

  return sanitizeValue(firstNode.value);
}

function setFieldValue(name, value) {
  const nodes = getFieldNodes(name);

  if (!nodes.length || value == null) {
    return;
  }

  const firstNode = nodes[0];

  if (firstNode.type === "checkbox" && Array.isArray(value)) {
    nodes.forEach((node) => {
      node.checked = value.includes(node.value);
    });
    return;
  }

  if (firstNode.type === "radio") {
    nodes.forEach((node) => {
      node.checked = node.value === value;
    });
    return;
  }

  firstNode.value = value;
}

function clearErrors(step) {
  step.querySelectorAll(".has-error").forEach((node) => node.classList.remove("has-error"));
  step.querySelectorAll(".field-error").forEach((node) => {
    node.textContent = "";
  });
}

function findErrorContainer(name) {
  const nodes = getFieldNodes(name);
  if (nodes.length) {
    return nodes[0].closest(".field, .field-group");
  }
  return form.querySelector(`[data-group="${name}"]`);
}

function markError(name, message) {
  const container = findErrorContainer(name);
  if (!container) {
    return;
  }

  container.classList.add("has-error");
  const errorNode = container.querySelector(".field-error");
  if (errorNode) {
    errorNode.textContent = message;
  }
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidUrl(value) {
  const candidate = String(value).trim();

  if (!candidate) {
    return false;
  }

  const normalizedCandidate = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(candidate)
    ? candidate
    : `https://${candidate}`;

  try {
    const parsed = new URL(normalizedCandidate);
    return ["http:", "https:"].includes(parsed.protocol) && parsed.hostname.includes(".");
  } catch (_error) {
    return false;
  }
}

function validateStep(step) {
  clearErrors(step);

  const stepKey = step.dataset.step;
  const rules = validators[stepKey] || [];
  let isValid = true;

  rules.forEach(([name, message]) => {
    const value = getFieldValue(name);
    const isArray = Array.isArray(value);
    const hasValue = isArray ? value.length > 0 : value !== "";

    if (!hasValue) {
      markError(name, message);
      isValid = false;
      return;
    }

    if (name.includes("email") && !isValidEmail(String(value))) {
      markError(name, "Ingresa un email valido.");
      isValid = false;
    }

    if (name === "website" && value !== "" && !isValidUrl(String(value))) {
      markError(name, "Ingresa una web valida. Puede ser con o sin http:// o https://.");
      isValid = false;
    }
  });

  return isValid;
}

function saveDraft() {
  const snapshot = {};

  formSteps.forEach((step) => {
    step.querySelectorAll("[name]").forEach((node) => {
      snapshot[node.name] = getFieldValue(node.name);
    });
  });

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}

function loadDraft() {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return;
  }

  try {
    const data = JSON.parse(raw);
    Object.entries(data).forEach(([name, value]) => {
      setFieldValue(name, value);
    });
  } catch (_error) {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

function formatValue(value) {
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  return value || "Sin completar";
}

function buildReview() {
  reviewSummary.innerHTML = "";

  summarySections.forEach((section) => {
    const block = document.createElement("article");
    block.className = "review-block";

    const title = document.createElement("h4");
    title.textContent = section.title;
    block.appendChild(title);

    const list = document.createElement("div");
    list.className = "review-list";

    section.items.forEach(([label, name]) => {
      const value = getFieldValue(name);
      if (!value || (Array.isArray(value) && !value.length)) {
        return;
      }

      const item = document.createElement("div");
      item.className = "review-item";

      const strong = document.createElement("strong");
      strong.textContent = label;

      const span = document.createElement("span");
      span.textContent = formatValue(value);

      item.append(strong, span);
      list.appendChild(item);
    });

    if (!list.childElementCount) {
      const empty = document.createElement("div");
      empty.className = "review-item";
      const span = document.createElement("span");
      span.textContent = "Sin datos cargados.";
      empty.appendChild(span);
      list.appendChild(empty);
    }

    block.appendChild(list);
    reviewSummary.appendChild(block);
  });
}

function buildEmailBody() {
  const identityBlock = [
    "EMAIL",
    getFieldValue("contact_email") || "Sin completar",
    "",
    "NOMBRE",
    getFieldValue("contact_name") || "Sin completar",
    "",
    "EMPRESA",
    getFieldValue("company_name") || "Sin completar",
    "",
    "WHATSAPP",
    getFieldValue("contact_phone") || "Sin completar",
    "",
    "MENSAJE",
    "",
    "Hola equipo de Ideamos,",
    "",
    "Llego un nuevo brief para tienda online.",
    "Comparto abajo el resumen completo para revisar materiales, contenidos, configuracion y alcance del ecommerce.",
    "",
  ];

  const sections = summarySections
    .map((section) => {
      const lines = section.items
        .map(([label, name]) => {
          const value = getFieldValue(name);
          if (!value || (Array.isArray(value) && !value.length)) {
            return null;
          }

          return `- ${label}: ${formatValue(value)}`;
        })
        .filter(Boolean);

      if (!lines.length) {
        return null;
      }

      return [`${section.title.toUpperCase()}`, "----------------", ...lines, ""].join("\n");
    })
    .filter(Boolean);

  return [...identityBlock, ...sections, "", "Fin del brief."].join("\n");
}

function buildPayload() {
  const payload = new FormData();
  const companyName = getFieldValue("company_name") || "Nuevo brief";
  const contactEmail = getFieldValue("contact_email");

  payload.append("_subject", `Nuevo brief Ecommerce - ${companyName}`);
  payload.append("_captcha", "false");
  payload.append("_template", "basic");

  if (contactEmail) {
    payload.append("_replyto", contactEmail);
  }

  payload.append("MENSAJE", buildEmailBody());

  return payload;
}

function updateButtons() {
  const isReviewStep = currentStepIndex === stepCount - 1;

  prevButton.hidden = currentStepIndex === 0;
  nextButton.hidden = isReviewStep;
}

function updateProgress() {
  const currentStep = steps[currentStepIndex];
  const visualIndex = Math.min(currentStepIndex + 1, stepCount - 1);
  const progressPercent = ((visualIndex / (stepCount - 1)) * 100).toFixed(2);

  progressLabel.textContent = `Paso ${Math.min(currentStepIndex + 1, stepCount - 1)} de ${stepCount - 1}`;
  progressTitle.textContent = currentStep.dataset.title;
  progressBar.style.width = `${progressPercent}%`;
}

function setStep(nextIndex, pushHash = true) {
  currentStepIndex = nextIndex;

  steps.forEach((step, index) => {
    step.classList.toggle("is-active", index === currentStepIndex);
  });

  if (steps[currentStepIndex].dataset.step === "revision") {
    buildReview();
  }

  updateProgress();
  updateButtons();

  if (pushHash) {
    window.history.replaceState({}, "", `#${steps[currentStepIndex].dataset.step}`);
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function goNext() {
  const currentStep = steps[currentStepIndex];
  if (!validateStep(currentStep)) {
    return;
  }

  saveDraft();

  if (currentStepIndex < stepCount - 1) {
    setStep(currentStepIndex + 1);
  }
}

function goPrev() {
  if (currentStepIndex > 0) {
    setStep(currentStepIndex - 1);
  }
}

function showSubmitFeedback(message, type = "") {
  submitFeedback.textContent = message;
  submitFeedback.classList.remove("is-error", "is-success");

  if (type) {
    submitFeedback.classList.add(type);
  }
}

function openMailFallback() {
  const subject = `Nuevo brief Ecommerce - ${getFieldValue("company_name") || "Ideamos"}`;
  const body = buildEmailBody();
  const mailto = `mailto:hola@ideamos.com.ar?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
}

function getFirstInvalidStepIndex() {
  for (let index = 0; index < formSteps.length; index += 1) {
    if (!validateStep(formSteps[index])) {
      return index;
    }
  }

  return -1;
}

async function handleSubmit(event) {
  event.preventDefault();

  if (currentStepIndex !== stepCount - 1) {
    goNext();
    return;
  }

  const invalidStepIndex = getFirstInvalidStepIndex();
  if (invalidStepIndex >= 0) {
    setStep(invalidStepIndex);
    return;
  }

  submitButton.disabled = true;
  showSubmitFeedback("Enviando brief...", "");

  try {
    const response = await fetch(FORM_ENDPOINT, {
      method: "POST",
      body: buildPayload(),
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("send-failed");
    }

    window.localStorage.removeItem(STORAGE_KEY);
    form.hidden = true;
    successState.hidden = false;
    showSubmitFeedback("Brief enviado correctamente.", "is-success");
  } catch (_error) {
    showSubmitFeedback(
      "No pudimos confirmar el envio automatico. Te abrimos un mail de respaldo para que no pierdas la informacion.",
      "is-error",
    );
    openMailFallback();
  } finally {
    submitButton.disabled = false;
  }
}

function hydrateFromHash() {
  const hash = window.location.hash.replace("#", "");
  if (!hash) {
    setStep(0, false);
    return;
  }

  const targetIndex = steps.findIndex((step) => step.dataset.step === hash);
  setStep(targetIndex >= 0 ? targetIndex : 0, false);
}

function restartFlow() {
  form.reset();
  window.localStorage.removeItem(STORAGE_KEY);
  successState.hidden = true;
  form.hidden = false;
  showSubmitFeedback("", "");
  setStep(0);
}

form.addEventListener("input", saveDraft);
form.addEventListener("change", saveDraft);
prevButton.addEventListener("click", goPrev);
nextButton.addEventListener("click", goNext);
form.addEventListener("submit", handleSubmit);
restartButton.addEventListener("click", restartFlow);
window.addEventListener("hashchange", hydrateFromHash);

form.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") {
    return;
  }

  if (event.target instanceof HTMLTextAreaElement) {
    return;
  }

  if (event.target instanceof HTMLButtonElement) {
    return;
  }

  event.preventDefault();

  if (currentStepIndex === stepCount - 1) {
    submitButton.click();
    return;
  }

  goNext();
});

loadDraft();
hydrateFromHash();
updateButtons();
updateProgress();
