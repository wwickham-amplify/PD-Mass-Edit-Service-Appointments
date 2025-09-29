import LightningDatatable from 'lightning/datatable';
import lookupColumn from './lookupColumn.html';
import picklistColumn from './picklistColumn.html';
import pickliststatic from './pickliststatic.html';
import customName from './customName.html';
import multiselectpicklistColumn from './multiselectpicklistColumn.html';
import multiselectpicklistColumnGrade from './multiselectpicklistColumnGrade.html';
 
export default class LWCLookupCustomDatatableType extends LightningDatatable {
    static customTypes = {
        lookupColumn: {
            template: lookupColumn,
            standardCellLayout: true,
            typeAttributes: ['value', 'fieldName', 'object', 'context', 'name', 'fields', 'target', 'edit']
        },
        picklistColumn: {
            template: pickliststatic,
            editTemplate: picklistColumn,
            standardCellLayout: true,
            typeAttributes: ['label', 'placeholder', 'options', 'value', 'context', 'variant','name']
        },
        customName: {
            template: customName,
            standardCellLayout: true,
            typeAttributes: ["accountName"],
          },
          multiselectpicklistColumn: {
            template: multiselectpicklistColumn,
            editTemplate: multiselectpicklistColumn,
            standardCellLayout: true,
            typeAttributes: ['label', 'placeholder', 'options', 'value', 'context', 'variant','name']
        },
        multiselectpicklistColumnGrade: {
            template: multiselectpicklistColumnGrade,
            editTemplate: multiselectpicklistColumnGrade,
            standardCellLayout: true,
            typeAttributes: ['label', 'placeholder', 'options', 'value', 'context', 'variant','name']
        }
    };
}