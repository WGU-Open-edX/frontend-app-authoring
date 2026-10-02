# CourseSearchTourSlot

### Slot ID: `org.openedx.frontend.authoring.course_search_tour.v1`

### Slot ID Aliases
* `course_search_tour_slot`

### Plugin Props:

* `isSearchModalOpen` - Boolean. Whether the Studio search modal is currently open.
* `openSearchModal` - Function. Opens the Studio search modal.

## Description

Rendered in the Studio header next to the search modal, this slot drives a two-step
product tour that introduces the course search feature after it is enabled in
production:

1. A checkpoint on the Studio header search icon (`button[aria-label="Search content"]`).
2. A checkpoint on the search-scope selector inside the search modal (`#course-search-tour-scope-target`).

The default plugin tags the search button with the id `course-search-tour-button-target`
and persists completion in `localStorage` under the key
`course-authoring.courseSearchTour.completed`, so each user sees the tour at
most once.

## Disabling the tour

To hide the tour entirely in a given deployment, override the slot with an empty
plugin:

```js
import { PLUGIN_OPERATIONS } from '@openedx/frontend-plugin-framework';

const config = {
  pluginSlots: {
    'org.openedx.frontend.authoring.course_search_tour.v1': {
      keepDefault: false,
      plugins: [],
    },
  },
};

export default config;
```

## Replacing with a custom tour

```js
import { DIRECT_PLUGIN, PLUGIN_OPERATIONS } from '@openedx/frontend-plugin-framework';

const MyCustomTour = ({ isSearchModalOpen, openSearchModal }) => (
  /* custom ProductTour implementation */
  null
);

const config = {
  pluginSlots: {
    'org.openedx.frontend.authoring.course_search_tour.v1': {
      keepDefault: false,
      plugins: [
        {
          op: PLUGIN_OPERATIONS.Insert,
          widget: {
            id: 'my-custom-search-tour',
            priority: 50,
            type: DIRECT_PLUGIN,
            RenderWidget: MyCustomTour,
          },
        },
      ],
    },
  },
};

export default config;
```
