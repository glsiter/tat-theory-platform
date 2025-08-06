// TAT理论思维导图D3.js渲染引擎
// 使用D3.js创建力导向图布局算法
// 实现节点的层级结构和动态展开逻辑
// 创建平滑的缩放和平移交互体验
// 建立节点样式和主题的动态切换

import * as d3 from 'd3'
import type { MindMapNode, MindMapStructure, MindMapRelationship } from '@/types/mind-map'

export interface D3Node extends d3.SimulationNodeDatum {
  id: string
  data: MindMapNode
  x?: number
  y?: number
  fx?: number | null
  fy?: number | null
  expanded?: boolean
  visible?: boolean
  radius?: number
}

export interface D3Link extends d3.SimulationLinkDatum<D3Node> {
  id: string
  data: MindMapRelationship
  source: D3Node
  target: D3Node
}

export interface RenderOptions {
  width: number
  height: number
  centerX?: number
  centerY?: number
  theme?: 'light' | 'dark' | 'colorful'
  showLabels?: boolean
  enableAnimation?: boolean
  nodeSize?: 'small' | 'medium' | 'large'
  linkStrength?: number
  chargeStrength?: number
}

export interface InteractionCallbacks {
  onNodeClick?: (node: D3Node, event: MouseEvent) => void
  onNodeHover?: (node: D3Node | null, event: MouseEvent) => void
  onNodeDoubleClick?: (node: D3Node, event: MouseEvent) => void
  onLinkClick?: (link: D3Link, event: MouseEvent) => void
  onBackgroundClick?: (event: MouseEvent) => void
  onZoom?: (transform: d3.ZoomTransform) => void
}

export class MindMapD3Renderer {
  private container!: d3.Selection<SVGElement, unknown, null, undefined>
  private svg!: d3.Selection<SVGGElement, unknown, null, undefined>
  private linksGroup!: d3.Selection<SVGGElement, unknown, null, undefined>
  private nodesGroup!: d3.Selection<SVGGElement, unknown, null, undefined>
  private labelsGroup!: d3.Selection<SVGGElement, unknown, null, undefined>
  
  private simulation!: d3.Simulation<D3Node, D3Link>
  private zoom!: d3.ZoomBehavior<SVGElement, unknown>
  
  private nodes: D3Node[] = []
  private links: D3Link[] = []
  private structure: MindMapStructure | null = null
  
  private options: Required<RenderOptions>
  private callbacks: InteractionCallbacks
  private currentTheme: 'light' | 'dark' | 'colorful' = 'light'
  
  // 主题配置
  private themes = {
    light: {
      background: '#ffffff',
      nodeStroke: '#e5e7eb',
      nodeFill: '#f9fafb',
      nodeText: '#374151',
      linkStroke: '#d1d5db',
      linkText: '#6b7280',
      selectedStroke: '#3b82f6',
      hoveredStroke: '#10b981'
    },
    dark: {
      background: '#1f2937',
      nodeStroke: '#4b5563',
      nodeFill: '#374151',
      nodeText: '#f9fafb',
      linkStroke: '#6b7280',
      linkText: '#9ca3af',
      selectedStroke: '#60a5fa',
      hoveredStroke: '#34d399'
    },
    colorful: {
      background: '#fefefe',
      nodeStroke: '#e5e7eb',
      nodeFill: '#ffffff',
      nodeText: '#1f2937',
      linkStroke: '#d1d5db',
      linkText: '#6b7280',
      selectedStroke: '#3b82f6',
      hoveredStroke: '#10b981'
    }
  }

  constructor(
    containerElement: SVGElement,
    options: RenderOptions,
    callbacks: InteractionCallbacks = {}
  ) {
    this.options = {
      centerX: options.width / 2,
      centerY: options.height / 2,
      theme: 'light',
      showLabels: true,
      enableAnimation: true,
      nodeSize: 'medium',
      linkStrength: 0.3,
      chargeStrength: -300,
      ...options
    }
    
    this.callbacks = callbacks
    this.currentTheme = this.options.theme

    this.initializeContainer(containerElement)
    this.initializeSimulation()
    this.initializeZoom()
    this.setupEventListeners()
  }

