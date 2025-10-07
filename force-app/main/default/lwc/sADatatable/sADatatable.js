import { LightningElement, wire } from 'lwc';
import getServiceAppointments from '@salesforce/apex/ServiceAppointmentMassEditController.getServiceAppointments';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import updateRecords from '@salesforce/apex/ServiceAppointmentMassEditController.updateRecords';
import SERVICE_APPOINTMENT from '@salesforce/schema/ServiceAppointment';
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
import CONTACT_FIELD from '@salesforce/schema/ServiceAppointment.ContactId';
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
import WORK_ORDER_FIELD from '@salesforce/schema/ServiceAppointment.Work_Order__c'

const columns = [
    { 
        label: 'Name', type: 'lookupColumn', fieldName: 'Id',
        typeAttributes: { 
            recordId: { fieldName: "Id"},
            fieldApiName: "Id",
            nameField: "ServiceAppointment.AppointmentNumber"
        }, 
        editable: false, initialWidth: 150, hideDefaultActions: true,
        actions: [{ label: 'Collapse', checked: false, name: 'collapsed' }] 
    },
    { 
        label: 'Account', type: 'lookupColumn', fieldName: 'AccountId',
        typeAttributes: { 
            recordId: { fieldName: "AccountId"},
            fieldApiName: "AccountId",
            nameField: "Account.Name"
        }, 
        editable: false, initialWidth: 50, hideDefaultActions: true,
        actions: [{ label: 'Collapse', checked: false, name: 'collapsed' }] 
    },
    { 
        label: 'Work Order', type: 'lookupColumn', fieldName: 'Work_Order__c',
        typeAttributes: { 
            recordId: { fieldName: "Work_Order__c"},
            fieldApiName: "Work_Order__c",
            nameField: "WorkOrder.WorkOrderNumber"
        }, 
        editable: false, initialWidth: 50, hideDefaultActions: true,
        actions: [{ label: 'Collapse', checked: false, name: 'collapsed' }] 
    },
    { 
        label: 'Work Order Line Item', type: 'lookupColumn', fieldName: 'Work_Order_Line_Item__c',
        typeAttributes: { 
            recordId: { fieldName: "Work_Order_Line_Item__c"},
            fieldApiName: "Work_Order_Line_Item__c",
            nameField: "WorkOrderLineItem.LineItemNumber"
        }, 
        editable: false, initialWidth: 50, hideDefaultActions: true,
        actions: [{ label: 'Collapse', checked: false, name: 'collapsed' }] 
    },
    { 
        label: 'Training Product Delivered', type: 'lookupColumn', fieldName: 'Training_Product_Delivered__c',
        typeAttributes: { 
            recordId: { fieldName: "Training_Product_Delivered__c"},
            fieldApiName: "Training_Product_Delivered__c",
            nameField: "Product2.Name"
        }, 
        editable: false, initialWidth: 50, hideDefaultActions: true,
        actions: [{ label: 'Collapse', checked: false, name: 'collapsed' }] 
    },
    { 
        label: 'Description', type: 'text', fieldName: 'Description',
        editable: false, initialWidth: 50, hideDefaultActions: true,
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }]
    },
    { 
        label: 'Scheduled Start', type: "date-local", fieldName: 'SchedStartTime', 
        typeAttributes: {
            month: "2-digit", 
            day: "2-digit"
        }, 
        editable: false, initialWidth: 50, hideDefaultActions: true,
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }]
    },
    { 
        label: 'Customer Local Start', type: "text", fieldName: 'Scheduled_Customer_Start__c', 
        editable: false, initialWidth: 50, hideDefaultActions: true,
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }]
    },
    { 
        label: 'Status', type: "text", fieldName: 'Status', 
        editable: false, initialWidth: 50, hideDefaultActions: true,
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }]
    },
    { 
        label: 'Scheduling Status',  type: 'picklistColumn', fieldName: 'Schedulers_Status__c', 
        typeAttributes: { 
            options: { 
                fieldName: 'schedulingOptions' 
            }, 
            multiSelect: false
        },
        editable: true, initialWidth: 50, hideDefaultActions: true, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }]
    },
    { 
        label: 'Trainer to Assign', type: 'lookupColumn', fieldName: 'Trainer_Mass_Assign__c',
        typeAttributes: { 
            recordId: { fieldName: "Trainer_Mass_Assign__c"},
            fieldApiName: "Trainer_Mass_Assign__c",
            nameField: "User.Name"
        }, 
        editable: false, initialWidth: 50, hideDefaultActions: true,
        actions: [{ label: 'Collapse', checked: false, name: 'collapsed' }] 
    },
    { 
        label: 'Trainer', type: 'lookupColumn', fieldName: 'Trainer__c',
        typeAttributes: { 
            recordId: { fieldName: "Trainer__c"},
            fieldApiName: "Trainer__c",
            nameField: "User.Name"
        }, 
        editable: false, initialWidth: 50, hideDefaultActions: true,
        actions: [{ label: 'Collapse', checked: false, name: 'collapsed' }] 
    },
    { 
        label: 'Date to Schedule', type: "date-local", fieldName: 'Date_to_Schedule__c', 
        typeAttributes: {
            month: "2-digit", 
            day: "2-digit"
        }, 
        editable: true, initialWidth: 50, hideDefaultActions: true,
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }]
    },
    { 
        label: 'Preferred Training Date', type: "date-local", fieldName: 'Preferred_Training_Date_1__c', 
        typeAttributes: {
            year: "numeric",
            month: "2-digit", 
            day: "2-digit",
            timeZone: "UTC"
        }, 
        editable: true, initialWidth: 50, hideDefaultActions: true,
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }]
    },
    { 
        label: 'Required Start Time',  type: 'picklistColumn', fieldName: 'Required_Local_Start_Time__c', 
        typeAttributes: { 
            options: { 
                fieldName: 'reqStartOptions' 
            }, 
            multiSelect: false
        },
        editable: true, initialWidth: 50, hideDefaultActions: true, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }]
    },
    { 
        label: 'Required End Time',  type: 'picklistColumn', fieldName: 'Required_Local_End_Time__c', 
        typeAttributes: { 
            options: { 
                fieldName: 'reqEndOptions' 
            }, 
            multiSelect: false
        },
        editable: true, initialWidth: 50, hideDefaultActions: true, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }]
    },
    { 
        label: 'Training Type',  type: 'picklistColumn', fieldName: 'Training_Type__c', 
        typeAttributes: { 
            options: { 
                fieldName: 'trainingTypeOptions' 
            }, 
            multiSelect: false
        },
        editable: true, initialWidth: 50, hideDefaultActions: true, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }]
    },
    { 
        label: 'Service Appoint. Notes', type: "text", fieldName: 'SA_Notes__c', 
        editable: true, initialWidth: 50, hideDefaultActions: true,
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }] 
    },
    { 
        label: 'Contact', type: 'lookupColumn', fieldName: 'ContactId',
        typeAttributes: { 
            recordId: { fieldName: "ContactId"},
            fieldApiName: "ContactId",
            nameField: "Contact.Name"
        }, 
        editable: true, initialWidth: 50, hideDefaultActions: true,
        actions: [{ label: 'Collapse', checked: false, name: 'collapsed' }] 
    },
    { 
        label: 'Training Contact Information', type: "text", fieldName: 'Training_Contact_Information__c', 
        editable: true, initialWidth: 50, hideDefaultActions: true,
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }]
    },
    { 
        label: 'Assigned PD Strategist', type: 'lookupColumn', fieldName: 'Assigned_PD_Strategist__c',
        typeAttributes: { 
            recordId: { fieldName: "Assigned_PD_Strategist__c"},
            fieldApiName: "Assigned_PD_Strategist__c",
            nameField: "User.Name"
        }, 
        editable: true, initialWidth: 50, hideDefaultActions: true,
        actions: [{ label: 'Collapse', checked: false, name: 'collapsed' }] 
    },
    { 
        label: 'Multi-Trainer Event Lead', type: 'lookupColumn', fieldName: 'Multi_Trainer_Event_Lead__c',
        typeAttributes: { 
            recordId: { fieldName: "Multi_Trainer_Event_Lead__c"},
            fieldApiName: "Multi_Trainer_Event_Lead__c",
            nameField: "User.Name"
        }, 
        editable: true, initialWidth: 50, hideDefaultActions: true,
        actions: [{ label: 'Collapse', checked: false, name: 'collapsed' }] 
    },
    { 
        label: 'Multi-Trainer Event', type: "boolean", fieldName: 'Multi_Trainer_Event__c', 
        editable: true, initialWidth: 50, hideDefaultActions: true,
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }]
    },
    { 
        label: 'Multi-Trainer Event Details', type: "text", fieldName: 'Multi_Trainer_Event_Details__c',
        editable: true, initialWidth: 50, hideDefaultActions: true,
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }]
    },
    { 
        label: 'PLS Confirmation Email Status',  type: 'picklistColumn', fieldName: 'PLS_Confirmation_status__c', 
        typeAttributes: { 
            options: { 
                fieldName: 'plsOptions' 
            }, 
            multiSelect: false
        },
        editable: true, initialWidth: 50, hideDefaultActions: true, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }]
    },
    { 
        label: 'Attendees Type',  type: 'picklistColumn', fieldName: 'Type_of_Attendees__c', 
        typeAttributes: { 
            options: { 
                fieldName: 'pickListOptions' 
            }, 
            multiSelect: true
        },
        editable: true, initialWidth: 50, hideDefaultActions: true, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }]
    },
    { 
        label: 'Participating Grades',  type: 'picklistColumn', fieldName: 'Participating_Grades__c', 
        typeAttributes: { 
            options: { 
                fieldName: 'pickListOptionsGrade' 
            }, 
            multiSelect: true
        },
        editable: true, initialWidth: 50, hideDefaultActions: true, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }]
    },
    { 
        label: 'Number of Attendees', type: "number", fieldName: 'Number_of_Attendees__c',
        editable: true, initialWidth: 50, hideDefaultActions: true,
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }]
    },
    { 
        label: 'Virtual Training Link', type: "text", fieldName: 'Virtual_Training_Link__c',
        editable: true, initialWidth: 50, hideDefaultActions: true,
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }]
    },
    { 
        label: 'Digital Entitlement Licenses', type: "text", fieldName: 'Digital_Entitlement_Licenses__c',
        editable: true, initialWidth: 50, hideDefaultActions: true,
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }]
    },
    { 
        label: 'Additional Information', type: "text", fieldName: 'Additional_Information__c',
        editable: true, initialWidth: 50, hideDefaultActions: true,
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }]
    },
    { 
        label: 'Subject', type: "text", fieldName: 'Subject',
        editable: true, initialWidth: 50, hideDefaultActions: true,
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }]
    },
    { 
        label: 'Session Topic', type: "text", fieldName: 'Session_Topic__c',
        editable: true, initialWidth: 50, hideDefaultActions: true,
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }]
    },
    { 
        label: 'Session Value', type: "number", fieldName: 'Session_Value__c',
        typeAttributes: {
            step: '0.01',
            minimumFractionDigits: '2', 
            maximumFractionDigits: '2'
        },
        editable: true, initialWidth: 50, hideDefaultActions: true,
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }]
    },
    { 
        label: 'Digital Experience (IC)', type: "boolean", fieldName: 'Digital_Experience_IC__c', 
        editable: true, initialWidth: 50, hideDefaultActions: true,
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }]
    },
    { 
        label: 'Training Location', type: "text", fieldName: 'Training_Location__c',
        editable: true, initialWidth: 50, hideDefaultActions: true,
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }]
    },
    { 
        label: 'Training Location Status',  type: 'picklistColumn', fieldName: 'Training_Location_Status__c', 
        typeAttributes: { 
            options: { 
                fieldName: 'locationStatusOptions' 
            }, 
            multiSelect: false
        },
        editable: true, initialWidth: 50, hideDefaultActions: true, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }]
    },
    { 
        label: 'Shipping Street', type: "text", fieldName: 'Shipping_Street__c',
        editable: true, initialWidth: 50, hideDefaultActions: true,
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }]
    },
    { 
        label: 'Shipping City', type: "text", fieldName: 'Shipping_City__c',
        editable: true, initialWidth: 50, hideDefaultActions: true,
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }]
    },
    { 
        label: 'Shipping Postal Code', type: "text", fieldName: 'Shipping_Postal_Code__c',
        editable: true, initialWidth: 50, hideDefaultActions: true,
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }]
    },
    { 
        label: 'Shipping State', type: "text", fieldName: 'Shipping_State__c',
        editable: true, initialWidth: 50, hideDefaultActions: true,
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }]
    },
    { 
        label: 'Shipping Country', type: "text", fieldName: 'Shipping_Country__c',
        editable: true, initialWidth: 50, hideDefaultActions: true,
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }]
    },
    { 
        label: 'Shipping Status',  type: 'picklistColumn', fieldName: 'Shipping_Status__c', 
        typeAttributes: { 
            options: { 
                fieldName: 'shippingStatusOptions' 
            }, 
            multiSelect: false
        },
        editable: true, initialWidth: 50, hideDefaultActions: true, 
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }]
    },
    { 
        label: 'Special Shipping Instructions', type: "text", fieldName: 'Special_Shipping_Instructions__c',
        editable: true, initialWidth: 50, hideDefaultActions: true,
        actions: [{ label: 'Collapse', checked: true, name: 'collapsed' }]
    }
]

