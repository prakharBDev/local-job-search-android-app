import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import Card from './Card';
import { useTheme } from '../../contexts/ThemeContext';

const JobCard = ({
  job,
  isApplied = false,
  showApplyButton = true,
  showToggleButton = false,
  onApplyPress,
  onViewPress,
  onToggleStatus,
  style = {},
}) => {
  const navigation = useNavigation();
  const { theme } = useTheme();

  const company = job.company_profiles;
  const category = job.job_categories;

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

  const handleCardPress = () => {
    if (onViewPress) {
      onViewPress(job);
    } else {
      // Default navigation behavior
      navigation.navigate('JobsSwipeableJobDetails', {
        jobData: job,
        jobList: [job], // Single job for application details
        currentIndex: 0,
      });
    }
  };

  return (
    <Card style={[{ marginBottom: 16 }, style]}>
      <TouchableOpacity onPress={handleCardPress} activeOpacity={0.7}>
        {/* Company Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: theme.colors.primary.light,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 12,
            }}
          >
            <Feather
              name="briefcase"
              size={20}
              color={theme.colors.primary.main}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: theme.colors.text.primary,
                marginBottom: 2,
              }}
            >
              {company?.company_name || 'Company'}
            </Text>
            {company?.is_verified && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Feather name="check-circle" size={12} color="#10B981" />
                <Text
                  style={{
                    fontSize: 12,
                    color: '#10B981',
                    marginLeft: 4,
                  }}
                >
                  Verified
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Job Details */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: theme.colors.text.primary,
              flex: 1,
            }}
          >
            {job.title}
          </Text>
          
          {/* Status Badge - Only show for job owners */}
          {showToggleButton && (
            <View
              style={{
                backgroundColor: job.is_active ? '#10B981' : '#6B7280',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
                marginLeft: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: '600',
                  color: 'white',
                  textTransform: 'uppercase',
                }}
              >
                {job.is_active ? 'Active' : 'Inactive'}
              </Text>
            </View>
          )}
        </View>

        {/* Job Meta */}
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginBottom: 12,
            gap: 16,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Feather name="map-pin" size={14} color="#6B7280" />
            <Text
              style={{
                fontSize: 14,
                color: '#6B7280',
                marginLeft: 4,
              }}
            >
              {job.city}
            </Text>
          </View>
          {category && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Feather name="tag" size={14} color="#6B7280" />
              <Text
                style={{
                  fontSize: 14,
                  color: '#6B7280',
                  marginLeft: 4,
                }}
              >
                {category.name}
              </Text>
            </View>
          )}
          {job.salary && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: '#6B7280',
                }}
              >
                {formatSalary(job.salary)}
              </Text>
            </View>
          )}
        </View>

        {/* Job Description Preview */}
        <Text
          style={{
            fontSize: 14,
            color: theme.colors.text.secondary,
            lineHeight: 20,
            marginBottom: 16,
          }}
          numberOfLines={3}
        >
          {job.description || 'No description available'}
        </Text>

        {/* Action Buttons */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {showApplyButton ? (
            isApplied ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#10B981',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 6,
                }}
              >
                <Feather name="check-circle" size={16} color="white" />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: 'white',
                    marginLeft: 6,
                  }}
                >
                  Applied
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                style={{
                  backgroundColor: theme.colors.primary.main,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 6,
                }}
                onPress={e => {
                  e.stopPropagation();
                  if (onApplyPress) {
                    onApplyPress(job);
                  }
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: 'white',
                  }}
                >
                  Apply Now
                </Text>
              </TouchableOpacity>
            )
          ) : (
            <View style={{ flex: 1 }} />
          )}

          {/* Toggle Active/Inactive Button - Only show for job owners */}
          {showToggleButton && (
            <TouchableOpacity
              style={{
                backgroundColor: job.is_active ? '#EF4444' : '#10B981',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 6,
                marginRight: 8,
                flexDirection: 'row',
                alignItems: 'center',
              }}
              onPress={e => {
                e.stopPropagation();
                if (onToggleStatus) {
                  onToggleStatus(job);
                }
              }}
            >
              <Feather 
                name={job.is_active ? 'pause-circle' : 'play-circle'} 
                size={14} 
                color="white" 
                style={{ marginRight: 4 }}
              />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: 'white',
                }}
              >
                {job.is_active ? 'Disable' : 'Enable'}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={{
              padding: 8,
            }}
            onPress={e => {
              e.stopPropagation();
              // TODO: Implement save job functionality
            }}
          >
            <Feather name="bookmark" size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Card>
  );
};

export default JobCard;
