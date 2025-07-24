import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../contexts/ThemeContext';
import {
  getStyles,
  getJobTypeGradients,
  getJobTypeIconColors,
} from './PopularJobCard.styles';

const PopularJobCard = React.memo(({ job }) => {
  const navigation = useNavigation();
  const { theme } = useTheme();

  // Memoize styles for performance
  const styles = useMemo(() => getStyles(theme), [theme]);
  const gradientColors = useMemo(() => getJobTypeGradients(theme), [theme]);
  const iconColors = useMemo(() => getJobTypeIconColors(theme), [theme]);

  // Get gradient colors based on job type
  const getSoftGradientColors = jobType => {
    return gradientColors[jobType] || gradientColors['Full Time'];
  };

  // Get icon color based on job type
  const getIconColor = jobType => {
    return iconColors[jobType] || iconColors['Full Time'];
  };

  const handlePress = () => {
    navigation.navigate('JobDetails', { jobData: job });
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <LinearGradient
        colors={getSoftGradientColors(job.type)}
        style={styles.cardContainer}
      >
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <Feather name={job.logo} size={24} color={getIconColor(job.type)} />
          </View>
          <View style={styles.companyInfoContainer}>
            <Text style={styles.companyName}>{job.company}</Text>
            <View style={styles.featuredContainer}>
              <Feather
                name="star"
                size={12}
                color={theme.colors.accent?.yellow || '#FFC107'}
              />
              <Text style={styles.featuredText}>Featured</Text>
            </View>
          </View>
        </View>

        <Text style={styles.jobTitle}>{job.title}</Text>

        <View style={styles.salaryContainer}>
          <Text style={styles.salaryText}>₹{job.salary}</Text>
        </View>

        <View style={styles.tagsContainer}>
          <View style={styles.jobTypeTag}>
            <Text style={styles.jobTypeText}>{job.type}</Text>
          </View>

          <View style={styles.timeTag}>
            <Text style={styles.timeText}>{job.time}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
});

export default PopularJobCard;
