import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from '../../contexts/ThemeContext';

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
  const styles = StyleSheet.create({
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: theme?.spacing?.[4] || 16,
      paddingVertical: theme?.spacing?.[4] || 16,
      gap: theme?.spacing?.[2] || 8,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme?.colors?.surface?.card || '#FFFFFF',
      borderRadius: 16,
      padding: theme?.spacing?.[3] || 12,
      alignItems: 'center',
      marginHorizontal: theme?.spacing?.[1] || 4,
      ...(theme?.shadows?.sm || {}),
      borderWidth: 1,
      borderColor: theme?.colors?.border?.primary || '#E2E8F0',
    },
    statNumber: {
      fontSize: 18,
      fontWeight: '700',
      color: theme?.colors?.text?.primary || '#1E293B',
      marginTop: theme?.spacing?.[1] || 4,
      marginBottom: theme?.spacing?.[1] || 4,
    },
    statLabel: {
      fontSize: 12,
      color: theme?.colors?.text?.secondary || '#64748B',
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.statsRow}>
      {stats.map(stat => (
        <View key={stat.label} style={styles.statCard}>
          <Feather
            name={stat.icon}
            size={24}
            color={theme?.colors?.primary?.main || '#3C4FE0'}
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
