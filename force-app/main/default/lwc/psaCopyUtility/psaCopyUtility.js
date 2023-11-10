import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import assignPermissionSets from '@salesforce/apex/permissionSetAssignmentCopy.assignPermissionSets';
import apexSearch from '@salesforce/apex/permissionSetAssignmentCopy.search';
import canRunPermissionSetCopy from '@salesforce/customPermission/Can_Run_Permission_Set_Copy';

export default class PsaCopyUtility extends LightningElement {
    assignFromUserIds = null;
    assignToUserIds = null;
    initialSelection = [];
    copyUtilityResults = [];

    get userMissingPermissions() {
        return canRunPermissionSetCopy ? false : true;
    }

    get hasResults() {
        return this.copyUtilityResults.length > 0;
    }

    handleSearch(event) {
        const lookupElement = event.target;
        apexSearch(event.detail)
        .then(results => {
            lookupElement.setSearchResults(results);
        })
        .catch(error => {
            // TODO: handle error
        });
    }

    handleFromSelectionChange(event) {
        this.assignFromUserIds = event.detail;
    }

    handleToSelectionChange(event) {
        this.assignToUserIds = event.detail;
    }

    handleCopy(event) {
        assignPermissionSets({ assignFromUserIds: this.assignFromUserIds, assignToUserIds: this.assignToUserIds})
            .then(result => {
                this.copyUtilityResults = result;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Processing Complete',
                        message: 'Permission sets were assigned',
                        variant: 'success'
                    })
                );
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Oops!',
                        message: 'It appears something went wrong: ' + error.body.message,
                        variant: 'error'
                    })
                );
            });
    }

    handleOnClear() {
        this.assignFromUsername = null;
        this.assignToUsername = null;
        this.initialSelection = [];
        this.copyUtilityResults = [];
    }

}