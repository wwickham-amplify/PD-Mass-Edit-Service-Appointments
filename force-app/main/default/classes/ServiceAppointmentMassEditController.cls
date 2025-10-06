public without sharing class ServiceAppointmentMassEditController {
    @AuraEnabled
    public static List<UpdateResultWrapper> updateRecords(List<SObject> records) {
        List<UpdateResultWrapper> results = new List<UpdateResultWrapper>();

        if (records == null || records.isEmpty()) {
            return results;
        }

        Database.SaveResult[] saveResults = Database.update(records, false);

        for (Integer i = 0; i < saveResults.size(); i++) {
            Database.SaveResult sr = saveResults[i];
            UpdateResultWrapper wrap = new UpdateResultWrapper();
            wrap.recordId = (String)records[i].get('Id');
            wrap.success  = sr.isSuccess();

            if (!sr.isSuccess() && sr.getErrors().size() > 0) {
                wrap.errorMessages = new List<String>();
                for (Database.Error e : sr.getErrors()) {
                    wrap.errorMessages.add(e.getMessage());
                }
            }

            results.add(wrap);
        }

        return results;
    }

    public class UpdateResultWrapper {
        @AuraEnabled public String recordId;
        @AuraEnabled public Boolean success;
        @AuraEnabled public List<String> errorMessages;
    }

    @AuraEnabled(Cacheable=true)
    public static List<ServiceAppointment> getServiceAppointments(Integer limitSize, String accountId, Integer offset, String statusFilter, String workOrder, String productFamily){
        String query;
        String condition = (String.isNotBlank(statusfilter) ? ' Status = \'' + statusfilter + '\' ': '');

        condition += (String.isNotBlank(workOrder) ? (String.isNotBlank(condition) ? + ' AND ' : '') +
        ' Work_Order__c = \'' + workOrder + '\' ' : '');
        condition += (String.isNotBlank(accountId) ? (String.isNotBlank(condition) ? + ' AND ' : '') +
        ' AccountId = \'' + accountId + '\' ' : '');

        condition += (String.isNotBlank(productFamily) ? (String.isNotBlank(condition) ? + ' AND ' : '') +
        ' Product_Family__c LIKE \'%' + productFamily + '%\' ' : '');

        System.debug('condition ' + condition);
        if (String.isNotBlank(condition)) {
            query =
                'SELECT AppointmentNumber, AccountId, Account.Name, Contact.Name, SchedStartTime, Training_Location_Status__c, Scheduled_Customer_Start__c, Training_Product_Delivered__c, Work_Order_Line_Item__c, SA_Notes__c, Status, Schedulers_Status__c, Product_Family__c, Date_to_Schedule__c, Work_Order__c, Preferred_Training_Date_1__c, Trainer_Mass_Assign__c, Required_Local_Start_Time__c, Required_Local_End_Time__c, Session_Topic__c, Subject, Required_Skills__c, Session_Value__c, Training_Type__c, Assigned_PD_Strategist__c, Participating_Grades__c, Type_of_Attendees__c, Number_of_Attendees__c, Description, Training_Contact__c, ContactId, Additional_Information__c, Training_Contact_Information__c, Multi_Trainer_Event__c, Multi_Trainer_Event_Details__c, Multi_Trainer_Event_Lead__c, PLS_Confirmation_status__c, Digital_Experience_IC__c, Digital_Entitlement_Licenses__c, Trainer__c, Virtual_Training_Link__c, Training_Location__c, Shipping_Street__c, Shipping_City__c, Shipping_Postal_Code__c, Shipping_State__c, Shipping_Country__c, Shipping_Status__c, Special_Shipping_Instructions__c FROM ServiceAppointment WHERE ' +
                condition + ' LIMIT :limitSize OFFSET :offset';
        } else {
            query = 'SELECT AppointmentNumber, AccountId, Account.Name, Contact.Name, SchedStartTime, Training_Location_Status__c, Scheduled_Customer_Start__c, Training_Product_Delivered__c, Work_Order_Line_Item__c, SA_Notes__c, Status, Schedulers_Status__c, Product_Family__c, Date_to_Schedule__c, Work_Order__c, Preferred_Training_Date_1__c, Trainer_Mass_Assign__c, Required_Local_Start_Time__c, Required_Local_End_Time__c, Session_Topic__c, Subject, Required_Skills__c, Session_Value__c, Training_Type__c, Assigned_PD_Strategist__c, Participating_Grades__c, Type_of_Attendees__c, Number_of_Attendees__c, Description, Training_Contact__c, ContactId, Additional_Information__c, Training_Contact_Information__c, Multi_Trainer_Event__c, Multi_Trainer_Event_Details__c, Multi_Trainer_Event_Lead__c, PLS_Confirmation_status__c, Digital_Experience_IC__c, Digital_Entitlement_Licenses__c, Trainer__c, Virtual_Training_Link__c, Training_Location__c, Shipping_Street__c, Shipping_City__c, Shipping_Postal_Code__c, Shipping_State__c, Shipping_Country__c, Shipping_Status__c, Special_Shipping_Instructions__c FROM ServiceAppointment LIMIT :limitSize OFFSET :offset';
        }

        List<ServiceAppointment> results = Database.query(query);
        return results;
    }
}