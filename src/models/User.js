/**
 * User Model
 * Represents a user in the system with both seeker and poster capabilities
 */
export class User {
  constructor(data = {}) {
    this.id = data.id || null;
    this.email = data.email || '';
    this.google_id = data.google_id || '';
    this.name = data.name || '';
    this.phone_number = data.phone_number || '';
    this.city = data.city || '';
    this.is_seeker = data.is_seeker ?? true;
    this.is_poster = data.is_poster ?? false;
    this.last_login_at = data.last_login_at || null;
    this.created_at = data.created_at || null;
    this.updated_at = data.updated_at || null;

    // Related data
    this.seeker_profile = data.seeker_profile
      ? new SeekerProfile(data.seeker_profile)
      : null;
    this.company_profile = data.company_profile
      ? new CompanyProfile(data.company_profile)
      : null;
  }

  /**
   * Create User from API response
   */
  static fromApi(data) {
    return new User(data);
  }

  /**
   * Convert to API format
   */
  toApi() {
    return {
      id: this.id,
      email: this.email,
      google_id: this.google_id,
      name: this.name,
      phone_number: this.phone_number,
      city: this.city,
      is_seeker: this.is_seeker,
      is_poster: this.is_poster,
      last_login_at: this.last_login_at,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  /**
   * Get user roles object for compatibility with existing code
   */
  get userRoles() {
    return {
      isSeeker: this.is_seeker,
      isCompany: this.is_poster,
    };
  }

  /**
   * Check if user is a seeker
   */
  get isSeeker() {
    return this.is_seeker;
  }

  /**
   * Check if user is a poster/company
   */
  get isPoster() {
    return this.is_poster;
  }

  /**
   * Check if user has completed profile setup
   */
  get hasProfile() {
    return this.seeker_profile || this.company_profile;
  }

  /**
   * Get display name
   */
  get displayName() {
    return this.name || this.email;
  }
}

/**
 * Seeker Profile Model
 */
export class SeekerProfile {
  constructor(data = {}) {
    this.id = data.id || null;
    this.user_id = data.user_id || null;
    this.tenth_percentage = data.tenth_percentage || null;
    this.twelfth_percentage = data.twelfth_percentage || null;
    this.graduation_percentage = data.graduation_percentage || null;
    this.experience_level = data.experience_level || 'fresher';
    this.created_at = data.created_at || null;
    this.updated_at = data.updated_at || null;

    // Related data
    this.skills = data.skills || [];
    this.categories = data.categories || [];
  }

  static fromApi(data) {
    return new SeekerProfile(data);
  }

  toApi() {
    return {
      id: this.id,
      user_id: this.user_id,
      tenth_percentage: this.tenth_percentage,
      twelfth_percentage: this.twelfth_percentage,
      graduation_percentage: this.graduation_percentage,
      experience_level: this.experience_level,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  get hasEducation() {
    return (
      this.tenth_percentage ||
      this.twelfth_percentage ||
      this.graduation_percentage
    );
  }

  get experienceLevelLabel() {
    const levels = {
      fresher: 'Fresher',
      entry: 'Entry Level',
      mid: 'Mid Level',
      senior: 'Senior Level',
    };
    return levels[this.experience_level] || 'Fresher';
  }
}

/**
 * Company Profile Model
 */
export class CompanyProfile {
  constructor(data = {}) {
    this.id = data.id || null;
    this.user_id = data.user_id || null;
    this.company_name = data.company_name || '';
    this.company_description = data.company_description || '';
    this.is_verified = data.is_verified ?? false;
    this.created_at = data.created_at || null;
    this.updated_at = data.updated_at || null;
  }

  static fromApi(data) {
    return new CompanyProfile(data);
  }

  toApi() {
    return {
      id: this.id,
      user_id: this.user_id,
      company_name: this.company_name,
      company_description: this.company_description,
      is_verified: this.is_verified,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  get displayName() {
    return this.company_name;
  }

  get isVerified() {
    return this.is_verified;
  }
}
