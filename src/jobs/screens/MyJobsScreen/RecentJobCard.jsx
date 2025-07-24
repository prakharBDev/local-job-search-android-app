import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../contexts/ThemeContext';
import { getStyles, getCompanyLogoColors } from './RecentJobCard.styles';

const RecentJobCard = React.memo(({ item }) => {
  const navigation = useNavigation();
  const { theme } = useTheme();

  // Memoize styles for performance
  const styles = useMemo(() => getStyles(theme), [theme]);
  const logoColors = useMemo(() => getCompanyLogoColors(theme), [theme]);

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
      style={styles.cardContainer}
    >
      <View style={styles.contentRow}>
        {/* Company Logo */}
        <View
          style={[
            styles.logoContainer,
            { backgroundColor: getCompanyLogoColor(item.company) },
          ]}
        >
          <Text
            style={[
              styles.logoText,
              { color: getCompanyLogoTextColor(item.company) },
            ]}
          >
            {getCompanyInitials(item.company)}
          </Text>
        </View>

        {/* Job Details */}
        <View style={styles.jobDetailsContainer}>
          <Text style={styles.jobTitle}>{item.title}</Text>

          <Text style={styles.companyName}>
            {item.company} | {item.salary}
          </Text>

          <Text style={styles.locationText}>
            Experience: 2-4 years • {item.type}
          </Text>
        </View>

        {/* Time Posted */}
        <View style={{ alignItems: 'flex-end', paddingTop: theme.spacing[1] }}>
          <Text
            style={[
              styles.timeText,
              { color: theme.colors.primary?.main || '#3949AB' },
            ]}
          >
            {item.time}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default RecentJobCard;
