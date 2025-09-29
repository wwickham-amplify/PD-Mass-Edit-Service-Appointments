import { LightningElement, api, track, wire } from 'lwc';
import getServiceAppointments from '@salesforce/apex/FSL_SA_MASS_Edit.getServiceAppointments';
//import getAccounts from '@salesforce/apex/FSL_SA_MASS_Edit.getAccounts';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { publish, MessageContext } from 'lightning/messageService';
import updateRecords from '@salesforce/apex/FSL_SA_MASS_Edit.updateRecords';
import recordSelected from '@salesforce/messageChannel/selectedRecords__c';
import STATUS_FIELD from '@salesforce/schema/ServiceAppointment.Status';
import SCHEDULING_STATUS_FIELD from '@salesforce/schema/ServiceAppointment.Schedulers_Status__c';
import DATE_TO_SCHEDULE_FIELD from '@salesforce/schema/ServiceAppointment.Date_to_Schedule__c';
import PREF_DATE_FIELD from '@salesforce/schema/ServiceAppointment.Preferred_Training_Date_1__c';
import REQ_START_FIELD from '@salesforce/schema/ServiceAppointment.Required_Local_Start_Time__c';
import REQ_END_FIELD from '@salesforce/schema/ServiceAppointment.Required_Local_End_Time__c';
import SESSION_VAL_FIELD from '@salesforce/schema/ServiceAppointment.Session_Value__c';
import TRAINING_FIELD from '@salesforce/schema/ServiceAppointment.Training_Type__c';
import ASSIGN_STRAT_FIELD from '@salesforce/schema/ServiceAppointment.Assigned_PD_Strategist__c';
import ATTENDEES_FIELD from '@salesforce/schema/ServiceAppointment.Number_of_Attendees__c';
import MULTI_TRAINER_FIELD from '@salesforce/schema/ServiceAppointment.Multi_Trainer_Event__c';
import TRAINING_CONTACT_FIELD from '@salesforce/schema/ServiceAppointment.ContactId';
import TRAINING_INFO_FIELD from '@salesforce/schema/ServiceAppointment.Training_Contact_Information__c';
import EVENT_LEAD_FIELD from '@salesforce/schema/ServiceAppointment.Multi_Trainer_Event_Lead__c';
import PLS_FIELD from '@salesforce/schema/ServiceAppointment.PLS_Confirmation_status__c';
import DIGITAL_FIELD from '@salesforce/schema/ServiceAppointment.Digital_Experience_IC__c';
import SESSION_TOPIC_FIELD from '@salesforce/schema/ServiceAppointment.Session_Topic__c';
import SUBJECT_FIELD from '@salesforce/schema/ServiceAppointment.Subject';
import ATTENDEES_TYPE_FIELD from '@salesforce/schema/ServiceAppointment.Type_of_Attendees__c';
import GRADE_FIELD from '@salesforce/schema/ServiceAppointment.Participating_Grades__c';
import VIRTUAL_FIELD from '@salesforce/schema/ServiceAppointment.Virtual_Training_Link__c';
import LICENSES_FIELD from '@salesforce/schema/ServiceAppointment.Digital_Entitlement_Licenses__c';
import INFORMATION_FIELD from '@salesforce/schema/ServiceAppointment.Additional_Information__c';
import TRAINING_LOCATION_FIELD from '@salesforce/schema/ServiceAppointment.Training_Location__c';
import STREET_FIELD from '@salesforce/schema/ServiceAppointment.Shipping_Street__c';
import CITY_FIELD from '@salesforce/schema/ServiceAppointment.Shipping_City__c';
import POSTAL_FIELD from '@salesforce/schema/ServiceAppointment.Shipping_Postal_Code__c';
import STATE_FIELD from '@salesforce/schema/ServiceAppointment.Shipping_State__c';
import COUNTRY_FIELD from '@salesforce/schema/ServiceAppointment.Shipping_Country__c';
import SHIPPING_STATUS_FIELD from '@salesforce/schema/ServiceAppointment.Shipping_Status__c';
import INSTRUCTION_FIELD from '@salesforce/schema/ServiceAppointment.Special_Shipping_Instructions__c';
import MULTI_DETAIL_FIELD from '@salesforce/schema/ServiceAppointment.Multi_Trainer_Event_Details__c';
import TRAINER_ASSIGN_FIELD from '@salesforce/schema/ServiceAppointment.Trainer_Mass_Assign__c';
import NOTES_FIELD from '@salesforce/schema/ServiceAppointment.SA_Notes__c';
import LOCATION_FIELD from '@salesforce/schema/ServiceAppointment.Training_Location_Status__c';
//import ATTENDEES_TYPE_FIELD from '@salesforce/schema/ServiceAppointment.Type_of_Attendees__c';
 
