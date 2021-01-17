import { Component, OnInit} from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseServiceService } from '.././services/firebase-service.service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-operaciones',
  templateUrl: './operaciones.component.html',
  styleUrls: ['./operaciones.component.css']
})
export class OperacionesComponent implements OnInit {
  
  closeResult = '';

  estudianteForm: FormGroup;

  idFirebaseActualizar: string;

  actualizar: boolean;

  constructor(
    private modalService: NgbModal,
    public fb: FormBuilder,
    private firebaseServiceService: FirebaseServiceService
    ) {}

 config:any;
 collection ={ count:20, data: []}
 ngOnInit(): void {
  this.actualizar = false;

  this.idFirebaseActualizar = "";

  this.config ={
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: this.collection.count
  };

  this.estudianteForm = this.fb.group({
 
    id: ['', Validators.required],
    nombre: ['', Validators.required],
    perfume: ['', Validators.required],
  });

  this.firebaseServiceService.getPerfume().subscribe(resp => {
    this.collection.data = resp.map((e: any) =>{
      return {
        id: e.payload.doc.data().id,
        nombre: e.payload.doc.data().nombre,
        perfume: e.payload.doc.data().perfume,
        idfirebase: e.payload.doc.id
      }
    })
  },
  error => {
    console.error(error);
  });
  

 }
 pageChanged(event){
  this.config.currentPage = event;
}

eliminar(item:any): void{
  this.firebaseServiceService.delatePerfume(item.idfirebase);
}

guardarEstudiante (): void{
  this.firebaseServiceService.createPerfume(this.estudianteForm.value).then(resp=>{
   
  this.estudianteForm.reset();
  this.modalService.dismissAll();
  }).catch(error => {
     console.error(error)
  })

}
actualizarEstudiante(){
    if(isNullOrUndefined(this.idFirebaseActualizar)){
      this.firebaseServiceService.updatePerfume( this.idFirebaseActualizar, this.estudianteForm.value).then(resp=>{
        this.estudianteForm.reset();
        this.modalService.dismissAll();
      }).catch(error=>{
        console.error(error);
      });
    }
  }
   
openeditar(content, item:any) {
  this.estudianteForm.setValue({
    id: item.id,
    nombre: item.nombre,
    perfume: item.perfume
  })
  this.idFirebaseActualizar=item.idfirebase
  this.actualizar= true;
  this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });
}


open(content) {
  this.actualizar= false;
  this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });
}

private getDismissReason(reason: any): string {
  if (reason === ModalDismissReasons.ESC) {
    return 'by pressing ESC';
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    return 'by clicking on a backdrop';
  } else {
    return `with: ${reason}`;
  }
}
}
