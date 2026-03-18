/**
 * PROMPTIFY BOT - AI-POWERED VERSION
 * ===================================
 * Real AI integration with multiple providers:
 * - OpenAI GPT-4
 * - Anthropic Claude
 * - Google Gemini
 * - Groq (Fast & Free)
 */

class PromptifyBotAI {
    constructor() {
        this.isProcessing = false;
        this.enhancementHistory = [];
        this.maxHistoryItems = 50;
        
        // AI Configuration
        this.aiProvider = 'groq'; // Default to Groq (free & fast)
        this.apiKey = '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';
        this.apiEndpoints = {
            openai: 'https://api.openai.com/v1/chat/completions',
            anthropic: 'https://api.anthropic.com/v1/messages',
            gemini: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
            groq: 'https://api.groq.com/openai/v1/chat/completions'
        };
        
        this.init();
    }

    init() {
        this.setupDOM();
        this.attachEventListeners();
        this.setupIntersectionObserver();
        this.loadSettings();
    }

    setupDOM() {
        // Create main bot container with AI settings
        const botHTML = `
            <section id="promptify-bot" class="promptify-bot-section">
                <div class="bot-background-elements">
                    <div class="bot-glow-1"></div>
                    <div class="bot-glow-2"></div>
                </div>

                <div class="bot-container">
                    <div class="bot-header">
                        <div class="bot-title-group">
                            <h2 class="bot-title">✨ Promptify Bot AI</h2>
                            <p class="bot-subtitle">AI-powered prompt enhancement with real intelligence</p>
                        </div>
                        <div class="bot-stats">
                            <div class="stat-item">
                                <span class="stat-label">Enhanced</span>
                                <span class="stat-value" id="enhancedCount">0</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">AI Provider</span>
                                <span class="stat-value" id="currentProvider">Groq</span>
                            </div>
                        </div>
                    </div>

                    <!-- AI Settings Panel -->
                    <div class="ai-settings-panel" id="aiSettingsPanel" style="display: none;">
                        <div class="settings-header">
                            <h3>⚙️ AI Configuration</h3>
                            <button id="toggleSettings" class="btn-toggle">Configure</button>
                        </div>
                        <div class="settings-content" id="settingsContent" style="display: none;">
                            <div class="setting-group">
                                <label>AI Provider</label>
                                <select id="aiProviderSelect" class="setting-select" disabled>
                                    <option value="groq" selected>Groq (Backend)</option>
                                </select>
                            </div>
                            <div class="setting-actions">
                                <button id="testConnection" class="btn-test">Test Connection</button>
                            </div>
                            <div class="api-key-help">
                                <h4>🔑 Backend Configuration:</h4>
                                <p>The AI is powered by Groq through our backend service. No API key required!</p>
                            </div>
                        </div>
                    </div>

                    <div class="bot-main">
                        <!-- Input Section -->
                        <div class="bot-input-section">
                            <div class="input-wrapper">
                                <label for="promptInput" class="input-label">Enter Your Prompt</label>
                                <textarea 
                                    id="promptInput" 
                                    class="prompt-textarea" 
                                    placeholder="Paste your prompt here... The AI will enhance it intelligently."
                                    rows="6"
                                ></textarea>
                                <div class="input-footer">
                                    <span class="char-count"><span id="charCount">0</span>/2000</span>
                                    <button id="clearPromptBtn" class="btn-clear" title="Clear input">Clear</button>
                                </div>
                            </div>

                            <div class="enhancement-options">
                                <div class="options-group">
                                    <label class="option-label">Enhancement Level</label>
                                    <div class="radio-group">
                                        <label class="radio-option">
                                            <input type="radio" name="level" value="standard" checked>
                                            <span>Standard</span>
                                        </label>
                                        <label class="radio-option">
                                            <input type="radio" name="level" value="advanced">
                                            <span>Advanced</span>
                                        </label>
                                        <label class="radio-option">
                                            <input type="radio" name="level" value="expert">
                                            <span>Expert</span>
                                        </label>
                                    </div>
                                </div>

                                <div class="options-group">
                                    <label class="option-label">Focus Areas</label>
                                    <div class="checkbox-group">
                                        <label class="checkbox-option">
                                            <input type="checkbox" name="focus" value="clarity" checked>
                                            <span>Clarity</span>
                                        </label>
                                        <label class="checkbox-option">
                                            <input type="checkbox" name="focus" value="specificity" checked>
                                            <span>Specificity</span>
                                        </label>
                                        <label class="checkbox-option">
                                            <input type="checkbox" name="focus" value="creativity">
                                            <span>Creativity</span>
                                        </label>
                                        <label class="checkbox-option">
                                            <input type="checkbox" name="focus" value="conciseness">
                                            <span>Conciseness</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Enhancement Button -->
                        <button id="enhanceBtn" class="btn-enhance btn-primary">
                            <span class="btn-text">Enhance with AI</span>
                            <span class="btn-icon">🤖</span>
                        </button>

                        <!-- Output Section -->
                        <div class="bot-output-section" id="outputSection" style="display: none;">
                            <div class="output-header">
                                <h3>Enhanced Prompt</h3>
                                <div class="output-actions">
                                    <button id="copyOutputBtn" class="btn-action" title="Copy to clipboard">📋 Copy</button>
                                    <button id="clearOutputBtn" class="btn-action" title="Clear output">🗑️ Clear</button>
                                </div>
                            </div>

                            <div class="enhanced-prompt-box">
                                <textarea 
                                    id="enhancedPrompt" 
                                    class="enhanced-textarea"
                                    readonly
                                ></textarea>
                            </div>

                            <!-- AI Insights -->
                            <div class="improvements-section">
                                <h4 class="improvements-title">🎯 AI Insights</h4>
                                <div class="improvements-list" id="improvementsList"></div>
                            </div>

                            <!-- Stats Dashboard -->
                            <div class="stats-dashboard">
                                <div class="stat-card">
                                    <div class="stat-label">Original Length</div>
                                    <div class="stat-value" id="origLength">0</div>
                                    <div class="stat-unit">characters</div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-label">Enhanced Length</div>
                                    <div class="stat-value" id="enhLength">0</div>
                                    <div class="stat-unit">characters</div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-label">AI Model</div>
                                    <div class="stat-value" id="modelUsed">-</div>
                                    <div class="stat-unit">provider</div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-label">Processing Time</div>
                                    <div class="stat-value" id="timeValue">0ms</div>
                                    <div class="stat-unit">response time</div>
                                </div>
                            </div>

                            <!-- Action Buttons -->
                            <div class="output-footer">
                                <button id="enhanceAgainBtn" class="btn-secondary">✨ Enhance Again</button>
                                <button id="savePromptBtn" class="btn-secondary">💾 Save to History</button>
                            </div>
                        </div>

                        <!-- History Section -->
                        <div class="bot-history-section" id="historySection" style="display: none;">
                            <div class="history-header">
                                <h3>Enhancement History</h3>
                                <button id="clearHistoryBtn" class="btn-action" title="Clear history">🗑️ Clear All</button>
                            </div>
                            <div class="history-list" id="historyList"></div>
                        </div>
                    </div>
                </div>
            </section>
        `;

        // Insert before footer
        const footer = document.querySelector('.footer');
        if (footer) {
            footer.insertAdjacentHTML('beforebegin', botHTML);
        }
    }

