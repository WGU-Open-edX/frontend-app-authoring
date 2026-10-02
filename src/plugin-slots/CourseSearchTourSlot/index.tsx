import React from 'react';
import { PluginSlot } from '@openedx/frontend-plugin-framework';

import CourseSearchTour from './CourseSearchTour';

interface CourseSearchTourSlotProps {
  isSearchModalOpen: boolean;
  openSearchModal: () => void;
}

export const CourseSearchTourSlot: React.FC<CourseSearchTourSlotProps> = ({
  isSearchModalOpen,
  openSearchModal,
}) => (
  <PluginSlot
    id="org.openedx.frontend.authoring.course_search_tour.v1"
    idAliases={['course_search_tour_slot']}
    pluginProps={{
      isSearchModalOpen,
      openSearchModal,
    }}
  >
    <CourseSearchTour
      isSearchModalOpen={isSearchModalOpen}
      openSearchModal={openSearchModal}
    />
  </PluginSlot>
);

export default CourseSearchTourSlot;
