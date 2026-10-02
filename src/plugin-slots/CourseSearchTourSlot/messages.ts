import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  searchButtonStepTitle: {
    id: 'course-authoring.course-search-tour.searchButton.title',
    defaultMessage: 'New: search your course content',
    description: 'Title of the product tour checkpoint shown on the Studio header search icon.',
  },
  searchButtonStepBody: {
    id: 'course-authoring.course-search-tour.searchButton.body',
    defaultMessage: 'Click the search icon to find sections, subsections, units and components across your courses.',
    description: 'Body text of the product tour checkpoint shown on the Studio header search icon.',
  },
  searchButtonStepAdvance: {
    id: 'course-authoring.course-search-tour.searchButton.advance',
    defaultMessage: 'Try it',
    description: 'Advance button label for the first product tour checkpoint.',
  },
  searchScopeStepTitle: {
    id: 'course-authoring.course-search-tour.searchScope.title',
    defaultMessage: 'Narrow your search',
    description: 'Title of the product tour checkpoint shown on the search scope selector.',
  },
  searchScopeStepBody: {
    id: 'course-authoring.course-search-tour.searchScope.body',
    defaultMessage: 'Use this menu to limit results to the current course or to search across all courses.',
    description: 'Body text of the product tour checkpoint shown on the search scope selector.',
  },
  searchScopeStepEnd: {
    id: 'course-authoring.course-search-tour.searchScope.end',
    defaultMessage: 'Got it',
    description: 'End button label for the last product tour checkpoint.',
  },
  dismissAltText: {
    id: 'course-authoring.course-search-tour.dismiss',
    defaultMessage: 'Dismiss tour',
    description: 'Alt text for the dismiss button of the course search product tour.',
  },
});

export default messages;
