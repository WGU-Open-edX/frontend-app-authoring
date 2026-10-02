import React from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { ProductTour } from '@openedx/paragon';

import messages from './messages';

export const SEARCH_BUTTON_TARGET_ID = 'course-search-tour-button-target';
export const SEARCH_SCOPE_TARGET_ID = 'course-search-tour-scope-target';
const STORAGE_KEY = 'course-authoring.courseSearchTour.completed';
// Matches the message defined in @edx/frontend-component-header: 'header.label.search.nav'.
const SEARCH_BUTTON_ARIA_LABEL_ID = 'header.label.search.nav';
const SEARCH_BUTTON_ARIA_LABEL_FALLBACK = 'Search content';

const TRACK_EVENTS = {
  stepViewed: 'edx.studio.search_tour.step_viewed',
  stepAdvanced: 'edx.studio.search_tour.step_advanced',
  dismissed: 'edx.studio.search_tour.dismissed',
  completed: 'edx.studio.search_tour.completed',
} as const;

type Step = 'button' | 'scope' | 'done';

const isAlreadyCompleted = () => {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
};

const markCompleted = () => {
  try {
    window.localStorage.setItem(STORAGE_KEY, 'true');
  } catch { /* ignore storage errors */ }
};

const escapeAttrValue = (value: string) => value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

interface CourseSearchTourProps {
  isSearchModalOpen: boolean;
  openSearchModal: () => void;
}

