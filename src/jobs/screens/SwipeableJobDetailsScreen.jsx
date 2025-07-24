import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  PanResponder,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
  applicationService,
  seekerService,
  jobService, 
} from '../../services';
import { Icon } from '../../components/elements';
import { getStyles } from './SwipeableJobDetailsScreen.styles';

const SwipeableJobDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    jobData,
    jobQueue = [],
    jobList = [],
    currentIndex = 0,
  } = route.params || {};
  const { user } = useAuth();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [seekerProfile, setSeekerProfile] = useState(null);
  const [jobDetails, setJobDetails] = useState(jobData);
  const [activeTab, setActiveTab] = useState('Description');
  const [currentJobIndex, setCurrentJobIndex] = useState(currentIndex);
  const [jobSkills, setJobSkills] = useState([]);

  // Use real job list if available, otherwise create test queue
  const testJobQueue =
    jobQueue.length > 0
      ? jobQueue
      : jobList.length > 0
      ? jobList
      : [
          {
            ...jobData,
            id: jobData?.id + '_test1',
            title: 'Job 1 - ' + (jobData?.title || 'Test Job'),
          },
          {
            ...jobData,
            id: jobData?.id + '_test2',
            title: 'Job 2 - ' + (jobData?.title || 'Test Job'),
          },
          {
            ...jobData,
            id: jobData?.id + '_test3',
            title: 'Job 3 - ' + (jobData?.title || 'Test Job'),
          },
        ];

  // Swipe gesture configuration

  // Load seeker profile and check application status
  useEffect(() => {
    const loadSeekerData = async () => {
      if (user?.id) {
        try {
          const { data: profile, error } = await seekerService.getSeekerProfile(
            user.id,
          );
          if (profile && !error) {
            setSeekerProfile(profile);

            // Check if user has already applied
            if (jobDetails?.id) {
              const { data: applicationData } =
                await applicationService.hasApplied(jobDetails.id, profile.id);
              setHasApplied(!!applicationData);
            }
          }
        } catch (err) {
          console.error('Error loading seeker data:', err);
          setError('Failed to load profile data');
        }
      }
    };

    loadSeekerData();
  }, [user, jobDetails]);

  // Load full job details if only basic data was passed
  useEffect(() => {
    const loadJobDetails = async () => {
      if (jobDetails?.id && !jobDetails.company_profiles) {
        try {
          setLoading(true);
          const { data: fullJobData, error } = await jobService.getJobById(
            jobDetails.id,
          );
          if (fullJobData && !error) {
            setJobDetails(fullJobData);
          }
        } catch (err) {
          console.error('Error loading job details:', err);
          setError('Failed to load job details');
        } finally {
          setLoading(false);
        }
      }
    };

    loadJobDetails();
  }, [jobDetails?.id]);

  // Load job skills
  useEffect(() => {
    const loadJobSkills = async () => {
      if (jobDetails?.id) {
        try {
          // Check if getJobSkills method exists
          if (typeof jobService.getJobSkills === 'function') {
            const { data: skillsData, error } = await jobService.getJobSkills(
              jobDetails.id,
            );
            if (skillsData && !error) {
              setJobSkills(skillsData);
            } else if (error) {
              console.error('Error loading job skills:', error);
              setJobSkills([]); // Set empty array on error
            }
          } else {
            console.warn(
              'getJobSkills method not available, using empty skills array',
            );
            setJobSkills([]); // Fallback to empty array
          }
        } catch (err) {
          console.error('Error loading job skills:', err);
          setJobSkills([]); // Set empty array on error
        }
      }
    };

    loadJobSkills();
  }, [jobDetails?.id]);

  // Navigate to next/previous job
  const navigateToJob = direction => {
    let newIndex = currentJobIndex;

    if (direction === 'next' && currentJobIndex < testJobQueue.length - 1) {
      newIndex = currentJobIndex + 1;
    } else if (direction === 'previous' && currentJobIndex > 0) {
      newIndex = currentJobIndex - 1;
    } else {
      return;
    }

    const nextJob = testJobQueue[newIndex];

    if (nextJob) {
      setCurrentJobIndex(newIndex);
      setJobDetails(nextJob);
      setActiveTab('Description');
      setError(null); // Reset error state
      setHasApplied(false); // Reset application state for new job
    }
  };

  // Create PanResponder for swipe gestures
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => {
      return testJobQueue.length > 1;
    },
    onMoveShouldSetPanResponder: (_, gestureState) => {
      const { dy } = gestureState;
      return Math.abs(dy) > 10 && testJobQueue.length > 1;
    },
    onPanResponderGrant: () => {
      // Gesture started
    },
    onPanResponderMove: () => {
      // Handle gesture movement
    },
    onPanResponderRelease: (_, gestureState) => {
      const { dy, vy } = gestureState;

      // Lower threshold for easier swiping
      const shouldSwipe = Math.abs(dy) > 50 || Math.abs(vy) > 0.5;

      if (shouldSwipe && testJobQueue.length > 1) {
        if (dy < 0 && currentJobIndex < testJobQueue.length - 1) {
          navigateToJob('next');
        } else if (dy > 0 && currentJobIndex > 0) {
          navigateToJob('previous');
        }
      }
    },
  });

  const handleApply = async () => {
    if (!user) {
      Alert.alert('Authentication Required', 'Please log in to apply for jobs');
      return;
    }

    if (!seekerProfile?.id) {
      Alert.alert(
        'Profile Required',
        'Please complete your seeker profile before applying for jobs',
      );
      return;
    }

    try {
      setLoading(true);
      const { error } = await applicationService.applyForJob({
        job_id: jobDetails.id,
        seeker_id: seekerProfile.id,
        message: '', // No message input for now
      });

      if (error) {
        throw error;
      }

      setHasApplied(true);
      Alert.alert('Success', 'Application submitted successfully!');
    } catch (err) {
      Alert.alert('Error', 'Failed to submit application. Please try again.');
      console.error('Error applying for job:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format salary - show database value directly
  const formatSalary = salary => {
    if (!salary) {return 'Salary not specified';}

    // If salary already has ₹ symbol, return as is
    if (salary.includes('₹')) {
      return salary;
    }

    // Add ₹ symbol to the database value
    return `₹${salary}`;
  };

  if (error) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: theme?.colors?.background?.primary || '#F8F9FA',
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
        >
          <Icon
            name="alert-triangle"
            size={48}
            color={theme?.colors?.status?.error || '#EF4444'}
          />
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: theme?.colors?.text?.primary || '#1E293B',
              marginTop: 16,
              marginBottom: 8,
              textAlign: 'center',
            }}
          >
            Oops! Something went wrong
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: theme?.colors?.text?.secondary || '#64748B',
              textAlign: 'center',
              marginBottom: 24,
            }}
          >
            {error}
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: theme?.colors?.primary?.main || '#6475f8',
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 8,
            }}
            onPress={() => navigation.goBack()}
          >
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 16,
                fontWeight: '600',
              }}
            >
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: theme?.colors?.background?.primary || '#F8F9FA',
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator
            size="large"
            color={theme?.colors?.primary?.main || '#6475f8'}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (!jobDetails) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: theme?.colors?.background?.primary || '#F8F9FA',
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: theme?.colors?.text?.primary || '#1E293B',
              textAlign: 'center',
              marginBottom: 24,
            }}
          >
            No job details available
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: theme?.colors?.primary?.main || '#6475f8',
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 8,
            }}
            onPress={() => navigation.goBack()}
          >
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 16,
                fontWeight: '600',
              }}
            >
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Use real job data with comprehensive fallbacks from JobDetailsScreen
  const safeJob = {
    ...jobDetails,
    company:
      jobDetails.company_profiles?.company_name ||
      jobDetails.company ||
      'Unknown Company',
    title: jobDetails.title || 'Job Title',
    location: jobDetails.city || jobDetails.location || 'Location',
    type: jobDetails.type || 'Full Time',
    salary: jobDetails.salary || 'Salary not specified',
    // applicationsCount: jobDetails.applicationsCount || '0', // Commented for future use
    // daysLeft: jobDetails.daysLeft || 'N/A', // Removed as requested
    description: jobDetails.description || 'No description available.',
    requirements: jobDetails.requirements || [
      'No specific requirements listed',
    ],
    // peopleApplied: Commented for future use when we implement application count display
    companyInfo: jobDetails.companyInfo || {
      name:
        jobDetails.company_profiles?.company_name ||
        jobDetails.company ||
        'Unknown Company',
      founded: 'N/A',
      employees: 'N/A',
      headquarters: 'N/A',
      industry: 'N/A',
      description: 'Company information not available.',
      benefits: ['Information not available'],
    },
    reviews: jobDetails.reviews || [
      {
        id: 1,
        author: 'Anonymous',
        rating: 4.0,
        title: 'No reviews available',
        content: 'Be the first to review this company!',
        date: 'N/A',
      },
    ],
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Description':
        return (
          <View style={{ paddingHorizontal: 20 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: theme?.colors?.text?.primary || '#1E293B',
                marginBottom: 16,
                fontFamily: 'System',
                letterSpacing: -0.3,
              }}
            >
              Job Description
            </Text>

            <Text
              style={{
                fontSize: 14,
                fontWeight: '500',
                color: theme?.colors?.text?.secondary || '#64748B',
                lineHeight: 22,
                marginBottom: 24,
                fontFamily: 'System',
                letterSpacing: -0.1,
              }}
            >
              {safeJob.description}
            </Text>

            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: theme?.colors?.text?.primary || '#1E293B',
                marginBottom: 16,
                fontFamily: 'System',
                letterSpacing: -0.3,
              }}
            >
              Minimum Qualification
            </Text>

            {safeJob.requirements.map((requirement, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  marginBottom: 12,
                }}
              >
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: theme?.colors?.primary?.main || '#6475f8',
                    marginTop: 8,
                    marginRight: 12,
                  }}
                />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: theme?.colors?.text?.secondary || '#64748B',
                    lineHeight: 22,
                    flex: 1,
                    fontFamily: 'System',
                    letterSpacing: -0.1,
                  }}
                >
                  {requirement}
                </Text>
              </View>
            ))}
          </View>
        );
      case 'Company':
        return (
          <View style={{ paddingHorizontal: 20 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: theme?.colors?.text?.primary || '#1E293B',
                marginBottom: 16,
                fontFamily: 'System',
                letterSpacing: -0.3,
              }}
            >
              About {safeJob.companyInfo.name}
            </Text>

            <Text
              style={{
                fontSize: 14,
                fontWeight: '500',
                color: theme?.colors?.text?.secondary || '#64748B',
                lineHeight: 22,
                marginBottom: 20,
                fontFamily: 'System',
                letterSpacing: -0.1,
              }}
            >
              {safeJob.companyInfo.description}
            </Text>

            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: theme?.colors?.text?.primary || '#1E293B',
                  marginBottom: 12,
                  fontFamily: 'System',
                  letterSpacing: -0.2,
                }}
              >
                Company Details
              </Text>

              <View style={{ gap: 8 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: theme?.colors?.text?.secondary || '#64748B',
                      fontWeight: '500',
                    }}
                  >
                    Founded
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: theme?.colors?.text?.primary || '#1E293B',
                      fontWeight: '500',
                    }}
                  >
                    {safeJob.companyInfo.founded}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: theme?.colors?.text?.secondary || '#64748B',
                      fontWeight: '500',
                    }}
                  >
                    Employees
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: theme?.colors?.text?.primary || '#1E293B',
                      fontWeight: '500',
                    }}
                  >
                    {safeJob.companyInfo.employees}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: theme?.colors?.text?.secondary || '#64748B',
                      fontWeight: '500',
                    }}
                  >
                    Headquarters
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: theme?.colors?.text?.primary || '#1E293B',
                      fontWeight: '500',
                    }}
                  >
                    {safeJob.companyInfo.headquarters}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: theme?.colors?.text?.secondary || '#64748B',
                      fontWeight: '500',
                    }}
                  >
                    Industry
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: theme?.colors?.text?.primary || '#1E293B',
                      fontWeight: '500',
                    }}
                  >
                    {safeJob.companyInfo.industry}
                  </Text>
                </View>
              </View>
            </View>

            <View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: theme?.colors?.text?.primary || '#1E293B',
                  marginBottom: 12,
                  fontFamily: 'System',
                  letterSpacing: -0.2,
                }}
              >
                Benefits & Perks
              </Text>

              {safeJob.companyInfo.benefits.map((benefit, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    marginBottom: 8,
                  }}
                >
                  <View
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: '#4ADE80',
                      marginTop: 8,
                      marginRight: 12,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      color: theme?.colors?.text?.secondary || '#666666',
                      lineHeight: 22,
                      flex: 1,
                    }}
                  >
                    {benefit}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        );
      case 'Skills':
        return (
          <View style={{ paddingHorizontal: 20 }}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: 20,
                fontFamily: 'System',
                letterSpacing: -0.3,
              }}
            >
              Required Skills
            </Text>

            {jobSkills.length === 0 ? (
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '500',
                  color: '#FFFFFF',
                  lineHeight: 24,
                  fontFamily: 'System',
                  letterSpacing: -0.1,
                }}
              >
                No specific skills required for this position.
              </Text>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 8,
                  justifyContent: 'flex-start',
                }}
              >
                {jobSkills.map((skill, index) => (
                  <View
                    key={skill.id || index}
                    style={{
                      backgroundColor:
                        theme?.colors?.primary?.main || '#6475f8',
                      borderRadius: 20,
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                      borderWidth: 1,
                      borderColor: theme?.colors?.primary?.main || '#6475f8',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: '#FFFFFF',
                        fontFamily: 'System',
                        letterSpacing: -0.1,
                      }}
                    >
                      {skill.name}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        );
      default:
        return null;
    }
  };

  const tabs = ['Description', 'Company', 'Skills'];

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme?.colors?.background?.primary || '#F8F9FA',
      }}
    >
      {/* Header with back button */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingTop: 10,
          paddingBottom: 10,
          backgroundColor: theme?.colors?.background?.primary || '#F8F9FA',
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            padding: 8,
            borderRadius: 8,
            backgroundColor: theme?.colors?.background?.secondary || '#FFFFFF',
          }}
        >
          <Icon
            name="arrow-left"
            size={20}
            color={theme?.colors?.text?.primary || '#1E293B'}
          />
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: theme?.colors?.text?.primary || '#1E293B',
            }}
          >
            Job Details
          </Text>
        </View>
        <TouchableOpacity
          style={{
            padding: 8,
            borderRadius: 8,
            backgroundColor: theme?.colors?.background?.secondary || '#FFFFFF',
          }}
        >
          <Icon
            name="bookmark"
            size={20}
            color={theme?.colors?.text?.primary || '#1E293B'}
          />
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        {/* Tabs with curved design - moved outside ScrollView */}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#F3F4F6',
            marginHorizontal: 20,
            borderRadius: 8,
            padding: 2,
            marginBottom: 20,
            marginTop: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.03,
            shadowRadius: 2,
            elevation: 1,
            zIndex: 2000, // Ensure tabs are above other elements
          }}
        >
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab}
              onPress={() => {
                console.log('Tab pressed:', tab);
                setActiveTab(tab);
              }}
              style={{
                flex: 1,
                paddingVertical: 8,
                borderRadius: 6,
                backgroundColor:
                  activeTab === tab
                    ? theme?.colors?.primary?.main || '#6475f8'
                    : 'transparent',
                alignItems: 'center',
                zIndex: 2001, // Ensure touchable areas are above other elements
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: activeTab === tab ? '600' : '500',
                  color: activeTab === tab ? '#FFFFFF' : '#6B7280',
                  fontFamily: 'Inter',
                  letterSpacing: -0.1,
                }}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          {/* Job Header with curved design */}
          <View
            style={{
              backgroundColor:
                theme?.colors?.background?.secondary || '#FFFFFF',
              borderRadius: 24,
              marginHorizontal: 20,
              marginBottom: 20,
              paddingTop: 24,
              paddingBottom: 20,
              paddingHorizontal: 20,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            {/* Company Logo */}
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 15,
                backgroundColor:
                  `${theme?.colors?.primary?.main || '#6475f8'  }20`,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Feather
                name="briefcase"
                size={24}
                color={theme?.colors?.primary?.main || '#6475f8'}
              />
            </View>

            {/* Job Title */}
            <Text
              style={{
                fontSize: 20,
                fontWeight: '700',
                color: theme?.colors?.text?.primary || '#1E293B',
                textAlign: 'center',
                marginBottom: 6,
                fontFamily: 'System',
                letterSpacing: -0.3,
              }}
            >
              {safeJob.title}
            </Text>

            {/* Location */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <Icon
                name="map-pin"
                size={16}
                color={theme?.colors?.text?.secondary || '#666666'}
              />
              <Text
                style={{
                  fontSize: 16,
                  color: theme?.colors?.text?.secondary || '#666666',
                  marginLeft: 6,
                  fontFamily: 'System',
                  letterSpacing: -0.1,
                }}
              >
                {safeJob.location}
              </Text>
            </View>

            {/* Job Details Row - Centered */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: theme?.colors?.text?.primary || '#1E293B',
                  fontWeight: '500',
                  fontFamily: 'System',
                  letterSpacing: -0.1,
                }}
              >
                {safeJob.type}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: theme?.colors?.text?.primary || '#1E293B',
                  fontWeight: '600',
                  fontFamily: 'System',
                  letterSpacing: -0.1,
                }}
              >
                {formatSalary(safeJob.salary)}
              </Text>
            </View>
          </View>

          {/* Tab Content with curved container */}
          <View
            style={{
              backgroundColor:
                theme?.colors?.background?.secondary || '#FFFFFF',
              marginHorizontal: 20,
              borderRadius: 16,
              paddingVertical: 16,
              paddingHorizontal: 8,
              marginBottom: 100,
              minHeight: 300,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            {renderTabContent()}
          </View>
        </ScrollView>

        {/* Invisible swipe detection overlay - positioned below tabs */}
        {testJobQueue.length > 1 && (
          <View
            style={{
              position: 'absolute',
              top: 180, // Start below the header and tabs (adjusted for new tab position)
              left: 0,
              right: 0,
              bottom: 100, // Leave space for apply button
              backgroundColor: 'transparent',
              zIndex: 1000,
            }}
            {...panResponder.panHandlers}
          />
        )}
      </View>

      {/* Apply Button with transparent container */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'transparent',
          paddingHorizontal: 20,
          paddingVertical: 20,
          paddingBottom: 34,
        }}
      >
        {/* Swipe hints */}
        {testJobQueue.length > 1 && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
              paddingHorizontal: 20,
            }}
          >
            {currentJobIndex > 0 && (
              <View style={{ alignItems: 'center', opacity: 0.8 }}>
                <Icon
                  name="chevron-up"
                  size={16}
                  color={theme?.colors?.text?.secondary || '#6B7280'}
                />
                <Text
                  style={{
                    fontSize: 11,
                    color: theme?.colors?.text?.secondary || '#6B7280',
                  }}
                >
                  Swipe up for previous
                </Text>
              </View>
            )}
            <View style={{ flex: 1 }} />
            {currentJobIndex < testJobQueue.length - 1 && (
              <View style={{ alignItems: 'center', opacity: 0.8 }}>
                <Icon
                  name="chevron-down"
                  size={16}
                  color={theme?.colors?.text?.secondary || '#6B7280'}
                />
                <Text
                  style={{
                    fontSize: 11,
                    color: theme?.colors?.text?.secondary || '#6B7280',
                  }}
                >
                  Swipe down for next
                </Text>
              </View>
            )}
          </View>
        )}
        <TouchableOpacity
          style={{
            backgroundColor: hasApplied ? '#6B7280' : '#75ce9b',
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: hasApplied ? '#6B7280' : '#75ce9b',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 4,
            opacity: loading ? 0.7 : 1,
          }}
          onPress={handleApply}
          disabled={hasApplied || loading}
        >
          {loading ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#FFFFFF',
                  fontFamily: 'System',
                  letterSpacing: -0.2,
                  marginLeft: 8,
                }}
              >
                Applying...
              </Text>
            </View>
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon
                name={hasApplied ? 'check' : 'send'}
                size={16}
                color="#FFFFFF"
              />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#FFFFFF',
                  fontFamily: 'System',
                  letterSpacing: -0.2,
                  marginLeft: 8,
                }}
              >
                {hasApplied ? 'Applied' : 'Apply Now'}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SwipeableJobDetailsScreen;