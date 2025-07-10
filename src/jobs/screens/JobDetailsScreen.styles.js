import { StyleSheet } from 'react-native';
import { centeredContainer, cardShadow } from '../../theme/commonStyles';

export const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    ...centeredContainer,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: theme.spacing[8],
  },
  headerContainer: {
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[6],
  },
  headerContent: {
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: theme.spacing[2],
    marginRight: theme.spacing[3],
    borderRadius: 8,
    backgroundColor: theme.colors.surface.card,
    ...cardShadow(theme),
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: theme.typography.h4.fontSize,
    fontWeight: theme.typography.h4.fontWeight,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },
  headerSubtitle: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.secondary,
  },
  moreButton: {
    padding: theme.spacing[2],
    borderRadius: theme.borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  contentContainer: {
    paddingHorizontal: theme.spacing[4],
    marginBottom: theme.spacing[6],
  },
  jobCard: {
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing[6],
    ...cardShadow(theme),
  },
  jobHeader: {
    marginBottom: theme.spacing[6],
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: theme.typography.h5.fontSize,
    fontWeight: theme.typography.h5.fontWeight,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[2],
  },
  jobMetadata: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[3],
    alignItems: 'center',
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[1],
  },
  metadataText: {
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.text.secondary,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing[2],
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: theme.spacing[4],
    marginBottom: theme.spacing[6],
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.secondary,
  },
  statItem: {
    alignItems: 'center',
    gap: theme.spacing[1],
  },
  statNumber: {
    fontSize: theme.typography.h6.fontSize,
    fontWeight: theme.typography.h6.fontWeight,
    color: theme.colors.text.primary,
  },
  statLabel: {
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.text.secondary,
  },
  sectionContainer: {
    marginBottom: theme.spacing[6],
  },
  sectionTitle: {
    fontSize: theme.typography.h6.fontSize,
    fontWeight: theme.typography.h6.fontWeight,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[3],
  },
  descriptionText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.secondary,
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[2],
  },
  tag: {
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  skillTag: {
    backgroundColor: `${theme.colors.primary.cyan}10`,
    borderColor: theme.colors.primary.cyan,
  },
  tagText: {
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.text.secondary,
  },
  skillTagText: {
    color: theme.colors.primary.cyan,
    fontWeight: '500',
  },
  actionContainer: {
    paddingHorizontal: theme.spacing[4],
  },
  actionContent: {
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
    flexDirection: 'row',
    gap: theme.spacing[3],
    marginBottom: theme.spacing[4],
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  actionButtonText: {
    color: theme.colors.primary.cyan,
  },
  secondaryActions: {
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
    flexDirection: 'row',
    gap: theme.spacing[3],
  },
  secondaryActionButton: {
    flex: 1,
  },
}); 