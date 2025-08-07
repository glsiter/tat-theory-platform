<template>
  <div class="sync-manager">
    <!-- 同步状态指示器 -->
    <div class="sync-status" :class="syncStatusClass">
      <div class="status-indicator">
        <div v-if="syncStatus.syncInProgress" class="sync-spinner">
          <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
        
        <div v-else-if="syncStatus.isOnline" class="sync-online">
          <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <div v-else class="sync-offline">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-12.728 12.728m0-12.728l12.728 12.728" />
          </svg>
        </div>
      </div>
      
      <div class="status-text">
        <span class="status-label">{{ syncStatusText }}</span>
        <span v-if="syncStatus.lastSyncTime" class="last-sync">
          最后同步: {{ formatLastSync(syncStatus.lastSyncTime) }}
        </span>
      </div>
      
      <div v-if="syncStatus.pendingChanges > 0" class="pending-changes">
        {{ syncStatus.pendingChanges }} 个待同步更改
      </div>
    </div>

    <!-- 设备列表 -->
    <div v-if="showDeviceList" class="device-list">
      <h3 class="device-list-title">已连接设备</h3>
      
      <div class="devices">
        <div 
          v-for="device in connectedDevices" 
          :key="device.id"
          class="device-item"
          :class="{ 'current-device': device.isCurrent }"
        >
          <div class="device-icon">
            <component :is="getDeviceIcon(device.type)" class="w-5 h-5" />
          </div>
          
          <div class="device-info">
            <div class="device-name">{{ device.name }}</div>
            <div class="device-details">
              {{ device.type }} • {{ device.os }} • {{ formatLastActive(device.lastActive) }}
            </div>
          </div>
          
          <div class="device-status">
            <div v-if="device.isOnline" class="status-dot online" />
            <div v-else class="status-dot offline" />
          </div>
        </div>
      </div>
    </div>

    <!-- 同步冲突解决 -->
    <div v-if="syncConflicts.length > 0" class="sync-conflicts">
      <h3 class="conflicts-title">同步冲突</h3>
      
      <div class="conflicts-list">
        <div 
          v-for="conflict in syncConflicts" 
          :key="conflict.id"
          class="conflict-item"
        >
          <div class="conflict-info">
            <div class="conflict-module">{{ conflict.moduleName }}</div>
            <div class="conflict-description">{{ conflict.description }}</div>
          </div>
          
          <div class="conflict-actions">
            <button 
              @click="resolveConflict(conflict.id, 'local')"
              class="conflict-btn local"
            >
              使用本地版本
            </button>
            <button 
              @click="resolveConflict(conflict.id, 'remote')"
              class="conflict-btn remote"
            >
              使用云端版本
            </button>
            <button 
              @click="resolveConflict(conflict.id, 'merge')"
              class="conflict-btn merge"
            >
              合并
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 同步设置 -->
    <div v-if="showSettings" class="sync-settings">
      <h3 class="settings-title">同步设置</h3>
      
      <div class="settings-options">
        <label class="setting-item">
          <input 
            v-model="settings.autoSync" 
            type="checkbox"
            @change="updateSettings"
          />
          <span>自动同步</span>
        </label>
        
        <label class="setting-item">
          <input 
            v-model="settings.syncOnWifi" 
            type="checkbox"
            @change="updateSettings"
          />
          <span>仅在WiFi下同步</span>
        </label>
        
        <label class="setting-item">
          <input 
            v-model="settings.syncProgress" 
            type="checkbox"
            @change="updateSettings"
          />
          <span>同步学习进度</span>
        </label>
        
        <label class="setting-item">
          <input 
            v-model="settings.syncBookmarks" 
            type="checkbox"
            @change="updateSettings"
          />
          <span>同步书签</span>
        </label>
        
        <label class="setting-item">
          <input 
            v-model="settings.syncNotes" 
            type="checkbox"
            @change="updateSettings"
          />
          <span>同步笔记</span>
        </label>
        
        <label class="setting-item">
          <input 
            v-model="settings.syncPreferences" 
            type="checkbox"
            @change="updateSettings"
          />
          <span>同步偏好设置</span>
        </label>
      </div>
      
      <div class="settings-actions">
        <button @click="forceSyncAll" class="sync-btn primary">
          立即同步所有数据
        </button>
        <button @click="clearSyncData" class="sync-btn danger">
          清除同步数据
        </button>
      </div>
    </div>

    <!-- 同步统计 -->
    <div v-if="showStats" class="sync-stats">
      <h3 class="stats-title">同步统计</h3>
      
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-value">{{ stats.totalSyncs }}</div>
          <div class="stat-label">总同步次数</div>
        </div>
        
        <div class="stat-item">
          <div class="stat-value">{{ stats.successfulSyncs }}</div>
          <div class="stat-label">成功同步</div>
        </div>
        
        <div class="stat-item">
          <div class="stat-value">{{ stats.failedSyncs }}</div>
          <div class="stat-label">失败同步</div>
        </div>
        
        <div class="stat-item">
          <div class="stat-value">{{ formatDataSize(stats.dataSynced) }}</div>
          <div class="stat-label">已同步数据</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useLearningProgress } from '@/composables/useLearningProgress'
