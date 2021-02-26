import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import moment from 'moment';

import { useQuery } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';
import { Badge } from '@folio/stripes/components';

import pathBuilder from './simpleSearchPathBuilder';
import columnParser from './simpleSearchColumnParser';

import SimpleTable from '../SimpleTable';
import { WidgetFooter } from '../Widget';
import css from './SimpleSearch.css';

const SimpleSearch = ({
  widget
}) => {
  /*
   * IMPORTANT this code uses react-query.
   * At some point after Stripes' Iris release there is a possibility this will be removed in favour of SWR.
   * A decision has not been made either way yet, so for now I've gone with react-query.
   * Should that happen, the APIs seem quite similar so porting won't be too difficult.
   */

  // At some point these will be versioned, so we might need to switch up logic slightly based on type version
  const widgetDef = JSON.parse(widget.definition.definition);
  const widgetConf = JSON.parse(widget.configuration);
  const columns = columnParser({ widgetDef, widgetConf });

  const ky = useOkapiKy();
  const { data, dataUpdatedAt, refetch } = useQuery(
    ['ui-dashboard', 'simpleSearch', widget.id],
    () => ky(pathBuilder(widgetDef, widgetConf)).json()
  );

  const timestamp = dataUpdatedAt ? moment(dataUpdatedAt).format('hh:mm a') : '';
  const {
    configurableProperties: {
      urlLink
    } = {}
  } = widgetConf;

  const urlLinkButton = () => {
    if (!urlLink) {
      return null;
    }
    return (
      <Link
        className={css.linkText}
        to={urlLink}
      >
        <FormattedMessage id="ui-dashboard.simpleSearch.widget.linkText" />
      </Link>
    );
  };

  return (
    <>
      <div className={css.countBadge}>
        <Badge>
          <FormattedMessage id="ui-dashboard.simpleSearch.widget.nFoundBadge" values={{ total: data?.total }} />
        </Badge>
      </div>
      <SimpleTable
        key={`simple-table-${widget.id}`}
        columns={columns}
        data={useMemo(() => data?.results || [], [data])}
        widgetId={widget.id}
      />
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
    definition: PropTypes.shape({
      definition: PropTypes.string.isRequired
    }).isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired
};
