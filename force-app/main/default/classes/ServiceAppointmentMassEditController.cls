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
}