import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SocketManagerService } from 'src/app/services/socket-manager/socket-manager.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {
  
  
  
  selectedImageFile!: File;

  constructor(private socketMan: SocketManagerService, private dialog: MatDialog) { }
  
  ngOnInit(): void {
  }
  
  
  
  onPostClick(cap: string){
    let reader = new FileReader();
    let input = document.getElementById('photo-upload') as HTMLInputElement;
    let file = input.files![0];

    // let cap = prompt("Add Caption", "caption")

    reader.addEventListener('load', (e) => {
      console.log("adding 1 to posts")
      this.socketMan.emitEvent('create-image', {img: reader.result, owner: localStorage.getItem('login-token'), caption: cap, uploader: localStorage.getItem('login-token')});
      this.socketMan.emitEvent('update-user-stats', {name: localStorage.getItem('login-token'), stat: 'posts'})
      console.log(reader.result)
      this.dialog.closeAll()
      this.socketMan.emitEvent('get-all-image', null);
    })
    reader.readAsDataURL(file);
  }
  
  onPhotoSelected(photoSelector: HTMLInputElement){
    this.selectedImageFile = photoSelector.files![0];
    if(!this.selectedImageFile) return;
    let fileReader = new FileReader();
    fileReader.readAsDataURL(this.selectedImageFile);
    fileReader.addEventListener(
      "loadend",
      ev =>{
        let readableString = fileReader.result!.toString();
        let postPreviewImage = <HTMLImageElement>document.getElementById("post-preview-image")
        postPreviewImage.src = readableString;
      }

    )
  }


}