const CourseSearchTour: React.FC<CourseSearchTourProps> = ({
  isSearchModalOpen,
  openSearchModal,
}) => {
  const intl = useIntl();
  const [step, setStep] = React.useState<Step>(() => (isAlreadyCompleted() ? 'done' : 'button'));
  const [buttonTagged, setButtonTagged] = React.useState(false);

  const searchButtonAriaLabel = intl.formatMessage({
    id: SEARCH_BUTTON_ARIA_LABEL_ID,
    defaultMessage: SEARCH_BUTTON_ARIA_LABEL_FALLBACK,
  });

  // Tag the Studio header search icon synchronously (useLayoutEffect) so that ProductTour's
  // pruneCheckpoints call — which runs in a useEffect in the child — finds the target id.
  React.useLayoutEffect(() => {
    if (step !== 'button') { return undefined; }
    const selector = `button[aria-label="${escapeAttrValue(searchButtonAriaLabel)}"]`;
    const tagButton = () => {
      const btn = document.querySelector<HTMLElement>(selector);
      if (btn) {
        if (!btn.id) { btn.id = SEARCH_BUTTON_TARGET_ID; }
        setButtonTagged(true);
        return true;
      }
      return false;
    };
    if (tagButton()) { return undefined; }
    const observer = new MutationObserver(() => { if (tagButton()) { observer.disconnect(); } });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [step, searchButtonAriaLabel]);

  // When the user opens the modal (via tour or on their own), advance to the scope checkpoint.
  React.useEffect(() => {
    if (isSearchModalOpen && step === 'button') {
      setStep('scope');
    }
  }, [isSearchModalOpen, step]);

  // Fire a "step viewed" analytics event whenever a checkpoint becomes active.
  React.useEffect(() => {
    if (step === 'button') {
      sendTrackEvent(TRACK_EVENTS.stepViewed, { step: 1, name: 'search_button' });
    } else if (step === 'scope') {
      sendTrackEvent(TRACK_EVENTS.stepViewed, { step: 2, name: 'search_scope' });
    }
  }, [step]);

  // Paragon renders two independent ProductTours so each thinks total=1; rewrite the counter
  // text to reflect the real "step X of 2".
  // React.useEffect(() => {
  //   if (step !== 'button' && step !== 'scope') { return undefined; }
  //   const currentStep = step === 'button' ? 1 : 2;
  //   const totalSteps = 2;
  //   const expectedText = intl.formatMessage(
  //     { id: 'pgn.ProductTour.Checkpoint.page-index-text', defaultMessage: '{step} of {totalSteps}' },
  //     { step: currentStep, totalSteps },
  //   );
  //   const updateCounter = () => {
  //     const el = document.querySelector<HTMLElement>('#pgn__checkpoint .pgn__checkpoint-page-index');
  //     if (el && el.textContent !== expectedText) {
  //       el.textContent = expectedText;
  //       return true;
  //     }
  //     return !!el;
  //   };
  //   if (updateCounter()) { return undefined; }
  //   const observer = new MutationObserver(() => { updateCounter(); });
  //   observer.observe(document.body, { childList: true, subtree: true });
  //   return () => observer.disconnect();
  // }, [step, intl]);

  // While the scope checkpoint is open, the Paragon Checkpoint is rendered outside the
  // ModalDialog subtree, so react-focus-on treats clicks on it as outside-clicks and closes
  // the modal. react-focus-on listens on mousedown/touchstart/touchend only, so stop just
  // those events (not click) to keep the modal open without breaking React's onClick handlers.
  React.useEffect(() => {
    if (step !== 'scope') { return undefined; }
    const stop = (e: Event) => e.stopPropagation();
    const events: (keyof HTMLElementEventMap)[] = ['mousedown', 'touchstart', 'touchend'];
    let attachedTo: HTMLElement | null = null;
    const attach = () => {
      const checkpoint = document.querySelector<HTMLElement>('#pgn__checkpoint');
      if (!checkpoint || checkpoint === attachedTo) { return !!checkpoint; }
      events.forEach(evt => checkpoint.addEventListener(evt, stop));
      attachedTo = checkpoint;
      return true;
    };
    attach();
    const observer = new MutationObserver(() => { attach(); });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      if (attachedTo) {
        events.forEach(evt => attachedTo!.removeEventListener(evt, stop));
      }
    };
  }, [step]);

  const finish = React.useCallback((reason: 'completed' | 'dismissed') => {
    sendTrackEvent(
      reason === 'completed' ? TRACK_EVENTS.completed : TRACK_EVENTS.dismissed,
      { step: step === 'button' ? 1 : 2 },
    );
    markCompleted();
    setStep('done');
  }, [step]);

  if (step === 'done') { return null; }

  const buttonTour = {
    enabled: step === 'button' && buttonTagged,
    onDismiss: () => finish('dismissed'),
    onEscape: () => finish('dismissed'),
    dismissAltText: intl.formatMessage(messages.dismissAltText),
    checkpoints: [{
      target: `#${SEARCH_BUTTON_TARGET_ID}`,
      placement: 'bottom' as const,
      title: intl.formatMessage(messages.searchButtonStepTitle),
      body: intl.formatMessage(messages.searchButtonStepBody),
      endButtonText: intl.formatMessage(messages.searchButtonStepAdvance),
      onEnd: () => {
        sendTrackEvent(TRACK_EVENTS.stepAdvanced, { step: 1, name: 'search_button' });
        openSearchModal();
      },
    }],
  };

  // const scopeTour = {
  //   enabled: step === 'scope',
  //   onDismiss: () => finish('dismissed'),
  //   onEscape: () => finish('dismissed'),
  //   onEnd: () => finish('completed'),
  //   dismissAltText: intl.formatMessage(messages.dismissAltText),
  //   checkpoints: [{
  //     target: `#${SEARCH_SCOPE_TARGET_ID}`,
  //     placement: 'bottom' as const,
  //     title: intl.formatMessage(messages.searchScopeStepTitle),
  //     body: intl.formatMessage(messages.searchScopeStepBody),
  //     endButtonText: intl.formatMessage(messages.searchScopeStepEnd),
  //     onEnd: () => finish('completed'),
  //   }],
  // };

  return (
    <>
      <ProductTour tours={[buttonTour]} />
      {/* <ProductTour tours={[scopeTour]} /> */}
    </>
  );
};

export default CourseSearchTour;
