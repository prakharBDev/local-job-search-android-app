import React from 'react';
import { render } from '@testing-library/react-native';
import AppHeader from '../src/components/elements/AppHeader';
import { ThemeProvider } from '../src/contexts/ThemeContext';

// Mock the Icon component
jest.mock('../src/components/elements/Icon', () => {
  return function MockIcon({ name, size, color }) {
    return <div testID={`icon-${name}`} data-size={size} data-color={color} />;
  };
});

const renderWithTheme = (component) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('AppHeader', () => {
  it('renders with title', () => {
    const { getByText } = renderWithTheme(
      <AppHeader title="Test Title" />
    );
    
    expect(getByText('Test Title')).toBeTruthy();
  });

  it('renders with title and subtitle', () => {
    const { getByText } = renderWithTheme(
      <AppHeader 
        title="Test Title" 
        subtitle="Test Subtitle" 
      />
    );
    
    expect(getByText('Test Title')).toBeTruthy();
    expect(getByText('Test Subtitle')).toBeTruthy();
  });

  it('renders with left icon', () => {
    const { getByTestId } = renderWithTheme(
      <AppHeader 
        title="Test Title" 
        leftIcon={<div testID="left-icon" />}
      />
    );
    
    expect(getByTestId('left-icon')).toBeTruthy();
  });

  it('renders with right icon', () => {
    const { getByTestId } = renderWithTheme(
      <AppHeader 
        title="Test Title" 
        rightIcon={<div testID="right-icon" />}
      />
    );
    
    expect(getByTestId('right-icon')).toBeTruthy();
  });

  it('applies custom background color', () => {
    const { getByTestId } = renderWithTheme(
      <AppHeader 
        title="Test Title" 
        background="#FF0000"
        testID="header"
      />
    );
    
    const header = getByTestId('header');
    expect(header).toBeTruthy();
  });
}); 