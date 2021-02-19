import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { get } from 'lodash';
import { useTable, useBlockLayout } from 'react-table';
import css from './SimpleTable.css';

const getColumnWidth = (rows, accessor, headerText) => {
  const maxWidth = 400;
  const magicSpacing = 10;

  const cellLength = Math.max(
    ...rows.map(row => (get(row, accessor) || '').length),
    headerText.length,
  );

  return Math.min(maxWidth, cellLength * magicSpacing);
};

const SimpleTable = ({ columns, data, widgetId }) => {
  const resizedCols = useMemo(
    () => columns.map(
      c => ({ ...c, width: getColumnWidth(data, c.accessor, c.Header) })
    ), [columns, data]
  );
  return (
    <ResizedTable columns={resizedCols} data={data} widgetId={widgetId} />
  );
};

const ResizedTable = ({ columns, data, widgetId }) => {
  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 30,
      width: 150,
      maxWidth: 400,
    }),
    []
  );

  // Use the useTable Hook to send the columns and data to build the table
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({
    columns,
    data,
    defaultColumn
  }, useBlockLayout);

  /*
    Render the UI for our table
    react-table doesn't have UI, it's headless.
  */
  return (
    <div className={css.tableContainer}>
      <div {...getTableProps()} className={css.table}>
        <div>
          {headerGroups.map(headerGroup => (
            <div {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <div {...column.getHeaderProps()} className={css.headerCell}>
                  {column.render('Header')}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div {...getTableBodyProps()}>
          {rows.map(
            (row, i) => {
              prepareRow(row);
              return (
                <div {...row.getRowProps()} className={i % 2 === 0 ? css.evenRow : css.oddRow}>
                  {row.cells.map((cell, j) => {
                    return (
                      <div
                        {...cell.getCellProps()}
                        className={css.td}
                      >
                        {cell.render(
                          'Cell',
                          { key: `simple-table-${widgetId}-row-${i}-col-${j}` }
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleTable;

const propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({
    Header: PropTypes.string.isRequired,
    accessor: PropTypes.string.isRequired
  })),
  data: PropTypes.arrayOf(PropTypes.object),
  widgetId: PropTypes.string.isRequired
};

SimpleTable.propTypes = propTypes;
ResizedTable.propTypes = propTypes;
