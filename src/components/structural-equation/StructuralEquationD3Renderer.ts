// D3.js渲染引擎 - 实现基础结构方程可视化
// 使用D3.js创建SVG画布和基础渲染逻辑
// 实现节点的动态定位和自适应布局算法
// 创建连接线的贝塞尔曲线绘制和路径计算
// 建立缩放、平移、重置等基础交互功能

import * as d3 from 'd3'
import type { 
  StructuralEquationModel, 
  StructuralEquationNode, 
  StructuralEquationRelationship 
} from '@/types/structural-equation'

export interface D3Node extends StructuralEquationNode {
  x: number
  y: number
  fx?: number | null
  fy?: number | null
  vx?: number
  vy?: number
}

export interface D3Link extends Omit<StructuralEquationRelationship, 'source' | 'target'> {
  source: D3Node
  target: D3Node
}

export class StructuralEquationD3Renderer {
  private container: HTMLElement
  private model: StructuralEquationModel
  private svg!: d3.Selection<SVGSVGElement, unknown, null, undefined>
  private g!: d3.Selection<SVGGElement, unknown, null, undefined>
  private width: number = 0
  private height: number = 0
  private nodes: D3Node[] = []
  private links: D3Link[] = []
  private simulation!: d3.Simulation<D3Node, D3Link>
  private zoom!: d3.ZoomBehavior<SVGSVGElement, unknown>
  private currentTransform: d3.ZoomTransform = d3.zoomIdentity
  private zoomChangeCallbacks: Array<(zoom: number) => void> = []
  private nodeClickCallbacks: Array<(node: D3Node) => void> = []
  private tooltip: d3.Selection<HTMLDivElement, unknown, null, undefined> | null = null
  private animationState: {
    isPlaying: boolean
    currentStep: number
    sequence: string | null
    speed: number
  } = {
    isPlaying: false,
    currentStep: 0,
    sequence: null,
    speed: 1
  }

  // 节点和连线的选择器
  private nodeGroups!: d3.Selection<SVGGElement, D3Node, SVGGElement, unknown>
  private linkGroups!: d3.Selection<SVGGElement, D3Link, SVGGElement, unknown>

  // 布局参数
  private readonly NODE_RADIUS = 40
  private readonly NODE_PADDING = 20
  private readonly LINK_DISTANCE = 150
  private readonly CHARGE_STRENGTH = -300
  private readonly MIN_ZOOM = 0.1
  private readonly MAX_ZOOM = 3

  constructor(container: HTMLElement, model: StructuralEquationModel) {
    this.container = container
    this.model = model
    this.initializeDimensions()
    this.prepareData()
    this.createSVG()
    this.setupZoom()
    this.setupSimulation()
  }

  async initialize(): Promise<void> {
    this.render()
    this.startSimulation()
  }

  private initializeDimensions(): void {
    const rect = this.container.getBoundingClientRect()
    this.width = rect.width || 800
    this.height = rect.height || 600
  }

  private prepareData(): void {
    // 转换节点数据
    this.nodes = Object.values(this.model.nodes).map(node => ({
      ...node,
      x: node.position.x * 2, // 放大坐标以适应画布
      y: node.position.y * 2,
      fx: null,
      fy: null
    }))

    // 转换连线数据
    this.links = this.model.relationships.map(rel => {
      const source = this.nodes.find(n => n.id === rel.source)
      const target = this.nodes.find(n => n.id === rel.target)
      
      if (!source || !target) {
        throw new Error(`Invalid relationship: ${rel.id}`)
      }

      return {
        ...rel,
        source,
        target
      }
    })
  }

  private createSVG(): void {
    // 清除现有内容
    d3.select(this.container).selectAll('*').remove()

    // 创建SVG元素
    this.svg = d3.select(this.container)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', `0 0 ${this.width} ${this.height}`)
      .style('background-color', '#fafafa')

    // 创建主要的g元素用于缩放和平移
    this.g = this.svg.append('g')
      .attr('class', 'main-group')

    // 添加箭头标记定义
    this.createArrowMarkers()

    // 创建工具提示
    this.createTooltip()
  }

