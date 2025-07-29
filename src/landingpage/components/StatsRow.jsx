import React from 'react';
import { View, Text } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from '../../contexts/ThemeContext';
import getStyles from './StatsRow.styles';

const stats = [
  {
    number: '10K+',
    label: 'Jobs Posted',
    icon: 'briefcase',
    type: 'Feather',
  },
  { number: '5K+', label: 'Happy Users', icon: 'heart', type: 'Feather' },
  {
    number: '500+',
    label: 'Companies',
    icon: 'star',
    type: 'Feather',
  },
];

const StatsRow = React.memo(() => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.statsRow}>
      {stats.map(stat => (
        <View key={stat.label} style={styles.statCard}>
          <Feather
            name={stat.icon}
            size={24}
            color={theme?.colors?.primary?.main || '#6174f9'}
          />
          <Text style={styles.statNumber}>{stat.number}</Text>
          <Text style={styles.statLabel}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
});

StatsRow.displayName = 'StatsRow';

export default StatsRow;
