import { LightningElement, api } from 'lwc';

export default class CustomLookupInput extends LightningElement {
    @api value;
    @api fieldName;

    @api get validity() {
        return { valid: true };
    }

    @api showHelpMessageIfInvalid() {}

    handleChange(event) {
        this.value = event.detail.value[0];
    }

    connectedCallback() {
        console.log(this.fieldName);
    }

}