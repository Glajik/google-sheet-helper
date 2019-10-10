/* eslint-disable no-underscore-dangle */

import findIndex from 'lodash/findIndex';
import isArray from 'lodash/isArray';
import isEqual from 'lodash/isEqual';
import './arrayfill_polyfill';

/**
 * @class
 * Provide more convient work with specified sheet
 */
class SheetHelper {
  constructor(options = {}) {
    const {
      sheetName,
      numHeaders,
      fields,
    } = options;

    this.sheetName = sheetName || 'Sheet 1';
    this.numHeaders = numHeaders || 0;

    if (typeof fields === 'string') {
      this.fields = fields.split(',').map(f => f.trim());
    } else if (fields instanceof Array) {
      this.fields = fields;
    } else {
      this.fields = ['A'];
    }

    // prefil default
    const headers = new Array(this.numHeaders).fill('');
    this.memo = {
      values: [],
      headerValues: headers.map(() => new Array(this.fields.length).fill('')),
      dataValues: [],
      rowDataColl: [],
    };
  }

  /**
   * Used only for range values
   * @param {*} values Nested arrays representing range values
   */
  memoize(values) {
    if (isEqual(values, this.memo.values)) return;
    const cloned = this.clone(values);
    this.memo.values = cloned;
    this.memo.headerValues = cloned.slice(0, this.numHeaders);
    this.memo.dataValues = cloned.slice(this.numHeaders);
  }

  /**
   * @returns first data row number after headers
   */
  get firstRow() {
    return this.numHeaders + 1;
  }

  toRowData(values) {
    const fn = (acc, value, index) => {
      const field = this.getField(index);
      if (!field) {
        return acc;
      }
      return { ...acc, [field]: value };
    };
    return values.reduce(fn, {});
  }

  /**
   * Convert rowData object to array of row values
   * @return Array
   * @param {Object} rowData index of row, started from 1
   */
  toRowValues(rowData) {
    const fn = (acc, field) => {
      const value = rowData[field];
      if (value === undefined) {
        return [...acc, ''];
      }
      return [...acc, value];
    };
    return this.fields.reduce(fn, []);
  }

  /**
   * Convert range values to collection of rowData.
   * Each row contains the row index rowId started from 1.
   * @param {array} values range values
   * @returns array of row objects
   */
  toRowDataColl(values) {
    // return chached result
    if (isEqual(values, this.memo.values)) return this.memo.rowDataColl;

    const dataValues = values.slice(this.numHeaders);
    const rowDataColl = [];
    const valuesCount = dataValues.length;
    const fieldsCount = this.fields.length;

    for (let i = 0; i < valuesCount; i++) { // eslint-disable-line no-plusplus
      const rowData = {};
      for (let j = 0; j < fieldsCount; j++) { // eslint-disable-line no-plusplus
        const field = this.getField(j);
        rowData[field] = dataValues[i][j];
      }
      rowData.rowId = i + 1 + this.numHeaders;
      rowDataColl.push(rowData);
    }
    // memoization
    this.memoize(values);
    this.memo.rowDataColl = this.clone(rowDataColl);
    return rowDataColl;
  }

  /**
   * @returns Nested arrays, which represent a rows and columns
   * @param {*} rowDataColl Collection of rowData object
   * @param {*} headerValues If present, output has this values in the top
   */
  toRowValuesColl(rowDataColl, headerValues) {
    const cloned = this.clone(rowDataColl);
    const dataCollCount = cloned.length;
    const fieldsCount = this.fields.length;

    const dataValues = [];
    for (let i = 0; i < dataCollCount; i++) { // eslint-disable-line no-plusplus
      const rowData = cloned[i];
      const rowValues = [];
      for (let j = 0; j < fieldsCount; j++) { // eslint-disable-line no-plusplus
        const field = this.getField(j);
        const value = rowData[field];
        if (value === undefined) {
          rowValues.push('');
        }
        rowValues.push(value);
      }
      dataValues.push(rowValues);
    }

    // memoization
    this.memo.rowDataColl = cloned;
    const oldHeaderValues = this.memo.headerValues;
    // eslint-disable-next-line max-len
    const values = isArray(headerValues) ? [...headerValues, ...dataValues] : [...oldHeaderValues, ...dataValues];
    this.memoize(values);
    return values;
  }

  /**
   * find column id by name
   * @return index of column started from 1
   * @param {String} field FieldName
   */
  findColumnId(field) {
    const index = findIndex(this.fields, v => v === field);
    const column = index + 1;
    if (index < 0) {
      return;
    }
    // eslint-disable-next-line consistent-return
    return column;
  }

  /**
   * get field name by index
   * @param {*} index index in array
   */
  getField(index) {
    return this.fields[index];
  }

  /**
   * Update specified row with rowData object.
   * rowData object can consist part of whole row data
   * and only this part be updated
   * @return {Array} new row values
   * @param {Array} values old row values
   * @param {Object} dataToUpdate rowData object
   */
  updateRow(values, dataToUpdate) {
    const { getField } = this;
    const newValues = values.reduce((acc, value, index) => {
      // get field by index
      const field = getField(index);
      // get field by index
      const newValue = dataToUpdate[field];
      if (newValue === undefined) {
        return [...acc, value];
      }
      return [...acc, newValue];
    }, []);

    return newValues;
  }

  // eslint-disable-next-line class-methods-use-this
  blockBuilder(acc, { rowId }) {
    const [first, ...rest] = acc;
    // init acc
    if (!first) {
      return [{ rowId, count: 1 }];
    }

    // if current rowId is sequence - modify count of first element
    const { count } = first;
    if (first.rowId + count === rowId) {
      return [{ rowId: first.rowId, count: count + 1 }, ...rest];
    }

    // sequence break - add new element
    return [{ rowId, count: 1 }, first, ...rest];
  }

  /**
   * @returns a list in which rowId is first row in sequence
   * and count is the number of lines that are not interrupted by the predicate are
   * specified. Rows that match the predicate are not included in any block.
   * @param {*} data
   * @param {Function} predicate
   */
  getBlocks(data, predicate) {
    const filtered = data.filter(predicate);
    const blocks = filtered.reduce(this.blockBuilder, []);
    return blocks;
  }

  clone(objectToBeCloned) {
    // Basis.
    if (!(objectToBeCloned instanceof Object)) {
      return objectToBeCloned;
    }

    let objectClone;

    // Filter out special objects.
    const Constructor = objectToBeCloned.constructor;
    switch (Constructor) {
      // Implement other special objects here.
      case RegExp:
        objectClone = new Constructor(objectToBeCloned);
        break;
      case Date:
        objectClone = new Constructor(objectToBeCloned.getTime());
        break;
      default:
        objectClone = new Constructor();
    }

    // Clone each property.
    for (let prop in objectToBeCloned) { objectClone[prop] = this.clone(objectToBeCloned[prop]) } // eslint-disable-line

    return objectClone;
  }
}

export default SheetHelper;
