class MySelect extends HTMLElement {
    #selectButton;
    #selectPopup;
    #selectPopupSearch;
    #optionsBox;
    #shadow;

    connectedCallback() {
        this.#shadow = this.attachShadow({ mode: 'open' });
        this.#createTemplate();
        this.#renderOptions();
        this.#eventListeners();
    }

    /**
     * Создаем шаблон нашего компонента
     */
    #createTemplate() {
        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                :host {
                  --hover-border-color: #2196F3;
                  --border-color: #ced4da;
                  --check-color: #3b82f6;
                  position: relative;
                  display: inline-block;
                  width: 18.75rem;
                  font-family: 'Open Sans', sans-serif;
                  font-size: 0.875rem;
                  color: #222b45;
                }
                
                .select-button {
                  width: 100%;
                  display: flex;
                  flex-direction: row;
                  justify-content: space-between;
                  align-items: center;
                  padding: 0.5rem 0.75rem;
                  border: 1px solid var(--border-color);
                  border-radius: 0.5rem;
                  background: #fff;
                  cursor: pointer;
                  text-align: left;
                  font-family: inherit;
                  transition: border-color 0.2s;
                  color: inherit;
                  
                  &:hover {
                    border-color: var(--hover-border-color);
                  }
                  
                  &::after {
                    content: '';
                    width: 0.875rem;
                    height: 0.875rem;
                    background-image: url("data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7.01744 10.398C6.91269 10.3985 6.8089 10.378 6.71215 10.3379C6.61541 10.2977 6.52766 10.2386 6.45405 10.1641L1.13907 4.84913C1.03306 4.69404 0.985221 4.5065 1.00399 4.31958C1.02276 4.13266 1.10693 3.95838 1.24166 3.82747C1.37639 3.69655 1.55301 3.61742 1.74039 3.60402C1.92777 3.59062 2.11386 3.64382 2.26584 3.75424L7.01744 8.47394L11.769 3.75424C11.9189 3.65709 12.097 3.61306 12.2748 3.62921C12.4527 3.64535 12.6199 3.72073 12.7498 3.84328C12.8797 3.96582 12.9647 4.12842 12.9912 4.30502C13.0177 4.48162 12.9841 4.662 12.8958 4.81724L7.58083 10.1322C7.50996 10.2125 7.42344 10.2775 7.32656 10.3232C7.22968 10.3689 7.12449 10.3944 7.01744 10.398Z' fill='%23222b45'/%3E%3C/svg%3E");
                    background-size: contain;
                    background-repeat: no-repeat;
                    background-position: center;
                  }
                  
                  &:focus {
                    outline: 0.2rem solid #1d71b866;
                  }
                } 
                
                .select-popup {
                  display: none;
                  position: absolute;
                  top: calc(100% + 0.25rem);
                  left: 0;
                  right: 0;
                  background: var(--select-popup-background, white);
                  border: 1px solid var(--border-color);
                  border-radius: 0.5rem;
                  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                  z-index: 1000;
                  max-height: 18.75rem;
                  overflow: hidden auto;
                }
 
                .select-popup.open {
                  display: block;
                }
                
                .select-popup-search {
                  width: calc(100% - 2.5rem);
                  padding: 0.5rem 0.75rem;
                  margin: 0.5rem;
                  border: 1px solid var(--border-color);
                  border-radius: 0.25rem;
                  font-family: inherit;
                  font-size: 0.875rem;
                  
                  &:focus,
                   &:hover {
                    border-color: var(--hover-border-color);
                    outline: none;
                  }
                }
                
                .select-popup-options {
                  padding: 0.25rem 0;
                }
                
                .option {
                  display: flex;
                  align-items: center;
                  padding: 0.5rem 0.75rem;
                  cursor: pointer;
                  user-select: none;
                  transition: background-color 0.2s;
                  
                  &:hover {
                    background-color: rgba(29, 113, 184, 0.3);
                  }
                }
                
                .option input[type="checkbox"] {
                  appearance: none;
                  width: 1rem;
                  height: 1rem;
                  border: 1px solid #d2d5d7;
                  border-radius: 0.25rem;
                  margin-right: 0.5rem;
                  cursor: pointer;
                  position: relative;
                  
                  &:checked {
                    background-color: var(--check-color);
                    border-color: var(--check-color);
                  }
                  
                  &:hover {
                    border-color: var(--check-color);
                  }
                  
                  &:checked::after {
                    content: '';
                    position: absolute;
                    left: 0.25rem;
                    top: 1px;
                    width: 0.25rem;
                    height: 0.5rem;
                    border: solid white;
                    border-width: 0 2px 2px 0;
                    transform: rotate(45deg);
                  }
                }
             </style>
             
            <button class="select-button">Option 1</button>
             <div class="select-popup">
                <input class="select-popup-search" 
                       placeholder="Search..." />
                <div class="select-popup-options"></div>
             </div>
             <template id="option-template">
                <label class="option"><input type="checkbox"/></label>
             </template>
        `;
        this.#shadow.append(template.content.cloneNode(true));

        this.#selectButton = this.#shadow.querySelector('.select-button');
        this.#selectPopup = this.#shadow.querySelector('.select-popup');
        this.#selectPopupSearch = this.#shadow.querySelector('.select-popup-search');
        this.#optionsBox = this.#shadow.querySelector('.select-popup-options');
    }

    /**
     * Преобразовываем переданные options и удаляем оригинальные
     */
    #renderOptions() {
        const options = [...this.querySelectorAll('option')]
            .map(option => ({ [option.value]: option.textContent }));

        const selectPopupOptionsElement = this.#getSelectPopup(options);

        this.querySelectorAll('option').forEach(opt => opt.remove());

        this.#optionsBox.replaceWith(selectPopupOptionsElement);
        this.#optionsBox = selectPopupOptionsElement;
    }

    /**
     * Получаем popup с options
     * Для каждой опции клонируем темплейт и заполняем данными
     * @param options
     * @returns {HTMLDivElement}
     */
    #getSelectPopup(options) {
        const container = document.createElement('div');
        container.className = 'select-popup-options';

        const optionTemplate = this.#shadow.querySelector('#option-template');
        
        options.forEach(option => {
            const value = Object.keys(option)[0];
            const labelText = option[value];

            const optionElement = optionTemplate.content.cloneNode(true);
            const label = optionElement.querySelector('label');
            
            // Заполняем данными
            label.dataset.value = value;
             label.appendChild(document.createTextNode(labelText));
            
            // Добавляем в контейнер
            container.appendChild(optionElement);
        });
        
        return container;
    }

    #eventListeners() {
        // Добавляем обработчик клика
        this.#selectButton.addEventListener('click', () => this.#openPopup());
    }

    #openPopup() {
        this.#selectPopup.classList.toggle('open');
    }
}

const componentName = document.currentScript.dataset.name;
customElements.define(componentName, MySelect);
