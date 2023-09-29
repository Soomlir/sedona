import { initCounter } from './counter.js';
import { initPopup } from './popup.js';
import { initRange } from './range.js';

document.querySelectorAll('[data-counter]').forEach(initCounter);
document.querySelectorAll('.modal').forEach(initPopup);
document.querySelectorAll('.range').forEach(initRange);
