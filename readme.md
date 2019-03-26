<a name="SheetHelper"></a>

## SheetHelper
Provide more convient work with specified sheet

**Kind**: global class  

* [SheetHelper](#SheetHelper)
    * _instance_
        * [.firstRow](#SheetHelper+firstRow) ⇒
        * [.toRowValues(rowData)](#SheetHelper+toRowValues) ⇒
        * [.toRowDataColl(values)](#SheetHelper+toRowDataColl) ⇒
        * [.findColumnId(field)](#SheetHelper+findColumnId) ⇒
        * [.getField(index)](#SheetHelper+getField)
        * [.updateRow(values, dataToUpdate)](#SheetHelper+updateRow) ⇒ <code>Array</code>
        * [.updateDataRangeValues(values, rowDataColl)](#SheetHelper+updateDataRangeValues)
    * _static_
        * [.getBlocks(data, predicate)](#SheetHelper.getBlocks) ⇒

<a name="SheetHelper+firstRow"></a>

### sheetHelper.firstRow ⇒
**Kind**: instance property of [<code>SheetHelper</code>](#SheetHelper)  
**Returns**: first data row number after headers  
<a name="SheetHelper+toRowValues"></a>

### sheetHelper.toRowValues(rowData) ⇒
Convert rowData object to array of row values

**Kind**: instance method of [<code>SheetHelper</code>](#SheetHelper)  
**Returns**: Array  
**Params**

- rowData <code>Object</code> - index of row, started from 1

<a name="SheetHelper+toRowDataColl"></a>

### sheetHelper.toRowDataColl(values) ⇒
Convert array of array of values to array of row object.
Each row contains the row index rowId started from 1.

**Kind**: instance method of [<code>SheetHelper</code>](#SheetHelper)  
**Returns**: array of row objects  
**Params**

- values <code>array</code> - array of row's arrays

<a name="SheetHelper+findColumnId"></a>

### sheetHelper.findColumnId(field) ⇒
find column id by name

**Kind**: instance method of [<code>SheetHelper</code>](#SheetHelper)  
**Returns**: index of column started from 1  
**Params**

- field <code>String</code> - FieldName

<a name="SheetHelper+getField"></a>

### sheetHelper.getField(index)
get field name by index

**Kind**: instance method of [<code>SheetHelper</code>](#SheetHelper)  
**Params**

- index <code>\*</code> - index in array

<a name="SheetHelper+updateRow"></a>

### sheetHelper.updateRow(values, dataToUpdate) ⇒ <code>Array</code>
Update specified row with rowData object.
rowData object can consist part of whole row data
and only this part be updated

**Kind**: instance method of [<code>SheetHelper</code>](#SheetHelper)  
**Returns**: <code>Array</code> - new row values  
**Params**

- values <code>Array</code> - old row values
- dataToUpdate <code>Object</code> - rowData object

<a name="SheetHelper+updateDataRangeValues"></a>

### sheetHelper.updateDataRangeValues(values, rowDataColl)
Update all sheet except header rows

**Kind**: instance method of [<code>SheetHelper</code>](#SheetHelper)  
**Params**

- values
- rowDataColl <code>Array</code> - array of rowData objects

<a name="SheetHelper.getBlocks"></a>

### SheetHelper.getBlocks(data, predicate) ⇒
**Kind**: static method of [<code>SheetHelper</code>](#SheetHelper)  
**Returns**: a list in which rowId is first row in sequence
and count is the number of lines that are not interrupted by the predicate are
specified. Rows that match the predicate are not included in any block.  
**Params**

- data <code>\*</code>
- predicate <code>function</code>

