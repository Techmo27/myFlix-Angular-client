import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditProfileFormComponent } from '../edit-profile-form/edit-profile-form.component';
import { UserRegistrationService } from '../fetch-api-data.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  user: any = localStorage.getItem('username');
  favorites: any = {};

  constructor(
    public fetchApiData: UserRegistrationService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    this.fetchApiData.getUserProfile().subscribe((result: any) => {
      this.user = result;
      this.favorites = result.Favorites;
      console.log(this.user)
      return (this.user, this.favorites);
    });
  }

  openEditProfile(): void {
    this.dialog.open(EditProfileFormComponent, {
      width: '450px'
    });
  }

}
