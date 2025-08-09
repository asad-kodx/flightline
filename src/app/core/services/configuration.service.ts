export class ConfigurationService {
    public static baseUrl: string = 'https://controltechonline.azurewebsites.net';
    public static fusionLightWebUrl: string = 'https://lite.flightline-control.com';
    public static deviceTokenUrl: string;

    public static oneSignalAppId: string = '15531a83-14dc-42e2-8869-c036dbc5cfd0'; // production
    // public static oneSignalAppId: string = '392f6364-98a4-4c68-9dee-de8b53b99e51'; // test
    public static adminId:string = '04b587d3-28d2-4ee6-ac31-c5d8f68acc20';
    
    //For Remote settings use
    public static constConditionDependentFalse: string = "dependent_false";
    public static constConditionDependentTrue: string = "dependent_true";
    public static constEnabledIfequal: string = "dependent_value_equal";
    public static constEnabledIfNotEqual: string = "dependent_value_not_equal";
    public static constEnabledIfGreaterThan: string = "dependent_value_greater_than";
    public static constEnabledIfLessThan: string = "dependent_value_less_than";
    public static constEnabledIfDifferent: string = "dependent_value_different";
    public static manualFireButtonName: string = "Manual fire";

    constructor() {
        ConfigurationService.deviceTokenUrl = ConfigurationService.baseUrl + '/api/DeviceToken';
    }
}