  // 初始化容器
  private initializeContainer(containerElement: SVGElement): void {
    this.container = d3.select(containerElement)
      .attr('width', this.options.width)
      .attr('height', this.options.height)
      .style('background-color', this.themes[this.currentTheme].background)

    // 创建主要的SVG组
    this.svg = this.container.append('g')
      .attr('class', 'mind-map-container')

    // 创建图层组（按渲染顺序）
    this.linksGroup = this.svg.append('g')
      .attr('class', 'links-group')

    this.nodesGroup = this.svg.append('g')
      .attr('class', 'nodes-group')

    this.labelsGroup = this.svg.append('g')
      .attr('class', 'labels-group')

    // 添加定义组用于渐变和滤镜
    const defs = this.container.append('defs')
    
    // 创建箭头标记
    defs.append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', this.themes[this.currentTheme].linkStroke)

    // 创建节点阴影滤镜
    const filter = defs.append('filter')
      .attr('id', 'node-shadow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%')

    filter.append('feDropShadow')
      .attr('dx', 2)
      .attr('dy', 2)
      .attr('stdDeviation', 3)
      .attr('flood-opacity', 0.3)
  }

  // 初始化力导向图仿真
  private initializeSimulation(): void {
    this.simulation = d3.forceSimulation<D3Node, D3Link>()
      .force('link', d3.forceLink<D3Node, D3Link>()
        .id(d => d.id)
        .strength(this.options.linkStrength)
        .distance(d => this.calculateLinkDistance(d))
      )
      .force('charge', d3.forceManyBody()
        .strength(this.options.chargeStrength)
      )
      .force('center', d3.forceCenter(this.options.centerX!, this.options.centerY!))
      .force('collision', d3.forceCollide()
        .radius((d: any) => this.getNodeRadius(d as D3Node) + 10)
      )
      .alphaDecay(0.02)
      .velocityDecay(0.3)

    // 监听仿真更新
    this.simulation.on('tick', () => this.updatePositions())
  }

  // 初始化缩放行为
  private initializeZoom(): void {
    this.zoom = d3.zoom<SVGElement, unknown>()
      .scaleExtent([0.1, 3])
      .on('zoom', (event) => {
        const { transform } = event
        this.svg.attr('transform', transform.toString())
        
        // 调用缩放回调
        if (this.callbacks.onZoom) {
          this.callbacks.onZoom(transform)
        }
      })

    this.container.call(this.zoom)
  }

  // 设置事件监听器
  private setupEventListeners(): void {
    // 背景点击事件
    this.container.on('click', (event) => {
      if (event.target === this.container.node()) {
        if (this.callbacks.onBackgroundClick) {
          this.callbacks.onBackgroundClick(event)
        }
      }
    })
  }

  // 渲染思维导图
  public render(structure: MindMapStructure, focusNodeId?: string): void {
    this.structure = structure
    this.prepareData(focusNodeId)
    this.renderLinks()
    this.renderNodes()
    this.renderLabels()
    this.restartSimulation()
  }

  // 准备数据
  private prepareData(focusNodeId?: string): void {
    if (!this.structure) return

    const focusNode = focusNodeId || this.structure.centralTopic.id
    const visibleNodes = this.getVisibleNodes(focusNode)
    
    // 转换节点数据
    this.nodes = visibleNodes.map(node => ({
      id: node.id,
      data: node,
      expanded: node.id === focusNode || node.level <= 1,
      visible: true,
      radius: this.getNodeRadius({ data: node } as D3Node),
      x: node.position?.x || this.options.centerX,
      y: node.position?.y || this.options.centerY
    }))

    // 转换连接数据
    this.links = this.structure.relationships
      .filter(rel => 
        visibleNodes.some(n => n.id === rel.source) &&
        visibleNodes.some(n => n.id === rel.target)
      )
      .map(rel => ({
        id: rel.id,
        data: rel,
        source: this.nodes.find(n => n.id === rel.source)!,
        target: this.nodes.find(n => n.id === rel.target)!
      }))
  }

