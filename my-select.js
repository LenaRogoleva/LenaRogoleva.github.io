class MySelect extends HTMLElement {}

const componentName = document.currentScript.dataset.name;
customElements.define(componentName, MySelect);
