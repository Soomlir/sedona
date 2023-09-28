import { initCounter } from './counter.js';
import { initPopup } from './popup.js';
import { initRange } from './range.js';


initRange(document.querySelector('.range'));
initPopup();
document.querySelectorAll('[data-counter]').forEach(initCounter);
