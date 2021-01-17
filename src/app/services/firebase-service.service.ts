
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseServiceService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  getPerfume(){
  return this.firestore.collection("perfume").snapshotChanges();
  }

  createPerfume(perfumes:any){
    return this.firestore.collection("perfume").add(perfumes);
  }

  updatePerfume(id, perfumes:any){
    return this.firestore.collection("perfume").doc(id).update(perfumes);
  }

  delatePerfume(id:any){
    return this.firestore.collection("perfume").doc(id).delete();
  }
}