const comparatorList = [
  'isNull',
  'isNotNull',
  'isSet',
  'isNotSet',
  'isEmpty',
  'isNotEmpty',
];
export default function isComparatorPresent(comparator) {
  return comparatorList.includes(comparator);
}
