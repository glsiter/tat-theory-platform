// TAT理论结构方程服务类
// 实现节点详细信息、研究证据、案例数据的管理
// 创建路径关系的动态计算和验证逻辑
// 建立结构方程的版本管理和更新机制

import type { 
  StructuralEquationModel, 
  StructuralEquationNode, 
  StructuralEquationRelationship,
  PathCalculationResult,
  PathInfo,
  DynamicValidation,
  ValidationResult,
  ChangeHistoryEntry
} from '@/types/structural-equation'
import { structuralEquationModel } from '@/data/structural-equation-model'

export class StructuralEquationService {
  private model: StructuralEquationModel
  private changeListeners: Array<(change: ChangeHistoryEntry) => void> = []

  constructor() {
    this.model = { ...structuralEquationModel }
  }

  // 获取完整模型
  getModel(): StructuralEquationModel {
    return this.model
  }

  // 获取节点信息
  getNode(nodeId: string): StructuralEquationNode | null {
    return this.model.nodes[nodeId] || null
  }

  // 获取节点的详细信息，包括研究证据和案例
  getNodeDetails(nodeId: string): {
    node: StructuralEquationNode | null
    incomingRelationships: StructuralEquationRelationship[]
    outgoingRelationships: StructuralEquationRelationship[]
    relatedNodes: StructuralEquationNode[]
  } {
    const node = this.getNode(nodeId)
    if (!node) {
      return {
        node: null,
        incomingRelationships: [],
        outgoingRelationships: [],
        relatedNodes: []
      }
    }

    const incomingRelationships = this.model.relationships.filter(rel => rel.target === nodeId)
    const outgoingRelationships = this.model.relationships.filter(rel => rel.source === nodeId)
    
    const relatedNodeIds = new Set([
      ...incomingRelationships.map(rel => rel.source),
      ...outgoingRelationships.map(rel => rel.target)
    ])
    
    const relatedNodes = Array.from(relatedNodeIds)
      .map(id => this.model.nodes[id])
      .filter(Boolean)

    return {
      node,
      incomingRelationships,
      outgoingRelationships,
      relatedNodes
    }
  }

  // 获取关系信息
  getRelationship(relationshipId: string): StructuralEquationRelationship | null {
    return this.model.relationships.find(rel => rel.id === relationshipId) || null
  }

  // 计算两个节点之间的路径
  calculatePaths(sourceId: string, targetId: string): PathCalculationResult {
    const directPaths = this.findDirectPaths(sourceId, targetId)
    const indirectPaths = this.findIndirectPaths(sourceId, targetId)
    
    const directEffect = directPaths.reduce((sum, path) => sum + path.totalStrength, 0)
    const indirectEffect = indirectPaths.reduce((sum, path) => sum + path.totalStrength, 0)
    const totalEffect = directEffect + indirectEffect

    return {
      directPaths,
      indirectPaths,
      totalEffect,
      directEffect,
      indirectEffect
    }
  }

  // 查找直接路径
  private findDirectPaths(sourceId: string, targetId: string): PathInfo[] {
    const directRelationships = this.model.relationships.filter(
      rel => rel.source === sourceId && rel.target === targetId
    )

    return directRelationships.map(rel => ({
      id: `direct-${rel.id}`,
      nodes: [sourceId, targetId],
      relationships: [rel.id],
      totalStrength: rel.strength,
      pathType: 'direct' as const,
      description: `直接路径: ${this.model.nodes[sourceId]?.label} → ${this.model.nodes[targetId]?.label}`
    }))
  }

  // 查找间接路径（通过中介节点）
  private findIndirectPaths(sourceId: string, targetId: string, visited: Set<string> = new Set(), maxDepth: number = 3): PathInfo[] {
    if (maxDepth <= 0 || visited.has(sourceId)) {
      return []
    }

    const indirectPaths: PathInfo[] = []
    visited.add(sourceId)

    // 找到从源节点出发的所有关系
    const outgoingRelationships = this.model.relationships.filter(rel => rel.source === sourceId)

    for (const rel of outgoingRelationships) {
      if (rel.target === targetId) {
        continue // 跳过直接路径
      }

      // 递归查找从中介节点到目标节点的路径
      const subPaths = this.findIndirectPaths(rel.target, targetId, new Set(visited), maxDepth - 1)
      
      for (const subPath of subPaths) {
        const pathStrength = rel.strength * subPath.totalStrength
        indirectPaths.push({
          id: `indirect-${rel.id}-${subPath.id}`,
          nodes: [sourceId, ...subPath.nodes],
          relationships: [rel.id, ...subPath.relationships],
          totalStrength: pathStrength,
          pathType: 'mediated' as const,
          description: `间接路径: ${[sourceId, ...subPath.nodes].map(id => this.model.nodes[id]?.label).join(' → ')}`
        })
      }
    }

    visited.delete(sourceId)
    return indirectPaths
  }