  private createArrowMarkers(): void {
    const defs = this.svg.append('defs')

    // 创建不同类型的箭头标记
    const arrowTypes = [
      { id: 'arrow-activation', color: '#3B82F6' },
      { id: 'arrow-direct-effect', color: '#10B981' },
      { id: 'arrow-mediation', color: '#F59E0B' },
      { id: 'arrow-moderation', color: '#EF4444' },
      { id: 'arrow-feedback', color: '#8B5CF6' }
    ]

    arrowTypes.forEach(arrow => {
      defs.append('marker')
        .attr('id', arrow.id)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 8)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', arrow.color)
    })
  }

  private setupZoom(): void {
    this.zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([this.MIN_ZOOM, this.MAX_ZOOM])
      .on('zoom', (event) => {
        this.currentTransform = event.transform
        this.g.attr('transform', event.transform.toString())
        this.notifyZoomChange(event.transform.k)
      })

    this.svg.call(this.zoom)
  }

  private setupSimulation(): void {
    this.simulation = d3.forceSimulation<D3Node>(this.nodes)
      .force('link', d3.forceLink<D3Node, D3Link>(this.links)
        .id(d => d.id)
        .distance(this.LINK_DISTANCE)
        .strength(0.5)
      )
      .force('charge', d3.forceManyBody().strength(this.CHARGE_STRENGTH))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .force('collision', d3.forceCollide().radius(this.NODE_RADIUS + this.NODE_PADDING))
      .on('tick', () => this.updatePositions())
  }

  private render(): void {
    this.renderLinks()
    this.renderNodes()
  }

  private renderLinks(): void {
    this.linkGroups = this.g.selectAll<SVGGElement, D3Link>('.link-group')
      .data(this.links)
      .enter()
      .append('g')
      .attr('class', 'link-group')

    // 添加连线路径
    this.linkGroups.append('path')
      .attr('class', 'link-path')
      .attr('fill', 'none')
      .attr('stroke', d => this.getLinkColor(d.type))
      .attr('stroke-width', d => Math.max(1, d.strength * 3))
      .attr('stroke-opacity', 0.7)
      .attr('marker-end', d => `url(#arrow-${d.type})`)

    // 添加连线标签背景
    this.linkGroups.append('circle')
      .attr('class', 'link-label-bg')
      .attr('r', 12)
      .attr('fill', 'white')
      .attr('stroke', d => this.getLinkColor(d.type))
      .attr('stroke-width', 2)

    // 添加连线标签文本
    this.linkGroups.append('text')
      .attr('class', 'link-label')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('fill', d => this.getLinkColor(d.type))
      .text(d => d.label)
  }

  private renderNodes(): void {
    this.nodeGroups = this.g.selectAll<SVGGElement, D3Node>('.node-group')
      .data(this.nodes)
      .enter()
      .append('g')
      .attr('class', 'node-group')
      .style('cursor', 'pointer')

    // 添加节点圆形背景
    this.nodeGroups.append('circle')
      .attr('class', 'node-circle')
      .attr('r', this.NODE_RADIUS)
      .attr('fill', d => d.color)
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 3)
      .attr('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))')

    // 添加节点标签
    this.nodeGroups.append('text')
      .attr('class', 'node-label')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .attr('fill', '#374151')
      .style('pointer-events', 'none')
      .each(function(d) {
        const text = d3.select(this)
        const words = d.label.split('')
        
        // 处理长文本换行
        if (words.length > 6) {
          const midPoint = Math.ceil(words.length / 2)
          text.append('tspan')
            .attr('x', 0)
            .attr('dy', '-0.3em')
            .text(words.slice(0, midPoint).join(''))
          text.append('tspan')
            .attr('x', 0)
            .attr('dy', '1.2em')
            .text(words.slice(midPoint).join(''))
        } else {
          text.text(d.label)
        }
      })

    // 添加路径编号（如果存在）
    this.nodeGroups.filter(d => !!d.pathNumber)
      .append('circle')
      .attr('class', 'path-number-bg')
      .attr('cx', this.NODE_RADIUS - 10)
      .attr('cy', -this.NODE_RADIUS + 10)
      .attr('r', 10)
      .attr('fill', '#EF4444')
      .attr('stroke', 'white')
      .attr('stroke-width', 2)

    this.nodeGroups.filter(d => !!d.pathNumber)
      .append('text')
      .attr('class', 'path-number')
      .attr('x', this.NODE_RADIUS - 10)
      .attr('y', -this.NODE_RADIUS + 10)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .attr('fill', 'white')
      .text(d => d.pathNumber || '')

    // 添加交互事件
    this.setupNodeInteractions()
  }

  private setupNodeInteractions(): void {
    this.nodeGroups
      .on('mouseenter', (event, d) => {
        this.highlightNode(d, true)
        this.showNodeTooltip(event, d)
      })
      .on('mouseleave', (event, d) => {
        this.highlightNode(d, false)
        this.hideNodeTooltip()
      })
      .on('click', (event, d) => {
        event.stopPropagation()
        this.handleNodeClick(d)
      })
      .call(d3.drag<SVGGElement, D3Node>()
        .on('start', (event, d) => {
          if (!event.active) this.simulation.alphaTarget(0.3).restart()
          d.fx = d.x
          d.fy = d.y
        })
        .on('drag', (event, d) => {
          d.fx = event.x
          d.fy = event.y
        })
        .on('end', (event, d) => {
          if (!event.active) this.simulation.alphaTarget(0)
          d.fx = null
          d.fy = null
        })
      )
  }

  private highlightNode(node: D3Node, highlight: boolean): void {
    // 高亮节点
    this.nodeGroups
      .filter(d => d.id === node.id)
      .select('.node-circle')
      .transition()
      .duration(200)
      .attr('stroke-width', highlight ? 5 : 3)
      .attr('filter', highlight ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))')

    // 高亮相关连线
    this.linkGroups
      .filter(d => d.source.id === node.id || d.target.id === node.id)
      .select('.link-path')
      .transition()
      .duration(200)
      .attr('stroke-width', d => highlight ? Math.max(2, d.strength * 4) : Math.max(1, d.strength * 3))
      .attr('stroke-opacity', highlight ? 1 : 0.7)
  }

  private updatePositions(): void {
    // 更新连线位置
    this.linkGroups.select('.link-path')
      .attr('d', d => this.createLinkPath(d))

    // 更新连线标签位置
    this.linkGroups.select('.link-label-bg')
      .attr('cx', d => (d.source.x + d.target.x) / 2)
      .attr('cy', d => (d.source.y + d.target.y) / 2)

    this.linkGroups.select('.link-label')
      .attr('x', d => (d.source.x + d.target.x) / 2)
      .attr('y', d => (d.source.y + d.target.y) / 2)

    // 更新节点位置
    this.nodeGroups
      .attr('transform', d => `translate(${d.x}, ${d.y})`)
  }

  private createLinkPath(d: D3Link): string {
    const dx = d.target.x - d.source.x
    const dy = d.target.y - d.source.y
    const dr = Math.sqrt(dx * dx + dy * dy)
    
    // 计算节点边缘的连接点
    const sourceRadius = this.NODE_RADIUS
    const targetRadius = this.NODE_RADIUS
    
    const sourceX = d.source.x + (dx / dr) * sourceRadius
    const sourceY = d.source.y + (dy / dr) * sourceRadius
    const targetX = d.target.x - (dx / dr) * targetRadius
    const targetY = d.target.y - (dy / dr) * targetRadius

    // 创建贝塞尔曲线路径
    const midX = (sourceX + targetX) / 2
    const midY = (sourceY + targetY) / 2
    
    // 计算控制点以创建弯曲效果
    const controlOffset = 30
    const perpX = -dy / dr * controlOffset
    const perpY = dx / dr * controlOffset
    
    const controlX = midX + perpX
    const controlY = midY + perpY

    return `M ${sourceX} ${sourceY} Q ${controlX} ${controlY} ${targetX} ${targetY}`
  }

  private getLinkColor(type: string): string {
    const colorMap: Record<string, string> = {
      'activation': '#3B82F6',
      'direct-effect': '#10B981',
      'mediation': '#F59E0B',
      'moderation': '#EF4444',
      'feedback': '#8B5CF6'
    }
    return colorMap[type] || '#6B7280'
  }

  private startSimulation(): void {
    this.simulation.alpha(1).restart()
  }

  // 公共方法
  public resetView(): void {
    this.svg.transition()
      .duration(750)
      .call(this.zoom.transform, d3.zoomIdentity)
  }

  public zoomIn(): void {
    this.svg.transition()
      .duration(300)
      .call(this.zoom.scaleBy, 1.5)
  }

  public zoomOut(): void {
    this.svg.transition()
      .duration(300)
      .call(this.zoom.scaleBy, 1 / 1.5)
  }

  public resize(): void {
    this.initializeDimensions()
    this.svg
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', `0 0 ${this.width} ${this.height}`)
    
    this.simulation
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .alpha(0.3)
      .restart()
  }

  public onZoomChange(callback: (zoom: number) => void): void {
    this.zoomChangeCallbacks.push(callback)
  }

  private notifyZoomChange(zoom: number): void {
    this.zoomChangeCallbacks.forEach(callback => callback(zoom))
  }

  private createTooltip(): void {
    this.tooltip = d3.select(this.container)
      .append('div')
      .attr('class', 'node-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', 'rgba(0, 0, 0, 0.8)')
      .style('color', 'white')
      .style('padding', '8px 12px')
      .style('border-radius', '6px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('z-index', '1000')
      .style('max-width', '200px')
  }

  private showNodeTooltip(event: MouseEvent, node: D3Node): void {
    if (!this.tooltip) return

    const tooltipContent = `
      <div style="font-weight: bold; margin-bottom: 4px;">${node.label}</div>
      <div style="font-size: 11px; opacity: 0.9;">${node.description}</div>
      ${node.pathNumber ? `<div style="font-size: 11px; margin-top: 4px; color: #fbbf24;">路径 ${node.pathNumber}</div>` : ''}
    `

    this.tooltip
      .style('visibility', 'visible')
      .html(tooltipContent)
      .style('left', (event.offsetX + 10) + 'px')
      .style('top', (event.offsetY - 10) + 'px')
  }

  private hideNodeTooltip(): void {
    if (!this.tooltip) return
    this.tooltip.style('visibility', 'hidden')
  }

  private handleNodeClick(node: D3Node): void {
    // 添加点击动画效果
    this.nodeGroups
      .filter(d => d.id === node.id)
      .select('.node-circle')
      .transition()
      .duration(150)
      .attr('r', this.NODE_RADIUS * 1.2)
      .transition()
      .duration(150)
      .attr('r', this.NODE_RADIUS)

    // 触发回调
    this.nodeClickCallbacks.forEach(callback => callback(node))
  }

  // 公共方法
  public onNodeClick(callback: (node: D3Node) => void): void {
    this.nodeClickCallbacks.push(callback)
  }

  public offNodeClick(callback: (node: D3Node) => void): void {
    const index = this.nodeClickCallbacks.indexOf(callback)
    if (index > -1) {
      this.nodeClickCallbacks.splice(index, 1)
    }
  }

  public highlightNodeById(nodeId: string, highlight: boolean): void {
    const node = this.nodes.find(n => n.id === nodeId)
    if (node) {
      this.highlightNode(node, highlight)
    }
  }

  public highlightRelationshipPath(sourceId: string, targetId: string, highlight: boolean): void {
    // 高亮路径上的所有节点和连线
    const pathNodes = new Set([sourceId, targetId])
    const pathLinks = this.links.filter(l => 
      (l.source.id === sourceId && l.target.id === targetId) ||
      (l.source.id === targetId && l.target.id === sourceId)
    )

    // 高亮节点
    this.nodeGroups
      .filter(d => pathNodes.has(d.id))
      .select('.node-circle')
      .transition()
      .duration(200)
      .attr('stroke-width', highlight ? 5 : 3)
      .attr('filter', highlight ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))')

    // 高亮连线
    this.linkGroups
      .filter(d => pathLinks.some(pl => pl.id === d.id))
      .select('.link-path')
      .transition()
      .duration(200)
      .attr('stroke-width', d => highlight ? Math.max(3, d.strength * 5) : Math.max(1, d.strength * 3))
      .attr('stroke-opacity', highlight ? 1 : 0.7)
  }

  // 路径动画方法
  public startPathAnimation(sourceId: string, targetId: string, duration: number = 2000): Promise<void> {
    return new Promise((resolve) => {
      // 找到路径
      const sourceNode = this.nodes.find(n => n.id === sourceId)
      const targetNode = this.nodes.find(n => n.id === targetId)
      const pathLink = this.links.find(l => 
        l.source.id === sourceId && l.target.id === targetId
      )

      if (!sourceNode || !targetNode || !pathLink) {
        resolve()
        return
      }

      // 高亮起始节点
      this.highlightNode(sourceNode, true)

      // 创建动画粒子
      const particle = this.g.append('circle')
        .attr('class', 'animation-particle')
        .attr('r', 4)
        .attr('fill', '#3B82F6')
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .attr('cx', sourceNode.x)
        .attr('cy', sourceNode.y)
        .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))')

      // 高亮路径
      this.linkGroups
        .filter(d => d.id === pathLink.id)
        .select('.link-path')
        .transition()
        .duration(200)
        .attr('stroke-width', Math.max(4, pathLink.strength * 6))
        .attr('stroke-opacity', 1)

      // 粒子沿路径移动
      particle
        .transition()
        .duration(duration / this.animationState.speed)
        .ease(d3.easeLinear)
        .attr('cx', targetNode.x)
        .attr('cy', targetNode.y)
        .on('end', () => {
          // 高亮目标节点
          this.highlightNode(targetNode, true)
          
          // 移除粒子
          particle.remove()
          
          // 恢复路径样式
          setTimeout(() => {
            this.linkGroups
              .filter(d => d.id === pathLink.id)
              .select('.link-path')
              .transition()
              .duration(500)
              .attr('stroke-width', Math.max(1, pathLink.strength * 3))
              .attr('stroke-opacity', 0.7)
            
            this.highlightNode(sourceNode, false)
            this.highlightNode(targetNode, false)
            
            resolve()
          }, 1000)
        })
    })
  }

  public animateRelationshipStrength(relationshipId: string, strengthMultiplier: number = 2, duration: number = 1000): void {
    const relationship = this.links.find(l => l.id === relationshipId)
    if (!relationship) return

    this.linkGroups
      .filter(d => d.id === relationshipId)
      .select('.link-path')
      .transition()
      .duration(duration / 2 / this.animationState.speed)
      .attr('stroke-width', Math.max(2, relationship.strength * 3 * strengthMultiplier))
      .transition()
      .duration(duration / 2 / this.animationState.speed)
      .attr('stroke-width', Math.max(1, relationship.strength * 3))
  }

  public pulseNode(nodeId: string, duration: number = 1000): void {
    const node = this.nodes.find(n => n.id === nodeId)
    if (!node) return

    this.nodeGroups
      .filter(d => d.id === nodeId)
      .select('.node-circle')
      .transition()
      .duration(duration / 2 / this.animationState.speed)
      .attr('r', this.NODE_RADIUS * 1.3)
      .attr('stroke-width', 5)
      .transition()
      .duration(duration / 2 / this.animationState.speed)
      .attr('r', this.NODE_RADIUS)
      .attr('stroke-width', 3)
  }

  public highlightPathSequence(pathIds: string[], duration: number = 500): Promise<void> {
    return new Promise((resolve) => {
      let currentIndex = 0
      
      const highlightNext = () => {
        if (currentIndex >= pathIds.length) {
          resolve()
          return
        }

        const pathId = pathIds[currentIndex]
        const relationship = this.links.find(l => l.id === pathId)
        
        if (relationship) {
          // 高亮路径
          this.linkGroups
            .filter(d => d.id === pathId)
            .select('.link-path')
            .transition()
            .duration(duration / this.animationState.speed)
            .attr('stroke-width', Math.max(4, relationship.strength * 6))
            .attr('stroke-opacity', 1)
            .attr('stroke', '#F59E0B')

          // 高亮相关节点
          this.highlightNode(relationship.source, true)
          this.highlightNode(relationship.target, true)
        }

        currentIndex++
        setTimeout(highlightNext, duration / this.animationState.speed)
      }

      highlightNext()
    })
  }

  public resetAllHighlights(): void {
    // 重置所有节点
    this.nodeGroups
      .select('.node-circle')
      .transition()
      .duration(300)
      .attr('stroke-width', 3)
      .attr('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))')

    // 重置所有连线
    this.linkGroups
      .select('.link-path')
      .transition()
      .duration(300)
      .attr('stroke-width', d => Math.max(1, d.strength * 3))
      .attr('stroke-opacity', 0.7)
      .attr('stroke', d => this.getLinkColor(d.type))

    // 移除所有动画粒子
    this.g.selectAll('.animation-particle').remove()
  }

  public setAnimationSpeed(speed: number): void {
    this.animationState.speed = speed
  }

  public setAnimationState(isPlaying: boolean, step: number, sequence: string | null): void {
    this.animationState.isPlaying = isPlaying
    this.animationState.currentStep = step
    this.animationState.sequence = sequence
  }

  public destroy(): void {
    this.simulation.stop()
    d3.select(this.container).selectAll('*').remove()
    this.zoomChangeCallbacks = []
    this.nodeClickCallbacks = []
    this.tooltip = null
  }
}