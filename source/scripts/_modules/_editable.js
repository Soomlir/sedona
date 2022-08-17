const CONTENT_TAGS = ['h1, h2, h3, p, b, a, button, label, legend, blockquote, cite'];
const CONTROL_TAGS = ['input', 'textarea'];

const isElementControl = (tagName) => document.activeElement.tagName.toLowerCase() === tagName;
const isControlElementActive = () => CONTROL_TAGS.some(isElementControl);

document.querySelectorAll(...CONTENT_TAGS).forEach((element) => {
	element.spellcheck = false;
});

document.addEventListener('keydown', (evt) => {
	if (evt.key.toLowerCase() === 'e' && !isControlElementActive()) {
		document.body.contentEditable = document.body.contentEditable !== 'true';
	}
});
