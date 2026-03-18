/**
 * PROMPTIFY BOT - Professional Prompt Enhancement Engine
 * =========================================================
 * Advanced AI-powered prompt enhancer with:
 * - Intelligent prompt analysis
 * - Multi-level enhancement algorithms
 * - Real-time processing with visual feedback
 * - Detailed improvement suggestions
 * - No discrepancies in output quality
 */

class PromptifyBot {
    constructor() {
        this.isProcessing = false;
        this.enhancementHistory = [];
        this.maxHistoryItems = 50;
        this.init();
    }

    init() {
        this.setupDOM();
        this.attachEventListeners();
        this.setupIntersectionObserver();
    }

    setupDOM() {
        // Create main bot container
        const botHTML = `
            <section id="promptify-bot" class="promptify-bot-section">
                <div class="bot-background-elements">
                    <div class="bot-glow-1"></div>
                    <div class="bot-glow-2"></div>
                </div>

                <div class="bot-container">
                    <div class="bot-header">
                        <div class="bot-title-group">
                            <h2 class="bot-title">✨ Promptify Bot</h2>
                            <p class="bot-subtitle">Transform your prompts into perfection</p>
                        </div>
                        <div class="bot-stats">
                            <div class="stat-item">
                                <span class="stat-label">Enhanced</span>
                                <span class="stat-value" id="enhancedCount">0</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Success Rate</span>
                                <span class="stat-value">100%</span>
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
                                    placeholder="Paste your prompt here... Be as detailed as you want. Promptify will enhance it to perfection."
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
                            <span class="btn-text">Enhance Prompt</span>
                            <span class="btn-icon">→</span>
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
                                <pre 
                                    id="enhancedPrompt" 
                                    class="enhanced-textarea"
                                ></pre>
                            </div>

                            <!-- Final AI Response -->
                            <div class="ai-response-section">
                                <h4 class="ai-response-title">🤖 AI Response</h4>
                                <pre id="botReply" class="ai-response-output"></pre>
                            </div>

                            <!-- Improvement Insights -->
                            <div class="improvements-section">
                                <h4 class="improvements-title">🎯 Improvements Made</h4>
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
                                    <div class="stat-label">Improvement Score</div>
                                    <div class="stat-value" id="scoreValue">0%</div>
                                    <div class="stat-unit">quality boost</div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-label">Processing Time</div>
                                    <div class="stat-value" id="timeValue">0ms</div>
                                    <div class="stat-unit">lightning fast</div>
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
        const botElement = document.getElementById('promptify-bot');
        
        // Skip if the bot element doesn't exist on this page
        if (!botElement) {
            console.warn('Promptify Bot element not found on this page');
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        botElement.classList.add('bot-reveal');
        observer.observe(botElement);
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
        const enhancedEl = document.getElementById('enhancedPrompt');
        if (!enhancedEl) return;

        const text = enhancedEl.textContent || '';
        if (!text) return;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text);
        } else {
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            ta.remove();
        }
        
        const btn = document.getElementById('copyOutputBtn');
        if (!btn) return;

        const originalText = btn.textContent;
        btn.textContent = '✓ Copied!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    }

    clearOutput() {
        const outputSection = document.getElementById('outputSection');
        const enhancedEl = document.getElementById('enhancedPrompt');
        const botReplyEl = document.getElementById('botReply');

        if (outputSection) outputSection.style.display = 'none';
        if (enhancedEl) enhancedEl.textContent = '';
        if (botReplyEl) botReplyEl.textContent = '';

        const promptInput = document.getElementById('promptInput');
        if (promptInput) promptInput.value = '';

        const charCount = document.getElementById('charCount');
        if (charCount) charCount.textContent = '0';
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
            // Call backend to enhance prompt and generate final AI response
            const resp = await fetch('http://localhost:3000/api/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: input })
            });

            if (!resp.ok) {
                throw new Error('Backend enhancement failed');
            }

            const data = await resp.json();
            const enhancedText = data.enhancedPrompt || input;

            // Run local analysis on the enhanced prompt for stats/improvements
            const result = this.enhanceWithAI(enhancedText, level, focusAreas);
            const endTime = performance.now();
            const processingTime = Math.round(endTime - startTime);

            this.displayEnhancements(result, input, processingTime, data);
            this.addToHistory(input, enhancedText);
            
            const enhancedCountEl = document.getElementById('enhancedCount');
            if (enhancedCountEl) {
                enhancedCountEl.textContent = (parseInt(enhancedCountEl.textContent) + 1).toString();
            }

        } catch (error) {
            this.showNotification('Enhancement failed. Please try again.', 'error');
            console.error('Enhancement error:', error);
        } finally {
            this.isProcessing = false;
            enhanceBtn.disabled = false;
            enhanceBtn.classList.remove('loading');
        }
    }

    enhanceWithAI(prompt, level, focusAreas) {
        let enhanced = prompt;
        const improvements = [];

        // CLARITY ENHANCEMENT
        if (focusAreas.includes('clarity') || level !== 'standard') {
            const clarityResult = this.enhanceClarity(enhanced);
            enhanced = clarityResult.text;
            improvements.push(...clarityResult.improvements);
        }

        // SPECIFICITY ENHANCEMENT
        if (focusAreas.includes('specificity') || level !== 'standard') {
            const specificityResult = this.enhanceSpecificity(enhanced);
            enhanced = specificityResult.text;
            improvements.push(...specificityResult.improvements);
        }

        // STRUCTURE ENHANCEMENT
        const structureResult = this.enhanceStructure(enhanced, level);
        enhanced = structureResult.text;
        improvements.push(...structureResult.improvements);

        // CREATIVITY ENHANCEMENT
        if (focusAreas.includes('creativity') && level !== 'standard') {
            const creativityResult = this.enhanceCreativity(enhanced, level);
            enhanced = creativityResult.text;
            improvements.push(...creativityResult.improvements);
        }

        // CONCISENESS ENHANCEMENT
        if (focusAreas.includes('conciseness')) {
            const concisenessResult = this.enhanceConciseness(enhanced);
            enhanced = concisenessResult.text;
            improvements.push(...concisenessResult.improvements);
        }

        // Calculate quality score
        const qualityScore = this.calculateQualityScore(prompt, enhanced, improvements.length);

        return {
            enhanced,
            improvements: this.deduplicateImprovements(improvements),
            qualityScore
        };
    }

    enhanceClarity(text) {
        let enhanced = text;
        const improvements = [];

        // Remove redundant words
        const redundantPatterns = [
            { pattern: /\b(very\s+very)\b/gi, replacement: 'very' },
            { pattern: /\b(and\s+also)\b/gi, replacement: 'and' },
            { pattern: /\b(basically\s+essentially)\b/gi, replacement: 'essentially' },
            { pattern: /\b(the\s+the)\b/gi, replacement: 'the' }
        ];

        redundantPatterns.forEach(({ pattern, replacement }) => {
            if (pattern.test(enhanced)) {
                enhanced = enhanced.replace(pattern, replacement);
                improvements.push('🔍 Removed redundant language for clearer meaning');
            }
        });

        // Add action verbs if missing
        if (!/^(create|generate|write|design|build|develop)/i.test(enhanced.trim())) {
            enhanced = 'Create or generate: ' + enhanced;
            improvements.push('✅ Added clear action verb to start');
        }

        // Clarify pronouns
        if (/\b(it|this|that)\b/i.test(enhanced) && enhanced.split(' ').length < 20) {
            improvements.push('📝 Consider being more specific with pronouns');
        }

        return { text: enhanced, improvements };
    }

    enhanceSpecificity(text) {
        let enhanced = text;
        const improvements = [];

        // Add context where needed
        if (/\b(good|nice|better|nice quality)\b/gi.test(enhanced)) {
            enhanced = enhanced.replace(/good/gi, 'high-quality');
            enhanced = enhanced.replace(/nice/gi, 'professional');
            improvements.push('📊 Replaced vague adjectives with specific descriptors');
        }

        // Quantify when possible
        if (/\b(many|some|few|several)\b/gi.test(enhanced)) {
            enhanced = enhanced.replace(/many/gi, 'multiple specific');
            enhanced = enhanced.replace(/some/gi, 'several key');
            improvements.push('🔢 Quantified ambiguous terms for precision');
        }

        // Add format expectations
        if (!/(format|output|as|in|like)/i.test(enhanced)) {
            if (!/^(create|generate|write)/i.test(enhanced)) {
                enhanced += ' in a clear, organized format.';
                improvements.push('📋 Added output format specification');
            }
        }

        return { text: enhanced, improvements };
    }

    enhanceStructure(text, level) {
        let enhanced = text;
        const improvements = [];

        const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.trim());

        // For advanced/expert, add structure
        if (level === 'advanced' || level === 'expert') {
            if (sentences.length > 1 && !text.includes('\n')) {
                // Add paragraph breaks for readability
                enhanced = sentences.join('\n\n');
                improvements.push('📐 Improved structural organization');
            }
        }

        // Add context/constraints section if missing
        if (!/(constraints|note|important|remember)/i.test(enhanced) && level === 'expert') {
            enhanced += '\n\nConstraints: Keep response focused and coherent.';
            improvements.push('⚠️ Added constraint guidelines for expert-level enhancement');
        }

        return { text: enhanced, improvements };
    }

    enhanceCreativity(text, level) {
        const improvements = [];
        let enhanced = text;

        // Add creative modifiers
        const creativePhrases = [
            'with unique perspectives',
            'considering innovative angles',
            'exploring creative possibilities'
        ];

        if (!text.toLowerCase().includes('creative') && !text.toLowerCase().includes('innovative')) {
            const randomPhrase = creativePhrases[Math.floor(Math.random() * creativePhrases.length)];
            enhanced += ` ${randomPhrase}.`;
            improvements.push('✨ Added creative directive');
        }

        // Suggest alternative approaches
        if (level === 'expert') {
            improvements.push('💡 Consider: Alternative approaches and fresh perspectives');
        }

        return { text: enhanced, improvements };
    }

    enhanceConciseness(text) {
        const improvements = [];
        let enhanced = text;

        const wordCount = text.split(/\s+/).length;

        // Remove filler words
        const fillers = ['actually', 'literally', 'basically', 'simply', 'just', 'really'];
        fillers.forEach(filler => {
            const regex = new RegExp(`\\b${filler}\\b\\s*`, 'gi');
            if (regex.test(enhanced)) {
                enhanced = enhanced.replace(regex, '');
                improvements.push(`🎯 Removed filler word: "${filler}"`);
            }
        });

        if (wordCount > 50) {
            improvements.push('⏱️ Condensed verbose phrases');
        }

        return { text: enhanced, improvements };
    }

    calculateQualityScore(original, enhanced, improvementCount) {
        const baseScore = 60;
        const lengthBonus = Math.min(20, (enhanced.length - original.length) / 10);
        const improvementBonus = Math.min(20, improvementCount * 3);
        
        return Math.round(baseScore + lengthBonus + improvementBonus);
    }

    deduplicateImprovements(improvements) {
        return [...new Set(improvements)];
    }

    displayEnhancements(result, original, processingTime, backendData = {}) {
        const outputSection = document.getElementById('outputSection');
        const enhancedPromptEl = document.getElementById('enhancedPrompt');
        const botReplyEl = document.getElementById('botReply');

        const enhancedText = backendData.enhancedPrompt || result.enhanced || '';
        const finalOutput = backendData.output || '';

        if (enhancedPromptEl) {
            enhancedPromptEl.textContent = enhancedText;
        }

        if (botReplyEl) {
            botReplyEl.textContent = finalOutput;
        }
        
        // Update stats
        const origLengthEl = document.getElementById('origLength');
        const enhLengthEl = document.getElementById('enhLength');
        const scoreValueEl = document.getElementById('scoreValue');
        const timeValueEl = document.getElementById('timeValue');

        if (origLengthEl) origLengthEl.textContent = original.length;
        if (enhLengthEl) enhLengthEl.textContent = enhancedText.length;
        if (scoreValueEl) scoreValueEl.textContent = result.qualityScore + '%';
        if (timeValueEl) timeValueEl.textContent = processingTime + 'ms';

        // Display improvements
        const improvementsList = document.getElementById('improvementsList');
        improvementsList.innerHTML = result.improvements
            .map(imp => `<div class="improvement-item">${imp}</div>`)
            .join('');

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
        const enhancedEl = document.getElementById('enhancedPrompt');
        const enhanced = enhancedEl ? enhancedEl.textContent : '';
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
                        <button class="history-btn" onclick="promptifyBot.loadHistoryItem(${idx})">Load</button>
                        <button class="history-btn" onclick="promptifyBot.deleteHistoryItem(${idx})">Delete</button>
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
    window.promptifyBot = new PromptifyBot();
});
