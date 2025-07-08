import React, { useState } from 'react';
import { TextInputProps } from 'react-native';
import styled from 'styled-components/native';

export type InputVariant = 'default' | 'outline' | 'filled';
export type InputSize = 'sm' | 'md' | 'lg';

interface ThemedInputProps extends TextInputProps {
  variant?: InputVariant;
  size?: InputSize;
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
}

const Container = styled.View<{ fullWidth?: boolean }>`
  ${({ fullWidth }) => fullWidth && 'width: 100%;'}
`;

const Label = styled.Text`
  font-size: ${({ theme }) => theme.typography.bodySmall.fontSize}px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledInput = styled.TextInput<{
  variant: InputVariant;
  size: InputSize;
  hasError?: boolean;
  isFocused?: boolean;
}>`
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  color: ${({ theme }) => theme.colors.text.primary};

  ${({ size, theme }) => {
    switch (size) {
      case 'sm':
        return `
          height: 36px;
          padding-horizontal: ${theme.spacing.sm}px;
          padding-vertical: ${theme.spacing.xs}px;
        `;
      case 'lg':
        return `
          height: 52px;
          padding-horizontal: ${theme.spacing.lg}px;
          padding-vertical: ${theme.spacing.md}px;
        `;
      default:
        return `
          height: ${theme.components.input.height}px;
          padding-horizontal: ${theme.spacing.md}px;
          padding-vertical: ${theme.spacing.sm}px;
        `;
    }
  }}

  ${({ variant, theme, hasError, isFocused }) => {
    const borderColor = hasError
      ? theme.colors.status.error
      : isFocused
      ? theme.colors.border.focus
      : theme.colors.border.primary;

    switch (variant) {
      case 'outline':
        return `
          background-color: transparent;
          border-width: 1px;
          border-color: ${borderColor};
        `;
      case 'filled':
        return `
          background-color: ${theme.colors.surface.card};
          border-width: 1px;
          border-color: ${borderColor};
        `;
      default:
        return `
          background-color: ${theme.colors.background.primary};
          border-width: 1px;
          border-color: ${borderColor};
          shadow-color: ${theme.shadows.sm.shadowColor};
          shadow-offset: ${theme.shadows.sm.shadowOffset.width}px ${theme.shadows.sm.shadowOffset.height}px;
          shadow-opacity: ${theme.shadows.sm.shadowOpacity};
          shadow-radius: ${theme.shadows.sm.shadowRadius}px;
          elevation: ${theme.shadows.sm.elevation};
        `;
    }
  }}
`;

const HelperText = styled.Text<{ isError?: boolean }>`
  font-size: ${({ theme }) => theme.typography.caption.fontSize}px;
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  color: ${({ theme, isError }) =>
    isError ? theme.colors.status.error : theme.colors.text.tertiary};
`;

export const ThemedInput: React.FC<ThemedInputProps> = ({
  variant = 'default',
  size = 'md',
  label,
  helperText,
  error,
  fullWidth = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Container fullWidth={fullWidth}>
      {label && <Label>{label}</Label>}
      <StyledInput
        variant={variant}
        size={size}
        hasError={!!error}
        isFocused={isFocused}
        onFocus={e => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={e => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        placeholderTextColor="#94A3B8"
        {...props}
      />
      {(error || helperText) && (
        <HelperText isError={!!error}>{error || helperText}</HelperText>
      )}
    </Container>
  );
};

export default ThemedInput;