const columns = [
    { 
        label: 'Name', fieldName: 'AppointmentNumberUrl', type: 'url', 
        typeAttributes: { label: { fieldName: "AppointmentNumber" }, tooltip:"Appointment Number", target: "_blank" }, initialWidth: 150, 
        actions: [{ label: 'Collapse', checked: false, name: 'collapsed' },], 
        hideDefaultActions: true 
    },
    {
        label: 'Account', fieldName: 'AccountId', type: 'lookupColumn', initialWidth: 50, editable: false,
        typeAttributes: { object: 'ServiceAppointment', fieldName: 'AccountId', value: { fieldName: 'AccountId' }, context: { fieldName: 'Id' }, name: 'Account', fields: ['Account.Name'], edit: false, target: '_self'}, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }], 
        hideDefaultActions: true
    },
    { 
        label: 'Work Order', fieldName: 'Work_Order__c', type: 'lookupColumn', initialWidth: 50, editable: false, 
        typeAttributes: {object: 'ServiceAppointment', fieldName: 'Work_Order__c', value: { fieldName: 'Work_Order__c' }, context: { fieldName: 'Id' }, name: 'WorkOrder', fields: ['WorkOrder.WorkOrderNumber'], edit: false, target: '_self'}, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }], 
        hideDefaultActions: true 
    },
    { 
        label: 'Work Order Line Item', fieldName: 'Work_Order_Line_Item__c', type: 'lookupColumn', initialWidth: 50, editable: false, 
        typeAttributes: {object: 'ServiceAppointment', fieldName: 'Work_Order_Line_Item__c', value: { fieldName: 'Work_Order_Line_Item__c' }, context: { fieldName: 'Id' }, name: 'WorkOrderLineItem', fields: ['WorkOrderLineItem.LineItemNumber'], edit: false, target: '_self'}, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }], hideDefaultActions: true 
    },
    { 
        label: 'Training Product Delivered', fieldName: 'Training_Product_Delivered__c', type: 'lookupColumn', initialWidth: 50, editable: false,
        typeAttributes: {object: 'ServiceAppointment', fieldName: 'Training_Product_Delivered__c', value: { fieldName: 'Training_Product_Delivered__c' }, context: { fieldName: 'Id' }, name: 'Product2', fields: ['Product2.Name'], edit: false, target: '_self'}, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }], hideDefaultActions: true 
    },
    { 
        label: 'Description', fieldName: 'Description', initialWidth: 50, editable: false, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }], 
        hideDefaultActions: true 
    },
    { 
        label: 'Scheduled Start', fieldName: 'SchedStartTime', initialWidth: 50, editable: false, type: "date-local",
        typeAttributes:{month: "2-digit", day: "2-digit"}, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }], 
        hideDefaultActions: true 
    },
    { 
        label: 'Customer Local Start', fieldName: 'Scheduled_Customer_Start__c', initialWidth: 50, editable: false, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }], 
        hideDefaultActions: true
    },
    { 
        label: 'Status', fieldName: 'Status', initialWidth: 50, editable: false, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }], 
        hideDefaultActions: true 
    },
    { 
        label: 'Scheduling Status', fieldName: 'Schedulers_Status__c', type: 'picklistColumn', initialWidth: 50, editable: true, 
        typeAttributes: { placeholder: 'Select Schedulers Status', options: { fieldName: 'schedulingOptions' }, value: { fieldName: 'Schedulers_Status__c' }, context: { fieldName: 'Id' }}, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }], 
        hideDefaultActions: true
    },
    {
        label: 'Trainer to Assign', fieldName: 'Trainer_Mass_Assign__c', type: 'lookupColumn', cellAttributes: { alignment: 'right' }, initialWidth: 50, editable: false,
        typeAttributes: {object: 'ServiceAppointment', fieldName: 'Trainer_Mass_Assign__c', value: { fieldName: 'Trainer_Mass_Assign__c' }, context: { fieldName: 'Id' }, name: 'User', fields: ['User.Name'], edit: true, target: '_self'}, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }], 
        hideDefaultActions: true
    },
    {
        label: 'Trainer', fieldName: 'Trainer__c', type: 'lookupColumn', initialWidth: 50, editable: false,
        typeAttributes: {object: 'ServiceAppointment', fieldName: 'Trainer__c', value: { fieldName: 'Trainer__c' }, context: { fieldName: 'Id' }, name: 'User', fields: ['User.Name'], edit: false, target: '_self'}, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }], 
        hideDefaultActions: true
    },
    { 
        label: 'Date to Schedule', fieldName: 'Date_to_Schedule__c', initialWidth: 50, editable: true, type: "date-local",
        typeAttributes:{month: "2-digit",day: "2-digit"}, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }], 
        hideDefaultActions: true 
    },
    { 
        label: 'Preferred Training Date', fieldName: 'Preferred_Training_Date_1__c', initialWidth: 50, editable: true, type: 'date-local', 
        typeAttributes:{year:'numeric',month:'2-digit',day:'2-digit',timeZone:'UTC'}, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }], 
        hideDefaultActions: true 
    },
    { 
        label: 'Required Start Time', fieldName: 'Required_Local_Start_Time__c', type: 'picklistColumn', initialWidth: 50, editable: true, 
        typeAttributes: { placeholder: 'Select Local Start Time', options: { fieldName: 'reqStartOptions' },value: { fieldName: 'Required_Local_Start_Time__c' },context: { fieldName: 'Id' }}, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }], 
        hideDefaultActions: true
    },
    { 
        label: 'Required End Time', fieldName: 'Required_Local_End_Time__c', type: 'picklistColumn', initialWidth: 50, editable: true, 
        typeAttributes: { placeholder: 'Select Local End Time', options: { fieldName: 'reqEndOptions' },value: { fieldName: 'Required_Local_End_Time__c' },context: { fieldName: 'Id' }}, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }], 
        hideDefaultActions: true
    },
    { 
        label: 'Training Type', fieldName: 'Training_Type__c', type: 'picklistColumn', initialWidth: 50, editable: true, 
        typeAttributes: { placeholder: 'Select Training Type', options: { fieldName: 'trainingTypeOptions' },value: { fieldName: 'Training_Type__c' },context: { fieldName: 'Id' }}, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }], 
        hideDefaultActions: true
    },
    { 
        label: 'Service Appoint. Notes', fieldName: 'SA_Notes__c', initialWidth: 50, editable: true,
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }], 
        hideDefaultActions: true 
    },
    { 
        label: 'Contact', fieldName: 'ContactId', initialWidth: 50, type: 'lookupColumn', cellAttributes: { alignment: 'right' }, editable: false, 
        typeAttributes: {object: 'ServiceAppointment', fieldName: 'ContactId', value: { fieldName: 'ContactId' }, context: { fieldName: 'Id' }, name: 'Contact', fields: ['Contact.Name'], edit: true, target: '_self'}, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }], 
        hideDefaultActions: true 
    },
    { 
        label: 'Training Contact Information', fieldName: 'Training_Contact_Information__c', initialWidth: 50, editable: true, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }], 
        hideDefaultActions: true 
    },
    { 
        label: 'Assigned PD Strategist', fieldName: 'Assigned_PD_Strategist__c', initialWidth: 50, type: 'lookupColumn', cellAttributes: { alignment: 'right' }, editable: false,
        typeAttributes: {object: 'ServiceAppointment', fieldName: 'Assigned_PD_Strategist__c', value: { fieldName: 'Assigned_PD_Strategist__c' }, context: { fieldName: 'Id' }, name: 'User', fields: ['User.Name'], edit: true, target: '_self'}, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }], 
        hideDefaultActions: true 
    },
    { 
        label: 'Multi-Trainer Event Lead', fieldName: 'Multi_Trainer_Event_Lead__c', initialWidth: 50, type: 'lookupColumn', cellAttributes: { alignment: 'right' }, editable: false, 
        typeAttributes: {object: 'ServiceAppointment', fieldName: 'Multi_Trainer_Event_Lead__c', value: { fieldName: 'Multi_Trainer_Event_Lead__c' }, context: { fieldName: 'Id' }, name: 'User', fields: ['User.Name'], edit: true, target: '_self'}, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }],
        hideDefaultActions: true 
    },
    { 
        label: 'Multi-Trainer Event', fieldName: 'Multi_Trainer_Event__c', initialWidth: 50, type: 'boolean', editable: true, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }], 
        hideDefaultActions: true 
    },
    { 
        label: 'Multi-Trainer Event Details', fieldName: 'Multi_Trainer_Event_Details__c', initialWidth: 50, editable: true, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }], 
        hideDefaultActions: true 
    },
    { 
        label: 'PLS Confirmation Email Status', fieldName: 'PLS_Confirmation_status__c', type: 'picklistColumn', initialWidth: 50, editable: true, 
        typeAttributes: {placeholder: 'Select PLS Confirmation Email Status', options: { fieldName: 'plsOptions' }, value: { fieldName: 'PLS_Confirmation_status__c' }, context: { fieldName: 'Id' }}, 
        actions: [{label: 'Collapse', checked: true, name: 'collapsed' }], 
        hideDefaultActions: true
    },
    {
        label: 'Attendees Type', fieldName: 'Type_of_Attendees__c', initialWidth: 50, type: 'multiselectpicklistColumn', editable: false, 
        typeAttributes: {placeholder: 'Choose Type', options: { fieldName: 'pickListOptions' }, value: { fieldName: 'Type_of_Attendees__c' }, context: { fieldName: 'Id' }},
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }], 
        hideDefaultActions: true
    },
    {
        label: 'Participating Grades', fieldName: 'Participating_Grades__c', initialWidth: 50, type: 'multiselectpicklistColumnGrade', editable: false,
        typeAttributes: {placeholder: 'Choose Type', options: { fieldName: 'pickListOptionsGrade' }, value: { fieldName: 'Participating_Grades__c' }, context: { fieldName: 'Id' }},
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }], 
        hideDefaultActions: true
    },
    { 
        label: 'Number of Attendees', fieldName: 'Number_of_Attendees__c', initialWidth: 50, editable: true, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }], 
        hideDefaultActions: true 
    },
    { 
        label: 'Virtual Training Link', fieldName: 'Virtual_Training_Link__c', initialWidth: 50, editable: true, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }], 
        hideDefaultActions: true 
    },
    { 
        label: 'Digital Entitlement Licenses', fieldName: 'Digital_Entitlement_Licenses__c', initialWidth: 50, editable: true, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }], 
        hideDefaultActions: true 
    },
    { 
        label: 'Additional Information', fieldName: 'Additional_Information__c', initialWidth: 50, editable: true, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }], 
        hideDefaultActions: true 
    },
    { 
        label: 'Subject', fieldName: 'Subject', initialWidth: 50, editable: true, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }], 
        hideDefaultActions: true 
    },
    { 
        label: 'Session Topic', fieldName: 'Session_Topic__c', initialWidth: 50, editable: true, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }], 
        hideDefaultActions: true 
    },
    { 
        label: 'Session Value', fieldName: 'Session_Value__c', type: 'number', initialWidth: 50, editable: true, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }], 
        typeAttributes: { step: '0.01', minimumFractionDigits: '2', maximumFractionDigits: '2'}, 
        hideDefaultActions: true
    },
    { 
        label: 'Digital Experience (IC)', fieldName: 'Digital_Experience_IC__c', initialWidth: 50, type: 'boolean', editable: true, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }], 
        hideDefaultActions: true 
    },
    { 
        label: 'Training Location', fieldName: 'Training_Location__c', initialWidth: 50, editable: true, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }], 
        hideDefaultActions: true 
    },
    { 
        label: 'Training Location Status', fieldName: 'Training_Location_Status__c', type: 'picklistColumn', initialWidth: 50, editable: true, 
        typeAttributes: {placeholder: 'Select Status', options: { fieldName: 'locationStatusOptions' }, value: { fieldName: 'Training_Location_Status__c' }, context: { fieldName: 'Id' }}, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }], 
        hideDefaultActions: true 
    },
    { 
        label: 'Shipping Street', fieldName: 'Shipping_Street__c', initialWidth: 50, editable: true, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }], 
        hideDefaultActions: true 
    },
    { 
        label: 'Shipping City', fieldName: 'Shipping_City__c', initialWidth: 50, editable: true, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }], 
        hideDefaultActions: true 
    },
    { 
        label: 'Shipping Postal Code', fieldName: 'Shipping_Postal_Code__c', initialWidth: 50, editable: true, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }], 
        hideDefaultActions: true 
    },
    { 
        label: 'Shipping State', fieldName: 'Shipping_State__c', initialWidth: 50, editable: true, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }], 
        hideDefaultActions: true 
    },
    { 
        label: 'Shipping Country', fieldName: 'Shipping_Country__c', initialWidth: 50, editable: true, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }], 
        hideDefaultActions: true 
    },
    { 
        label: 'Shipping Status', fieldName: 'Shipping_Status__c', type: 'picklistColumn', initialWidth: 50, editable: true, 
        typeAttributes: {placeholder: 'Select Status', options: { fieldName: 'shippingStatusOptions' }, value: { fieldName: 'Shipping_Status__c' }, context: { fieldName: 'Id' }}, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }], 
        hideDefaultActions: true 
    },
    { 
        label: 'Special Shipping Instructions', fieldName: 'Special_Shipping_Instructions__c', initialWidth: 50, editable: true, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }], 
        hideDefaultActions: true 
    },
]


