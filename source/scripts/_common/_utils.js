// Связывает js-компоненты с DOM-элементами
export const setupComponent = ([selector, Component]) => {
	document.querySelectorAll(selector).forEach((element) => new Component(element));
};
