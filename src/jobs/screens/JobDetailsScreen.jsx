import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { 
  applicationService, 
  seekerService,
  jobService 
} from '../../services';
import { AppHeader, Icon } from '../../components/elements';

const JobDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { jobData } = route.params || {};
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('Description');
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [seekerProfile, setSeekerProfile] = useState(null);
  const [jobDetails, setJobDetails] = useState(jobData);

  // Load seeker profile and check application status
  useEffect(() => {
    const loadSeekerData = async () => {
      if (user?.id) {
        try {
          const { data: profile, error } = await seekerService.getSeekerProfile(user.id);
          if (profile && !error) {
            setSeekerProfile(profile);
            
            // Check if user has already applied
            if (jobDetails?.id) {
              const { data: applicationData } = await applicationService.hasApplied(
                jobDetails.id, 
                profile.id
              );
              setHasApplied(!!applicationData);
            }
          }
        } catch (error) {
          console.error('Error loading seeker data:', error);
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
          const { data: fullJobData, error } = await jobService.getJobById(jobDetails.id);
          if (fullJobData && !error) {
            setJobDetails(fullJobData);
          }
        } catch (error) {
          console.error('Error loading job details:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadJobDetails();
  }, [jobDetails?.id]);

  // Handle job application
  const handleApplyJob = async () => {
    if (!user) {
      Alert.alert('Error', 'Please log in to apply for jobs');
      return;
    }

    try {
      setApplying(true);
      const { data, error } = await applicationService.createApplication({
        job_id: jobDetails.id,
        seeker_id: seekerProfile.id,
        message: '', // No message input for now
      });

      if (error) {
        throw error;
      }

      Alert.alert('Success', 'Application submitted successfully!');
      setHasApplied(true);
    } catch (error) {
      console.error('Error applying for job:', error);
      Alert.alert('Error', 'Failed to submit application. Please try again.');
    } finally {
      setApplying(false);
    }
  };

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

  // Mock job data based on the image with proper fallbacks
  const job = jobData || {
    id: 1,
    company: 'Google',
    title: 'Senior UI/UX Designer',
    location: 'California',
    type: 'Full Time',
    salary: '$240-$280K/year',
    applicationsCount: '20K',
    daysLeft: '6 Days Left',
    description: `We are looking for a Senior UI/UX Designer to join our dynamic team at Google. In this role, you will be responsible for creating intuitive and engaging user experiences across our product suite. You will work closely with product managers, engineers, and other designers to deliver world-class digital experiences.

Key Responsibilities:
• Design and prototype user interfaces for web and mobile applications
• Conduct user research and usability testing to inform design decisions
• Collaborate with cross-functional teams to define product requirements
• Create wireframes, mockups, and interactive prototypes
• Maintain and evolve our design system and style guides
• Present design concepts and rationale to stakeholders

We're looking for someone who is passionate about user-centered design and has experience working in fast-paced, collaborative environments. You should be comfortable with ambiguity and able to iterate quickly based on feedback.`,
    requirements: [
      "Bachelor's degree in Design, HCI, or related field, or equivalent practical experience",
      '5+ years of experience in UI/UX design for web and mobile applications',
      'Proficiency in design tools such as Figma, Sketch, Adobe Creative Suite',
      'Strong understanding of user-centered design principles and methodologies',
      'Experience with user research methods including usability testing, interviews, and surveys',
      'Knowledge of front-end development technologies (HTML, CSS, JavaScript) is a plus',
      'Excellent communication and presentation skills',
      'Portfolio demonstrating strong design process and problem-solving abilities',
    ],
    companyLogo:
      'https://logos-world.net/wp-content/uploads/2020/09/Google-Logo.png',
    peopleApplied: [
      {
        id: 1,
        name: 'Sarah Johnson',
        avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        position: 'Senior Designer',
      },
      {
        id: 2,
        name: 'Michael Chen',
        avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
        position: 'Product Designer',
      },
      {
        id: 3,
        name: 'Emily Rodriguez',
        avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
        position: 'UX Designer',
      },
      {
        id: 4,
        name: 'David Kim',
        avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
        position: 'UI Designer',
      },
      {
        id: 5,
        name: 'Jessica Taylor',
        avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
        position: 'Design Lead',
      },
    ],
    companyInfo: {
      name: 'Google',
      founded: '1998',
      employees: '100,000+',
      headquarters: 'Mountain View, CA',
      industry: 'Technology',
      description:
        "Google is a multinational technology company that specializes in Internet-related services and products. We organize the world's information and make it universally accessible and useful. Our mission is to make the world's information universally accessible and useful, and we're committed to building products that help people, businesses, and communities thrive.",
      benefits: [
        'Comprehensive health, dental, and vision insurance',
        'Flexible work arrangements and remote work options',
        'Professional development and learning opportunities',
        'Competitive salary and equity compensation',
        'On-site facilities including gyms, cafeterias, and wellness centers',
        'Generous parental leave and family support programs',
        '401(k) matching and retirement planning assistance',
        'Free meals and snacks throughout the day',
      ],
    },
    reviews: [
      {
        id: 1,
        author: 'Current UX Designer',
        rating: 4.5,
        title: 'Amazing culture and growth opportunities',
        content:
          "Working at Google has been an incredible experience. The company culture is truly collaborative, and there are endless opportunities for professional growth. The design team is world-class, and I've learned so much from my colleagues. The work-life balance is excellent, and the benefits are unmatched.",
        date: '2 weeks ago',
      },
      {
        id: 2,
        author: 'Former Product Designer',
        rating: 4.2,
        title: 'Great place to learn and innovate',
        content:
          'My time at Google was transformative for my career. The resources available for learning and experimentation are incredible. You get to work on products that impact billions of users. The only downside is that the pace can be intense, but the support from management and peers makes it manageable.',
        date: '1 month ago',
      },
      {
        id: 3,
        author: 'Senior Design Manager',
        rating: 4.7,
        title: "Best company I've ever worked for",
        content:
          'Google sets the standard for how tech companies should operate. The focus on user experience and design excellence is evident in everything we do. The compensation is competitive, and the company genuinely cares about employee wellbeing. Highly recommend to any designer looking to make a real impact.',
        date: '3 weeks ago',
      },
    ],
  };

  // Use real job data when available, fall back to mock data
  const currentJob = jobDetails || job;
  
  // Ensure required properties exist with fallbacks
  const safeJob = {
    ...currentJob,
    company: currentJob.company_profiles?.company_name || currentJob.company || 'Unknown Company',
    title: currentJob.title || 'Job Title',
    location: currentJob.city || currentJob.location || 'Location',
    type: currentJob.type || 'Full Time',
    salary: currentJob.salary || 'Salary not specified',
    applicationsCount: currentJob.applicationsCount || '0',
    daysLeft: currentJob.daysLeft || 'N/A',
    description: currentJob.description || 'No description available.',
    requirements: currentJob.requirements || ['No specific requirements listed'],
    companyLogo:
      currentJob.companyLogo ||
      'https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png',
    peopleApplied: job.peopleApplied || [
      {
        id: 1,
        name: 'User 1',
        avatar: 'https://randomuser.me/api/portraits/women/10.jpg',
        position: 'Designer',
      },
      {
        id: 2,
        name: 'User 2',
        avatar: 'https://randomuser.me/api/portraits/men/10.jpg',
        position: 'Designer',
      },
      {
        id: 3,
        name: 'User 3',
        avatar: 'https://randomuser.me/api/portraits/women/11.jpg',
        position: 'Designer',
      },
      {
        id: 4,
        name: 'User 4',
        avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
        position: 'Designer',
      },
    ],
    companyInfo: job.companyInfo || {
      name: job.company || 'Unknown Company',
      founded: 'N/A',
      employees: 'N/A',
      headquarters: 'N/A',
      industry: 'N/A',
      description: 'Company information not available.',
      benefits: ['Information not available'],
    },
    reviews: job.reviews || [
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

  const tabs = ['Description', 'Company', 'Review'];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Description':
        return (
          <View style={{ paddingHorizontal: 20 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: '#1E293B',
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
                color: '#64748B',
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
                fontWeight: '600',
                color: '#1E293B',
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
                    backgroundColor: '#6475f8',
                    marginTop: 8,
                    marginRight: 12,
                  }}
                />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: '#64748B',
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
                fontWeight: '600',
                color: '#1E293B',
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
                color: '#64748B',
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
                  fontWeight: '600',
                  color: '#1E293B',
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
                      color: '#64748B',
                      fontWeight: '500',
                      fontFamily: 'System',
                      letterSpacing: -0.1,
                    }}
                  >
                    Founded
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: '#1E293B',
                      fontWeight: '500',
                      fontFamily: 'System',
                      letterSpacing: -0.1,
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
                      color: '#64748B',
                      fontWeight: '500',
                      fontFamily: 'System',
                      letterSpacing: -0.1,
                    }}
                  >
                    Employees
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: '#1E293B',
                      fontWeight: '500',
                      fontFamily: 'System',
                      letterSpacing: -0.1,
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
                      color: '#64748B',
                      fontWeight: '500',
                      fontFamily: 'System',
                      letterSpacing: -0.1,
                    }}
                  >
                    Headquarters
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: '#1E293B',
                      fontWeight: '500',
                      fontFamily: 'System',
                      letterSpacing: -0.1,
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
                      color: '#64748B',
                      fontWeight: '500',
                      fontFamily: 'System',
                      letterSpacing: -0.1,
                    }}
                  >
                    Industry
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: '#1E293B',
                      fontWeight: '500',
                      fontFamily: 'System',
                      letterSpacing: -0.1,
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
                  fontWeight: '600',
                  color: '#1E293B',
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
                      color: '#666666',
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
      case 'Review':
        return (
          <View style={{ paddingHorizontal: 20 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: '#1E293B',
                marginBottom: 16,
                fontFamily: 'System',
                letterSpacing: -0.3,
              }}
            >
              Employee Reviews
            </Text>

            {safeJob.reviews.map((review, index) => (
              <View
                key={review.id}
                style={{
                  backgroundColor: '#F8F9FA',
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 16,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '500',
                      color: '#1E293B',
                      fontFamily: 'System',
                      letterSpacing: -0.1,
                    }}
                  >
                    {review.author}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Feather name="star" size={14} color="#FFD700" />
                    <Text
                      style={{
                        fontSize: 14,
                        color: '#1E293B',
                        fontWeight: '500',
                        marginLeft: 4,
                        fontFamily: 'System',
                        letterSpacing: -0.1,
                      }}
                    >
                      {review.rating}
                    </Text>
                  </View>
                </View>

                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#1E293B',
                    marginBottom: 8,
                    fontFamily: 'System',
                    letterSpacing: -0.2,
                  }}
                >
                  {review.title}
                </Text>

                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: '#64748B',
                    lineHeight: 20,
                    marginBottom: 8,
                    fontFamily: 'System',
                    letterSpacing: -0.1,
                  }}
                >
                  {review.content}
                </Text>

                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '500',
                    color: '#94A3B8',
                    fontFamily: 'System',
                  }}
                >
                  {review.date}
                </Text>
              </View>
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      {/* App Header */}
      <AppHeader
        title="Job Details"
        leftIcon={<Icon name="arrow-left" size={20} color="#1E293B" />}
        rightIcon={<Icon name="bookmark" size={20} color="#1E293B" />}
        onLeftPress={() => navigation.goBack()}
        background="#F8F9FA"
        centered={false}
      />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Job Header */}
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 24,
            marginHorizontal: 20,
            marginBottom: 20,
            paddingTop: 40,
            paddingBottom: 30,
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
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: '#FFFFFF',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Image
              source={{ uri: safeJob.companyLogo }}
              style={{ width: '100%', height: '100%', borderRadius: 40 }}
            />
          </View>

          {/* Job Title */}
          <Text
            style={{
              fontSize: 24,
              fontWeight: '700',
              color: '#1E293B',
              textAlign: 'center',
              marginBottom: 8,
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
              marginBottom: 24,
            }}
          >
            <Feather name="map-pin" size={16} color="#666666" />
            <Text
              style={{
                fontSize: 16,
                color: '#666666',
                marginLeft: 6,
                fontFamily: 'System',
                letterSpacing: -0.1,
              }}
            >
              {safeJob.location}
            </Text>
          </View>

          {/* Job Details Row */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              marginBottom: 24,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: '#1E293B',
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
                color: '#1E293B',
                fontWeight: '600',
                fontFamily: 'System',
                letterSpacing: -0.1,
              }}
            >
              {formatSalary(safeJob.salary)}
            </Text>
          </View>

          {/* People Applied Section */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 16,
                  color: '#1E293B',
                  fontWeight: '600',
                  marginBottom: 8,
                  fontFamily: 'System',
                  letterSpacing: -0.1,
                }}
              >
                People Applied
              </Text>

              {/* Avatars */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                {safeJob.peopleApplied.slice(0, 4).map((person, index) => (
                  <View
                    key={person.id}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      marginLeft: index > 0 ? -8 : 0,
                      borderWidth: 2,
                      borderColor: '#FFFFFF',
                      overflow: 'hidden',
                    }}
                  >
                    <Image
                      source={{ uri: person.avatar }}
                      style={{
                        width: '100%',
                        height: '100%',
                      }}
                    />
                  </View>
                ))}
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: '#E5E7EB',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: -8,
                    borderWidth: 2,
                    borderColor: '#FFFFFF',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      color: '#6475f8',
                      fontWeight: '600',
                    }}
                  >
                    {safeJob.applicationsCount}
                  </Text>
                </View>
              </View>
            </View>

            <Text
              style={{
                fontSize: 16,
                color: '#1E293B',
                fontWeight: '600',
                fontFamily: 'System',
                letterSpacing: -0.1,
              }}
            >
              {safeJob.daysLeft}
            </Text>
          </View>
        </View>

        {/* Tabs - Updated to match reference design */}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#F3F4F6',
            marginHorizontal: 20,
            borderRadius: 8, // More subtle rounded corners
            padding: 2, // Reduced padding
            marginBottom: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.03,
            shadowRadius: 2,
            elevation: 1,
          }}
        >
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={{
                flex: 1,
                paddingVertical: 8, // Reduced height (36px equivalent)
                borderRadius: 6, // More subtle
                backgroundColor: activeTab === tab ? '#6475f8' : 'transparent', // Using new purple color
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: activeTab === tab ? '600' : '500', // Bold for selected
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

        {/* Tab Content */}
        <View
          style={{
            backgroundColor: '#FFFFFF',
            marginHorizontal: 20,
            borderRadius: 16,
            paddingVertical: 24,
            marginBottom: 100,
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

      {/* Apply Button */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#FFFFFF',
          paddingHorizontal: 20,
          paddingVertical: 20,
          paddingBottom: 34,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 10,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: hasApplied ? '#6B7280' : '#2ECC71', // Success green as specified
            paddingVertical: 16,
            borderRadius: 12, // More subtle rounded corners
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: hasApplied ? '#6B7280' : '#2ECC71',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 4,
            opacity: applying ? 0.7 : 1,
          }}
          onPress={handleApplyJob}
          disabled={applying || hasApplied}
        >
          {applying ? (
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
              <Feather 
                name={hasApplied ? "check" : "send"} 
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

export default JobDetailsScreen;
