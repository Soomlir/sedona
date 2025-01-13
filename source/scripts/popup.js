const ESC_KEY = 'Escape';

const initPopup = (popupElement) => {
	if (!popupElement) {
		return () => null;
	}

	const link = document.querySelector('.search-block__link');
	const closeButtonElement = popupElement.querySelector('.modal__close');

	link.addEventListener('click', (evt) => {
		evt.preventDefault();
		popupElement.classList.add('modal--show');
	});

	closeButtonElement.addEventListener('click', (evt) => {
		evt.preventDefault();
		popupElement.classList.remove('modal--show');
	});

	window.addEventListener('keydown', (evt) => {
		if (evt.key === ESC_KEY) {
			if (popupElement.classList.contains('modal--show')) {
				evt.preventDefault();
				popupElement.classList.remove('modal--show');
			}
		}
	});

	return true;
};

export { initPopup };
