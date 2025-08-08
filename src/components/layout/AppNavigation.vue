<template>
  <nav class="app-navigation nav-figma">
    <div class="nav-container">
      <RouterLink to="/" class="nav-logo">
        <div class="logo-icon">🧠</div>
        <span class="logo-text">TAT理论平台</span>
      </RouterLink>

      <div class="nav-links">
        <RouterLink to="/" class="nav-link">首页</RouterLink>
        <RouterLink to="/theory-learning" class="nav-link">理论学习</RouterLink>
        <RouterLink to="/mind-map-test" class="nav-link">思维导图</RouterLink>
        <RouterLink to="/structural-equation" class="nav-link">结构方程</RouterLink>
        <RouterLink to="/documents" class="nav-link">文档资源</RouterLink>
        <RouterLink to="/about" class="nav-link">关于</RouterLink>
      </div>

      <button @click="toggleMobileMenu" class="mobile-menu-btn">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>

    <!-- 移动端菜单 -->
    <div v-if="showMobileMenu" class="mobile-menu">
      <RouterLink to="/" class="mobile-link" @click="closeMobileMenu">首页</RouterLink>
      <RouterLink to="/theory-learning" class="mobile-link" @click="closeMobileMenu"
        >理论学习</RouterLink
      >
      <RouterLink to="/mind-map-test" class="mobile-link" @click="closeMobileMenu"
        >思维导图</RouterLink
      >
      <RouterLink to="/structural-equation" class="mobile-link" @click="closeMobileMenu"
        >结构方程</RouterLink
      >
      <RouterLink to="/documents" class="mobile-link" @click="closeMobileMenu">文档资源</RouterLink>
      <RouterLink to="/about" class="mobile-link" @click="closeMobileMenu">关于</RouterLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const showMobileMenu = ref(false)

function toggleMobileMenu(): void {
  showMobileMenu.value = !showMobileMenu.value
}

function closeMobileMenu(): void {
  showMobileMenu.value = false
}
</script>

<style scoped>
.app-navigation.nav-figma {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(16px) saturate(180%);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 64px;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: var(--text-color);
  font-weight: 600;
  font-size: 1.125rem;
}

.logo-icon {
  font-size: 1.5rem;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-link {
  text-decoration: none;
  color: var(--muted-text-color);
  font-weight: 500;
  transition: color 0.2s;
  position: relative;
}

.nav-link:hover {
  color: var(--brand);
}

.nav-link.router-link-active {
  color: var(--brand);
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--brand);
  border-radius: 1px;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s;
}

.mobile-menu-btn:hover {
  background: rgba(99, 102, 241, 0.08);
  color: var(--brand);
}

.mobile-menu {
  display: none;
  flex-direction: column;
  background: var(--surface-color);
  border-top: 1px solid var(--border-color);
  padding: 16px 20px;
}

.mobile-link {
  display: block;
  padding: 12px 0;
  text-decoration: none;
  color: var(--muted-text-color);
  font-weight: 500;
  border-bottom: 1px solid rgba(148, 163, 184, 0.15);
  transition: color 0.2s;
}

.mobile-link:last-child {
  border-bottom: none;
}

.mobile-link:hover {
  color: var(--brand);
}

.mobile-link.router-link-active {
  color: var(--brand);
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }

  .mobile-menu-btn {
    display: block;
  }

  .mobile-menu {
    display: flex;
  }
}
</style>