export default class MassEditTable extends LightningElement {
    columns = columns;
    data = [];
    cachedData = [];

    disabled = true;
    //Loading spinner over mass edit sections
    showSpinner = true;
    //Loading spinner over table
    isLoading = true;

    rowLimit = 20;
    rowOffSet = 0;

    pickListOptions;

    draftValues = [];
    selectedRecords = [];

    _selectedType = [];
    _selectedGrades = [];

    wiredResult;

    parentAccountSelectedRecord;
    handleValueSelectedOnAccount(event) {
        this.parentAccountSelectedRecord = event.detail;
    }

    get showButtonBar() {
        return this.changedRows?.length > 0;
    }

    hideTimeout;
    
    plsOptions;
    statusOptions;
    shippingStatusOptions;
    schedulingOptions;
    trainingTypeOptions;
    reqStartOptions;
    reqEndOptions;
    locationStatusOptions;
    multiTrainerOptions = [
        { label: "--None--", value: null },
        { label: "Checked", value: "true" },
        { label: "Unchecked", value: "false" },
    ];
    digitalOptions = [
        { label: "--None--", value: null },
        { label: "Checked", value: "true" },
        { label: "Unchecked", value: "false" },
    ];

    /*Table Filters*/   
    workOrderFilter = '';
    statusFilter = '';
    accountFilter = '';
    productFamilyFilter = '';

