import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Badge from '../../../components/elements/Badge';
import Card from '../../../components/blocks/Card';
import { useTheme } from '../../../contexts/ThemeContext';

const RecentJobCard = ({ item, onPress }) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      onPress={() => onPress && onPress(item)}
      activeOpacity={0.85}
    >
      <Card
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 16,
          borderRadius: 18,
          padding: 16,
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowRadius: 6,
          elevation: 2,
        }}
      >
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: '#F1F5F9',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 16,
          }}
        >
          <Feather name={item.logo} size={22} color={'#3B82F6'} />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: 'bold',
              color: '#0F172A',
              marginBottom: 2,
            }}
          >
            {item.title}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 2,
            }}
          >
            <Badge
              variant="default"
              size="sm"
              style={{ backgroundColor: '#E0F2FE', marginRight: 8 }}
            >
              <Text
                style={{
                  color: '#3B82F6',
                  fontWeight: '600',
                  fontSize: 12,
                }}
              >
                {item.type}
              </Text>
            </Badge>
            <Text style={{ fontSize: 13, color: '#64748B' }}>
              {item.company}
            </Text>
          </View>
          <Text style={{ fontSize: 13, color: '#94A3B8' }}>
            {item.location} • {item.salary}
          </Text>
        </View>
        <View
          style={{
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            height: 48,
          }}
        >
          <TouchableOpacity>
            <Feather
              name={item.bookmarked ? 'bookmark' : 'bookmark'}
              size={20}
              color={item.bookmarked ? '#3B82F6' : '#94A3B8'}
            />
          </TouchableOpacity>
          <Text style={{ fontSize: 12, color: '#94A3B8', marginTop: 8 }}>
            {item.time}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default RecentJobCard;
