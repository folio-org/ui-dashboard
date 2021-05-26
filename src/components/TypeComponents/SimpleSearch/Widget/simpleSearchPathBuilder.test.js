import '@folio/stripes-erm-components/test/jest/__mock__';
import tokens from '../../../../tokens';
import simpleSearchPathBuilder from './simpleSearchPathBuilder';

// Mock the stripes object we use for tokens
const stripes = {
  user: {
    user: {
      id: '12345'
    }
  }
};

const widgetDef = {
  'baseUrl':'/erm/sas',
  'filters': {
    'columns': [
      {
        'name':'agreementName',
        'label': 'Agreement name',
        'filterPath':'name',
        'valueType': 'String',
        'comparators': ['==', '!=', '=~', '!~']
      },
      {
        'name':'agreement',
        'label': 'Agreement',
        'filterPath':'id',
        'valueType': 'UUID',
        'resource': 'agreement',
        'comparators': ['==', '!=']
      },
      {
        'name':'agreementStatus',
        'label': 'Agreement status',
        'filterPath':'agreementStatus.value',
        'valueType': 'Enum',
        'enumValues': [
          { 'value': 'active', 'label': 'Active' },
          { 'value': 'closed', 'label': 'Closed' },
          { 'value': 'draft', 'label': 'Draft' },
          { 'value': 'in_negotiation', 'label': 'In negotiation' },
          { 'value': 'requested', 'label': 'Requested' }
        ],
        'comparators': ['==', '!=']
      },
      {
        'name':'startDate',
        'label': 'Start date',
        'filterPath':'startDate',
        'valueType': 'Date',
        'comparators': ['==', '!=', '>=', '<=', 'isSet', 'isNotSet']
      },
      {
        'name':'endDate',
        'label': 'End date',
        'filterPath':'endDate',
        'valueType': 'Date',
        'comparators': ['==', '!=', '>=', '<=', 'isSet', 'isNotSet']
      },
      {
        'name':'cancellationDeadline',
        'label': 'Cancellation deadline',
        'filterPath':'cancellationDeadline',
        'valueType': 'Date',
        'comparators': ['==', '!=', '>=', '<=', 'isSet', 'isNotSet']
      },
      {
        'name':'internalContact',
        'label': 'Internal contact',
        'filterPath':'contacts.user.id',
        'valueType': 'UUID',
        'resource': 'user',
        'comparators': ['==', '!=']
      },
      {
        'name':'tags',
        'label': 'Tags',
        'filterPath':'tags.value',
        'valueType': 'String',
        'comparators': ['==', '!=', '=~', '!~']
      },
      {
        'name':'isPerpetual',
        'label': 'Is perpetual',
        'filterPath':'isPerpetual.value',
        'valueType': 'Enum',
        'enumValues': [
          { 'value': 'yes', 'label': 'Yes' },
          { 'value': 'no', 'label': 'No' }
        ],
        'comparators': ['==', '!=']
      },
      {
        'name': 'hasItems',
        'label': 'Has agreement lines',
        'filterPath': 'items',
        'valueType': 'Array',
        'comparators': ['isEmpty', 'isNotEmpty']
      }
    ]
  },
  'sort': {
    'columns': [
      {
        'name':'id',
        'label': 'Id',
        'sortPath':'id',
        'sortTypes': ['asc', 'desc']
      },
      {
        'name':'agreementName',
        'label': 'Name',
        'sortPath':'name',
        'sortTypes': ['asc', 'desc']
      },
      {
        'name':'agreementStatus',
        'label': 'Status',
        'sortPath':'agreementStatus.label',
        'sortTypes': ['asc', 'desc']
      },
      {
        'name':'startDate',
        'sortPath':'startDate',
        'label': 'Start date',
        'sortTypes': ['asc', 'desc']
      },
      {
        'name':'endDate',
        'sortPath':'endDate',
        'label': 'End date',
        'sortTypes': ['asc', 'desc']
      },
      {
        'name':'cancellationDeadline',
        'sortPath':'cancellationDeadline',
        'label': 'Cancellation deadline',
        'sortTypes': ['asc', 'desc']
      }
    ]
  }
};

