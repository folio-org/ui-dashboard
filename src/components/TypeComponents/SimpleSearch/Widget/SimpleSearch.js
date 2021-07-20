import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import moment from 'moment';
import { useQuery } from 'react-query';
import { useOkapiKy, useStripes } from '@folio/stripes/core';
import { Badge } from '@folio/stripes/components';
import pathBuilder from './simpleSearchPathBuilder';
import columnParser from './simpleSearchColumnParser';
import SimpleTable from '../../../SimpleTable';
import { WidgetFooter } from '../../../Widget';
import css from './SimpleSearch.css';
import { ErrorBanner } from '../../../ErrorComponents';

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
  const columns = columnParser({ widgetDef, widgetConf });

  // This stores the WIDGET-LEVEL error state, ready to pass to the canvas if required
  const [errorState, setErrorState] = useState({
    isError: false,
    errorMessage: null,
    errorStack: null
  });

  const ky = useOkapiKy();
  // We need to pass the stripes object into the pathBuilder, so it can use that for currentUser token
  const stripes = useStripes();

  // TODO Refactor to its own function component
  const errorParser = async (err) => {
    let errorMessage;
    let errBody;

    /* For HTTPError we assume error.response returns a Promise */
    if (err.name.toLowerCase() === 'httperror') {
      /*
       * Due to the nature of okapi endpoint calls, err.response
       * could comprise of JSON data OR string data. Read in as Blob
       * and deal with either case separately
       */
      const errBlob = await err.response?.blob();
      const errBlobText = await errBlob.text();

      if (errBlob.type === 'application/json') {
        const errJson = JSON.parse(errBlobText);
        errorMessage = intl.formatMessage(
          { id: 'ui-dashboard.httpError' },
          {
            errorCode: err.response?.status,
            errorText: `${err.response?.statusText}\n${errJson?.message}`
          }
        );
        errBody = errJson.stackTrace?.join('\n');
      } else {
        // Otherwise we've probably got a string, just display errBlobText as the stack
        errorMessage = intl.formatMessage(
          { id: 'ui-dashboard.httpError' },
          {
            errorCode: err.response?.status,
            errorText: err.response?.statusText
          }
        );
        errBody = errBlobText;
      }
    } else {
      errorMessage = err.name;
      errBody = err.message;
    }

    return ({
      isError: true,
      errorMessage,
      errorStack: errBody
    });
  };

  const { data, dataUpdatedAt, refetch } = useQuery(
    // If widget.configuration changes, this should refetch
    ['ui-dashboard', 'simpleSearch', widget.id, widget.configuration],
    //async () => ky(pathBuilder(widgetDef, widgetConf, stripes))
    async () => ky('wibble/wibblewobble')
        .then((res) => {
          return res.json();
        })
        .catch(async err => {
          setErrorState(await errorParser(err));
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

    if (!data?.results?.length) {
      return (
        <>
          {renderBadge()}
          <FormattedMessage id="ui-dashboard.simpleSearch.widget.noResultFound" />
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
  widget: PropTypes.shape({
    configuration: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  widgetDef: PropTypes.object.isRequired,
};
