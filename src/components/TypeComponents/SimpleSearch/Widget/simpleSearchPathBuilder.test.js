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
  'resource': 'agreement',
  'results': {
    'columns': [
      {
        'name':'agreementName',
        'label': 'Agreement name',
        'accessPath':'name',
        'valueType': 'Link'
      },
      {
        'name':'startDate',
        'label': 'Start date',
        'accessPath':'startDate',
        'valueType': 'Date'
      },
      {
        'name':'endDate',
        'label': 'End date',
        'accessPath':'endDate',
        'valueType': 'Date'
      },
      {
        'name':'cancellationDeadline',
        'label': 'Cancellation deadline',
        'accessPath':'cancellationDeadline',
        'valueType': 'Date'
      },
      {
        'name':'agreementStatus',
        'label': 'Status',
        'accessPath':'agreementStatus.label',
        'valueType': 'String'
      },
      {
        'name':'renewalPriority',
        'label': 'Renewal priority',
        'accessPath':'renewalPriority.label',
        'valueType': 'String'
      },
      {
        'name': 'internalContacts',
        'label': 'Internal contact(s)'
      },
      {
        'name': 'tags',
        'label': 'Tags',
        'accessPath': 'tags',
        'valueType': 'Array',
        'arrayDisplayPath': 'value'
      },
      {
        'name': 'isPerpetual',
        'label': 'Is perpetual',
        'accessPath': 'isPerpetual.label',
        'valueType': 'String'
      }
    ]
  },
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
          { 'value': 'active' },
          { 'value': 'closed' },
          { 'value': 'draft' },
          { 'value': 'in_negotiation' },
          { 'value': 'requested' }
        ],
        'comparators': ['==', '!=']
      },
      {
        'name':'startDate',
        'label': 'Start date',
        'filterPath':'startDate',
        'valueType': 'Date',
        'comparators': ['==', '!=', '>=', '<=']
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
        'name':'renewalPriority',
        'label': 'Renewal priority',
        'filterPath':'renewalPriority.value',
        'valueType': 'String',
        'comparators': ['==', '!=']
      },
      {
        'name':'internalContact',
        'label': 'Internal contact',
        'filterPath':'contacts.user',
        'valueType': 'UUID',
        'resource': 'user',
        'comparators': ['==']
      },
      {
        'name':'tags',
        'label': 'Tags',
        'filterPath':'tags.value',
        'valueType': 'String',
        'comparators': ['==', '=~']
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
  'matches': {
    'columns': [
      {
        'name': 'agreementName',
        'label': 'Name',
        'accessPath': 'name',
        'default': true
      },
      {
        'name': 'alternativeName',
        'label': 'Alternative name',
        'accessPath': 'alternateNames.name',
        'default': false
      },
      {
        'name': 'description',
        'label': 'Description',
        'accessPath': 'description',
        'default': false
      }
    ],
    'termConfigurable': true
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
      },
      {
        'name':'renewalPriority',
        'label':'Renewal priority',
        'sortPath':'renewalPriority.value',
        'sortTypes': ['asc', 'desc']
      }
    ]
  },
  'configurableProperties': {
    'urlLink': {
      'configurable': true,
      'defValue': '/erm/agreements'
    },
    'numberOfRows': {
      'configurable': true,
      'defValue': 10
    }
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

const widgetConfMatch = {
  'matches': {
    'term': '"%wibble"',
    'matches': {
      'agreementName': false,
      'alternativeName': true
    }
  }
};

const widgetConfMatchNoTerm = {
  'matches': {
    'matches': {
      'agreementName': true,
      'alternativeName': true
    }
  }
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

const widgetConfStatusNameAndMatch = {
  'sortColumn': {
    'name': 'id',
    'sortType': 'asc'
  },
  'matches': {
    'term': 'abc',
    'matches': {
      'agreementName': true,
      'alternativeName': false,
      'description': true
    }
  },
  'filterColumns': [{
    'name': 'agreementStatus',
    'rules': [{
      'comparator': '==',
      'filterValue': 'draft'
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
    expect(output).toBe('erm/sas?sort=id%3Basc&stats=true');
  });

  test('simpleSearchPathBuilder function works as expected for just match', () => {
    const output = simpleSearchPathBuilder(widgetDef, widgetConfMatch, stripes);
    expect(output).toBe('erm/sas?match=alternateNames.name&term=%22%25wibble%22&stats=true');
  });

  test('simpleSearchPathBuilder function works as expected for match without term defined', () => {
    const output = simpleSearchPathBuilder(widgetDef, widgetConfMatchNoTerm, stripes);
    expect(output).toBe('erm/sas?stats=true');
  });

  test('simpleSearchPathBuilder function works as expected for a single value', () => {
    const output = simpleSearchPathBuilder(widgetDef, widgetConfStatus, stripes);
    expect(output).toBe('erm/sas?filters=agreementStatus.value%3D%3Ddraft&sort=id%3Basc&stats=true');
  });

  test('simpleSearchPathBuilder function works as expected for two values on one filter', () => {
    const output = simpleSearchPathBuilder(widgetDef, widgetConfStatusTwoValues, stripes);
    expect(output).toBe('erm/sas?filters=agreementStatus.value%3D%3Ddraft%7C%7CagreementStatus.value!%3Dclosed&sort=id%3Basc&stats=true');
  });

  test('simpleSearchPathBuilder function works as expected for one values on two filters', () => {
    const output = simpleSearchPathBuilder(widgetDef, widgetConfStatusAndName, stripes);
    expect(output).toBe('erm/sas?filters=agreementStatus.value%3D%3Ddraft&filters=name%3D%3Dwibble&sort=id%3Basc&stats=true');
  });

  test('simpleSearchPathBuilder function works as expected for match, filters and sort', () => {
    const output = simpleSearchPathBuilder(widgetDef, widgetConfStatusNameAndMatch, stripes);
    expect(output).toBe('erm/sas?match=name&match=description&term=abc&filters=agreementStatus.value%3D%3Ddraft&sort=id%3Basc&stats=true');
  });

  test('simpleSearchPathBuilder function works as expected with special comparators', () => {
    const output = simpleSearchPathBuilder(widgetDef, widgetConfSpecialComparator, stripes);
    expect(output).toBe('erm/sas?filters=cancellationDeadline%20isNotSet&stats=true');
  });

  test('simpleSearchPathBuilder function works as expected with date tokens', () => {
    const today = tokens('{{currentDate}}', stripes);
    const output = simpleSearchPathBuilder(widgetDef, widgetConfToday, stripes);
    expect(output).toBe(`erm/sas?filters=startDate%3D%3D${today}&stats=true`);
  });

  test('simpleSearchPathBuilder function works as expected with user tokens', () => {
    const me = tokens('{{currentUser}}', stripes);
    const output = simpleSearchPathBuilder(widgetDef, widgetConfMe, stripes);
    expect(output).toBe(`erm/sas?filters=contacts.user!%3D${me}&stats=true`);
  });
});