  // 动态验证模型
  validateModel(): DynamicValidation {
    const validation: DynamicValidation = {
      structuralConsistency: true,
      theoreticalAlignment: true,
      empiricalSupport: true,
      missingConnections: [],
      redundantConnections: [],
      recommendations: []
    }

    // 检查结构一致性
    this.validateStructuralConsistency(validation)
    
    // 检查理论对齐
    this.validateTheoreticalAlignment(validation)
    
    // 检查实证支持
    this.validateEmpiricalSupport(validation)

    return validation
  }

  private validateStructuralConsistency(validation: DynamicValidation): void {
    // 检查孤立节点
    const connectedNodes = new Set<string>()
    this.model.relationships.forEach(rel => {
      connectedNodes.add(rel.source)
      connectedNodes.add(rel.target)
    })

    const allNodeIds = Object.keys(this.model.nodes)
    const isolatedNodes = allNodeIds.filter(id => !connectedNodes.has(id))
    
    if (isolatedNodes.length > 0) {
      validation.structuralConsistency = false
      validation.recommendations.push(`发现孤立节点: ${isolatedNodes.join(', ')}`)
    }

    // 检查循环依赖
    const hasCycles = this.detectCycles()
    if (hasCycles.length > 0) {
      validation.recommendations.push(`检测到循环依赖: ${hasCycles.join(', ')}`)
    }
  }

  private validateTheoreticalAlignment(validation: DynamicValidation): void {
    // 检查TAT理论的核心路径是否存在
    const corePathExists = this.model.relationships.some(
      rel => rel.source === 'personality-traits' && rel.target === 'trait-activation'
    )
    
    if (!corePathExists) {
      validation.theoreticalAlignment = false
      validation.missingConnections.push('人格特质 → 特质激发')
    }

    // 检查情境因素是否都连接到人格特质
    const situationalNodes = ['organizational-level', 'social-level', 'task-level']
    for (const nodeId of situationalNodes) {
      const hasConnection = this.model.relationships.some(
        rel => rel.source === nodeId && rel.target === 'personality-traits'
      )
      if (!hasConnection) {
        validation.missingConnections.push(`${this.model.nodes[nodeId]?.label} → 人格特质`)
      }
    }
  }

  private validateEmpiricalSupport(validation: DynamicValidation): void {
    // 检查每个关系是否有足够的实证支持
    for (const relationship of this.model.relationships) {
      if (relationship.researchEvidence.length === 0) {
        validation.empiricalSupport = false
        validation.recommendations.push(`关系 "${relationship.label}" 缺乏实证支持`)
      }
      
      // 检查研究证据的质量
      const highQualityEvidence = relationship.researchEvidence.filter(
        evidence => evidence.validity === 'high' && evidence.reliability > 0.8
      )
      
      if (highQualityEvidence.length === 0) {
        validation.recommendations.push(`关系 "${relationship.label}" 需要更高质量的实证支持`)
      }
    }
  }

  private detectCycles(): string[] {
    const cycles: string[] = []
    const visited = new Set<string>()
    const recursionStack = new Set<string>()

    const dfs = (nodeId: string, path: string[]): void => {
      if (recursionStack.has(nodeId)) {
        const cycleStart = path.indexOf(nodeId)
        if (cycleStart !== -1) {
          cycles.push(path.slice(cycleStart).concat(nodeId).join(' → '))
        }
        return
      }

      if (visited.has(nodeId)) {
        return
      }

      visited.add(nodeId)
      recursionStack.add(nodeId)

      const outgoingRelationships = this.model.relationships.filter(rel => rel.source === nodeId)
      for (const rel of outgoingRelationships) {
        dfs(rel.target, [...path, nodeId])
      }

      recursionStack.delete(nodeId)
    }

    for (const nodeId of Object.keys(this.model.nodes)) {
      if (!visited.has(nodeId)) {
        dfs(nodeId, [])
      }
    }

    return cycles
  }

  // 更新节点
  updateNode(nodeId: string, updates: Partial<StructuralEquationNode>): boolean {
    const node = this.model.nodes[nodeId]
    if (!node) {
      return false
    }

    const oldNode = { ...node }
    Object.assign(node, updates, { 
      lastUpdated: new Date(),
      version: this.incrementVersion(node.version)
    })

    this.recordChange({
      id: `change-${Date.now()}`,
      timestamp: new Date(),
      changeType: 'node-modified',
      elementId: nodeId,
      changes: this.getChanges(oldNode, node),
      author: 'user',
      reason: '节点更新'
    })

    return true
  }

