<script setup lang="ts">
// TAT理论学习平台主页
</script>

<template>
  <main class="home-view">
    <div class="hero-section">
      <h1 class="hero-title">TAT理论学习平台</h1>
      <p class="hero-subtitle">特质激发理论 (Trait Activation Theory) 交互式学习体验</p>
      
      <div class="navigation-cards">
        <RouterLink to="/theory-learning" class="nav-card">
          <div class="card-icon">📚</div>
          <h3>理论学习</h3>
          <p>3D动画引导的理论概述和渐进式学习体验</p>
        </RouterLink>

        <RouterLink to="/mind-map-test" class="nav-card">
          <div class="card-icon">🗺️</div>
          <h3>思维导图</h3>
          <p>交互式思维导图探索TAT理论知识图谱</p>
        </RouterLink>

        <RouterLink to="/structural-equation" class="nav-card">
          <div class="card-icon">📊</div>
          <h3>结构方程</h3>
          <p>可视化结构方程模型和理论机制</p>
        </RouterLink>

        <RouterLink to="/documents" class="nav-card">
          <div class="card-icon">📚</div>
          <h3>文档资源</h3>
          <p>TAT理论相关的研究文档和学习资料</p>
        </RouterLink>

        <RouterLink to="/about" class="nav-card">
          <div class="card-icon">ℹ️</div>
          <h3>关于平台</h3>
          <p>了解平台功能和使用指南</p>
        </RouterLink>
      </div>
    </div>

    <div class="features-section">
      <h2>平台特色</h2>
      <div class="features-grid">
        <div class="feature-item">
          <div class="feature-icon">🎯</div>
          <h3>交互式学习</h3>
          <p>通过3D动画和交互式组件深度理解理论概念</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">🧠</div>
          <h3>渐进式引导</h3>
          <p>科学的学习路径设计，循序渐进掌握知识</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">📈</div>
          <h3>可视化展示</h3>
          <p>复杂理论概念通过图表和动画直观呈现</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">🎨</div>
          <h3>现代化设计</h3>
          <p>美观的界面设计和流畅的用户体验</p>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.home-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.hero-section {
  padding: 80px 20px;
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 48px;
  opacity: 0.9;
}

.navigation-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 80px;
}

.nav-card {
  display: block;
  padding: 32px 24px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-decoration: none;
  color: white;
  transition: all 0.3s ease;
}

.nav-card:hover {
  transform: translateY(-8px);
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.nav-card h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 12px;
}

.nav-card p {
  opacity: 0.9;
  line-height: 1.6;
}

.features-section {
  background: rgba(255, 255, 255, 0.05);
  padding: 80px 20px;
  text-align: center;
}

.features-section h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 48px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 32px;
  max-width: 1000px;
  margin: 0 auto;
}

.feature-item {
  padding: 24px;
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 16px;
}

.feature-item h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 12px;
}

.feature-item p {
  opacity: 0.9;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .navigation-cards {
    grid-template-columns: 1fr;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
