public without sharing class FSL_SA_MASS_Edit {

/*    @AuraEnabled(Cacheable=true)
    public static List<ServiceAppointment> getServiceAppointments(Integer intOffSet){
        try {
            return [SELECT AppointmentNumber, AccountId, Status, Schedulers_Status__c, Date_to_Schedule__c, Preferred_Training_Date_1__c, Required_Local_Start_Time__c, Required_Local_End_Time__c, Session_Topic__c, Subject, Required_Skills__c, Session_Value__c, Training_Type__c, Assigned_PD_Strategist__c, Participating_Grades__c, Type_of_Attendees__c, Number_of_Attendees__c, Description, Training_Contact__c, Training_Contact_Information__c, Multi_Trainer_Event__c, Multi_Trainer_Event_Lead__c, PLS_Confirmation_status__c, Digital_Experience_IC__c FROM ServiceAppointment LIMIT 1 OFFSET : Integer.valueOf( intOffSet )];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }*/ 

    @AuraEnabled

public static Map<Id, String> updateRecords(List<ServiceAppointment> recordsToUpdate) {

    //try {
        //Database.update(recordsToUpdate, false);
        Map<Id, String> errorMap = new Map<Id, String>();
        //List<List<ServiceAppointment>> result = new List<List<ServiceAppointment>>();
        //List<ServiceAppointment> successRecords = new List<ServiceAppointment>();
        //List<ServiceAppointment> failedRecords = new List<ServiceAppointment>();
        List<Database.SaveResult> updateResults = Database.update(recordsToUpdate, false);
        for(Integer i=0;i<updateResults.size();i++){
            if (updateResults.get(i).isSuccess()){
                updateResults.get(i).getId();
                //successRecords.add(recordsToUpdate.get(i));
            }else if (!updateResults.get(i).isSuccess()){
                // DML operation failed
                Database.Error error = updateResults.get(i).getErrors().get(0);
                String failedDML = error.getMessage();
                recordsToUpdate.get(i);//failed record from the list
                errorMap.put(recordsToUpdate.get(i).Id, failedDML);
                //failedRecords.add(recordsToUpdate.get(i));
            }
        }
       // result.add(successRecords);
       // result.add(failedRecords);
        return errorMap;
        //update recordsToUpdate;

    //} catch (Exception e) {

    //    System.debug('Error updating records: ' + e.getMessage());

    //    throw new AuraHandledException('An error occurred while updating records');

    //}

}

    @AuraEnabled(Cacheable=true)
    public static List<ServiceAppointment> getServiceAppointments(Integer limitSize, String accountId, Integer offset, String statusFilter, String workOrder, String productFamily){
        String query;
        String condition = (String.isNotBlank(statusfilter) ? ' Status = \'' + statusfilter + '\' ': '');

        condition += (String.isNotBlank(workOrder) ? (String.isNotBlank(condition) ? + ' AND ' : '') +
        ' Work_Order__c = \'' + workOrder + '\' ' : '');
        //String accountId,
        condition += (String.isNotBlank(accountId) ? (String.isNotBlank(condition) ? + ' AND ' : '') +
        ' AccountId = \'' + accountId + '\' ' : '');

        condition += (String.isNotBlank(productFamily) ? (String.isNotBlank(condition) ? + ' AND ' : '') +
        ' Product_Family__c LIKE \'%' + productFamily + '%\' ' : '');

         //   if (workOrder != null) { // Check if status is provided
          //      condition += (String.isNotBlank(condition) ? ' AND ' : '') +
          //      'Work_Order__r.Id = :' + workOrder;
         //   }

            System.debug('condition ' + condition);
            if (String.isNotBlank(condition)) {
                query =
                   'SELECT AppointmentNumber, AccountId, SchedStartTime, Training_Location_Status__c, Scheduled_Customer_Start__c, Training_Product_Delivered__c, Work_Order_Line_Item__c, SA_Notes__c, Status, Schedulers_Status__c, Product_Family__c, Date_to_Schedule__c, Work_Order__c, Preferred_Training_Date_1__c, Trainer_Mass_Assign__c, Required_Local_Start_Time__c, Required_Local_End_Time__c, Session_Topic__c, Subject, Required_Skills__c, Session_Value__c, Training_Type__c, Assigned_PD_Strategist__c, Participating_Grades__c, Type_of_Attendees__c, Number_of_Attendees__c, Description, Training_Contact__c, ContactId, Additional_Information__c, Training_Contact_Information__c, Multi_Trainer_Event__c, Multi_Trainer_Event_Details__c, Multi_Trainer_Event_Lead__c, PLS_Confirmation_status__c, Digital_Experience_IC__c, Digital_Entitlement_Licenses__c, Trainer__c, Virtual_Training_Link__c, Training_Location__c, Shipping_Street__c, Shipping_City__c, Shipping_Postal_Code__c, Shipping_State__c, Shipping_Country__c, Shipping_Status__c, Special_Shipping_Instructions__c FROM ServiceAppointment WHERE ' +
                   condition + ' LIMIT :limitSize OFFSET :offset';
           } else {
               query = 'SELECT AppointmentNumber, AccountId, SchedStartTime, Training_Location_Status__c, Scheduled_Customer_Start__c, Training_Product_Delivered__c, Work_Order_Line_Item__c, SA_Notes__c, Status, Schedulers_Status__c, Product_Family__c, Date_to_Schedule__c, Work_Order__c, Preferred_Training_Date_1__c, Trainer_Mass_Assign__c, Required_Local_Start_Time__c, Required_Local_End_Time__c, Session_Topic__c, Subject, Required_Skills__c, Session_Value__c, Training_Type__c, Assigned_PD_Strategist__c, Participating_Grades__c, Type_of_Attendees__c, Number_of_Attendees__c, Description, Training_Contact__c, ContactId, Additional_Information__c, Training_Contact_Information__c, Multi_Trainer_Event__c, Multi_Trainer_Event_Details__c, Multi_Trainer_Event_Lead__c, PLS_Confirmation_status__c, Digital_Experience_IC__c, Digital_Entitlement_Licenses__c, Trainer__c, Virtual_Training_Link__c, Training_Location__c, Shipping_Street__c, Shipping_City__c, Shipping_Postal_Code__c, Shipping_State__c, Shipping_Country__c, Shipping_Status__c, Special_Shipping_Instructions__c FROM ServiceAppointment LIMIT :limitSize OFFSET :offset';
               //query = 'SELECT AppointmentNumber, AccountId, Status, Schedulers_Status__c, Product_Family__c, Date_to_Schedule__c, Work_Order__c, Preferred_Training_Date_1__c, Required_Local_Start_Time__c, Required_Local_End_Time__c, Session_Topic__c, Subject, Required_Skills__c, Session_Value__c, Training_Type__c, Assigned_PD_Strategist__c, Participating_Grades__c, Type_of_Attendees__c, Number_of_Attendees__c, Description, Training_Contact__c, Additional_Information__c, Training_Contact_Information__c, Multi_Trainer_Event__c, Multi_Trainer_Event_Details__c, Multi_Trainer_Event_Lead__c, PLS_Confirmation_status__c, Digital_Experience_IC__c, Digital_Entitlement_Licenses__c, Trainer__c, Virtual_Training_Link__c, Training_Location__c, Shipping_Street__c, Shipping_City__c, Shipping_Postal_Code__c, Shipping_State__c, Shipping_Country__c, Shipping_Status__c, Special_Shipping_Instructions__c FROM ServiceAppointment WHERE Status = \'' + statusfilter + '\' AND Work_Order__c = \'' + workOrder + '\' AND AccountId = \'' + accountId + '\' AND Product_Family__c LIKE \'%' + productFamily + '%\' LIMIT :limitSize OFFSET :offset';
           }
   
           List<ServiceAppointment> records = Database.query(query);
           return records;
           //WHERE Work_Order__r.Id = :workOrder AND Status = :statusfilter
        //try {
        //    return [SELECT AppointmentNumber, AccountId, Status, Schedulers_Status__c, Date_to_Schedule__c, Work_Order__c, Preferred_Training_Date_1__c, Required_Local_Start_Time__c, Required_Local_End_Time__c, Session_Topic__c, Subject, Required_Skills__c, Session_Value__c, Training_Type__c, Assigned_PD_Strategist__c, Participating_Grades__c, Type_of_Attendees__c, Number_of_Attendees__c, Description, Training_Contact__c, Additional_Information__c, Training_Contact_Information__c, Multi_Trainer_Event__c, Multi_Trainer_Event_Details__c, Multi_Trainer_Event_Lead__c, PLS_Confirmation_status__c, Digital_Experience_IC__c, Digital_Entitlement_Licenses__c, Trainer__c, Virtual_Training_Link__c, Training_Location__c, Shipping_Street__c, Shipping_City__c, Shipping_Postal_Code__c, Shipping_State__c, Shipping_Country__c, Shipping_Status__c, Special_Shipping_Instructions__c FROM ServiceAppointment LIMIT :limitSize OFFSET :offset ];
        //} catch (Exception e) {
        //    throw new AuraHandledException(e.getMessage());
        //}
    }

    @AuraEnabled(Cacheable=true)
    public static List<Account> getAccounts(){
        return [SELECT Id, Name FROM Account];
    }
}