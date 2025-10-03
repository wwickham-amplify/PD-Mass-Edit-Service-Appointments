import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';

export default class CustomLookupDisplay extends LightningElement {
    @api recordId;
    @api nameField;
    recordName;

    @wire(getRecord, { recordId: '$recordId', fields: '$nameField' })
    wiredRecord({ error, data }) {
        if (data) {
            this.recordName = data.fields[this.splitFieldName].value;
        } else if (error) {
            console.log('Error getting record name for record: ' + this.recordId + ' Error message: ', error);
            this.recordName = '';
        }
    }

    get splitFieldName() {
        return this.nameField ? this.nameField.split('.')[1] : null;
    }

    get recordUrl() {
        return this.recordId ? '/' + this.recordId : '';
    }
}
