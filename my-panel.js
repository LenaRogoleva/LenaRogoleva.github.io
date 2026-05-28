class MyPanel extends HTMLElement {
    #shadow;
    #footerElement;

    connectedCallback() {
        this.#shadow = this.attachShadow({ mode: 'open' });
        this.#createTemplate();
        this.#footerElement = this.#shadow.querySelector('.panel-footer');
        this.#checkFooterSlot();
    }

    /**
     * Создаем шаблон компонента кастомной панели
     */
    #createTemplate() {
        const template = document.createElement('template');

        template.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-size: 0.875rem;
                    color: #222b45;
                }
                
                .panel {
                    border: 1px solid #dee2e6;
                    border-radius: 0.5rem;
                    background: #ffffff;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                
                .panel-header {
                    padding: 1rem 1.25rem;
                    background: #f8f9fa;
                    border-bottom: 1px solid #dee2e6;
                    border-radius: 0.5rem 0.5rem 0 0;
                    font-weight: 600;
                    font-size: 1rem;
                }
                
                .panel-content {
                    padding: 1.25rem;
                }
                
                .panel-footer {
                    padding: 1rem 1.25rem;
                    background: #f8f9fa;
                    border-top: 1px solid #dee2e6;
                    border-radius: 0 0 0.5rem 0.5rem;
                }
            </style>
        
            <div class="panel">
                <div class="panel-header">
                    <slot name="header">Header</slot>
                </div>
                <div class="panel-content">
                    <slot name="content">Body Content</slot>
                </div>
                <div class="panel-footer">
                    <slot name="footer"></slot>
                </div>
            </div>  
        `;
        
        this.#shadow.append(template.content.cloneNode(true));
    }

    /**
     * Проверяем, передан ли футер
     * Если нет, удаляем его обертку
     */
    #checkFooterSlot() {
        const footerSlot = this.#shadow.querySelector('slot[name="footer"]');
        if (footerSlot) {
            const hasFooterContent = footerSlot.assignedElements().length > 0;
            if (!hasFooterContent) {
                this.#footerElement.remove();
            }
        }
    }
}

customElements.define(document.currentScript.dataset.name, MyPanel);