export default class MassEditTable extends LightningElement {
    @track columns = columns;
    @track serviceAppointments = [];
    @track disabled = true;
    @track showSpinner = true;
    @track showHeader = false;
    lastSavedData = [];
    rowLimit = 20;
    rowOffSet = 0;

    //@track statusValue; //makes the picklists reactive, so they update when cleared
    //@track scheduleValue; //some multi-selects have been removed
    @track dateValue;
    @track prefDateValue;
    @track reqStartValue;
    @track reqEndValue;
    @track sessionValue;
    @track trainingTypeValue;
    @track assignStratValue;
    @track attendeesValue;
    @track multiTrainerValue;
    @track trainingContactValue;
    @track trainingInfoValue;
    @track eventLeadValue;
    @track plsValue;
    @track digitalValue;
    @track sessionTopicValue;
    @track subjectValue;
    @track attendeesTypeValue;
    @track gradeValue;
    @track virtualTrainingValue;
    @track licenseValue;
    @track informationValue;
    @track trainingLocationValue;
    @track shippingStreetValue;
    @track shippingCityValue;
    @track shippingPostalValue;
    @track shippingStateValue;
    @track shippingCountryValue;
    @track shippingStatusValue;
    @track shippingInstructionsValue;
    @track multiTrainerDetailsValue;
    @track sANotes;
    @track locationStatusValue;

    @track pickListOptions;

    @wire(MessageContext)
    messageContext;

    @track draftValues = [];
    selectedRecords = [];

    _selectedType = [];
    _selectedGrades = [];
    //@track attendeesTypeValue;

    parentAccountSelectedRecord;
    handleValueSelectedOnAccount(event) {
        this.parentAccountSelectedRecord = event.detail;
    }
    
    @track plsOptions;
    @track statusOptions;
    @track shippingStatusOptions;
    @track schedulingOptions;
    @track trainingTypeOptions;
    @track reqStartOptions;
    @track reqEndOptions;
    @track locationStatusOptions;
    @track multiTrainerOptions = [
        { label: "--None--", value: null },
        { label: "Checked", value: "true" },
        { label: "Unchecked", value: "false" },
    ];
    @track digitalOptions = [
        { label: "--None--", value: null },
        { label: "Checked", value: "true" },
        { label: "Unchecked", value: "false" },
    ];

    /*Table Filters*/   
    @track workOrderFilter = '';
    @track statusFilter = '';
    @track accountFilter = '';
    @track productFamilyFilter = '';

    //work order filter changed
    workOrderFilterChange(event) {
        this.workOrderFilter = event.target.value;
        console.log("this.workOrderFilter: ", this.workOrderFilter);
        this.rowLimit = 20;
        this.rowOffSet = 0;
        this.serviceAppointments = [];
        this.showSpinner = true;
    }

    //status filter changed
    statusFilterChange(event) {
        this.statusFilter = event.target.value;
        console.log("this.statusFilter: ", this.statusFilter);
        this.rowLimit = 20;
        this.rowOffSet = 0;
        this.serviceAppointments = [];
        this.showSpinner = true;
    }

    //account filter changed
    accountFilterChange(event) {
        this.accountFilter = event.target.value;
        console.log("this.accountFilter: ", this.accountFilter);
        this.rowLimit = 20;
        this.rowOffSet = 0;
        this.serviceAppointments = [];
        this.showSpinner = true;
    }

    //event to handle user typing in product family search box
    productFamilyFilterChange(event) {
        clearTimeout(this.typingTimer);
        let value = event.target.value;
        this.rowLimit = 20;
        this.rowOffSet = 0;
        this.serviceAppointments = [];
        this.showSpinner = true;
        this.typingTimer = setTimeout(() => {
            this.productFamilyFilter = value;
        }, 500);
    }

    //wire method to get the service appointments based on row limit and filters
    @wire(getServiceAppointments, { limitSize: "$rowLimit" , offset: "$rowOffSet", statusFilter: "$statusFilter", workOrder: "$workOrderFilter", productFamily: "$productFamilyFilter", accountId: "$accountFilter" })
    wiredServiceAppointments(result) {
        this.refreshServiceAppointments = result;
        if (result.data) {
            const data = JSON.parse(JSON.stringify(result.data));
            console.log("data: ", data);
            const existingIds = new Set(this.serviceAppointments.map(item => item.Id));
            console.log("existingIds: ", existingIds);
            const filteredData = data.filter(item => !existingIds.has(item.Id));
            console.log('filteredData ' + filteredData);
            if (data.length < this.rowLimit ) { //runs if there are no more records to populate the table
                const baseTableEle = this.template.querySelector('c-l-w-c-lookup-custom-datatable-type') //creates a const variable for our custom datatable, allowing us to make changes to its attributes
                if (baseTableEle) {
                  baseTableEle.enableInfiniteLoading = false //prevents infinite loading from being run again
                }
            }
            else { //runs if there is at least 1 more record to add to the table
                const baseTableEle = this.template.querySelector('c-l-w-c-lookup-custom-datatable-type') //creates a const variable for our custom datatable, allowing us to make changes to its attributes
                if (baseTableEle) {
                  baseTableEle.enableInfiniteLoading = true //allows inifinite loading to take place again
                }
            }
            this.serviceAppointments = [...this.serviceAppointments, ...filteredData];
            this.serviceAppointments.forEach(SA => {
                SA.trainerLink = SA.Trainer__c != undefined ? '/' + SA.Trainer__c : '';
                SA.trainerName = SA.Trainer__c != undefined ? SA.Trainer__c.Name : '';
                SA.AppointmentNumberUrl = '/' + SA.Id;
                SA.shippingStatusOptions = this.shippingStatusOptions;
                SA.statusOptions = this.statusOptions;
                SA.schedulingOptions = this.schedulingOptions;
                SA.trainingTypeOptions = this.trainingTypeOptions;
                SA.reqStartOptions = this.reqStartOptions;
                SA.reqEndOptions = this.reqEndOptions;
                SA.plsOptions = this.plsOptions;
                SA.pickListOptions = this.pickListOptions;
                SA.pickListOptionsGrade = this.pickListOptionsGrade;
                SA.locationStatusOptions = this.locationStatusOptions;
                /*if (SA.Date_to_Schedule__c == undefined || SA.Date_to_Schedule__c == null) {
                    SA.Date_to_Schedule__c = '';
                }
                if (SA.Preferred_Training_Date_1__c == undefined || SA.Preferred_Training_Date_1__c == null) {
                    SA.Preferred_Training_Date_1__c = '';
                }*/
                //console.log('logged ' + SA.shippingStatusOptions);
                //console.log('logged ' + SA.statusOptions);
            });
            console.log("this.serviceAppointments: ", this.serviceAppointments);
            this.lastSavedData = JSON.parse(JSON.stringify(this.serviceAppointments));
            //console.log("this.lastSavedData: ", this.lastSavedData);
            if (this.serviceAppointments.length <= 0) {
                this.noData = true;
                this.errorMessage = "No data matched the current search conditions."
            }
            else {
                this.noData = false;
            }
        } else if (result.error) {
            console.error("Error loading table data: ", result.error);
            this.noData = true;
            this.errorMessage = result.error;
        }
        this.showSpinner = false;
        this.waitForWire = false;
    }

