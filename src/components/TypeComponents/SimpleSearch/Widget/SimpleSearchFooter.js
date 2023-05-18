import PropTypes from 'prop-types';

import { FormattedMessage, useIntl } from 'react-intl';
import { useQueryClient } from 'react-query';
import moment from 'moment';

import simpleSearchQueryKey from './simpleSearchQueryKey';
import { WidgetFooter } from '../../../Widget';

import css from './SimpleSearch.css';

const SimpleSearchFooter = ({
  widget
}) => {
  const intl = useIntl();

  const queryKey = simpleSearchQueryKey(widget);
  const queryClient = useQueryClient();
  const queryState = queryClient.getQueryState(queryKey);

  const widgetConf = JSON.parse(widget.configuration);

  const refetch = () => queryClient.invalidateQueries(queryKey);

  const timestamp = queryState?.dataUpdatedAt ? moment(queryState?.dataUpdatedAt).format('hh:mm a') : '';
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
        href={encodeURI(urlLink)}
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
  widget: PropTypes.shape({
    configuration: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default SimpleSearchFooter;
