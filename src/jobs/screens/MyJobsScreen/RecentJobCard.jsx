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

  // Get company logo colors based on company name
  const getCompanyLogoColor = companyName => {
    const colors = [
      '#FF5722', // Orange for TechVibe Studios (TS)
      '#2196F3', // Blue for GrowthHack Co (GC)
      '#4CAF50', // Green for Designify (D)
      '#9C27B0', // Purple for FinEdge (F)
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
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F0F0F0',
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
            width: 44,
            height: 44,
            borderRadius: 8,
            backgroundColor: getCompanyLogoColor(item.company),
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: '#FFFFFF',
            }}
          >
            {getCompanyInitials(item.company)}
          </Text>
        </View>

        {/* Job Details */}
        <View style={{ flex: 1, paddingRight: 8 }}>
          {/* Job Title */}
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#1A1A1A',
              marginBottom: 4,
              lineHeight: 22,
            }}
          >
            {item.title}
          </Text>

          {/* Company and Salary */}
          <Text
            style={{
              fontSize: 14,
              color: '#666666',
              fontWeight: '400',
              marginBottom: 8,
              lineHeight: 20,
            }}
          >
            {item.company} | {item.salary}
          </Text>

          {/* Experience and Job Type */}
          <Text
            style={{
              fontSize: 13,
              color: '#999999',
              fontWeight: '400',
              lineHeight: 18,
            }}
          >
            Experience: 2-4 years {item.type}
          </Text>
        </View>

        {/* Time Posted */}
        <View
          style={{
            alignItems: 'flex-end',
            paddingTop: 2,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              color: '#3B82F6',
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