    //work order filter changed
    workOrderFilterChange(event) {
        this.workOrderFilter = event.target.value;
        console.log("this.workOrderFilter: ", this.workOrderFilter);
        this.rowOffSet = 0;
        this.data = [];
        this.showSpinner = true;
        this.isLoading = true;
    }

    //status filter changed
    statusFilterChange(event) {
        this.statusFilter = event.target.value;
        console.log("this.statusFilter: ", this.statusFilter);
        this.rowOffSet = 0;
        this.data = [];
        this.showSpinner = true;
        this.isLoading = true;
    }

    //account filter changed
    accountFilterChange(event) {
        this.accountFilter = event.target.value;
        console.log("this.accountFilter: ", this.accountFilter);
        this.rowOffSet = 0;
        this.data = [];
        this.showSpinner = true;
        this.isLoading = true;
    }

    //event to handle user typing in product family search box
    productFamilyFilterChange(event) {
        clearTimeout(this.typingTimer);
        let value = event.target.value;
        this.rowOffSet = 0;
        this.data = [];
        this.showSpinner = true;
        this.isLoading = true;
        this.typingTimer = setTimeout(() => {
            this.productFamilyFilter = value;
        }, 500);
    }

    @wire(getServiceAppointments, { limitSize: "$rowLimit" , offset: 0, statusFilter: "$statusFilter", workOrder: "$workOrderFilter", productFamily: "$productFamilyFilter", accountId: "$accountFilter" })
    wiredServiceAppointments(result) {
        this.wiredResult = result;
        if (result.data) {
            const data = JSON.parse(JSON.stringify(result.data));
            data.forEach(SA => {
                SA.shippingStatusOptions = this.shippingStatusOptions;
                SA.statusOptions = this.statusOptions;
                SA.schedulingOptions = JSON.parse(JSON.stringify(this.schedulingOptions))
                SA.trainingTypeOptions = this.trainingTypeOptions;
                SA.reqStartOptions = this.reqStartOptions;
                SA.reqEndOptions = this.reqEndOptions;
                SA.plsOptions = this.plsOptions;
                SA.pickListOptions = this.pickListOptions;
                SA.pickListOptionsGrade = this.pickListOptionsGrade;
                SA.locationStatusOptions = this.locationStatusOptions;
            });

            this.data = [...data];
            this.cachedData = JSON.parse(JSON.stringify(data));
            console.table(this.data);
        } else if (result.error) {
            this.errorMessage = result.error;
            console.error("Error fetching data: ", result.error);
        }

        this.rowOffSet = this.rowLimit;
        clearTimeout(this.hideTimeout);
        // Wait ~2 seconds before hiding spinner
        this.hideTimeout = setTimeout(() => {
            this.showSpinner = false;
            this.isLoading = false;
        }, 2000);
    }

