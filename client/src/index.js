import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

let rootElement = document.getElementById("root");
let root = createRoot(rootElement);

root.render(<App />);