import { supabase } from './supabase';

// Initial job categories for local Indian job market
const initialCategories = [
  { name: 'Sales & Marketing' },
  { name: 'Customer Service' },
  { name: 'Retail & Commerce' },
  { name: 'Food & Restaurant' },
  { name: 'Education & Training' },
  { name: 'Healthcare' },
  { name: 'Transportation & Delivery' },
  { name: 'Manufacturing & Production' },
  { name: 'Construction & Labor' },
  { name: 'Banking & Finance' },
  { name: 'IT & Computer' },
  { name: 'Security & Safety' },
  { name: 'Administrative' },
  { name: 'Beauty & Wellness' },
  { name: 'Agriculture & Farming' },
];

// Initial skills for local job market
const initialSkills = [
  // Communication skills
  { name: 'Hindi Speaking' },
  { name: 'English Speaking' },
  { name: 'Customer Communication' },
  
  // Technical skills
  { name: 'Computer Basic' },
  { name: 'MS Office' },
  { name: 'Data Entry' },
  { name: 'Accounting' },
  { name: 'Tally' },
  
  // Sales & Marketing
  { name: 'Sales Experience' },
  { name: 'Digital Marketing' },
  { name: 'Social Media' },
  
  // Service skills
  { name: 'Customer Service' },
  { name: 'Problem Solving' },
  { name: 'Team Work' },
  
  // Industry specific
  { name: 'Retail Experience' },
  { name: 'Food Service' },
  { name: 'Driving License' },
  { name: 'Two Wheeler' },
  { name: 'Teaching' },
  { name: 'Healthcare' },
  
  // Technical/IT
  { name: 'Web Development' },
  { name: 'Mobile App Development' },
  { name: 'Graphic Design' },
  { name: 'Digital Photography' },
];

export const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Seed categories
    console.log('Seeding job categories...');
    const { data: existingCategories, error: categoriesCheckError } = await supabase
      .from('job_categories')
      .select('name');

    if (categoriesCheckError) throw categoriesCheckError;

    const existingCategoryNames = existingCategories?.map(cat => cat.name) || [];
    const newCategories = initialCategories.filter(
      cat => !existingCategoryNames.includes(cat.name)
    );

    if (newCategories.length > 0) {
      const { error: categoriesError } = await supabase
        .from('job_categories')
        .insert(newCategories);

      if (categoriesError) throw categoriesError;
      console.log(`✅ Added ${newCategories.length} job categories`);
    } else {
      console.log('✅ Job categories already exist');
    }

    // Seed skills
    console.log('Seeding skills...');
    const { data: existingSkills, error: skillsCheckError } = await supabase
      .from('skills')
      .select('name');

    if (skillsCheckError) throw skillsCheckError;

    const existingSkillNames = existingSkills?.map(skill => skill.name) || [];
    const newSkills = initialSkills.filter(
      skill => !existingSkillNames.includes(skill.name)
    );

    if (newSkills.length > 0) {
      const { error: skillsError } = await supabase
        .from('skills')
        .insert(newSkills);

      if (skillsError) throw skillsError;
      console.log(`✅ Added ${newSkills.length} skills`);
    } else {
      console.log('✅ Skills already exist');
    }

    console.log('✅ Database seeding completed successfully!');
    return { success: true };

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    return { success: false, error };
  }
};

// Function to check if seeding is needed
export const checkSeedingStatus = async () => {
  try {
    const { data: categories } = await supabase
      .from('job_categories')
      .select('id')
      .limit(1);

    const { data: skills } = await supabase
      .from('skills')
      .select('id')
      .limit(1);

    return {
      needsCategories: !categories || categories.length === 0,
      needsSkills: !skills || skills.length === 0,
    };
  } catch (error) {
    console.error('Error checking seeding status:', error);
    return { needsCategories: true, needsSkills: true };
  }
};

export default {
  seedDatabase,
  checkSeedingStatus,
  initialCategories,
  initialSkills,
}; 