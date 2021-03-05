import '@folio/stripes-erm-components/test/jest/__mock__';
import moment from 'moment';
import tokens from './tokens';

// Mock the stripes object we use for tokens
const stripes = {
  user: {
    user: {
      id: '12345'
    }
  }
};

const dateFormat1 = 'YYYY-MM-DD';
const dateFormat2 = 'MM/DD/YYYY';

describe('tokens', () => {
  test('token function passes non-token through as expected', () => {
    const output = tokens('this is a test', stripes);
    expect(output).toBe('this is a test');
  });

  test('token function recognises current user', () => {
    const output = tokens('{{currentUser}}', stripes);
    expect(output).toBe(stripes.user.user.id);
  });

  test('token function recognises current date and formats correctly', () => {
    const currentDate = moment(new Date()).startOf('day');
    const output = tokens('{{currentDate}}', stripes);
    expect(output).toBe(currentDate.format(dateFormat1));
  });

  test('token function recognises current date and formats with optional formatting', () => {
    const currentDate = moment(new Date()).startOf('day');
    const output = tokens('{{currentDate}}', stripes, { dateFormat: dateFormat2 });
    expect(output).toBe(currentDate.format(dateFormat2));
  });

  test('token function recognises current date and can deal with adding days', () => {
    const currentDate = moment(new Date()).startOf('day');
    const output = tokens('{{currentDate#3}}', stripes);
    expect(output).toBe(currentDate.add(3, 'd').format(dateFormat1));
  });

  test('token function recognises current date and can deal with subtracting days', () => {
    const currentDate = moment(new Date()).startOf('day');
    const output = tokens('{{currentDate#-13}}', stripes);
    expect(output).toBe(currentDate.add(-13, 'd').format(dateFormat1));
  });

  test('token function recognises current date and can deal with adding weeks', () => {
    const currentDate = moment(new Date()).startOf('day');
    const output = tokens('{{currentDate#5#w}}', stripes);
    expect(output).toBe(currentDate.add(5, 'w').format(dateFormat1));
  });

  test('token function recognises current date and can deal with adding months', () => {
    const currentDate = moment(new Date()).startOf('day');
    const output = tokens('{{currentDate#7#m}}', stripes);
    expect(output).toBe(currentDate.add(7, 'm').format(dateFormat1));
  });

  test('token function recognises current date and can deal with adding weeks', () => {
    const currentDate = moment(new Date()).startOf('day');
    const output = tokens('{{currentDate#9#y}}', stripes);
    expect(output).toBe(currentDate.add(9, 'y').format(dateFormat1));
  });
});
