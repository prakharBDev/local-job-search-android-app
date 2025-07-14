export const centeredContainer = {
  justifyContent: 'center',
  alignItems: 'center',
};

export const primaryButton = theme => ({
  backgroundColor: theme?.colors?.primary?.cyan || '#3C4FE0',
  borderRadius: 8,
  alignItems: 'center',
});

export const cardShadow = theme => ({
  shadowColor: theme?.colors?.shadows?.soft || '#000',
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 4,
});
