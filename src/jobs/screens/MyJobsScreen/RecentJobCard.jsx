import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const RecentJobCard = ({ item }) => {
  const navigation = useNavigation();

  // Function to get company logo initials
  const getCompanyInitials = companyName => {
    return companyName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get company logo colors based on company name - using soft pastel colors
  const getCompanyLogoColor = companyName => {
    const colors = [
      '#E3F2FD', // Soft Blue for TechVibe Studios (TS)
      '#E8F5E9', // Soft Green for GrowthHack Co (GC)
      '#F3E5F5', // Soft Purple for Designify (D)
      '#FFF3E0', // Soft Orange for FinEdge (F)
    ];
    const index = companyName.length % colors.length;
    return colors[index];
  };

  // Get company logo text color based on company name
  const getCompanyLogoTextColor = companyName => {
    const colors = [
      '#1976D2', // Dark Blue for TechVibe Studios (TS)
      '#388E3C', // Dark Green for GrowthHack Co (GC)
      '#7B1FA2', // Dark Purple for Designify (D)
      '#F57C00', // Dark Orange for FinEdge (F)
    ];
    const index = companyName.length % colors.length;
    return colors[index];
  };

  const handlePress = () => {
    navigation.navigate('JobDetails', { jobData: item });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#E0E0E0',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F5F5F5',
      }}
    >
      {/* Main Content Row */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
        }}
      >
        {/* Company Logo */}
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: getCompanyLogoColor(item.company),
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 16,
            borderWidth: 1,
            borderColor: '#F0F0F0',
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: '700',
              color: getCompanyLogoTextColor(item.company),
            }}
          >
            {getCompanyInitials(item.company)}
          </Text>
        </View>

        {/* Job Details */}
        <View style={{ flex: 1, paddingRight: 12 }}>
          {/* Job Title */}
          <Text
            style={{
              fontSize: 17,
              fontWeight: '600',
              color: '#212121',
              marginBottom: 6,
              lineHeight: 24,
            }}
          >
            {item.title}
          </Text>

          {/* Company and Salary */}
          <Text
            style={{
              fontSize: 15,
              color: '#9E9E9E',
              fontWeight: '400',
              marginBottom: 10,
              lineHeight: 22,
            }}
          >
            {item.company} | {item.salary}
          </Text>

          {/* Experience and Job Type */}
          <Text
            style={{
              fontSize: 14,
              color: '#B0BEC5',
              fontWeight: '400',
              lineHeight: 20,
            }}
          >
            Experience: 2-4 years {item.type}
          </Text>
        </View>

        {/* Time Posted */}
        <View
          style={{
            alignItems: 'flex-end',
            paddingTop: 4,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              color: '#3949AB',
              fontWeight: '500',
            }}
          >
            {item.time}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RecentJobCard;
