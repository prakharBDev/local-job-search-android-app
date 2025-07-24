import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

const PopularJobCard = ({ job }) => {
  const navigation = useNavigation();

  // Get soft pastel gradient colors based on job type
  const getSoftGradientColors = (jobType) => {
    const gradients = {
      'Full Time': ['#E3F2FD', '#BBDEFB'], // Soft Blue
      'Part Time': ['#E8F5E9', '#C8E6C9'], // Soft Green
      'Contract': ['#F3E5F5', '#E1BEE7'], // Soft Purple
      'Freelance': ['#FFF3E0', '#FFCC02'], // Soft Orange
    };
    return gradients[jobType] || ['#E3F2FD', '#BBDEFB']; // Default to soft blue
  };

  // Get icon color based on job type
  const getIconColor = (jobType) => {
    const colors = {
      'Full Time': '#1976D2', // Dark Blue
      'Part Time': '#388E3C', // Dark Green
      'Contract': '#7B1FA2', // Dark Purple
      'Freelance': '#F57C00', // Dark Orange
    };
    return colors[jobType] || '#1976D2'; // Default to dark blue
  };

  const handlePress = () => {
    navigation.navigate('JobDetails', { jobData: job });
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <LinearGradient
        colors={getSoftGradientColors(job.type)}
        style={{
          width: 240,
          marginRight: 16,
          borderRadius: 20,
          padding: 20,
          shadowColor: '#E0E0E0',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 4,
          borderWidth: 1,
          borderColor: '#F0F0F0',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            <Feather name={job.logo} size={24} color={getIconColor(job.type)} />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 15,
                fontWeight: '600',
                color: '#212121',
                marginBottom: 4,
              }}
            >
              {job.company}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Feather name="star" size={12} color="#FFC107" />
              <Text
                style={{
                  fontSize: 12,
                  color: '#9E9E9E',
                  fontWeight: '500',
                }}
              >
                Featured
              </Text>
            </View>
          </View>
        </View>

        <Text
          style={{
            fontSize: 18,
            fontWeight: '700',
            color: '#212121',
            marginBottom: 10,
            lineHeight: 24,
          }}
        >
          {job.title}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
            gap: 6,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: '#388E3C',
              fontWeight: '600',
            }}
          >
            ₹{job.salary}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            flexWrap: 'wrap',
          }}
        >
          <View
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.95)',
            }}
          >
            <Text
              style={{
                color: '#3949AB',
                fontWeight: '600',
                fontSize: 12,
              }}
            >
              {job.type}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.8)',
            }}
          >
            <Text
              style={{
                color: '#9E9E9E',
                fontWeight: '500',
                fontSize: 12,
              }}
            >
              {job.time}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default PopularJobCard;
