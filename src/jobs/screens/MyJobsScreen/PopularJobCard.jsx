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

const PopularJobCard = React.memo(({ job, index = 0 }) => {
  const navigation = useNavigation();
  const { theme } = useTheme();

  // Memoize styles for performance
  const styles = useMemo(() => getStyles(theme), [theme]);
  const iconColors = useMemo(() => getJobTypeIconColors(theme), [theme]);

  // Get alternating category colors based on index
  const categoryColors = useMemo(() => 
    getJobCategoryColors(theme, job.type, job.company, index), 
    [theme, job.type, job.company, index]
  );

  // Helper function to format salary as monthly amount
  const formatSalary = (salary) => {
    if (!salary) return 'Salary not specified';
    
    // Handle salary ranges like "₹12,00,000 – ₹18,00,000/year"
    if (salary.includes('–') || salary.includes('-')) {
      // Extract the first number (lower range) and convert to monthly
      const firstNumber = salary.match(/₹([\d,]+)/);
      if (firstNumber) {
        const numericSalary = firstNumber[1].replace(/,/g, '');
        const yearlySalary = parseInt(numericSalary);
        const monthlySalary = Math.round(yearlySalary / 12);
        return `₹${monthlySalary.toLocaleString()}/month`;
      }
    }
    
    // Handle single salary values
    const numericSalary = salary.replace(/[^\d]/g, '');
    if (!numericSalary) return salary;
    
    // Assume yearly salary, convert to monthly (divide by 12)
    const yearlySalary = parseInt(numericSalary);
    const monthlySalary = Math.round(yearlySalary / 12);
    
    // Format with commas
    return `₹${monthlySalary.toLocaleString()}/month`;
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
      <View style={[
        styles.cardContainer,
        { backgroundColor: categoryColors.background }
      ]}>
        <View style={styles.headerContainer}>
          <View style={[
            styles.logoContainer,
            { backgroundColor: categoryColors.iconBg }
          ]}>
            <Feather 
              name={job.logo} 
              size={24} 
              color="#FFFFFF" // White icon on dark background
            />
          </View>
          <View style={styles.companyInfoContainer}>
            <Text style={[
              styles.companyName,
              { color: categoryColors.text }
            ]}>
              {job.company}
            </Text>
            <View style={styles.featuredContainer}>
              <Feather
                name="star"
                size={12}
                color="rgba(255, 255, 255, 0.8)"
              />
              <Text style={[
                styles.featuredText,
                { color: 'rgba(255, 255, 255, 0.8)' }
              ]}>
                Featured
              </Text>
            </View>
          </View>
        </View>

        <Text style={[
          styles.jobTitle,
          { color: categoryColors.text }
        ]}>
          {job.title}
        </Text>

        {/* Salary display - single line, bold and visible */}
        <View style={styles.salaryContainer}>
          <Text style={styles.salaryText}>
            {formatSalary(job.salary)}
          </Text>
        </View>

        {/* Meta information pills */}
        <View style={styles.metaContainer}>
          <View style={[
            styles.jobTypePill,
            { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
          ]}>
            <Text style={[
              styles.jobTypePillText,
              { color: '#FFFFFF' }
            ]}>
              {job.type}
            </Text>
          </View>
          
          {job.daysLeft && (
            <View style={[
              styles.daysLeftPill,
              { backgroundColor: '#F56342' } // Urgent orange color
            ]}>
              <Text style={[
                styles.daysLeftPillText,
                { color: '#FFFFFF' }
              ]}>
                {job.daysLeft} days left
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default PopularJobCard;
