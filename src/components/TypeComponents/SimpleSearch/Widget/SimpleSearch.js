import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import moment from 'moment';
import { useQuery } from 'react-query';
import { useOkapiKy, useStripes } from '@folio/stripes/core';
import { Badge, Spinner } from '@folio/stripes/components';
import pathBuilder from './simpleSearchPathBuilder';
import columnParser from './simpleSearchColumnParser';
import SimpleTable from '../../../SimpleTable';
import { WidgetFooter } from '../../../Widget';
import css from './SimpleSearch.css';
import { ErrorBanner, errorParser } from '../../../ErrorComponents';

const SimpleSearch = ({
  onError,
  widget,
  widgetDef
}) => {
  const intl = useIntl();
  /*
   * IMPORTANT this code uses react-query.
   * At some point after Stripes' Iris release there is a possibility this will be removed in favour of SWR.
   * A decision has not been made either way yet, so for now I've gone with react-query.
   * Should that happen, the APIs seem quite similar so porting won't be too difficult.
   */
  // At some point these will be versioned, so we might need to switch up logic slightly based on type version
  const widgetConf = JSON.parse(widget.configuration);
  const columns = columnParser({ onError, widgetDef, widgetConf });

  // This stores the WIDGET-LEVEL error state, ready to pass to the canvas if required
  const [errorState, setErrorState] = useState({
    isError: false,
    errorMessage: null,
    errorStack: null
  });

  const ky = useOkapiKy();
  // We need to pass the stripes object into the pathBuilder, so it can use that for currentUser token
  const stripes = useStripes();

  const { data, dataUpdatedAt, isLoading: widgetsLoading, refetch } = useQuery(
    // If widget.configuration changes, this should refetch
    ['ui-dashboard', 'simpleSearch', widget.id, widget.configuration],
    async () => ky(pathBuilder(widgetDef, widgetConf, stripes))
      .then((res) => {
        return res.json();
      })
      .catch(async err => {
        const parsedError = await errorParser(err, intl);
        setErrorState({
          ...parsedError,
          isError: true
        });
      })
  );

  const simpleTableData = useMemo(() => data?.results || [], [data]);


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
        href={urlLink}
      >
        <FormattedMessage id="ui-dashboard.simpleSearch.widget.linkText" />
      </a>
    );
  };

  const renderBadge = () => {
    return (
      <div className={css.countBadge}>
        <Badge>
          <FormattedMessage
            id="ui-dashboard.simpleSearch.widget.nFoundBadge"
            values={{ total: data?.total }}
          />
        </Badge>
      </div>
    );
  };

  const displayWidgetBody = () => {
    if (errorState.isError) {
      return (
        <ErrorBanner
          viewErrorHandler={
            () => onError(errorState.errorMessage, errorState.errorStack)
          }
        />
      );
    }

    if (widgetsLoading) {
      return <span className={css.spinner}><Spinner /></span>;
    }

    if (!data?.results?.length) {
      return (
        <>
          {renderBadge()}
          <FormattedMessage id="ui-dashboard.simpleSearch.widget.noResultsFound" />
        </>
      );
    }
    return (
      <>
        {renderBadge()}
        <SimpleTable
          key={`simple-table-${widget.id}`}
          columns={columns}
          data={simpleTableData}
          widgetId={widget.id}
        />
      </>
    );
  };

  return (
    <>
      {displayWidgetBody()}
      <WidgetFooter
        key={`widget-footer-${widget.id}`}
        onRefresh={() => refetch()}
        rightContent={urlLinkButton()}
        timestamp={timestamp}
        widgetId={widget.id}
        widgetName={widget.name}
      />
    </>
  );
};
export default SimpleSearch;
SimpleSearch.propTypes = {
  onError: PropTypes.func.isRequired,
  widget: PropTypes.shape({
    configuration: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  widgetDef: PropTypes.object.isRequired,
};