    async loadMoreData(event) {
        if (this.isLoading) return;
        this.isLoading = true;

        try {
            const result = await getServiceAppointments({ limitSize: this.rowLimit , offset: this.rowOffSet, statusFilter: this.statusFilter, workOrder: this.workOrderFilter, productFamily: this.productFamilyFilter, accountId: this.accountFilter });
            if (result.length > 0) {
                const newData = JSON.parse(JSON.stringify(result));
                newData.forEach(SA => {
                    SA.shippingStatusOptions = this.shippingStatusOptions;
                    SA.statusOptions = this.statusOptions;
                    SA.schedulingOptions = JSON.parse(JSON.stringify(this.schedulingOptions))
                    SA.trainingTypeOptions = this.trainingTypeOptions;
                    SA.reqStartOptions = this.reqStartOptions;
                    SA.reqEndOptions = this.reqEndOptions;
                    SA.plsOptions = this.plsOptions;
                    SA.pickListOptions = this.pickListOptions;
                    SA.pickListOptionsGrade = this.pickListOptionsGrade;
                    SA.locationStatusOptions = this.locationStatusOptions;
                });
                const tempData = [...this.data, ...newData];
                this.data = [...tempData];
                this.cachedData = JSON.parse(JSON.stringify(tempData));
                this.rowOffSet += result.length;
            } else {
                this.template.querySelector('[data-type="customTable"]').enableInfiniteLoading = false;
            }
        } catch (error) {
            console.error(error);
        }

        this.isLoading = false;
    }

