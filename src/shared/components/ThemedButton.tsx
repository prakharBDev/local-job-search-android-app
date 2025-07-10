import React from 'react';
import { ActivityIndicator, Text, ViewStyle } from 'react-native';
import styled from 'styled-components/native';

interface ThemedButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onPress?: () => void;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

interface StyledButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  fullWidth: boolean;
  disabled: boolean;
}

const StyledButton = styled.TouchableOpacity<StyledButtonProps>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;

  /* Size variants */
  ${({ size, theme }) => {
    switch (size) {
      case 'sm':
        return `
          padding: ${theme.spacing.xs}px ${theme.spacing.md}px;
          min-height: 36px;
        `;
      case 'lg':
        return `
          padding: ${theme.spacing.md}px ${theme.spacing.xl}px;
          min-height: 56px;
        `;
      default: // md
        return `
          padding: ${theme.spacing.sm}px ${theme.spacing.lg}px;
          min-height: ${theme.components.button.minHeight}px;
        `;
    }
  }}

  /* Variant styles */
  ${({ variant, theme }) => {
    switch (variant) {
      case 'primary':
        return `
          background-color: ${theme.colors.primary.main};
          shadow-color: ${theme.shadows.md.shadowColor};
          shadow-offset: ${theme.shadows.md.shadowOffset.width}px ${theme.shadows.md.shadowOffset.height}px;
          shadow-opacity: ${theme.shadows.md.shadowOpacity};
          shadow-radius: ${theme.shadows.md.shadowRadius}px;
          elevation: ${theme.shadows.md.elevation};
        `;
      case 'secondary':
        return `
          background-color: ${theme.colors.secondary.main};
          shadow-color: ${theme.shadows.sm.shadowColor};
          shadow-offset: ${theme.shadows.sm.shadowOffset.width}px ${theme.shadows.sm.shadowOffset.height}px;
          shadow-opacity: ${theme.shadows.sm.shadowOpacity};
          shadow-radius: ${theme.shadows.sm.shadowRadius}px;
          elevation: ${theme.shadows.sm.elevation};
        `;
      case 'outline':
        return `
          background-color: transparent;
          border: 1px solid ${theme.colors.border.primary};
        `;
      case 'ghost':
        return `
          background-color: transparent;
        `;
      default:
        return `
          background-color: ${theme.colors.primary.main};
        `;
    }
  }}
  
  /* Full width */
  ${({ fullWidth }) => fullWidth && 'width: 100%;'}
  
  /* Disabled state */
  ${({ disabled }) => disabled && 'opacity: 0.6;'}
`;

const ButtonText = styled(Text)<{
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  size: 'sm' | 'md' | 'lg';
}>`
  font-weight: 600;
  text-align: center;

  /* Size variants */
  ${({ size, theme }) => {
    switch (size) {
      case 'sm':
        return `
          font-size: ${theme.typography.bodySmall.fontSize}px;
          line-height: ${theme.typography.bodySmall.lineHeight}px;
        `;
      case 'lg':
        return `
          font-size: ${theme.typography.h6.fontSize}px;
          line-height: ${theme.typography.h6.lineHeight}px;
        `;
      default: // md
        return `
          font-size: ${theme.typography.body.fontSize}px;
          line-height: ${theme.typography.body.lineHeight}px;
        `;
    }
  }}

  /* Variant colors */
  ${({ variant, theme }) => {
    switch (variant) {
      case 'primary':
        return `color: ${theme.colors.text.inverse};`;
      case 'secondary':
        return `color: ${theme.colors.text.primary};`;
      case 'outline':
        return `color: ${theme.colors.text.primary};`;
      case 'ghost':
        return `color: ${theme.colors.text.secondary};`;
      default:
        return `color: ${theme.colors.text.inverse};`;
    }
  }}
`;

const IconContainer = styled.View`
  margin-right: ${({ theme }) => theme.spacing.xs}px;
`;

export const ThemedButton: React.FC<ThemedButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  children,
  onPress,
  icon,
  style,
  ...props
}) => {
  const getLoadingColor = () => {
    switch (variant) {
      case 'primary':
        return '#FFFFFF';
      case 'secondary':
        return '#1E293B';
      case 'outline':
        return '#1E293B';
      case 'ghost':
        return '#475569';
      default:
        return '#FFFFFF';
    }
  };

  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      onPress={onPress}
      style={style}
      {...props}
    >
      {loading && (
        <IconContainer>
          <ActivityIndicator size="small" color={getLoadingColor()} />
        </IconContainer>
      )}
      {icon && !loading && <IconContainer>{icon}</IconContainer>}
      <ButtonText variant={variant} size={size}>
        {children}
      </ButtonText>
    </StyledButton>
  );
};

export default ThemedButton;
