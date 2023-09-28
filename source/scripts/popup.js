const popupFunctional = () => {
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

const stepUpDown = () => {
	const downElements = document.querySelectorAll('.search-form__counter-minus');
	const upElements = document.querySelectorAll('.search-form__counter-plus');
	const inputElements = document.querySelectorAll('.search-form__input-number');

	downElements.forEach((element, index) => {
		element.addEventListener('click', () =>
			index === 0 ? inputElements[0].stepDown() : inputElements[1].stepDown()
		);
	});

	upElements.forEach((element, index) => {
		element.addEventListener('click', () =>
			index === 0 ? inputElements[0].stepUp() : inputElements[1].stepUp()
		);
	});
};

export { popupFunctional, stepUpDown };
