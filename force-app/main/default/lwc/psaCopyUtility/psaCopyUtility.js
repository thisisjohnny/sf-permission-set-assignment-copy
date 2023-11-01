import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import assignPermissionSets from '@salesforce/apex/permissionSetAssignmentCopy.assignPermissionSets';
import apexSearch from '@salesforce/apex/permissionSetAssignmentCopy.search';
import canRunPermissionSetCopy from '@salesforce/customPermission/Can_Run_Permission_Set_Copy';

export default class PsaCopyUtility extends LightningElement {
    assignFromUserIds = null;
    assignToUserIds = null;
    @track permissionSets;

    get userMissingPermissions() {
        return canRunPermissionSetCopy ? false : true;
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
        console.log('JAWN ' + this.assignFromUserIds + '; Type: ' + typeof this.assignFromUserIds);
    }

    handleToSelectionChange(event) {
        this.assignToUserIds = event.detail;
    }

    handleCopy(event) {
        assignPermissionSets({ assignFromUsername: this.assignFromUserId, assignToUsername: this.assignToUsername})
            .then(result => {
                this.permissionSets = result;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Processing Complete',
                        message: 'Permission sets were assigned',
                        variant: 'success'
                    })
                );
                this.handleOnCancel();
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

    handleOnCancel() {
        this.assignFromUsername = null;
        this.assignToUsername = null;
    }

}