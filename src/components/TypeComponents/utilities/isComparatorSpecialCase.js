const comparatorList = [
  'isNull',
  'isNotNull',
  'isSet',
  'isNotSet',
  'isEmpty',
  'isNotEmpty',
];
export default function isComparatorSpecialCase(comparator) {
  return comparatorList.includes(comparator);
}
