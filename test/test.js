// TODO:
// 1. Test blockBuilder
// 2. Test getBlocks

import { expect } from 'chai';
// import * as sinon from 'sinon';

import { SheetHelper } from '../src/SheetHelper';

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
    expect(helper.memo.headerValues).is.deep.equal([['', '', '']]);
    expect(helper.memo.dataValues).is.deep.equal([]);
  });

  it('Should init default', () => {
    expect(new SheetHelper()).is.exist; // eslint-disable-line
    expect(new SheetHelper().sheetName).is.equal('Sheet 1');
    expect(new SheetHelper().numHeaders).is.equal(0);
    expect(new SheetHelper().fields).is.deep.equal(['A']);
    expect(new SheetHelper().memo.headerValues).is.deep.equal([]);
    expect(new SheetHelper().memo.dataValues).is.deep.equal([]);
    expect(new SheetHelper().memo.rowDataColl).is.deep.equal([]);
  });

  it('Can be use array or string for fields', () => {
    expect(new SheetHelper({ fields: ['x', 'y', 'z'] }).fields).is.deep.equal(['x', 'y', 'z']);
    expect(new SheetHelper({ fields: 'a, b , c' }).fields).is.deep.equal(['a', 'b', 'c']);
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

    expect(helper.memo.headerValues).is.deep.equal([
      ['Column A', 'Column B', 'Column C'],
    ]);

    expect(helper.memo.dataValues).is.deep.equal([
      ['a', '1', true],
      ['b', '2', false],
    ]);

    expect(helper.memo.rowDataColl).is.not.equal(data);
    expect(helper.memo.rowDataColl).is.deep.equal(data);
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

    expect(helper.toRowValuesColl(data), 'Without headers present, appears default headers on top').is.deep.equal([
      ['', '', ''],
      ['a', '1', true],
      ['b', '2', false],
    ]);

    expect(helper.memo.headerValues).is.deep.equal([
      ['', '', ''],
    ]);

    expect(helper.toRowValuesColl(data, headerValues), 'Use presented headers').is.deep.equal([
      ['Column A', 'Column B', 'Column C'],
      ['a', '1', true],
      ['b', '2', false],
    ]);

    expect(helper.memo.headerValues).is.deep.equal([
      ['Column A', 'Column B', 'Column C'],
    ]);

    expect(helper.toRowValuesColl(data), 'Use memoized headers from previous call').is.deep.equal([
      ['Column A', 'Column B', 'Column C'],
      ['a', '1', true],
      ['b', '2', false],
    ]);

    expect(helper.memo.headerValues).is.deep.equal([
      ['Column A', 'Column B', 'Column C'],
    ]);

    expect(helper.memo.dataValues).is.deep.equal([
      ['a', '1', true],
      ['b', '2', false],
    ]);
  });

  it('Should work with zero numHeaders', () => {
    const a = [
      ['a', '1', true],
      ['b', '2', false],
    ];

    const data = [
      {
        rowId: 1,
        A: 'a',
        B: '1',
        C: true,
      },
      {
        rowId: 2,
        A: 'b',
        B: '2',
        C: false,
      },
    ];

    const options = { fields: 'A, B, C', numHeaders: 0 };
    expect(new SheetHelper(options).toRowDataColl(a)).is.deep.equal(data);
    expect(new SheetHelper(options).toRowValuesColl(data)).is.deep.equal(a);
  });
});