import { useResponsive } from '@/composables/useResponsive'

export interface CrossDeviceSyncProps {
  userId: string
  showDeviceList?: boolean
  showSettings?: boolean
  showStats?: boolean
  autoSync?: boolean
}

const props = withDefaults(defineProps<CrossDeviceSyncProps>(), {
  showDeviceList: true,
  showSettings: false,
  showStats: false,
  autoSync: true
})

interface ConnectedDevice {
  id: string
  name: string
  type: 'mobile' | 'tablet' | 'desktop'
  os: string
  lastActive: Date
  isOnline: boolean
  isCurrent: boolean
}

interface SyncConflict {
  id: string
  moduleName: string
  description: string
  localData: unknown
  remoteData: unknown
  timestamp: Date
}

interface SyncSettings {
  autoSync: boolean
  syncOnWifi: boolean
  syncProgress: boolean
  syncBookmarks: boolean
  syncNotes: boolean
  syncPreferences: boolean
}

interface SyncStats {
  totalSyncs: number
  successfulSyncs: number
  failedSyncs: number
  dataSynced: number
}

const { syncStatus, syncToServer, loadFromServer } = useLearningProgress(props.userId)
const { deviceInfo } = useResponsive()

const connectedDevices = ref<ConnectedDevice[]>([])
const syncConflicts = ref<SyncConflict[]>([])
const settings = ref<SyncSettings>({
  autoSync: props.autoSync,
  syncOnWifi: false,
  syncProgress: true,
  syncBookmarks: true,
  syncNotes: true,
  syncPreferences: true
})
const stats = ref<SyncStats>({
  totalSyncs: 0,
  successfulSyncs: 0,
  failedSyncs: 0,
  dataSynced: 0
})

// 同步状态类名
const syncStatusClass = computed(() => ({
  'status-online': syncStatus.value.isOnline && !syncStatus.value.syncInProgress,
  'status-syncing': syncStatus.value.syncInProgress,
  'status-offline': !syncStatus.value.isOnline,
  'status-pending': syncStatus.value.pendingChanges > 0
}))

// 同步状态文本
const syncStatusText = computed(() => {
  if (syncStatus.value.syncInProgress) return '正在同步...'
  if (!syncStatus.value.isOnline) return '离线模式'
  if (syncStatus.value.pendingChanges > 0) return '有待同步更改'
  return '已同步'
})

// 获取设备图标
const getDeviceIcon = (deviceType: string) => {
  const icons: Record<string, string> = {
    mobile: 'PhoneIcon',
    tablet: 'TabletIcon',
    desktop: 'ComputerDesktopIcon'
  }
  return icons[deviceType] || 'DevicePhoneMobileIcon'
}

