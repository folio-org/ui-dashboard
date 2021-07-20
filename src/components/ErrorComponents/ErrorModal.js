import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import {
  Modal,
  ModalFooter,
  Button,
  Headline,
  Icon,
} from '@folio/stripes/components';

import ErrorMessage from '../Dashboard/DashboardErrorBanner/ErrorMessage';

const COPY_TIMEOUT = 1000;
const COPY_RANGE = 99999;

const propTypes = {
  handlers: PropTypes.shape({
    onHideModal: PropTypes.func.isRequired
  }).isRequired,
  message: PropTypes.string.isRequired,
  modalOpen: PropTypes.bool.isRequired,
  stack: PropTypes.string
};

const ErrorModal = ({
  handlers: {
    onHideModal
  },
  message,
  modalOpen,
  stack,
}) => {
  const copyRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const handleCopyStack = () => {
    const el = copyRef.current;
    el.select();
    el.setSelectionRange(0, COPY_RANGE);
    document.execCommand('copy');

    setCopied(true);
  };

  useEffect(() => {
    let timeout;
    if (copied) {
      timeout = setTimeout(() => {
        setCopied(false);
      }, COPY_TIMEOUT);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [copied, setCopied]);


  return (
    <Modal
      closeOnBackgroundClick
      dismissible
      footer={
        <ModalFooter>
          <Button
            buttonStyle="primary"
            marginBottom0
            onClick={onHideModal}
          >
            <FormattedMessage id="ui-dashboard.dashboard.close" />
          </Button>
          <Button
            buttonStyle="default"
            disabled={copied}
            marginBottom0
            onClick={handleCopyStack}
          >
            <Icon icon="clipboard">
              {copied ? (
                <FormattedMessage id="ui-dashboard.dashboard.copied" />
              ) : (
                <FormattedMessage id="ui-dashboard.dashboard.copy" />
              )}
            </Icon>
          </Button>
        </ModalFooter>
      }
      label={<FormattedMessage id="ui-dashboard.dashboard.errorDetails" />}
      onClose={onHideModal}
      open={modalOpen}
      size="medium"
    >
      <Headline size="medium">
        <FormattedMessage id="ui-dashboard.dashboard.errorDetailsDescription" />
      </Headline>
      <ErrorMessage
        error={message}
        stack={stack}
      />
      {/* Hidden textfield to hold error text for copying */}
      <textarea
        ref={copyRef}
        aria-hidden
        className="sr-only"
        defaultValue={`URL: ${window.location.href}\n\nError: ${message}\n\nStack: ${stack}`}
      />
    </Modal>
  );
};

ErrorModal.propTypes = propTypes;

export default ErrorModal;


