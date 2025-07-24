import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../contexts/ThemeContext';
import {
  getStyles,
  getCompanyLogoColors,
  getRecentJobColors,
} from './RecentJobCard.styles';

const RecentJobCard = React.memo(({ item, index = 0 }) => {
  const navigation = useNavigation();
  const { theme } = useTheme();

  // Memoize styles for performance
  const styles = useMemo(() => getStyles(theme), [theme]);
  const logoColors = useMemo(() => getCompanyLogoColors(theme), [theme]);

  // Get alternating colors based on index
  const cardColors = useMemo(
    () => getRecentJobColors(theme, index),
    [theme, index],
  );

  // Helper function to format salary - show database value directly
  const formatSalary = salary => {
    if (!salary) {
      return 'Salary not specified';
    }

    // If salary already has ₹ symbol, return as is
    if (salary.includes('₹')) {
      return salary;
    }

    // Add ₹ symbol to the database value
    return `₹${salary}`;
  };

  // Function to get company logo initials
  const getCompanyInitials = companyName => {
    return companyName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get company logo colors based on company name using theme
  const getCompanyLogoColor = companyName => {
    const index = companyName.length % logoColors.backgrounds.length;
    return logoColors.backgrounds[index];
  };

  // Get company logo text color based on company name using theme
  const getCompanyLogoTextColor = companyName => {
    const index = companyName.length % logoColors.textColors.length;
    return logoColors.textColors[index];
  };

  const handlePress = () => {
    navigation.navigate('JobDetails', { jobData: item });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[styles.cardContainer, { backgroundColor: cardColors.background }]}
    >
      <View style={styles.contentRow}>
        {/* Company Logo */}
        <View style={styles.logoContainer}>
          <Text style={[styles.logoText, { color: cardColors.text }]}>
            {getCompanyInitials(item.company)}
          </Text>
        </View>

        {/* Job Details */}
        <View style={styles.jobDetailsContainer}>
          <Text style={[styles.jobTitle, { color: cardColors.text }]}>
            {item.title}
          </Text>

          <Text
            style={[
              styles.companyName,
              { color: cardColors.text, opacity: 0.8 },
            ]}
          >
            {item.company}
          </Text>

          {/* Salary display - separate line with better visibility */}
          <Text
            style={[
              styles.salaryText,
              {
                color: cardColors.text,
                fontWeight: '600', // Make bold as requested
                marginTop: 4, // Better spacing
                marginBottom: 8,
              },
            ]}
          >
            {formatSalary(item.salary)}
          </Text>

          {/* Meta information pills */}
          <View style={styles.metaContainer}>
            <View
              style={[
                styles.experiencePill,
                { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
              ]}
            >
              <Text style={[styles.pillText, { color: '#FFFFFF' }]}>
                Experience: 2-4 years
              </Text>
            </View>

            <View
              style={[
                styles.jobTypePill,
                { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
              ]}
            >
              <Text style={[styles.pillText, { color: '#FFFFFF' }]}>
                {item.type}
              </Text>
            </View>
          </View>
        </View>

        {/* Time Posted */}
        <View style={{ alignItems: 'flex-end', paddingTop: theme.spacing[1] }}>
          <Text
            style={[styles.timeText, { color: cardColors.text, opacity: 0.6 }]}
          >
            {item.time}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default RecentJobCard;
