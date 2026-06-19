<template>
  <!-- CSS-only geometric brand pattern — no external images required -->
  <div class="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    <!-- dot grid overlay -->
    <div class="absolute inset-0 brand-dot-pattern opacity-40"></div>
    <!-- top-right decorative hex cluster -->
    <div class="absolute -top-10 -right-10 w-64 h-64 opacity-10">
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" fill="none">
        <polygon points="100,10 170,50 170,130 100,170 30,130 30,50" stroke="#00bf63" stroke-width="1.5"/>
        <polygon points="100,30 155,62 155,122 100,154 45,122 45,62" stroke="#00bf63" stroke-width="1"/>
        <polygon points="100,50 140,74 140,114 100,138 60,114 60,74" stroke="#00bf63" stroke-width="0.75"/>
        <circle cx="100" cy="100" r="6" fill="#00bf63"/>
        <circle cx="100" cy="100" r="20" stroke="#00bf63" stroke-width="0.5"/>
      </svg>
    </div>
    <!-- bottom-left decorative circles -->
    <div class="absolute -bottom-10 -left-10 w-56 h-56 opacity-10">
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" fill="none">
        <circle cx="100" cy="100" r="90" stroke="#00bf63" stroke-width="1.5"/>
        <circle cx="100" cy="100" r="65" stroke="#00bf63" stroke-width="1"/>
        <circle cx="100" cy="100" r="40" stroke="#00bf63" stroke-width="0.75"/>
        <circle cx="100" cy="100" r="10" fill="#00bf63"/>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.brand-dot-pattern {
  background-image: radial-gradient(circle, rgba(0, 191, 99, 0.25) 1px, transparent 1px);
  background-size: 24px 24px;
}
</style>