  // 获取可见节点
  private getVisibleNodes(focusNodeId: string): MindMapNode[] {
    if (!this.structure) return []

    const visibleNodes: MindMapNode[] = []
    const visited = new Set<string>()

    const addNodeAndRelated = (nodeId: string, depth: number = 0): void => {
      if (visited.has(nodeId) || depth > 2) return
      
      const node = this.structure!.nodes[nodeId]
      if (!node) return

      visited.add(nodeId)
      visibleNodes.push(node)

      // 添加直接子节点
      if (depth < 2) {
        for (const childId of node.children) {
          addNodeAndRelated(childId, depth + 1)
        }
      }

      // 添加父节点
      if (node.parent && depth < 1) {
        addNodeAndRelated(node.parent, depth + 1)
      }
    }

    addNodeAndRelated(focusNodeId)
    return visibleNodes
  }

  // 渲染连接线
  private renderLinks(): void {
    const linkSelection = this.linksGroup
      .selectAll<SVGLineElement, D3Link>('.link')
      .data(this.links, d => d.id)

    // 移除不需要的连接
    linkSelection.exit()
      .transition()
      .duration(this.options.enableAnimation ? 300 : 0)
      .style('opacity', 0)
      .remove()

    // 添加新连接
    const linkEnter = linkSelection.enter()
      .append('line')
      .attr('class', 'link')
      .style('opacity', 0)
      .attr('stroke', this.themes[this.currentTheme].linkStroke)
      .attr('stroke-width', d => this.getLinkWidth(d))
      .attr('marker-end', d => d.data.type === 'parent-child' ? 'url(#arrowhead)' : '')

    // 更新连接样式
    linkSelection.merge(linkEnter)
      .transition()
      .duration(this.options.enableAnimation ? 300 : 0)
      .style('opacity', 1)
      .attr('stroke', this.themes[this.currentTheme].linkStroke)
      .attr('stroke-width', d => this.getLinkWidth(d))

    // 添加连接交互
    linkSelection.merge(linkEnter)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation()
        if (this.callbacks.onLinkClick) {
          this.callbacks.onLinkClick(d, event)
        }
      })
      .on('mouseenter', (event, d) => {
        d3.select(event.currentTarget as SVGLineElement)
          .attr('stroke-width', this.getLinkWidth(d) * 1.5)
      })
      .on('mouseleave', (event, d) => {
        d3.select(event.currentTarget as SVGLineElement)
          .attr('stroke-width', this.getLinkWidth(d))
      })
  }

  // 渲染节点
  private renderNodes(): void {
    const nodeSelection = this.nodesGroup
      .selectAll<SVGGElement, D3Node>('.node')
      .data(this.nodes, d => d.id)

    // 移除不需要的节点
    nodeSelection.exit()
      .transition()
      .duration(this.options.enableAnimation ? 300 : 0)
      .attr('transform', 'scale(0)')
      .style('opacity', 0)
      .remove()

    // 添加新节点组
    const nodeEnter = nodeSelection.enter()
      .append('g')
      .attr('class', 'node')
      .style('opacity', 0)
      .attr('transform', 'scale(0)')

    // 添加节点圆形
    nodeEnter.append('circle')
      .attr('class', 'node-circle')
      .attr('r', d => this.getNodeRadius(d))
      .attr('fill', d => this.getNodeColor(d))
      .attr('stroke', this.themes[this.currentTheme].nodeStroke)
      .attr('stroke-width', 2)
      .style('filter', 'url(#node-shadow)')

    // 添加节点图标（如果需要）
    nodeEnter.append('text')
      .attr('class', 'node-icon')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', d => this.getNodeRadius(d) * 0.6)
      .attr('fill', this.themes[this.currentTheme].nodeText)
      .text(d => this.getNodeIcon(d))

    // 更新节点
    const nodeUpdate = nodeSelection.merge(nodeEnter)
      .transition()
      .duration(this.options.enableAnimation ? 300 : 0)
      .style('opacity', 1)
      .attr('transform', 'scale(1)')

    nodeUpdate.select('.node-circle')
      .attr('r', d => this.getNodeRadius(d))
      .attr('fill', d => this.getNodeColor(d))
      .attr('stroke', this.themes[this.currentTheme].nodeStroke)

    nodeUpdate.select('.node-icon')
      .attr('font-size', d => this.getNodeRadius(d) * 0.6)
      .attr('fill', this.themes[this.currentTheme].nodeText)
      .text(d => this.getNodeIcon(d))

    // 添加节点交互
    nodeSelection.merge(nodeEnter)
      .style('cursor', 'pointer')
      .call(this.createDragBehavior())
      .on('click', (event, d) => {
        event.stopPropagation()
        if (this.callbacks.onNodeClick) {
          this.callbacks.onNodeClick(d, event)
        }
      })
      .on('dblclick', (event, d) => {
        event.stopPropagation()
        if (this.callbacks.onNodeDoubleClick) {
          this.callbacks.onNodeDoubleClick(d, event)
        }
      })
      .on('mouseenter', (event, d) => {
        this.highlightNode(d, true)
        if (this.callbacks.onNodeHover) {
          this.callbacks.onNodeHover(d, event)
        }
      })
      .on('mouseleave', (event, d) => {
        this.highlightNode(d, false)
        if (this.callbacks.onNodeHover) {
          this.callbacks.onNodeHover(null, event)
        }
      })
  }

  // 渲染标签
  private renderLabels(): void {
    if (!this.options.showLabels) return

    const labelSelection = this.labelsGroup
      .selectAll<SVGTextElement, D3Node>('.label')
      .data(this.nodes, d => d.id)

    // 移除不需要的标签
    labelSelection.exit()
      .transition()
      .duration(this.options.enableAnimation ? 300 : 0)
      .style('opacity', 0)
      .remove()

    // 添加新标签
    const labelEnter = labelSelection.enter()
      .append('text')
      .attr('class', 'label')
      .style('opacity', 0)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('fill', this.themes[this.currentTheme].nodeText)
      .style('pointer-events', 'none')
      .style('user-select', 'none')

    // 更新标签
    labelSelection.merge(labelEnter)
      .transition()
      .duration(this.options.enableAnimation ? 300 : 0)
      .style('opacity', 1)
      .attr('fill', this.themes[this.currentTheme].nodeText)
      .text(d => this.truncateText(d.data.label, 12))
  }

  // 创建拖拽行为
  private createDragBehavior(): d3.DragBehavior<SVGGElement, D3Node, unknown> {
    return d3.drag<SVGGElement, D3Node>()
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
  }

  // 更新位置
  private updatePositions(): void {
    // 更新连接位置
    this.linksGroup.selectAll<SVGLineElement, D3Link>('.link')
      .attr('x1', d => d.source.x!)
      .attr('y1', d => d.source.y!)
      .attr('x2', d => d.target.x!)
      .attr('y2', d => d.target.y!)

    // 更新节点位置
    this.nodesGroup.selectAll<SVGGElement, D3Node>('.node')
      .attr('transform', d => `translate(${d.x},${d.y})`)

    // 更新标签位置
    this.labelsGroup.selectAll<SVGTextElement, D3Node>('.label')
      .attr('x', d => d.x!)
      .attr('y', d => d.y! + this.getNodeRadius(d) + 15)
  }

  // 重启仿真
  private restartSimulation(): void {
    this.simulation.nodes(this.nodes)
    this.simulation.force<d3.ForceLink<D3Node, D3Link>>('link')!.links(this.links)
    this.simulation.alpha(1).restart()
  }

  // 获取节点半径
  private getNodeRadius(node: D3Node): number {
    const baseRadius = {
      small: 15,
      medium: 20,
      large: 25
    }[this.options.nodeSize]

    const sizeMultiplier = {
      small: 0.8,
      medium: 1.0,
      large: 1.2
    }[node.data.size] || 1.0

    const importanceMultiplier = 1 + (node.data.importance - 5) * 0.1

    return baseRadius * sizeMultiplier * importanceMultiplier
  }

  // 获取节点颜色
  private getNodeColor(node: D3Node): string {
    if (this.currentTheme === 'colorful') {
      return node.data.color
    }
    
    const categoryColors: Record<string, string> = {
      core: '#3b82f6',
      concept: '#8b5cf6',
      application: '#ef4444',
      research: '#10b981',
      method: '#06b6d4',
      theory: '#f59e0b',
      example: '#9ca3af'
    }

    return categoryColors[node.data.category] || this.themes[this.currentTheme].nodeFill
  }

  // 获取节点图标
  private getNodeIcon(node: D3Node): string {
    const categoryIcons: Record<string, string> = {
      core: '●',
      concept: '◆',
      application: '▲',
      research: '■',
      method: '◇',
      theory: '○',
      example: '◯'
    }

    return categoryIcons[node.data.category] || '●'
  }

  // 获取连接宽度
  private getLinkWidth(link: D3Link): number {
    const baseWidth = 2
    const strengthMultiplier = link.data.strength || 1
    return baseWidth * strengthMultiplier
  }

  // 计算连接距离
  private calculateLinkDistance(link: D3Link): number {
    const baseDistance = 80
    const levelDifference = Math.abs(
      (link.source as D3Node).data.level - (link.target as D3Node).data.level
    )
    return baseDistance + levelDifference * 20
  }

  // 高亮节点
  private highlightNode(node: D3Node, highlight: boolean): void {
    const nodeElement = this.nodesGroup
      .selectAll<SVGGElement, D3Node>('.node')
      .filter(d => d.id === node.id)

    nodeElement.select('.node-circle')
      .attr('stroke', highlight ? 
        this.themes[this.currentTheme].hoveredStroke : 
        this.themes[this.currentTheme].nodeStroke
      )
      .attr('stroke-width', highlight ? 3 : 2)

    // 高亮相关连接
    this.linksGroup.selectAll<SVGLineElement, D3Link>('.link')
      .attr('stroke', d => {
        const isRelated = d.source.id === node.id || d.target.id === node.id
        return (highlight && isRelated) ? 
          this.themes[this.currentTheme].hoveredStroke : 
          this.themes[this.currentTheme].linkStroke
      })
  }

  // 截断文本
  private truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  // 展开/折叠节点
  public toggleNode(nodeId: string): void {
    const node = this.nodes.find(n => n.id === nodeId)
    if (!node) return

    node.expanded = !node.expanded
    
    // 重新准备数据并渲染
    if (this.structure) {
      this.render(this.structure, nodeId)
    }
  }

  // 聚焦到节点
  public focusNode(nodeId: string, duration: number = 750): void {
    const node = this.nodes.find(n => n.id === nodeId)
    if (!node || !node.x || !node.y) return

    const transform = d3.zoomIdentity
      .translate(this.options.width / 2 - node.x, this.options.height / 2 - node.y)
      .scale(1.5)

    this.container
      .transition()
      .duration(duration)
      .call(this.zoom.transform, transform)
  }

  // 重置视图
  public resetView(duration: number = 750): void {
    const transform = d3.zoomIdentity
      .translate(0, 0)
      .scale(1)

    this.container
      .transition()
      .duration(duration)
      .call(this.zoom.transform, transform)
  }

  // 切换主题
  public setTheme(theme: 'light' | 'dark' | 'colorful'): void {
    this.currentTheme = theme
    
    // 更新背景
    this.container.style('background-color', this.themes[theme].background)
    
    // 更新箭头颜色
    this.container.select('#arrowhead path')
      .attr('fill', this.themes[theme].linkStroke)
    
    // 重新渲染以应用新主题
    if (this.structure) {
      this.render(this.structure)
    }
  }

  // 获取当前缩放变换
  public getTransform(): d3.ZoomTransform {
    return d3.zoomTransform(this.container.node()!)
  }

  // 设置缩放变换
  public setTransform(transform: d3.ZoomTransform, duration: number = 0): void {
    if (duration > 0) {
      this.container
        .transition()
        .duration(duration)
        .call(this.zoom.transform, transform)
    } else {
      this.container.call(this.zoom.transform, transform)
    }
  }

  // 销毁渲染器
  public destroy(): void {
    this.simulation.stop()
    this.container.selectAll('*').remove()
  }

  // 导出为SVG
  public exportSVG(): string {
    const svgNode = this.container.node()!
    const serializer = new XMLSerializer()
    return serializer.serializeToString(svgNode)
  }

  // 获取节点位置
  public getNodePosition(nodeId: string): { x: number; y: number } | null {
    const node = this.nodes.find(n => n.id === nodeId)
    if (!node || !node.x || !node.y) return null
    return { x: node.x, y: node.y }
  }

  // 获取可见节点列表
  public getVisibleNodeIds(): string[] {
    return this.nodes.map(n => n.id)
  }

  // 更新节点数据
  public updateNodeData(nodeId: string, data: Partial<MindMapNode>): void {
    const node = this.nodes.find(n => n.id === nodeId)
    if (!node) return

    Object.assign(node.data, data)
    
    // 重新渲染节点
    this.renderNodes()
    this.renderLabels()
  }
}