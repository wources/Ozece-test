// DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeLoadingScreen()
  initializeBusinessCard()
  initializeNewsletterForm()
  initializeAnimations()
  initializeAccessibility()
})

// Loading Screen
function initializeLoadingScreen() {
  const loadingOverlay = document.getElementById("loadingOverlay")

  // Hide loading screen after page loads
  window.addEventListener("load", () => {
    setTimeout(() => {
      loadingOverlay.classList.add("hidden")
      setTimeout(() => {
        loadingOverlay.style.display = "none"
      }, 500)
    }, 1500) // Show loading for 1.5 seconds
  })

  // Fallback: Hide loading screen after 3 seconds regardless
  setTimeout(() => {
    if (!loadingOverlay.classList.contains("hidden")) {
      loadingOverlay.classList.add("hidden")
      setTimeout(() => {
        loadingOverlay.style.display = "none"
      }, 500)
    }
  }, 3000)
}

// Business Card 3D Tilt Effect
function initializeBusinessCard() {
  const businessCard = document.getElementById("businessCard")
  const cardContent = businessCard.querySelector(".card-content")

  if (!businessCard || !cardContent) return

  let isHovering = false

  // Mouse move handler for 3D tilt effect
  function handleMouseMove(e) {
    if (!isHovering) return

    const rect = businessCard.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY

    const rotateX = (mouseY / rect.height) * -20 // Max 20 degrees
    const rotateY = (mouseX / rect.width) * 20 // Max 20 degrees

    cardContent.style.transform = `
            perspective(1000px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg) 
            translateZ(20px)
        `
  }

  // Mouse enter handler
  businessCard.addEventListener("mouseenter", () => {
    isHovering = true
    cardContent.style.transition = "transform 0.1s ease-out"
  })

  // Mouse leave handler
  businessCard.addEventListener("mouseleave", () => {
    isHovering = false
    cardContent.style.transition = "transform 0.3s ease-out"
    cardContent.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)"
  })

  // Mouse move handler
  businessCard.addEventListener("mousemove", handleMouseMove)

  // Touch support for mobile devices
  let touchStartX = 0
  let touchStartY = 0

  businessCard.addEventListener(
    "touchstart",
    (e) => {
      const touch = e.touches[0]
      touchStartX = touch.clientX
      touchStartY = touch.clientY

      // Add a subtle tilt on touch
      cardContent.style.transition = "transform 0.3s ease-out"
      cardContent.style.transform = "perspective(1000px) rotateX(2deg) rotateY(2deg) translateZ(10px)"
    },
    { passive: true },
  )

  businessCard.addEventListener(
    "touchend",
    () => {
      cardContent.style.transition = "transform 0.5s ease-out"
      cardContent.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)"
    },
    { passive: true },
  )

  // Click handler for accessibility
  businessCard.addEventListener("click", () => {
    // Add a click animation
    cardContent.style.transition = "transform 0.2s ease-out"
    cardContent.style.transform = "perspective(1000px) scale(0.98) translateZ(-10px)"

    setTimeout(() => {
      cardContent.style.transform = "perspective(1000px) scale(1) translateZ(0px)"
    }, 200)

    // Show contact info for screen readers
    const overlay = businessCard.querySelector(".card-overlay")
    if (overlay) {
      overlay.style.opacity = overlay.style.opacity === "1" ? "0" : "1"
      setTimeout(() => {
        overlay.style.opacity = "0"
      }, 3000)
    }
  })

  // Keyboard accessibility
  businessCard.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      businessCard.click()
    }
  })

  // Make card focusable
  businessCard.setAttribute("tabindex", "0")
  businessCard.setAttribute("role", "button")
  businessCard.setAttribute("aria-label", "İletişim bilgilerini görmek için tıklayın")
}

// Newsletter Form
function initializeNewsletterForm() {
  const form = document.getElementById("newsletterForm")
  if (!form) return

  form.addEventListener("submit", (e) => {
    e.preventDefault()

    const input = form.querySelector('input[type="email"]')
    const button = form.querySelector("button")
    const email = input.value.trim()

    if (!email) {
      showNotification("Lütfen e-posta adresinizi girin.", "error")
      return
    }

    if (!isValidEmail(email)) {
      showNotification("Lütfen geçerli bir e-posta adresi girin.", "error")
      return
    }

    // Show loading state
    const originalButtonContent = button.innerHTML
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'
    button.disabled = true

    // Simulate API call
    setTimeout(() => {
      // Reset button
      button.innerHTML = originalButtonContent
      button.disabled = false

      // Clear input
      input.value = ""

      // Show success message
      showNotification("Teşekkürler! Size haber vereceğiz.", "success")

      // Add some confetti effect
      createConfetti()
    }, 2000)
  })
}

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Notification system
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll(".notification")
  existingNotifications.forEach((notification) => notification.remove())

  // Create notification
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.setAttribute("role", "alert")
  notification.setAttribute("aria-live", "polite")

  const iconMap = {
    success: "fas fa-check-circle",
    error: "fas fa-exclamation-circle",
    info: "fas fa-info-circle",
  }

  const colorMap = {
    success: "#4CAF50",
    error: "#f44336",
    info: "#2196F3",
  }

  notification.innerHTML = `
        <div class="notification-content">
            <i class="${iconMap[type]}"></i>
            <span>${message}</span>
            <button class="notification-close" aria-label="Bildirimi kapat">&times;</button>
        </div>
    `

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${colorMap[type]};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 350px;
        display: flex;
        align-items: center;
        gap: 10px;
    `

  // Add to DOM
  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Close button functionality
  const closeBtn = notification.querySelector(".notification-close")
  closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: auto;
        padding: 0;
        line-height: 1;
    `

  closeBtn.addEventListener("click", () => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => notification.remove(), 300)
  })

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.transform = "translateX(100%)"
      setTimeout(() => notification.remove(), 300)
    }
  }, 5000)
}

