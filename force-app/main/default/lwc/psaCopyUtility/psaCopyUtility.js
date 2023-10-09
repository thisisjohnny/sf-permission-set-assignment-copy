import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import assignPermissionSets from '@salesforce/apex/permissionSetAssignmentCopy.assignPermissionSets';
import search from '@salesforce/apex/permissionSetAssignmentCopy.search';
import canRunPermissionSetCopy from '@salesforce/customPermission/Can_Run_Permission_Set_Copy';

export default class PsaCopyUtility extends LightningElement {
    assignFromUsername = null;
    assignToUsername = null;
    @track permissionSets;

    get userMissingPermissions() {
        return canRunPermissionSetCopy ? false : true;
    }

    handleOnChange(event) {
        let inputField = event.target.name;
        if (inputField == 'assignFromUsername') {
            this.assignFromUsername = event.target.value;
        } else if (inputField == 'assignToUsername') {
            this.assignToUsername = event.target.value;
        } else {
            console.log('Field: ' + inputField + '; Value: ' + event.target.value);
        }
    }

    handleOnClick(event) {
        assignPermissionSets({ assignFromUsername: this.assignFromUsername, assignToUsername: this.assignToUsername})
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

    handleLookupSearch(event) {
        const searchElement = event.target;
        search(event.detail)
            .then((results) => {
                searchElement.setSearchResults(results);
            })
            .catch((error) => {
                console.error('Search error', JSON.stringify(error));
            });
    }

    handleLookupSelectionChange(event) {
        
    }
}