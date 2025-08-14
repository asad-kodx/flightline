import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { AlarmCountComponent } from "./alarm-count/alarm-count.component";
import { CommonModule } from "@angular/common";
import { NO_ERRORS_SCHEMA } from "@angular/compiler";
import { IonicModule } from "@ionic/angular";
import { ControlComponent } from "./control/control.component";

const components = [AlarmCountComponent, ControlComponent];

@NgModule({
    declarations: [...components],
    imports: [CommonModule, IonicModule],
    exports: [...components],
})
export class ComponentsModule { }