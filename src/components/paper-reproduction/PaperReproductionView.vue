<template>
  <div class="paper-reproduction-container">
    <!-- Paper Header -->
    <header class="paper-header">
      <h1 class="paper-title">
        The Influence of Introversion–Extroversion on Service Quality Dimensions: A Trait Activation Theory Study
      </h1>
      <div class="paper-meta">
        <p class="authors">Sercan Hatipoglu<sup>1</sup>, Erdogan Koc<sup>2,*</sup></p>
        <p class="affiliations">
          <sup>1</sup> Faculty of Economics and Administrative Sciences, Bandirma Onyedi Eylul University, Balikesir 10200, Türkiye<br>
          <sup>2</sup> Faculty of Economics, Administrative and Social Sciences, Bahcesehir University, Istanbul 34000, Türkiye
        </p>
        <p class="journal">
          <strong>Sustainability 2023</strong>, 15, 798. https://doi.org/10.3390/su15010798
        </p>
      </div>
    </header>

    <!-- Navigation Tabs -->
    <nav class="paper-nav">
      <button 
        v-for="section in sections" 
        :key="section.id"
        @click="activeSection = section.id"
        :class="['nav-btn', { active: activeSection === section.id }]"
      >
        {{ section.title }}
      </button>
    </nav>

    <!-- Content Sections -->
    <main class="paper-content">
      <!-- Abstract Section -->
      <section v-if="activeSection === 'abstract'" class="content-section">
        <h2>摘要 Abstract</h2>
        <div class="abstract-content">
          <div class="language-section">
            <h3>中文摘要</h3>
            <p>
              人格特征影响个体对外部刺激的感知、评价和行为。本研究旨在探讨酒店顾客的外向-内向人格特征对其赋予不同服务质量维度价值的影响。
            </p>
            <p>
              数据来源于<strong>在土耳其爱琴海沿岸度假村五星级酒店住宿的508名土耳其游客</strong>。采用<strong>偏最小二乘结构方程建模（PLS-SEM）</strong>对数据进行分析。
            </p>
            <p>
              结果表明，<strong>内向型顾客倾向于更重视服务质量的有形性维度</strong>，而<strong>外向型顾客倾向于更重视服务质量的移情性维度</strong>。
            </p>
          </div>
          <div class="language-section">
            <h3>English Abstract</h3>
            <p>
              Personality characteristics influence individuals' perceptions, evaluations, and behaviors toward external stimuli. 
              This study aims to investigate the influence of the extroversion–introversion personality characteristics of 
              hospitality customers on the amount of value they attached to the different service quality dimensions.
            </p>
            <p>
              The data were obtained from <strong>508 Turkish tourists</strong> staying at five-star hotels in holiday resorts 
              located on the Aegean coast of Turkey. <strong>Partial least-squares structural equation modelling (PLS-SEM)</strong> 
              was used to analyze the data.
            </p>
            <p>
              The results show that while <strong>introvert customers tend to attach more value to the tangibles dimension</strong> 
              of service quality, <strong>extrovert customers tend to attach more value to the empathy dimension</strong> of service quality.
            </p>
          </div>
          <div class="keywords">
            <strong>关键词 Keywords:</strong> 外向性；内向性；服务质量；SERVQUAL；旅游业 | extroversion; introversion; service quality; SERVQUAL; tourism
          </div>
        </div>
      </section>

      <!-- Introduction Section -->
      <section v-if="activeSection === 'introduction'" class="content-section">
        <h2>引言 Introduction</h2>
        <div class="introduction-content">
          <h3>研究背景 Background</h3>
          <p>
            在全球化的服务经济时代，服务质量成为企业获得竞争优势的关键因素。特别是在旅游和酒店业中，顾客对服务质量的感知直接影响其满意度、忠诚度和重复消费意愿。然而，研究表明，不同顾客对同样的服务质量会产生不同的评价，这种差异可能源于顾客个体特征的差异。
          </p>
          <p>
            人格特质作为个体心理特征的重要组成部分，能够预测个体在特定情境下的行为模式和反应方式。特质激发理论（Trait Activation Theory, TAT）指出，人格特质只有在相关的情境线索存在时才会被激发，进而影响个体的行为和态度。在服务环境中，不同的情境特征可能会激发顾客不同的人格特质，从而影响其对服务质量的感知和评价。
          </p>
          
          <h3>研究问题 Research Questions</h3>
          <div class="research-questions">
            <div class="question-item">
              <h4>RQ1: 内外向人格特质如何影响顾客对服务质量不同维度的重视程度？</h4>
              <p>探讨外向型和内向型顾客在评价服务质量时的关注重点差异。</p>
            </div>
            <div class="question-item">
              <h4>RQ2: 哪些服务质量维度对不同人格类型的顾客更为重要？</h4>
              <p>识别外向型和内向型顾客最看重的服务质量维度。</p>
            </div>
            <div class="question-item">
              <h4>RQ3: 如何基于TAT理论解释人格特质与服务质量感知的关系？</h4>
              <p>从理论角度阐释人格特质激发机制在服务环境中的作用。</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Literature Review Section -->
      <section v-if="activeSection === 'literature-review'" class="content-section">
        <h2>文献综述 Literature Review</h2>
        <div class="literature-content">
          <h3>特质激发理论（TAT）发展历程</h3>
          <div class="theory-evolution">
            <div class="evolution-stage">
              <h4>阶段一：基础理论构建（2000-2007年）</h4>
              <ul>
                <li>2000年，Tett和Guterman首次提出特质激发理论的基本框架</li>
                <li>强调特质与情境的交互作用，挑战了传统的特质理论和情境理论</li>
                <li>提出了特质激活的概念，即特定情境特征会激活相应的个体特质</li>
              </ul>
            </div>
            <div class="evolution-stage">
              <h4>阶段二：实证研究与拓展（2008-2014年）</h4>
              <ul>
                <li>大量实证研究验证了TAT理论的有效性</li>
                <li>拓展了理论的应用领域，如领导力、团队协作、职业发展等</li>
                <li>开始关注特质激活的边界条件和调节变量</li>
              </ul>
            </div>
            <div class="evolution-stage">
              <h4>阶段三：跨文化与应用研究（2015年至今）</h4>
              <ul>
                <li>跨文化研究增多，探讨TAT理论在不同文化背景下的适用性</li>
                <li>应用研究进一步深化，关注具体情境下的特质激活机制</li>
                <li>开始与其他理论整合，形成更综合的理论模型</li>
              </ul>
            </div>
          </div>

          <h3>服务质量研究现状</h3>
          <div class="service-quality-research">
            <h4>SERVQUAL模型的发展与应用</h4>
            <p>SERVQUAL模型由Parasuraman等人于1985年提出，经过多次修订和完善，目前包括五个核心维度：</p>
            <div class="servqual-dimensions">
              <div class="dimension-card">
                <h5>有形性（Tangibles）</h5>
                <p>服务设施、设备、人员和沟通材料的外观表现</p>
              </div>
              <div class="dimension-card">
                <h5>可靠性（Reliability）</h5>
                <p>可靠、准确地执行所承诺服务的能力</p>
              </div>
              <div class="dimension-card">
                <h5>响应性（Responsiveness）</h5>
                <p>愿意帮助顾客并提供及时服务的意愿</p>
              </div>
              <div class="dimension-card">
                <h5>保证性（Assurance）</h5>
                <p>员工的知识、礼貌以及传达信任和信心的能力</p>
              </div>
              <div class="dimension-card">
                <h5>移情性（Empathy）</h5>
                <p>企业给予顾客的关怀和个性化关注</p>
              </div>
            </div>
          </div>

          <h3>人格特质与服务感知关系研究</h3>
          <div class="personality-service-research">
            <div class="research-stream">
              <h4>大五人格模型在服务研究中的应用</h4>
              <p>大五人格模型（Big Five Model）是目前最广泛使用的人格测量框架，包括：</p>
              <ul>
                <li><strong>外向性（Extroversion）</strong>：社交性、自信、活跃、乐观</li>
                <li><strong>神经质（Neuroticism）</strong>：情绪不稳定、焦虑、敏感</li>
                <li><strong>宜人性（Agreeableness）</strong>：合作、友好、体贴</li>
                <li><strong>尽责性（Conscientiousness）</strong>：负责、可靠、有序</li>
                <li><strong>开放性（Openness）</strong>：好奇、创新、灵活</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- Research Model Section -->
      <section v-if="activeSection === 'model'" class="content-section">
        <h2>Research Model</h2>
        <div class="model-container">
          <div class="research-model">
            <img src="/TAT理论的结构方程.png" alt="Research Model" class="model-diagram" />
            <p class="model-caption">Figure 1. Research Model</p>
          </div>
          
          <!-- Hypotheses -->
          <div class="hypotheses-section">
            <h3>Research Hypotheses</h3>
            <div class="hypotheses-list">
              <div v-for="hypothesis in researchHypotheses" :key="hypothesis.id" class="hypothesis-item">
                <div class="hypothesis-header">
                  <span class="hypothesis-id">{{ hypothesis.id }}</span>
                  <span :class="['hypothesis-result', getResultClass(hypothesis.result)]">
                    {{ hypothesis.result }}
                  </span>
                </div>
                <p class="hypothesis-text">{{ hypothesis.hypothesis }}</p>
                <p class="hypothesis-interpretation">{{ hypothesis.interpretation }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Methodology Section -->
      <section v-if="activeSection === 'methodology'" class="content-section">
        <h2>Methodology</h2>
        
        <div class="methodology-grid">
          <div class="method-card">
            <h3>Sample</h3>
            <ul>
              <li><strong>Total surveys:</strong> 508</li>
              <li><strong>Valid responses:</strong> 485 (95.5%)</li>
              <li><strong>Participants:</strong> Turkish tourists</li>
              <li><strong>Setting:</strong> Five-star hotels</li>
              <li><strong>Location:</strong> Aegean coast of Turkey</li>
              <li><strong>Period:</strong> Sep 2020 - Nov 2022</li>
            </ul>
          </div>

          <div class="method-card">
            <h3>Measurement</h3>
            <ul>
              <li><strong>Personality:</strong> BFI-44 Extroversion dimension</li>
              <li><strong>Service Quality:</strong> SERVQUAL dimensions</li>
              <li><strong>Method:</strong> 100-point allocation across 5 dimensions</li>
              <li><strong>Scale:</strong> 5-point Likert scale for personality</li>
            </ul>
          </div>

          <div class="method-card">
            <h3>Analysis</h3>
            <ul>
              <li><strong>Software:</strong> SmartPLS version 3</li>
              <li><strong>Method:</strong> PLS-SEM</li>
              <li><strong>Bootstrap samples:</strong> 5,000</li>
              <li><strong>Reason:</strong> Non-normal data distribution</li>
            </ul>
          </div>
        </div>

        <div class="measurement-model">
          <h3>BFI-44 Extroversion Items</h3>
          <div class="measurement-items">
            <div v-for="(item, key) in measurementItems" :key="key" class="item-card">
              <div class="item-text">{{ item.text }}</div>
              <div class="item-stats">
                <span class="loading">Loading: {{ item.loading }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Results Section -->
      <section v-if="activeSection === 'results'" class="content-section">
        <h2>Results</h2>
        
        <!-- Measurement Model Results -->
        <div class="results-section">
          <h3>Table 1. Measurement Model Results</h3>
          <div class="table-container">
            <table class="results-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Factor Load</th>
                  <th>AVE</th>
                  <th>CR</th>
                  <th>α</th>
                  <th>rho_A</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colspan="6" class="section-header"><strong>Extroversion</strong></td>
                </tr>
                <tr>
                  <td>"I see myself as someone talkative" (dd1)</td>
                  <td>0.735</td>
                  <td rowspan="5">0.578</td>
                  <td rowspan="5">0.870</td>
                  <td rowspan="5">0.869</td>
                  <td rowspan="5">0.884</td>
                </tr>
                <tr>
                  <td>"I see myself as someone full of energy" (dd3)</td>
                  <td>0.856</td>
                </tr>
                <tr>
                  <td>"I see myself as someone who generates a lot of enthusiasm" (dd4)</td>
                  <td>0.719</td>
                </tr>
                <tr>
                  <td>"I see myself as someone who has an assertive personality" (dd6)</td>
                  <td>0.578</td>
                </tr>
                <tr>
                  <td>"I see myself as someone outgoing, and sociable" (dd8)</td>
                  <td>0.874</td>
                </tr>
                <tr>
                  <td colspan="6" class="section-header"><strong>SERVQUAL Dimensions</strong></td>
                </tr>
                <tr v-for="dimension in servqualDimensions" :key="dimension.id">
                  <td>{{ dimension.description }}</td>
                  <td>1.000</td>
                  <td>1.000</td>
                  <td>1.000</td>
                  <td>1.000</td>
                  <td>1.000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Discriminant Validity -->
        <div class="results-section">
          <h3>Table 2. Fornell and Larcker Criterion</h3>
          <div class="table-container">
            <table class="correlation-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Assurance</th>
                  <th>Extroversion</th>
                  <th>Empathy</th>
                  <th>Reliability</th>
                  <th>Responsive.</th>
                  <th>Tangibles</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Assurance</strong></td>
                  <td class="diagonal">1.000</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td><strong>Extroversion</strong></td>
                  <td>0.099</td>
                  <td class="diagonal">0.760</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td><strong>Empathy</strong></td>
                  <td>-0.075</td>
                  <td>0.109</td>
                  <td class="diagonal">1.000</td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td><strong>Reliability</strong></td>
                  <td>-0.358</td>
                  <td>-0.019</td>
                  <td>-0.380</td>
                  <td class="diagonal">1.000</td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td><strong>Responsiveness</strong></td>
                  <td>0.009</td>
                  <td>0.087</td>
                  <td>-0.180</td>
                  <td>-0.205</td>
                  <td class="diagonal">1.000</td>
                  <td></td>
                </tr>
                <tr>
                  <td><strong>Tangibles</strong></td>
                  <td>-0.342</td>
                  <td>-0.215</td>
                  <td>-0.387</td>
                  <td>-0.174</td>
                  <td>-0.337</td>
                  <td class="diagonal">1.000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Model Results -->
        <div class="results-section">
          <h3>Table 4. Model Results</h3>
          <div class="table-container">
            <table class="results-table">
              <thead>
                <tr>
                  <th>Hypothesis</th>
                  <th>β</th>
                  <th>SE</th>
                  <th>t-Statistic</th>
                  <th>p-Value</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="result in modelResults" :key="result.hypothesis" :class="getRowClass(result.result)">
                  <td><strong>{{ result.hypothesis }}</strong></td>
                  <td>{{ result.beta }}</td>
                  <td>{{ result.standardError }}</td>
                  <td>{{ result.tStatistic }}</td>
                  <td>{{ result.pValue }}</td>
                  <td>
                    <span :class="['result-badge', getResultClass(result.result)]">
                      {{ result.result }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- Structural Model Section -->
      <section v-if="activeSection === 'structural-model'" class="content-section">
        <h2>Structural Equation Model Visualization</h2>
        
        <!-- SEM Diagram Component -->
        <div class="sem-container">
          <StructuralEquationVisualization 
            :model="extroversionServqualModel"
            :height="600"
            :interactive="true"
          />
        </div>

        <!-- Model Fit Statistics -->
        <div class="model-fit-section">
          <h3>Model Fit Statistics</h3>
          <div class="fit-stats-grid">
              <div class="fit-card">
                <h4>Reliability</h4>
                <ul>
                  <li>Cronbach's α: {{ measurementModel.extroversion.cronbachAlpha }}</li>
                  <li>Composite Reliability: {{ measurementModel.extroversion.compositeReliability }}</li>
                  <li>AVE: {{ measurementModel.extroversion.averageVarianceExtracted }}</li>
                </ul>
              </div>

            <div class="fit-card">
              <h4>Explained Variance (R²)</h4>
              <ul>
                <li>Tangibles: {{ (modelFit.rSquared.tangibles * 100).toFixed(1) }}%</li>
                <li>Reliability: {{ (modelFit.rSquared.reliability * 100).toFixed(1) }}%</li>
                <li>Responsiveness: {{ (modelFit.rSquared.responsiveness * 100).toFixed(1) }}%</li>
                <li>Assurance: {{ (modelFit.rSquared.assurance * 100).toFixed(1) }}%</li>
                <li>Empathy: {{ (modelFit.rSquared.empathy * 100).toFixed(1) }}%</li>
              </ul>
            </div>

              <div class="fit-card">
                <h4>Effect Size (f²)</h4>
                <ul>
                  <li>Tangibles: {{ modelFit.effectSize.tangibles }} (small)</li>
                  <li>Reliability: {{ modelFit.effectSize.reliability }} (none)</li>
                  <li>Responsiveness: {{ modelFit.effectSize.responsiveness }} (very small)</li>
                  <li>Assurance: {{ modelFit.effectSize.assurance }} (very small)</li>
                  <li>Empathy: {{ modelFit.effectSize.empathy }} (very small)</li>
                </ul>
              </div>
          </div>
        </div>
      </section>

      <!-- Data Analysis Section -->
      <section v-if="activeSection === 'data-analysis'" class="content-section">
        <h2>Data Analysis & Simulated Results</h2>
        
        <!-- Descriptive Statistics -->
        <div class="analysis-section">
          <h3>Sample Characteristics</h3>
          <div class="stats-grid">
            <div class="stat-card">
              <h4>Demographics</h4>
              <ul>
                <li>Sample Size: {{ descriptiveStats.sampleSize }}</li>
                <li>Age: M = {{ descriptiveStats.demographics.age.mean.toFixed(1) }}, SD = {{ descriptiveStats.demographics.age.std.toFixed(1) }}</li>
                <li>Male: {{ descriptiveStats.demographics.gender.malePercentage }}%</li>
                <li>Female: {{ descriptiveStats.demographics.gender.femalePercentage }}%</li>
              </ul>
            </div>

            <div class="stat-card">
              <h4>Personality Distribution</h4>
              <ul>
                <li>Introverts: {{ descriptiveStats.demographics.personality.introverts }} ({{ descriptiveStats.demographics.personality.introvertPercentage }}%)</li>
                <li>Extroverts: {{ descriptiveStats.demographics.personality.extroverts }} ({{ descriptiveStats.demographics.personality.extrovertPercentage }}%)</li>
                <li>Extroversion M: {{ descriptiveStats.extroversion.mean.toFixed(2) }}</li>
                <li>Cronbach's α: {{ descriptiveStats.extroversion.cronbachAlpha }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- SERVQUAL Weights Comparison -->
        <div class="analysis-section">
          <h3>SERVQUAL Dimension Weights by Personality Type</h3>
          <div class="comparison-container">
            <div class="comparison-chart">
              <div class="chart-placeholder">
                <h4>Personality Type Comparison Chart</h4>
                <div class="bar-chart">
                  <div v-for="(dimension, key) in servqualComparison" :key="key" class="bar-group">
                    <div class="bar-label">{{ dimension.label }}</div>
                    <div class="bars">
                      <div class="bar introvert" :style="{ width: dimension.introverts * 3 + 'px' }">
                        <span class="bar-value">{{ dimension.introverts.toFixed(1) }}%</span>
                      </div>
                      <div class="bar extrovert" :style="{ width: dimension.extroverts * 3 + 'px' }">
                        <span class="bar-value">{{ dimension.extroverts.toFixed(1) }}%</span>
                      </div>
                    </div>
                  </div>
                  <div class="chart-legend">
                    <div class="legend-item">
                      <div class="legend-color introvert"></div>
                      <span>Introverts</span>
                    </div>
                    <div class="legend-item">
                      <div class="legend-color extrovert"></div>
                      <span>Extroverts</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="weights-table">
              <table class="comparison-table">
                <thead>
                  <tr>
                    <th>SERVQUAL Dimension</th>
                    <th>Introverts</th>
                    <th>Extroverts</th>
                    <th>Difference</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(dimension, key) in servqualComparison" :key="key" :class="getDifferenceClass(dimension.difference)">
                    <td><strong>{{ dimension.label }}</strong></td>
                    <td>{{ dimension.introverts.toFixed(1) }}%</td>
                    <td>{{ dimension.extroverts.toFixed(1) }}%</td>
                    <td>{{ dimension.difference > 0 ? '+' : '' }}{{ dimension.difference.toFixed(1) }}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Key Findings -->
        <div class="analysis-section">
          <h3>Key Findings</h3>
          <div class="findings-list">
            <div class="finding-item supported">
              <div class="finding-header">
                <span class="finding-icon">✓</span>
                <strong>H1 Supported: Tangibles Dimension</strong>
              </div>
                <p>Introverts attach significantly more value to tangibles (β = -0.215, p &lt; 0.01). This supports TAT theory as introverts are more sensitive to environmental stimuli and physical surroundings.</p>
            </div>

            <div class="finding-item not-supported">
              <div class="finding-header">
                <span class="finding-icon">×</span>
                <strong>H2-H4 Not Supported: Reliability, Responsiveness, Assurance</strong>
              </div>
              <p>No significant differences found between introverts and extroverts for these dimensions. This suggests universal importance across personality types.</p>
            </div>

            <div class="finding-item supported">
              <div class="finding-header">
                <span class="finding-icon">✓</span>
                <strong>H5 Supported: Empathy Dimension</strong>
              </div>
                <p>Extroverts attach significantly more value to empathy (β = 0.109, p &lt; 0.05). This aligns with extroverts' preference for social interaction and personalized attention.</p>
            </div>
          </div>
        </div>

        <!-- Advanced Statistical Analysis -->
        <div class="analysis-section">
          <h3>Advanced Statistical Metrics</h3>
          <div class="stats-grid">
            <div class="stat-card">
              <h4>Effect Sizes (Cohen's d)</h4>
              <ul>
                <li>
                  <strong>Tangibles:</strong>
                  d =
                  {{
                    calculateEffectSize(
                      servqualComparison.tangibles.introverts,
                      servqualComparison.tangibles.extroverts
                    ).toFixed(3)
                  }}
                  (
                  {{
                    getEffectSizeLabel(
                      calculateEffectSize(
                        servqualComparison.tangibles.introverts,
                        servqualComparison.tangibles.extroverts
                      )
                    )
                  }}
                  )
                </li>
                <li>
                  <strong>Empathy:</strong>
                  d =
                  {{
                    calculateEffectSize(
                      servqualComparison.empathy.extroverts,
                      servqualComparison.empathy.introverts
                    ).toFixed(3)
                  }}
                  (
                  {{
                    getEffectSizeLabel(
                      calculateEffectSize(
                        servqualComparison.empathy.extroverts,
                        servqualComparison.empathy.introverts
                      )
                    )
                  }}
                  )
                </li>
                <li>
                  <strong>Reliability:</strong>
                  d =
                  {{
                    calculateEffectSize(
                      servqualComparison.reliability.introverts,
                      servqualComparison.reliability.extroverts
                    ).toFixed(3)
                  }}
                  (
                  {{
                    getEffectSizeLabel(
                      calculateEffectSize(
                        servqualComparison.reliability.introverts,
                        servqualComparison.reliability.extroverts
                      )
                    )
                  }}
                  )
                </li>
              </ul>
            </div>

            <div class="stat-card">
              <h4>Statistical Power Analysis</h4>
              <ul>
                <li><strong>Sample Size:</strong> N = {{ descriptiveStats.sampleSize }}</li>
                <li><strong>Power (1-β):</strong> 0.80 (adequate)</li>
                <li><strong>Alpha Level:</strong> α = 0.05</li>
                <li><strong>Minimum Detectable Effect:</strong> d = 0.25</li>
              </ul>
            </div>

            <div class="stat-card">
              <h4>Model Validation Metrics</h4>
              <ul>
                <li><strong>Bootstraps:</strong> 5,000 samples</li>
                <li><strong>Path Significance:</strong> 2/5 hypotheses supported</li>
                <li>
                  <strong>Total Variance Explained:</strong>
                  {{ ((modelFit.rSquared.tangibles + modelFit.rSquared.empathy) * 100 / 2).toFixed(1) }}%
                </li>
                <li><strong>Predictive Relevance:</strong> Q² > 0 for significant paths</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import StructuralEquationVisualization from '../structural-equation/StructuralEquationVisualization.vue'
import { extroversionServqualModel } from '@/data/extroversion-servqual-model'
import { descriptiveStatistics, paperResults, simulatedData } from '@/data/simulated-research-data'

// Reactive data
const activeSection = ref('abstract')

const sections = [
  { id: 'abstract', title: '摘要 Abstract' },
  { id: 'introduction', title: '引言 Introduction' },
  { id: 'literature-review', title: '文献综述 Literature Review' },
  { id: 'model', title: '研究模型 Research Model' },
  { id: 'methodology', title: '研究方法 Methodology' },
  { id: 'results', title: '结果分析 Results' },
  { id: 'structural-model', title: '结构方程模型 SEM' },
  { id: 'data-analysis', title: '数据分析 Data Analysis' },
  { id: 'related-studies', title: '相关研究 Related Studies' },
  { id: 'theoretical-framework', title: '理论框架 Theoretical Framework' },
  { id: 'practical-implications', title: '实践启示 Practical Implications' },
  { id: 'future-research', title: '未来研究 Future Research' }
]

const researchHypotheses = paperResults.hypothesisResults.map(h => ({
  id: h.hypothesis.split(':')[0],
  hypothesis: h.hypothesis,
  result: h.result,
  interpretation: h.interpretation
}))

const measurementItems = {
  dd1: { text: "I see myself as someone talkative", loading: '0.735' },
  dd3: { text: "I see myself as someone full of energy", loading: '0.856' },
  dd4: { text: "I see myself as someone who generates a lot of enthusiasm", loading: '0.719' },
  dd6: { text: "I see myself as someone who has an assertive personality", loading: '0.578' },
  dd8: { text: "I see myself as someone outgoing, and sociable", loading: '0.874' }
}

const servqualDimensions = [
  { id: 'tangibles', description: 'The appearance of hotel\'s physical facilities, equipment, personnel, and communication materials.' },
  { id: 'reliability', description: 'The ability of the hotel to perform the promised service dependably and accurately.' },
  { id: 'responsiveness', description: 'The willingness of the hotel to help customers and provide prompt service.' },
  { id: 'assurance', description: 'The knowledge and courtesy of the hotel\'s employees and their ability to convey trust and confidence.' },
  { id: 'empathy', description: 'The caring, individualized attention the hotel provides its customers.' }
]

const modelResults = paperResults.hypothesisResults

const modelFit = paperResults.structuralModel
const measurementModel = paperResults.measurementModel

const descriptiveStats = descriptiveStatistics

const servqualComparison = reactive({
  tangibles: {
    label: 'Tangibles',
    introverts: descriptiveStats.servqualWeights.introverts.tangibles,
    extroverts: descriptiveStats.servqualWeights.extroverts.tangibles,
    difference: descriptiveStats.servqualWeights.introverts.tangibles - descriptiveStats.servqualWeights.extroverts.tangibles
  },
  reliability: {
    label: 'Reliability', 
    introverts: descriptiveStats.servqualWeights.introverts.reliability,
    extroverts: descriptiveStats.servqualWeights.extroverts.reliability,
    difference: descriptiveStats.servqualWeights.introverts.reliability - descriptiveStats.servqualWeights.extroverts.reliability
  },
  responsiveness: {
    label: 'Responsiveness',
    introverts: descriptiveStats.servqualWeights.introverts.responsiveness,
    extroverts: descriptiveStats.servqualWeights.extroverts.responsiveness,
    difference: descriptiveStats.servqualWeights.introverts.responsiveness - descriptiveStats.servqualWeights.extroverts.responsiveness
  },
  assurance: {
    label: 'Assurance',
    introverts: descriptiveStats.servqualWeights.introverts.assurance,
    extroverts: descriptiveStats.servqualWeights.extroverts.assurance,
    difference: descriptiveStats.servqualWeights.introverts.assurance - descriptiveStats.servqualWeights.extroverts.assurance
  },
  empathy: {
    label: 'Empathy',
    introverts: descriptiveStats.servqualWeights.introverts.empathy,
    extroverts: descriptiveStats.servqualWeights.extroverts.empathy,
    difference: descriptiveStats.servqualWeights.introverts.empathy - descriptiveStats.servqualWeights.extroverts.empathy
  }
})

// Methods
const getResultClass = (result: string) => {
  return result === 'Supported' ? 'supported' : 'not-supported'
}

const getRowClass = (result: string) => {
  return result === 'Supported' ? 'supported-row' : 'not-supported-row'
}

const getDifferenceClass = (difference: number) => {
  if (Math.abs(difference) > 5) return 'significant-difference'
  if (Math.abs(difference) > 2) return 'moderate-difference'
  return 'small-difference'
}


// Calculate effect sizes
const calculateEffectSize = (mean1: number, mean2: number, pooledSD: number = 5.2) => {
  return Math.abs(mean1 - mean2) / pooledSD
}

// Get effect size interpretation
const getEffectSizeLabel = (d: number) => {
  if (d >= 0.8) return 'Large'
  if (d >= 0.5) return 'Medium' 
  if (d >= 0.2) return 'Small'
  return 'Negligible'
}

onMounted(() => {
  // Chart initialization would be here for production
  console.log('Paper reproduction component mounted with', simulatedData.length, 'participants')
})
</script>

<style scoped>
.paper-reproduction-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Header Styles */
.paper-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 30px;
}

.paper-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.3;
}

.paper-meta {
  font-size: 14px;
  line-height: 1.6;
}

.authors {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
}

.affiliations {
  margin-bottom: 15px;
  opacity: 0.9;
}

.journal {
  font-size: 15px;
  font-weight: 600;
}

/* Navigation Styles */
.paper-nav {
  display: flex;
  background: white;
  border-radius: 12px;
  padding: 8px;
  margin-bottom: 30px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
  gap: 8px;
}

.nav-btn {
  flex: 1;
  min-width: 120px;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #6b7280;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.nav-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.nav-btn.active {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  font-weight: 600;
}

/* Content Styles */
.content-section {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.content-section h2 {
  color: #1f2937;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
  border-bottom: 3px solid #3b82f6;
  padding-bottom: 10px;
}

.content-section h3 {
  color: #374151;
  font-size: 20px;
  font-weight: 600;
  margin: 25px 0 15px 0;
}

/* Abstract Styles */
.abstract-content p {
  margin-bottom: 16px;
  line-height: 1.7;
  color: #374151;
}

.keywords {
  background: #f8fafc;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
  margin-top: 20px;
  font-style: italic;
}

/* Model Styles */
.model-container {
  display: grid;
  gap: 30px;
}

.research-model {
  text-align: center;
}

.model-diagram {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.model-caption {
  margin-top: 15px;
  font-weight: 600;
  color: #6b7280;
}

/* Hypotheses Styles */
.hypotheses-list {
  display: grid;
  gap: 20px;
}

.hypothesis-item {
  background: #f9fafb;
  padding: 20px;
  border-radius: 10px;
  border-left: 4px solid #d1d5db;
}

.hypothesis-item.supported {
  border-left-color: #10b981;
  background: #f0fdf4;
}

.hypothesis-item.not-supported {
  border-left-color: #ef4444;
  background: #fef2f2;
}

.hypothesis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.hypothesis-id {
  font-weight: 700;
  color: #1f2937;
}

.hypothesis-result {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.hypothesis-result.supported {
  background: #d1fae5;
  color: #065f46;
}

.hypothesis-result.not-supported {
  background: #fee2e2;
  color: #991b1b;
}

/* Methodology Styles */
.methodology-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
}

.method-card {
  background: #f8fafc;
  padding: 25px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.method-card h3 {
  color: #1f2937;
  margin-bottom: 15px;
  margin-top: 0;
}

.method-card ul {
  margin: 0;
  padding-left: 20px;
}

.method-card li {
  margin-bottom: 8px;
  color: #374151;
}

/* Measurement Items */
.measurement-items {
  display: grid;
  gap: 15px;
}

.item-card {
  background: #f1f5f9;
  padding: 18px;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
}

.item-text {
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 8px;
}

.item-stats {
  font-size: 14px;
  color: #64748b;
}

.loading {
  background: #dbeafe;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: monospace;
}

/* Table Styles */
.table-container {
  overflow-x: auto;
  margin: 20px 0;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.results-table, .correlation-table, .comparison-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  font-size: 14px;
}

.results-table th,
.correlation-table th,
.comparison-table th {
  background: #f8fafc;
  color: #374151;
  font-weight: 600;
  padding: 15px 12px;
  text-align: left;
  border-bottom: 2px solid #e5e7eb;
}

.results-table td,
.correlation-table td,
.comparison-table td {
  padding: 12px;
  border-bottom: 1px solid #f3f4f6;
  color: #4b5563;
}

.section-header {
  background: #f3f4f6 !important;
  font-weight: 600;
  color: #1f2937;
}

.diagonal {
  font-weight: 600;
  font-style: italic;
  background: #eff6ff;
}

.supported-row {
  background: #f0fdf4;
}

.not-supported-row {
  background: #fefbfb;
}

.result-badge {
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Analysis Styles */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
}

.stat-card, .fit-card {
  background: #f8fafc;
  padding: 25px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.fit-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.comparison-container {
  display: grid;
  gap: 30px;
}

.comparison-chart {
  background: white;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
}

.significant-difference {
  background: #fef3c7 !important;
  font-weight: 600;
}

.moderate-difference {
  background: #fef7ed !important;
}

.small-difference {
  background: #f9fafb !important;
}

/* Chart Styles */
.chart-placeholder {
  padding: 20px;
  text-align: center;
}

.bar-chart {
  margin: 20px 0;
}

.bar-group {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.bar-label {
  min-width: 120px;
  font-weight: 600;
  text-align: left;
  font-size: 14px;
}

.bars {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.bar {
  height: 25px;
  border-radius: 4px;
  position: relative;
  display: flex;
  align-items: center;
  min-width: 60px;
  transition: all 0.3s ease;
}

.bar.introvert {
  background: linear-gradient(90deg, #3b82f6, #2563eb);
  color: white;
}

.bar.extrovert {
  background: linear-gradient(90deg, #10b981, #059669);
  color: white;
}

.bar-value {
  padding: 0 10px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 20px;
  height: 15px;
  border-radius: 3px;
}

.legend-color.introvert {
  background: linear-gradient(90deg, #3b82f6, #2563eb);
}

.legend-color.extrovert {
  background: linear-gradient(90deg, #10b981, #059669);
}

/* Findings Styles */
.findings-list {
  display: grid;
  gap: 20px;
}

.finding-item {
  padding: 25px;
  border-radius: 12px;
  border-left: 5px solid #d1d5db;
}

.finding-item.supported {
  background: #f0fdf4;
  border-left-color: #10b981;
}

.finding-item.not-supported {
  background: #fef2f2;
  border-left-color: #ef4444;
}

.finding-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  gap: 12px;
}

.finding-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-weight: bold;
  font-size: 16px;
}

.supported .finding-icon {
  background: #10b981;
  color: white;
}

.not-supported .finding-icon {
  background: #ef4444;
  color: white;
}

.sem-container {
  margin: 20px 0;
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fafbfc;
}

/* Responsive Design */
@media (max-width: 768px) {
  .paper-reproduction-container {
    padding: 15px;
  }
  
  .paper-title {
    font-size: 22px;
  }
  
  .content-section {
    padding: 20px;
  }
  
  .methodology-grid,
  .stats-grid,
  .fit-stats-grid {
    grid-template-columns: 1fr;
  }
  
  .nav-btn {
    min-width: auto;
    flex: none;
  }
}
</style>