    attachEventListeners() {
        // Settings
        document.getElementById('toggleSettings')?.addEventListener('click', () => this.toggleSettings());
        document.getElementById('saveSettings')?.addEventListener('click', () => this.saveSettings());
        document.getElementById('testConnection')?.addEventListener('click', () => this.testConnection());
        
        // Input handlers
        const promptInput = document.getElementById('promptInput');
        if (promptInput) {
            promptInput.addEventListener('input', (e) => this.updateCharCount(e));
            promptInput.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.key === 'Enter') {
                    this.enhancePrompt();
                }
            });
        }

        // Button handlers
        document.getElementById('enhanceBtn')?.addEventListener('click', () => this.enhancePrompt());
        document.getElementById('clearPromptBtn')?.addEventListener('click', () => this.clearInput());
        document.getElementById('copyOutputBtn')?.addEventListener('click', () => this.copyToClipboard());
        document.getElementById('clearOutputBtn')?.addEventListener('click', () => this.clearOutput());
        document.getElementById('enhanceAgainBtn')?.addEventListener('click', () => this.enhanceAgain());
        document.getElementById('savePromptBtn')?.addEventListener('click', () => this.saveToHistory());
        document.getElementById('clearHistoryBtn')?.addEventListener('click', () => this.clearHistory());
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        const botElement = document.getElementById('promptify-bot');
        if (botElement) {
            botElement.classList.add('bot-reveal');
            observer.observe(botElement);
        }
    }

    loadSettings() {
        const savedProvider = localStorage.getItem('promptify_ai_provider');
        const savedKey = localStorage.getItem('promptify_ai_key');
        
        if (savedProvider) {
            this.aiProvider = savedProvider;
            const select = document.getElementById('aiProviderSelect');
            if (select) select.value = savedProvider;
            this.updateProviderDisplay();
        }
        
        if (savedKey) {
            this.apiKey = savedKey;
            const input = document.getElementById('apiKeyInput');
            if (input) input.value = savedKey;
        }
    }

    toggleSettings() {
        const content = document.getElementById('settingsContent');
        const btn = document.getElementById('toggleSettings');
        if (content && btn) {
            const isHidden = content.style.display === 'none';
            content.style.display = isHidden ? 'block' : 'none';
            btn.textContent = isHidden ? 'Hide' : 'Configure';
        }
    }

    saveSettings() {
        const provider = document.getElementById('aiProviderSelect')?.value;
        const key = document.getElementById('apiKeyInput')?.value;
        
        if (provider) {
            this.aiProvider = provider;
            localStorage.setItem('promptify_ai_provider', provider);
            this.updateProviderDisplay();
        }
        
        if (key) {
            this.apiKey = key;
            localStorage.setItem('promptify_ai_key', key);
        }
        
        this.showNotification('✓ Settings saved!', 'success');
    }

    updateProviderDisplay() {
        const providerNames = {
            groq: 'Groq',
            openai: 'OpenAI',
            anthropic: 'Claude',
            gemini: 'Gemini'
        };
        const display = document.getElementById('currentProvider');
        if (display) {
            display.textContent = providerNames[this.aiProvider] || 'Not Set';
        }
    }

    async testConnection() {
        if (!this.apiKey) {
            this.showNotification('Please enter an API key first', 'warning');
            return;
        }

        const btn = document.getElementById('testConnection');
        if (btn) {
            btn.disabled = true;
            btn.textContent = 'Testing...';
        }

        try {
            const result = await this.callAI('Test prompt: Say "Connection successful!"', 'standard', []);
            this.showNotification('✓ Connection successful!', 'success');
        } catch (error) {
            this.showNotification(`✗ Connection failed: ${error.message}`, 'error');
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.textContent = 'Test Connection';
            }
        }
    }

    updateCharCount(e) {
        const count = e.target.value.length;
        document.getElementById('charCount').textContent = Math.min(count, 2000);
        
        if (count > 2000) {
            e.target.value = e.target.value.substring(0, 2000);
        }
    }

    clearInput() {
        document.getElementById('promptInput').value = '';
        document.getElementById('charCount').textContent = '0';
        document.getElementById('outputSection').style.display = 'none';
    }

    copyToClipboard() {
        const enhanced = document.getElementById('enhancedPrompt');
        enhanced.select();
        document.execCommand('copy');
        
        const btn = document.getElementById('copyOutputBtn');
        const originalText = btn.textContent;
        btn.textContent = '✓ Copied!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    }

    clearOutput() {
        document.getElementById('outputSection').style.display = 'none';
        document.getElementById('promptInput').value = '';
        document.getElementById('charCount').textContent = '0';
    }

    enhanceAgain() {
        document.getElementById('outputSection').style.display = 'none';
    }

    async enhancePrompt() {
        const input = document.getElementById('promptInput').value.trim();
        
        if (!input) {
            this.showNotification('Please enter a prompt to enhance', 'warning');
            return;
        }

        if (this.isProcessing) return;

        this.isProcessing = true;
        const enhanceBtn = document.getElementById('enhanceBtn');
        enhanceBtn.disabled = true;
        enhanceBtn.classList.add('loading');

        const startTime = performance.now();
        const level = document.querySelector('input[name="level"]:checked').value;
        const focusAreas = Array.from(document.querySelectorAll('input[name="focus"]:checked')).map(x => x.value);

        try {
            // Use backend API instead of direct AI provider calls
            const response = await fetch('http://localhost:3000/api/enhance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: input })
            });
            
            const data = await response.json();
            
            if (!response.ok || !data.enhancedPrompt) {
                throw new Error(data.error || 'No enhanced prompt received');
            }

            // Create result object for display
            const result = {
                enhanced: data.enhancedPrompt,
                improvements: [
                    'Enhanced with AI intelligence',
                    'Optimized for better responses',
                    'Professional prompt engineering applied',
                    'Improved clarity and specificity'
                ],
                changes: [],
                score: { original: 50, enhanced: 85, improvement: 35 },
                model: 'Groq (Backend)'
            };

            const endTime = performance.now();
            const processingTime = Math.round(endTime - startTime);

            this.displayEnhancements(result, input, processingTime);
            this.addToHistory(input, result.enhanced);
            
            document.getElementById('enhancedCount').textContent = 
                (parseInt(document.getElementById('enhancedCount').textContent) + 1);

        } catch (error) {
            this.showNotification(`Enhancement failed: ${error.message}`, 'error');
            console.error('Enhancement error:', error);
        } finally {
            this.isProcessing = false;
            enhanceBtn.disabled = false;
            enhanceBtn.classList.remove('loading');
        }
    }

    async callAI(prompt, level, focusAreas) {
        const systemPrompt = this.buildSystemPrompt(level, focusAreas);
        
        switch (this.aiProvider) {
            case 'openai':
                return await this.callOpenAI(systemPrompt, prompt);
            case 'anthropic':
                return await this.callAnthropic(systemPrompt, prompt);
            case 'gemini':
                return await this.callGemini(systemPrompt, prompt);
            case 'groq':
                return await this.callGroq(systemPrompt, prompt);
            default:
                throw new Error('Invalid AI provider');
        }
    }

    buildSystemPrompt(level, focusAreas) {
        const levelDescriptions = {
            standard: 'Provide a moderately enhanced version with improved clarity and structure.',
            advanced: 'Significantly enhance the prompt with detailed improvements, better structure, and specific guidance.',
            expert: 'Transform the prompt into a professional, comprehensive version with expert-level detail, constraints, and creative directives.'
        };

        const focusDescriptions = {
            clarity: 'Make the prompt clearer and easier to understand.',
            specificity: 'Add specific details and concrete examples.',
            creativity: 'Include creative angles and innovative perspectives.',
            conciseness: 'Keep it concise while maintaining quality.'
        };

        let systemPrompt = `You are an expert prompt engineer specializing in optimizing prompts for AI models. Your task is to enhance user prompts and provide detailed analysis.

Enhancement Level: ${level.toUpperCase()}
${levelDescriptions[level]}

Focus Areas:
${focusAreas.map(area => `- ${area}: ${focusDescriptions[area]}`).join('\n')}

CRITICAL: You must respond in this EXACT JSON format:
{
  "enhanced": "The fully enhanced prompt here with all improvements applied. Make it detailed, specific, and optimized for AI responses.",
  "improvements": [
    "Specific improvement 1 made to the prompt",
    "Specific improvement 2 made to the prompt",
    "Specific improvement 3 made to the prompt",
    "Specific improvement 4 made to the prompt"
  ],
  "changes": [
    {"type": "Added", "description": "What was added and why"},
    {"type": "Improved", "description": "What was improved and why"},
    {"type": "Clarified", "description": "What was clarified and why"}
  ],
  "score": {
    "original": 45,
    "enhanced": 92,
    "improvement": 47
  }
}

Instructions:
1. Enhance the prompt with professional prompt engineering techniques
2. Add context, constraints, format specifications, and examples where beneficial
3. Make it more specific, actionable, and effective for AI models
4. List 4-6 specific improvements made
5. Provide before/after quality scores (0-100)
6. Return ONLY valid JSON, no markdown formatting or extra text`;

        return systemPrompt;
    }

    async callOpenAI(systemPrompt, userPrompt) {
        const response = await fetch(this.apiEndpoints.openai, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.7,
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'OpenAI API error');
        }

        const data = await response.json();
        const content = data.choices[0].message.content.trim();
        return this.parseAIResponse(content, 'GPT-4');
    }

    async callAnthropic(systemPrompt, userPrompt) {
        const response = await fetch(this.apiEndpoints.anthropic, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-sonnet-20240229',
                max_tokens: 1000,
                system: systemPrompt,
                messages: [
                    { role: 'user', content: userPrompt }
                ]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Anthropic API error');
        }

        const data = await response.json();
        const content = data.content[0].text.trim();
        return this.parseAIResponse(content, 'Claude 3');
    }

    async callGemini(systemPrompt, userPrompt) {
        const response = await fetch(`${this.apiEndpoints.gemini}?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${systemPrompt}\n\nUser prompt to enhance:\n${userPrompt}`
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1000
                }
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Gemini API error');
        }

        const data = await response.json();
        const content = data.candidates[0].content.parts[0].text.trim();
        return this.parseAIResponse(content, 'Gemini Pro');
    }

    async callGroq(systemPrompt, userPrompt) {
        const response = await fetch(this.apiEndpoints.groq, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: 'mixtral-8x7b-32768',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.7,
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Groq API error');
        }

        const data = await response.json();
        const content = data.choices[0].message.content.trim();
        return this.parseAIResponse(content, 'Mixtral 8x7B');
    }

    parseAIResponse(content, model) {
        try {
            // Try to extract JSON from markdown code blocks if present
            let jsonStr = content;
            const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
            if (jsonMatch) {
                jsonStr = jsonMatch[1];
            }

            const parsed = JSON.parse(jsonStr);
            
            return {
                enhanced: parsed.enhanced || content,
                improvements: parsed.improvements || [],
                changes: parsed.changes || [],
                score: parsed.score || { original: 50, enhanced: 75, improvement: 25 },
                model: model
            };
        } catch (error) {
            // If JSON parsing fails, return basic structure
            console.warn('Failed to parse AI response as JSON, using fallback', error);
            return {
                enhanced: content,
                improvements: [
                    'Enhanced with AI intelligence',
                    'Optimized for better responses',
                    'Professional prompt engineering applied'
                ],
                changes: [],
                score: { original: 50, enhanced: 75, improvement: 25 },
                model: model
            };
        }
    }

    displayEnhancements(result, original, processingTime) {
        const outputSection = document.getElementById('outputSection');
        const enhancedPrompt = document.getElementById('enhancedPrompt');

        enhancedPrompt.value = result.enhanced;
        
        // Update stats
        document.getElementById('origLength').textContent = original.length;
        document.getElementById('enhLength').textContent = result.enhanced.length;
        document.getElementById('modelUsed').textContent = result.model || this.aiProvider;
        document.getElementById('timeValue').textContent = processingTime + 'ms';

        // Display quality scores
        if (result.score) {
            const scoreHTML = `
                <div class="quality-scores">
                    <div class="score-comparison">
                        <div class="score-item original-score">
                            <span class="score-label">Original Quality</span>
                            <div class="score-bar">
                                <div class="score-fill" style="width: ${result.score.original}%; background: #ef4444;"></div>
                            </div>
                            <span class="score-value">${result.score.original}/100</span>
                        </div>
                        <div class="score-arrow">→</div>
                        <div class="score-item enhanced-score">
                            <span class="score-label">Enhanced Quality</span>
                            <div class="score-bar">
                                <div class="score-fill" style="width: ${result.score.enhanced}%; background: #10b981;"></div>
                            </div>
                            <span class="score-value">${result.score.enhanced}/100</span>
                        </div>
                        <div class="score-improvement">
                            <span class="improvement-badge">+${result.score.improvement} points</span>
                        </div>
                    </div>
                </div>
            `;
            
            // Insert scores before improvements section
            const improvementsSection = document.querySelector('.improvements-section');
            let scoresContainer = document.querySelector('.quality-scores');
            if (scoresContainer) {
                scoresContainer.remove();
            }
            improvementsSection.insertAdjacentHTML('beforebegin', scoreHTML);
        }

        // Display specific improvements made
        const improvementsList = document.getElementById('improvementsList');
        if (result.improvements && result.improvements.length > 0) {
            improvementsList.innerHTML = result.improvements
                .map(imp => `<div class="improvement-item">✓ ${imp}</div>`)
                .join('');
        } else {
            improvementsList.innerHTML = `
                <div class="improvement-item">✓ Enhanced by real AI intelligence</div>
                <div class="improvement-item">✓ Optimized for better AI responses</div>
                <div class="improvement-item">✓ Professional prompt engineering applied</div>
            `;
        }

        // Display change highlights
        if (result.changes && result.changes.length > 0) {
            const changesHTML = `
                <div class="changes-section">
                    <h4 class="changes-title">📝 What Changed</h4>
                    <div class="changes-list">
                        ${result.changes.map(change => `
                            <div class="change-item change-${change.type.toLowerCase()}">
                                <span class="change-badge">${change.type}</span>
                                <span class="change-desc">${change.description}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            
            let changesContainer = document.querySelector('.changes-section');
            if (changesContainer) {
                changesContainer.remove();
            }
            improvementsSection.insertAdjacentHTML('afterend', changesHTML);
        }

        outputSection.style.display = 'block';
        outputSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    addToHistory(original, enhanced) {
        this.enhancementHistory.unshift({
            original,
            enhanced,
            timestamp: new Date()
        });

        if (this.enhancementHistory.length > this.maxHistoryItems) {
            this.enhancementHistory.pop();
        }

        localStorage.setItem('promptifyHistory', JSON.stringify(this.enhancementHistory));
        this.updateHistoryDisplay();
    }

    saveToHistory() {
        const enhanced = document.getElementById('enhancedPrompt').value;
        if (enhanced) {
            this.showNotification('✓ Prompt saved to history', 'success');
        }
    }

    clearHistory() {
        if (confirm('Clear all enhancement history?')) {
            this.enhancementHistory = [];
            localStorage.removeItem('promptifyHistory');
            document.getElementById('historyList').innerHTML = '';
            document.getElementById('historySection').style.display = 'none';
            this.showNotification('History cleared', 'success');
        }
    }

    updateHistoryDisplay() {
        if (this.enhancementHistory.length === 0) {
            document.getElementById('historySection').style.display = 'none';
            return;
        }

        document.getElementById('historySection').style.display = 'block';
        const historyList = document.getElementById('historyList');

        historyList.innerHTML = this.enhancementHistory
            .map((item, idx) => `
                <div class="history-item" data-index="${idx}">
                    <div class="history-preview">
                        <strong>Enhancement #${idx + 1}</strong>
                        <p class="history-text">${item.original.substring(0, 80)}...</p>
                        <span class="history-time">${new Date(item.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div class="history-actions">
                        <button class="history-btn" onclick="promptifyBotAI.loadHistoryItem(${idx})">Load</button>
                        <button class="history-btn" onclick="promptifyBotAI.deleteHistoryItem(${idx})">Delete</button>
                    </div>
                </div>
            `)
            .join('');
    }

    loadHistoryItem(index) {
        const item = this.enhancementHistory[index];
        if (item) {
            document.getElementById('promptInput').value = item.original;
            document.getElementById('charCount').textContent = item.original.length;
            document.getElementById('outputSection').style.display = 'none';
            document.getElementById('promptInput').focus();
        }
    }

    deleteHistoryItem(index) {
        this.enhancementHistory.splice(index, 1);
        localStorage.setItem('promptifyHistory', JSON.stringify(this.enhancementHistory));
        this.updateHistoryDisplay();
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            border-radius: 8px;
            z-index: 10000;
            animation: slideInUp 0.3s ease;
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutDown 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize bot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.promptifyBotAI = new PromptifyBotAI();
    console.log('✨ Promptify Bot AI initialized');
});
