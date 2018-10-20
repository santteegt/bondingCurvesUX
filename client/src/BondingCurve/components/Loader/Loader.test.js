import React from 'react';
import ReactDOM from 'react-dom';
import Loader from './index';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Loader height={200} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
