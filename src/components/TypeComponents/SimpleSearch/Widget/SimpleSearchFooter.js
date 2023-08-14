import PropTypes from 'prop-types';

import { FormattedMessage, useIntl } from 'react-intl';
import moment from 'moment';

import { recursiveUrlDecoding } from '@folio/stripes-erm-components';

import WidgetFooter from '../../../Widget/WidgetFooter';

import css from './SimpleSearch.css';
import useSimpleSearchQuery from './useSimpleSearchQuery';

const SimpleSearchFooter = ({
  widget,
  widgetDef
}) => {
  const intl = useIntl();
  const widgetConf = JSON.parse(widget.configuration);

  // Grab from the same query cache as the widget itself
  const { dataUpdatedAt, refetch } = useSimpleSearchQuery({
    widget,
    widgetDef
  });

  const timestamp = dataUpdatedAt ? moment(dataUpdatedAt).format('hh:mm a') : '';
  const { configurableProperties: { urlLink } = {} } = widgetConf;

  const urlLinkButton = () => {
    if (!urlLink) {
      return null;
    }
    return (
      <a
        aria-label={intl.formatMessage(
          { id: 'ui-dashboard.simpleSearch.widget.linkTextForWidget' },
          {
            linkText: intl.formatMessage({
              id: 'ui-dashboard.simpleSearch.widget.linkText',
            }),
            widgetName: widget.name,
          }
        )}
        className={css.linkText}
        href={encodeURI(recursiveUrlDecoding(urlLink))}
        rel="noopener noreferrer"
        target="_blank"
      >
        <FormattedMessage id="ui-dashboard.simpleSearch.widget.linkText" />
      </a>
    );
  };

  return (
    <WidgetFooter
      key={`widget-footer-${widget.id}`}
      onRefresh={() => {
        refetch();
      }}
      rightContent={urlLinkButton()}
      timestamp={timestamp}
      widgetId={widget.id}
      widgetName={widget.name}
    />
  );
};


SimpleSearchFooter.propTypes = {
  widgetDef: PropTypes.object,
  widget: PropTypes.shape({
    configuration: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default SimpleSearchFooter;