    loadMoreData() {
        if(!this.waitForWire) {
            this.rowOffSet = this.rowOffSet + this.rowLimit;
            this.showSpinner = true;
            this.waitForWire = true;
        }
    }

    //initilizes header fields
    @track massFields = {
        [DATE_TO_SCHEDULE_FIELD.fieldApiName]: null,
        [PREF_DATE_FIELD.fieldApiName]: null,
        [REQ_START_FIELD.fieldApiName]: null,
        [REQ_END_FIELD.fieldApiName]: null,
        [SESSION_VAL_FIELD.fieldApiName]: null,
        [TRAINING_FIELD.fieldApiName]: null,
        [ASSIGN_STRAT_FIELD.fieldApiName]: null,
        [ATTENDEES_FIELD.fieldApiName]: null,
        [MULTI_TRAINER_FIELD.fieldApiName]: null,
        [TRAINING_CONTACT_FIELD.fieldApiName]: null,
        [TRAINING_INFO_FIELD.fieldApiName]: null,
        [EVENT_LEAD_FIELD.fieldApiName]: null,
        [PLS_FIELD.fieldApiName]: null,
        [DIGITAL_FIELD.fieldApiName]: null,
        [SESSION_TOPIC_FIELD.fieldApiName]: null,
        [SUBJECT_FIELD.fieldApiName]: null,
        [ATTENDEES_TYPE_FIELD.fieldApiName]: null,
        [GRADE_FIELD.fieldApiName]: null,
        [VIRTUAL_FIELD.fieldApiName]: null,
        [LICENSES_FIELD.fieldApiName]: null,
        [INFORMATION_FIELD.fieldApiName]: null,
        [TRAINING_LOCATION_FIELD.fieldApiName]: null,
        [STREET_FIELD.fieldApiName]: null,
        [CITY_FIELD.fieldApiName]: null,
        [POSTAL_FIELD.fieldApiName]: null,
        [STATE_FIELD.fieldApiName]: null,
        [COUNTRY_FIELD.fieldApiName]: null,
        [SHIPPING_STATUS_FIELD.fieldApiName]: null,
        [INSTRUCTION_FIELD.fieldApiName]: null,
        [MULTI_DETAIL_FIELD.fieldApiName]: null,
        [NOTES_FIELD.fieldApiName]: null,
        [LOCATION_FIELD.fieldApiName]: null
    }

    //getting options for picklists
    @wire(getPicklistValues, {
        recordTypeId: "012000000000000AAA",
        fieldApiName: STATUS_FIELD
    })
    StatusPickListOptions({ error, data }) {
        if (error) {
            console.error("error", error);
        } else if (data) {
            this.statusOptions = [
                { label: "--None--", value: null },
                ...data.values
            ];
        }
    }

    @wire(getPicklistValues, {
        recordTypeId: "012000000000000AAA",
        fieldApiName: SCHEDULING_STATUS_FIELD
    })
    SchedulePickListOptions({ error, data }) {
        if (error) {
            console.error("error", error);
        } else if (data) {
            this.schedulingOptions = [
                { label: "--None--", value: null },
                ...data.values
            ];
        }
    }

    @wire(getPicklistValues, {
        recordTypeId: "012000000000000AAA",
        fieldApiName: ATTENDEES_TYPE_FIELD
    })
    wirePickList({ error, data }) {
        if (data) {
            this.pickListOptions = data.values;
        } else if (error) {
            console.log(error);
        }
    }

    @track pickListOptionsGrade;

    @wire(getPicklistValues, {
        recordTypeId: "012000000000000AAA",
        fieldApiName: GRADE_FIELD
    })
    GradewirePickList({ error, data }) {
        if (data) {
            this.pickListOptionsGrade = data.values;
        } else if (error) {
            console.log(error);
        }
    }

    @wire(getPicklistValues, {
        recordTypeId: "012000000000000AAA",
        fieldApiName: REQ_START_FIELD
    })
    ReqStartPickListOptions({ error, data }) {
        if (error) {
            console.error("error", error);
        } else if (data) {
            this.reqStartOptions = [
                { label: "--None--", value: null },
                ...data.values
            ];
        }
    }

    @wire(getPicklistValues, {
        recordTypeId: "012000000000000AAA",
        fieldApiName: REQ_END_FIELD
    })
    ReqEndPickListOptions({ error, data }) {
        if (error) {
            console.error("error", error);
        } else if (data) {
            this.reqEndOptions = [
                { label: "--None--", value: null },
                ...data.values
            ];
        }
    }

    @wire(getPicklistValues, {
        recordTypeId: "012000000000000AAA",
        fieldApiName: TRAINING_FIELD
    })
    TrainingTypePickListOptions({ error, data }) {
        if (error) {
            console.error("error", error);
        } else if (data) {
            this.trainingTypeOptions = [
                { label: "--None--", value: null },
                ...data.values
            ];
        }
    }

    @wire(getPicklistValues, {
        recordTypeId: "012000000000000AAA",
        fieldApiName: PLS_FIELD
    })
    PLSPickListOptions({ error, data }) {
        if (error) {
            console.error("error", error);
        } else if (data) {
            this.plsOptions = [
                { label: "--None--", value: null },
                ...data.values
            ];
        }
    }

    @wire(getPicklistValues, {
        recordTypeId: "012000000000000AAA",
        fieldApiName: ATTENDEES_TYPE_FIELD
    })
    AttendeesTypePickListOptions({ error, data }) {
        if (error) {
            console.error("error", error);
        } else if (data) {
            this.attendeesTypeOptions = [
                ...data.values
            ];
        }
    }

    @wire(getPicklistValues, {
        recordTypeId: "012000000000000AAA",
        fieldApiName: GRADE_FIELD
    })
    GradePickListOptions({ error, data }) {
        if (error) {
            console.error("error", error);
        } else if (data) {
            this.gradeOptions = [
                ...data.values
            ];
        }
    }

    @wire(getPicklistValues, {
        recordTypeId: "012000000000000AAA",
        fieldApiName: SHIPPING_STATUS_FIELD
    })
    ShippingStatusPickListOptions({ error, data }) {
        if (error) {
            console.error("error", error);
        } else if (data) {
            this.shippingStatusOptions = [
                { label: "--None--", value: null },
                ...data.values
            ];
        }
    }

    @wire(getPicklistValues, {
        recordTypeId: "012000000000000AAA",
        fieldApiName: LOCATION_FIELD
    })
    LocationPickListOptions({ error, data }) {
        if (error) {
            console.error("error", error);
        } else if (data) {
            this.locationStatusOptions = [
                ...data.values
            ];
            //this.loadData();
        }
    }

    //handles header field changes
    handleChange(event) {
        for (const field in this.massFields) {
            if (this.massFields.hasOwnProperty(event.target.name)) {
                console.log(event.target.name);
                this.massFields[event.target.name] = event.target.value;
            }
        }
        console.log('massFields: ' + JSON.stringify(this.massFields));
    }

