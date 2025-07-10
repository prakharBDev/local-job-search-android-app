import React from 'react';
import { View, Text } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Badge from '../../components/elements/Badge';
import Card from '../../components/blocks/Card';
import { useTheme } from '../../contexts/ThemeContext';

const PopularJobCard = ({ job }) => {
  const { theme } = useTheme();
  return (
    <Card
      style={{
        width: 220,
        marginRight: 16,
        borderRadius: 20,
        padding: 18,
        backgroundColor: job.color[0],
        shadowColor: job.color[0],
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 10,
        }}
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 10,
          }}
        >
          <Feather name={job.logo} size={20} color={job.color[1]} />
        </View>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            color: '#fff',
            flex: 1,
          }}
        >
          {job.company}
        </Text>
      </View>
      <Text
        style={{
          fontSize: 16,
          fontWeight: 'bold',
          color: '#fff',
          marginBottom: 8,
        }}
      >
        {job.title}
      </Text>
      <Text
        style={{ fontSize: 13, color: '#E0E7EF', marginBottom: 10 }}
      >
        {job.salary}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Badge
          variant="default"
          size="sm"
          style={{ backgroundColor: '#fff', marginRight: 8 }}
        >
          <Text
            style={{
              color: job.color[1],
              fontWeight: '600',
              fontSize: 12,
            }}
          >
            {job.type}
          </Text>
        </Badge>
        <Badge
          variant="outline"
          size="sm"
          style={{
            borderColor: '#fff',
            backgroundColor: '#ffffff22',
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '500', fontSize: 12 }}>
            {job.time}
          </Text>
        </Badge>
      </View>
    </Card>
  );
};

export default PopularJobCard; 