// 格式化最后同步时间
const formatLastSync = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}小时前`
  
  const days = Math.floor(hours / 24)
  return `${days}天前`
}

// 格式化最后活跃时间
const formatLastActive = (date: Date) => {
  return formatLastSync(date)
}

// 格式化数据大小
const formatDataSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// 解决同步冲突
const resolveConflict = async (conflictId: string, resolution: 'local' | 'remote' | 'merge') => {
  const conflict = syncConflicts.value.find(c => c.id === conflictId)
  if (!conflict) return
  
  try {
    // 根据解决方案处理冲突
    switch (resolution) {
      case 'local':
        // 使用本地数据覆盖远程数据
        await syncToServer()
        break
      case 'remote':
        // 使用远程数据覆盖本地数据
        await loadFromServer()
        break
      case 'merge':
        // 合并数据（需要具体的合并逻辑）
        await mergeConflictData(conflict)
        break
    }
    
    // 移除已解决的冲突
    syncConflicts.value = syncConflicts.value.filter(c => c.id !== conflictId)
  } catch (error) {
    console.error('Failed to resolve conflict:', error)
  }
}

// 合并冲突数据
const mergeConflictData = async (conflict: SyncConflict) => {
  // 实现具体的数据合并逻辑
  // 这里需要根据数据类型进行不同的合并策略
  console.log('Merging conflict data:', conflict)
}

// 更新设置
const updateSettings = () => {
  localStorage.setItem(`sync_settings_${props.userId}`, JSON.stringify(settings.value))
  
  // 如果关闭自动同步，停止自动同步
  if (!settings.value.autoSync) {
    // 停止自动同步逻辑
  }
}

// 强制同步所有数据
const forceSyncAll = async () => {
  try {
    await syncToServer()
    await loadFromServer()
  } catch (error) {
    console.error('Failed to force sync:', error)
  }
}

// 清除同步数据
const clearSyncData = async () => {
  if (confirm('确定要清除所有同步数据吗？此操作不可撤销。')) {
    try {
      // 清除本地数据
      localStorage.removeItem(`tat_learning_progress_${props.userId}`)
      localStorage.removeItem(`sync_settings_${props.userId}`)
      
      // 清除服务器数据（需要API支持）
      // await clearServerData()
      
      // 重置统计
      stats.value = {
        totalSyncs: 0,
        successfulSyncs: 0,
        failedSyncs: 0,
        dataSynced: 0
      }
    } catch (error) {
      console.error('Failed to clear sync data:', error)
    }
  }
}

// 加载设置
const loadSettings = () => {
  const stored = localStorage.getItem(`sync_settings_${props.userId}`)
  if (stored) {
    try {
      settings.value = { ...settings.value, ...JSON.parse(stored) }
    } catch (error) {
      console.error('Failed to load sync settings:', error)
    }
  }
}

// 加载统计数据
const loadStats = () => {
  const stored = localStorage.getItem(`sync_stats_${props.userId}`)
  if (stored) {
    try {
      stats.value = JSON.parse(stored)
    } catch (error) {
      console.error('Failed to load sync stats:', error)
    }
  }
}


// 检测连接的设备
const detectConnectedDevices = () => {
  // 模拟设备检测逻辑
  // 实际实现需要通过WebRTC或其他P2P技术
  const currentDevice: ConnectedDevice = {
    id: 'current',
    name: `${deviceInfo.value?.type || 'Unknown'} Device`,
    type: deviceInfo.value?.type || 'desktop',
    os: navigator.platform,
    lastActive: new Date(),
    isOnline: true,
    isCurrent: true
  }
  
  connectedDevices.value = [currentDevice]
}

onMounted(() => {
  loadSettings()
  loadStats()
  detectConnectedDevices()
  
  // 监听同步事件
  window.addEventListener('online', () => {
    if (settings.value.autoSync) {
      syncToServer()
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('online', () => {})
})
</script>

<style scoped>
.sync-manager {
  @apply space-y-6;
}

/* 同步状态 */
.sync-status {
  @apply flex items-center gap-3 p-4 bg-white rounded-lg border;
}

.status-indicator {
  @apply flex-shrink-0;
}

.sync-spinner {
  @apply text-blue-500;
}

.sync-online {
  @apply text-green-500;
}

.sync-offline {
  @apply text-gray-400;
}

.status-text {
  @apply flex-1;
}

.status-label {
  @apply block font-medium text-gray-900;
}

.last-sync {
  @apply block text-sm text-gray-500;
}

.pending-changes {
  @apply text-sm text-orange-600 bg-orange-50 px-2 py-1 rounded;
}

/* 设备列表 */
.device-list {
  @apply bg-white rounded-lg border p-4;
}

.device-list-title {
  @apply font-semibold text-gray-900 mb-3;
}

.devices {
  @apply space-y-2;
}

.device-item {
  @apply flex items-center gap-3 p-3 rounded-lg border;
}

.device-item.current-device {
  @apply bg-blue-50 border-blue-200;
}

.device-icon {
  @apply flex-shrink-0 text-gray-500;
}

.device-info {
  @apply flex-1;
}

.device-name {
  @apply font-medium text-gray-900;
}

.device-details {
  @apply text-sm text-gray-500;
}

.device-status {
  @apply flex-shrink-0;
}

.status-dot {
  @apply w-2 h-2 rounded-full;
}

.status-dot.online {
  @apply bg-green-500;
}

.status-dot.offline {
  @apply bg-gray-400;
}

/* 同步冲突 */
.sync-conflicts {
  @apply bg-white rounded-lg border p-4;
}

.conflicts-title {
  @apply font-semibold text-gray-900 mb-3;
}

.conflicts-list {
  @apply space-y-3;
}

.conflict-item {
  @apply p-3 bg-red-50 border border-red-200 rounded-lg;
}

.conflict-info {
  @apply mb-3;
}

.conflict-module {
  @apply font-medium text-red-900;
}

.conflict-description {
  @apply text-sm text-red-700;
}

.conflict-actions {
  @apply flex gap-2;
}

.conflict-btn {
  @apply px-3 py-1 text-sm rounded border;
}

.conflict-btn.local {
  @apply bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200;
}

.conflict-btn.remote {
  @apply bg-green-100 text-green-800 border-green-200 hover:bg-green-200;
}

.conflict-btn.merge {
  @apply bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200;
}

/* 同步设置 */
.sync-settings {
  @apply bg-white rounded-lg border p-4;
}

.settings-title {
  @apply font-semibold text-gray-900 mb-3;
}

.settings-options {
  @apply space-y-3 mb-4;
}

.setting-item {
  @apply flex items-center gap-2 cursor-pointer;
}

.setting-item input[type="checkbox"] {
  @apply rounded border-gray-300 text-blue-600 focus:ring-blue-500;
}

.settings-actions {
  @apply flex gap-2 pt-3 border-t;
}

.sync-btn {
  @apply px-4 py-2 rounded-lg font-medium transition-colors;
}

.sync-btn.primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}

.sync-btn.danger {
  @apply bg-red-600 text-white hover:bg-red-700;
}

/* 同步统计 */
.sync-stats {
  @apply bg-white rounded-lg border p-4;
}

.stats-title {
  @apply font-semibold text-gray-900 mb-3;
}

.stats-grid {
  @apply grid grid-cols-2 md:grid-cols-4 gap-4;
}

.stat-item {
  @apply text-center;
}

.stat-value {
  @apply text-2xl font-bold text-gray-900;
}

.stat-label {
  @apply text-sm text-gray-500;
}

/* 响应式调整 */
@media (max-width: 640px) {
  .sync-status {
    @apply flex-col items-start gap-2;
  }
  
  .conflict-actions {
    @apply flex-col;
  }
  
  .settings-actions {
    @apply flex-col;
  }
}
</style>