    //handles checkboxes uses event.target.checked
    handleTrainerCheckboxChange(event) {
        this.multiTrainerValue = event.detail.value;
        if (this.multiTrainerValue === "true") {
            this.booleanValue = true;
        } else if (this.multiTrainerValue === "false") {
            this.booleanValue = false;
        } else {
            this.booleanValue = null;
        }
        //this.multiTrainerValue = event.detail.value;
        //this.bool = Boolean(event.detail.value);
        console.log(this.booleanValue);
        for (const field in this.massFields) {
            if (this.massFields.hasOwnProperty(event.target.name)) {
                console.log(event.target.name);
                this.massFields[event.target.name] = this.booleanValue;
            }
        }
        console.log('massFields: ' + JSON.stringify(this.massFields));
    }
        //handles checkboxes uses event.target.checked
        handleDigitalCheckboxChange(event) {
            this.digitalValue = event.detail.value;
            if (this.digitalValue === "true") {
                this.booleantwoValue = true;
            } else if (this.digitalValue === "false") {
                this.booleantwoValue = false;
            } else {
                this.booleantwoValue = null;
            }
            //this.multiTrainerValue = event.detail.value;
            //this.bool = Boolean(event.detail.value);
            console.log(this.booleantwoValue);
            for (const field in this.massFields) {
                if (this.massFields.hasOwnProperty(event.target.name)) {
                    console.log(event.target.name);
                    this.massFields[event.target.name] = this.booleantwoValue;
                }
            }
            console.log('massFields: ' + JSON.stringify(this.massFields));
        }

    //handles lookup changes
    handleLookupChange(event) {
        console.log(event.target.value);
        if(event.target.value !== "" && event.target.value !== " ") {
            for (const field in this.massFields) {
                if (this.massFields.hasOwnProperty(event.target.fieldName)) {
                    console.log(event.target.fieldName);
                    this.massFields[event.target.fieldName] = event.target.value;
                }
            }
        }
        else {
            for (const field in this.massFields) {
                if (this.massFields.hasOwnProperty(event.target.fieldName)) {
                    console.log(event.target.fieldName);
                    this.massFields[event.target.fieldName] = null;
                }
            }
        }
        console.log('massFields: ' + JSON.stringify(this.massFields));
    }

    //multipicklist select
    get selectedType() {
        return this._selectedType.length ? this._selectedType : 'none';
    }

    handleTypeChange(e) {
        this._selectedType = e.target.value;
        console.log(this._selectedType);
        const resultString = this._selectedType.join(';');
        this.massFields["Type_of_Attendees__c"] = resultString;
        console.log(e.target.value);
        console.log('massFields: ' + JSON.stringify(this.massFields));
    }

    get selectedGrade() {
        return this._selectedGrade.length ? this._selectedGrade : 'none';
    }

    handleGradeChange(e) {
        this._selectedGrade = e.detail.value;
        console.log(this._selectedGrade);
        const resultGrade = this._selectedGrade.join(';');
        this.massFields["Participating_Grades__c"] = resultGrade;
        console.log(e.target.value);
        console.log('massFields: ' + JSON.stringify(this.massFields));
    }

    //resets all field values
    clearFields() {
        //for (const field in this.massFields) {
        //    this.massFields[field] = null;
        //}
        this.template.querySelectorAll('lightning-input[data-recid=massEdit]').forEach(element => {
            if(element.type === 'checkbox' || element.type === 'checkbox-button'){
                element.checked = false;
            }else{
                element.value = null;
            }      
        });
        this.template.querySelectorAll('lightning-combobox[data-recid=massEdit]').forEach(element => {
            element.value = null;     
        });
        this.template.querySelectorAll('lightning-textarea[data-recid=massEdit]').forEach(element => {
            element.value = null;     
        });
        this.template.querySelectorAll('lightning-dual-listbox[data-recid=massEdit]').forEach(element => {
            element.value = null;     
        });
        this.template.querySelectorAll('lightning-input-field[data-recid=massEdit]').forEach(element => {
            element.value = null;     
        });
        console.log('massFields: ' + JSON.stringify(this.massFields));
        //this.statusValue = null;
        //this.scheduleValue = null;
        this.dateValue = null;
        this.prefDateValue = null;
        this.reqStartValue = null;
        this.reqEndValue = null;
        this.sessionValue = null;
        this.trainingTypeValue = null;
        this.assignStratValue = null;
        this.attendeesValue = null;
        this.multiTrainerValue = null;
        this.trainingContactValue = null;
        this.trainingInfoValue = null;
        this.eventLeadValue = null;
        this.plsValue = null;
        this.digitalValue = null;
        this.sessionTopicValue = null;
        this.subjectValue = null;
        this.virtualTrainingValue = null;
        this.licenseValue = null;
        this.informationValue = null;
        this.trainingLocationValue = null;
        this.shippingStreetValue = null;
        this.shippingCityValue = null;
        this.shippingPostalValue = null;
        this.shippingStateValue = null;
        this.shippingCountryValue = null;
        this.shippingInstructionsValue = null;
        this.multiTrainerDetailsValue = null;
        this.sANotes = null;
        this.locationStatusValue = null;
        this.shippingStatusValue = null;
        this.massFields = {
            //[STATUS_FIELD.fieldApiName]: null,
            //[SCHEDULING_STATUS_FIELD.fieldApiName]: null,
            [DATE_TO_SCHEDULE_FIELD.fieldApiName]: null,
            [PREF_DATE_FIELD.fieldApiName]: null,
            [REQ_START_FIELD.fieldApiName]: null,
            [REQ_END_FIELD.fieldApiName]: null,
            [SESSION_VAL_FIELD.fieldApiName]: null,
            [TRAINING_FIELD.fieldApiName]: null,
            [ASSIGN_STRAT_FIELD.fieldApiName]: null,
            [ATTENDEES_FIELD.fieldApiName]: null,
            [MULTI_TRAINER_FIELD.fieldApiName]: null,
            [TRAINING_CONTACT_FIELD.fieldApiName]: null,
            [TRAINING_INFO_FIELD.fieldApiName]: null,
            [EVENT_LEAD_FIELD.fieldApiName]: null,
            [PLS_FIELD.fieldApiName]: null,
            [DIGITAL_FIELD.fieldApiName]: null,
            [SESSION_TOPIC_FIELD.fieldApiName]: null,
            [SUBJECT_FIELD.fieldApiName]: null,
            [ATTENDEES_TYPE_FIELD.fieldApiName]: null,
            [GRADE_FIELD.fieldApiName]: null,
            [VIRTUAL_FIELD.fieldApiName]: null,
            [LICENSES_FIELD.fieldApiName]: null,
            [INFORMATION_FIELD.fieldApiName]: null,
            [TRAINING_LOCATION_FIELD.fieldApiName]: null,
            [STREET_FIELD.fieldApiName]: null,
            [CITY_FIELD.fieldApiName]: null,
            [POSTAL_FIELD.fieldApiName]: null,
            [STATE_FIELD.fieldApiName]: null,
            [COUNTRY_FIELD.fieldApiName]: null,
            [SHIPPING_STATUS_FIELD.fieldApiName]: null,
            [INSTRUCTION_FIELD.fieldApiName]: null,
            [MULTI_DETAIL_FIELD.fieldApiName]: null,
            [NOTES_FIELD.fieldApiName]: null,
            [LOCATION_FIELD.fieldApiName]: null,
        }
    }

    //handles selection of row using checkbox
    handleRowSelection(event) {
        const selectedRows = event.detail.selectedRows;
        console.log(selectedRows);
        this.selectedRecords = [...selectedRows];
        this.selectedRowIds = [];
        this.selectedRecords.forEach(row => {
            this.selectedRowIds.push(row.Id);
        });
        if (this.selectedRecords.length == 0) {
            this.disabled = true;
            this.recordsSelected = false;
        }
        else {
            this.disabled = false;
            this.recordsSelected = true;
        };
        this.handleSelectedRows();
    }

    recordsSelected = false; //determines whether to show the "Apply to (1) Row" dropdown
    selectedRowIds = []; //a list of selected row ids

    //sends the event telling custom columns which rows are selected
    handleSelectedRows(event) {
        const payload = { payload: this.recordsSelected, number: this.selectedRecords.length, ids: this.selectedRowIds };

        publish(this.messageContext, recordSelected, payload);
    }

    //handler to handle cell changes & update values in draft values
   /* handleCellChange(event) {
        this.showHeader = true;
        let draftValues = event.detail.draftValues;
        console.log('draftValues ' + draftValues);
        draftValues.forEach(ele => {
            console.log('ele ' + ele);
            this.updateDraftValues(ele);
        });
        draftValues.forEach(ele => {
            console.log('ele ' + ele);
            this.updateDataValues(ele);
        })
        //this.updateDraftValues(event.detail.draftValues[0]);
        //this.updateDataValues(event.detail.draftValues[0]);
        //draftValues.forEach(ele => {
        //    this.updateDraftValues(ele);
        //})
    }*/


