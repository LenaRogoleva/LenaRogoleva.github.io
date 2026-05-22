class MySelect extends HTMLElement {
    #selectButton;
    #selectPopup;
    #selectPopupSearch;
    #optionsBox;

    connectedCallback() {
        this.#createTemplate();
        this.#renderOptions();
    }

    /**
     * Создаем шаблон нашего компонента
     */
    #createTemplate() {
        const template = document.createElement('template');
        template.innerHTML = `
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
        this.append(template.content.cloneNode(true));

        this.#selectButton = this.querySelector('.select-button');
        this.#selectPopup = this.querySelector('.select-popup');
        this.#selectPopupSearch = this.querySelector('.select-popup-search');
        this.#optionsBox = this.querySelector('.select-popup-options');
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

        const optionTemplate = this.querySelector('#option-template');
        
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
}

const componentName = document.currentScript.dataset.name;
customElements.define(componentName, MySelect);
