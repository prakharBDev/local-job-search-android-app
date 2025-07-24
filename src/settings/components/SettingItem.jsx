import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import getStyles from './SettingItem.styles';

const SettingItem = React.memo(({ title }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <TouchableOpacity style={styles.settingItem}>
      <Text style={styles.settingText}>{title}</Text>
    </TouchableOpacity>
  );
});

SettingItem.displayName = 'SettingItem';

export default SettingItem;
