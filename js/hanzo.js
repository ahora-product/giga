;(function () {
  'use strict'

  var HERO_WORDS = ['Unlimited', 'Strategic', 'Product', 'Brand', 'Motion']
  var heroIndex = 0
  var heroWordEl = document.getElementById('hero-word')
  var heroTick = null

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  function setHeroWord(nextIndex, withAnimation) {
    if (!heroWordEl) return
    heroIndex = (nextIndex + HERO_WORDS.length) % HERO_WORDS.length
    var animate = withAnimation !== false && !prefersReducedMotion()

    function applyText() {
      heroWordEl.textContent = HERO_WORDS[heroIndex]
    }

    if (animate) {
      heroWordEl.classList.remove('is-animating')
      void heroWordEl.offsetWidth
      applyText()
      heroWordEl.classList.add('is-animating')
      window.setTimeout(function () {
        heroWordEl.classList.remove('is-animating')
      }, 560)
    } else {
      applyText()
    }
  }

  function heroPrev() {
    setHeroWord(heroIndex - 1, true)
  }

  function heroNext() {
    setHeroWord(heroIndex + 1, true)
  }

  var prevBtn = document.getElementById('hero-prev')
  var nextBtn = document.getElementById('hero-next')
  if (prevBtn) prevBtn.addEventListener('click', heroPrev)
  if (nextBtn) nextBtn.addEventListener('click', heroNext)

  if (!prefersReducedMotion()) {
    heroTick = window.setInterval(function () {
      setHeroWord(heroIndex + 1, true)
    }, 3200)
    window.addEventListener(
      'beforeunload',
      function () {
        if (heroTick) clearInterval(heroTick)
      },
      { once: true }
    )
  }

  var header = document.getElementById('site-header')
  function onScrollHeader() {
    if (!header) return
    if (window.scrollY > 24) header.classList.add('is-scrolled')
    else header.classList.remove('is-scrolled')
  }
  onScrollHeader()
  window.addEventListener('scroll', onScrollHeader, { passive: true })

  /** @type {NodeListOf<Element>} */
  var revealEls = document.querySelectorAll('[data-reveal]')
  revealEls.forEach(function (el) {
    var d = el.getAttribute('data-reveal-delay')
    if (d) el.style.setProperty('--reveal-delay', d + 'ms')
  })

  if (!prefersReducedMotion() && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          io.unobserve(entry.target)
        })
      },
      { root: null, rootMargin: '-50px 0px -8% 0px', threshold: 0.05 }
    )
    revealEls.forEach(function (el) {
      io.observe(el)
    })
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible')
    })
  }

  var faqItems = document.querySelectorAll('[data-faq-item]')
  faqItems.forEach(function (item) {
    var btn = item.querySelector('[data-faq-btn]')
    if (!btn) return
    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open')
      faqItems.forEach(function (other) {
        other.classList.remove('is-open')
        var b = other.querySelector('[data-faq-btn]')
        if (b) b.setAttribute('aria-expanded', 'false')
      })
      if (!isOpen) {
        item.classList.add('is-open')
        btn.setAttribute('aria-expanded', 'true')
      }
    })
  })
})()
