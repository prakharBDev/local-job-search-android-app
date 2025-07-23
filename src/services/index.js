// Main services export file
export { default as userService } from './user.service';
export { default as seekerService } from './seeker.service';
export { default as companyService } from './company.service';
export { default as jobService } from './job.service';
export { default as applicationService } from './application.service';
export { default as skillsService } from './skills.service';
export { default as categoriesService } from './categories.service';
export { default as analyticsService } from './analytics.service';

// You can also export them as a single object if preferred
import userService from './user.service';
import seekerService from './seeker.service';
import companyService from './company.service';
import jobService from './job.service';
import applicationService from './application.service';
import skillsService from './skills.service';
import categoriesService from './categories.service';
import analyticsService from './analytics.service';

export default {
  userService,
  seekerService,
  companyService,
  jobService,
  applicationService,
  skillsService,
  categoriesService,
  analyticsService,
};