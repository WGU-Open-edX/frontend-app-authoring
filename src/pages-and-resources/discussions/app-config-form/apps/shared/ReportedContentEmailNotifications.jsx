import React from 'react';
import { useFormikContext } from 'formik';
import { useIntl } from '@edx/frontend-platform/i18n';
import FormSwitchGroup from '../../../../../generic/FormSwitchGroup';
import AppConfigFormDivider from './AppConfigFormDivider';
import messages from '../../messages';

const ReportedContentEmailNotifications = () => {
  const intl = useIntl();
  const {
    handleChange,
    handleBlur,
    values,
  } = useFormikContext();

  return (
    <div>
      <h5 className="text-gray-500 mt-4 mb-2 ">{intl.formatMessage(messages.reportedContentEmailNotifications)}</h5>
      <FormSwitchGroup
        className="mb-4"
        onChange={handleChange}
        onBlur={handleBlur}
        id="reportedContentEmailNotifications"
        checked={values.reportedContentEmailNotifications}
        label={intl.formatMessage(messages.reportedContentEmailNotificationsLabel)}
        helpText={intl.formatMessage(messages.reportedContentEmailNotificationsHelp)}
      />
      <AppConfigFormDivider thick />
    </div>
  );
};

export default ReportedContentEmailNotifications;
