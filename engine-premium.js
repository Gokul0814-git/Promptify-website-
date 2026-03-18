/**
 * PROMPT ENGINE - Premium Enhancement Section
 * ============================================
 * 2-column layout with rocket animation and enhancement percentage calculation
 */

class PromptEngine {
    constructor() {
        this.inputElement = document.getElementById('enginePromptInput');
        this.outputElement = document.getElementById('enginePromptOutput');
        this.enhanceButton = document.getElementById('engineEnhanceBtn');
        this.copyButton = document.getElementById('engineCopyBtn');
        this.clearButton = document.getElementById('engineClearBtn');
        this.charCountElement = document.getElementById('engineCharCount');
        this.rocketContainer = document.getElementById('engineRocket');
        this.percentageContainer = document.getElementById('enhancementPercentage');
        this.percentageValue = document.getElementById('percentageValue');
        
        this.isProcessing = false;
        this.maxChars = 2000;
        
        this.init();
    }

    init() {
        // Check if engine elements exist on this page
        if (!this.inputElement || !this.outputElement || !this.enhanceButton) {
            console.log('Engine elements not found on this page, skipping initialization');
            console.log('Input element:', this.inputElement);
            console.log('Output element:', this.outputElement);
            console.log('Enhance button:', this.enhanceButton);
            return;
        }
        
        this.attachEventListeners();
        console.log('✨ Prompt Engine initialized');
    }

