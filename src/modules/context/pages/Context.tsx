import React, { useContext, useReducer } from 'react';
import { Button } from 'antd';

import '../style/deme-2.less';

const themes = {
  light: {
    foreground: '#000000',
    background: '#eeeeee'
  },
  dark: {
    foreground: '#ffffff',
    background: '#222222'
  }
};

const ThemeContext = React.createContext(themes.light);

function Context() {
  return (
    <ThemeContext.Provider value={themes.dark}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function init(initialCount: number) {
  return { count: initialCount };
}

function reducer(
  state: ReturnType<typeof init>,
  action: { type: 'increment' | 'decrement' | 'reset'; payload?: number }
) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return init((action.payload = 1));
    default:
      throw new Error();
  }
}

function ThemedButton() {
  const theme = useContext(ThemeContext);
  const [state, dispatch] = useReducer(reducer, 1, init);

  return (
    <div styleName="deme-2">
      <Button style={{ background: theme.background, color: theme.foreground }}>
        按钮
      </Button>
      <div>
        Count: {state.count}
        <Button onClick={() => dispatch({ type: 'reset', payload: 1 })}>Reset</Button>
        <Button onClick={() => dispatch({ type: 'decrement' })}>-</Button>
        <Button onClick={() => dispatch({ type: 'increment' })}>+</Button>
      </div>
    </div>
  );
}

export default Context;
