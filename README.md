# Permission Set Assignment Copy Utility

This [LWC](https://developer.salesforce.com/docs/component-library/documentation/lwc) will allow the running user (with the proper permissions) to easily copy Permission Set Assignments from one user to another.

![Screenshot of component included on a Lightning Home Page](/images/component.png)

## What To Do

### Dependencies
This copy utility leverages the [sfdc-ui-lookup-lwc](https://github.com/pozil/sfdc-ui-lookup-lwc/tree/master) component by Philippe Ozil. Before installing this package, you must follow the installation steps for Philippe's component. (It is not required to install the sample application included.)

### Deploy this package

1. Deploy this package to your Salesforce environment, use the [Salesforce DX Public Deployer](https://hosted-scratch.herokuapp.com/byoo?template=https://github.com/thisisjohnny/sf-permission-set-copy) and choose the option best for you
2. Assign the included permission set to any users needing access to the component
3. Add the component to any Lightning Home Page, App Page, Tab, or Utility Bar
4. Visit the page or utility bar item and enter in values for both the assign from user and assign to user
5. Click _Copy Permission Sets_

## Caveats
*This package is provided without warranty or gaurantee.*

This package is provided without warranty. This package may not work in your environment and requires other dependendies. This software has not been fully tested nor developed with strict security and access controls in mind. By installing this package in your org, you assume all risk of consequences and agree not to hold myself or my employer liable.

----
_Made with_ 🎧 _in Reston_