    multpicklistChanged(event) {
        event.stopPropagation();
        let dataRecieved = event.detail.data;
        console.log(event.detail.data);
        let updatedItem = { Id: dataRecieved.context, Type_of_Attendees__c: dataRecieved.value};
        console.log(updatedItem);
        this.updateDraftValues(updatedItem);
        this.updateDataValues(updatedItem);
    }
    multipicklistChangedGrade(event) {
        event.stopPropagation();
        let dataRecieved = event.detail.data;
        console.log(event.detail.data);
        let updatedItem = { Id: dataRecieved.context, Participating_Grades__c: dataRecieved.value};
        console.log(updatedItem);
        this.updateDraftValues(updatedItem);
        this.updateDataValues(updatedItem);
    }

    lookupChanged(event) { //event called when a lookup field's value is changed
        const eventDetail = event.detail.data.fieldLookup; //gets the field value sent from the event message
        console.log("eventDetail: ", eventDetail);
        for (let i = 0; i < this.columns.length; i++) { //loops each column in the datatable
            const column = this.columns[i]; //creates a variable for the current column
            if (column.typeAttributes != undefined && column.typeAttributes.fieldName != undefined) { //checks if the column has the typeAttributes detail
                if (column.typeAttributes.fieldName == eventDetail) { //checks if the column's typeAttributes.fields value equals the field value sent from the event
                    let Fields = this.columns[i].fieldName; //sets a variable for the field name used below
                    let dataRecieved = event.detail.data; //the data recieved from the message
                    let accountIdVal = dataRecieved.value != undefined ? dataRecieved.value : null; //sets the field value to a variable
                    if (dataRecieved.check) {
                        for (let y = 0; y < this.selectedRecords.length; y++) {
                            //console.log('y ' + y);
                            //console.log('selected ' + JSON.stringify(this.selectedRecords[y].Id));
                            let updatedItem = { Id: this.selectedRecords[y].Id, [Fields]: accountIdVal  }; //creates a draft value using the record id and field name
                            event.stopPropagation(); //prevents the event form bubbling up through the DOM
                            this.updateDraftValues(updatedItem); //runs the event to create a draft value
                            this.updateDataValues(updatedItem); //runs the event to create a data value
                        }
                    }
                    else {
                        let updatedItem = { Id: dataRecieved.context, [Fields]: accountIdVal  }; //creates a draft value using the record id and field name
                        event.stopPropagation(); //prevents the event form bubbling up through the DOM
                        this.updateDraftValues(updatedItem); //runs the event to create a draft value
                        this.updateDataValues(updatedItem); //runs the event to create a data value
                    }
                }
            }
        }
    }

    handleCellChange(event) { //event is run when a cell is edited using inline edit
        let draftValues = event.detail.draftValues; //assings the changed values to a variable
        draftValues.forEach(ele => { //runs for each draft value
            this.updateDraftValues(ele);
        });
        draftValues.forEach(ele => { //runs for each draft value
            this.updateDataValues(ele);
        })
    }

    updateDraftValues(updateItem) {
        this.showHeader = true;
        let draftValueChanged = false;
        let copyDraftValues = [...this.draftValues];
        copyDraftValues.forEach(item => {
            if (item.Id === updateItem.Id) {
                for (let field in updateItem) {
                    item[field] = updateItem[field];
                }
                draftValueChanged = true;
            }
        });
        if (draftValueChanged) {
            this.draftValues = [...copyDraftValues];
        } else {
            this.draftValues = [...copyDraftValues, updateItem];
        }
    }

    updateDataValues(updateItem) {
        let copyData = JSON.parse(JSON.stringify(this.serviceAppointments));
        copyData.forEach(item => {
            if (item.Id === updateItem.Id) {
                for (let field in updateItem) {
                    item[field] = updateItem[field];
                }
            }
        });
        this.serviceAppointments = [...copyData];
    };

    afterSaveResult = {};
    handleSave(event) {
        this.showSpinner = true;
        this.saveDraftValues = JSON.parse(JSON.stringify(this.draftValues));
        console.log("this.saveDraftValues: ", this.saveDraftValues);
        updateRecords({ recordsToUpdate: this.saveDraftValues })
        .then(result => {
            this.afterSaveResult = result;
            console.log("this.afterSaveResult: ", this.afterSaveResult);
            if (this.afterSaveResult === null) {
                    const message = new ShowToastEvent({
                        title: 'Success!',
                        message: 'All ' + this.saveDraftValues.length + ' Records updated successfully.',
                        variant: 'success',
                    });
                    this.dispatchEvent(message);
            }
            else{
            const objectLength = Object.keys(this.afterSaveResult).length;
            const successLength = this.saveDraftValues.length - objectLength;
            //this.successfulRecords = this.afterSaveResult[0];
           // this.failedRecords = this.afterSaveResult[1];
            if(objectLength === 0) {
                const message = new ShowToastEvent({
                    title: 'Success!',
                    message: 'All ' + successLength + ' Records updated successfully.',
                    variant: 'success',
                });
                this.dispatchEvent(message);
            }
            else if (objectLength > 0 && successLength > 0) {
                let errorMsg = '';
                for (let key in this.afterSaveResult) {
                    if (this.afterSaveResult.hasOwnProperty(key)) {
                        errorMsg += "Service Appointment with Id: \""+ key + "\" ran into the error: \"" + this.afterSaveResult[key] + "\" while saving. ";
                    }
                }
                const msg = new ShowToastEvent({
                    title: 'Partial Success',
                    message: successLength + ' Records updated successfully.',
                    variant: 'success',
                });
                this.dispatchEvent(msg);
                const message = new ShowToastEvent({
                    title: 'Some Records Failed to Save',
                    message: 'Unable to update these records. ' + errorMsg,
                    variant: 'error',
                    mode: 'sticky'
                });
                this.dispatchEvent(message);
            }
            else if (objectLength > 0 && successLength === 0 ) {
                let errorMsg = '';
                for (let key in this.afterSaveResult) {
                    if (this.afterSaveResult.hasOwnProperty(key)) {
                        errorMsg += "Service Appointment with Id: \""+ key + "\" ran into the error: \"" + this.afterSaveResult[key] + "\" while saving. ";
                    }
                }
                const message = new ShowToastEvent({
                    title: 'No Records Were Saved',
                    message: 'Unable to update records. ' + errorMsg,
                    variant: 'error',
                    mode: 'sticky'
                });
                this.dispatchEvent(message);
            }
            }
            this.draftValues = [];
            this.lastSavedData = this.serviceAppointments;
            refreshApex(this.refreshServiceAppointments);
            this.rowLimit = 20;
            this.rowOffSet = 0;
            this.serviceAppointments = [];
            this.showHeader = false;
        }).finally(() => {
           refreshApex(this.refreshServiceAppointments);
           this.showSpinner = false;
        });
        /*
        const recordInputs = this.saveDraftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
        console.log('recordInputs: ' + JSON.parse(JSON.stringify(recordInputs)));
        const promises = recordInputs.map(recordInput => updateRecord(recordInput));
        Promise.all(promises).then(res => {
            this.error = undefined;
            const message = new ShowToastEvent({
                title: 'Success!',
                message: 'Records updated successfully.',
                variant: 'success',
            });
            this.dispatchEvent(message);
            this.draftValues = [];
            this.lastSavedData = this.serviceAppointments;
            refreshApex(this.refreshServiceAppointments);
            this.rowLimit = 20;
            this.rowOffSet = 0;
            this.serviceAppointments = [];
            this.showSpinner = true;
            this.showHeader = false;
        }).catch(error => {
            console.log(error);
            const message = new ShowToastEvent({
                title: 'An Error Occured',
                message: 'Unable to update records. ' + error,
                variant: 'error',
            });
            this.dispatchEvent(message);
            console.log('error.body.output.errors: ', error.body.output.errors);
            this.showSpinner = false;
        }).finally(() => {
            refreshApex(this.refreshServiceAppointments);
        });*/
    }

