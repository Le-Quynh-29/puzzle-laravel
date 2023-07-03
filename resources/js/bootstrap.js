import _ from 'lodash';
import axios from 'axios';
import jquery from 'jquery';

try {
    window._ = _;
    window.$ = window.jQuery = jquery;
} catch (e) {}

window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
