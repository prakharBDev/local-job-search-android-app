import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Card, Badge } from '../components/ui';
import { theme } from '../theme';
import Feather from 'react-native-vector-icons/Feather';

const DashboardScreen = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('This Week');
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const stats = [
    {
      label: 'Applications Sent',
      value: '24',
      change: '+12%',
      trend: 'up',
      color: theme.colors.primary.emerald,
      icon: 'send',
    },
    {
      label: 'Profile Views',
      value: '156',
      change: '+8%',
      trend: 'up',
      color: '#2196F3',
      icon: 'eye',
    },
    {
      label: 'Interviews Scheduled',
      value: '3',
      change: '+2',
      trend: 'up',
      color: theme.colors.accent.orange,
      icon: 'calendar',
    },
    {
      label: 'Job Matches',
      value: '89',
      change: '+15%',
      trend: 'up',
      color: '#9C27B0',
      icon: 'target',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'application',
      title: 'Applied to Senior Developer',
      company: 'TechCorp Inc.',
      time: '2 hours ago',
      status: 'pending',
      avatar: '#4CAF50',
    },
    {
      id: 2,
      type: 'interview',
      title: 'Interview Scheduled',
      company: 'StartupXYZ',
      time: '1 day ago',
      status: 'scheduled',
      avatar: '#2196F3',
    },
    {
      id: 3,
      type: 'match',
      title: 'New Job Match',
      company: 'DesignStudio',
      time: '2 days ago',
      status: 'new',
      avatar: '#FF9800',
    },
    {
      id: 4,
      type: 'profile',
      title: 'Profile Viewed',
      company: 'BigTech Co.',
      time: '3 days ago',
      status: 'viewed',
      avatar: '#9C27B0',
    },
  ];

  const quickActions = [
    {
      title: 'Browse Jobs',
      subtitle: 'Discover new opportunities',
      icon: 'search',
      color: [theme.colors.primary.emerald, theme.colors.primary.forest],
      action: 'browse',
    },
    {
      title: 'Update Profile',
      subtitle: 'Keep your info current',
      icon: 'user',
      color: ['#2196F3', '#1976D2'],
      action: 'profile',
    },
    {
      title: 'View Applications',
      subtitle: 'Track your progress',
      icon: 'clipboard',
      color: [theme.colors.accent.orange, '#F44336'],
      action: 'applications',
    },
    {
      title: 'Skills Assessment',
      subtitle: 'Test your abilities',
      icon: 'award',
      color: ['#9C27B0', '#673AB7'],
      action: 'skills',
    },
  ];

  const periods = ['Today', 'This Week', 'This Month'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return theme.colors.status.warning;
      case 'scheduled':
        return theme.colors.status.info;
      case 'new':
        return theme.colors.status.success;
      case 'viewed':
        return theme.colors.text.secondary;
      default:
        return theme.colors.text.secondary;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'scheduled':
        return 'Scheduled';
      case 'new':
        return 'New';
      case 'viewed':
        return 'Viewed';
      default:
        return status;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={['#E8F5E8', '#F3E5F5', '#E3F2FD']} // Green to purple to blue gradient
        style={{ flex: 1 }}
      >
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: theme.spacing[8] }}
        >
          {/* Header */}
          <Animated.View 
            style={{
              opacity: fadeAnim,
              paddingHorizontal: theme.spacing[4],
              paddingVertical: theme.spacing[6],
            }}
          >
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              maxWidth: 400,
              alignSelf: 'center',
              width: '100%',
            }}>
              <View>
                <Text style={{
                  fontSize: theme.typography.h4.fontSize,
                  fontWeight: theme.typography.h4.fontWeight,
                  color: theme.colors.text.primary,
                  marginBottom: theme.spacing[1],
                }}>
                  Welcome back, Alex!
                </Text>
                <Text style={{
                  fontSize: theme.typography.body.fontSize,
                  color: theme.colors.text.secondary,
                }}>
                  Here's your job search progress
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  ...theme.shadows.md,
                }}
              >
                <Feather name="bell" size={24} color={theme.colors.text.primary} />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Period Selector */}
          <View style={{
            paddingHorizontal: theme.spacing[4],
            marginBottom: theme.spacing[6],
          }}>
            <View style={{
              maxWidth: 400,
              alignSelf: 'center',
              width: '100%',
            }}>
              <View style={{
                flexDirection: 'row',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: theme.borderRadius.xl,
                padding: theme.spacing[1],
                ...theme.shadows.md,
              }}>
                {periods.map((period) => (
                  <TouchableOpacity
                    key={period}
                    onPress={() => setSelectedPeriod(period)}
                    style={{
                      flex: 1,
                      paddingVertical: theme.spacing[2],
                      paddingHorizontal: theme.spacing[3],
                      borderRadius: theme.borderRadius.lg,
                      backgroundColor: selectedPeriod === period ? theme.colors.primary.emerald : 'transparent',
                    }}
                  >
                    <Text style={{
                      textAlign: 'center',
                      fontSize: theme.typography.buttonSmall.fontSize,
                      fontWeight: theme.typography.button.fontWeight,
                      color: selectedPeriod === period ? theme.colors.text.white : theme.colors.text.secondary,
                    }}>
                      {period}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={{
            paddingHorizontal: theme.spacing[4],
            marginBottom: theme.spacing[8],
          }}>
            <View style={{
              maxWidth: 400,
              alignSelf: 'center',
              width: '100%',
            }}>
              <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: theme.spacing[3],
                justifyContent: 'space-between',
              }}>
                {stats.map((stat, index) => (
                  <TouchableOpacity
                    key={index}
                    style={{
                      width: '47%',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: theme.borderRadius['2xl'],
                      padding: theme.spacing[4],
                      ...theme.shadows.lg,
                      borderWidth: 1,
                      borderColor: theme.colors.border.primary,
                    }}
                  >
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: theme.spacing[3],
                    }}>
                      <View style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        backgroundColor: `${stat.color}20`,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Feather name={stat.icon} size={16} color={stat.color} />
                      </View>
                      <Badge
                        variant="success"
                        size="sm"
                        style={{
                          backgroundColor: `${theme.colors.status.success}20`,
                        }}
                      >
                        <Text style={{
                          fontSize: 10,
                          color: theme.colors.status.success,
                          fontWeight: '600',
                        }}>
                          {stat.change}
                        </Text>
                      </Badge>
                    </View>
                    <Text style={{
                      fontSize: 24,
                      fontWeight: theme.typography.h3.fontWeight,
                      color: theme.colors.text.primary,
                      marginBottom: theme.spacing[1],
                    }}>
                      {stat.value}
                    </Text>
                    <Text style={{
                      fontSize: theme.typography.caption.fontSize,
                      color: theme.colors.text.secondary,
                    }}>
                      {stat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={{
            paddingHorizontal: theme.spacing[4],
            marginBottom: theme.spacing[8],
          }}>
            <View style={{
              maxWidth: 400,
              alignSelf: 'center',
              width: '100%',
            }}>
              <Text style={{
                fontSize: theme.typography.h5.fontSize,
                fontWeight: theme.typography.h5.fontWeight,
                color: theme.colors.text.primary,
                marginBottom: theme.spacing[4],
              }}>
                Quick Actions
              </Text>
              <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: theme.spacing[3],
                justifyContent: 'space-between',
              }}>
                {quickActions.map((action, index) => (
                  <TouchableOpacity
                    key={index}
                    style={{
                      width: '47%',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: theme.borderRadius['2xl'],
                      padding: theme.spacing[4],
                      alignItems: 'center',
                      gap: theme.spacing[3],
                      ...theme.shadows.lg,
                      borderWidth: 1,
                      borderColor: theme.colors.border.primary,
                    }}
                  >
                    <LinearGradient
                      colors={action.color}
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: theme.borderRadius.xl,
                        alignItems: 'center',
                        justifyContent: 'center',
                        ...theme.shadows.md,
                      }}
                    >
                      <Feather name={action.icon} size={24} color={theme.colors.text.white} />
                    </LinearGradient>
                    <View style={{ alignItems: 'center' }}>
                      <Text style={{
                        fontSize: theme.typography.bodySmall.fontSize,
                        fontWeight: theme.typography.label.fontWeight,
                        color: theme.colors.text.primary,
                        textAlign: 'center',
                        marginBottom: theme.spacing[1],
                      }}>
                        {action.title}
                      </Text>
                      <Text style={{
                        fontSize: theme.typography.labelSmall.fontSize,
                        color: theme.colors.text.secondary,
                        textAlign: 'center',
                      }}>
                        {action.subtitle}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Recent Activity */}
          <View style={{
            paddingHorizontal: theme.spacing[4],
            marginBottom: theme.spacing[8],
          }}>
            <View style={{
              maxWidth: 400,
              alignSelf: 'center',
              width: '100%',
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: theme.spacing[4],
              }}>
                <Text style={{
                  fontSize: theme.typography.h5.fontSize,
                  fontWeight: theme.typography.h5.fontWeight,
                  color: theme.colors.text.primary,
                }}>
                  Recent Activity
                </Text>
                <TouchableOpacity>
                  <Text style={{
                    fontSize: theme.typography.caption.fontSize,
                    color: theme.colors.primary.emerald,
                    fontWeight: '500',
                  }}>
                    View All
                  </Text>
                </TouchableOpacity>
              </View>
              
              <Card
                variant="glass"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  ...theme.shadows.lg,
                }}
              >
                <View style={{ gap: theme.spacing[1] }}>
                  {recentActivity.map((activity, index) => (
                    <TouchableOpacity
                      key={activity.id}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: theme.spacing[3],
                        paddingHorizontal: theme.spacing[2],
                        borderRadius: theme.borderRadius.lg,
                        ...(index < recentActivity.length - 1 && {
                          borderBottomWidth: 1,
                          borderBottomColor: theme.colors.border.primary,
                        }),
                      }}
                    >
                      <View style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: activity.avatar,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: theme.spacing[3],
                      }}>
                        <Feather name={activity.type} size={20} color={theme.colors.text.white} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{
                          fontSize: theme.typography.bodySmall.fontSize,
                          fontWeight: '500',
                          color: theme.colors.text.primary,
                          marginBottom: theme.spacing[1],
                        }}>
                          {activity.title}
                        </Text>
                        <Text style={{
                          fontSize: theme.typography.caption.fontSize,
                          color: theme.colors.text.secondary,
                        }}>
                          {activity.company} • {activity.time}
                        </Text>
                      </View>
                      <Badge
                        variant="outline"
                        size="sm"
                        style={{
                          borderColor: getStatusColor(activity.status),
                          backgroundColor: `${getStatusColor(activity.status)}10`,
                        }}
                      >
                        <Text style={{
                          fontSize: 10,
                          color: getStatusColor(activity.status),
                          fontWeight: '500',
                        }}>
                          {getStatusLabel(activity.status)}
                        </Text>
                      </Badge>
                    </TouchableOpacity>
                  ))}
                </View>
              </Card>
            </View>
          </View>

          {/* Daily Goal Progress */}
          <View style={{
            paddingHorizontal: theme.spacing[4],
            marginBottom: theme.spacing[6],
          }}>
            <View style={{
              maxWidth: 400,
              alignSelf: 'center',
              width: '100%',
            }}>
              <Text style={{
                fontSize: theme.typography.h5.fontSize,
                fontWeight: theme.typography.h5.fontWeight,
                color: theme.colors.text.primary,
                marginBottom: theme.spacing[4],
              }}>
                Daily Goal Progress
              </Text>
              
              <Card
                variant="glass"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  ...theme.shadows.lg,
                }}
              >
                <View style={{ gap: theme.spacing[4] }}>
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <Text style={{
                      fontSize: theme.typography.body.fontSize,
                      fontWeight: '500',
                      color: theme.colors.text.primary,
                    }}>
                      Job Applications
                    </Text>
                    <Text style={{
                      fontSize: theme.typography.bodySmall.fontSize,
                      color: theme.colors.text.secondary,
                    }}>
                      3/5 completed
                    </Text>
                  </View>
                  <View style={{
                    height: 8,
                    backgroundColor: theme.colors.border.secondary,
                    borderRadius: 4,
                    overflow: 'hidden',
                  }}>
                    <View style={{
                      width: '60%',
                      height: '100%',
                      backgroundColor: theme.colors.primary.emerald,
                      borderRadius: 4,
                    }} />
                  </View>
                  
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <Text style={{
                      fontSize: theme.typography.body.fontSize,
                      fontWeight: '500',
                      color: theme.colors.text.primary,
                    }}>
                      Profile Updates
                    </Text>
                    <Text style={{
                      fontSize: theme.typography.bodySmall.fontSize,
                      color: theme.colors.text.secondary,
                    }}>
                      1/2 completed
                    </Text>
                  </View>
                  <View style={{
                    height: 8,
                    backgroundColor: theme.colors.border.secondary,
                    borderRadius: 4,
                    overflow: 'hidden',
                  }}>
                    <View style={{
                      width: '50%',
                      height: '100%',
                      backgroundColor: theme.colors.accent.orange,
                      borderRadius: 4,
                    }} />
                  </View>
                </View>
              </Card>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default DashboardScreen;