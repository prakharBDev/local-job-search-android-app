import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../contexts/ThemeContext';
import {
  getStyles,
  getJobCategoryColors,
  getJobTypeIconColors,
} from './PopularJobCard.styles';

const PopularJobCard = React.memo(({ job, index = 0, isApplied = false }) => {
  const navigation = useNavigation();
  const { theme } = useTheme();

  // Memoize styles for performance
  const styles = useMemo(() => getStyles(theme), [theme]);
  const iconColors = useMemo(() => getJobTypeIconColors(theme), [theme]);

  // Get alternating category colors based on index
  const categoryColors = useMemo(
    () =>
      getJobCategoryColors(
        theme,
        job.job_type || job.type,
        job.company_profiles?.company_name || job.company,
        index,
      ),
    [theme, job.job_type, job.type, job.company_profiles, job.company, index],
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

  // Get icon color based on job type
  const getIconColor = jobType => {
    return iconColors[jobType] || iconColors['Full Time'];
  };

  // Get company logo based on company name or job category
  const getCompanyLogo = (companyName, jobCategory) => {
    const company = companyName?.toLowerCase();
    const category = jobCategory?.toLowerCase();

    // Company-specific logos
    if (company?.includes('tech') || company?.includes('studio')) {
      return 'briefcase';
    }
    if (company?.includes('growth') || company?.includes('hack')) {
      return 'trending-up';
    }
    if (company?.includes('design') || company?.includes('creative')) {
      return 'pen-tool';
    }
    if (company?.includes('finance') || company?.includes('bank')) {
      return 'dollar-sign';
    }
    if (company?.includes('marketing') || company?.includes('advertising')) {
      return 'target';
    }
    if (company?.includes('health') || company?.includes('medical')) {
      return 'heart';
    }
    if (company?.includes('education') || company?.includes('school')) {
      return 'book';
    }
    if (company?.includes('food') || company?.includes('restaurant')) {
      return 'coffee';
    }

    // Category-based logos
    if (category?.includes('technology') || category?.includes('software')) {
      return 'briefcase';
    }
    if (category?.includes('marketing') || category?.includes('advertising')) {
      return 'trending-up';
    }
    if (category?.includes('design') || category?.includes('creative')) {
      return 'pen-tool';
    }
    if (category?.includes('finance') || category?.includes('accounting')) {
      return 'dollar-sign';
    }
    if (category?.includes('health') || category?.includes('medical')) {
      return 'heart';
    }
    if (category?.includes('education') || category?.includes('teaching')) {
      return 'book';
    }
    if (category?.includes('food') || category?.includes('hospitality')) {
      return 'coffee';
    }

    // Default icon
    return 'briefcase';
  };

  const handlePress = () => {
    navigation.navigate('JobsSwipeableJobDetails', {
      jobData: job,
      jobList: [job], // Single job for swipeable view
      currentIndex: 0,
    });
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <View
        style={[
          styles.cardContainer,
          { backgroundColor: categoryColors.background },
        ]}
      >
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <Feather
              name={getCompanyLogo(
                job.company_profiles?.company_name,
                job.job_categories?.name,
              )}
              size={24}
              color="#FFFFFF" // White icon on dark background
            />
          </View>
          <View style={styles.companyInfoContainer}>
            <Text style={[styles.companyName, { color: categoryColors.text }]}>
              {job.company_profiles?.company_name || job.company || 'Company'}
            </Text>
            <View style={styles.featuredContainer}>
              <Feather name="star" size={12} color="rgba(255, 255, 255, 0.8)" />
              <Text
                style={[
                  styles.featuredText,
                  { color: 'rgba(255, 255, 255, 0.8)' },
                ]}
              >
                Featured
              </Text>
            </View>
          </View>
        </View>

        <Text style={[styles.jobTitle, { color: categoryColors.text }]}>
          {job.title}
        </Text>

        {/* Salary display - single line, bold and visible */}
        <View style={styles.salaryContainer}>
          <Text style={styles.salaryText}>{formatSalary(job.salary)}</Text>
        </View>

        {/* Meta information pills */}
        <View style={styles.metaContainer}>
          <View
            style={[
              styles.jobTypePill,
              { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
            ]}
          >
            <Text style={[styles.jobTypePillText, { color: '#FFFFFF' }]}>
              {job.job_type || job.type || 'Full Time'}
            </Text>
          </View>

          {job.daysLeft && (
            <View
              style={[
                styles.daysLeftPill,
                { backgroundColor: '#F56342' }, // Urgent orange color
              ]}
            >
              <Text style={[styles.daysLeftPillText, { color: '#FFFFFF' }]}>
                {job.daysLeft} days left
              </Text>
            </View>
          )}

          {/* Application Status Badge */}
          {isApplied && (
            <View
              style={[
                styles.daysLeftPill,
                { backgroundColor: '#10B981' }, // Green for applied
              ]}
            >
              <Feather name="check-circle" size={12} color="#FFFFFF" />
              <Text
                style={[
                  styles.daysLeftPillText,
                  { color: '#FFFFFF', marginLeft: 4 },
                ]}
              >
                Applied
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default PopularJobCard;
