public with sharing class permissionSetAssignmentCopy {
    @AuraEnabled
    public static List<String> assignPermissionSets(List<String> assignFromUserIds, List<String> assignToUserIds){
        List<String> listErrors = new List<String>();

        Id assignFromId = Id.valueOf(assignFromUserIds.get(0));
        Id assignToId   = Id.valueOf(assignToUserIds.get(0));

        List<PermissionSetAssignment> psaList       = new List<PermissionSetAssignment>([SELECT PermissionSetId, PermissionSet.Label FROM PermissionSetAssignment WHERE AssigneeId = :assignFromId]);
        List<PermissionSetAssignment> psaNewList    = new List<PermissionSetAssignment>();
        for (PermissionSetAssignment psa : psaList) {
            PermissionSetAssignment psaNew = new PermissionSetAssignment(
                AssigneeId      = assignToId,
                PermissionSetId = psa.PermissionSetId
            );
            psaNewList.add(psaNew);
        }
        
        Database.SaveResult[] srList = Database.insert(psaNewList, false);
        for (Database.SaveResult sr : srList) {
            if (!sr.isSuccess()) {
                // if not successful, capture error inforamtion to return to the component
                for (Database.Error err : sr.getErrors()) {
                    listErrors.add(err.getStatusCode() + ': ' + err.getMessage());
                }
            }
        }

        return listErrors;
    }

    @AuraEnabled(cacheable=true scope='global')
    public static List<LookupSearchResult> search(String searchTerm, List<String> selectedIds){
        /*
            • this copy utility leverages the sfdc-ui-lookup-lwc component: https://github.com/pozil/sfdc-ui-lookup-lwc/tree/master
            • references in this search method (e.g. LookupSearchResult) are to the included Apex controller for the component
            • as a pre-requisite to using this component, ensure the above referenced LWC has been installed in the destination org
        */

        Integer MAX_RESULTS = 5;
        // append * wildcard to search for SOSL query
        searchTerm += '*';

        try {
            // execute search query
            List<List<Sobject>>         searchResults = [FIND :searchTerm IN ALL FIELDS RETURNING User(Id, Name, Email, Username WHERE id NOT IN :selectedIds) LIMIT :MAX_RESULTS];
            // prep search results
            List<LookupSearchResult>    results = new List<LookupSearchResult>();

            // extract user results and convert them into LookupSearchResult format
            String userIcon = 'standard:user';
            User[] users    = (List<User>) searchResults[0];
            for (User u : users) {
                String subtitle = 'User • ' + u.Username;
                results.add(new LookupSearchResult(u.Id, 'User', userIcon, u.Name, subtitle));
            }

            // return results
            return results;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
