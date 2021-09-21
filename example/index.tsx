import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import  TooltipComponent from '../dist'

const App = () => {
  return (
    <div>
      <TooltipComponent />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
