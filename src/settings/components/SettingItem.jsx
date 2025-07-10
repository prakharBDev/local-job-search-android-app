import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const SettingItem = ({ title }) => (
  <TouchableOpacity style={styles.settingItem}>
    <Text style={styles.settingText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  settingItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  settingText: {
    fontSize: 16,
    color: '#222',
  },
});

export default SettingItem;
