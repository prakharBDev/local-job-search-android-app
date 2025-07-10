import React from 'react';
import styled from 'styled-components/native';
import { TextStyle } from 'react-native';

interface ThemedTextProps {
  variant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'body'
    | 'bodySmall'
    | 'caption';
  color?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'inverse'
    | 'disabled'
    | 'accent';
  align?: 'left' | 'center' | 'right';
  style?: TextStyle;
  children: React.ReactNode;
}

interface StyledTextProps {
  variant:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'body'
    | 'bodySmall'
    | 'caption';
  color:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'inverse'
    | 'disabled'
    | 'accent';
  align: 'left' | 'center' | 'right';
}

const StyledText = styled.Text<StyledTextProps>`
  /* Typography variants */
  ${({ variant, theme }) => {
    const typography = theme.typography[variant];
    return `
      font-size: ${typography.fontSize}px;
      font-weight: ${typography.fontWeight};
      line-height: ${typography.lineHeight}px;
    `;
  }}

  /* Color variants */
  ${({ color, theme }) => {
    switch (color) {
      case 'primary':
        return `color: ${theme.colors.text.primary};`;
      case 'secondary':
        return `color: ${theme.colors.text.secondary};`;
      case 'tertiary':
        return `color: ${theme.colors.text.tertiary};`;
      case 'inverse':
        return `color: ${theme.colors.text.inverse};`;
      case 'disabled':
        return `color: ${theme.colors.text.disabled};`;
      case 'accent':
        return `color: ${theme.colors.primary};`;
      default:
        return `color: ${theme.colors.text.primary};`;
    }
  }}
  
  /* Text alignment */
  text-align: ${({ align }) => align};
`;

export const ThemedText: React.FC<ThemedTextProps> = ({
  variant = 'body',
  color = 'primary',
  align = 'left',
  style,
  children,
  ...props
}) => {
  return (
    <StyledText
      variant={variant}
      color={color}
      align={align}
      style={style}
      {...props}
    >
      {children}
    </StyledText>
  );
};

// Convenience components
export const Heading1: React.FC<Omit<ThemedTextProps, 'variant'>> = props => (
  <ThemedText variant="h1" {...props} />
);

export const Heading2: React.FC<Omit<ThemedTextProps, 'variant'>> = props => (
  <ThemedText variant="h2" {...props} />
);

export const Heading3: React.FC<Omit<ThemedTextProps, 'variant'>> = props => (
  <ThemedText variant="h3" {...props} />
);

export const BodyText: React.FC<Omit<ThemedTextProps, 'variant'>> = props => (
  <ThemedText variant="body" {...props} />
);

export const Caption: React.FC<Omit<ThemedTextProps, 'variant'>> = props => (
  <ThemedText variant="caption" {...props} />
);

export default ThemedText;