    objectApiName = SERVICE_APPOINTMENT;

    //An array of fields sorted into sections
    organizedFields = [
        {
            label: "Training Details",
            name: 'trainingDetails',
            buttonLabel: 'Expand Training Details',
            fields: [
                { apiName: DATE_TO_SCHEDULE_FIELD, value: null },
                { apiName: PREF_DATE_FIELD, value: null },
                { apiName: REQ_START_FIELD, value: null },
                { apiName: REQ_END_FIELD, value: null },
                { apiName: TRAINING_FIELD, value: null },
                { apiName: NOTES_FIELD, value: null }
            ]
        },
        {
            label: "Account Contact Information",
            name: "accountContactInformation",
            buttonLabel: 'Expand Account Contact Information',
            fields: [
                { apiName: CONTACT_FIELD, value: null },
                { apiName: TRAINING_INFO_FIELD, value: null },
                { apiName: ASSIGN_STRAT_FIELD, value: null },
                { apiName: EVENT_LEAD_FIELD, value: null },
                { apiName: MULTI_TRAINER_FIELD, name: 'Multi-Trainer Event', value: null, typeBool: true },
                { apiName: MULTI_DETAIL_FIELD, value: null },
                { apiName: PLS_FIELD, value: null }
            ]
        },
        {
            label: "Session Details",
            name: "sessionDetails",
            buttonLabel: 'Expand Session Details',
            fields: [
                { apiName: ATTENDEES_TYPE_FIELD, value: null },
                { apiName: GRADE_FIELD, value: null },
                { apiName: ATTENDEES_FIELD, value: null },
                { apiName: VIRTUAL_FIELD, value: null },
                { apiName: LICENSES_FIELD, value: null },
                { apiName: INFORMATION_FIELD, value: null },
                { apiName: SUBJECT_FIELD, value: null },
                { apiName: SESSION_TOPIC_FIELD, value: null },
                { apiName: DIGITAL_FIELD, name: 'Digital Experience (IC)', value: null, typeBool: true },
                { apiName: SESSION_VAL_FIELD, value: null }
            ]
        },
        {
            label: "Address Information",
            name: "addressInformation",
            buttonLabel: 'Expand Address Information',
            fields: [
                { apiName: TRAINING_LOCATION_FIELD, value: null },
                { apiName: LOCATION_FIELD, value: null },
                { apiName: STREET_FIELD, value: null },
                { apiName: CITY_FIELD, value: null },
                { apiName: POSTAL_FIELD, value: null },
                { apiName: STATE_FIELD, value: null },
                { apiName: COUNTRY_FIELD, value: null },
                { apiName: SHIPPING_STATUS_FIELD, value: null },
                { apiName: INSTRUCTION_FIELD, value: null }
            ]
        }
    ];

