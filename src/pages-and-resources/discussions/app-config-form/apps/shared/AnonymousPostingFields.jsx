import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import FormSwitchGroup from '../../../../../generic/FormSwitchGroup';
import messages from '../../messages';
import AppConfigFormDivider from './AppConfigFormDivider';

const AnonymousPostingFields = ({
  onBlur,
  onChange,
  values,
}) => {
  const intl = useIntl();
  return (
    <>
      <h5 className="mt-4 text-gray-500">{intl.formatMessage(messages.anonymousPosting)}</h5>
      <AppConfigFormDivider />
      <FormSwitchGroup
        onChange={onChange}
        onBlur={onBlur}
        id="allowAnonymousPostsPeers"
        checked={values.allowAnonymousPostsPeers}
        label={intl.formatMessage(messages.allowAnonymousPostsPeersLabel)}
        helpText={intl.formatMessage(messages.allowAnonymousPostsPeersHelp)}
      />
    </>
  );
};

AnonymousPostingFields.propTypes = {
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  values: PropTypes.shape({
    allowAnonymousPostsPeers: PropTypes.bool,
  }).isRequired,
};

export default AnonymousPostingFields;
