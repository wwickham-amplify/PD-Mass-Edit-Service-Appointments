@isTest
public class ServiceAppointmentMassEditControllerTest {
	@isTest
    static void testUpdateRecords() {
        Pricebook2 pb = new Pricebook2(Name = 'Test Price Book', IsActive = true);
        insert pb;
     
        WorkOrder testWorkOrder = new WorkOrder(Pricebook2Id = pb.Id);
        insert testWorkOrder;

        Product2 prod = new Product2(Name = 'Test Product', IsActive = true, ProductCode = 'CODE1', Product_Category__c = 'Professional Services');
        insert prod;
        
        PricebookEntry pbe = new PricebookEntry(
            Product2Id = prod.Id,
            Pricebook2Id = pb.Id,
            UnitPrice = 100,
            IsActive = true
        );
        insert pbe;
        
        WorkOrderLineItem testWorkOrderLineItem = new WorkOrderLineItem(WorkOrderId = testWorkOrder.Id, PricebookEntryId = pbe.Id);
        insert testWorkOrderLineItem;
        
        System.debug(testWorkOrder.Id);
        System.debug(testWorkOrderLineItem.Id);
        
        List<ServiceAppointment> testServiceAppointments = new List<ServiceAppointment>();
        for(Integer i = 0; i < 1; i++) {
            testServiceAppointments.add(new ServiceAppointment(Status = 'New',	EarliestStartTime = Datetime.newInstance(2024, 3, 19, 10, 30, 0), 
            DueDate = Datetime.newInstance(2024, 3, 20, 10, 30, 0), ParentRecordId = testWorkOrder.Id, 	Work_Order__c = testWorkOrder.Id, Expiry_Date__c = Date.today()));
        }
        insert testServiceAppointments;

        // Call the Aura-enabled method
        List<ServiceAppointmentMassEditController.UpdateResultWrapper> returnedErrors = ServiceAppointmentMassEditController.updateRecords(testServiceAppointments);

        // Assert that the method returns the expected number of records
        //System.assertEquals(5, returnedAccounts.size());

        // Assert that the records retrieved have the expected fields (Id and Name)
        //for(Account acc : returnedAccounts) {
        //    System.assertNotEquals(null, acc.Id);
        //    System.assertNotEquals(null, acc.Name);
        //}
    }
    
    @isTest
    static void testGetServiceAppointments() {

        List<ServiceAppointment> testAppointments = [SELECT AppointmentNumber, AccountId, SchedStartTime, Training_Location_Status__c, Scheduled_Customer_Start__c, Training_Product_Delivered__c, Work_Order_Line_Item__c, SA_Notes__c, Status, Schedulers_Status__c, Product_Family__c, Date_to_Schedule__c, Work_Order__c, Preferred_Training_Date_1__c, Trainer_Mass_Assign__c, Required_Local_Start_Time__c, Required_Local_End_Time__c, Session_Topic__c, Subject, Required_Skills__c, Session_Value__c, Training_Type__c, Assigned_PD_Strategist__c, Participating_Grades__c, Type_of_Attendees__c, Number_of_Attendees__c, Description, Training_Contact__c, Additional_Information__c, Training_Contact_Information__c, Multi_Trainer_Event__c, Multi_Trainer_Event_Details__c, Multi_Trainer_Event_Lead__c, PLS_Confirmation_status__c, Digital_Experience_IC__c, Digital_Entitlement_Licenses__c, Trainer__c, Virtual_Training_Link__c, Training_Location__c, Shipping_Street__c, Shipping_City__c, Shipping_Postal_Code__c, Shipping_State__c, Shipping_Country__c, Shipping_Status__c, Special_Shipping_Instructions__c FROM ServiceAppointment LIMIT 5];
 
        System.debug('Length of testAppointments (before insertion): ' + testAppointments.size());
        
        // Insert the testAppointments
        try {
            insert testAppointments;
        } catch (DmlException e) {
            System.debug('Error inserting testAppointments: ' + e);
        }

        System.debug('Length of testAppointments (after insertion): ' + testAppointments.size());

        List<ServiceAppointment> returnedAppointments = ServiceAppointmentMassEditController.getServiceAppointments(100, '0018000000M3mmkAAB', 0, 'New', '0WO2H0000000L7uWAE', 'Amplify Science');
        
        List<ServiceAppointment> returnedSAppointments = ServiceAppointmentMassEditController.getServiceAppointments(100, '', 0, '', '', '');

    }
}