    //updates datatable when lookup field (school) is changed
    /*lookupChanged(event) {
        console.log('lookup ' + JSON.stringify(event.detail.data));
        console.log(event.detail.data.context);
        event.stopPropagation();
        this.showHeader = true;
        let dataRecieved = event.detail.data;
        let accountIdVal = dataRecieved.value != undefined ? dataRecieved.value : null;
        let updatedItem = { Id: dataRecieved.context, Trainer__c: accountIdVal };
        this.updateDraftValues(updatedItem);
        this.updateDataValues(updatedItem);
        ////console.log(this.selectedRecords.length);
        //let dataRecieved = event.detail.data;
        //let accountIdVal = dataRecieved.value != undefined ? dataRecieved.value : null;
        //if (this.selectedRecords.length == 0 || this.selectedRecords.length == undefined || this.selectedRecords.length == null) {
          //  let updatedItem = { Id: dataRecieved.context, Trainer__c: accountIdVal };
          //  this.updateDraftValues(updatedItem);
            ////console.log(updatedItem);
       // }
       // else {
       //     for (const record of this.selectedRecords) {
               // let updatedItem = {
               //     Id: record.Id,
               //     Trainer__c: accountIdVal
           //     };
            //    this.updateDraftValues(updatedItem);
         //   };
       // };
    }*/
        //updates datatable when lookup field (school) is changed
        /*lookupContactChanged(event) {
            console.log('lookup ' + JSON.stringify(event.detail.data));
            console.log(event.detail.data.context);
            event.stopPropagation();
            this.showHeader = true;
            let dataRecieved = event.detail.data;
            let accountIdVal = dataRecieved.value != undefined ? dataRecieved.value : null;
            let updatedItem = { Id: dataRecieved.context, Training_Contact__c: accountIdVal };
            this.updateDraftValues(updatedItem);
            this.updateDataValues(updatedItem);
            ////console.log(this.selectedRecords.length);
            //let dataRecieved = event.detail.data;
            //let accountIdVal = dataRecieved.value != undefined ? dataRecieved.value : null;
            //if (this.selectedRecords.length == 0 || this.selectedRecords.length == undefined || this.selectedRecords.length == null) {
              //  let updatedItem = { Id: dataRecieved.context, Trainer__c: accountIdVal };
              //  this.updateDraftValues(updatedItem);
                ////console.log(updatedItem);
           // }
           // else {
           //     for (const record of this.selectedRecords) {
                   // let updatedItem = {
                   //     Id: record.Id,
                   //     Trainer__c: accountIdVal
               //     };
                //    this.updateDraftValues(updatedItem);
             //   };
           // };
        }
                //updates datatable when lookup field (school) is changed
                lookupPDChanged(event) {
                    console.log('lookup ' + JSON.stringify(event.detail.data));
                    console.log(event.detail.data.context);
                    event.stopPropagation();
                    this.showHeader = true;
                    let dataRecieved = event.detail.data;
                    let accountIdVal = dataRecieved.value != undefined ? dataRecieved.value : null;
                    let updatedItem = { Id: dataRecieved.context, Assigned_PD_Strategist__c: accountIdVal };
                    this.updateDraftValues(updatedItem);
                    this.updateDataValues(updatedItem);
                    ////console.log(this.selectedRecords.length);
                    //let dataRecieved = event.detail.data;
                    //let accountIdVal = dataRecieved.value != undefined ? dataRecieved.value : null;
                    //if (this.selectedRecords.length == 0 || this.selectedRecords.length == undefined || this.selectedRecords.length == null) {
                      //  let updatedItem = { Id: dataRecieved.context, Trainer__c: accountIdVal };
                      //  this.updateDraftValues(updatedItem);
                        ////console.log(updatedItem);
                   // }
                   // else {
                   //     for (const record of this.selectedRecords) {
                           // let updatedItem = {
                           //     Id: record.Id,
                           //     Trainer__c: accountIdVal
                       //     };
                        //    this.updateDraftValues(updatedItem);
                     //   };
                   // };
                }
                                //updates datatable when lookup field (school) is changed
                                lookupLeadChanged(event) {
                                    console.log('lookup ' + JSON.stringify(event.detail.data));
                                    console.log(event.detail.data.context);
                                    event.stopPropagation();
                                    this.showHeader = true;
                                    let dataRecieved = event.detail.data;
                                    let accountIdVal = dataRecieved.value != undefined ? dataRecieved.value : null;
                                    let updatedItem = { Id: dataRecieved.context, Multi_Trainer_Event_Lead__c: accountIdVal };
                                    this.updateDraftValues(updatedItem);
                                    this.updateDataValues(updatedItem);
                                    ////console.log(this.selectedRecords.length);
                                    //let dataRecieved = event.detail.data;
                                    //let accountIdVal = dataRecieved.value != undefined ? dataRecieved.value : null;
                                    //if (this.selectedRecords.length == 0 || this.selectedRecords.length == undefined || this.selectedRecords.length == null) {
                                      //  let updatedItem = { Id: dataRecieved.context, Trainer__c: accountIdVal };
                                      //  this.updateDraftValues(updatedItem);
                                        ////console.log(updatedItem);
                                   // }
                                   // else {
                                   //     for (const record of this.selectedRecords) {
                                           // let updatedItem = {
                                           //     Id: record.Id,
                                           //     Trainer__c: accountIdVal
                                       //     };
                                        //    this.updateDraftValues(updatedItem);
                                     //   };
                                   // };
                                }
                                                                //updates datatable when lookup field (school) is changed
                                                                lookupAssignChanged(event) { //event called when a lookup field's value is changed
                                                                    const eventDetail = event.detail.data.fieldLookup; //gets the field value sent from the event message
                                                                    console.log('eventDetail' + eventDetail);
                                                                    for (let i = 0; i < this.columns.length; i++) { //loops each column in the datatable
                                                                        const column = this.columns[i]; //creates a variable for the current column
                                                                        if (column.typeAttributes != undefined && column.typeAttributes.fields != undefined) { //checks if the column has the typeAttributes detail
                                                                            if (column.typeAttributes.fieldName == "Trainer_Mass_Assign__c") { //checks if the column's typeAttributes.fields value equals the field value sent from the event
                                                                                let Fields = this.columns[i].fieldName; //sets a variable for the field name used below
                                                                                let dataRecieved = event.detail.data; //the data recieved from the message
                                                                                let accountIdVal = dataRecieved.value != undefined ? dataRecieved.value : null; //sets the field value to a variable
                                                                                if (dataRecieved.check) {
                                                                                    for (let y = 0; y < this.selectedRecords.length; y++) {
                                                                                        console.log('y ' + y);
                                                                                        console.log('selected ' + JSON.stringify(this.selectedRecords[y].Id));
                                                                                        let updatedItem = { Id: this.selectedRecords[y].Id, [Fields]: accountIdVal  }; //creates a draft value using the record id and field name
                                                                                        event.stopPropagation(); //prevents the event form bubbling up through the DOM
                                                                                        this.updateDraftValues(updatedItem); //runs the event to create a draft value
                                                                                        this.updateDataValues(updatedItem); //runs the event to create a data value
                                                                                    }
                                                                                }
                                                                                else {
                                                                                    let updatedItem = { Id: dataRecieved.context, [Fields]: accountIdVal  }; //creates a draft value using the record id and field name
                                                                                    event.stopPropagation(); //prevents the event form bubbling up through the DOM
                                                                                    this.updateDraftValues(updatedItem); //runs the event to create a draft value
                                                                                    this.updateDataValues(updatedItem); //runs the event to create a data value
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }/*
                                                                lookupAssignChanged(event) {
                                                                    console.log('lookup ' + JSON.stringify(event.detail.data));
                                                                    console.log(event.detail.data.context);
                                                                    event.stopPropagation();
                                                                    this.showHeader = true;
                                                                    let dataRecieved = event.detail.data;
                                                                    let accountIdVal = dataRecieved.value != undefined ? dataRecieved.value : null;
                                                                    let updatedItem = { Id: dataRecieved.context, Trainer_Mass_Assign__c: accountIdVal };
                                                                    this.updateDraftValues(updatedItem);
                                                                    this.updateDataValues(updatedItem);
                                                                    ////console.log(this.selectedRecords.length);
                                                                    //let dataRecieved = event.detail.data;
                                                                    //let accountIdVal = dataRecieved.value != undefined ? dataRecieved.value : null;
                                                                    //if (this.selectedRecords.length == 0 || this.selectedRecords.length == undefined || this.selectedRecords.length == null) {
                                                                      //  let updatedItem = { Id: dataRecieved.context, Trainer__c: accountIdVal };
                                                                      //  this.updateDraftValues(updatedItem);
                                                                        ////console.log(updatedItem);
                                                                   // }
                                                                   // else {
                                                                   //     for (const record of this.selectedRecords) {
                                                                           // let updatedItem = {
                                                                           //     Id: record.Id,
                                                                           //     Trainer__c: accountIdVal
                                                                       //     };
                                                                        //    this.updateDraftValues(updatedItem);
                                                                     //   };
                                                                   // };
                                                                }*/
    //updates datatable when lookup field (school) is changed
    /*lookupProductChanged(event) {
        console.log('lookup ' + JSON.stringify(event.detail.data));
        console.log(event.detail.data.context);
        event.stopPropagation();
        this.showHeader = true;
        let dataRecieved = event.detail.data;
        let accountIdVal = dataRecieved.value != undefined ? dataRecieved.value : null;
        let updatedItem = { Id: dataRecieved.context, 	Training_Product_Delivered__c: accountIdVal };
        //this.updateDraftValues(updatedItem);
        //this.updateDataValues(updatedItem);
        ////console.log(this.selectedRecords.length);
        //let dataRecieved = event.detail.data;
        //let accountIdVal = dataRecieved.value != undefined ? dataRecieved.value : null;
        //if (this.selectedRecords.length == 0 || this.selectedRecords.length == undefined || this.selectedRecords.length == null) {
            //  let updatedItem = { Id: dataRecieved.context, Trainer__c: accountIdVal };
            //  this.updateDraftValues(updatedItem);
            ////console.log(updatedItem);
        // }
        // else {
        //     for (const record of this.selectedRecords) {
                // let updatedItem = {
                //     Id: record.Id,
                //     Trainer__c: accountIdVal
            //     };
            //    this.updateDraftValues(updatedItem);
            //   };
        // };
    }*/
    
