const initPopup = () => {
	const popup = document.querySelector('.modal');
	const link = document.querySelector('.search-block__link');
	const closeButtonElement = popup.querySelector('.modal__close');

	const ESC_KEY = 'Escape';

	link.addEventListener('click', (evt) => {
		evt.preventDefault();
		popup.classList.add('modal--show');
	});

	closeButtonElement.addEventListener('click', (evt) => {
		evt.preventDefault();
		popup.classList.remove('modal--show');
	});

	window.addEventListener('keydown', (evt) => {
		if (evt.key === ESC_KEY) {
			if (popup.classList.contains('modal--show')) {
				evt.preventDefault();
				popup.classList.remove('modal--show');
			}
		}
	});
};

export { initPopup };
