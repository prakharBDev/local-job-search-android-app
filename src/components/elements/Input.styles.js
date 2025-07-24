import { StyleSheet } from 'react-native';
import { bluewhiteTheme } from '../../theme/bluewhite-theme';

const getStyles = theme => StyleSheet.create({
  container: {
    marginBottom: theme?.spacing?.[4] || 16,
  },
  label: {
    fontSize: theme?.typography?.sizes?.sm || 14,
    fontWeight: theme?.typography?.weights?.semibold || '600',
    marginBottom: theme?.spacing?.[2] || 8,
  },
  inputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: theme?.borderRadius?.lg || 12,
    paddingHorizontal: theme?.spacing?.[4] || 16,
    paddingVertical: theme?.spacing?.[3] || 12,
    minHeight: 48,
  },
  inputContainerSingle: {
    alignItems: 'center',
  },
  inputContainerMultiline: {
    alignItems: 'flex-start',
  },
  input: {
    fontSize: theme?.typography?.sizes?.base || 16,
    fontWeight: theme?.typography?.weights?.normal || '400',
    flex: 1,
  },
  inputMultiline: {
    textAlignVertical: 'top',
  },
  leftIconContainer: {
    marginRight: theme?.spacing?.[2] || 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftIconContainerSingle: {
    // Icon will be centered by parent alignItems: 'center'
  },
  leftIconContainerMultiline: {
    alignSelf: 'flex-start',
    marginTop: 9,
    paddingTop: 2,
  },
  iconContainer: {
    marginLeft: theme?.spacing?.[2] || 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: theme?.typography?.sizes?.base || 16,
  },
  errorText: {
    fontSize: theme?.typography?.sizes?.xs || 12,
    marginTop: theme?.spacing?.[1] || 4,
    marginLeft: theme?.spacing?.[1] || 4,
  },
  prefixText: {
    fontSize: theme?.typography?.sizes?.base || 16,
    fontWeight: theme?.typography?.weights?.medium || '500',
    marginRight: theme?.spacing?.[2] || 8,
    color: theme?.colors?.text?.secondary || '#475569',
  },
});

export default getStyles; 