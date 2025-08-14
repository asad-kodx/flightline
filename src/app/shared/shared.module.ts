import { CommonModule } from "@angular/common";
import { ComponentsModule } from "./components/components.module";
import { PipesModule } from "./pipes/pipes.module";
import { NgModule } from "@angular/core";

const modules: any[] = [CommonModule, ComponentsModule, PipesModule];

@NgModule({
    declarations: [],
    imports: [...modules],
    exports: [...modules],
})
export class SharedModule { }