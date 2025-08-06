<template>
  <div class="concept-card" :class="{ 'expanded': isExpanded }" @click="toggleExpanded">
    <div class="card-header">
      <div class="concept-icon">{{ concept.icon }}</div>
      <div class="concept-info">
        <h3>{{ concept.title }}</h3>
        <p class="concept-subtitle">{{ concept.subtitle }}</p>
      </div>
      <button class="expand-btn" :class="{ 'rotated': isExpanded }">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>

    <div class="card-content" v-show="isExpanded">
      <div class="concept-description">
        <p>{{ concept.description }}</p>
      </div>

      <div class="concept-details">
        <h4>关键特征</h4>
        <div class="details-grid">
          <div v-for="detail in concept.details" :key="detail.label" class="detail-item">
            <span class="detail-label">{{ detail.label }}</span>
            <span class="detail-value">{{ detail.value }}</span>
          </div>
        </div>
      </div>

      <div class="concept-examples">
        <h4>典型示例</h4>
        <ul class="examples-list">
          <li v-for="example in concept.examples" :key="example">{{ example }}</li>
        </ul>
      </div>

      <div class="concept-actions">
        <button @click.stop="exploreMore" class="action-btn primary">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          深入探索
        </button>
        <button @click.stop="addToLearning" class="action-btn secondary">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          加入学习
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Props
interface ConceptData {
  id: string
  title: string
  subtitle: string
  icon: string
  description: string
  details: Array<{ label: string; value: string }>
  examples: string[]
}

interface Props {
  concept: ConceptData
  initialExpanded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  initialExpanded: false
})

// Emits
const emit = defineEmits<{
  explore: [conceptId: string]
  addToLearning: [conceptId: string]
}>()

// State
const isExpanded = ref(props.initialExpanded)

// Methods
function toggleExpanded(): void {
  isExpanded.value = !isExpanded.value
}

function exploreMore(): void {
  emit('explore', props.concept.id)
}

function addToLearning(): void {
  emit('addToLearning', props.concept.id)
}
</script>

<style scoped>
.concept-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: hidden;
  border: 2px solid transparent;
}

.concept-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
}

.concept-card.expanded {
  border-color: #3b82f6;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
}

.concept-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.concept-info {
  flex: 1;
}

.concept-info h3 {
  margin: 0 0 4px 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.concept-subtitle {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
  font-style: italic;
}

.expand-btn {
  padding: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  border-radius: 6px;
  transition: all 0.2s;
}

.expand-btn:hover {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.expand-btn.rotated {
  transform: rotate(180deg);
}

.card-content {
  padding: 24px;
  border-top: 1px solid #e5e7eb;
}

.concept-description {
  margin-bottom: 20px;
}

.concept-description p {
  color: #374151;
  line-height: 1.6;
  margin: 0;
}

.concept-details {
  margin-bottom: 20px;
}

.concept-details h4,
.concept-examples h4 {
  margin: 0 0 12px 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.details-grid {
  display: grid;
  gap: 8px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 6px;
}

.detail-label {
  font-weight: 500;
  color: #6b7280;
  font-size: 0.875rem;
}

.detail-value {
  color: #374151;
  font-size: 0.875rem;
}

.concept-examples {
  margin-bottom: 24px;
}

.examples-list {
  margin: 0;
  padding-left: 16px;
}

.examples-list li {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 6px;
}

.concept-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn.primary {
  background: #3b82f6;
  color: white;
  border: none;
}

.action-btn.primary:hover {
  background: #2563eb;
}

.action-btn.secondary {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.action-btn.secondary:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}
</style>