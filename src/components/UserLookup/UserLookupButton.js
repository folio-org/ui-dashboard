import { useRef } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Pluggable } from '@folio/stripes/core';

const UserLookupButton = ({
  buttonProps: passedButtonProps = {},
  onResourceSelected,
  renderButton,
  ...pluggableProps // Allow overriding of any and all pluggable props directly
}) => {
  let triggerButton = useRef(null);

  return (
    <Pluggable
      dataKey="user"
      disableRecordCreation
      renderTrigger={(pluggableRenderProps) => {
        triggerButton = pluggableRenderProps.buttonRef;

        const buttonProps = {
          'aria-haspopup': 'true',
          'id': 'user-search-button',
          'onClick': pluggableRenderProps.onClick,
          'buttonRef': triggerButton,
          'marginBottom0': true,
          ...passedButtonProps
        };

        return renderButton(buttonProps, pluggableRenderProps, triggerButton);
      }}
      selectUser={onResourceSelected}
      type="find-user"
      {...pluggableProps}
    >
      <FormattedMessage id="stripes-erm-components.contacts.noUserPlugin" />
    </Pluggable>
  );
};

UserLookupButton.propTypes = {
  buttonProps: PropTypes.object,
  onResourceSelected: PropTypes.func.isRequired,
  renderButton: PropTypes.func.isRequired
};

export default UserLookupButton;
