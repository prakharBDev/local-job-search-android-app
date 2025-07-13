import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

const PopularJobCard = ({ job }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('JobDetails', { jobData: job });
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <LinearGradient
        colors={job.color}
        style={{
          width: 240,
          marginRight: 16,
          borderRadius: 20,
          padding: 20,
          shadowColor: '#3B82F6',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 16,
          elevation: 6,
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
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}
          >
            <Feather name={job.logo} size={22} color={'#FFFFFF'} />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: '#FFFFFF',
                marginBottom: 2,
                opacity: 0.9,
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
              <Feather name="star" size={12} color="#FFF" />
              <Text
                style={{
                  fontSize: 12,
                  color: '#FFFFFF',
                  fontWeight: '500',
                  opacity: 0.8,
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
            color: '#FFFFFF',
            marginBottom: 8,
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
            gap: 4,
          }}
        >
          <Feather name="dollar-sign" size={14} color="#FFFFFF" />
          <Text
            style={{
              fontSize: 16,
              color: '#FFFFFF',
              fontWeight: '600',
            }}
          >
            {job.salary}
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
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                color: '#FFFFFF',
                fontWeight: '600',
                fontSize: 12,
              }}
            >
              {job.type}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                color: '#FFFFFF',
                fontWeight: '500',
                fontSize: 12,
                opacity: 0.8,
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
