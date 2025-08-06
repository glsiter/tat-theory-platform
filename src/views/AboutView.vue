<template>
  <TatLayout>
    <template #header>
      <TatContainer>
        <div class="flex items-center justify-between py-4">
          <h1 class="text-2xl font-bold tat-text-gradient">TAT理论学习平台</h1>
          <nav class="flex gap-4">
            <TatButton variant="ghost" size="sm">首页</TatButton>
            <TatButton variant="ghost" size="sm">理论基础</TatButton>
            <TatButton variant="ghost" size="sm">研究应用</TatButton>
          </nav>
        </div>
      </TatContainer>
    </template>

    <TatContainer>
      <div class="space-y-8">
        <!-- Hero Section -->
        <section class="text-center py-12">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">
            特质激发理论学习平台
          </h2>
          <p class="text-xl text-gray-600 mb-8">
            深入理解TAT理论的核心概念、研究应用和实践指导
          </p>
          <div class="flex justify-center gap-4">
            <TatButton variant="primary" size="lg">
              <TheoryIcon :size="20" />
              开始学习
            </TatButton>
            <TatButton variant="outline" size="lg">
              <MindMapIcon :size="20" />
              浏览思维导图
            </TatButton>
          </div>
        </section>

        <!-- Feature Cards -->
        <section class="grid md:grid-cols-3 gap-6">
          <TatCard hover>
            <template #header>
              <div class="flex items-center gap-3">
                <TheoryIcon :size="24" color="#3b82f6" />
                <h3 class="text-lg font-semibold">理论基础</h3>
              </div>
            </template>
            <p class="text-gray-600">
              系统学习TAT理论的核心概念、发展历程和理论框架
            </p>
            <template #footer>
              <TatButton variant="primary" size="sm">了解更多</TatButton>
            </template>
          </TatCard>

          <TatCard hover>
            <template #header>
              <div class="flex items-center gap-3">
                <MindMapIcon :size="24" color="#8b5cf6" />
                <h3 class="text-lg font-semibold">交互式导图</h3>
              </div>
            </template>
            <p class="text-gray-600">
              通过交互式思维导图探索TAT理论的知识体系
            </p>
            <template #footer>
              <TatButton variant="secondary" size="sm">开始探索</TatButton>
            </template>
          </TatCard>

          <TatCard hover>
            <template #header>
              <div class="flex items-center gap-3">
                <AnalysisIcon :size="24" color="#10b981" />
                <h3 class="text-lg font-semibold">数据分析</h3>
              </div>
            </template>
            <p class="text-gray-600">
              学习TAT理论研究中的数据分析方法和实践应用
            </p>
            <template #footer>
              <TatButton variant="outline" size="sm">查看案例</TatButton>
            </template>
          </TatCard>
        </section>

        <!-- Modal Demo -->
        <section class="text-center">
          <TatButton @click="showModal = true">
            打开模态框演示
          </TatButton>
        </section>
      </div>
    </TatContainer>

    <template #footer>
      <TatContainer>
        <div class="text-center text-gray-600 py-4">
          <p>&copy; 2024 TAT理论学习平台. 专注于特质激发理论的教学与研究.</p>
        </div>
      </TatContainer>
    </template>
  </TatLayout>

  <!-- Modal Demo -->
  <TatModal v-model="showModal" title="TAT理论介绍" size="lg">
    <div class="space-y-4">
      <p class="text-gray-700">
        特质激发理论（Trait Activation Theory, TAT）是由Tett和Burnett在2003年提出的一个重要的组织行为学理论。
      </p>
      <p class="text-gray-700">
        该理论认为，个体的人格特质只有在相关的情境线索存在时才会被激发，进而影响个体的行为表现。
      </p>
      <div class="bg-blue-50 p-4 rounded-lg">
        <h4 class="font-semibold text-blue-900 mb-2">核心观点：</h4>
        <ul class="list-disc list-inside text-blue-800 space-y-1">
          <li>人格特质需要情境激发才能影响行为</li>
          <li>不同情境会激发不同的人格特质</li>
          <li>特质与情境的匹配程度决定行为表现</li>
        </ul>
      </div>
    </div>
    <template #footer>
      <TatButton variant="outline" @click="showModal = false">
        关闭
      </TatButton>
      <TatButton variant="primary" @click="showModal = false">
        开始学习
      </TatButton>
    </template>
  </TatModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  TatLayout,
  TatContainer,
  TatButton,
  TatCard,
  TatModal,
  TheoryIcon,
  MindMapIcon,
  AnalysisIcon
} from '@/components'

const showModal = ref(false)
</script>