const widgetConfSort = {
  'sortColumn': {
    'name': 'id',
    'sortType': 'asc'
  }
};

const widgetConfStatus = {
  'sortColumn': {
    'name': 'id',
    'sortType': 'asc'
  },
  'filterColumns': [{
    'name': 'agreementStatus',
    'rules': [{
      'comparator': '==',
      'filterValue': 'draft'
    }]
  }]
};

const widgetConfStatusTwoValues = {
  'sortColumn': {
    'name': 'id',
    'sortType': 'asc'
  },
  'filterColumns': [{
    'name': 'agreementStatus',
    'rules': [{
      'comparator': '==',
      'filterValue': 'draft'
    }, {
      'comparator': '!=',
      'filterValue': 'closed'
    }]
  }]
};

const widgetConfStatusAndName = {
  'sortColumn': {
    'name': 'id',
    'sortType': 'asc'
  },
  'filterColumns': [{
    'name': 'agreementStatus',
    'rules': [{
      'comparator': '==',
      'filterValue': 'draft'
    }]
  },
  {
    'name': 'agreementName',
    'rules': [{
      'comparator': '==',
      'filterValue': 'wibble'
    }]
  }]
};

const widgetConfSpecialComparator = {
  'filterColumns': [{
    'name': 'cancellationDeadline',
    'rules': [{
      'comparator': 'isNotSet'
    }]
  }]
};

const widgetConfToday = {
  'filterColumns': [{
    'name': 'startDate',
    'rules': [{
      'comparator': '==',
      'filterValue': '{{currentDate}}'
    }]
  }]
};

const widgetConfMe = {
  'filterColumns': [{
    'name': 'internalContact',
    'rules': [{
      'comparator': '!=',
      'filterValue': '{{currentUser}}'
    }]
  }]
};

describe('simpleSearchPathBuilder', () => {
  test('simpleSearchPathBuilder function works as expected for just sort', () => {
    const output = simpleSearchPathBuilder(widgetDef, widgetConfSort, stripes);
    expect(output).toBe('erm/sas?sort=id;asc&stats=true');
  });

  test('simpleSearchPathBuilder function works as expected for a single value', () => {
    const output = simpleSearchPathBuilder(widgetDef, widgetConfStatus, stripes);
    expect(output).toBe('erm/sas?filters=agreementStatus.value==draft&sort=id;asc&stats=true');
  });

  test('simpleSearchPathBuilder function works as expected for two values on one filter', () => {
    const output = simpleSearchPathBuilder(widgetDef, widgetConfStatusTwoValues, stripes);
    expect(output).toBe('erm/sas?filters=agreementStatus.value==draft%7C%7CagreementStatus.value!=closed&sort=id;asc&stats=true');
  });

  test('simpleSearchPathBuilder function works as expected for one values on two filters', () => {
    const output = simpleSearchPathBuilder(widgetDef, widgetConfStatusAndName, stripes);
    expect(output).toBe('erm/sas?filters=agreementStatus.value==draft&filters=name==wibble&sort=id;asc&stats=true');
  });

  test('simpleSearchPathBuilder function works as expected with special comparators', () => {
    const output = simpleSearchPathBuilder(widgetDef, widgetConfSpecialComparator, stripes);
    expect(output).toBe('erm/sas?filters=cancellationDeadline%20isNotSet&stats=true');
  });

  test('simpleSearchPathBuilder function works as expected with date tokens', () => {
    const today = tokens('{{currentDate}}', stripes);
    const output = simpleSearchPathBuilder(widgetDef, widgetConfToday, stripes);
    expect(output).toBe(`erm/sas?filters=startDate==${today}&stats=true`);
  });

  test('simpleSearchPathBuilder function works as expected with user tokens', () => {
    const me = tokens('{{currentUser}}', stripes);
    const output = simpleSearchPathBuilder(widgetDef, widgetConfMe, stripes);
    expect(output).toBe(`erm/sas?filters=contacts.user.id!=${me}&stats=true`);
  });
});
