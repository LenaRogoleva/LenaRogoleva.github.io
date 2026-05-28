class MyCard extends HTMLElement {
    static observedAttributes = ["header", "subheader"];

    #shadow;
    #headerElement;
    #subheaderElement;
    #headerText = 'Заголовок карточки';
    #subheaderText = '';

    connectedCallback() {
        this.#shadow = this.attachShadow({ mode: 'open' });
        this.#createTemplate();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'header') {
            this.#headerText = newValue;
            this.#setHeaderText();
        } else if (name === 'subheader') {
            this.#subheaderText = newValue;
            this.#setSubheaderText();
        }
    }

    /**
     * Создаем шаблон компонента кастомной карточки
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
                
                .card {
                    background: #ffffff;
                    border: 1px solid #e4e4e7;
                    border-radius: 0.75rem;
                    overflow: hidden;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                    transition: box-shadow 0.2s, transform 0.2s;
                }
                
                .card:hover {
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    transform: translateY(-2px);
                }
                
                .card-header {
                    padding: 1rem 1.25rem;
                    background: #f8f9fa;
                    border-bottom: 1px solid #dee2e6;
                    border-radius: 0.5rem 0.5rem 0 0;
                }
                
                .card-title {
                    font-weight: 600;
                    font-size: 1rem;
                    margin: 0;
                }
                
                .card-subheader {
                    font-weight: 400;
                    font-size: 0.875rem;
                    color: #6c757d;
                    margin: 0.25rem 0 0 0;
                }
                
                .card-subheader:empty {
                    display: none;
                }
                
                .card-content {
                    padding: 1.25rem;
                }
                
                slot[name="footer"]::slotted(*) {
                    padding: 1rem 1.25rem;
                    background: #fafafa;
                    border-top: 1px solid #e4e4e7;
                    display: flex;
                    gap: 0.75rem;
                    justify-content: flex-end;
                }
                
            </style>
            
            <section class="card">
                <div class="card-header">
                    <div class="card-title">Заголовок карточки</div>
                    <div class="card-subheader"></div>
                </div>
                <div class="card-content">
                    <slot></slot>
                </div>
                <slot name="footer"></slot>
            </section>
        `;
        
        this.#shadow.append(template.content.cloneNode(true));

        this.#headerElement = this.#shadow.querySelector('.card-title');
        this.#subheaderElement = this.#shadow.querySelector('.card-subheader');
        this.#setHeaderText();
        this.#setSubheaderText();
    }

    /**
     * Устанавливаем значение заголовка из переданного атрибута
     */
    #setHeaderText() {
        if (this.#headerElement) {
            this.#headerElement.textContent = this.#headerText;
        }
    }

    /**
     * Устанавливаем значение подзаголовка из переданного атрибута
     */
    #setSubheaderText() {
        if (this.#subheaderElement) {
            this.#subheaderElement.textContent = this.#subheaderText;
        }
    }
}

customElements.define(document.currentScript.dataset.name, MyCard);
