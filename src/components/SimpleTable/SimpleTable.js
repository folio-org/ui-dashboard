import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { get } from 'lodash';
import { useTable, useFlexLayout } from 'react-table';

import css from './SimpleTable.css';

const RenderWithSize = ({ children, name, sizeMap, setSizeMap }) => {
  const [width, setWidth] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    setWidth(ref.current.clientWidth)

    const currentMaxWidth = sizeMap[name]
    if (!currentMaxWidth || width > currentMaxWidth) {
      const newSizeMap = {...sizeMap};
      newSizeMap[name] = width
      setSizeMap(newSizeMap);
    }
  }, [ref, sizeMap, setSizeMap, width])

  return (
    <div className={css.measuredDivContainer}>
      <div className={css.measuredDiv} ref={ref}>
        {children}
      </div>
    </div>
  );
}

const getColumnWidth = (rows, accessor, headerText) => {
  // Using log so that a column of 255 and two columns of 10 don't end up massively mismatched
  return Math.log(Math.max(
    ...rows.map(row => (get(row, accessor) || '').length || 0),
    headerText.length,
  ));
};


const SimpleTable = ({ columns, data, widgetId }) => {
  const [colWidths, setColWidths] = useState({});
  console.log("ColWidths: %o", colWidths)

  const resizedCols = useMemo(
    () => columns.map(
      (c, i) => {
        return (
          {
            ...c,
            width: colWidths[i] ?? 150,
          }
        );
      }
    ), [columns, colWidths, data]
  );
  return (
    <ResizedTable
      columns={resizedCols}
      colWidths={colWidths}
      data={data}
      setColWidths={setColWidths}
      widgetId={widgetId}
    />
  );
};

const ResizedTable = ({ columns, colWidths, data, setColWidths, widgetId }) => {

  // Use the useTable Hook to send the columns and data to build the table
  const {
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({
    columns,
    data,
  }, useFlexLayout);

  /*
    Render the UI for our table
    react-table doesn't have UI, it's headless.
  */

  const destructuredWidthFunction = (getPropFunc) => {
    // Destructure out styling props so we can use width as flex-basis
    // Abstracted out because logic is same for col header and cell
    const { style: { width, ...otherStyles }, ...otherProps } = getPropFunc();
    return (
      {
        ...otherProps,
        style: {
          ...otherStyles,
          'flexBasis': width,
          'maxWidth': '400px'
        }
      }
    );
  };

  return (
    <div className={css.tableContainer}>
      {
        /*
         * Avoided getTableProps here
         * because it sets a min-width
         * which ruins styling on overlap.
         * Replaced with css.table
         */
      }
      <table className={css.table}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, i) => {
                const columnHeaderProps = destructuredWidthFunction(column.getHeaderProps);
                return (
                  <th
                    {...columnHeaderProps}
                    className={css.headerCell}
                  >
                    <RenderWithSize
                      name={i}
                      sizeMap={colWidths}
                      setSizeMap={setColWidths}
                    >
                      {column.render('Header')}
                    </RenderWithSize>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(
            (row, i) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  className={i % 2 === 0 ? css.evenRow : css.oddRow}
                >
                  {row.cells.map((cell, j) => {
                    const cellProps = destructuredWidthFunction(cell.getCellProps);
                    return (
                      <td
                        {...cellProps}
                        className={css.td}
                      >
                        <RenderWithSize
                          name={j}
                          sizeMap={colWidths}
                          setSizeMap={setColWidths}
                        >
                          {cell.render(
                            'Cell',
                            {
                              key: `simple-table-${widgetId}-row-${i}-col-${j}`,
                            }
                          )}
                        </RenderWithSize>
                      </td>
                    );
                  })}
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SimpleTable;

const propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({
    Header: PropTypes.string.isRequired,
    accessor: PropTypes.string
  })),
  data: PropTypes.arrayOf(PropTypes.object),
  widgetId: PropTypes.string.isRequired
};

SimpleTable.propTypes = propTypes;
ResizedTable.propTypes = propTypes;
