let container = document.querySelector("#cursor");
let customCursor = document.getElementById("custom-cursor");
let spotlight;

let trail = [];
const trailLength = 12;
const spacing = 2;
const history = [];
const maxHistory = trailLength * spacing;

let maskVisible = false;
let initialized = false;

function drawCursor() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  let trailCircles = "";
  for (let i = 0; i < trailLength; i++) {
    trailCircles += `
      <circle class="trail" r="150" cx="150" cy="150"
        fill="url(#spotlight-gradient)"
        filter="url(#blur)"
        opacity="${1 - i / trailLength}" />
    `;
  }

  container.innerHTML = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
      <defs>
        <radialGradient id="spotlight-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="black" stop-opacity="1"/>
          <stop offset="100%" stop-color="white" stop-opacity="1"/>
        </radialGradient>

        <filter id="blur">
          <feGaussianBlur stdDeviation="25" />
        </filter>

        <mask id="spotlight-mask">
          <rect width="100%" height="100%" fill="white"/>
          ${trailCircles}
        </mask>
      </defs>

      <rect width="100%" height="100%" fill="rgba(0,0,0,0.8)" mask="url(#spotlight-mask)" />
    </svg>
  `;

  trail = Array.from(container.querySelectorAll(".trail"));

  // hide cursor initially
  if (customCursor) {
    customCursor.style.opacity = "0";
  }
}

function updateCoordinates(e) {
  const x = e.type.match("touch") ? e.touches[0].clientX : e.clientX;
  const y = e.type.match("touch") ? e.touches[0].clientY : e.clientY;

  if (!initialized) {
    // instantly place cursor and trail on first move
    trail.forEach((el) => {
      el.setAttribute("cx", x);
      el.setAttribute("cy", y);
    });

    if (customCursor) {
      customCursor.style.transform = `translate(${x}px, ${y}px)`;
      customCursor.style.opacity = "1";
    }

    const mask = container.querySelector("#spotlight-mask");
    if (mask) {
      mask.classList.add("visible");
    }

    initialized = true;
    maskVisible = true;
    return; // skip animation on first frame
  }

  history.unshift({ x, y });
  if (history.length > maxHistory) history.pop();

  if (customCursor) {
    gsap.to(customCursor, {
      x,
      y,
      duration: 0.3,
      ease: "power3.out",
    });
  }

  trail.forEach((el, i) => {
    const point = history[i * spacing] || history[0];
    gsap.to(el, {
      attr: { cx: point.x, cy: point.y },
      duration: 0.3,
      ease: "power3.out",
    });
  });
}

function mousemoveCursor() {
  window.addEventListener(
    isTouchDevice() ? "touchmove" : "mousemove",
    updateCoordinates,
    { passive: true }
  );
}

function isTouchDevice() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

// Init
drawCursor();
mousemoveCursor();
window.addEventListener("resize", drawCursor);
