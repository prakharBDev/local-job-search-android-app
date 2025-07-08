import React from 'react';
import { ViewProps } from 'react-native';
import styled from 'styled-components/native';

export type BadgeVariant =
  | 'primary'
  | 'green'
  | 'purple'
  | 'orange'
  | 'red'
  | 'secondary';
export type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps extends ViewProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
}

const StyledBadge = styled.View<{
  variant: BadgeVariant;
  size: BadgeSize;
}>`
  border-radius: ${({ theme }) => theme.borderRadius.full}px;
  align-self: flex-start;

  ${({ size, theme }) => {
    switch (size) {
      case 'sm':
        return `
          padding-horizontal: ${theme.spacing.xs}px;
          padding-vertical: 2px;
          min-height: 20px;
        `;
      case 'lg':
        return `
          padding-horizontal: ${theme.spacing.md}px;
          padding-vertical: ${theme.spacing.xs}px;
          min-height: 32px;
        `;
      default:
        return `
          padding-horizontal: ${theme.spacing.sm}px;
          padding-vertical: ${theme.spacing.xs}px;
          min-height: 24px;
        `;
    }
  }}

  ${({ variant, theme }) => {
    switch (variant) {
      case 'primary':
        return `background-color: ${theme.colors.primary};`;
      case 'green':
        return `background-color: ${theme.colors.accent.green};`;
      case 'purple':
        return `background-color: ${theme.colors.accent.purple};`;
      case 'orange':
        return `background-color: ${theme.colors.accent.orange};`;
      case 'red':
        return `background-color: ${theme.colors.accent.red};`;
      case 'secondary':
        return `background-color: ${theme.colors.surface};`;
      default:
        return `background-color: ${theme.colors.primary};`;
    }
  }}
`;

const BadgeText = styled.Text<{
  variant: BadgeVariant;
  size: BadgeSize;
}>`
  font-weight: 600;
  text-align: center;

  ${({ size, theme }) => {
    switch (size) {
      case 'sm':
        return `
          font-size: ${theme.typography.caption.fontSize}px;
          line-height: ${theme.typography.caption.lineHeight}px;
        `;
      case 'lg':
        return `
          font-size: ${theme.typography.body.fontSize}px;
          line-height: ${theme.typography.body.lineHeight}px;
        `;
      default:
        return `
          font-size: ${theme.typography.bodySmall.fontSize}px;
          line-height: ${theme.typography.bodySmall.lineHeight}px;
        `;
    }
  }}

  ${({ variant, theme }) => {
    switch (variant) {
      case 'secondary':
        return `color: ${theme.colors.text.primary};`;
      default:
        return `color: ${theme.colors.text.inverse};`;
    }
  }}
`;

export const ThemedBadge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  ...props
}) => {
  return (
    <StyledBadge variant={variant} size={size} {...props}>
      <BadgeText variant={variant} size={size}>
        {children}
      </BadgeText>
    </StyledBadge>
  );
};

export default ThemedBadge;
