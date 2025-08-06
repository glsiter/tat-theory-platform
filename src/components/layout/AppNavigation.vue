<template>
  <nav class="app-navigation">
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
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <!-- 移动端菜单 -->
    <div v-if="showMobileMenu" class="mobile-menu">
      <RouterLink to="/" class="mobile-link" @click="closeMobileMenu">首页</RouterLink>
      <RouterLink to="/theory-learning" class="mobile-link" @click="closeMobileMenu">理论学习</RouterLink>
      <RouterLink to="/mind-map-test" class="mobile-link" @click="closeMobileMenu">思维导图</RouterLink>
      <RouterLink to="/structural-equation" class="mobile-link" @click="closeMobileMenu">结构方程</RouterLink>
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
.app-navigation {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e5e7eb;
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
  color: #1f2937;
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
  color: #6b7280;
  font-weight: 500;
  transition: color 0.2s;
  position: relative;
}

.nav-link:hover {
  color: #3b82f6;
}

.nav-link.router-link-active {
  color: #3b82f6;
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  right: 0;
  height: 2px;
  background: #3b82f6;
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
  background: #f3f4f6;
  color: #374151;
}

.mobile-menu {
  display: none;
  flex-direction: column;
  background: white;
  border-top: 1px solid #e5e7eb;
  padding: 16px 20px;
}

.mobile-link {
  display: block;
  padding: 12px 0;
  text-decoration: none;
  color: #6b7280;
  font-weight: 500;
  border-bottom: 1px solid #f3f4f6;
  transition: color 0.2s;
}

.mobile-link:last-child {
  border-bottom: none;
}

.mobile-link:hover {
  color: #3b82f6;
}

.mobile-link.router-link-active {
  color: #3b82f6;
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