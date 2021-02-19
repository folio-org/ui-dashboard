import React, { useMemo } from 'react';
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
  const returnWidth = Math.min(maxWidth, cellLength * magicSpacing);
  return returnWidth;
};

const SimpleTable = ({ columns, data }) => {
  const resizedCols = useMemo(() => columns.map(c => ({ ...c, width: getColumnWidth(data, c.accessor, c.Header) })), [columns]);
  return (
    <ResizedTable columns={resizedCols} data={data} />
  );
};

const ResizedTable = ({ columns, data }) => {
  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 150,
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
    Render the UI for your table
    - react-table doesn't have UI, it's headless. We just need to put the react-table props from the Hooks, and it will do its magic automatically
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
                  {row.cells.map(cell => {
                    return (
                      <div {...cell.getCellProps()} className={css.td}>
                        {cell.render('Cell')}
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