    //cancel button
    handleCancel() {
        console.log("cancel");
        this.showHeader = false; //hides the custom save/cancel header
        this.draftValues = []; //clears the draftValues array
        this.serviceAppointments = this.lastSavedData; //reverts the changed data back to the last saved data
        console.log("this.lastSavedData: ", this.lastSavedData);
        console.log("this.serviceAppointments: ", this.serviceAppointments);
    }

    //updates selected rows based on field values when edit button is clicked
    updateProducts() {
        this.showSpinner = true;
        this.changedValues = this.selectedRecords.map(item => ({ Id: item.Id}));
        console.log(this.changedValues); //the selected values to be changed
        this.changedValues.forEach(item => {
            for (const field in this.massFields) {
                if (this.massFields.hasOwnProperty(field)) {
                    const value = this.massFields[field];
                    if (value !== null && value !== undefined) {
                        //field represents the key, value represents the value
                        item[field] = value;
                    }
                }
            }
        })
        console.log(this.changedValues);
        // Create an array to store the promises for each updateRecord call
        const promises = [];
        // Loop through the updatedRecords array and call updateRecord for each record
        this.changedValues.forEach(record => {
            this.updateDataValues(record);
            const recordfields = {
                fields: record
            }
            console.log(recordfields);
            promises.push(
                updateRecord(recordfields)
                    .then(() => {
                        console.log('Record updated successfully');
                        this.showToast('Success', 'Records Updated Successfully!', 'success', 'dismissable');
                        this.draftValues = [];
                        refreshApex(this.refreshData);
                        // Handle success
                    })
                    .catch(error => {
                        console.error('Error updating record', error);
                        console.log(error);
                        console.log(error.body.output.errors);
                        this.showToast('Error', 'An Error Occured: ' + error.body.output.errors[0].message, 'error', 'dismissable');
                        // Handle error
                    })
            );
        });
        // Wait for all promises to resolve
        Promise.all(promises)
            .then(() => {
                console.log('All records updated successfully');
                // Handle success for all records
            })
            .catch(error => {
                console.error('Error updating records', error);
                // Handle error for all records
            }).finally(() => {
                refreshApex(this.refreshData);
                this.showSpinner = false;
            });
        this.changedValues = [];
    }

    handleHeaderAction (event) { //used to enable custom header actions for columns
        const actionName = event.detail.action.name; // Retrieves the name of the selected filter
        const colDef = event.detail.columnDefinition;
        const columnIndex = this.columns.findIndex((column) => column.label === event.detail.columnDefinition.label); //creates a var for the index of the column that we have selected
        const columns = this.columns; //creates a copy of the table columns
        if (this.columns[columnIndex].actions[0].checked == false) { //runs if the first action of the column at index columnIndex is currently not checked
            this.columns[columnIndex].initialWidth = 50; //sets the width of the column to 50px
            this.columns[columnIndex].actions[0].checked = true; //sets the first action of the column to checked
            this.columns = [...this.columns]; //rewrites the column data to ensure the changes are made
        } else if (this.columns[columnIndex].actions[0].checked == true) { //runs if the first action of the column at index columnIndex is currently checked
            this.columns[columnIndex].initialWidth = 150; //sets the width of the column to 150px
            this.columns[columnIndex].actions[0].checked = false; //sets the first action of the column to unchecked
            this.columns = [...this.columns]; //rewrites the column data to ensure changes are made
        }
    }
    
    detailsLabel = "Expand Record Details"
    handleDetailToggle (){
        if (this.detailsLabel == "Expand Record Details") {
            this.detailsLabel = "Collapse Record Details"
            for (let i=1; i < 12; i++) {
                this.columns[i].initialWidth = 150;
                this.columns = [...this.columns];
            }
        }
        else {
            this.detailsLabel = "Expand Record Details"
            for (let i=1; i < 12; i++) {
                this.columns[i].initialWidth = 50;
                this.columns = [...this.columns];
            }
        }
    }
    trainingLabel = "Expand Training Details"
    handleTrainingToggle (){
        if (this.trainingLabel == "Expand Training Details") {
            this.trainingLabel = "Collapse Training Details"
            for (let i=12; i < 18; i++) {
                this.columns[i].initialWidth = 150;
                this.columns = [...this.columns];
            }
        }
        else {
            this.trainingLabel = "Expand Training Details"
            for (let i=12; i < 18; i++) {
                this.columns[i].initialWidth = 50;
                this.columns = [...this.columns];
            }
        }
    }
    accountLabel = "Expand Account Contact Information"
    handleAccountToggle (){
        if (this.accountLabel == "Expand Account Contact Information") {
            this.accountLabel = "Collapse Account Contact Information"
            for (let i=18; i < 25; i++) {
                this.columns[i].initialWidth = 150;
                this.columns = [...this.columns];
            }
        }
        else {
            this.accountLabel = "Expand Account Contact Information"
            for (let i=18; i < 25; i++) {
                this.columns[i].initialWidth = 50;
                this.columns = [...this.columns];
            }
        }
    }
    sessionLabel = "Expand Session Details"
    handleSessionToggle (){
        if (this.sessionLabel == "Expand Session Details") {
            this.sessionLabel = "Collapse Session Details"
            for (let i=25; i < 35; i++) {
                this.columns[i].initialWidth = 150;
                this.columns = [...this.columns];
            }
        }
        else {
            this.sessionLabel = "Expand Session Details"
            for (let i=25; i < 35; i++) {
                this.columns[i].initialWidth = 50;
                this.columns = [...this.columns];
            }
        }
    }
    addressLabel = "Expand Address Information"
    handleAddressToggle (){
        if (this.addressLabel == "Expand Address Information") {
            this.addressLabel = "Collapse Address Information"
            for (let i=35; i <= 43; i++) {
                this.columns[i].initialWidth = 150;
                this.columns = [...this.columns];
            }
        }
        else {
            this.addressLabel = "Expand Address Information"
            for (let i=36; i <= 43; i++) {
                this.columns[i].initialWidth = 50;
                this.columns = [...this.columns];
            }
        }
    }

    handleSectionToggle() {
        console.log('toggle');
    }

/*************************************************************************************/
    //call this function to display a toast message to the user
    showToast(title, message, variant, mode) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode: mode
        });
        this.dispatchEvent(evt);
    }
}