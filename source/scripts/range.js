const handleAttributes = [
	{
		'aria-label': 'Меньше.'
	},
	{
		'aria-label': 'Больше.'
	}
];

const initRange = (containerElement = null) => {
	if (!containerElement) {
		return () => null;
	}
	const rangeElement = containerElement.querySelector('.range__target');
	const [fromFieldElement, toFieldElement] =
		containerElement.querySelectorAll('input');

	const min = parseInt(fromFieldElement.min, 10);
	const max = parseInt(fromFieldElement.max, 10);
	const step = parseInt(fromFieldElement.step, 10);
	const start = [fromFieldElement.value || min, toFieldElement.value || max];
	const handleChange = () => {
		rangeElement.noUiSlider.set([fromFieldElement.value, toFieldElement.value]);
	};

	noUiSlider.create(rangeElement, {
		connect: true,
		cssPrefix: 'range__',
		handleAttributes,
		range: { max, min },
		start,
		step
	});

	rangeElement.noUiSlider.on('update', ([startValue, endValue]) => {
		fromFieldElement.value = parseInt(startValue, 10);
		toFieldElement.value = parseInt(endValue, 10);
	});

	fromFieldElement.addEventListener('change', handleChange);
	toFieldElement.addEventListener('change', handleChange);

	rangeElement.classList.remove('range__target--no-js');

	const [fromOriginElement, toOriginElement] =
		rangeElement.querySelectorAll('.range__origin');

	if (fromFieldElement.disabled) {
		fromOriginElement.setAttribute('disabled', true);
	}
	if (toFieldElement.disabled) {
		toOriginElement.setAttribute('disabled', true);
	}
	if (fromFieldElement.disabled && toFieldElement.disabled) {
		rangeElement.classList.add('range__target--disabled');
	}

	return () => rangeElement.noUiSlider.set(start);
};

export { initRange };
