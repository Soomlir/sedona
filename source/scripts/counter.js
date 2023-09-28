const initCounter = (counterElement) => {
	const downElement = counterElement.querySelector(
		'.search-form__counter-minus'
	);
	const upElement = counterElement.querySelector('.search-form__counter-plus');
	const inputElement = counterElement.querySelector(
		'.search-form__input-number'
	);

	downElement.addEventListener('click', () => inputElement.stepDown());
	upElement.addEventListener('click', () => inputElement.stepUp());
};

export { initCounter };
