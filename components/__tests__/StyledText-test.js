import React from 'react';
import { render, screen } from '@testing-library/react-native';

import { MonoText } from '../StyledText';

it('renders correctly', () => {
  render(<MonoText>Snapshot test!</MonoText>);

  expect(screen.getByText('Snapshot test!')).toBeOnTheScreen();
});
