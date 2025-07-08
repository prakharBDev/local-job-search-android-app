import React from 'react';
import styled from 'styled-components/native';
import { ViewStyle } from 'react-native';

interface ThemedCardProps {
  variant?: 'default' | 'elevated' | 'outline';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  children: React.ReactNode;
}

interface StyledCardProps {
  variant: 'default' | 'elevated' | 'outline';
  padding: 'none' | 'sm' | 'md' | 'lg';
}

const StyledCard = styled.View<StyledCardProps>`
  background-color: ${({ theme }) => theme.colors.surface.card};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;

  /* Padding variants */
  ${({ padding, theme }) => {
    switch (padding) {
      case 'none':
        return 'padding: 0;';
      case 'sm':
        return `padding: ${theme.spacing.sm}px;`;
      case 'lg':
        return `padding: ${theme.spacing.lg}px;`;
      default: // md
        return `padding: ${theme.spacing.md}px;`;
    }
  }}

  /* Variant styles */
  ${({ variant, theme }) => {
    switch (variant) {
      case 'elevated':
        return `
          shadow-color: ${theme.shadows.lg.shadowColor};
          shadow-offset: ${theme.shadows.lg.shadowOffset.width}px ${theme.shadows.lg.shadowOffset.height}px;
          shadow-opacity: ${theme.shadows.lg.shadowOpacity};
          shadow-radius: ${theme.shadows.lg.shadowRadius}px;
          elevation: ${theme.shadows.lg.elevation};
        `;
      case 'outline':
        return `
          border: 1px solid ${theme.colors.border.primary};
          shadow-color: ${theme.shadows.sm.shadowColor};
          shadow-offset: ${theme.shadows.sm.shadowOffset.width}px ${theme.shadows.sm.shadowOffset.height}px;
          shadow-opacity: ${theme.shadows.sm.shadowOpacity};
          shadow-radius: ${theme.shadows.sm.shadowRadius}px;
          elevation: ${theme.shadows.sm.elevation};
        `;
      default: // default
        return `
          shadow-color: ${theme.shadows.md.shadowColor};
          shadow-offset: ${theme.shadows.md.shadowOffset.width}px ${theme.shadows.md.shadowOffset.height}px;
          shadow-opacity: ${theme.shadows.md.shadowOpacity};
          shadow-radius: ${theme.shadows.md.shadowRadius}px;
          elevation: ${theme.shadows.md.elevation};
        `;
    }
  }}
`;

export const ThemedCard: React.FC<ThemedCardProps> = ({
  variant = 'default',
  padding = 'md',
  style,
  children,
  ...props
}) => {
  return (
    <StyledCard variant={variant} padding={padding} style={style} {...props}>
      {children}
    </StyledCard>
  );
};

export default ThemedCard;