    toggleColumns(e) {
        const sectionName = e.target.dataset.id;
        const sectionDetails = this.organizedFields.find(i => i.name === sectionName);

        if (sectionDetails) {
            if (sectionDetails.buttonLabel.startsWith('Expand')) {
                sectionDetails.buttonLabel = `Collapse ${sectionDetails.label}`;

                sectionDetails.fields.forEach(field => {
                    const matchingColumn = this.columns.find(c => c.fieldName === field.apiName.fieldApiName);
                    matchingColumn.initialWidth = 150;
                });
            } else {
                sectionDetails.buttonLabel = `Expand ${sectionDetails.label}`;

                sectionDetails.fields.forEach(field => {
                    const matchingColumn = this.columns.find(c => c.fieldName === field.apiName.fieldApiName);
                    matchingColumn.initialWidth = 50;
                });
            }
        }

        //trigger reactivity
        this.organizedFields = [...this.organizedFields];
        this.columns = [...this.columns];
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

    booleanOptions = [
        { label: '--None--', value: null },
        { label: 'True', value: 'true' },
        { label: 'False', value: 'false' }
    ];

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

    pickListOptionsGrade;

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

    //Lists the changed fields in the mass edit section as key value pairs like {Date: '1/1/2001', Phone: '111-111-1111', Email: 'google@gmail.com'}
    changedFields = {};

    handleFieldChange(e) {
        this.massEditFieldsChanged(e.target.fieldName, e.target.value);
    }

    handleBooleanChange(e) {
        this.massEditFieldsChanged(e.currentTarget.name, e.detail.value);
    }

    massEditFieldsChanged(fieldName, fieldValue) {
        console.log('Field ' + fieldName + ' was changed to: ' + fieldValue);

        //Check for nulls, undefined, and empty strings
        const isEmpty =
            fieldValue === null ||
            fieldValue === undefined ||
            (typeof fieldValue === 'string' && fieldValue.trim() === '');

        if (isEmpty) {
            const { [fieldName]: removed, ...remaining } = this.changedFields;
            this.changedFields = remaining;
        } else {
            this.changedFields = {
                ...this.changedFields,
                [fieldName]: fieldValue
            };
        }

        //console.log('Changed fields: ', this.changedFields);
    }

    clearFields() {
        //Reset the values in the organized fields array
        this.organizedFields.forEach(section => {
            section.fields.forEach(field => {
                field.value = null
                //Update the changedFields array
                this.massEditFieldsChanged(field.apiName.fieldApiName, null);
            });
        });
        this.organizedFields = [...this.organizedFields];

        //Reset the values in the HTML
        const inputFields = this.template.querySelectorAll('[data-type="massEditFields"]');
        if (inputFields) {
            inputFields.forEach(field => {
                field.value = null;
            });
        }
    }

    //Stores the Inline Edit values as an array or objects like [{Id: '123', Name: 'Bill'},{Id: '456', Name: 'Ted'}]
    changedRows = [];

    handleCellChange(e) {
        const draftValues = [...e.detail.draftValues];
        draftValues.forEach(record => {this.inlineEditChanges(record)});
    }

    inlineEditChanges(draftValue) {
        const changedRows = [...this.changedRows];
        const existingDraftRecord = changedRows.find(row => row.Id === draftValue.Id);

        if(existingDraftRecord) {
            Object.keys(draftValue).forEach(field => {
                if (field !== 'Id') {
                    existingDraftRecord[field] = draftValue[field];
                }
            });
        } else {
            changedRows.push({...draftValue});
        }

        const tableRow = this.data.find(row => row.Id === draftValue.Id);
        Object.keys(draftValue).forEach(field => {
            if (field !== 'Id') {
                tableRow[field] = draftValue[field];
            }
        });

        this.changedRows = [...changedRows];
        console.table(this.changedRows);
    }

    handleCancel() {
        this.changedRows = [];
        this.draftValues = [];
        this.data = JSON.parse(JSON.stringify(this.cachedData));
    }

    handleSave() {
        this.updateRecords(this.changedRows);
    }

    selectedRowIds = [];

    //handles selection of row using checkbox
    handleRowSelection(e) {
        const selectedRows = [...e.detail.selectedRows];
       
        this.selectedRowIds = [...new Set(selectedRows.map(row => row.Id))];
        this.selectedRowIds.length > 0 ? this.disabled = false : this.disabled = true;
    }  
    
    //After fields are edited from the mass edit sections; merge the collections of new values and selected rows
    createDraftRecords() {
        const draftRecords = this.selectedRowIds.map(id => ({
            Id: id,
            ...this.changedFields
        }));
        this.updateRecords(draftRecords);
    }

    updateRecords(draftRecords) {
        this.showSpinner = true;
        this.isLoading = true;
        if(draftRecords?.length > 0) {
            console.log('Table of records about to be updated: ');
            console.table(draftRecords);
            //Only return the results that have an Id and at least one other field
            const recordsToUpdate = draftRecords.filter(record => {
                const fields = Object.keys(record);
                return (fields.length > 1 && fields.includes('Id'));
            });
    
            if(recordsToUpdate.length > 0) {
                updateRecords({ records: recordsToUpdate })
                    .then(results => {
                        const successCount = results.filter(r => r.success).length;
                        const errorResults = results.filter(r => !r.success);

                        if (successCount > 0) {
                            this.showToast('Success', `${successCount} record${successCount > 1 ? 's' : ''} updated successfully`, 'success', 'dismissible');
                        }

                        if (errorResults.length > 0) {
                            let errorMessage = errorResults
                                .map(r => `Record ${r.recordId} failed to update: ${r.errorMessages.join('; ')}`)
                                .join(', ');
                            
                            this.showToast('Error', errorMessage, 'error', 'sticky');
                        }
                    })
                    .catch(error => {
                        this.showToast('Error', 'Apex error: ' + error, 'error', 'sticky');
                        console.error('Apex call failed: ', error);
                    })
                    .finally(() => {
                        this.showSpinner = false;
                        this.isLoading = false;
                        refreshApex(this.wiredResult);
                    });
            } else {
                this.showToast('Error', 'No fields were edited. Please update the value of at least one field.', 'error', 'sticky');
                console.log('"draftRecords" either didnt contain any Ids, or had no fields to update: ' + draftRecords);
                this.showSpinner = false;
                this.isLoading = false;
            }
        } else {
            this.showToast('Error', 'No records selected to be updated. Please select at least row on the table below.', 'error', 'sticky');
            console.log('0 records were included in "draftRecords": ' + draftRecords);
            this.showSpinner = false;
            this.isLoading = false;
        }

        this.changedRows = [];
        this.draftValues = [];
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