  // 更新关系
  updateRelationship(relationshipId: string, updates: Partial<StructuralEquationRelationship>): boolean {
    const relationshipIndex = this.model.relationships.findIndex(rel => rel.id === relationshipId)
    if (relationshipIndex === -1) {
      return false
    }

    const oldRelationship = { ...this.model.relationships[relationshipIndex] }
    Object.assign(this.model.relationships[relationshipIndex], updates, {
      lastUpdated: new Date(),
      version: this.incrementVersion(oldRelationship.version)
    })

    this.recordChange({
      id: `change-${Date.now()}`,
      timestamp: new Date(),
      changeType: 'relationship-modified',
      elementId: relationshipId,
      changes: this.getChanges(oldRelationship, this.model.relationships[relationshipIndex]),
      author: 'user',
      reason: '关系更新'
    })

    return true
  }

  // 添加研究证据
  addResearchEvidence(nodeId: string, evidence: any): boolean {
    const node = this.model.nodes[nodeId]
    if (!node) {
      return false
    }

    node.researchEvidence.push(evidence)
    node.lastUpdated = new Date()

    this.recordChange({
      id: `change-${Date.now()}`,
      timestamp: new Date(),
      changeType: 'node-modified',
      elementId: nodeId,
      changes: { researchEvidence: { old: node.researchEvidence.length - 1, new: node.researchEvidence.length } },
      author: 'user',
      reason: '添加研究证据'
    })

    return true
  }

  // 添加案例研究
  addCaseStudy(nodeId: string, caseStudy: any): boolean {
    const node = this.model.nodes[nodeId]
    if (!node) {
      return false
    }

    node.caseStudies.push(caseStudy)
    node.lastUpdated = new Date()

    this.recordChange({
      id: `change-${Date.now()}`,
      timestamp: new Date(),
      changeType: 'node-modified',
      elementId: nodeId,
      changes: { caseStudies: { old: node.caseStudies.length - 1, new: node.caseStudies.length } },
      author: 'user',
      reason: '添加案例研究'
    })

    return true
  }

  // 获取模型版本历史
  getVersionHistory(): ChangeHistoryEntry[] {
    return [...this.model.changeHistory].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  // 导出模型
  exportModel(): string {
    return JSON.stringify(this.model, null, 2)
  }

  // 导入模型
  importModel(modelData: string): boolean {
    try {
      const importedModel = JSON.parse(modelData) as StructuralEquationModel
      
      // 验证导入的模型
      if (this.validateImportedModel(importedModel)) {
        this.model = importedModel
        this.notifyChangeListeners({
          id: `change-${Date.now()}`,
          timestamp: new Date(),
          changeType: 'node-added',
          elementId: 'model-import',
          changes: {},
          author: 'user',
          reason: '模型导入'
        })
        return true
      }
      return false
    } catch (error) {
      console.error('模型导入失败:', error)
      return false
    }
  }

  // 私有辅助方法
  private incrementVersion(version: string): string {
    const parts = version.split('.')
    const patch = parseInt(parts[parts.length - 1]) + 1
    parts[parts.length - 1] = patch.toString()
    return parts.join('.')
  }

  private getChanges(oldObj: any, newObj: any): Record<string, { old: any; new: any }> {
    const changes: Record<string, { old: any; new: any }> = {}
    
    for (const key in newObj) {
      if (oldObj[key] !== newObj[key]) {
        changes[key] = { old: oldObj[key], new: newObj[key] }
      }
    }
    
    return changes
  }

  private recordChange(change: ChangeHistoryEntry): void {
    this.model.changeHistory.push(change)
    this.model.lastUpdated = new Date()
    this.notifyChangeListeners(change)
  }

  private notifyChangeListeners(change: ChangeHistoryEntry): void {
    this.changeListeners.forEach(listener => listener(change))
  }

  private validateImportedModel(model: any): boolean {
    return (
      model &&
      typeof model === 'object' &&
      model.id &&
      model.nodes &&
      model.relationships &&
      Array.isArray(model.relationships)
    )
  }

  // 注册变更监听器
  onModelChange(listener: (change: ChangeHistoryEntry) => void): void {
    this.changeListeners.push(listener)
  }

  // 移除变更监听器
  offModelChange(listener: (change: ChangeHistoryEntry) => void): void {
    const index = this.changeListeners.indexOf(listener)
    if (index > -1) {
      this.changeListeners.splice(index, 1)
    }
  }
}

// 单例实例
export const structuralEquationService = new StructuralEquationService()