// Confetti effect
function createConfetti() {
  const colors = ["#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B", "#FFC107"]
  const confettiCount = 50

  for (let i = 0; i < confettiCount; i++) {
    setTimeout(() => {
      const confetti = document.createElement("div")
      confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background-color: ${colors[Math.floor(Math.random() * colors.length)]};
                top: -10px;
                left: ${Math.random() * 100}%;
                z-index: 9999;
                pointer-events: none;
                border-radius: 50%;
                animation: confettiFall 3s linear forwards;
            `

      document.body.appendChild(confetti)

      setTimeout(() => {
        confetti.remove()
      }, 3000)
    }, i * 50)
  }
}

// Add confetti animation
const style = document.createElement("style")
style.textContent = `
    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`
document.head.appendChild(style)

// Initialize animations
function initializeAnimations() {
  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = "running"
      }
    })
  }, observerOptions)

  // Observe animated elements
  const animatedElements = document.querySelectorAll('[style*="animation"]')
  animatedElements.forEach((el) => {
    el.style.animationPlayState = "paused"
    observer.observe(el)
  })

  // Add parallax effect to floating shapes
  window.addEventListener(
    "scroll",
    throttle(() => {
      const scrolled = window.pageYOffset
      const shapes = document.querySelectorAll(".shape")

      shapes.forEach((shape, index) => {
        const speed = 0.5 + index * 0.1
        const yPos = -(scrolled * speed)
        shape.style.transform = `translateY(${yPos}px)`
      })
    }, 16),
  )
}

// Initialize accessibility features
function initializeAccessibility() {
  // Add skip link
  const skipLink = document.createElement("a")
  skipLink.href = "#main-content"
  skipLink.textContent = "Ana içeriğe geç"
  skipLink.className = "skip-link"
  skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #4CAF50;
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10000;
        transition: top 0.3s;
    `

  skipLink.addEventListener("focus", function () {
    this.style.top = "6px"
  })

  skipLink.addEventListener("blur", function () {
    this.style.top = "-40px"
  })

  document.body.insertBefore(skipLink, document.body.firstChild)

  // Add main content ID
  const contentWrapper = document.querySelector(".content-wrapper")
  if (contentWrapper) {
    contentWrapper.id = "main-content"
  }

  // Keyboard navigation for social links
  const socialLinks = document.querySelectorAll(".social-link")
  socialLinks.forEach((link) => {
    link.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        this.click()
      }
    })
  })

  // Focus management
  document.addEventListener("keydown", (e) => {
    // Escape key to close notifications
    if (e.key === "Escape") {
      const notifications = document.querySelectorAll(".notification")
      notifications.forEach((notification) => {
        notification.querySelector(".notification-close").click()
      })
    }
  })
}

// Utility function: Throttle
function throttle(func, limit) {
  let inThrottle
  return function () {
    const args = arguments
    
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Performance optimization: Reduce animations on low-end devices
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
  // Reduce floating shapes on low-end devices
  const shapes = document.querySelectorAll(".shape")
  shapes.forEach((shape, index) => {
    if (index > 3) {
      shape.style.display = "none"
    }
  })
}

// Error handling
window.addEventListener("error", (e) => {
  console.error("JavaScript error:", e.error)
})

// Analytics placeholder
function trackEvent(eventName, eventData = {}) {
  console.log("Event tracked:", eventName, eventData)
  // Add your analytics tracking code here
}

// Track user interactions
document.addEventListener("click", (e) => {
  const target = e.target.closest("a, button")
  if (target) {
    const text = target.textContent.trim()

    if (target.classList.contains("social-link")) {
      trackEvent("social_click", {
        platform: target.getAttribute("aria-label"),
        text: text,
      })
    } else if (target.type === "submit") {
      trackEvent("newsletter_submit", {
        text: text,
      })
    }
  }
})
