import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const ActionCard = ({ title, subtitle, iconName, iconColor, onPress }) => (
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

const styles = StyleSheet.create({
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    backgroundColor: '#fff',
    gap: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#22223b',
  },
  actionSubtitle: {
    fontSize: 13,
    color: '#7b8794',
    marginTop: 2,
  },
});

export default ActionCard;
