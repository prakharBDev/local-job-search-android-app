/**
 * Job Model
 * Represents a job posting in the system
 */
export class Job {
  constructor(data = {}) {
    this.id = data.id || null;
    this.company_id = data.company_id || null;
    this.title = data.title || '';
    this.description = data.description || '';
    this.salary = data.salary || '';
    this.category_id = data.category_id || null;
    this.city = data.city || '';
    this.is_active = data.is_active ?? true;
    this.created_at = data.created_at || null;
    this.updated_at = data.updated_at || null;
    
    // Related data
    this.company_profile = data.company_profile ? new CompanyProfile(data.company_profile) : null;
    this.category = data.category ? new JobCategory(data.category) : null;
    this.skills = data.skills || [];
    this.applications = data.applications || [];
  }

  static fromApi(data) {
    return new Job(data);
  }

  toApi() {
    return {
      id: this.id,
      company_id: this.company_id,
      title: this.title,
      description: this.description,
      salary: this.salary,
      category_id: this.category_id,
      city: this.city,
      is_active: this.is_active,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  get displayTitle() {
    return this.title;
  }

  get displaySalary() {
    return this.salary || 'Not specified';
  }

  get displayCity() {
    return this.city.charAt(0).toUpperCase() + this.city.slice(1);
  }

  get companyName() {
    return this.company_profile?.company_name || 'Unknown Company';
  }

  get categoryName() {
    return this.category?.name || 'Uncategorized';
  }

  get isActive() {
    return this.is_active;
  }

  get applicationCount() {
    return this.applications?.length || 0;
  }

  get hasApplications() {
    return this.applicationCount > 0;
  }
}

/**
 * Job Category Model
 */
export class JobCategory {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.created_at = data.created_at || null;
  }

  static fromApi(data) {
    return new JobCategory(data);
  }

  toApi() {
    return {
      id: this.id,
      name: this.name,
      created_at: this.created_at,
    };
  }
}

/**
 * Skill Model
 */
export class Skill {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.created_at = data.created_at || null;
  }

  static fromApi(data) {
    return new Skill(data);
  }

  toApi() {
    return {
      id: this.id,
      name: this.name,
      created_at: this.created_at,
    };
  }
} 