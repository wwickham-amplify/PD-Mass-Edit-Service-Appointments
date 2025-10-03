import LightningDatatable from "lightning/datatable";
import lookupTemplate from "./lookupTemplate.html";
import lookupTemplateEdit from "./lookupTemplateEdit.html";
import picklistTemplate from "./picklistTemplate.html";
import picklistTemplateEdit from "./picklistTemplateEdit.html";
//import multiSelectPicklistTemplate from "./customPicklist.html";
//import dateTemplate from "./customNumberEdit.html";
//import customPicklistEditTemplate from "./customPicklistEdit.html";

export default class CustomServiceAppointmentsDataTable extends LightningDatatable {
    static customTypes = {
        lookupColumn: {
            template: lookupTemplate,
            editTemplate: lookupTemplateEdit,
            standardCellLayout: true,
            typeAttributes: [ 'recordId', 'fieldApiName', 'nameField' ],
        },
        picklistColumn: {
            template: picklistTemplate,
            editTemplate: picklistTemplateEdit,
            standardCellLayout: true,
            typeAttributes: ["options"]
        }
        /*lookupColumn: {
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
        }*/
    };
}