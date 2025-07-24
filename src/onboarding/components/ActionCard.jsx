import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from '../../contexts/ThemeContext';
import getStyles from './ActionCard.styles';

const ActionCard = ({ title, subtitle, iconName, iconColor, onPress }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <TouchableOpacity
      style={[
        styles.actionCard,
        { backgroundColor: iconName === 'search' ? '#eef0fd' : '#eaf7f0' },
      ]}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={[styles.iconCircle, { backgroundColor: iconColor }]}>
        <Feather name={iconName} size={28} color="#fff" />
      </View>
      <View>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionSubtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ActionCard;
