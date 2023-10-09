public with sharing class permissionSetAssignmentCopy {
    @AuraEnabled
    public static List<PermissionSetAssignment> assignPermissionSets(String assignFromUsername, String assignToUsername){
        User assignFromUser = [SELECT Id FROM User WHERE Username = :assignFromUsername];
        User assignToUser   = [SELECT Id FROM User WHERE Username = :assignToUsername];

        Id assignFromId     = assignFromUser.Id;
        Id assignToId       = assignToUser.Id;

        List<PermissionSetAssignment> psaList       = new List<PermissionSetAssignment>([SELECT PermissionSetId FROM PermissionSetAssignment WHERE AssigneeId = :assignFromId]);
        List<PermissionSetAssignment> psaNewList    = new List<PermissionSetAssignment>();
        for (PermissionSetAssignment psa : psaList) {
            PermissionSetAssignment psaNew = new PermissionSetAssignment(
                AssigneeId      = assignToId,
                PermissionSetId = psa.PermissionSetId
            );
            psaNewList.add(psaNew);
        }
        
        Database.SaveResult[] srList = Database.insert(psaNewList, false);

        return [SELECT Id, PermissionSetId, PermissionSet.Name FROM PermissionSetAssignment WHERE AssigneeId = :assignToId];
    }

    @AuraEnabled(cacheable=true scope='global')
    public static List<User> search(String searchTerm){
        // append * wildcard to search for SOSL query
        searchTerm += '*';

        try {
            // execute search
            List<List<Sobject>> searchResults = [FIND :searchTerm IN ALL FIELDS RETURNING User(Id, Name, Email) LIMIT 3];
            List<User> userList = (List<User>) searchResults[0];

            // return results
            return userList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
