import React from 'react';
import { Router, BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { App } from './app';
import reportWebVitals from './reportWebVitals';

import { history } from './_helpers';
import { accountService } from './_services';
import { initLocale } from './_config/Locale';

initLocale();

accountService.refreshToken();

ReactDOM.render(
  <BrowserRouter basename="/backend/">
    <App />
  </BrowserRouter>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
