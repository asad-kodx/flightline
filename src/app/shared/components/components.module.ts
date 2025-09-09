import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { AlarmCountComponent } from "./alarm-count/alarm-count.component";
import { CommonModule } from "@angular/common";
import { NO_ERRORS_SCHEMA } from "@angular/compiler";
import { IonicModule } from "@ionic/angular";
import { ControlComponent } from "./control/control.component";
import { SlidingFooterComponent } from './sliding-footer/sliding-footer.component';
import { EntityComponent } from './entity/entity.component';
import { PipesModule } from "../pipes/pipes.module";

const components = [AlarmCountComponent, ControlComponent, SlidingFooterComponent, EntityComponent];

@NgModule({
    declarations: [...components],
    imports: [CommonModule, IonicModule, PipesModule],
    exports: [...components],
})
export class ComponentsModule { }