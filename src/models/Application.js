/**
 * Application Model
 * Represents a job application in the system
 */
export class Application {
  constructor(data = {}) {
    this.id = data.id || null;
    this.job_id = data.job_id || null;
    this.seeker_id = data.seeker_id || null;
    this.message = data.message || '';
    this.status = data.status || 'applied';
    this.created_at = data.created_at || null;
    this.updated_at = data.updated_at || null;

    // Related data
    this.job = data.job ? new Job(data.job) : null;
    this.seeker_profile = data.seeker_profile
      ? new SeekerProfile(data.seeker_profile)
      : null;
  }

  static fromApi(data) {
    return new Application(data);
  }

  toApi() {
    return {
      id: this.id,
      job_id: this.job_id,
      seeker_id: this.seeker_id,
      message: this.message,
      status: this.status,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  get statusLabel() {
    const statusLabels = {
      applied: 'Applied',
      under_review: 'Under Review',
      hired: 'Hired',
      rejected: 'Rejected',
    };
    return statusLabels[this.status] || 'Applied';
  }

  get statusColor() {
    const statusColors = {
      applied: '#007AFF',
      under_review: '#FF9500',
      hired: '#34C759',
      rejected: '#FF3B30',
    };
    return statusColors[this.status] || '#007AFF';
  }

  get isPending() {
    return this.status === 'applied' || this.status === 'under_review';
  }

  get isAccepted() {
    return this.status === 'hired';
  }

  get isRejected() {
    return this.status === 'rejected';
  }

  get jobTitle() {
    return this.job?.title || 'Unknown Job';
  }

  get companyName() {
    return this.job?.companyName || 'Unknown Company';
  }

  get seekerName() {
    return this.seeker_profile?.user?.name || 'Unknown Seeker';
  }

  get appliedDate() {
    return this.created_at
      ? new Date(this.created_at).toLocaleDateString()
      : 'Unknown';
  }
}