    attachEventListeners() {
        // Input handling
        if (this.inputElement) {
            this.inputElement.addEventListener('input', (e) => this.updateCharCount(e));
            this.inputElement.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.key === 'Enter') {
                    this.enhancePrompt();
                }
            });
        }

        // Button handlers
        if (this.enhanceButton) {
            this.enhanceButton.addEventListener('click', () => this.enhancePrompt());
        }
        if (this.copyButton) {
            this.copyButton.addEventListener('click', () => this.copyOutput());
        }
        if (this.clearButton) {
            this.clearButton.addEventListener('click', () => this.clearAll());
        }
    }

    updateCharCount(e) {
        const count = e.target.value.length;
        if (this.charCountElement) {
            this.charCountElement.textContent = Math.min(count, this.maxChars);
        }
        
        if (count > this.maxChars) {
            e.target.value = e.target.value.substring(0, this.maxChars);
        }
    }

    async enhancePrompt() {
        console.log('🚀 Engine enhancePrompt called');
        const input = this.inputElement?.value.trim();
        console.log('📝 Input:', input);
        
        if (!input) {
            this.showNotification('Please enter a prompt to enhance', 'warning');
            return;
        }

        if (this.isProcessing) return;

        console.log('🔄 Starting enhancement process...');
        this.isProcessing = true;
        if (this.enhanceButton) {
            this.enhanceButton.disabled = true;
            this.enhanceButton.classList.add('enhancing');
        }

        try {
            console.log('📡 Calling backend API...');
            // Call backend to get AI-enhanced prompt (and full AI answer)
            const resp = await fetch('http://localhost:3000/api/enhance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: input })
            });

            console.log('📨 Backend response status:', resp.status);
            
            if (!resp.ok) {
                throw new Error('Backend enhancement failed');
            }

            const data = await resp.json();
            console.log('📊 Backend response data:', data);
            
            const enhancedText = (data && data.enhancedPrompt) ? data.enhancedPrompt : input;

            // Calculate enhancement percentage using AI-enhanced prompt
            const percentage = this.calculateEnhancementPercentage(input, enhancedText);

            // Display enhanced prompt in the output box
            this.displayResults(enhancedText, percentage, input);

            // Launch rocket animation
            this.launchRocket();

            // Show enhancement percentage
            this.showEnhancementPercentage(percentage);

            // Optionally log full AI answer for debugging
            if (data && data.output) {
                console.log('AI full response:', data.output);
            }

        } catch (error) {
            console.error('❌ Enhancement error:', error);
            this.showNotification('Enhancement failed. Please try again.', 'error');
        } finally {
            this.isProcessing = false;
            if (this.enhanceButton) {
                this.enhanceButton.disabled = false;
                this.enhanceButton.classList.remove('enhancing');
            }
        }
    }

    enhanceWithAI(prompt) {
        // Extract key intent from the prompt
        const intent = this.extractIntent(prompt);
        
        // Generate enhanced prompt using prompt engineering patterns
        const enhanced = this.generateEnhancedPrompt(prompt, intent);
        
        const improvements = [
            'Enhanced Context',
            'Added Structure',
            'Improved Clarity',
            'Better Results'
        ];

        return { enhanced, improvements };
    }

    extractIntent(prompt) {
        const lowerPrompt = prompt.toLowerCase();
        
        if (/write|create|compose|generate/i.test(lowerPrompt)) return 'creative';
        if (/code|program|build|develop/i.test(lowerPrompt)) return 'technical';
        if (/explain|understand|learn|teach|what|how/i.test(lowerPrompt)) return 'educational';
        if (/analyze|research|compare|evaluate/i.test(lowerPrompt)) return 'analytical';
        
        return 'general';
    }

    generateEnhancedPrompt(original, intent) {
        const templates = {
            creative: `Write the following with clear detail and creativity: ${original}\n\nInclude specific examples and maintain consistent quality.`,
            technical: `Provide a solution for: ${original}\n\nInclude code or clear steps, explain key concepts, and follow best practices.`,
            educational: `Explain: ${original}\n\nBreak it down simply, use examples, and make it easy to understand.`,
            analytical: `Analyze: ${original}\n\nCover main points, provide details, and consider different perspectives.`,
            general: `${original}\n\nProvide a clear, detailed, and helpful response.`
        };

        const enhanced = templates[intent] || templates.general;
        return enhanced;
    }

    calculateEnhancementPercentage(original, enhanced) {
        // Formula: ((enhanced_length - original_length) / original_length) * 100
        if (original.length === 0) return 0;
        
        const diff = enhanced.length - original.length;
        let percentage = (diff / original.length) * 100;
        
        // Cap at 150-300% for normal enhancement
        percentage = Math.max(-50, Math.min(300, percentage));
        
        return Math.round(Math.abs(percentage));
    }

    displayResults(enhanced, percentage, original) {
        if (this.outputElement) {
            this.outputElement.value = enhanced;
            // Scroll to output
            this.outputElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    launchRocket() {
        if (this.rocketContainer) {
            // Reset animation
            this.rocketContainer.style.animation = 'none';
            
            // Trigger reflow to restart animation
            void this.rocketContainer.offsetWidth;
            
            this.rocketContainer.style.animation = '';
            
            // Remove opacity after animation
            setTimeout(() => {
                const rocket = this.rocketContainer?.querySelector('.rocket-icon');
                if (rocket) {
                    rocket.style.opacity = '0';
                }
            }, 2000);
        }
    }

    showEnhancementPercentage(percentage) {
        if (this.percentageContainer && this.percentageValue) {
            this.percentageValue.textContent = percentage;
            this.percentageContainer.style.display = 'block';
            
            // Animate the number
            this.animatePercentage(0, percentage);
            
            // Hide after 3 seconds
            setTimeout(() => {
                if (this.percentageContainer) {
                    this.percentageContainer.style.opacity = '0';
                    this.percentageContainer.style.transition = 'opacity 0.3s ease';
                    setTimeout(() => {
                        if (this.percentageContainer) {
                            this.percentageContainer.style.display = 'none';
                            this.percentageContainer.style.opacity = '1';
                            this.percentageContainer.style.transition = 'none';
                        }
                    }, 300);
                }
            }, 3000);
        }
    }

    animatePercentage(start, end) {
        const duration = 600;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + (end - start) * easeOut);
            
            if (this.percentageValue) {
                this.percentageValue.textContent = current;
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    copyOutput() {
        const output = this.outputElement?.value;
        if (!output) {
            this.showNotification('Nothing to copy yet. Enhance a prompt first!', 'warning');
            return;
        }

        navigator.clipboard.writeText(output).then(() => {
            this.showNotification('✓ Copied to clipboard!', 'success');
            
            if (this.copyButton) {
                const originalText = this.copyButton.textContent;
                this.copyButton.textContent = '✓ Copied!';
                setTimeout(() => {
                    this.copyButton.textContent = originalText;
                }, 2000);
            }
        }).catch(() => {
            // Fallback for older browsers
            if (this.outputElement) {
                this.outputElement.select();
                document.execCommand('copy');
                this.showNotification('✓ Copied to clipboard!', 'success');
            }
        });
    }

    clearAll() {
        if (this.inputElement) {
            this.inputElement.value = '';
        }
        if (this.outputElement) {
            this.outputElement.value = '';
        }
        if (this.charCountElement) {
            this.charCountElement.textContent = '0';
        }
        if (this.percentageContainer) {
            this.percentageContainer.style.display = 'none';
        }
        this.showNotification('Cleared!', 'info');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            border-radius: 8px;
            z-index: 10000;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            animation: slideInUp 0.3s ease;
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutDown 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize when partials are loaded (engine.html is loaded via include-partials.js)
document.addEventListener('partialsLoaded', () => {
    console.log('🔧 Partials loaded, initializing Prompt Engine...');
    window.promptEngine = new PromptEngine();
    console.log('✨ Prompt Engine initialization complete');
});

// Fallback: also try DOMContentLoaded in case partials are already loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔧 DOM loaded, checking if engine elements exist...');
    
    // Check if engine elements already exist
    const inputElement = document.getElementById('enginePromptInput');
    const outputElement = document.getElementById('enginePromptOutput');
    const enhanceButton = document.getElementById('engineEnhanceBtn');
    
    if (inputElement && outputElement && enhanceButton) {
        console.log('✅ Engine elements found, initializing immediately...');
        window.promptEngine = new PromptEngine();
        console.log('✨ Prompt Engine initialization complete');
    } else {
        console.log('⏳ Engine elements not yet loaded, waiting for partialsLoaded event...');
    }
});
