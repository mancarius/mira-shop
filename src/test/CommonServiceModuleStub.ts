import { NgModule } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFirestoreStub } from "./AngularFirestoreStub/AngularFirestoreStub";

@NgModule({
    providers: [{provide: AngularFirestore, useClass: AngularFirestoreStub}]
})
export class CommonServiceModuleStub {}