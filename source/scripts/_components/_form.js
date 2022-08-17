export default class Form {
	constructor(formElement) {
		this._formElement = formElement;
		this._submitElement = formElement.querySelector('[type="submit"]');

		this._setListeners();
	}

	_setListeners() {
		this._submitHandler = this._submitHandler.bind(this);

		this._submitElement.addEventListener('click', this._submitHandler);
	}

	_submitHandler(evt) {
		evt.preventDefault();
		this._submitElement.disabled = true;

		if (this._formElement.checkValidity()) {
			this._formElement.submit();
		}

		this._formElement.classList.add('form--validable');
		this._submitElement.disabled = false;
	}
}
