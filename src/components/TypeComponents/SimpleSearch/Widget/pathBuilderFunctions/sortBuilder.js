const sortBuilder = (sortColumn, defSortColumns) => {
  let sortString = '';
  if (sortColumn) {
    sortString += 'sort=';
    // At this point we should have either '&sort=' or 'sort='
    const sortPath = (defSortColumns.find(sc => sc.name === sortColumn.name))?.sortPath;
    sortString += `${sortPath};${sortColumn.sortType}`;
  }

  return sortString;
};

export default sortBuilder;
