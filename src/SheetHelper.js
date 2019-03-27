/* eslint-disable no-underscore-dangle */

import findIndex from 'lodash/findIndex';
// import '@babel/polyfill';
import './arrayfill_polyfill';

/**
 * Provide more convient work with specified sheet
 */
// eslint-disable-next-line
export class SheetHelper {
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

    // prefill default header
    const headers = new Array(this.numHeaders).fill('');
    this.headerValues = headers.map(() => new Array(this.fields.length).fill(''));
    this.dataValues = [];
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
   * Convert array of array of values to array of row object.
   * Each row contains the row index rowId started from 1.
   * @param {array} values array of row's arrays
   * @returns array of row objects
   */
  toRowDataColl(values) {
    this.headerValues = values.slice(0, this.numHeaders);
    this.dataValues = values.slice(this.numHeaders);

    const dataColl = [];
    const valuesCount = this.dataValues.length;
    const fieldsCount = this.fields.length;

    for (let i = 0; i < valuesCount; i++) { // eslint-disable-line no-plusplus
      const rowData = {};
      for (let j = 0; j < fieldsCount; j++) { // eslint-disable-line no-plusplus
        const field = this.getField(j);
        rowData[field] = this.dataValues[i][j];
      }
      rowData.rowId = i + 1 + this.numHeaders;
      dataColl.push(rowData);
    }
    this.dataColl = dataColl;
    return this.dataColl;
  }

  toRowValuesColl(dataColl, headerValues = this.headerValues) {
    // this.dataColl = _.cloneDeep(dataColl);
    // this.headerValues = _.cloneDeep(headerValues);
    this.dataColl = this.clone(dataColl);
    this.headerValues = this.clone(headerValues);
    const dataCollCount = dataColl.length;
    const fieldsCount = this.fields.length;

    const dataValues = [];
    for (let i = 0; i < dataCollCount; i++) { // eslint-disable-line no-plusplus
      const rowData = dataColl[i];
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
    this.dataValues = dataValues;
    return [...this.headerValues, ...this.dataValues];
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
