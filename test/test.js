// TODO:
// 1. Test blockBuilder
// 2. Test getBlocks

import { expect } from 'chai';
// import * as sinon from 'sinon';

import SheetHelper from '../src/main'; // eslint-disable-line

let helper;
describe('Test', () => {
  beforeEach(() => {
    const options = {
      sheetName: 'TestName',
      numHeaders: 1,
      fields: [
        'A',
        'B',
        'C',
      ],
    };

    helper = new SheetHelper(options);
  });

  it('Should custom init', () => {
    expect(helper).is.exist; // eslint-disable-line
    expect(helper.headerValues).is.deep.equal([['', '', '']]);
    expect(helper.dataValues).is.deep.equal([]);
  });

  it('Should init default', () => {
    expect(new SheetHelper()).is.exist; // eslint-disable-line
    expect(new SheetHelper().headerValues).is.deep.equal([]);
    expect(new SheetHelper().dataValues).is.deep.equal([]);
  });

  it('firstRow', () => {
    expect(helper.firstRow).is.equal(2);
  });

  it('findColumnId', () => {
    expect(helper.findColumnId('A')).is.equal(1);
    expect(helper.findColumnId('B')).is.equal(2);
    expect(helper.findColumnId('C')).is.equal(3);
    expect(helper.findColumnId('none')).is.not.exist; // eslint-disable-line
  });

  it('getField', () => {
    expect(helper.getField(0)).is.equal('A');
    expect(helper.getField(1)).is.equal('B');
    expect(helper.getField(2)).is.equal('C');
    expect(helper.getField(1100)).is.not.exist; // eslint-disable-line
  });

  it('toRowData', () => {
    expect(helper.toRowData(['1', '2', '3'])).is.deep.equal({ A: '1', B: '2', C: '3' });
    expect(helper.toRowData(['1', '2', '3'])).is.deep.equal({ A: '1', B: '2', C: '3' });
    expect(helper.toRowData(['1', '2', '3', '4', '5'])).is.deep.equal({ A: '1', B: '2', C: '3' });
    expect(helper.toRowData(['', '2'])).is.deep.equal({ A: '', B: '2' });
    expect(helper.toRowData([''])).is.deep.equal({ A: '' });
    expect(helper.toRowData([])).is.deep.equal({});
  });

  it('toRowValues', () => {
    const backAndForth = v => helper.toRowValues(helper.toRowData(v));
    expect(backAndForth(['1', '2', '3'])).is.not.equal(['1', '2', '3']);
    expect(backAndForth(['1', '2', '3'])).is.deep.equal(['1', '2', '3']);

    expect(helper.toRowValues({ A: '1', B: '2', C: '3' })).is.deep.equal(['1', '2', '3']);
    expect(helper.toRowValues({ invalid: 'text' })).is.deep.equal(['', '', '']);
    expect(helper.toRowValues({})).is.deep.equal(['', '', '']);
  });

  it('toRowDataColl', () => {
    const a = [
      ['Column A', 'Column B', 'Column C'],
      ['a', '1', true],
      ['b', '2', false],
    ];

    const data = [
      {
        rowId: 2,
        A: 'a',
        B: '1',
        C: true,
      },
      {
        rowId: 3,
        A: 'b',
        B: '2',
        C: false,
      },
    ];

    expect(helper.toRowDataColl(a)).is.deep.equal(data);

    expect(helper.headerValues).is.deep.equal([
      ['Column A', 'Column B', 'Column C'],
    ]);

    expect(helper.dataValues).is.deep.equal([
      ['a', '1', true],
      ['b', '2', false],
    ]);

    expect(helper.dataColl).is.not.equal(data);
    expect(helper.dataColl).is.deep.equal(data);
  });

  it('toRowValuesColl', () => {
    const headerValues = [
      ['Column A', 'Column B', 'Column C'],
    ];

    const data = [
      {
        rowId: 2,
        A: 'a',
        B: '1',
        C: true,
      },
      {
        rowId: 3,
        A: 'b',
        B: '2',
        C: false,
      },
    ];

    helper.headerValues = headerValues;
    expect(helper.toRowValuesColl(data)).is.deep.equal([
      ['Column A', 'Column B', 'Column C'],
      ['a', '1', true],
      ['b', '2', false],
    ]);

    expect(helper.headerValues).is.deep.equal([
      ['Column A', 'Column B', 'Column C'],
    ]);

    expect(helper.dataValues).is.deep.equal([
      ['a', '1', true],
      ['b', '2', false],
    ]);
  });
});
