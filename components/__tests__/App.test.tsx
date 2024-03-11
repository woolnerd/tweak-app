import React from 'react';
import { create } from 'react-test-renderer';

import App from '../../App';

describe('<App />', () => {
  it('has 1 child', () => {
    const tree = create(<App />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
